"use client";

type DealerProfileActionsProps = {
  dealerName: string;
  website: string;
  instagram: string;
};

export function DealerProfileActions({
  dealerName,
  website,
  instagram,
}: DealerProfileActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={website}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
        onClick={() => console.log("[dealer-click] website", { dealerName, website })}
      >
        Visit Website
      </a>
      <a
        href={instagram}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-center text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
        onClick={() => console.log("[dealer-click] instagram", { dealerName, instagram })}
      >
        View Instagram
      </a>
    </div>
  );
}
