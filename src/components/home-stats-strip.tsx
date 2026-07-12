import type { Dealer } from "@/types/dealer";

type HomeStatsStripProps = {
  dealers: Dealer[];
};

export function HomeStatsStrip({ dealers }: HomeStatsStripProps) {
  const cityCount = new Set(dealers.map((dealer) => `${dealer.city}, ${dealer.state}`)).size;
  const ratedDealers = dealers.filter((dealer) => dealer.googleRating != null);
  const avgRating =
    ratedDealers.length > 0
      ? ratedDealers.reduce((sum, dealer) => sum + (dealer.googleRating ?? 0), 0) / ratedDealers.length
      : 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] px-6 py-4 text-center shadow-sm sm:gap-x-12">
      <StatItem label="Dealers listed" value={String(dealers.length)} />
      <Divider />
      <StatItem label="Cities covered" value={String(cityCount)} />
      {avgRating > 0 ? (
        <>
          <Divider />
          <StatItem label="Avg. Google rating" value={avgRating.toFixed(1)} />
        </>
      ) : null}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold tabular-nums text-stone-900 sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="hidden h-8 w-px bg-stone-200 sm:block" aria-hidden />;
}
