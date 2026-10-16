/** Logotipo PROVISIONAL de FROSTY LAB (SVG). No es un archivo de marca oficial. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="fl-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--ice-blue)" />
            <stop offset="1" stopColor="var(--turquoise)" />
          </linearGradient>
        </defs>
        <path d="M32 4C32 4 12 28 12 41a20 20 0 0 0 40 0C52 28 32 4 32 4z" fill="url(#fl-g)" />
        <g stroke="var(--snow)" strokeWidth="3" strokeLinecap="round">
          <path d="M32 30v22M22.5 35.5l19 11M41.5 35.5l-19 11" />
        </g>
      </svg>
      <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-snow" : "text-night"}`}>
        FROSTY<span className="text-pink"> LAB</span>
      </span>
    </span>
  );
}
