import { path } from "../../deps.ts";
import { cache } from "../cache.ts";
import { MicroConfig } from "../config.ts";
import { entrypoints, headers, httpAssetsRoot, isDev } from "../constants.ts";
import { getHtml } from "../Html.server.tsx";

import { renderToReadableStream } from "react-server-dom-webpack/writer";

const manifest = {
  "file:///Users/gimenes/Documents/code/micro/examples/ecommerce/src/pages/Home/Greeting.client.tsx":
    {
      "": {
        id: "./src/pages/Home/Greeting.client.tsx",
        chunks: ["./src/pages/Home/Greeting.client.tsx"],
        name: "",
      },
      "*": {
        id: "./src/pages/Home/Greeting.client.tsx",
        chunks: ["./src/pages/Home/Greeting.client.tsx"],
        name: "*",
      },
      "default": {
        id: "./src/pages/Home/Greeting.client.tsx",
        chunks: ["./src/pages/Home/Greeting.client.tsx"],
        name: "default",
      },
    },
};

export const handler = async (config: MicroConfig) => {
  const { Html, link } = await getHtml(config);

  return async (url: URL) => {
    const entrypoint = path.join(
      config.href,
      httpAssetsRoot,
      'server',
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
    const stream: ReadableStream = await renderToReadableStream(
      <Html App={App} url={url} />,
      manifest,
    );

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
