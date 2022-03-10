import { colors, mime, path, serve as stdServe } from "../../deps.ts";
import { getAssets } from "../assets.ts";
import { httpAssetsRoot as assetsPath, isDev } from "../constants.ts";
import { handler as assetsHandler } from "../handlers/assets.ts";
import { handler as htmlHandler } from "../handlers/html.tsx";
import { handler as publicHandler } from "../handlers/public.ts";
import { readImportmap } from "../importmap.ts";
import { readTSConfig } from "../tsconfig.ts";

interface Options {
  /** @default './importmap.json' */
  importmap?: string;
  /** @default './tsconfig.json' */
  tsconfig?: string;
  root?: string;
  host?: string;
}

export const serve = async ({
  tsconfig = "./tsconfig.json",
  importmap = "./importmap.json",
  root = "./",
  host = "http://localhost:3000",
}: Options) => {
  const absoluteRoot = path.resolve(root);

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
    assets.watch();
  }

  const handler = async (request: Request) => {
    const start = performance.now();

    const url = new URL(request.url);
    const contentType = mime.lookup(url.pathname);

    const response = url.pathname.startsWith(assetsPath)
      ? await assetsHandler(url, assets)
      : contentType === false || contentType === "text/html"
      ? await htmlHandler(url, assets)
      : await publicHandler(url, absoluteRoot);

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
  return stdServe(handler, { port: Number(port), hostname });
};
