import { useParams } from "react-router-dom";
import { defaultPortfolio } from "../data/portfolioSchema";
import TemplateRenderer from "../templates/TemplateRenderer";
import PageSeo from "../components/seo/PageSeo";
import { pageSeo } from "../utils/seo";

export default function TemplatePreview() {
  const { template } = useParams();
  return (
    <>
      <PageSeo {...pageSeo.preview} title={`${template || "Template"} Preview | PortZen`} path={`/preview/${template || ""}`} />
      <TemplateRenderer portfolio={{ ...defaultPortfolio, template }} />
    </>
  );
}
