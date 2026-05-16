export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20",
    secondary: "border border-white/10 bg-white/5 text-white hover:border-cyan-300/60",
    subtle: "bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
    danger: "border border-red-400/30 text-red-200 hover:bg-red-500/15",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
