import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardImageRowProps {
  image: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  imageWrapperClassName?: string;
  /** Full-width image strip on mobile, left column on sm+ */
  layout?: "row" | "banner";
}

export function CardImageRow({
  image,
  children,
  className,
  bodyClassName,
  imageWrapperClassName,
  layout = "row",
}: CardImageRowProps) {
  if (layout === "banner") {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className={cn("relative w-full overflow-hidden", imageWrapperClassName)}>
          {image}
        </div>
        <div className={cn("flex flex-col gap-2.5 p-4 sm:p-5", bodyClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5", className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-[9rem] shrink-0 sm:mx-0 sm:max-w-none sm:w-28",
          imageWrapperClassName
        )}
      >
        {image}
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-2.5", bodyClassName)}>{children}</div>
    </div>
  );
}

interface CardThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  size?: "md" | "lg" | "banner";
}

export function CardThumbnail({ src, alt, className, size = "md" }: CardThumbnailProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "object-cover ring-1 ring-border/80",
        size === "md" && "aspect-square w-full rounded-xl",
        size === "lg" && "aspect-[4/3] w-full rounded-xl sm:aspect-square sm:h-full sm:min-h-[7rem]",
        size === "banner" && "aspect-[16/10] w-full rounded-none sm:aspect-[4/3]",
        className
      )}
    />
  );
}
