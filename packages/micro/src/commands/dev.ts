import { colors, mime, serve as stdServe } from "../../deps.ts";
import { cache } from "../cache.ts";
import { getConfig } from "../config.ts";
import { httpAssetsRoot as assetsPath, wsRefreshRoot } from "../constants.ts";
import { handler as assetsHandler } from "../handlers/assets.ts";
import { handler as errorHandler } from "../handlers/error.ts";
import { handler as htmlHandler } from "../handlers/html.tsx";
import { handler as publicHandler } from "../handlers/public.ts";

interface Options {
  /** @default './importmap.json' */
  importmap?: string;
  /** @default './tsconfig.json' */
  tsconfig?: string;
  root?: string;
  host?: string;
}

export const dev = async ({
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
  ] = await Promise.all([
    assetsHandler(config),
    htmlHandler(config),
    publicHandler(config),
  ]);

  const watch = async () => {
    const watcher = Deno.watchFs(config.root);
    for await (const event of watcher) {
      if (event.kind === "create" || event.kind === "modify") {
        /* Reset local cache so SSR works with HMR */
        cache.reset();

        /* Warns React FastRefresh to upgrade module */
        sockets.forEach(
          (socket) =>
            socket.send(JSON.stringify({
              type: "refresh",
              data: {
                paths: event.paths,
              },
            })),
        );
      }
    }
  };

  /**
   * In-memory store of open WebSockets for
   * triggering browser refresh.
   */
  const sockets: Set<WebSocket> = new Set();

  const socketHandler = (req: Request) => {
    const { response, socket } = Deno.upgradeWebSocket(req);

    // Add the new socket to our in-memory store
    // of WebSockets.
    sockets.add(socket);

    // Remove the socket from our in-memory store
    // when the socket closes.
    socket.onclose = () => {
      sockets.delete(socket);
    };

    return response;
  };

  const handler = async (request: Request) => {
    const start = performance.now();

    const url = new URL(request.url);
    const contentType = mime.lookup(url.pathname);

    const response = url.pathname.endsWith(wsRefreshRoot)
      ? socketHandler(request)
      : url.pathname.startsWith(assetsPath)
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

  watch();

  const { hostname, port } = new URL(host);
  console.log(`Micro running ${colors.cyan(host)}`);
  return stdServe(handler, { port: Number(port), hostname });
};
