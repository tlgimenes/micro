import { Assets } from "../assets.ts";
import { headers, httpAssetsRoot as assetsPath, isDev } from "../constants.ts";
import { link as linkHeader } from "../preloader.ts";

const production = async (url: URL, assets: Assets) => {
  const filepath = url.pathname.replace(assetsPath, "");

  const [
    { stream, status }, 
    { dependencies = [] }
  ] = await Promise.all([
    assets.fetch(filepath),
    assets.meta(filepath),
  ]);

  const link = linkHeader(dependencies, url.pathname);

  return new Response(stream, {
    status,
    headers: {
      ...headers,
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
      link,
    },
  });
};

const development = async (url: URL, assets: Assets) => {
  const cacheBustedPath = new RegExp(`${assetsPath}/[a-zA-Z0-9]+`)
  const filepath = url.pathname.replace(cacheBustedPath, "");

  const {
    code,
    metadata: { dependencies = [] },
  } = await assets.transform(filepath);

  const link = linkHeader(dependencies, url.pathname);

  return new Response(code, {
    headers: {
      ...headers,
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-cache, no-store",
      link,
    },
  });
};

export const handler = isDev ? development : production;
