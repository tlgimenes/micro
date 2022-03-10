import { path } from "../deps.ts";
import { cache } from "./cache.ts";
import { MicroConfig } from "./config.ts";
import { httpAssetsRoot, isDev } from "./constants.ts";
import { link as linkHeader } from "./preloader.ts";
import { getTransform } from "./transform/index.ts";

import type { ComponentType } from "react";
type HtmlProps = {
  url: URL;
  App: ComponentType<AppServerProps>;
};

export interface AppServerProps {
  url: URL;
}

export const getHtml = async (config: MicroConfig) => {
  const transform = getTransform(config);
  const entrypoint = "App.client.tsx";
  const fsPath = path.join(config.root, entrypoint);
  const httpPath = path.join(
    httpAssetsRoot,
    cache.version(),
    entrypoint,
  );

  const [
    { code: hydrateScript },
    { code: hmrScript },
    { metadata: { dependencies = [] } },
  ] = await Promise.all([
    transform(
      new URL("./scripts/hydrate.ts", import.meta.url).pathname,
    ),
    transform(
      new URL("./scripts/hmr.ts", import.meta.url).pathname,
    ),
    transform(fsPath),
  ]);

  const link = linkHeader(dependencies, httpPath);

  const Html = ({ url, App }: HtmlProps) => {
    return (
      <html>
        <App url={url} />

        {isDev && (
          <script
            type="module"
            dangerouslySetInnerHTML={{ __html: hmrScript }}
          />
        )}
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `${hydrateScript}\nhydrate("${httpPath}")`,
          }}
        />
      </html>
    );
  };

  return {
    Html,
    link,
  };
};
