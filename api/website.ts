#!/usr/bin/env DENO_DIR=/tmp deno run --allow-net --allow-read --allow-env --unstable --no-check --include-files=../**/*
export { default } from '../examples/website/vercel.ts'
