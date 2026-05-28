import { Link } from "react-router-dom";

import CategoryBadge from "../CategoryBadge";
import StatusBadge from "../StatusBadge";

export default function ApiCard({ api, onTryOut, lastResult, isLoading }) {
    return (
        <article className={[
            "group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-background)] p-5",
            "transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10",
            isLoading ? "opacity-70" : "",
        ].join(" ")}
        aria-busy={isLoading ? "true" : "false"}
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

            <div className="mt-3">
                <StatusBadge result={lastResult} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                    <a
                        href={api.docsUrl || "#"}
                        className="text-sm font-medium text-[var(--color-secondary-text)] underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Docs
                    </a>
                    <Link
                        to={`/apis/${api.id}`}
                        className="text-sm font-medium text-[var(--color-secondary-text)] underline-offset-4 hover:underline"
                    >
                        Ver detalhes
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => onTryOut?.(api)}
                    className={[
                        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                        "bg-[var(--color-highlight)] text-white shadow-sm shadow-black/10 transition hover:brightness-110",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]",
                        isLoading ? "cursor-not-allowed opacity-80" : "",
                    ].join(" ")}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                            Testando...
                        </span>
                    ) : (
                        "Try Out"
                    )}
                </button>
            </div>
        </article>
    )
}
