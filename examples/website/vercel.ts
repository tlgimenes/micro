import { getHandler } from "../../packages/micro/server.ts";

const handler = await getHandler({
  root: import.meta.url,
});

export default handler;
