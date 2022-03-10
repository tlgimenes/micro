import ReactDOM from "react-dom/server";

import { colors, path } from "../../deps.ts";
import { Assets } from "../assets.ts";
import { cacheBuster, headers, httpAssetsRoot, isDev } from "../constants.ts";
import Html from "../Html.server.tsx";
import { link as linkHeader } from "../preloader.ts";

import { genCacheBuster } from "../utils.ts";

const entrypoits = {
  server: "App.server.tsx",
  client: "App.client.tsx",
} as const;

/**
 * @description
 * Awaits for shell rendering (sync part) and streams all suspended Suspense boundaries.
 * If an error happens on the shell, 500 is returned. Else, the same component renders on the client.
 *
 * To know more: https://github.com/reactwg/react-18/discussions/122
 */
const render = async (
  url: URL,
  importmap: Deno.ImportMap,
) => {
  try {
    const cacheVersion = isDev ? genCacheBuster() : cacheBuster;

    const entrypoint = path.join(
      "http://localhost:3000",
      httpAssetsRoot,
      cacheVersion,
      entrypoits.server,
    );

    console.time("import-app");
    const { default: App } = await import(entrypoint);
    console.timeEnd("import-app");

    const stream: ReadableStream = await (ReactDOM as any)
      .renderToReadableStream(
        <Html App={App} importmap={importmap} url={url} />,
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
  const [
    { stream, status },
    { dependencies = [] },
  ] = await Promise.all([
    render(url, assets.importmap),
    isDev
      ? { dependencies: [] }
      : assets.meta(path.join(cacheBuster, entrypoits.client)),
  ]);

  const link = linkHeader(
    dependencies,
    path.join(httpAssetsRoot, cacheBuster, entrypoits.client),
  );

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
