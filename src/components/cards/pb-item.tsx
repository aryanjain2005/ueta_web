import React from "react";
import type { Brand } from "types";

interface Props {
  pb: Brand["moreBrands"][number];
  type: "product" | "brand";
  className?: string;
  size: "normal" | "small";
  children?: any;
  link?: boolean;
  shadow?: boolean;
}

const PbItem = ({
  pb,
  type,
  className,
  size = "normal",
  shadow = false,
  link = true,
  children,
}: Props) => {
  const Container: React.ElementType = link ? "a" : "div";
  return (
    <Container
      href={link ? `/${type}/${pb.slug}` : undefined}
      className={`flex-col flex gap-1 items-center ${className || ""}`}>
      <div
        className={`flex items-center justify-center rounded-md ${
          size == "normal"
            ? "w-[120px] h-[120px] sm:w-[160px] h-[160px]"
            : "w-[100px] h-[100px] "
        }
          ${shadow ? "shadow-md p-2" : ""}`}>
        <img
          src={pb.image || "imgg.png"}
          alt={pb.name}
          className="rounded-md  object-cover"
          loading="lazy"
        />
      </div>
      <h2 className="tracking-tight font-medium text-2xl">{pb.name}</h2>
      {children}
    </Container>
  );
};

export default PbItem;
