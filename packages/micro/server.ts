import { colors, mime, serve as stdServe } from "./deps.ts";
import { getConfig } from "./src/config.ts";
import { headers, httpAssetsRoot, wsRefreshRoot } from "./src/constants.ts";
import { handler as assetsHandler } from "./src/handlers/assets.ts";
import { handler as htmlHandler } from "./src/handlers/html.tsx";
import { handler as publicHandler } from "./src/handlers/public.ts";
import { handler as refreshHandler } from "./src/handlers/refresh.ts";
import { urlFromRequest } from "./src/utils.ts";

interface Options {
  /** @default './deno.json' */
  denoConfig?: string;
  root?: string;
  host?: string;
}

const withTimings = (handler: (req: Request) => Promise<Response>) =>
  async (req: Request) => {
    const start = performance.now();

    const response = await handler(req);

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
      `[${statusText}] ${durationText} ${colors.white(req.url)}`,
    );

    return response;
  };

export const getHandler = async ({
  denoConfig = "./deno.json",
  root = import.meta.url,
}: Omit<Options, "host"> | undefined = {}) => {
  const config = await getConfig(
    root,
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

  const handler = async (request: Request) => {
    try {
      const url = urlFromRequest(request);
      const contentType = mime.lookup(url.pathname);

      const response = url.pathname.endsWith(wsRefreshRoot)
        ? refresh(request)
        : url.pathname.startsWith(httpAssetsRoot)
        ? await assets(request)
        : contentType === false || contentType === "text/html"
        ? await html(request)
        : await files(request);

      return response;
    } catch (err) {
      console.error(err);

      return new Response("Internal Server Error", {
        status: 500,
        headers: {
          ...headers,
          "cache-control": "public, max-age=0, must-revalidate",
        },
      });
    }
  };

  return withTimings(handler);
};

export const serve = async ({
  denoConfig,
  root,
  host = "http://localhost:3000",
}: Options | undefined = {}) => {
  const handler = await getHandler({ denoConfig, root });

  const { hostname, port } = new URL(host);
  console.info(`Micro running ${colors.cyan(host)}`);
  return stdServe(handler, { port: Number(port), hostname });
};
