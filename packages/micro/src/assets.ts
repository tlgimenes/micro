import { path } from "./../deps.ts";
import { getTransform } from "./transform/index.ts";
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
  const rawTransform = getTransform({ tsconfig, importmap });

  // const compile = async (filepath: string) => {
  //   const { code, metadata } = await rawTransform(filepath);

  //   const outPath = path.join(root, cacheBuster, filepath.replace(root, ""));
  //   const outPathMeta = `${outPath}.meta`;

  //   await Promise.all([
  //     fs.ensureFile(outPath).then(() => Deno.writeTextFile(outPath, code)),
  //     fs.ensureFile(outPathMeta).then(() =>
  //       Deno.writeTextFile(outPathMeta, JSON.stringify(metadata))
  //     ),
  //   ]);
  // };

  const transform = (file: string) => rawTransform(path.join(root, file))

  // const pack = async () => {
  //   const paths = [];

  //   await fs.emptyDir(assetsRoot);

  //   // Gathers all paths
  //   for await (const entry of fs.walk(root)) {
  //     if (entry.isFile) {
  //       const ext = path.extname(entry.path);

  //       if (supportedExtensions.has(ext)) {
  //         paths.push(entry.path);
  //       }
  //     }
  //   }

  //   // Transform each path generating a JS file + metadata file
  //   await Promise.all(
  //     paths.map(compile),
  //   );
  // };

  // const fetchAsset = async (file: string) => {
  //   try {
  //     const filepath = path.join(assetsRoot, file);

  //     const fd = await Deno.open(filepath);
  //     const stream = readableStreamFromReader(fd);

  //     return { stream, status: 200 };
  //   } catch (err) {
  //     console.error(err);

  //     return { stream: null, status: 404 };
  //   }
  // };

  // const metadata = (file: string): Promise<Metadata> => {
  //   const filepath = path.join(assetsRoot, file);
  //   const metapath = `${filepath}.meta`;

  //   return Deno.readTextFile(metapath).then(
  //     JSON.parse,
  //   );
  // };

  // const importAsset = (file: string) => import(path.join(assetsRoot, file));

  // const watch = async () => {
  //   const watcher = Deno.watchFs(root);
  //   for await (const event of watcher) {
  //     switch (event.kind) {
  //       case "create":
  //       case "modify":
  //         await Promise.all(
  //           event.paths
  //             .filter((p) => supportedExtensions.has(path.extname(p)))
  //             .filter((p) => !p.includes(fsAssetsRoot))
  //             .map(compile),
  //         );

  //         break;
  //       case "remove":
  //         await Promise.all(
  //           event.paths
  //             .filter((p) => supportedExtensions.has(path.extname(p)))
  //             .filter((p) => !p.includes(fsAssetsRoot))
  //             .map(
  //               (p) => Deno.remove(path.join(assetsRoot, p.replace(root, ""))),
  //             ),
  //         );
  //     }
  //   }
  // };

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
