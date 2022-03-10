import { cache } from "../cache.ts";
import { MicroConfig } from "./../config.ts";
import { isDev } from "./../constants.ts";

/**
 * In-memory store of open WebSockets for
 * triggering browser refresh.
 */
const sockets: Set<WebSocket> = new Set();

export const handler = (config: MicroConfig) => {
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

  if (isDev) {
    watch();
  }

  return (request: Request) => {
    if (isDev) {
      const { response, socket } = Deno.upgradeWebSocket(request);

      // Add the new socket to our in-memory store
      // of WebSockets.
      sockets.add(socket);

      // Remove the socket from our in-memory store
      // when the socket closes.
      socket.onclose = () => {
        sockets.delete(socket);
      };

      return response;
    }

    return new Response(null, {
      status: 400,
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  };
};
