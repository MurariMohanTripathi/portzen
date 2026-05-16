import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import GlassTemplate from "./GlassTemplate";
import { defaultPortfolio } from "../data/portfolioSchema";

export default function TemplateRenderer({ portfolio }) {
  const source = portfolio || defaultPortfolio;
  const resolved = {
    ...defaultPortfolio,
    ...source,
    theme: { ...defaultPortfolio.theme, ...source.theme },
    accentColor: source.theme?.accentColor || source.accentColor || defaultPortfolio.accentColor,
  };

  switch (resolved.template) {
    case "minimal":
      return <MinimalTemplate portfolio={resolved} />;
    case "glass":
      return <GlassTemplate portfolio={resolved} />;
    case "modern":
    default:
      return <ModernTemplate portfolio={resolved} />;
  }
}
