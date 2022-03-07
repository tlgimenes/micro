import React from "react";
import { renderToPipeableStream } from "react-dom/server";

import { PassThrough } from "./deps.ts";

import Html from "./Html.server.tsx";

export interface Options {
  url: URL;
  importmap: Deno.ImportMap;
}

const render = ({ url, importmap }: Options) => {
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
      onCompleteShell: () => (shell = performance.now()),
      onCompleteAll: () => {
        const onCompleteShell = (shell - start).toFixed(0);
        const onCompleteAll = (performance.now() - start).toFixed(0);
        
        console.log(
          `onCompleteShell: ${onCompleteShell}ms | onCompleteAll: ${onCompleteAll}ms`,
        );
      },
    },
  );

  pipe(passthrough);

  return stream;
};

export default render;
