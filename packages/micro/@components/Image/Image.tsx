import { useImage } from "./useImage.ts";
import type { Options } from "./useImage.ts";

export type Props = Options;

function Image(props: Props) {
  const imgProps = useImage(props);

  return <img {...imgProps} />;
}

export default Image
