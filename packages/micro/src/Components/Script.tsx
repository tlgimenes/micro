import React, { useMemo } from "react";
import { Importmap } from "../types.ts";
import { rootId } from "./Main.tsx";

const initScript = ({ imports }: Importmap) => `
import { createElement } from "${imports["react"]}";
import { hydrateRoot } from "${imports["react-dom"]}"
import App from "/app.client.js"

hydrateRoot(document.getElementById("${rootId}"), createElement(App))
`;

function Script({ importmap }: { importmap: Importmap }) {
  const js = useMemo(() => initScript(importmap), []);

  return <script dangerouslySetInnerHTML={{ __html: js }}></script>;
}

export default Script;
