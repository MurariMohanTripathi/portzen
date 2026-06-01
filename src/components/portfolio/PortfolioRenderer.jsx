import { memo } from "react";
import SectionRenderer from "./SectionRenderer";
import { normalizeSections } from "../../utils/sections";

function PortfolioRenderer({ portfolio, variant = "dark" }) {
  const blogEnabled = Boolean(portfolio.developerBlog?.enabled);
  const sections = normalizeSections(portfolio.sections).filter((section) => {
    if (section.visible === false) return false;
    if ((section.type === "User Stories" || section.type === "Blogs") && !blogEnabled) return false;
    return true;
  });

  return sections.map((section) => (
    <SectionRenderer key={section.id} section={section} portfolio={portfolio} variant={variant} />
  ));
}

export default memo(PortfolioRenderer);
