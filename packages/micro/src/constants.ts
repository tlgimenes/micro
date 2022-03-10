import { path } from '../deps.ts'

export const isDev = Deno.env.get("mode") === "dev";

export const version = "0.0.1";

export const headers = {
  "x-powered-by": `Micro v${version}`,
};

export const cacheBuster = crypto.randomUUID().split("-")[0]

export const fsAssetsScope = `./.micro` 
export const fsAssetsRoot = path.join(fsAssetsScope, cacheBuster)
export const httpAssetsRoot = `/__micro/assets/${cacheBuster}`;
