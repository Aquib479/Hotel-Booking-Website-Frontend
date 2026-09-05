import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/features/search/components/PropertyCard";
import { useFavoritesStore } from "@/store";
import { useLanguage } from "@/context/LanguageContext";

export default function Favourites() {
  const { t } = useLanguage();
  const items = useFavoritesStore((s) => s.items);
  const favorites = Object.values(items);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-brand">
              <Heart className="size-4 fill-red-500 text-red-500" />
              {t("saved.hotels")}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("saved.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {favorites.length === 0
                ? t("saved.emptyHint")
                : favorites.length === 1
                  ? t("saved.countOne")
                  : t("saved.countMany", { n: favorites.length })}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button asChild variant="outline">
              <Link to="/search">{t("saved.findMore")}</Link>
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-white py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-50">
              <Heart className="size-7 text-red-400" />
            </div>
            <p className="text-lg font-semibold text-foreground">{t("saved.empty")}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t("saved.emptyBody")}
            </p>
            <Button asChild className="mt-6">
              <Link to="/search">{t("saved.find")}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  reviewCount: property.reviewCount ?? 0,
                  amenityPills: property.amenityPills ?? [],
                  highlightAttributes: property.highlightAttributes ?? [],
                }}
                mode="stay"
                nights={1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
