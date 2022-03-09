import { Assets, getAssets } from "./assets.ts";
import { assets as assetsPath, headers } from "./constants.ts";
import { colors, join, resolve, serve } from "./deps.ts";
import { isDev } from "./env.ts";
import { readImportmap } from "./importmap.ts";
import { link as linkHeader } from "./preloader.ts";
import render from "./render.tsx";
import { readTSConfig } from "./tsconfig.ts";

interface Options {
  /** @default './importmap.json' */
  importmap?: string;
  /** @default './tsconfig.json' */
  tsconfig?: string;
  root?: string;
  host?: string;
}

const assetsHandler = async (url: URL, assets: Assets) => {
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

const htmlHandler = async (
  url: URL,
  assets: Assets,
) => {
  const entrypoint = 'App.client.tsx'

  const [
    { stream, status },
    { dependencies = [] },
  ] = await Promise.all([
    render({ url, assets }),
    assets.meta(entrypoint),
  ]);

  const link = linkHeader(dependencies, join(assetsPath, entrypoint));

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

  const assets = getAssets({
    root: absoluteRoot,
    importmap: importmapJson,
    tsconfig: tsconfigJson,
  });

  await assets.pack();

  if (isDev) {
    assets.watch()
  }

  const handler = async (request: Request) => {
    const start = performance.now();

    const url = new URL(request.url);
    const response = url.pathname.startsWith(assetsPath)
      ? await assetsHandler(url, assets)
      : await htmlHandler(url, assets);

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

    console.info(
      `[${statusText}] ${durationText} ${colors.white(url.pathname)}`,
    );

    return response;
  };

  const { hostname, port } = new URL(host);
  console.log(`Micro running ${colors.cyan(host)}`);
  return serve(handler, { port: Number(port), hostname });
};

export default server;
