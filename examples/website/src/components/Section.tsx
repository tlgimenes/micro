import type { PropsWithChildren, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

function Section({ children, ...rest }: PropsWithChildren<Props>) {
  return (
    <section className="w-full" {...rest}>
      {children}
    </section>
  );
}

export default Section;
