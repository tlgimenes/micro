import { useProduct } from "../../hooks/useProduct.ts";

interface Props {
  params: {
    slug: string;
  };
}

export function Head({ params: { slug } }: Props) {
  const product = useProduct(slug);

  return (
    <>
      <meta name="robots" content="index,follow" />
      <title>{product.name}</title>
    </>
  );
}

export function Main({ params: { slug } }: Props) {
  const product = useProduct(slug);
  const image = product.images[0];

  return (
    <>
      <div>{product.name}</div>
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          width="500px"
          height="500px"
        />
      )}
    </>
  );
}
