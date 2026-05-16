import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateRenderer from "../templates/TemplateRenderer";
import { defaultPortfolio } from "../data/portfolioSchema";
import { getPortfolioByUsername, incrementPortfolioView } from "../services/portfolioService";
import LoadingScreen from "../components/ui/LoadingScreen";

export default function PortfolioPage() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPortfolioByUsername(username)
      .then((data) => {
        if (!active) return;
        const resolved = data || { ...defaultPortfolio, username };
        setPortfolio(resolved);
        incrementPortfolioView(resolved.uid).catch(() => {});
        document.title = `${resolved.displayName} | PortZen`;
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [username]);

  if (loading) return <LoadingScreen />;
  return <TemplateRenderer portfolio={portfolio} />;
}
