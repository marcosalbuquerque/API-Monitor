import CategoryBadge from "../CategoryBadge";

export default function ApiCard({ api, onTryOut }) {
    return (
        <article className={[
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
    )
}