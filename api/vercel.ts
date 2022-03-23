#!/usr/bin/env DENO_DIR=/tmp deno run --no-check --unstable --include-files=../../**/*

import { getHandler } from "../packages/micro/server.ts";

const handler = await getHandler({
  root: 'examples/website'
})

export default handler
