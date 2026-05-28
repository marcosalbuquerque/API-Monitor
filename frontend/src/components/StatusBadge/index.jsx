export default function StatusBadge({ result, size = "sm" }) {
  const hasResult = result?.ok === true || result?.ok === false;
  const isSuccess = result?.ok === true;

  const label = hasResult ? (isSuccess ? "UP" : "DOWN") : "—";
  const detail = hasResult ? (isSuccess ? "Funcionou" : "Falhou") : "Nunca testada";
  const statusLabel = result?.status ? `HTTP ${result.status}` : null;
  const latencyLabel = Number.isFinite(result?.latencyMs)
    ? `${Math.round(result.latencyMs)} ms`
    : null;

  const detailLine = [detail, statusLabel, latencyLabel].filter(Boolean).join(" • ");

  const badgeClasses = hasResult
    ? isSuccess
      ? "border-emerald-500/50 text-emerald-600"
      : "border-rose-500/50 text-rose-600"
    : "border-[var(--color-border)] text-[var(--color-secondary-text)]";

  const sizeClasses = size === "lg"
    ? "px-3 py-1 text-sm"
    : "px-2.5 py-1 text-xs";

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={[
          "inline-flex items-center rounded-full border bg-[color-mix(in_oklab,var(--color-card-background)_85%,transparent)] font-semibold",
          badgeClasses,
          sizeClasses,
        ].join(" ")}
      >
        {label}
      </span>
      <span className="text-[var(--color-secondary-text)]">
        {detailLine}
      </span>
    </div>
  );
}
