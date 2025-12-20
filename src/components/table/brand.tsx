import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import type { Brand } from "types";
import { DataTableW } from ".";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { useState } from "react";

export type BrandTable = Omit<
  Brand,
  "products" | "dealers" | "distributors" | "moreBrands"
> & {
  id: number;
  products: (Omit<Brand["products"][number], "dealers" | "distributors"> & {
    id: number;
  })[];
};
interface EditDialogProps {
  brand: BrandTable;
  onSave: (brand: BrandTable) => void;
  onClose: () => void;
  allProducts: BrandTable["products"];
}
const columns = (handleEdit: (brand: BrandTable) => void) => {
  const columns: ColumnDef<BrandTable>[] = [
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
        <p className="max-w-[600px]">{row.getValue("description")}</p>
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
        const brand = row.original;
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
              <DropdownMenuItem onClick={() => handleEdit(brand)}>
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

function EditDialog({ brand, onSave, onClose, allProducts }: EditDialogProps) {
  const [editedBrand, setEditedBrand] = useState<BrandTable>({
    ...brand,
    products: [...brand.products],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedBrand((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (product: BrandTable["products"][number]) => {
    setEditedBrand((prev) => {
      const isProductLinked = prev.products.some((p) => p.id === product.id);
      if (isProductLinked) {
        return {
          ...prev,
          products: prev.products.filter((p) => p.id !== product.id),
        };
      } else {
        return { ...prev, products: [...prev.products, product] };
      }
    });
  };

  const handleSave = () => {
    onSave(editedBrand);
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
              value={editedBrand.name}
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
              value={editedBrand.description || ""}
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
              value={editedBrand.image}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Products</Label>
            <div className="col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={editedBrand.products.some(
                      (p) => p.id === product.id
                    )}
                    onCheckedChange={() => handleProductToggle(product)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 object-cover"
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {product.name}
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
  initProducts,
}: {
  data: BrandTable[];
  initProducts: BrandTable["products"];
}) {
  const [brands, setBrands] = useState<BrandTable[]>(data);
  const [editBrand, setEditBrand] = useState<BrandTable | null>(null);
  const [allProducts] = useState<BrandTable["products"]>(initProducts);

  const handleEdit = (brand: BrandTable) => {
    setEditBrand(brand);
  };

  const handleSave = (updatedBrand: BrandTable) => {
    setBrands(
      brands.map((brand) =>
        brand.id === updatedBrand.id ? updatedBrand : brand
      )
    );
    setEditBrand(null);
  };
  return (
    <div>
      <DataTableW columns={columns(handleEdit)} data={data}>
        <Button
          variant="outline"
          onClick={() =>
            handleEdit({
              id: brands.length + 1,
              name: "",
              description: "",
              slug: "",
              image: "",
              products: [],
            })
          }>
          <Plus className="w-4 h-4" />
          <span>Add new brand</span>
        </Button>
      </DataTableW>
      {editBrand && (
        <EditDialog
          brand={editBrand}
          onSave={handleSave}
          allProducts={allProducts}
          onClose={() => setEditBrand(null)}
        />
      )}
    </div>
  );
}
