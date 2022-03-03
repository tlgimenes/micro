import { TransformOptions as EsBuildTransformOptions } from "https://deno.land/x/esbuild@v0.12.24/mod.js";

export type Importmap = { imports: Record<string, unknown> };

export type HtmlProps = {
  importmap: Importmap
  url: URL
}


export type TransformOptions = {
  source: string;
  importmap: Importmap;
  root: string;
  loader?: EsBuildTransformOptions["loader"];
  cacheBuster?: number;
  env?: Record<string, unknown>;
};