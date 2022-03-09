import { server } from "../../packages/micro/server.ts"

server({
  tsconfig: '../../tsconfig.json',
  root: '.'
});
