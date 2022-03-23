#!/usr/bin/env DENO_DIR=/tmp deno task start
/** Deploy to Vercel */
import { getHandler } from "../../packages/micro/server.ts";

export default getHandler
