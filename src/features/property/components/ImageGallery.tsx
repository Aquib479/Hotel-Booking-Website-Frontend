import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ImageGalleryProps {
  images: string[];
  photoCount: number;
  title: string;
}

export function ImageGallery({ images, photoCount, title }: ImageGalleryProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const uniqueImages = [...new Set(images.filter(Boolean))];
  const displayCount = Math.max(photoCount, uniqueImages.length);
  const [main, ...rest] = uniqueImages.length ? uniqueImages : [""];

  const openAt = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, uniqueImages.length - 1)));
    setOpen(true);
  };

  const goPrev = () => {
    setActiveIndex((i) => (i <= 0 ? uniqueImages.length - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i >= uniqueImages.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i <= 0 ? uniqueImages.length - 1 : i - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i >= uniqueImages.length - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, uniqueImages.length]);

  if (!uniqueImages.length) return null;

  const sideImages = Array.from({ length: 6 }, (_, i) => rest[i] ?? main);

  return (
    <>
      <div className="grid gap-1 overflow-hidden rounded-xl sm:h-[240px] sm:grid-cols-[1.15fr_1.85fr] md:h-[260px] lg:h-[280px]">
        <button
          type="button"
          className="group relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-full"
          onClick={() => openAt(0)}
        >
          <img
            src={main}
            alt={title}
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-50 transition group-hover:opacity-70" />
        </button>

        <div className="hidden grid-cols-3 grid-rows-2 gap-1 sm:grid">
          {sideImages.map((image, index) => {
            const isLast = index === sideImages.length - 1;
            const photoIndex = Math.min(index + 1, uniqueImages.length - 1);
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                className="group relative min-h-0 overflow-hidden"
                onClick={() => openAt(isLast ? 0 : photoIndex)}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                />
                {isLast ? (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white backdrop-blur-[1px] transition group-hover:bg-black/60">
                    <Images className="size-4" />
                    <span className="px-1 text-center text-xs font-semibold sm:text-sm">
                      {t("hotel.seeAllPhotos", { n: displayCount })}
                    </span>
                  </span>
                ) : (
                  <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => openAt(0)}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/30 hover:text-brand sm:hidden"
        >
          <Images className="size-4" />
          {t("hotel.seeAllPhotosSm", { n: displayCount })}
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[94vh] w-[min(1040px,96vw)] overflow-hidden border-none bg-zinc-950 p-0 text-white sm:max-w-[1040px]"
        >
          <DialogHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <DialogTitle className="truncate text-base font-semibold text-white">
              {title}
              <span className="ml-2 text-sm font-normal text-white/60">
                {activeIndex + 1} / {uniqueImages.length}
              </span>
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label={t("hotel.closeGallery")}
            >
              <X className="size-5" />
            </button>
          </DialogHeader>

          <div className="relative flex items-center justify-center bg-zinc-950 px-14 py-5">
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
              aria-label={t("hotel.prevPhoto")}
            >
              <ChevronLeft className="size-5" />
            </button>
            <img
              src={uniqueImages[activeIndex]}
              alt={t("hotel.photoN", { title, n: activeIndex + 1 })}
              className="max-h-[62vh] w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
              aria-label={t("hotel.nextPhoto")}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
            {uniqueImages.map((image, index) => (
              <button
                key={`${image}-thumb-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition",
                  index === activeIndex
                    ? "border-white opacity-100"
                    : "border-transparent opacity-55 hover:opacity-85"
                )}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
