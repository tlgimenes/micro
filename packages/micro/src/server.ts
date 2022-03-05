import { assets as assetsPath, version } from "./constants.ts";
import { createCache, extname, serve } from "./deps.ts";
import { isDev, port } from "./env.ts";
import preloader, { microloader } from "./preloader.ts";
import render from "./render.tsx";
import transform from "./transform.ts";
import type { Importmap } from "./importmap.ts";

import type { Options as RenderOptions } from "./render.tsx";

interface Options {
  importmap: RenderOptions["importmap"];
  dir?: string;
  root?: string;
}

const cache = createCache();

const allowedExtensions = new Set([".ts", ".tsx"]);

const assets = async (url: URL, dir: string) => {
  const path = url.pathname.replace(assetsPath, "");
  const ext = extname(path);

  if (!allowedExtensions.has(ext)) {
    throw new Error(`Uknown extension ${ext}. Please use .ts or .tsx`);
  }

  try {
    const transpiled = await transform({
      source: await Deno.readTextFile(`${dir}${path}`),
      loader: ext === ".ts" ? "ts" : "tsx",
    });

    const link = await preloader(
      path,
      cache,
      `file://${Deno.cwd()}/${dir}`,
    );

    return new Response(transpiled, {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        link,
        "cache-control": isDev
          ? "no-cache, no-store"
          : "public, max-age=31536000, immutable",
        "x-powered-by": `Micro v${version}`,
      },
    });
  } catch (err) {
    console.error(err);
  }

  return new Response(null, {
    status: 404,
  });
};

const html = (url: URL, importmap: Importmap, link: string) => {
  const stream = render({ url, importmap });

  return new Response(
    stream,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        link,
        "cache-control": 'public, max-age=0, must-revalidate',
        "x-powered-by": `Micro v${version}`,
      },
    },
  );
};

const server = (
  {
    importmap,
    dir = "src",
    root = "http://localhost:3000",
  }: Options,
) => {
  const link = microloader({ importmap });

  const handler = (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith(assetsPath)) {
      return assets(url, dir);
    } else {
      return html(url, importmap, link);
    }
  };

  console.log(`Micro running ${root}`);
  return serve(handler, { port: Number(port) });
};

export default server;
