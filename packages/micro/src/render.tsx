import ReactDOM from "react-dom/server";

import { Assets } from "./assets.ts";
import { colors } from "./deps.ts";
import { isDev } from "./env.ts";
import Html from "./Html.server.tsx";

export interface Options {
  url: URL;
  assets: Assets;
}

/**
 * @description
 * Awaits for shell rendering (sync part) and streams all suspended Suspense boundaries.
 * If an error happens on the shell, 500 is returned. Else, the same component renders on the client.
 *
 * To know more: https://github.com/reactwg/react-18/discussions/122
 */
const render = async ({ url, assets }: Options) => {
  try {
    const { default: App } = await assets.import(`App.server.tsx`);

    const stream: ReadableStream = await (ReactDOM as any)
      .renderToReadableStream(
        <Html App={App} importmap={assets.importmap} url={url} />,
      );

    return { stream, status: 200 };
  } catch (err) {
    console.error(Deno.inspect(err, {
      colors: colors.getColorEnabled(),
    }));

    return {
      stream: isDev ? err.stack : `Internal Server Error`,
      status: 500,
    };
  }
};

export default render;
