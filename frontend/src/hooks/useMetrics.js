import { useCallback, useEffect, useState } from "react";

import { getMetrics } from "../services/api";

export const DEFAULT_POLL_MS = 4000;

export default function useMetrics({ pollMs = DEFAULT_POLL_MS } = {}) {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getMetrics();
      setMetrics(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getMetrics();
        if (!active) return;
        setMetrics(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    const id = setInterval(load, pollMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [pollMs]);

  const appendMetric = useCallback((metric) => {
    if (!metric) return;
    setMetrics((prev) => [...prev, metric]);
  }, []);

  return {
    metrics,
    isLoading,
    error,
    refresh,
    appendMetric,
    pollMs,
  };
}
