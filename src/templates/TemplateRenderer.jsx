import { defaultPortfolio } from "../data/portfolioSchema";
import ThemeRenderer from "../components/portfolio/ThemeRenderer";
import { normalizeSections } from "../utils/sections";

export default function TemplateRenderer({ portfolio }) {
  const source = portfolio || defaultPortfolio;
  const resolved = {
    ...defaultPortfolio,
    ...source,
    theme: { ...defaultPortfolio.theme, ...source.theme },
    developerBlog: {
      ...defaultPortfolio.developerBlog,
      ...source.developerBlog,
      theme: { ...defaultPortfolio.developerBlog.theme, ...source.developerBlog?.theme },
    },
    sections: normalizeSections(source.sections || defaultPortfolio.sections),
    accentColor: source.theme?.accentColor || source.accentColor || defaultPortfolio.accentColor,
  };

  return <ThemeRenderer portfolio={resolved} />;
}
