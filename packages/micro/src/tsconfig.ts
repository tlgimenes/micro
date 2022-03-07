export interface TSConfig {
  compilerOptions: Deno.CompilerOptions
}

const defaultJson = {
  compilerOptions: {
    jsx: "react-jsx",
    jsxImportSource: "react",
  },
} as const;

export const readTSConfig = async (path: string): Promise<TSConfig> => {
  try {
    const json = await Deno.readTextFile(path).then(JSON.parse);

    console.info(`using tsconfig from ${path}`);

    assertTSConfig(json)

    return json;
  } catch (_) {
    console.info("No valid tsconfig found. Using default config");
    return defaultJson;
  }
};

const assertTSConfig = (tsconfig: TSConfig) => {
  if (tsconfig.compilerOptions.jsx !== 'react-jsx') {
    throw new Error('We only accept jsx="react-jsx" for now. Please change your tsconfig.json and try again')
  }
}
