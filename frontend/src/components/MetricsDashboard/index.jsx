import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { getMetrics } from "../../services/api";

const POLL_MS = 4000;
const MAX_POINTS = 30;

const COLORS = [
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

function normalize(raw = [], idToName) {
  return raw.map((m, i) => ({
    id: m.id || i,
    apiName: idToName[m.id] || m.id || "API",
    status: m.status || (m.ok ? 200 : 500),
    latencyMs: m.latencyMs ?? 0,
    timestamp: m.checkedAt || Date.now(),
  }));
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}:${String(
    d.getSeconds()
  ).padStart(2, "0")}`;
}

// TODO: The MetricsDashboard its not working properly. It need make two requests to show the line, need fix this...

export default function MetricsDashboard({ refreshKey = 0, apis = [] }) {
  const [metrics, setMetrics] = useState([]);

  const idToName = useMemo(() => {
    return apis.reduce((acc, api) => {
      acc[api.id] = api.name;
      return acc;
    }, {});
  }, [apis]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getMetrics();
        if (active) setMetrics(normalize(Array.isArray(data) ? data : [], idToName));
      } catch (err) {
        console.error("Failed to load metrics", err);
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [idToName]);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const data = await getMetrics();
        if (active) setMetrics(normalize(Array.isArray(data) ? data : [], idToName));
      } catch (err) {
        console.error("Failed to refresh metrics", err);
      }
    }
    if (refreshKey) refresh();
    return () => {
      active = false;
    };
  }, [refreshKey, idToName]);

  const { chartData, apiKeys, colorMap } = useMemo(() => {
    const ordered = [...metrics]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-MAX_POINTS);

    const keys = Array.from(new Set(ordered.map((m) => m.apiName)));

    const map = keys.reduce((acc, key, idx) => {
      acc[key] = COLORS[idx % COLORS.length];
      return acc;
    }, {});

    const data = ordered.map((m, idx) => {
      const row = { request: idx + 1, time: formatTime(m.timestamp) };
      keys.forEach((k) => {
        row[k] = null;
      });
      row[m.apiName] = m.latencyMs;
      return row;
    });

    return { chartData: data, apiKeys: keys, colorMap: map };
  }, [metrics]);

  return (
    <section className="mx-auto mt-10 max-w-7xl px-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-main-text)]">
            Request Metrics
          </h3>
          <span className="text-xs text-[var(--color-secondary-text)]">
            Live • updates every {POLL_MS / 1000}s
          </span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="request" tick={{ fill: "var(--color-secondary-text)", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "var(--color-secondary-text)", fontSize: 12 }}
                label={{ value: "ms", angle: -90, position: "insideLeft", fill: "var(--color-secondary-text)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
              />
              <Legend />
              {apiKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colorMap[key]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}