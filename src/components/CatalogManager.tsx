import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Checkbox } from "@components/ui/checkbox";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { ScrollArea } from "@components/ui/scroll-area";
import { PlusCircle, Loader2, Save } from "lucide-react";

interface CatalogManagerProps {
  currentCatalog: any[];
}

export default function CatalogManager({
  currentCatalog,
}: CatalogManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [masterBrands, setMasterBrands] = useState<any[]>([]);
  const [masterProducts, setMasterProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string[]> = {};
      currentCatalog.forEach((b) => {
        if (b.slug) {
          initial[b.slug] = b.products.map((p: any) => p.slug);
        }
      });
      setSelected(initial);
    }
  }, [currentCatalog, isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [brandRes, prodRes] = await Promise.all([
        fetch("/api/brand/getBrands"),
        fetch("/api/product/getProducts"),
      ]);
      const brands = await brandRes.json();
      const products = await prodRes.json();
      setMasterBrands(brands);
      setMasterProducts(products);
    } catch (err) {
      // Silent error handling for production
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/business/update-catalog", {
        method: "POST",
        body: JSON.stringify({ catalog: selected }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsOpen(false);
        window.location.reload();
      } else {
        alert("Failed to update catalogue. Please try again.");
      }
    } catch (err) {
      alert("A network error occurred.");
    }
  };

  const toggleBrand = (slug: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[slug]) {
        delete next[slug];
      } else {
        next[slug] = [];
      }
      return next;
    });
  };

  const toggleProduct = (brandSlug: string, productSlug: string) => {
    setSelected((prev) => {
      const currentBrandProducts = prev[brandSlug] || [];
      const isSelected = currentBrandProducts.includes(productSlug);

      const nextProducts = isSelected
        ? currentBrandProducts.filter((s) => s !== productSlug)
        : [...currentBrandProducts, productSlug];

      return { ...prev, [brandSlug]: nextProducts };
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) loadData();
      }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full gap-2 border-black hover:bg-black hover:text-white transition-all">
          <PlusCircle className="h-4 w-4" /> Edit Catalog
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Manage Business Catalogue
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Select the brands you sell and their products.
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            {masterBrands.map((brand) => {
              const isChecked = !!selected[brand.slug];
              return (
                <div
                  key={brand.slug}
                  className="mb-4 border rounded-xl overflow-hidden">
                  <div
                    className={`p-4 flex items-center gap-3 ${
                      isChecked ? "bg-blue-50/50" : ""
                    }`}>
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleBrand(brand.slug)}
                    />
                    <Label
                      htmlFor={`brand-${brand.slug}`}
                      className="font-bold flex-1 cursor-pointer py-1">
                      {brand.name}
                    </Label>
                  </div>

                  {isChecked && (
                    <div className="p-4 grid grid-cols-2 gap-3 border-t bg-gray-50">
                      {masterProducts.map((prod) => (
                        <div
                          key={`${brand.slug}-${prod.slug}`}
                          className="flex items-center gap-2">
                          <Checkbox
                            id={`p-${brand.slug}-${prod.slug}`}
                            checked={selected[brand.slug]?.includes(prod.slug)}
                            onCheckedChange={() =>
                              toggleProduct(brand.slug, prod.slug)
                            }
                          />
                          <Label
                            htmlFor={`p-${brand.slug}-${prod.slug}`}
                            className="text-xs cursor-pointer flex-1 py-1">
                            {prod.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollArea>
        )}

        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            className="w-full bg-black text-white h-12 gap-2">
            <Save className="h-4 w-4" /> Save and Update Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
