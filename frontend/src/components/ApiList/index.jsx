import CategoryBadge from "../CategoryBadge";

export default function ApiList({ apis, onTryOut }) {
  return (
    <section id="apis" className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-main-text)]">
            API Directory
          </h3>
          <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
            {apis.length} {apis.length === 1 ? "result" : "results"}
          </p>
        </div>
      </div>

      {/* TODO: Transform this into ApiCard, the way it's right now it's not modular... */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {apis.map((api) => (
          <article
            key={api.id}
            className={[
              "group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-5",
              "transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-base font-bold text-[var(--color-main-text)]">
                {api.name}
              </h4>
              <CategoryBadge category={api.category} />
            </div>

            <p
              className="mt-2 text-sm leading-relaxed text-[var(--color-secondary-text)]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {api.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <a
                href={api.docsUrl || "#"}
                className="text-sm font-medium text-[var(--color-secondary-text)] underline-offset-4 hover:underline"
              >
                Docs
              </a>

              <button
                type="button"
                onClick={() => onTryOut?.(api)}
                className={[
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  "bg-[var(--color-highlight)] text-white shadow-sm shadow-black/10 transition hover:brightness-110",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]",
                ].join(" ")}
              >
                Try Out
              </button>
            </div>
          </article>
        ))}
      </div>

      {apis.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6 text-sm text-[var(--color-secondary-text)]">
          No APIs found for this category.
        </div>
      ) : null}
    </section>
  );
}