import { hydrateRoot, createRoot } from "react-dom/client";

const nextTick = <T,>(cb: () => T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(cb()), 0));

export const hydrate = async (entrypoint: string) => {
  const { default: App } = await nextTick(() => import(entrypoint));

  nextTick(() => {
    console.info("[Micro]: Starting hydration");

    hydrateRoot(
      // @ts-expect-error: document is not defined inside Deno
      document.getElementsByTagName("html")[0],
      <App />
    );
  });
};
