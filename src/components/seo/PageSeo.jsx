import { useEffect } from "react";
import { applyPageSeo } from "../../utils/seo";

export default function PageSeo(props) {
  const { title, description, keywords, type, path, image, noIndex, jsonLd } = props;

  useEffect(() => {
    applyPageSeo({ title, description, keywords, type, path, image, noIndex, jsonLd });
  }, [title, description, keywords, type, path, image, noIndex, jsonLd]);

  return null;
}
