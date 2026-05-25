
export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
}) {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-[var(--color-main-text)]">
            Categories
          </h2>
          <p className="hidden text-xs text-[var(--color-secondary-text)] md:block">
            Click to filter instantly
          </p>
        </div>

        <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange(cat)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]",
                  isActive
                    ? "bg-[var(--color-highlight)] text-white shadow-sm shadow-black/10"
                    : "border border-[var(--color-border)] bg-[var(--color-card-background)] text-[var(--color-main-text)] hover:bg-[color-mix(in_oklab,var(--color-card-background)_92%,black)]",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}