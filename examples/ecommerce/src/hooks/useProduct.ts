import { useMemo } from "react";
import useSWR from "swr";

export interface Product {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  brandImageUrl: null;
  linkText: string;
  productReference: string;
  productReferenceCode: string;
  categoryId: string;
  productTitle: string;
  metaTagDescription: string;
  releaseDate: Date;
  clusterHighlights: ClusterHighlights;
  productClusters: ClusterHighlights;
  searchableClusters: ClusterHighlights;
  categories: string[];
  categoriesIds: string[];
  link: string;
  description: string;
  items: Item[];
}

export interface ClusterHighlights {
}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: ReferenceId[];
  measurementUnit: string;
  unitMultiplier: number;
  modalType: null;
  isKit: boolean;
  images: Image[];
  sellers: Seller[];
  videos: any[];
  estimatedDateArrival: null;
}

export interface Image {
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
  imageLastModified: Date;
}

export interface ReferenceId {
  key: string;
  value: string;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

export interface CommertialOffer {
  deliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion;
  installments: Installment[];
  discountHighLight: any[];
  giftSkuIds: any[];
  teasers: any[];
  buyTogether: any[];
  itemMetadataAttachment: any[];
  price: number;
  listPrice: number;
  priceWithoutDiscount: number;
  rewardValue: number;
  priceValidUntil: Date;
  availableQuantity: number;
  isAvailable: boolean;
  tax: number;
  saleChannel: number;
  deliverySlaSamples: DeliverySlaSample[];
  getInfoErrorMessage: null;
  cacheVersionUsedToCallCheckout: string;
  paymentOptions: PaymentOptions;
}

export interface DeliverySlaSample {
  deliverySlaPerTypes: any[];
  region: null;
}

export interface DeliverySlaSamplesPerRegion {
  the0: DeliverySlaSample;
}

export interface Installment {
  value: number;
  interestRate: number;
  totalValuePlusInterestRate: number;
  numberOfInstallments: number;
  paymentSystemName: string;
  paymentSystemGroupName: string;
  name: string;
}

export interface PaymentOptions {
  installmentOptions: InstallmentOption[];
  paymentSystems: PaymentSystem[];
  payments: any[];
  giftCards: any[];
  giftCardMessages: any[];
  availableAccounts: any[];
  availableTokens: any[];
}

export interface InstallmentOption {
  paymentSystem: string;
  bin: null;
  paymentName: string;
  paymentGroupName: string;
  value: number;
  installments: InstallmentElement[];
}

export interface InstallmentElement {
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
  sellerMerchantInstallments?: InstallmentElement[];
  id?: string;
}

export interface PaymentSystem {
  id: number;
  name: string;
  groupName: string;
  validator: null;
  stringId: string;
  template: string;
  requiresDocument: boolean;
  isCustom: boolean;
  description: null | string;
  requiresAuthentication: boolean;
  dueDate: Date;
  availablePayments: null;
}

const fetcher = async (slug: string) => {
  const response = await fetch(
    `https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/products/search/${slug}/p`,
  );

  if (response.ok) {
    return response.json();
  }

  console.error(response);

  throw new Error(await response.text());
};

const parseSlug = (slug: string) => {
  const segments = slug.split("-");
  const productGroupSlug = segments.slice(0, -1).join("-");
  const productId = segments.pop();

  return {
    productGroupSlug,
    productId,
  };
};

export const useProduct = (slug: string) => {
  const { productGroupSlug, productId } = useMemo(() => parseSlug(slug), [
    slug,
  ]);
  const { data, error } = useSWR<Product[]>(productGroupSlug, fetcher);

  if (error || !data) {
    throw error;
  }

  return useMemo(() => {
    const [productGroup] = data;

    const item = productGroup.items.find((item) => item.itemId === productId);

    if (!item) {
      throw new Error(`Product not found: ${productId}`);
    }

    return item;
  }, [data]);
};
