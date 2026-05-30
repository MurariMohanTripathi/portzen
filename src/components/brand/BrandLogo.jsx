export default function BrandLogo({ admin = false, compact = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 text-white ${className}`}>
      <span
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-cyan-200/25 bg-zinc-900 shadow-lg shadow-cyan-500/15"
        aria-hidden="true"
      >
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.26),rgba(99,102,241,0.1)_44%,rgba(244,114,182,0.18))]" />
        <span className="absolute left-2 top-2 h-2 w-2 rounded-sm bg-cyan-200" />
        <span className="absolute bottom-2 right-2 h-2 w-2 rounded-sm bg-rose-200" />
        <span className="relative text-lg font-black leading-none tracking-normal text-white">P</span>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-xl font-black tracking-normal">Port<span className="text-cyan-200">Zen</span></span>
          {admin ? <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Admin</span> : null}
        </span>
      ) : null}
    </span>
  );
}
