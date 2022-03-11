export const isDev = Deno.env.get("mode") === "dev";

export const version = "0.0.1";

export const headers = {
  "x-powered-by": `Micro v${version}`,
};

export const entrypoints = {
  server: 'App.tsx',
  client: 'App.tsx'
}

export const httpAssetsRoot = "/__micro/assets";
export const wsRefreshRoot = "/__micro/refresh";
