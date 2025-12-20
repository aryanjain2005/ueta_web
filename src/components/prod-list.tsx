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
}

const ProdList = ({ brands }: Props) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<Brand>(brands);

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
    <div className="w-full px-8 md:px-14 py-8">
      <div className="max-sm:flex-col flex w-full justify-between sm:px-8 py-2 gap-2 md:gap-4 max-sm:items-end">
        <p className="text-4xl font-extrabold font-gr max-sm:w-full">
          Products With Brand
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <button className="border flex gap-2 items-center border-black/50 rounded-sm w-fit px-4 py-1">
              <span className="text-black/50"> Filter </span>
              <Filter className="h-5 w-5" fill="black" opacity="0.5" />
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
                        onCheckedChange={() => handleProductToggle(productSlug)}
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
      <div className="w-full flex-col flex px-8 md:px-14 py-8 gap-10 md:gap-20 place-items-center">
        {Object.values(filtered).map((brand) => {
          const extendedList = brand.products.slice(4);
          return (
            <div className="w-full space-y-1">
              <div className="flex items-center justify-center w-[100px]  ">
                <img
                  src={brand.image || "/imgg.png"}
                  alt={brand.name}
                  className="rounded-md  object-cover"
                  loading="lazy"
                />
              </div>
              <div className="w-full flex flex-wrap gap-8 md:gap-10 ">
                {brand.products.slice(0, 4).map((product) => (
                  <PbItem
                    type="product"
                    size="normal"
                    key={product.slug}
                    pb={product}
                  />
                ))}
                {extendedList.length > 0 &&
                  extendedList.map((product) => (
                    <PbItem
                      size="normal"
                      key={product.slug}
                      pb={product}
                      type="product"
                      className={`extended-list-prods-${brand.slug} hidden`}
                    />
                  ))}
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
          );
        })}
      </div>
    </div>
  );
};

export default ProdList;
