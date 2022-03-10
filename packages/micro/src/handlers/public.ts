import { mime, path, readableStreamFromReader } from "../../deps.ts";
import { headers } from "../constants.ts";

export const handler = async (url: URL, root: string) => {
  try {
    const fd = await Deno.open(path.join(root, 'public', url.pathname));
    const stream = readableStreamFromReader(fd);
    const contentType = mime.lookup(url.pathname);

    return new Response(stream, {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
        ...contentType && { "content-type": contentType },
        ...headers,
      },
    });
  } catch (_) {
    return new Response(null, {
      status: 404,
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
        ...headers,
      },
    });
  }
};
