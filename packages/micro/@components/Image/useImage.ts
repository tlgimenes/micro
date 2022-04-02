import { DetailedHTMLProps, useMemo } from "react";
export interface Options extends
  DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  alt: string;
  src: string;
  width: number;
  height: number;
}

const FACTORS = [1, 2, 3];
const LARGEST = FACTORS[FACTORS.length - 1];

export const IMAGES_PATH = "/__micro/images";

const rescale = (src: string, width: number, height: number) => {
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    src,
  });

  return `${IMAGES_PATH}?${params.toString()}`;
};

export const useImage = (
  { src: origin, height, width, ...rest }: Options,
) => {
  const { srcSet, src } = useMemo(() => {
    const srcSet = FACTORS.map((factor) => {
      const w = width * factor;
      const h = height * factor;

      return `${rescale(origin, w, h)} ${w}w`;
    });

    const largest = rescale(
      origin,
      width * LARGEST,
      height * LARGEST,
    );

    return {
      srcSet: srcSet.join(", "),
      src: largest,
    };
  }, [origin, height, width]);

  return {
    ...rest,
    srcSet,
    src: src,
    sizes: rest.sizes ?? "100vw",
    height: `${height}px`,
    width: `${width}px`,
  };
};
