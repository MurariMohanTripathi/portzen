import { useParams } from "react-router-dom";
import { defaultPortfolio } from "../data/portfolioSchema";
import TemplateRenderer from "../templates/TemplateRenderer";

export default function TemplatePreview() {
  const { template } = useParams();
  return <TemplateRenderer portfolio={{ ...defaultPortfolio, template }} />;
}
