import type { PropsWithChildren } from 'react';

export type Importmap = { imports: Record<string, unknown> };

export type HtmlProps = PropsWithChildren<{
  importmap: Importmap
  url: URL
}>
