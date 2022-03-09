import { server } from "../../packages/micro/server.ts"

const __dirname = new URL('.', import.meta.url).pathname

server({
  root: __dirname,
  importmap: './importmap.json', // path relative to root
  tsconfig: './tsconfig.json', // path relative to root
});
