import { colors, mime, serve as stdServe } from "./../deps.ts";
import { getConfig } from "./config.ts";
import { httpAssetsRoot, wsRefreshRoot } from "./constants.ts";
import { handler as assetsHandler } from "./handlers/assets.ts";
import { handler as errorHandler } from "./handlers/error.ts";
import { handler as htmlHandler } from "./handlers/html.tsx";
import { handler as publicHandler } from "./handlers/public.ts";
import { handler as refreshHandler } from "./handlers/refresh.ts";
import { handler as componentsHandler } from "./handlers/components.tsx";

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
  const config = await getConfig(
    root,
    host,
    importmap,
    tsconfig,
  );

  const [
    assets,
    html,
    files,
    refresh,
    components,
  ] = await Promise.all([
    assetsHandler(config),
    htmlHandler(config),
    publicHandler(config),
    refreshHandler(config),
    componentsHandler(config),
  ]);

  const handler = async (request: Request) => {
    const start = performance.now();

    const url = new URL(request.url);
    const contentType = mime.lookup(url.pathname);

    const response = url.pathname.endsWith(wsRefreshRoot)
      ? refresh(request)
      : url.pathname.startsWith(httpAssetsRoot)
      ? await assets(url).catch(errorHandler)
      : url.pathname.endsWith("/__micro/components")
      ? await components(url).catch(errorHandler)
      : contentType === false || contentType === "text/html"
      ? await html(url).catch(errorHandler)
      : await files(url).catch(errorHandler);

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
