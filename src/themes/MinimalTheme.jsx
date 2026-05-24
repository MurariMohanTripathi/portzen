import PortfolioRenderer from "../components/portfolio/PortfolioRenderer";

export default function MinimalTheme({ portfolio }) {
  const theme = portfolio.theme;
  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
      <div className="mx-auto max-w-4xl px-5 py-10">
        <header className="border-b pb-6" style={{ borderColor: `${portfolio.accentColor}33` }}>
          <p className="text-sm font-semibold uppercase" style={{ color: portfolio.accentColor }}>portzen.in/{portfolio.username || "username"}</p>
        </header>
        <PortfolioRenderer portfolio={portfolio} variant="light" />
      </div>
    </main>
  );
}
