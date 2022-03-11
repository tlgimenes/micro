import { SWRConfig } from "swr";
import { Router } from "wouter";

import Shell from "./src/Shell.server.tsx";

function App() {
  return (
    <Router>
      <SWRConfig value={{ suspense: true }}>
        <Shell />
      </SWRConfig>
    </Router>
  );
}

export default App;
