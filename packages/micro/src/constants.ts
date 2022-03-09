export const version = "0.0.1";

export const assets = `/__micro/assets/${crypto.randomUUID().split('-')[0]}`;

export const headers = {
  "x-powered-by": `Micro v${version}`,
}