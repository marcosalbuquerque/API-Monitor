export default function Header({
  darkMode,
  setDarkMode,
  searchQuery = "",
  onSearchChange,
}) {
  return (
    <header className="w-full border-b border-[var(--color-border)] bg-[var(--color-card-background)] px-6 py-4 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-[var(--color-main-text)]">
            API Monitor
          </span>
          <span className="text-xs text-[var(--color-secondary-text)]">
            Monitore a disponibilidade de APIs públicas
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-[var(--color-highlight)]">
            Dashboard
          </a>
          <a href="#apis" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-main-text)] transition-colors">
            API's Recentes
          </a>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          {typeof onSearchChange === "function" ? (
            <div className="w-full max-w-xs">
              <label className="sr-only" htmlFor="api-search">
                Buscar APIs
              </label>
              <input
                id="api-search"
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar APIs..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-background)] px-3 py-2 text-sm text-[var(--color-main-text)] placeholder:text-[var(--color-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] focus:ring-offset-2 focus:ring-offset-[var(--color-main-background)]"
              />
            </div>
          ) : null}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-[var(--color-secondary-text)] hover:bg-[var(--color-main-background)] hover:text-[var(--color-main-text)] transition-all"
            aria-label="Alternar tema"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.66 6.34l1.58-1.58M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
