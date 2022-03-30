import { colors, mime, serve as stdServe } from "./deps.ts";
import { getConfig } from "./src/config.ts";
import { httpAssetsRoot, wsRefreshRoot } from "./src/constants.ts";
import { handler as assetsHandler } from "./src/handlers/assets.ts";
import { handler as errorHandler } from "./src/handlers/error.ts";
import { handler as htmlHandler } from "./src/handlers/html.tsx";
import { handler as publicHandler } from "./src/handlers/public.ts";
import { handler as refreshHandler } from "./src/handlers/refresh.ts";

interface Options {
  /** @default './deno.json' */
  denoConfig?: string;
  root?: string;
  host?: string;
}

export const getHandler = async ({
  denoConfig = "./deno.json",
  root = import.meta.url,
  host = "http://localhost:3000",
}: Options | undefined = {}) => {
  const config = await getConfig(
    root,
    host,
    denoConfig,
  );

  const [
    assets,
    html,
    files,
    refresh,
  ] = await Promise.all([
    assetsHandler(config),
    htmlHandler(config),
    publicHandler(config),
    refreshHandler(config),
  ]);

  return async (request: Request) => {
    const start = performance.now();

    const url = new URL(request.url);
    const contentType = mime.lookup(url.pathname);

    const response = url.pathname.endsWith(wsRefreshRoot)
      ? refresh(request)
      : url.pathname.startsWith(httpAssetsRoot)
      ? await assets(url).catch(errorHandler)
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
};

export const serve = async ({
  denoConfig,
  root,
  host = "http://localhost:3000",
}: Options | undefined = {}) => {
  const handler = await getHandler({ denoConfig, root, host });

  const { hostname, port } = new URL(host);
  console.log(`Micro running ${colors.cyan(host)}`);
  return stdServe(handler, { port: Number(port), hostname });
};
