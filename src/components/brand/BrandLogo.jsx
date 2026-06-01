export default function BrandLogo({ admin = false, compact = false, className = "", accentColor = "#67e8f9", textColor = "#ffffff", mutedColor = "#a1a1aa", surfaceColor = "#18181b" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} style={{ color: textColor }}>
      <span
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border shadow-lg"
        style={{ backgroundColor: surfaceColor, borderColor: `${accentColor}44`, boxShadow: `0 14px 30px ${accentColor}24` }}
        aria-hidden="true"
      >
        <span className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}42, transparent 48%, ${textColor}18)` }} />
        <span className="absolute left-2 top-2 h-2 w-2 rounded-sm" style={{ backgroundColor: accentColor }} />
        <span className="absolute bottom-2 right-2 h-2 w-2 rounded-sm" style={{ backgroundColor: textColor }} />
        <span className="relative text-lg font-black leading-none tracking-normal" style={{ color: textColor }}>P</span>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-xl font-black tracking-normal">Port<span style={{ color: accentColor }}>Zen</span></span>
          {admin ? <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: mutedColor }}>Admin</span> : null}
        </span>
      ) : null}
    </span>
  );
}
