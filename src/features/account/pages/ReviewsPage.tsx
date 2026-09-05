import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useRequireAuth } from "@/features/bookings/hooks/useRequireAuth";
import { useLanguage } from "@/context/LanguageContext";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { AccountLayout } from "../components/AccountLayout";
import { DEMO_USER_REVIEWS } from "../constants/rewards";

export function ReviewsPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useRequireAuth("/reviews");

  if (!isAuthenticated) return null;

  return (
    <AccountLayout
      title={t("account.reviewsTitle")}
      description={t("account.reviewsHint")}
    >
      <div className="space-y-4">
        {DEMO_USER_REVIEWS.length === 0 as number ? (
          <SectionCard title={t("account.noReviews")}>
            <p className="text-sm text-muted-foreground">
              {t("account.reviewsEmptyHint")}
            </p>
            <Button asChild className="mt-4 rounded-xl">
              <Link to="/bookings">{t("account.goBookings")}</Link>
            </Button>
          </SectionCard>
        ) : (
          DEMO_USER_REVIEWS.map((review) => (
            <SectionCard
              key={review.id}
              title={review.hotelName}
              description={`${review.city} · ${review.date}`}
            >
              <div className="flex items-center gap-0.5" aria-label={t("account.ratingOutOf", { n: review.rating })}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`account.review.${review.id}`)}
              </p>
            </SectionCard>
          ))
        )}
      </div>
    </AccountLayout>
  );
}
