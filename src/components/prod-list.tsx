import { useState, useEffect } from "react";
import PbItem from "./cards/pb-item.tsx";
import { ShowMore } from "./showmore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { ScrollArea } from "@components/ui/scroll-area";
import type { Business } from "types.ts";
import { Filter } from "lucide-react";

type Brand = Business<"dealer" | "distributor">["brands"];

interface Props {
  brands: Brand;
  isOwner?: boolean;
}

const ProdList = ({ brands, isOwner = false }: Props) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<Brand>(brands);
  const [visibleBrands, setVisibleBrands] = useState(4);

  useEffect(() => {
    const filteredProducts = brands
      .filter(
        (brand) =>
          selectedBrands.length === 0 || selectedBrands.includes(brand.slug)
      )
      .map((brand) => ({
        ...brand,
        products: brand.products.filter(
          (product) =>
            selectedProducts.length === 0 ||
            selectedProducts.includes(product.slug)
        ),
      }));
    setFiltered(filteredProducts);
  }, [selectedBrands, selectedProducts, brands]);

  const handleBrandToggle = (brandSlug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandSlug)
        ? prev.filter((b) => b !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  const handleProductToggle = (productSlug: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productSlug)
        ? prev.filter((p) => p !== productSlug)
        : [...prev, productSlug]
    );
  };
  const brandsList = Array.from(new Set(brands.map((b) => b.slug)));
  const productsList = Array.from(
    new Set(brands.map((b) => b.products.map((p) => p.slug)).flat())
  );

  return (
    <div className="w-full px-4 xs:px-8 md:px-14 py-8">
      <div className="flex flex-row items-center justify-between w-full gap-2 pb-4 border-b border-gray-100 mb-4 flex-nowrap overflow-hidden">
        <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold font-gr truncate min-w-0 flex-shrink">
          Our Catalog
        </p>
        <div className="flex items-center gap-1.5 xs:gap-3 flex-shrink-0">
          {isOwner && (
            <a
              href="/catalog-update"
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 xs:px-4 py-1.5 rounded-sm hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-3.5 h-3.5 xs:w-4 xs:h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold uppercase tracking-tight">
                <span className="hidden sm:inline">Manage Catalog</span>
                <span className="inline sm:hidden">Manage</span>
              </span>
            </a>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <button className="border flex gap-1 xs:gap-2 items-center border-black/50 rounded-sm px-2 xs:px-4 py-1.5 bg-white hover:bg-gray-50 transition flex-shrink-0">
                <span className="text-black/50 text-[10px] xs:text-xs sm:text-sm font-medium uppercase">
                  {" "}
                  Filter{" "}
                </span>
                <Filter
                  className="h-3 w-3 xs:h-4 xs:h-4"
                  fill="black"
                  opacity="0.5"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Settings</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="brands" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="brands">Brands</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                <TabsContent value="brands">
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {brandsList.map((brandSlug) => (
                      <div
                        key={brandSlug}
                        className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`brand-${brandSlug}`}
                          checked={selectedBrands.includes(brandSlug)}
                          onCheckedChange={() => handleBrandToggle(brandSlug)}
                        />
                        <Label
                          htmlFor={`brand-${brandSlug}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {brands.find((b) => b.slug === brandSlug)?.name}
                        </Label>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="products">
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {productsList.map((productSlug) => (
                      <div
                        key={productSlug}
                        className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`product-${productSlug}`}
                          checked={selectedProducts.includes(productSlug)}
                          onCheckedChange={() =>
                            handleProductToggle(productSlug)
                          }
                        />
                        <Label
                          htmlFor={`product-${productSlug}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {
                            brands
                              .flatMap((b) => b.products)
                              .find((p) => p.slug === productSlug)?.name
                          }
                        </Label>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedProducts([]);
                  }}>
                  Reset
                </Button>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      console.log("Selected Brands:", selectedBrands);
                      console.log("Selected Products:", selectedProducts);
                    }}>
                    Apply Filters
                  </Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full flex-col flex py-8 gap-10 md:gap-20 place-items-center">
        {Object.values(filtered)
          .slice(0, visibleBrands)
          .map((brand, idx, arr) => {
            const extendedList = brand.products.slice(4);

            return (
              <div key={brand.slug} className="w-full space-y-4">
                {/* brand block */}
                <div className="w-full space-y-1">
                  <div className="w-full flex items-center justify-center">
                    <div className="flex items-center justify-center w-[100px] sm:w-[160px] h-auto pb-5">
                      <img
                        src={brand.image || "/imgg.png"}
                        alt={brand.name}
                        className="sm:w- rounded-md object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="w-full flex max-sm:flex-col max-sm:justify-center">
                    <div className="w-full flex flex-wrap justify-center md:justify-start gap-8 md:gap-10">
                      {brand.products.slice(0, 4).map((product) => (
                        <PbItem
                          type="product"
                          size="dd"
                          key={product.slug}
                          pb={product}
                        />
                      ))}

                      {extendedList.length > 0 &&
                        extendedList.map((product) => (
                          <PbItem
                            size="dd"
                            key={product.slug}
                            pb={product}
                            type="product"
                            className={`extended-list-prods-${brand.slug} hidden`}
                          />
                        ))}
                    </div>
                  </div>

                  {extendedList.length > 0 && (
                    <ShowMore
                      onClick={(isShow: boolean) => {
                        const extendedList = document.querySelectorAll(
                          `.extended-list-prods-${brand.slug}`
                        );
                        extendedList.forEach((prod) => {
                          prod.classList.toggle("hidden", isShow);
                        });
                      }}
                      className="flex items-center gap-2 text-black font-medium px-3 py-1.5"
                      type="black"
                    />
                  )}
                </div>

                {/* separator: only between brands */}
                {idx < arr.length - 1 && (
                  <div className="bg-gradient-to-r from-transparent via-[#003da6] to-transparent h-0.5 w-full" />
                )}
              </div>
            );
          })}
        {Object.values(filtered).length > 4 && (
          <div className="mt-4 flex gap-3">
            {/* Show fewer / reset */}
            {visibleBrands > 4 && (
              <button
                className="px-4 py-2 rounded-md border border-black/40 text-sm font-medium hover:bg-black/5 transition-colors"
                onClick={() => setVisibleBrands(4)}>
                Fewer Brands
              </button>
            )}

            {/* Show more */}
            {Object.values(filtered).length > visibleBrands && (
              <button
                className="px-4 py-2 rounded-md border border-black/40 text-sm font-medium hover:bg-black/5 transition-colors"
                onClick={() => setVisibleBrands((prev) => prev + 4)}>
                More Brands
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdList;
