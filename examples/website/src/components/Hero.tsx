import Section, { Props as SectionProps } from "./Section.tsx";

interface Props extends SectionProps {
  title: string;
  subtitle: string;
  action: string;
  link: string;
}

function Hero({ title, subtitle, action, link, ...rest }: Props) {
  return (
    <Section {...rest}>
      <div className="container max-w-lg mx-auto text-left md:max-w-none md:text-center">
        <h1 className="text-5xl font-extrabold text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl">
          <span className="block">Micro.ts</span>
          <span className="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500 md:inline-block">
            {title}
          </span>
        </h1>
        <div className="mx-auto mt-5 text-gray-700 md:mt-12 md:max-w-lg md:text-center lg:text-lg">
          {subtitle}
        </div>
        <div className="flex flex-col items-center mt-12 text-center">
          <span className="relative inline-flex w-full md:w-auto">
            <a
              href={link}
              type="button"
              className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-indigo-500 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              {action}
            </a>
          </span>
        </div>
      </div>
    </Section>
  );
}

export default Hero;
