import { scripts as assetsPath, version } from "./constants.ts";
import { createCache, extname, serve } from "./deps.ts";
import { isDev, port } from "./env.ts";
import { readImportmap } from "./importmap.ts";
import preloader, { microloader } from "./preloader.ts";
import render from "./render.tsx";
import transform from "./transform.ts";
import { readTSConfig, TSConfig } from "./tsconfig.ts";

interface Options {
  /** @default './importmap.json' */
  importmap?: string;
  /** @default './tsconfig.json' */
  tsconfig?: string;
  dir?: string;
  root?: string;
}

const cache = createCache();

const allowedExtensions = new Set([".ts", ".tsx"]);

const withLogger = (cb: (url: URL, ...args: any) => Promise<Response> | Response) => async (url: URL, ...args: any) => {
  const start = performance.now()
  const response = await cb(url, ...args)
  const duration = (performance.now() - start).toFixed(0)
  
  console.info(`[${response.status}] ${duration}ms ${url.pathname}`)

  return response
}

const assets = async (url: URL, dir: string, tsconfig: TSConfig, importmap: Deno.ImportMap) => {  
  const path = url.pathname.replace(assetsPath, "");
  const ext = extname(path);

  if (!allowedExtensions.has(ext)) {
    throw new Error(`Uknown extension ${ext}. Please use .ts or .tsx`);
  }

  try {
    const transpiled = await transform({
      filepath: `${dir}${path}`,
      tsconfig,
      importmap
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

const html = async (url: URL, importmap: Deno.ImportMap, link: string) => {
  const { stream, status } = await render({ url, importmap });

  return new Response(
    stream,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        link,
        "cache-control": "public, max-age=0, must-revalidate",
        "x-powered-by": `Micro v${version}`,
      },
    },
  );
};

const server = async (
  {
    tsconfig = './tsconfig.ts',
    importmap = "./importmap.json",
    dir = "src",
    root = "http://localhost:3000",
  }: Options,
) => {
  const importmapJson = await readImportmap(importmap);
  const tsconfigJson = await readTSConfig(tsconfig);

  const link = microloader({ importmap: importmapJson });

  const handler = (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith(assetsPath)) {
      return withLogger(assets)(url, dir, tsconfigJson, importmapJson);
    } else {
      return withLogger(html)(url, importmapJson, link);
    }
  };

  console.log(`Micro running ${root}`);
  return serve(handler, { port: Number(port) });
};

export default server;
