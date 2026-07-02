interface ImageGalleryProps {
  images: string[];
  photoCount: number;
  title: string;
}

export function ImageGallery({ images, photoCount, title }: ImageGalleryProps) {
  const [main, ...rest] = images;

  return (
    <div className="grid h-[280px] gap-2 overflow-hidden rounded-2xl sm:h-[360px] sm:grid-cols-[1.2fr_1fr] lg:h-[420px]">
      <div className="relative h-full min-h-[180px] overflow-hidden sm:min-h-0">
        <img src={main} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {rest.slice(0, 3).map((image) => (
          <div key={image} className="relative overflow-hidden">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="relative overflow-hidden">
          <img
            src={rest[3] ?? rest[0] ?? main}
            alt=""
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white transition-colors hover:bg-black/50"
          >
            See all photos ({photoCount})
          </button>
        </div>
      </div>
    </div>
  );
}
