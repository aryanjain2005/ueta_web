import React from "react";
import type { Brand } from "types";

interface Props {
  pb: Brand["moreBrands"][number];
  type: "product" | "brand";
  className?: string;
  nameClassName?: string;
  size?: Size;
  children?: React.ReactNode;
  link?: boolean;
  shadow?: boolean;
}

type Size = "dd" | "small" | "normal" | "big";

const sizeClasses: Record<Size, string> = {
  dd: "w-full aspect-square max-w-[70px] sm:max-w-[100px]", // updated
  small: "w-[100px] h-[100px]",
  normal: "w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]",
  big: "w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]",
};

const PbItem = ({
  pb,
  type,
  className,
  nameClassName,
  size = "normal",
  shadow = false,
  link = true,
  children,
}: Props) => {
  const Container: React.ElementType = link ? "a" : "div";
  const isDd = size === "dd";

  return (
    <Container
      href={link ? `/${type}/${pb.slug}` : undefined}
      className={`flex flex-col items-center ${
        isDd ? "w-22 sm:w-28 md:w-32" : " gap-1"
      } ${className || ""}`}>
      <div
        className={`flex items-center justify-center rounded-2xl ${
          sizeClasses[size]
        } ${shadow ? "shadow-md p-2" : ""}`}>
        <img
          src={pb.image || "imgg.png"}
          alt={pb.name}
          className={
            isDd
              ? "w-full h-full rounded-md object-cover"
              : "rounded-md object-cover"
          }
          loading="lazy"
        />
      </div>

      <div className={isDd ? "mt-1 w-full px-[1px]" : ""}>
        <h2
          className={`
    ${
      isDd
        ? "w-full text-center text-xs sm:text-sm md:text-base font-medium tracking-tight truncate"
        : "tracking-tight font-medium "
    }
    ${nameClassName || "text-2xl"}`} // ✅ Applies your custom classes
        >
          {pb.name}
        </h2>
      </div>

      {children}
    </Container>
  );
};

export default PbItem;
