import { useCallback, useEffect, useRef } from "react";

export default function ReactiveBackground({ children }) {
  const hostRef = useRef(null);
  const trailContainerRef = useRef(null);
  
  const activeSquares = useRef(new Set()); 

  const rafRef = useRef(0);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);

  const GRID = 28;

  const apply = useCallback(() => {
    rafRef.current = 0;
    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, lastPointRef.current.x - rect.left));
    const y = Math.max(0, Math.min(rect.height, lastPointRef.current.y - rect.top));

    host.style.setProperty("--mx", `${x}px`);
    host.style.setProperty("--my", `${y}px`);
    host.style.setProperty("--hover", hoveringRef.current ? "1" : "0");
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      hoveringRef.current = true;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);

      const container = trailContainerRef.current;
      if (!container) return;

      const rect = hostRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor(x / GRID);
      const row = Math.floor(y / GRID);
      const key = `${col}-${row}`;

      if (!activeSquares.current.has(key)) {
        activeSquares.current.add(key);

        const square = document.createElement("div");
        square.className = "reactive-trail-square";
        square.style.left = `${col * GRID}px`;
        square.style.top = `${row * GRID}px`;

        container.appendChild(square);

        square.offsetHeight; 
        
        square.style.opacity = "0";

        setTimeout(() => {
          square.remove();
          activeSquares.current.delete(key);
        }, 1000);
      }
    },
    [apply]
  );

  const onMouseLeave = useCallback(() => {
    hoveringRef.current = false;
    const host = hostRef.current;
    if (host) host.style.setProperty("--hover", "0");
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    host.style.setProperty("--cell", `${GRID}px`);
    host.style.setProperty("--mx", "50%");
    host.style.setProperty("--my", "35%");
    host.style.setProperty("--hover", "0");

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative isolate min-h-screen overflow-hidden bg-[var(--color-main-background)] text-[var(--color-main-text)]"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(900px 600px at 50% 45%,
                color-mix(in oklab, var(--color-main-background) 78%, black) 0%,
                var(--color-main-background) 55%,
                color-mix(in oklab, var(--color-main-background) 86%, white) 100%)
            `,
          }}
        />

        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                color-mix(in oklab, var(--color-border) 55%, transparent) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                color-mix(in oklab, var(--color-border) 55%, transparent) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "var(--cell) var(--cell)",
            backgroundPosition: "0 0",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(220px 220px at var(--mx) var(--my),
                color-mix(in oklab, var(--color-highlight) 18%, transparent) 0%,
                transparent 70%)
            `,
            opacity: 0.55,
            transition: "background-image 0ms" 
          }}
        />

        <div ref={trailContainerRef} className="absolute inset-0" />
      </div>

      <div className="relative z-10"> {children} </div>
    </div>
  );
}