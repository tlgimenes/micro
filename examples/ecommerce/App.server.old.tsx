import { SWRConfig } from "swr";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";

import Shell from "./src/Shell.server.tsx";

import type { AppServerProps } from "../../packages/micro/mod.ts";

function App({ url }: AppServerProps) {
  return (
    <Router hook={staticLocationHook(url.pathname)}>
      <SWRConfig value={{ suspense: true, provider: () => new Map() }}>
        <Shell />
      </SWRConfig>
    </Router>
  );
}

export default App;
