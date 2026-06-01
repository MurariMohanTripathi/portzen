import { defaultPortfolio } from "../data/portfolioSchema";

export function normalizeDeveloperBlog(portfolio = {}) {
  const source = portfolio.developerBlog || {};
  return {
    ...defaultPortfolio.developerBlog,
    ...source,
    theme: { ...defaultPortfolio.developerBlog.theme, ...source.theme },
  };
}

export function portfolioWithBlogTheme(portfolio = {}) {
  const developerBlog = normalizeDeveloperBlog(portfolio);
  if (developerBlog.usePortfolioTheme) {
    return { ...portfolio, developerBlog };
  }
  return {
    ...portfolio,
    developerBlog,
    theme: developerBlog.theme,
    accentColor: developerBlog.theme.accentColor || portfolio.accentColor,
  };
}
