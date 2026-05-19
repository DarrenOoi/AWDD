type DealerContactDetailsProps = {
  address: string;
  phone: string;
};

export function DealerContactDetails({ address, phone }: DealerContactDetailsProps) {
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/90 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Contact</p>
      <dl className="mt-4 grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <dt className="text-sm font-medium text-stone-500">Address</dt>
          <dd className="mt-1.5 text-base font-medium leading-snug text-stone-900">{address}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-stone-500">Phone</dt>
          <dd className="mt-1.5">
            <a
              href={phoneHref}
              className="text-base font-medium text-stone-900 underline-offset-2 transition hover:text-accent hover:underline"
            >
              {phone}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
