export function RatingStars({ rating = 0 }: { rating?: number }) {
  return <span className="text-sm">{'★'.repeat(Math.round(rating))}</span>;
}
