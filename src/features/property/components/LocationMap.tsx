import { useLanguage } from "@/context/LanguageContext";

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

export function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  const { t } = useLanguage();
  if (latitude == null || longitude == null) return null;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t("hotel.whereYoullBe")}</h2>
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand hover:underline"
        >
          {t("hotel.viewOnMap")}
        </a>
      </div>
      <div className="overflow-hidden rounded-md border border-border shadow-sm shadow-black/[0.03]">
        <iframe
          title={t("hotel.mapShowing", { address })}
          src={src}
          className="h-64 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-sm text-muted-foreground">{address}</p>
    </section>
  );
}
