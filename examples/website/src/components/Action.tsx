import Icon from "./Icon.tsx";

interface Props {
  title: string;
  subtitle: string;
  action: string;
  href: string;
}

function Action({ title, subtitle, action, href }: Props) {
  return (
    <section className="py-8 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-24">
      <div className="max-w-6xl px-4 mx-auto border-solid lg:px-12">
        <div className="flex flex-col items-start leading-7 text-gray-900 border-0 border-gray-200 lg:items-center lg:flex-row">
          <div className="box-border flex-1 text-center border-solid sm:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 m-0 leading-tight text-left border-0 border-gray-200 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-left text-base text-gray-500 border-0 border-gray-200 sm:text-2xl">
              {subtitle}
            </p>
          </div>
          <a
            href={href}
            className="inline-flex items-center justify-center w-full px-5 py-4 mt-6 ml-0 font-sans text-base leading-none text-white no-underline bg-indigo-500 border border-indigo-500 border-solid rounded cursor-pointer md:w-auto lg:mt-0 hover:bg-indigo-700 hover:border-indigo-700 hover:text-white focus-within:bg-indigo-700 focus-within:border-indigo-700 focus-within:text-white sm:text-lg lg:ml-6 md:text-xl"
          >
            <span className="px-2">{action}</span>
            <Icon
              name="arrow-right"
              strokeWidth="0.5"
              width="24px"
              height="24px"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Action;
