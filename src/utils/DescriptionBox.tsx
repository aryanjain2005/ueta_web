import { useState, useRef, useEffect } from "react";

interface DescriptionBoxProps {
  text: string;
}

export function DescriptionBox({ text }: DescriptionBoxProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    };

    // run once and on resize
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div
      ref={contentRef}
      className={`
        relative
        text-xs sm:text-sm md:text-lg
        leading-relaxed text-slate-600
        max-w-full
        ${expanded ? "" : "line-clamp-5"}   /* clamped only when not expanded */
        cursor-pointer
      `}
      style={
        expanded
          ? undefined // no height limit in expanded mode
          : { maxHeight: "10rem" }
      }
      onClick={() => {
        if (isOverflowing) setExpanded((prev) => !prev);
      }}>
      {text}

      {/* Show '... more' only when there is hidden text and not expanded */}
      {!expanded && isOverflowing && (
        <span className="absolute bottom-0 right-0 bg-white pl-1 text-slate-500 text-[11px]">
          ... more
        </span>
      )}
    </div>
  );
}
