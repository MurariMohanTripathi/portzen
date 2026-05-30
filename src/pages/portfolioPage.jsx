import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateRenderer from "../templates/TemplateRenderer";
import { defaultPortfolio } from "../data/portfolioSchema";
import { getPortfolioByUsername, incrementPortfolioView } from "../services/portfolioService";
import LoadingScreen from "../components/ui/LoadingScreen";
import { applyPortfolioSeo } from "../utils/seo";
import CustomCodePortfolio from "../components/portfolio/CustomCodePortfolio";
import SiteFooter from "../components/layout/SiteFooter";

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
        incrementPortfolioView(resolved.uid, getVisitorId()).catch(() => {});
        applyPortfolioSeo(resolved);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [username]);

  if (loading) return <LoadingScreen />;
  if (portfolio?.banned) return <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">This portfolio is unavailable.</div>;
  if (portfolio?.customCode?.enabled) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <CustomCodePortfolio customCode={portfolio.customCode} />
        <SiteFooter variant="detailed" portfolio={portfolio} />
      </main>
    );
  }
  return <TemplateRenderer portfolio={portfolio} />;
}

function getVisitorId() {
  const key = "portzen.visitorId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(key, next);
  return next;
}
