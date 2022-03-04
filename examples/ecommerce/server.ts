import { server } from "../../packages/micro/server.ts";
import importmap from "./importmap.json" assert { type: "json" };

server({
  importmap,
});
