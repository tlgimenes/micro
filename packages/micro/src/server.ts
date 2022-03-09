import { build, serve as serveAssets } from "./assets.ts";
import { assets as assetsPath, headers } from "./constants.ts";
import { colors, createCache, resolve, serve } from "./deps.ts";
import { isDev } from "./env.ts";
import { readImportmap } from "./importmap.ts";
import preloader, { microloader } from "./preloader.ts";
import render from "./render.tsx";
import getTransformer from "./transform.ts";
import { readTSConfig } from "./tsconfig.ts";

interface Options {
  /** @default './importmap.json' */
  importmap?: string;
  /** @default './tsconfig.json' */
  tsconfig?: string;
  root?: string;
  host?: string;
}

const cache = createCache();

const withLogger = (
  cb: (url: URL, ...args: any) => Promise<Response> | Response,
) =>
  async (url: URL, ...args: any) => {
    const start = performance.now();
    const response = await cb(url, ...args);
    const duration = performance.now() - start;
    const status = response.status;

    const statusText = status < 300
      ? colors.green(status.toString())
      : colors.red(status.toString());

    const durationText = duration < 150
      ? colors.cyan(`${duration.toFixed(0)}ms`)
      : duration < 300
      ? colors.yellow(`${duration.toFixed(0)}ms`)
      : colors.red(`${duration.toFixed(0)}ms`);

    const pathname = colors.white(url.pathname);

    console.info(`[${statusText}] ${durationText} ${pathname}`);

    return response;
  };

const assets = async (url: URL, root: string) => {
  const { stream, status } = await serveAssets(root, url);

  return new Response(stream, {
    status,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      // link,
      "cache-control": isDev
        ? "no-cache, no-store"
        : "public, max-age=31536000, immutable",
      ...headers,
    },
  });
};

const html = async (url: URL, importmap: Deno.ImportMap, link: string, root: string) => {
  const { stream, status } = await render({ url, importmap, root });

  return new Response(stream, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      link,
      "cache-control": "public, max-age=0, must-revalidate",
      ...headers,
    },
  });
};

const server = async ({
  tsconfig = "./tsconfig.ts",
  importmap = "./importmap.json",
  root = "./src",
  host = "http://localhost:3000",
}: Options) => {
  const absoluteRoot = resolve(root);

  const [importmapJson, tsconfigJson] = await Promise.all([
    readImportmap(importmap),
    readTSConfig(tsconfig),
  ]);

  const transform = getTransformer({
    importmap: importmapJson,
    tsconfig: tsconfigJson,
  });

  await build(absoluteRoot, transform);

  const link = microloader({ importmap: importmapJson });

  const handler = (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith(assetsPath)) {
      return withLogger(assets)(url, absoluteRoot);
    } else {
      return withLogger(html)(url, importmapJson, link, absoluteRoot);
    }
  };

  const { hostname, port } = new URL(host);
  console.log(`Micro running ${colors.cyan(host)}`);
  return serve(handler, { port: Number(port), hostname });
};

export default server;
