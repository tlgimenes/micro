import {
  emptyDir,
  ensureFile,
  extname,
  join,
  readableStreamFromReader,
  walk,
} from "./deps.ts";
import { getTransform, Metadata } from "./transform/index.ts";
import { TSConfig } from "./tsconfig.ts";

const supportedExtensions = new Set([".ts", ".tsx"]);

export type Assets = ReturnType<typeof getAssets>;

export const getAssets = ({
  tsconfig,
  importmap,
  root,
}: {
  tsconfig: TSConfig;
  importmap: Deno.ImportMap;
  root: string;
}) => {
  const transform = getTransform({ tsconfig, importmap });
  const assetsRoot = join(root, ".micro");

  const compile = async (path: string) => {
    const { code, metadata } = await transform(path);

    const outPath = join(assetsRoot, path.replace(root, ""));
    const outPathMeta = `${outPath}.meta`;

    await Promise.all([
      ensureFile(outPath).then(() => Deno.writeTextFile(outPath, code)),
      ensureFile(outPathMeta).then(() =>
        Deno.writeTextFile(outPathMeta, JSON.stringify(metadata))
      ),
    ]);
  };

  const pack = async () => {
    const paths = [];

    await emptyDir(assetsRoot);

    // Gathers all paths
    for await (const entry of walk(root)) {
      if (entry.isFile) {
        const ext = extname(entry.path);

        if (supportedExtensions.has(ext)) {
          paths.push(entry.path);
        }
      }
    }

    // Transform each path generating a JS file + metadata file
    await Promise.all(
      paths.map(compile),
    );
  };

  const fetchAsset = async (path: string) => {
    try {
      const filepath = join(assetsRoot, path);

      const file = await Deno.open(filepath);
      const stream = readableStreamFromReader(file);

      return { stream, status: 200 };
    } catch (err) {
      console.error(err);

      return { stream: null, status: 404 };
    }
  };

  const metadata = (path: string): Promise<Metadata> => {
    const filepath = join(assetsRoot, path);
    const metapath = `${filepath}.meta`;

    return Deno.readTextFile(metapath).then(
      JSON.parse,
    );
  };

  const importAsset = (path: string) => import(join(assetsRoot, path))

  const watch = async () => {
    const watcher = Deno.watchFs(root);
    for await (const event of watcher) {
      switch (event.kind) {
        case "create":
        case "modify":
          await Promise.all(
            event.paths
              .filter((path) => supportedExtensions.has(extname(path)))
              .filter((path) => !path.includes(".micro"))
              .map(compile),
          );

          break;
        case "remove":
          await Promise.all([
            event.paths.map(
              (path) => Deno.remove(join(assetsRoot, path.replace(root, ""))),
            ),
          ]);
      }
    }
  };

  return {
    importmap,
    tsconfig,
    transform,
    pack,
    watch,
    meta: metadata,
    fetch: fetchAsset,
    import: importAsset,
  };
};
