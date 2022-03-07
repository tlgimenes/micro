import { SWRConfig } from "swr";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";

import { Head, Main } from "./pages/index.tsx";
import Shell from "./components/Shell.tsx";

import type { AppServerProps } from "../../../packages/micro/mod.ts";

function App({ url }: AppServerProps) {
  return (
    <Router hook={staticLocationHook(url.pathname)}>
      <SWRConfig value={{ suspense: true, provider: () => new Map() }}>
        <Shell head={<Head />} main={<Main />} />
      </SWRConfig>
    </Router>
  );
}

export default App;
