import { Link as WouterLink } from "wouter";

import type { ComponentProps } from "react";

type Props = ComponentProps<typeof WouterLink>;

function Link(props: Props) {
  if (props.href.startsWith("http")) {
    return <a {...props} />;
  }

  return <WouterLink {...props} />;
}

export default Link;
