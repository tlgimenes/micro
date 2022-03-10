import { Babel, BabelPluginImportMap } from "../../deps.ts";
import { isDev } from "../constants.ts";
import { MicroConfig } from "./../config.ts";
import { BabelMetadataPlugin } from "./plugins/metadata.ts";

export interface Metadata {
  dependencies?: string[];
}

export const getTransform = (
  { importmap, tsconfig }: MicroConfig,
) => {
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
      BabelMetadataPlugin,
    ],
    babelrc: false,
    envName: isDev ? "development" : "production",
    minified: !isDev,
  };

  return async (
    filepath: string,
  ): Promise<{ code: string; metadata: Metadata }> => {
    const source = await Deno.readTextFile(filepath);
    const { code, metadata = {} } = Babel.transform(source, {
      ...babelConfig,
      filename: filepath,
    });

    const withComments = `// @ts-nocheck\n${code}`;

    return { code: withComments, metadata };
  };
};
