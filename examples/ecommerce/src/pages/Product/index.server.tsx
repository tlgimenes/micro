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
      <title>{product.nameComplete}</title>
    </>
  );
}

export function Main({ params: { slug } }: Props) {
  const product = useProduct(slug);

  return (
    <>
      <div>{product.nameComplete}</div>
      <img
        src={product.images[0].imageUrl}
        width="500px"
        height="500px"
      >
      </img>
    </>
  );
}
