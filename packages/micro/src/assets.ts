import {
  emptyDir,
  ensureFile,
  extname,
  join,
  readableStreamFromReader,
  relative,
  walk,
} from "./deps.ts";
import { assets as assetsPath } from "./constants.ts";

export const supportedExtensions = new Set([".ts", ".tsx"]);

const getAssetsRoot = (root: string) => join(root, ".micro");

export const build = async (
  root: string,
  transform: (x: string) => Promise<string>,
) => {
  const start = performance.now();

  const outputRoot = getAssetsRoot(root);
  const paths = [];

  await emptyDir(outputRoot);

  for await (const entry of walk(root)) {
    if (entry.isFile) {
      const ext = extname(entry.path);

      if (supportedExtensions.has(ext)) {
        paths.push(entry.path);
      }
    }
  }

  await Promise.all(paths.map(async (path) => {
    const src = await transform(path);
    const outPath = join(outputRoot, relative(root, path));

    await ensureFile(outPath);
    await Deno.writeTextFile(outPath, src);
  }));

  const duration = (performance.now() - start).toFixed(0);
  console.info(`Transpiling ${paths.length} files took ${duration}ms`);
};

export const serve = async (root: string, url: URL) => {
  try {
    const outputRoot = getAssetsRoot(root);

    const path = url.pathname.replace(assetsPath, "");
    const filepath = join(outputRoot, path);

    const file = await Deno.open(filepath);
    const stream = readableStreamFromReader(file);

    return { stream, status: 200 };
  } catch (err) {
    console.error(err);

    return { stream: null, status: 404 };
  }
};

export const importAsset = (root: string, path: string) =>
  import(join(getAssetsRoot(root), path)).then((mod) => mod.default);
