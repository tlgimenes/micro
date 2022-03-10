import { path } from "../../deps.ts";
import { cache } from "../cache.ts";
import { headers, httpAssetsRoot as assetsPath, isDev } from "../constants.ts";
import { link as linkHeader } from "../preloader.ts";
import { MicroConfig } from "./../config.ts";
import { getTransform } from "./../transform/index.ts";

export const handler = (config: MicroConfig) => {
  const transform = getTransform(config);
  const regex = isDev
    ? new RegExp(`${assetsPath}/[a-zA-Z0-9]+`)
    : new RegExp(`${assetsPath}/${cache.version()}`); // on production, we can not accept any random version

  const cacheControl = isDev
    ? "no-cache, no-store"
    : "public, max-age=31536000, immutable";

  return async (url: URL) => {
    const relative = url.pathname.replace(regex, "");
    const absolute = path.join(config.root, relative);

    try {
      const {
        code,
        metadata: { dependencies = [] },
      } = await transform(absolute);

      const link = linkHeader(dependencies, url.pathname);

      return new Response(code, {
        headers: {
          ...headers,
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": cacheControl,
          link,
        },
      });
    } catch (_) {
      return new Response(null, {
        status: 404,
        headers: {
          ...headers,
          "cache-control": cacheControl,
        },
      });
    }
  };
};
