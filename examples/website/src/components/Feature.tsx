import Icon from "./Icon.tsx";

interface CommonProps {
  title: string;
  subtitle: string;
  features: string[];
  icon: string;
}

function Left({ title, subtitle, features, icon }: CommonProps) {
  return (
    <>
      <div className="relative w-full max-w-md px-4 mt-5 mb-4 -ml-5 text-center bg-no-repeat bg-contain border-solid md:ml-0 md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 xl:pl-10">
        <Icon
          name={icon}
          className="w-full h-full text-indigo-500"
          strokeWidth="0.75"
        />
      </div>

      <div className="order-first w-full text-black border-solid md:w-1/2 md:pl-10 md:order-none">
        <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
          {title}
        </h2>
        <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
          {subtitle}
        </p>
        <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
          {features.map((feature, index) => (
            <li
              key={index}
              className="relative py-1 pl-0 text-left text-gray-500 border-solid"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-indigo-600 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Right({ title, subtitle, features, icon }: CommonProps) {
  return (
    <>
      <div className="w-full text-black border-solid md:w-1/2 md:pl-6 xl:pl-32">
        <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
          {title}
        </h2>
        <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-10 lg:text-lg">
          {subtitle}
        </p>
        <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
          {features.map((feature, index) => (
            <li
              key={index}
              className="relative py-1 pl-0 text-left text-gray-500 border-solid"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-indigo-600 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative w-full max-w-md px-4 mt-10 mb-4 text-center bg-no-repeat bg-contain border-solid md:mt-0 md:max-w-none lg:mb-0 md:w-1/2">
        <Icon
          name={icon}
          className="w-full h-full text-indigo-500"
          strokeWidth="0.75"
        />
      </div>
    </>
  );
}

interface Props extends CommonProps {
  variant: "left" | "right";
}

function Feature({ variant, ...rest }: Props) {
  return (
    <div className="my-16 flex flex-col items-center content-center px-8 mx-auto leading-6 text-black border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
      {variant === "left" ? <Left {...rest} /> : <Right {...rest} />}
    </div>
  );
}

export default Feature;
