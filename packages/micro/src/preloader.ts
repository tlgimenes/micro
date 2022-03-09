import { join, dirname } from "./deps.ts";

const isRemoteImport = (path: string) => /http(s)?:\/\//g.test(path);

const preload = (path: string) => `<${path}>; rel="modulepreload"`;

export const link = (dependencies: string[], filepath: string) =>
  dependencies
    .map(
      (dependency) => {
        return isRemoteImport(dependency)
          ? dependency.replace("/deno/", "/es2021/") // esm.sh fix for deno
          : join(dirname(filepath), dependency) // local import
      }
    )
    .map(preload)
    .join(", ");
