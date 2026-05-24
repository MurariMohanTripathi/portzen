import PortfolioRenderer from "../components/portfolio/PortfolioRenderer";

export default function CyberpunkTheme({ portfolio }) {
  const theme = portfolio.theme;
  return (
    <main className="min-h-screen overflow-hidden" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
      <div className="pointer-events-none fixed inset-0 opacity-70" style={{ background: `radial-gradient(circle at 20% 0%, ${portfolio.accentColor}33, transparent 32%), radial-gradient(circle at 80% 20%, ${theme.surfaceColor}99, transparent 28%)` }} />
      <div className="relative mx-auto max-w-6xl px-5 py-8">
        <nav className="flex items-center justify-between border-b pb-5" style={{ borderColor: `${portfolio.accentColor}33` }}>
          <div className="text-xl font-black">Port<span style={{ color: portfolio.accentColor }}>Zen</span></div>
          <span className="rounded-lg border px-3 py-1 text-xs text-white/60" style={{ borderColor: `${portfolio.accentColor}33` }}>/{portfolio.username || "username"}</span>
        </nav>
        <PortfolioRenderer portfolio={portfolio} variant="dark" />
      </div>
    </main>
  );
}
