import { path } from "../deps.ts";
import { cache } from "./cache.ts";
import { httpAssetsRoot } from "./constants.ts";

import type { ComponentType } from "react";

type HtmlProps = {
  importmap: Deno.ImportMap;
  url: URL;
  App: ComponentType<AppServerProps>;
};

export interface AppServerProps {
  url: URL;
}

const entrypoint = path.join(httpAssetsRoot, cache.version(), "App.client.tsx");

const script = (importmap: Deno.ImportMap) => `
import { createElement } from "${importmap.imports["react"]}"
import { hydrateRoot } from "${importmap.imports["react-dom/client"]}"

const nextTick = (cb) => new Promise(resolve => setTimeout(() => resolve(cb()), 0));

const hydrate = async () => {
  const { default: App } = await nextTick(async () => await import("${entrypoint}"));

  nextTick(() => {
    hydrateRoot(
      document.getElementsByTagName("html")[0], 
      createElement(App)
    );

    console.info('React Hydrated!');
  })
}

hydrate();
`;

function Html({ importmap, url, App }: HtmlProps) {
  return (
    <html>
      <App url={url} />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: script(importmap) }}
      />
    </html>
  );
}

export default Html;
