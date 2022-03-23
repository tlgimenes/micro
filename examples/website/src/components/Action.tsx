import { Link } from "wouter";

import { useCn } from "../hooks/useCn.ts";
import Section, { Props as SectionProps } from "./Section.tsx";

interface Link {
  name: string;
  href: string;
}

interface Props extends SectionProps {
  title: string;
  subtitle: string;
  links: [Link | undefined, Link | undefined];
}

function Action({ title, subtitle, links, ...rest }: Props) {
  return (
    <Section
      {...rest}
      className={useCn(
        "flex flex-col items-center justify-center gap-2 sm:gap-4",
        rest.className ?? ""
      )}
    >
      <span className="text-3xl font-bold sm:text-5xl">{title}</span>
      <span className="text-gray-700 sm:text-xl">{subtitle}</span>

      <div className="flex items-center justify-center my-4 w-full">
        {links[0] && (
          <Link
            href={links[0].href}
            className="text-center w-full sm:w-36 px-5 py-3 mx-2 rounded hover:bg-indigo-700 bg-indigo-600 text-white"
          >
            {links[0].name}
          </Link>
        )}

        {links[1] && (
          <Link
            href={links[1].href}
            className="text-center w-full sm:w-36 max-w-md px-5 py-3 mx-2 rounded hover:bg-slate-300 bg-slate-200 text-indigo-600 "
          >
            {links[1].name}
          </Link>
        )}
      </div>
    </Section>
  );
}

export default Action;
