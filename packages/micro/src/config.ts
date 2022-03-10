import { path } from "../deps.ts";
import { readImportmap } from './importmap.ts';
import { readTSConfig } from "./tsconfig.ts";

export const getConfig = async (
  root: string,
  href: string,
  importmap: string,
  tsconfig: string,
) => ({
  root: path.resolve(root),
  href,
  importmap: await readImportmap(importmap),
  tsconfig: await readTSConfig(tsconfig),
});

type PromiseType<T> = T extends Promise<infer K> ? K : never

export type MicroConfig = PromiseType<ReturnType<typeof getConfig>>
