import { Babel } from "./deps.ts";
import { isDev } from "./env.ts";

import type { TSConfig } from "./tsconfig.ts";

export interface TransformOptions {
  filepath: string;
  tsconfig: TSConfig;
  importmap: Deno.ImportMap;
}

const transform = async (
  { filepath, tsconfig }: TransformOptions,
) => {
  const source = await Deno.readTextFile(filepath);
  const { code } = Babel.transform(source, {
    presets: [
      ["react", {
        runtime: "automatic",
        development: isDev,
        importSource: tsconfig.compilerOptions.jsxImportSource,
      }],
      "typescript",
    ],
    babelrc: false,
    envName: isDev ? "development" : "production",
    filename: filepath,
    minified: !isDev,
  });

  return code;
};

export default transform;
