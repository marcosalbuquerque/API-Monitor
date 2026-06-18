import { useCallback, useEffect, useRef, useState } from "react";

import { getMetrics } from "../services/api";

export const DEFAULT_POLL_MS = 4000;

export default function useMetrics({ pollMs = DEFAULT_POLL_MS } = {}) {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref para manter as métricas locais entre polls sem causar re-renders
  const localRef = useRef([]);

  const refresh = useCallback(async () => {
    try {
      const data = await getMetrics();
      const remote = Array.isArray(data) ? data : [];

      // Mescla: mantém locais que não estão no remoto (ambiente stateless)
      const remoteKeys = new Set(remote.map((m) => m.checkedAt + m.id));
      const onlyLocal = localRef.current.filter(
        (m) => !remoteKeys.has(m.checkedAt + m.id)
      );
      const merged = [...remote, ...onlyLocal];

      localRef.current = merged;
      setMetrics(merged);
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

        const remote = Array.isArray(data) ? data : [];

        // Mesclagem: nunca descarta métricas locais quando o servidor retorna vazio
        const remoteKeys = new Set(remote.map((m) => m.checkedAt + m.id));
        const onlyLocal = localRef.current.filter(
          (m) => !remoteKeys.has(m.checkedAt + m.id)
        );
        const merged = [...remote, ...onlyLocal];

        localRef.current = merged;
        setMetrics(merged);
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
    // Adiciona localmente para resposta imediata na UI
    localRef.current = [...localRef.current, metric];
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
