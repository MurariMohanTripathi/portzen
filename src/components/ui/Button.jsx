export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-cyan-300 text-zinc-950 hover:bg-cyan-200 shadow-lg shadow-cyan-500/20",
    secondary: "border border-white/10 bg-zinc-900/70 text-zinc-100 hover:border-cyan-200/55 hover:bg-zinc-800/90",
    subtle: "bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
    danger: "border border-red-400/30 bg-red-950/10 text-red-100 hover:bg-red-500/15",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
