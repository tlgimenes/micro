import ReactDOM from "react-dom/server";

import { colors, path } from "../../deps.ts";
import { cache } from "../cache.ts";
import { MicroConfig } from "../config.ts";
import { headers, httpAssetsRoot, isDev } from "../constants.ts";
import Html from "../Html.server.tsx";
import { link as linkHeader } from "../preloader.ts";
import { getTransform } from "../transform/index.ts";

const entrypoits = {
  server: "App.server.tsx",
  client: "App.client.tsx",
} as const;

export const handler = async (config: MicroConfig) => {
  const transform = getTransform(config);

  const { metadata: { dependencies = [] } } = await transform(
    path.join(config.root, entrypoits.client),
  );

  const link = linkHeader(dependencies, entrypoits.client);

  return async (url: URL) => {
    const cacheVersion = cache.version();

    const entrypoint = path.join(
      config.href,
      httpAssetsRoot,
      cacheVersion,
      entrypoits.server,
    );

    const { default: App } = await import(entrypoint);

    /**
     * Awaits for shell rendering (sync part) and streams all suspended Suspense boundaries.
     * If an error happens on the shell, 500 is returned. Else, the same component renders on the client.
     *
     * To know more: https://github.com/reactwg/react-18/discussions/122
     */
    const stream: ReadableStream = await (ReactDOM as any)
      .renderToReadableStream(
        <Html App={App} importmap={config.importmap} url={url} />,
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
