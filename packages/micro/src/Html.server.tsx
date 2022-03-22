import { path } from "../deps.ts";
import { cache } from "./cache.ts";
import { MicroConfig } from "./config.ts";
import {
  entrypoints,
  httpAssetsRoot,
  isDev,
  wsRefreshRoot,
} from "./constants.ts";
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
  const fsPath = path.join(config.root, entrypoints.client);
  const httpPath = path.join(
    httpAssetsRoot,
    cache.version(),
    entrypoints.client,
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
      <html lang="en-US">
        <App url={url} />

        {isDev && (
          <script
            type="module"
            dangerouslySetInnerHTML={{
              __html: `${hmrScript}\nhmr("${wsRefreshRoot}")`,
            }}
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
