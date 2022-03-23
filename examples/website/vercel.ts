#!/usr/bin/env deno task start
/** Deploy to Vercel */
import { getHandler } from "../../packages/micro/server.ts";

export default getHandler
