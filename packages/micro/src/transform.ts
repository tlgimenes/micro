import { esbuild } from "./deps.ts";
import { isDev } from "./env.ts";
import { TransformOptions as EsBuildTransformOptions } from "https://deno.land/x/esbuild@v0.12.24/mod.js";

export interface TransformOptions {
  source: string;
  loader?: EsBuildTransformOptions["loader"];
};

const transform = async (
  { source, loader = "tsx" }: TransformOptions,
) => {
  const { code } = await esbuild.transform(source, {
    loader,
    target: ["esnext"],
    minify: !isDev,
  });

  return code;
};

export default transform;
