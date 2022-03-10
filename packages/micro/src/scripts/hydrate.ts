import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";

const nextTick = <T>(cb: () => T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(cb()), 0));

export const hydrate = async (entrypoint: string) => {
  const App = await nextTick(() => import(entrypoint));

  nextTick(() => {
    hydrateRoot(
      // @ts-expect-error: document is not defined inside Deno
      document.getElementsByTagName("html")[0],
      createElement(App.default),
    );

    console.info("React Hydrated!");
  });
};
