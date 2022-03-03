import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { Importmap } from "../types.ts";

interface Props {
  importmap: Importmap;
}

const rootId = `__micro_root`;

const initScript = ({ importmap: { imports } }: Props) => `
import { createElement } from "${imports["react"]}";
import { hydrateRoot } from "${imports["react-dom"]}"
import App from "/html.server.js"

hydrateRoot(
  document.getElementByTagName("html"), 
  createElement(App)
)
`;

function Root({ children, importmap }: PropsWithChildren<Props>) {
  const js = useMemo(() => initScript({ importmap }), []);

  return (
    <>
      <div id={rootId}>{children}</div>
      <script
        defer
        type="module"
        dangerouslySetInnerHTML={{ __html: js }}
      />
    </>
  );
}

export default Root;
