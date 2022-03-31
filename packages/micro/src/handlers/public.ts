import { mime, path, readableStreamFromReader } from "../../deps.ts";
import { headers } from "../constants.ts";
import { urlFromRequest } from "../utils.ts";
import { MicroConfig } from "./../config.ts";

export const handler = (config: MicroConfig) => {
  const root = path.join(config.root, "public");

  return async (request: Request) => {
    try {
      const url = urlFromRequest(request);
      const fd = await Deno.open(path.join(root, url.pathname));
      const stream = readableStreamFromReader(fd);
      const contentType = mime.lookup(url.pathname);

      return new Response(stream, {
        headers: {
          "cache-control": "public, max-age=0, must-revalidate",
          ...contentType && { "content-type": contentType },
          ...headers,
        },
      });
    } catch (err) {
      console.error(err);

      return new Response(null, {
        status: 404,
        headers: {
          "cache-control": "public, max-age=0, must-revalidate",
          ...headers,
        },
      });
    }
  };
};
