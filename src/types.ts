export type Product = {
  name: string;
  description: string | null;
  image: string;
  slug: string;
  brands: (Omit<
    Brand,
    "moreBrands" | "products" | "dealers" | "distributors"
  > & {
    dealers: Omit<Business<"dealer">, "products" | "brands">[];
    distributors: Omit<Business<"distributor">, "products" | "brands">[];
  })[];
  dealers: Omit<Business<"dealer">, "products" | "brands">[];
  distributors: Omit<Business<"distributor">, "products" | "brands">[];
  moreProducts: Omit<
    Product,
    "description" | "brands" | "dealers" | "distributors" | "moreProducts"
  >[];
};

export type Brand = {
  name: string;
  description: string | null;
  image: string;
  slug: string;
  products: (Omit<
    Product,
    "moreProducts" | "brands" | "dealers" | "distributors"
  > & {
    dealers: Omit<Business<"dealer">, "products" | "brands">[];
    distributors: Omit<Business<"distributor">, "products" | "brands">[];
  })[];
  dealers: Omit<Business<"dealer">, "products" | "brands">[];
  distributors: Omit<Business<"distributor">, "products" | "brands">[];
  moreBrands: Omit<
    Brand,
    "description" | "products" | "dealers" | "distributors" | "moreBrands"
  >[];
};

export type Business<T extends "dealer" | "distributor"> = {
  type: T;
  name: string;
  shopName: string;
  location: string | null;
  address: string | null;
  slug: string;
  image: string | null;
  shopImages: string[] | null;
  contact: {
    type: "phone" | "email" | "whatsapp" | "facebook" | "instagram";
    value: string;
  }[];
  products?: (Omit<
    Product,
    "moreProducts" | "dealers" | "distributors" | "brands"
  > & {
    brands: Omit<
      Brand,
      "products" | "dealers" | "distributors" | "moreBrands"
    >[];
  })[];
  brands: (Omit<
    Brand,
    "moreBrands" | "dealers" | "distributors" | "products"
  > & {
    products: Omit<
      Product,
      "brands" | "dealers" | "distributors" | "moreProducts"
    >[];
  })[];
};
