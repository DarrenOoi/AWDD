type StarRatingProps = {
  rating?: number;
  max?: number;
  size?: "sm" | "md";
};

export function StarRating({ rating, max = 5, size = "sm" }: StarRatingProps) {
  if (rating == null || Number.isNaN(rating)) {
    return <span className="text-sm text-stone-500">No rating</span>;
  }

  const clamped = Math.min(max, Math.max(0, rating));
  const fullStars = Math.floor(clamped + 0.25);
  const emptyStars = max - fullStars;
  const textSize = size === "sm" ? "text-[13px] leading-none" : "text-base leading-none";

  return (
    <span
      className={`inline-flex items-center gap-px text-amber-500 ${textSize}`}
      aria-label={`${rating.toFixed(1)} out of ${max} stars`}
    >
      <span aria-hidden>{`${"★".repeat(fullStars)}${"☆".repeat(emptyStars)}`}</span>
    </span>
  );
}
