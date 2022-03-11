import { path } from "../../deps.ts";
import { headers, httpAssetsRoot as assetsPath, isDev } from "../constants.ts";
import { link as linkHeader } from "../preloader.ts";
import { MicroConfig } from "./../config.ts";
import { getTransform } from "./../transform/index.ts";
import { transform as componentTransform } from "../transform/component.ts";

export const handler = (config: MicroConfig) => {
  const babelTransform = getTransform(config);
  const rootRegExp = new RegExp(`${assetsPath}/(client|server)/[a-zA-Z0-9]+/`);
  const isServer = new RegExp(`${assetsPath}/server/[a-zA-Z0-9]+/`);
  const isClientComponent = new RegExp(".client.ts(x)?$");

  const useComponentTransform = (path: string) =>
    isServer.test(path) && isClientComponent.test(path);

  const cacheControl = isDev
    ? "no-cache, no-store"
    : "public, max-age=31536000, immutable";

  return async (url: URL) => {
    const relative = url.pathname.replace(rootRegExp, "");
    const absolute = path.join(config.root, relative);

    const transformer = useComponentTransform(url.pathname)
      ? componentTransform
      : babelTransform;

    console.log(url.pathname, useComponentTransform(absolute))

    try {
      const {
        code,
        metadata: { dependencies = [] },
      } = await transformer(absolute);

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
