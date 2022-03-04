export type Importmap = { imports: Record<string, unknown> };

export type HtmlProps = {
  importmap: Importmap;
  url: URL;
};
