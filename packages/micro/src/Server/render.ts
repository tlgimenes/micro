import React from "react";
import ReactDOM from "react-dom/server";
import type { ComponentType } from "react";

import type { HtmlProps, Importmap } from "../types.ts";
import { PassThrough } from "../deps.ts";

interface Options {
  url: URL;
  importmap: Importmap;
  Html: ComponentType<HtmlProps>;
}

const render = (
  {
    url,
    importmap,
    Html,
  }: Options,
) => {
  const passthrough = new PassThrough()
  const stream = new ReadableStream({
    start(controller) {
      passthrough.on('data', (chunk) => controller.enqueue(chunk))
    },
    pull(controller) {
      if (passthrough.destroyed) {
        controller.close()
      }
    }
  });

  const start = performance.now();
  let shell = start;
  const { pipe } = ReactDOM.renderToPipeableStream(
    React.createElement(Html, { importmap, url }, null),
    {
      onError: console.error,
      onShellError: console.error,
      onShellComplete: () => shell = performance.now(),
      onCompleteAll: () =>
        console.log(
          `[200] ${shell - start}ms | ${
            performance.now() - start
          }ms: ${url.pathname}`,
        ),
    },
  );

  pipe(passthrough)

  return stream;
};

export default render;
