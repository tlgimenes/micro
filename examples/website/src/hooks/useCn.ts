import { useMemo } from "react";

export const useCn = (...classNames: string[]) =>
  useMemo(
    () => {
      const classes = classNames.flatMap((cn) => cn.split(" "));

      return Array.from(new Set(classes)).join(" ");
    },
    [classNames],
  );
