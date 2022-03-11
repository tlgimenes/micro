import { Suspense, useState } from "react";
import { createFromFetch } from "react-server-dom-webpack";


const cache = new Map();

const modules = new Map();

window.__webpack_chunk_load__ = async (path: string) => {
  const mod = await import(`/__micro/assets/client/asd/${path}`);

  modules.set(path, {
    default: mod.default,
    __esModule: true,
  });
};
window.__webpack_require__ = (path: string) => {
  const Component = modules.get(path);

  if (!Component) {
    throw new Error(`Component ${path} not found`);
  }

  return Component;
};

function useServerResponse(location: string) {
  const key = JSON.stringify(location);
  let response = cache.get(key);
  if (response) {
    return response;
  }
  response = createFromFetch(fetch("http://localhost:3000/__micro/components"));
  cache.set(key, response);
  return response;
}

function App() {
  return (
    <Suspense fallback={null}>
      {/* <ErrorBoundary FallbackComponent={Error}> */}
        <Content />
      {/* </ErrorBoundary> */}
    </Suspense>
  );
}

function Error({ error }: any) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
    </div>
  );
}

function Content() {
  const response = useServerResponse('/');

  const root = response.readRoot();

  return (
    <>
      {root}
    </>
  );
}

export default App;
