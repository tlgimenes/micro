// @ts-nocheck todo: add types
import { scripts } from "./constants.ts";
import { createGraph, relative } from "./deps.ts";

const isRemoteImport = (path: string) => /http(s)?:\/\//g.test(path);

const preloadLink = (path: string) => `<${path}>; rel="modulepreload"`;

/**
 * TODO: preload only required files
 */
const preloader = async (path, cache, root) => {
  const { cacheInfo, load } = cache;

  const graph = await createGraph(`${root}${path}`, {
    cacheInfo,
    load,
  });

  const { modules } = graph.toJSON();

  const preloadPaths = modules
    .map(({ specifier }) =>
      isRemoteImport(specifier)
        ? specifier.replace("/deno/", "/es2021/") // esm.sh fix for deno
        : `${scripts}/${relative(root, specifier)}` // local import
    )
    .filter((preload) => !preload.endsWith(path)); // remove self reference

  return preloadPaths.map(preloadLink).join(", ");
};

export const microloader = ({ importmap }: { importmap: Importmap }) => {
  return [
    importmap.imports["react"],
    importmap.imports["react-dom/client"],
  ].map(preloadLink).join(", ");
};

export default preloader;
