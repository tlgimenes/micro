#!/usr/bin/env DENO_DIR=/tmp deno run --no-check --unstable --include-files=../../**/*

import { getHandler } from "../../../packages/micro/server.ts";

const handler = await getHandler()

export default handler
