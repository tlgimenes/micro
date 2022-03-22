import Icon from "./Icon.tsx";
import Section, { Props as SectionProps } from "./Section.tsx";

interface Feature {
  variant: "right" | "left";
  title: string;
  subtitle: string;
  highlights: string[];
  icon: string;
}

function Feature({
  variant = "left",
  highlights,
  subtitle,
  title,
  icon,
}: Feature) {
  return (
    <div
      className={`flex flex-wrap my-20 gap-4 items-center sm:flex-nowrap sm:justify-center ${
        variant === "right" ? "sm:flex-row-reverse" : "flex-row"
      }`}
    >
      <Icon
        className="text-indigo-600 w-full sm:max-w-sm"
        name={icon}
        strokeWidth="0.75"
        width={150}
        height={150}
      />

      <div className="flex flex-col gap-2 w-full items-start sm:max-w-sm sm:items-center">
        <h2 className="text-gray-900 text-2xl font-semibold">{title}</h2>
        <h3 className="text-gray-700">{subtitle}</h3>
        <ul>
          {highlights.map((highlight, index) => (
            <li key={index} className="text-gray-700 my-2">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-indigo-600 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface Props extends SectionProps {
  features: Omit<Feature, "variant">[];
}

function Features({ features, ...rest }: Props) {
  return (
    <Section {...rest}>
      {features.map((feature, index) => (
        <Feature
          key={feature.title}
          variant={index % 2 ? "left" : "right"}
          {...feature}
        />
      ))}
    </Section>
  );
}

export default Features;
