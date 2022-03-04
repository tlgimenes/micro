import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";

import type { Importmap } from "../types.ts";

interface Props {
  importmap: Importmap;
}

const initScript = () => `
import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "/assets/App.client.tsx";

const element = document.getElementsByTagName("html")[0]

hydrateRoot(element, createElement(App)
)
`;

function Root({ importmap }: PropsWithChildren<Props>) {
  const js = useMemo(() => initScript(), []);

  return (
    <>
      <script
        type="importmap"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(importmap) }}
      />
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: js }}
      />
    </>
  );
}

export default Root;
