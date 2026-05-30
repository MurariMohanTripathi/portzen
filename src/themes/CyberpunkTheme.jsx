import PortfolioRenderer from "../components/portfolio/PortfolioRenderer";
import SiteFooter from "../components/layout/SiteFooter";
import { normalizeTheme, withAlpha } from "../utils/themeColors";

export default function CyberpunkTheme({ portfolio }) {
  const theme = normalizeTheme(portfolio);
  return (
    <main
      className="min-h-screen overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        backgroundImage: portfolio.heroBanner
          ? `linear-gradient(135deg, ${withAlpha(theme.backgroundColor, 0.94)}, ${withAlpha(theme.backgroundColor, 0.98)}), url(${portfolio.heroBanner})`
          : `linear-gradient(135deg, ${theme.backgroundColor}, ${theme.backgroundColor} 58%, ${withAlpha(theme.accentColor, 0.16)})`,
        backgroundPosition: "center top",
        backgroundSize: "cover",
      }}
    >
      <div className="pointer-events-none fixed inset-0" style={{ background: `linear-gradient(90deg, ${withAlpha(theme.accentColor, 0.12)}, transparent 34%), radial-gradient(circle at 84% 10%, ${withAlpha(theme.surfaceColor, 0.72)}, transparent 28%)` }} />
      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <PortfolioRenderer portfolio={portfolio} variant="dark" />
      </div>
      <SiteFooter variant="detailed" portfolio={portfolio} />
    </main>
  );
}
