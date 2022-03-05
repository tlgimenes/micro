import React from "react";
import { renderToPipeableStream } from "react-dom/server";

import { PassThrough } from "./deps.ts";
import type { Importmap } from "./importmap.ts";

import Html from "./Html.server.tsx";

export interface Options {
  url: URL;
  importmap: Importmap;
}

const render = (
  {
    url,
    importmap,
  }: Options,
) => {
  const passthrough = new PassThrough();
  const stream = new ReadableStream({
    start(controller) {
      passthrough.on("data", (chunk) => controller.enqueue(chunk));
      passthrough.on("close", () => controller.close());
    },
  });

  const start = performance.now();
  let shell = start;

  const { pipe } = renderToPipeableStream(
    <Html importmap={importmap} url={url} />,
    {
      onError: console.error,
      onErrorShell: console.error,
      onCompleteShell: () => shell = performance.now(),
      onCompleteAll: () => {
        console.log(
          `[200] ${(shell - start).toFixed(0)}ms | ${
            (performance.now() - start).toFixed(0)
          }ms: ${url.pathname}`,
        );
      },
    },
  );

  pipe(passthrough);

  return stream;
};

export default render;
