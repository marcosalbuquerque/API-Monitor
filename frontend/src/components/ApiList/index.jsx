import ApiCard from "../ApiCard";

export default function ApiList({ apis, onTryOut, results = {}, loadingById = {} }) {
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

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {apis.map((api) => (
          <ApiCard
            key={api.id ?? api.key}
            api={api}
            onTryOut={onTryOut}
            lastResult={results[api.id]}
            isLoading={Boolean(loadingById[api.id])}
          />
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
