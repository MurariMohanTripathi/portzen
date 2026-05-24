import { memo } from "react";
import SectionRenderer from "./SectionRenderer";
import { normalizeSections } from "../../utils/sections";

function PortfolioRenderer({ portfolio, variant = "dark" }) {
  const sections = normalizeSections(portfolio.sections).filter((section) => section.visible !== false);

  return sections.map((section) => (
    <SectionRenderer key={section.id} section={section} portfolio={portfolio} variant={variant} />
  ));
}

export default memo(PortfolioRenderer);
