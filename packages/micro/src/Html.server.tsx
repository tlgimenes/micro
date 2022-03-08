import App from "App";

import { assets } from "./constants.ts";

type HtmlProps = {
  importmap: Deno.ImportMap;
  url: URL;
};

export interface AppServerProps {
  url: URL
}

const script = (importmap: Deno.ImportMap) => `
import { createElement } from "${importmap.imports['react']}"
import { hydrateRoot } from "${importmap.imports['react-dom/client']}"

const nextTick = (cb) => new Promise(resolve => setTimeout(() => resolve(cb()), 0));

const hydrate = async () => {
  const { default: App } = await nextTick(async () => await import("${assets}/App.client.tsx"));

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

function Html(props: HtmlProps) {
  return (
    <html>
      <App {...props} />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: script(props.importmap) }}
      />
    </html>
  );
}

export default Html;
