import React from "react";
import type { PropsWithChildren } from "react";

export const rootId = "__micro_root"

function Main({ children }: PropsWithChildren<unknown>) {
  return <div id={rootId}>{children}</div>;
}

export default Main
