import PortfolioRenderer from "../components/portfolio/PortfolioRenderer";
import { normalizeTheme, withAlpha } from "../utils/themeColors";

export default function MinimalTheme({ portfolio }) {
  const theme = normalizeTheme(portfolio);
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        backgroundImage: portfolio.heroBanner ? `linear-gradient(${withAlpha(theme.backgroundColor, 0.96)}, ${withAlpha(theme.backgroundColor, 0.99)}), url(${portfolio.heroBanner})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <div className="mx-auto max-w-4xl px-5 py-12">
        <PortfolioRenderer portfolio={portfolio} variant="light" />
      </div>
    </main>
  );
}
