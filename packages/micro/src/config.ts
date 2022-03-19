import { path } from "../deps.ts";

const defaultImportmapJson = {
  imports: {
    "react": "https://esm.sh/react@18.0.0-rc.1-next-a59f53a60-20220308?pin=v67",
    "react/jsx-runtime":
      "https://esm.sh/react@18.0.0-rc.1-next-a59f53a60-20220308?pin=v67&path=/jsx-runtime",
    "react/jsx-dev-runtime":
      "https://esm.sh/react@18.0.0-rc.1-next-a59f53a60-20220308?pin=v67&path=/jsx-dev-runtime",
    "react-dom/client":
      "https://esm.sh/react-dom@18.0.0-rc.1-next-a59f53a60-20220308?pin=v67&deps=react@18.0.0-rc.1-next-a59f53a60-20220308&path=/client",
    "react-dom/server":
      "https://esm.sh/react-dom@18.0.0-rc.1-next-a59f53a60-20220308?pin=v67&deps=react@18.0.0-rc.1-next-a59f53a60-20220308&path=/server",
  },
} as const;

const defaultDenoConfig = {
  compilerOptions: {
    jsx: "react-jsx",
    jsxImportSource: "react",
  },
  importMap: "./importmap.json",
} as const;

export interface DenoConfig {
  compilerOptions: Deno.CompilerOptions;
  importMap: string;
}

const readDenoConfig = async (path: string): Promise<DenoConfig> => {
  try {
    const json = await Deno.readTextFile(path).then(JSON.parse);

    assertDenoConfig(json);

    return json;
  } catch (_) {
    console.info("No valid config found. Using default config");
    return defaultDenoConfig;
  }
};

const assertDenoConfig = (config: DenoConfig) => {
  if (config.compilerOptions.jsx !== "react-jsx") {
    throw new Error(
      'We only accept jsx="react-jsx" for now. Please change your config and try again',
    );
  }
  if (typeof config.importMap !== "string") {
    throw new Error("Missing importMap in your config file");
  }
};

const readImportmap = async (
  path: string,
): Promise<Deno.ImportMap> => {
  try {
    const json = await Deno.readTextFile(path).then(JSON.parse);

    assertDependencies(json);

    return json;
  } catch (_) {
    console.info("No valid importmap found. Using default imports");
    return defaultImportmapJson;
  }
};

const assertDependencies = (importmap: Deno.ImportMap) => {
  const required = Object.keys(defaultImportmapJson.imports);
  const deps = new Set(Object.keys(importmap.imports));

  for (const mod of required) {
    if (!deps.has(mod)) {
      throw new Error(
        `Required module ${mod} not provided in importmap. Please check our examples on how to import this missing module`,
      );
    }
  }
};

export const getConfig = async (
  root: string,
  href: string,
  denoConfigPath: string,
) => {
  const denoConfig = await readDenoConfig(denoConfigPath);
  const importmap = await readImportmap(denoConfig.importMap);

  return ({
    root: path.resolve(root),
    href,
    importmap,
    denoConfig,
  });
};

type PromiseType<T> = T extends Promise<infer K> ? K : never;

export type MicroConfig = PromiseType<ReturnType<typeof getConfig>>;
