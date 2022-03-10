import { path } from "../../deps.ts";
import { getAssets } from "../assets.ts";
import { readImportmap } from "../importmap.ts";
import { readTSConfig } from "../tsconfig.ts";

interface Options {
  /** @default './importmap.json' */
  importmap?: string;
  /** @default './tsconfig.json' */
  tsconfig?: string;
  root?: string;
}

export const build = async ({
  tsconfig = "./tsconfig.json",
  importmap = "./importmap.json",
  root = "./",
}: Options) => {
  const absoluteRoot = path.resolve(root);

  const [importmapJson, tsconfigJson] = await Promise.all([
    readImportmap(importmap),
    readTSConfig(tsconfig),
  ]);

  const assets = getAssets({
    root: absoluteRoot,
    importmap: importmapJson,
    tsconfig: tsconfigJson,
  });

  // TODO: add tsc analysis

  console.log(`Building ...`);

  const start = performance.now()
  await assets.pack();
  const duration = performance.now() - start

  console.log(`Building your project took ${duration.toFixed(0)}ms. Use the "serve" command for serving files`);
};
