type FeaturedBadgeProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: "gap-1 px-2 py-0.5 text-[10px] tracking-[0.14em]",
  md: "gap-1.5 px-2.5 py-1 text-[11px] tracking-[0.16em]",
} as const;

export function FeaturedBadge({ size = "md", className = "" }: FeaturedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-white/95 font-semibold uppercase text-stone-800 shadow-sm ring-1 ring-stone-900/8 backdrop-blur-sm ${sizeClasses[size]} ${className}`}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      Featured
    </span>
  );
}
