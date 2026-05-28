import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import CategoryBadge from "../components/CategoryBadge";
import Header from "../components/Header";
import MetricsDashboard from "../components/MetricsDashboard";
import Notification from "../components/Notification";
import StatusBadge from "../components/StatusBadge";
import useChangeTheme from "../hooks/useChangeTheme";
import useMetrics from "../hooks/useMetrics";
import useNotifications from "../hooks/useNotifications";
import { getApis, probeApi } from "../services/api";

export default function ApiDetail() {
  const { id } = useParams();
  const { darkMode, setDarkMode } = useChangeTheme();
  const { notifications, pushNotification, dismissNotification } = useNotifications();
  const { metrics, isLoading: metricsLoading, appendMetric, pollMs } = useMetrics();

  const [api, setApi] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [isProbing, setIsProbing] = useState(false);
  const [swaggerAvailable, setSwaggerAvailable] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadApi() {
      try {
        const data = await getApis();
        if (!active) return;
        const found = Array.isArray(data) ? data.find((item) => item.id === id) : null;
        setApi(found || null);
      } catch {
        if (!active) return;
        setApi(null);
      } finally {
        if (active) setApiLoading(false);
      }
    }

    loadApi();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;

    async function checkSwagger() {
      try {
        const response = await fetch(`/api/swagger/${id}`);
        if (!active) return;
        setSwaggerAvailable(response.ok);
      } catch {
        if (!active) return;
        setSwaggerAvailable(false);
      }
    }

    checkSwagger();
    return () => {
      active = false;
    };
  }, [id]);

  const apiMetrics = useMemo(() => {
    return metrics.filter((metric) => metric.id === id);
  }, [metrics, id]);

  const lastResult = apiMetrics.length ? apiMetrics[apiMetrics.length - 1] : null;

  const summary = useMemo(() => {
    const total = apiMetrics.length;
    const successCount = apiMetrics.filter((metric) => metric.ok).length;
    const lastLatency = lastResult?.latencyMs;
    const successRate = total ? Math.round((successCount / total) * 100) : 0;

    return { total, successCount, successRate, lastLatency };
  }, [apiMetrics, lastResult]);

  const handleTryOut = async () => {
    if (!api) return;
    try {
      setIsProbing(true);
      const result = await probeApi(api.id);
      appendMetric(result);

      if (result?.ok) {
        pushNotification("success", `Request succeeded: ${api.name}`);
      } else {
        const details =
          result?.error ||
          (result?.status ? `HTTP ${result.status}` : null) ||
          "Request failed";
        pushNotification("error", `${api.name}: ${details}`);
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Request failed";
      appendMetric({
        id: api.id,
        name: api.name,
        status: null,
        latencyMs: null,
        ok: false,
        error: message,
        checkedAt: new Date().toISOString(),
      });
      pushNotification("error", `${api.name}: ${message}`);
    } finally {
      setIsProbing(false);
    }
  };

  return (
    <>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
        <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-[340px] flex-col gap-3">
          {notifications.map((n) => (
            <Notification
              key={n.id}
              type={n.type}
              message={n.message}
              onClose={() => dismissNotification(n.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-secondary-text)]">
          <Link to="/" className="hover:text-[var(--color-main-text)]">
            ← Voltar
          </Link>
          <span>/</span>
          <span className="text-[var(--color-main-text)]">
            {api?.name || "Detalhe da API"}
          </span>
        </div>

        {apiLoading ? (
          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6">
            <div className="h-6 w-1/3 animate-pulse rounded-lg bg-[color-mix(in_oklab,var(--color-border)_55%,transparent)]" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-lg bg-[color-mix(in_oklab,var(--color-border)_55%,transparent)]" />
          </div>
        ) : !api ? (
          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6 text-sm text-[var(--color-secondary-text)]">
            API não encontrada no catálogo.
          </div>
        ) : (
          <>
            <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[var(--color-main-text)]">
                      {api.name}
                    </h1>
                    <CategoryBadge category={api.category} />
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-secondary-text)]">
                    {api.description}
                  </p>
                  <div className="mt-3">
                    <StatusBadge result={lastResult} size="lg" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTryOut}
                  disabled={isProbing}
                  className={[
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "bg-[var(--color-highlight)] text-white shadow-sm shadow-black/10 transition hover:brightness-110",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]",
                    isProbing ? "cursor-not-allowed opacity-80" : "",
                  ].join(" ")}
                >
                  {isProbing ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                      Testando...
                    </span>
                  ) : (
                    "Try Out"
                  )}
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_92%,transparent)] p-4">
                  <div className="text-xs text-[var(--color-secondary-text)]">
                    Última latência
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[var(--color-main-text)]">
                    {Number.isFinite(summary.lastLatency)
                      ? `${Math.round(summary.lastLatency)} ms`
                      : "—"}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_92%,transparent)] p-4">
                  <div className="text-xs text-[var(--color-secondary-text)]">
                    Checagens na sessão
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[var(--color-main-text)]">
                    {summary.total}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_92%,transparent)] p-4">
                  <div className="text-xs text-[var(--color-secondary-text)]">
                    Taxa de sucesso
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[var(--color-main-text)]">
                    {summary.total ? `${summary.successRate}%` : "—"}
                  </div>
                </div>
              </div>
            </section>

            <MetricsDashboard
              metrics={apiMetrics}
              apis={[api]}
              isLoading={metricsLoading}
              pollMs={pollMs}
            />

            <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--color-main-text)]">
                  Swagger
                </h3>
                <a
                  href={`/api/swagger/${api.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[var(--color-highlight)]"
                >
                  Abrir em nova aba
                </a>
              </div>

              {swaggerAvailable === null ? (
                <div className="mt-4 h-[320px] animate-pulse rounded-xl bg-[color-mix(in_oklab,var(--color-border)_55%,transparent)]" />
              ) : swaggerAvailable === false ? (
                <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_90%,transparent)] p-4 text-sm text-[var(--color-secondary-text)]">
                  Documentação indisponível para esta API.
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)]">
                  <iframe
                    title={`Swagger ${api.name}`}
                    src={`/api/swagger/${api.id}`}
                    className="h-[520px] w-full"
                  />
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
