import useSWR from "swr";

interface Product {
  name: string;
  images: Array<{ src: string; alt: string }>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetcher = async (slug: string): Promise<Product> => {
  await sleep(1e3);

  return {
    name: slug,
    images: [],
  };
};

export const useProduct = (slug: string) => {
  const { data, error } = useSWR(slug, fetcher);

  if (error || !data) {
    throw error;
  }

  return data;
};
