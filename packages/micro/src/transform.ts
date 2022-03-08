import { Babel, BabelPluginImportMap } from "./deps.ts";
import { isDev } from "./env.ts";

import type { TSConfig } from "./tsconfig.ts";

export interface TransformOptions {
  tsconfig: TSConfig;
  importmap: Deno.ImportMap;
}

const getTransformer = ({ tsconfig, importmap }: TransformOptions) => {
  BabelPluginImportMap.load([importmap]);

  const babelConfig = {
    presets: [
      ["react", {
        runtime: "automatic",
        development: isDev,
        importSource: tsconfig.compilerOptions.jsxImportSource,
      }],
      "typescript",
    ],
    plugins: [
      BabelPluginImportMap.plugin(),
    ],
    babelrc: false,
    envName: isDev ? "development" : "production",

    minified: !isDev,
  };

  return async (filepath: string) => {
    const source = await Deno.readTextFile(filepath);
    const { code } = Babel.transform(source, {
      ...babelConfig,
      filename: filepath,
    });

    return code;
  };
};

export default getTransformer;
