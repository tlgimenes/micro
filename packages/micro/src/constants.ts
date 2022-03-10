export const isDev = Deno.env.get("mode") === "dev";

export const version = "0.0.1";

export const headers = {
  "x-powered-by": `Micro v${version}`,
};

export const httpAssetsRoot = `/__micro/assets`;
