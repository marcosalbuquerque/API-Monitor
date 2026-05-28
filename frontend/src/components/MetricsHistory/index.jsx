import { useMemo } from "react";

function formatRelativeTime(timestamp) {
  const date = timestamp ? new Date(timestamp) : null;
  if (!date || Number.isNaN(date.getTime())) return "agora";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return `há ${diffSec}s`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `há ${diffHour} h`;

  const diffDay = Math.floor(diffHour / 24);
  return `há ${diffDay} d`;
}

export default function MetricsHistory({ metrics = [], apis = [], isLoading = false }) {
  const idToName = useMemo(() => {
    return apis.reduce((acc, api) => {
      acc[api.id] = api.name;
      return acc;
    }, {});
  }, [apis]);

  const items = useMemo(() => {
    return [...metrics].slice(-8).reverse();
  }, [metrics]);

  return (
    <section className="mx-auto mt-6 max-w-7xl px-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-main-text)]">
            Últimas checagens
          </h3>
          <span className="text-xs text-[var(--color-secondary-text)]">
            Sessão atual
          </span>
        </div>

        {isLoading && items.length === 0 ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 animate-pulse rounded-xl bg-[color-mix(in_oklab,var(--color-border)_55%,transparent)]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_90%,transparent)] p-4 text-sm text-[var(--color-secondary-text)]">
            Nenhuma checagem ainda.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item, index) => {
              const isSuccess = item.ok;
              const name = idToName[item.id] || item.name || item.id || "API";
              const latencyLabel = Number.isFinite(item.latencyMs)
                ? `${Math.round(item.latencyMs)} ms`
                : "—";

              return (
                <div
                  key={`${item.id}-${item.checkedAt}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_92%,transparent)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                        isSuccess
                          ? "border-emerald-500/50 text-emerald-600"
                          : "border-rose-500/50 text-rose-600",
                      ].join(" ")}
                    >
                      {isSuccess ? "UP" : "DOWN"}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-main-text)]">
                        {name}
                      </div>
                      <div className="text-xs text-[var(--color-secondary-text)]">
                        {item.status ? `HTTP ${item.status}` : item.error || "Sem detalhes"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-[var(--color-secondary-text)]">
                    <div>{latencyLabel}</div>
                    <div>{formatRelativeTime(item.checkedAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
