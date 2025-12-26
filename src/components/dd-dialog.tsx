"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { useState } from "react";
import type { Product } from "types";
import ContactButton from "./contact-button";

interface BusinessDialogProps {
  children: React.ReactNode;
  bussiness: Product["dealers"][number] | Product["distributors"][number];
}

export function DDDialog({ bussiness, children }: BusinessDialogProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-h-[80vh] w-xl max-sm:w-[90vw] p-0 overflow-hidden">
        <DialogHeader className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-primary mb-4">
                {bussiness.shopName}
              </DialogTitle>
              <div className="space-y-2">
                {bussiness.contact && bussiness.contact.length > 0 && (
                  <div className="flex items-center gap-1 space-y-0">
                    <p className="font-semibold shrink-0 pr-2">Contact:</p>
                    <div className="flex items-center gap-1">
                      {bussiness.contact.map((c, i) => (
                        <ContactButton contact={c} key={i} size="large" />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="font-semibold">Location:</span>
                  <span>{bussiness.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button asChild className="flex-1" size="lg">
              <a href={`/${bussiness.type}/${bussiness.slug}`}>View Page</a>
            </Button>
            {bussiness.location && bussiness.location.trim() !== "" && (
              <Button asChild className="flex-1" size="lg">
                <a href={bussiness.location} target="_blank">
                  View Direction
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>
        {bussiness.shopImages && bussiness.shopImages.length > 0 && (
          <div className="grid grid-cols-[100px_1fr] gap-2 p-2 grow overflow-y-auto">
            <div className="space-y-2 h-fit">
              {bussiness.shopImages.map((src, index) => (
                <button
                  key={index}
                  className={`w-full aspect-[4/3] relative rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}>
                  <img
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden h-fit">
              <img
                src={bussiness.shopImages[selectedImage]}
                alt="Selected image"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
