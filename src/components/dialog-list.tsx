import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Phone } from "lucide-react";
import type { Product } from "types";

export function DDListDialog({
  dealers,
  distributors,
  children,
  product,
  brand,
}: {
  product: {
    name: string;
    slug: string;
  };
  brand: {
    name: string;
    slug: string;
  };
  dealers: Product["dealers"];
  distributors: Product["distributors"];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-lg ">
        <div className="space-y-6 pt-5">
          {dealers.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <DialogTitle>
                  Dealers of {brand.name} - {product.name}
                </DialogTitle>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  {dealers.length || ""}
                </span>
              </div>
              <div className="space-y-4">
                {dealers.map((dealer, index) => {
                  const contactInfo =
                    dealer.contact &&
                    dealer.contact.find((c) => c.type === "phone")?.value;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between">
                      <a
                        target="_blank"
                        href={`/dealer/${dealer.slug}`}
                        className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={dealer.image || ""}
                            alt={dealer.name}
                          />
                          <AvatarFallback>DN</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{dealer.name}</span>
                      </a>
                      {contactInfo && (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                          <Phone className="h-4 w-4" />
                          {contactInfo}
                        </p>
                      )}
                    </div>
                  );
                })}
                <Button asChild variant="link" className="px-0">
                  <a
                    target="_blank"
                    href={`/dealer?product=${product.slug}&brand=${brand.slug}`}>
                    More Dealers
                  </a>
                </Button>
              </div>
            </section>
          )}

          {distributors.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <DialogTitle>
                  Distributors of {brand.name} - {product.name}
                </DialogTitle>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  {distributors.length || ""}
                </span>
              </div>
              <div className="space-y-4">
                {distributors.map((distributor, index) => {
                  const contactInfo =
                    distributor.contact &&
                    distributor.contact.find((c) => c.type === "phone")?.value;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between">
                      <a
                        target="_blank"
                        href={`/distributor/${distributor.slug}`}
                        className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={distributor.image || ""}
                            alt={distributor.name}
                          />
                          <AvatarFallback>DN</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{distributor.name}</span>
                      </a>
                      {contactInfo && (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                          <Phone className="h-4 w-4" />
                          {contactInfo}
                        </p>
                      )}
                    </div>
                  );
                })}
                <Button variant="link" className="px-0" asChild>
                  <a
                    target="_blank"
                    href={`/distributor?product=${product.slug}&brand=${brand.slug}`}>
                    More Distributors
                  </a>
                </Button>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
