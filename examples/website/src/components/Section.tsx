import { PropsWithChildren, HTMLAttributes } from "react";
import { useCn } from "../hooks/useCn.ts";

export type Props = HTMLAttributes<HTMLDivElement>;

function Section({
  children,
  className = "",
  ...rest
}: PropsWithChildren<Props>) {
  const clx = useCn(className, "w-full px-4 py-32");

  return (
    <section className={clx} {...rest}>
      {children}
    </section>
  );
}

export default Section;
