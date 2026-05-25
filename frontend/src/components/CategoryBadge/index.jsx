export default function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-card-background)_88%,black)] px-2.5 py-1 text-xs font-medium text-[var(--color-secondary-text)]">
      {category}
    </span>
  );
}