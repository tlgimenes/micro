import App from "App";

import { scripts } from "./constants.ts";

type HtmlProps = {
  importmap: Deno.ImportMap;
  url: URL;
};

export interface AppServerProps {
  url: URL
}

const script = () => `
import { createElement } from "react"
import { hydrateRoot } from "react-dom/client"

const nextTick = (cb) => new Promise(resolve => setTimeout(() => resolve(cb()), 0));

const hydrate = async () => {
  const { default: App } = await nextTick(async () => await import("${scripts}/App.client.tsx"));

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
        type="importmap"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.importmap, null, 2) }}
      />
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: script() }}
      />
    </html>
  );
}

export default Html;
