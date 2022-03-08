import ReactDOM from "react-dom/server";

import { isDev } from "./env.ts";
import Html from "./Html.server.tsx";

export interface Options {
  url: URL;
  importmap: Deno.ImportMap;
}

const render = async ({ url, importmap }: Options) => {
  try {
    const stream: ReadableStream = await (ReactDOM as any)
      .renderToReadableStream(
        <Html importmap={importmap} url={url} />,
      );

    return { stream, status: 200 };
  } catch (err) {
    console.error(url.pathname, err);

    return {
      stream: isDev ? err.stack : `Internal Server Error`,
      status: 500,
    };
  }
};

export default render;
