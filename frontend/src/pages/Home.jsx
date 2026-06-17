import { useMemo, useState, useEffect } from "react";

import ReactiveBackground from "../components/ReactiveBackground";
import Hero from "../components/Hero";
import CategoryFilter from "../components/CategoryFilter";
import ApiList from "../components/ApiList";
import Header from "../components/Header";
import useChangeTheme from "../hooks/useChangeTheme";
import { getApis, probeApi } from "../services/api";
import Notification from "../components/Notification";
import MetricsDashboard from "../components/MetricsDashboard";
import MetricsHistory from "../components/MetricsHistory";
import useNotifications from "../hooks/useNotifications";
import useMetrics from "../hooks/useMetrics";
import { logger } from "../utils/logger";

export default function Home() {
  const { darkMode, setDarkMode } = useChangeTheme();
  const { notifications, pushNotification, dismissNotification } = useNotifications();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [apis, setApis] = useState([]);
  const [loadingById, setLoadingById] = useState({});
  const { metrics, isLoading: metricsLoading, appendMetric, pollMs } = useMetrics();

  useEffect(() => {
    let active = true;

    async function loadApis() {
      try {
        const data = await getApis();
        if (active) setApis(Array.isArray(data) ? data : []);
      } catch (err) {
        logger.error("Failed to load APIs", err);
        if (active) setApis([]);
      }
    }
    loadApis()

    return () => {
      active = false;
    }
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(apis.map((api) => api.category))).filter(Boolean);
    return ["All", ...unique];
  }, [apis])

  const filteredApis = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return apis.filter((api) => {
      const matchesCategory = activeCategory === "All" || api.category === activeCategory;
      if (!normalizedQuery) return matchesCategory;
      const haystack = [api.name, api.description, api.category].join(" ").toLowerCase();
      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [activeCategory, apis, searchQuery]);

  const lastResultById = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      if (metric?.id) acc[metric.id] = metric;
      return acc;
    }, {});
  }, [metrics]);

  const handleTryOut = async (api) => {
    setLoadingById((prev) => ({ ...prev, [api.id]: true }));
    try {
      await logger.trackAction(`Try Out API - ${api.name}`, async () => {
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
      });
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
      setLoadingById((prev) => ({ ...prev, [api.id]: false }));
    }
  };

  return (
    <ReactiveBackground>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main>
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
          <Hero />
          <MetricsDashboard
            metrics={metrics}
            apis={apis}
            isLoading={metricsLoading}
            pollMs={pollMs}
          />
          <MetricsHistory metrics={metrics} apis={apis} isLoading={metricsLoading} />
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        <ApiList
          apis={filteredApis}
          onTryOut={handleTryOut}
          results={lastResultById}
          loadingById={loadingById}
        />
      </main>
    </ReactiveBackground>
  );
}
