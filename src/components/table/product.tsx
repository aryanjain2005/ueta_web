import { DataTableW } from ".";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";

import type { Product } from "types";

export type ProductTable = Omit<
  Product,
  "dealers" | "distributors" | "moreProducts" | "brands"
> & {
  id: number;
  brands: (Omit<Product["brands"][number], "dealers" | "distributors"> & {
    id: number;
  })[];
};
interface EditDialogProps {
  product: ProductTable;
  onSave: (brand: ProductTable) => void;
  onClose: () => void;
  allBrands: ProductTable["brands"];
}
const columns = (handleEdit: (product: ProductTable) => void) => {
  const columns: ColumnDef<ProductTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "id",
      accessorKey: "id",
      header: "Id",
    },
    {
      id: "name",
      accessorKey: "name",
      header: "name",
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="max-w-[600px]">{row.getValue("description")}</span>
      ),
    },
    {
      id: "slug",
      accessorKey: "slug",
      header: "Slug",
      maxSize: 200,
    },
    {
      id: "image",
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img src={row.getValue("image")} alt="" className="w-16" />
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="w-4 h-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};

export function EditDialog({
  product,
  onSave,
  onClose,
  allBrands,
}: EditDialogProps) {
  const [editedProduct, setEditedProduct] = useState<ProductTable>({
    ...product,
    brands: [...product.brands],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (brand: ProductTable["brands"][number]) => {
    setEditedProduct((prev) => {
      const isBrandLinked = prev.brands.some((b) => b.id === brand.id);
      if (isBrandLinked) {
        return {
          ...prev,
          brands: prev.brands.filter((b) => b.id !== brand.id),
        };
      } else {
        return { ...prev, brands: [...prev.brands, brand] };
      }
    });
  };

  const handleSave = () => {
    onSave(editedProduct);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={editedProduct.description || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input
              id="image"
              name="image"
              value={editedProduct.image}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Brands</Label>
            <div className="col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allBrands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={editedProduct.brands.some(
                      (p) => p.id === brand.id
                    )}
                    onCheckedChange={() => handleProductToggle(product)}
                  />
                  <div className="grid gap-1.5 leading-none w-8">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className=" object-cover"
                    />
                    <label
                      htmlFor={`product-${brand.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {brand.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DataTable({
  data,
  initBrands,
}: {
  data: ProductTable[];
  initBrands: ProductTable["brands"];
}) {
  const [products, setProducts] = useState<ProductTable[]>(data);
  const [editProduct, setEditProduct] = useState<ProductTable | null>(null);
  const [allBrands] = useState<ProductTable["brands"]>(initBrands);

  const handleEdit = (product: ProductTable) => {
    setEditProduct(product);
  };

  const handleSave = (upDatedProduct: ProductTable) => {
    setProducts(
      products.map((product) =>
        product.id === upDatedProduct.id ? upDatedProduct : product
      )
    );
    setEditProduct(null);
  };
  return (
    <>
      <DataTableW columns={columns(handleEdit)} data={products}>
        <Button
          variant="outline"
          onClick={() =>
            handleEdit({
              id: products.length + 1,
              name: "",
              description: "",
              slug: "",
              image: "",
              brands: [],
            })
          }>
          <Plus className="w-4 h-4" />
          <span>Add new Product</span>
        </Button>
      </DataTableW>
      {editProduct && (
        <EditDialog
          product={editProduct}
          onSave={handleSave}
          onClose={() => setEditProduct(null)}
          allBrands={allBrands}
        />
      )}
    </>
  );
}
