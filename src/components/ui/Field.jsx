export default function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-zinc-950/75 px-4 py-3 text-sm text-white shadow-sm shadow-black/10 outline-none transition duration-200 placeholder:text-zinc-600 focus:border-cyan-300/70 focus:bg-zinc-950";
