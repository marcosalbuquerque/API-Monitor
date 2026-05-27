export default function Notification({ type = "success", message, onClose }) {
    if (!message) return null;

    const isSuccess = type === "success";

    return (
        <div className={[
            "pointer-events-auto w-full rounded-2xl border p-4 shadow-xl",
            "bg-[var(--color-card-background)] text-[var(--color-main-text)]",
            "backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--color-card-background)_92%,transparent)]",
            isSuccess
                ? "border-emerald-500/50 ring-1 ring-emerald-500/10"
                : "border-rose-500/50 ring-1 ring-rose-500/10",
        ].join(" ")}
            role="status"
            aria-live="polite">
            <div className="flex items-start gap-3">
                <div
                    className={[
                        "mt-0.5 h-2.5 w-2.5 rounded-full",
                        isSuccess ? "bg-emerald-500" : "bg-rose-500",
                    ].join(" ")}
                />
                <div className="flex-1">
                    <div className="text-sm font-semibold">
                        {isSuccess ? "Success" : "Error"}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-secondary-text)]">
                        {message}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-[var(--color-secondary-text)] hover:text-[var(--color-main-text)]"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    )

}