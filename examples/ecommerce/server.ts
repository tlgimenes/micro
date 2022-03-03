import { server } from "micro/server";
import importmap from "../../importmap.json" assert { type: "json" };

server({
  importmap,
  dir: './'
});
