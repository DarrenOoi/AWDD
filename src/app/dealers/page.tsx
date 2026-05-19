import { Suspense } from "react";

import { DealersDirectoryClient } from "@/components/dealers-directory-client";
import { dealers } from "@/data/dealers";

export default async function DealersPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-stone-200/80 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Directory</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-stone-900">
          Find watch dealers
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Search by location (with Google suggestions), dealer name, or brand — then browse the list and
          map.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-stone-500">
            Loading directory…
          </div>
        }
      >
        <DealersDirectoryClient dealers={dealers} />
      </Suspense>
    </div>
  );
}
