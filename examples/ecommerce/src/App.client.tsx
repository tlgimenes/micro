import { SWRConfig } from "swr";
import { Router } from "wouter";

import Shell from "./components/Shell.tsx";
import { Head, Main } from "./pages/index.tsx";

function App() {
  return (
    <Router>
      <SWRConfig value={{ suspense: true }}>
        <Shell
          head={<Head />}
          main={<Main />}
        />
      </SWRConfig>
    </Router>
  );
}

export default App;
