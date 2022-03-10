import { Assets } from "../assets.ts";
import { headers, httpAssetsRoot as assetsPath, isDev } from "../constants.ts";
import { link as linkHeader } from "../preloader.ts";

export const handler = async (url: URL, assets: Assets) => {
  const filepath = url.pathname.replace(assetsPath, "");

  const [
    { stream, status },
    { dependencies = [] },
  ] = await Promise.all([
    assets.fetch(filepath),
    assets.meta(filepath),
  ]);

  const link = linkHeader(dependencies, url.pathname);

  return new Response(stream, {
    status,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      link,
      "cache-control": isDev
        ? "no-cache, no-store"
        : "public, max-age=31536000, immutable",
      ...headers,
    },
  });
};
