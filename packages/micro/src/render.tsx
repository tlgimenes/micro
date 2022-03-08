import ReactDOM from "react-dom/server";

import { isDev } from "./env.ts";
import Html from "./Html.server.tsx";

export interface Options {
  url: URL;
  importmap: Deno.ImportMap;
}

/**
 * @description
 * Awaits for shell rendering (sync part) and streams all suspended Suspense boundaries.
 * If an error happens on the shell, 500 is returned. Else, the same component renders on the client.
 *
 * To know more: https://github.com/reactwg/react-18/discussions/122
 */
const render = async ({ url, importmap }: Options) => {
  try {
    const stream: ReadableStream = await (ReactDOM as any)
      .renderToReadableStream(
        <Html importmap={importmap} url={url} />,
      );

    return { stream, status: 200 };
  } catch (err) {
    return {
      stream: isDev ? err.stack : `Internal Server Error`,
      status: 500,
    };
  }
};

export default render;
