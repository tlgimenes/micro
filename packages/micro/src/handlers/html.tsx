import ReactDOM from "react-dom/server";

import { colors, path } from "../../deps.ts";
import { Assets } from "../assets.ts";
import { cacheBuster, headers, httpAssetsRoot as assetsPath, isDev } from "../constants.ts";
import Html from "../Html.server.tsx";
import { link as linkHeader } from "../preloader.ts";

/**
 * @description
 * Awaits for shell rendering (sync part) and streams all suspended Suspense boundaries.
 * If an error happens on the shell, 500 is returned. Else, the same component renders on the client.
 *
 * To know more: https://github.com/reactwg/react-18/discussions/122
 */
const render = async (url: URL,
  assets: Assets,) => {
  try {
    console.time('import-app')
    const buster = (Math.random()*1e3).toFixed(0)
    console.info({buster})
    const mod = await assets.import(`App.server.tsx?ts=${buster}`);
    const { default: App } = mod
    console.timeEnd('import-app')

    console.info(mod)

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

export const handler = async (
  url: URL,
  assets: Assets,
) => {
  const entrypoint = "App.client.tsx";

  const [
    { stream, status },
    { dependencies = [] },
  ] = await Promise.all([
    render(url, assets),
    assets.meta(entrypoint),
  ]);

  const link = linkHeader(dependencies, path.join(assetsPath, entrypoint));

  return new Response(stream, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      link,
      "cache-control": "public, max-age=0, must-revalidate",
      ...headers,
    },
  });
};