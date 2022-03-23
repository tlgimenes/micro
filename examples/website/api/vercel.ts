#!/usr/bin/env deno run --no-check --unstable

import { getHandler } from "../../../packages/micro/server.ts";

const handler = await getHandler()

export default handler
