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
      paths.map(async (path) => {
        const { code, metadata } = await transform(path);

        const outPath = join(assetsRoot, path.replace(root, ""));
        const outPathMeta = `${outPath}.meta`;

        await Promise.all([
          ensureFile(outPath).then(() => Deno.writeTextFile(outPath, code)),
          ensureFile(outPathMeta).then(() =>
            Deno.writeTextFile(outPathMeta, JSON.stringify(metadata))
          ),
        ]);
      }),
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

  const importAsset = async (path: string) => {
    const filepath = join(assetsRoot, path);
    const { default: mod } = await import(filepath);

    return mod;
  };

  return {
    importmap,
    tsconfig,
    transform,
    pack,
    meta: metadata,
    fetch: fetchAsset,
    import: importAsset,
  };
};
