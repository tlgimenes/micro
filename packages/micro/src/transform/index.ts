import {
  Babel,
  BabelPluginImportMap,
  BabelPresetReact,
  BabelPresetTypescript,
} from "../../deps.ts";
import { isDev } from "../constants.ts";
import { MicroConfig } from "./../config.ts";
import { BabelMetadataPlugin } from "./plugins/metadata.ts";

export interface Metadata {
  dependencies?: string[];
}

export const getTransform = (
  { importmap, denoConfig }: MicroConfig,
) => {
  BabelPluginImportMap.load([importmap]);
  const babelConfig = {
    presets: [
      [BabelPresetReact, {
        runtime: "automatic",
        development: isDev,
        importSource: denoConfig.compilerOptions.jsxImportSource,
      }],
      BabelPresetTypescript,
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
    })!;

    const withComments = `// @ts-nocheck\n${code}`;

    return { code: withComments, metadata };
  };
};
