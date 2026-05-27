export default function Hero() {
  return (
    <section className="pt-10 md:pt-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="min-h-[34vh] md:min-h-[38vh] flex items-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card-background)] px-3 py-1 text-xs font-medium text-[var(--color-secondary-text)]">
              Public API Directory
              <span className="h-1 w-1 rounded-full bg-[var(--color-border)]" />
              Curated & up-to-date
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-main-text)] md:text-6xl">
              API Monitor
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[var(--color-secondary-text)] md:text-lg">
              Discover, test, and integrate the world&apos;s most robust public APIs
              in one place.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#apis"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-highlight)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-black/10 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]"
              >
                Browse APIs
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card-background)] px-4 py-2.5 text-sm font-semibold text-[var(--color-main-text)] transition hover:bg-[color-mix(in_oklab,var(--color-card-background)_92%,black)] focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]"
              >
                Learn more
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:max-w-xl md:grid-cols-3">
              {[
                { label: "Curated listings", value: "Hand-picked" },
                { label: "Categories", value: "6+" },
                { label: "Latency hints", value: "Soon" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-4"
                >
                  <div className="text-sm font-semibold text-[var(--color-main-text)]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-[var(--color-secondary-text)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 border-t border-[var(--color-border)]" />
      </div>
    </section>
  );
}