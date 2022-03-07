const defaultJson = {
  imports: {
    "react": "https://esm.sh/react@18.0.0-rc.1-next-17806594c-20220301?pin=v66",
    "react/jsx-runtime":
      "https://esm.sh/react@18.0.0-rc.1-next-17806594c-20220301?pin=v66&path=/jsx-runtime",
    "react/jsx-dev-runtime":
      "https://esm.sh/react@18.0.0-rc.1-next-17806594c-20220301?pin=v66&path=/jsx-dev-runtime",
    "react-dom/client":
      "https://esm.sh/react-dom@18.0.0-rc.1-next-17806594c-20220301/client?pin=v66",
    "react-dom/server":
      "https://esm.sh/react-dom@18.0.0-rc.1-next-17806594c-20220301/server.node?pin=v66",
  },
};

export const readImportmap = async (
  path: string,
): Promise<Deno.ImportMap> => {
  try {
    const json = await Deno.readTextFile(path).then(JSON.parse);

    console.info(`using importmap from ${path}`);
    ensureDeps(json);

    return json;
  } catch (_) {
    console.info("No valid importmap found. Using default imports");
    return defaultJson;
  }
};

export const ensureDeps = (importmap: Deno.ImportMap) => {
  const required = Object.keys(defaultJson.imports);
  const deps = new Set(Object.keys(importmap.imports));

  for (const mod of required) {
    if (!deps.has(mod)) {
      throw new Error(
        `Required module ${mod} not provided in importmap. Please check our examples on how to import this missing module`,
      );
    }
  }
};
