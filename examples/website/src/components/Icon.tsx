interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
}

function Icon({ name, ...rest }: Props) {
  return (
    <svg {...rest}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}

export default Icon;
