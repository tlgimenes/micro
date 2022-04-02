import { ImageScript, mime } from "../../deps.ts";
import { headers } from "../constants.ts";
import { MicroConfig } from "./../config.ts";
import { urlFromRequest } from "./../utils.ts";

const MIME = {
  JPEG: "image/jpeg",
  PNG: "image/png",
  TIFF: "image/tiff",
  WEBP: "image/webp",
  IMAGE: "image/*",
  ALL: "*/*",
} as const;

const SUPPORTED_FORMATS = {
  decode: new Set<string>([MIME.PNG, MIME.JPEG, MIME.TIFF]),
  encode: new Set<string>([MIME.PNG, MIME.JPEG]),
};

interface TransformOptions {
  width: number;
  height: number;
  format: typeof MIME.WEBP | typeof MIME.JPEG | typeof MIME.PNG;
  quality: number;
}

const transform = async (
  data: Uint8Array,
  { width, height, format, quality }: TransformOptions,
): Promise<Uint8Array> => {
  const img = await ImageScript.Image.decode(data);

  const aspect = img.width / img.height;
  const finalWidth = width / aspect;
  const finalHeight = height * aspect;

  if (finalWidth < finalHeight) {
    img.resize(width, width / aspect);
  }

  if (finalHeight >= finalWidth) {
    img.resize(height * aspect, height);
  }

  // Center image
  const xoffset = (img.width - width) / 2;
  const yoffset = (img.height - height) / 2;

  img.crop(xoffset, yoffset, width, height);

  if (format === MIME.PNG) {
    return img.encode();
  }

  if (format === MIME.JPEG) {
    return img.encodeJPEG(quality);
  }

  // TODO: Uncomment when encoder supports webp
  // if (format === MIME.WEBP) {
  //   return img.encodeWEBP(90);
  // }

  throw new Error(`Unsupported format by server: ${format}`);
};

const formatFromAccept = (request: Request) => {
  const accepted = new Set(
    request.headers.get("accept")?.toLowerCase().split(",").map((s) =>
      s.split(";")[0]
    ),
  );

  // TODO: Uncomment when encoder supports webp
  // if ([MIME.WEBP, MIME.IMAGE, MIME.ALL].some(accepted.has.bind(accepted))) {
  //   return MIME.WEBP;
  // }

  if ([MIME.JPEG, MIME.IMAGE, MIME.ALL].some(accepted.has.bind(accepted))) {
    return MIME.JPEG;
  }

  return MIME.PNG;
};

const optionsFromRequest = (request: Request) => {
  const url = urlFromRequest(request);
  const width = Number(url.searchParams.get("width"));
  const height = Number(url.searchParams.get("height"));
  const src = new URL(url.searchParams.get("src") ?? "").href;
  const quality = Number(url.searchParams.get("quality") ?? "90");

  if (typeof width !== "number" || typeof height !== "number") {
    throw new Error(
      `Dimensions needs to be a number. Add width and height params`,
    );
  }

  const srcFormat = mime.lookup(src) || "";
  if (!SUPPORTED_FORMATS.decode.has(srcFormat)) {
    throw new Error(
      `Unsupported original image format: ${srcFormat}. Accepted formats are: ${[
        ...SUPPORTED_FORMATS.decode.values(),
      ]}`,
    );
  }

  return {
    width,
    height,
    src,
    quality,
  };
};

const fetchImage = async (src: string) => {
  const response = await fetch(src);
  const buffer = await response.arrayBuffer();

  return new Uint8Array(buffer);
};

export const handler = (_: MicroConfig) => {
  return async (request: Request) => {
    try {
      const { width, height, src, quality } = optionsFromRequest(request);

      const format = formatFromAccept(request);

      const data = await fetchImage(src);
      const transformed = await transform(data, {
        width,
        height,
        quality,
        format,
      });

      return new Response(transformed, {
        status: 200,
        headers: {
          ...headers,
          "vary": "accept",
          "content-type": format,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    } catch (err) {
      console.error(err);

      return new Response(err.message ?? "Bad Request", {
        status: 400,
        headers: {
          ...headers,
          "cache-control": "public, max-age=0, must-revalidate",
        },
      });
    }
  };
};
