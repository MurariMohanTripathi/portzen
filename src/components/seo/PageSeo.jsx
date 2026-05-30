import { useEffect } from "react";
import { applyPageSeo } from "../../utils/seo";

export default function PageSeo(props) {
  const { title, description, type, path, noIndex } = props;

  useEffect(() => {
    applyPageSeo({ title, description, type, path, noIndex });
  }, [title, description, type, path, noIndex]);

  return null;
}
