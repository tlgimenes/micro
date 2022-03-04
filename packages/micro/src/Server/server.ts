import {
  createCache,
  extname,
  LRU,
  readableStreamFromReader,
  serve,
} from "../deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.tsx";
import preloader, { microloader } from "./preloader.ts";
import { port } from "./env.ts";

import type { Options as RenderOptions } from "./render.tsx";

interface Options {
  importmap: RenderOptions["importmap"];
  dir?: string;
  root?: string;
  env?: Record<string, unknown>;
}

const memory = new LRU(500);
const cache = createCache();

const allowedExtensions = new Set([".ts", ".tsx"]);

const assetsHandler = async (url: URL, dir: string) => {
  const path = url.pathname.replace("/assets", "");
  const ext = extname(path);

  if (!allowedExtensions.has(ext)) {
    throw new Error(`Uknown extension ${ext}. Please use .ts or .tsx`);
  }

  try {
    const transpiled = await transform({
      source: await Deno.readTextFile(`${dir}${path}`),
      loader: ext === ".ts" ? "ts" : "tsx",
    });

    const link = await preloader(
      path,
      cache,
      `file://${Deno.cwd()}/${dir}`
    );

    return new Response(transpiled, {
      headers: {
        "content-type": "application/javascript",
        link,
      },
    });
  } catch (err) {
    console.error(err);
  }

  return new Response(null, {
    status: 404,
  });
};

const server = async (
  {
    importmap,
    dir = "src",
    root = "http://localhost:3000",
  }: Options,
) => {
  const link = await microloader({ importmap, cache });

  const handler = async (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/assets")) {
      return await assetsHandler(url, dir);
    } else {
      const stream = render({ url, importmap });

      return new Response(
        stream,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
            link,
          },
        },
      );
    }

    // const { raw, transpile } = await assets(dir);

    // // static assets
    // if (raw.has(`${dir}${url.pathname}`)) {
    //   const contentType = raw.get(`${dir}${url.pathname}`);
    //   const headers = {
    //     "content-type": contentType,
    //   };

    //   if (contentType === "application/javascript") {
    //     const link = await preloader(
    //       `${fileRootUri}${url.pathname}`,
    //       (specifier: string) => {
    //         const path = specifier.replace(fileRootUri, "");
    //         if (path !== url.pathname) {
    //           return `${url.origin}${path}`;
    //         }
    //       },
    //       cache,
    //     );

    //     if (link) {
    //       //@ts-ignore any
    //       headers.link = link;
    //     }
    //   }

    //   const file = await Deno.open(`./${dir}${url.pathname}`);
    //   const body = readableStreamFromReader(file);

    //   return new Response(body, { headers });
    // }

    // const transpilation = async (file: string) => {
    //   const headers = {
    //     "content-type": "application/javascript",
    //   };

    //   let js = memory.get(url.pathname);

    //   if (!js) {
    //     const source = await Deno.readTextFile(`./${file}`);
    //     const t0 = performance.now();
    //     js = await transform({
    //       source,
    //       importmap,
    //       root,
    //       cacheBuster,
    //       env,
    //     });
    //     const t1 = performance.now();
    //     console.log(
    //       `Transpile ${file.replace(dir, "")} in ${(t1 - t0).toFixed(0)}ms`,
    //     );
    //     if (!isDev) memory.set(url.pathname, js);
    //   }

    //   const link = await preloader(
    //     `${fileRootUri}${file.replace(dir, "")}`,
    //     (specifier: string) => {
    //       if (specifier.indexOf("http") == 0) return;
    //       const path = jsify(specifier.replace(fileRootUri, ""));
    //       if (extname(path) == ".ts") return;
    //       if (path !== url.pathname) {
    //         return `${url.origin}${path}?ts=${cacheBuster}`;
    //       }
    //     },
    //     cache,
    //   );

    //   if (link) {
    //     //@ts-ignore any
    //     headers.link = link;
    //   }

    //   //@ts-ignore any
    //   return new Response(js, { headers });
    // };

    // // jsx
    // const jsx = `${dir}${jsxify(url.pathname)}`;
    // if (transpile.has(jsx)) {
    //   return await transpilation(jsx);
    // }

    // // tsx
    // const tsx = `${dir}${tsxify(url.pathname)}`;
    // if (transpile.has(tsx)) {
    //   return await transpilation(tsx);
    // }
  };

  console.log(`Micro running ${root}`);
  return serve(handler, { port: Number(port) });
};

export default server;
