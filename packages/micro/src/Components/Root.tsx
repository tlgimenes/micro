import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";

import type { Importmap } from "../types.ts";

interface Props {
  importmap: Importmap;
}

const initScript = ({ importmap: { imports } }: Props) => `
const DOMElement = document.getElementsByTagName("html")

import { createElement } from "${imports["react"]}";
import { hydrateRoot } from "${imports["react-dom"]}"
import Html from "/html.client.js"


console.log(DOMElement)

hydrateRoot(
  DOMElement, 
  createElement(Html)
)
`;

function Root({ children, importmap }: PropsWithChildren<Props>) {
  const js = useMemo(() => initScript({ importmap }), []);

  return (
    <>
      {children}
      <script
        defer
        type="module"
        dangerouslySetInnerHTML={{ __html: js }}
      />
    </>
  );
}

export default Root;
