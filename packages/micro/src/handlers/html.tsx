import ReactDOM from "react-dom/server";

import { path } from "../../deps.ts";
import { cache } from "../cache.ts";
import { MicroConfig } from "../config.ts";
import { entrypoints, headers, httpAssetsRoot, isDev } from "../constants.ts";
import { getHtml } from "../Html.server.tsx";
import { urlFromRequest } from "../utils.ts";

export const handler = async (config: MicroConfig) => {
  const { Html, link } = await getHtml(config);

  return async (request: Request) => {
    const url = urlFromRequest(request);
    const entrypoint = path.join(
      url.origin,
      httpAssetsRoot,
      cache.version(),
      entrypoints.server
    );

    const { default: App } = await import(entrypoint);

    /**
     * Awaits for shell rendering (sync part) and streams all suspended Suspense boundaries.
     * If an error happens on the shell, 500 is returned. Else, the same component renders on the client.
     *
     * To know more: https://github.com/reactwg/react-18/discussions/122
     */
    const stream: ReadableStream = await (
      ReactDOM as any
    ).renderToReadableStream(<Html App={App} url={url} />);

    return new Response(stream, {
      status: 200,
      headers: {
        ...headers,
        ...(!isDev && { link }),
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  };
};
