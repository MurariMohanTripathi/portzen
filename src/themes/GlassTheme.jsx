import PortfolioRenderer from "../components/portfolio/PortfolioRenderer";
import SiteFooter from "../components/layout/SiteFooter";
import { normalizeTheme, withAlpha } from "../utils/themeColors";

export default function GlassTheme({ portfolio }) {
  const theme = normalizeTheme(portfolio);
  return (
    <main
      className="min-h-screen"
      style={{
        background: portfolio.heroBanner
          ? `linear-gradient(135deg, ${withAlpha(theme.backgroundColor, 0.9)}, ${withAlpha(theme.surfaceColor, 0.96)}), url(${portfolio.heroBanner}) center/cover fixed`
          : `linear-gradient(135deg, ${theme.backgroundColor}, ${theme.surfaceColor})`,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="pointer-events-none fixed inset-0" style={{ background: `linear-gradient(120deg, ${withAlpha(theme.accentColor, 0.16)}, transparent 42%), radial-gradient(circle at 85% 10%, ${withAlpha(theme.textColor, 0.1)}, transparent 24%)` }} />
      <div className="relative mx-auto max-w-6xl px-5 py-8">
        <div className="border p-5 shadow-2xl backdrop-blur-2xl" style={{ borderColor: theme.borderColor, backgroundColor: withAlpha(theme.surfaceColor, 0.86), borderRadius: theme.cornerRadius, color: theme.surfaceTextColor }}>
          <PortfolioRenderer portfolio={portfolio} variant="dark" />
        </div>
      </div>
      <SiteFooter variant="detailed" portfolio={portfolio} />
    </main>
  );
}
