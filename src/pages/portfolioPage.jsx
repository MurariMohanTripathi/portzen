import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateRenderer from "../templates/TemplateRenderer";
import { defaultPortfolio } from "../data/portfolioSchema";
import { getPortfolioByUsername, incrementPortfolioView, submitPortfolioMessage } from "../services/portfolioService";
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
        <PortfolioContactForm portfolio={portfolio} />
        <SiteFooter variant="detailed" portfolio={portfolio} />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-zinc-950">
      <TemplateRenderer portfolio={portfolio} />
      <PortfolioContactForm portfolio={portfolio} />
    </main>
  );
}

function PortfolioContactForm({ portfolio }) {
  const theme = { ...defaultPortfolio.theme, ...portfolio.theme };
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("sending");
    try {
      await submitPortfolioMessage(portfolio.uid, form);
      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch (submitError) {
      setError(submitError.message);
      setStatus("idle");
    }
  }

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8" style={{ background: theme.backgroundColor, color: theme.textColor }}>
      <div className="mx-auto grid max-w-5xl gap-8 rounded-lg border p-5 shadow-2xl shadow-black/20 md:grid-cols-[0.8fr_1.2fr] md:p-8" style={{ borderColor: `${theme.accentColor}55`, background: theme.surfaceColor }}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>Contact</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">Send a message to {portfolio.displayName || portfolio.username}</h2>
          <p className="mt-3 text-sm leading-6 opacity-80">Share your name, email, and message. It will appear in the creator's PortZen inbox.</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold">
            Name
            <input className="rounded-lg border border-white/15 bg-black/20 px-4 py-3 text-base outline-none transition focus:border-white/40" value={form.name} onChange={(event) => update("name", event.target.value)} required maxLength={120} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input className="rounded-lg border border-white/15 bg-black/20 px-4 py-3 text-base outline-none transition focus:border-white/40" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required maxLength={160} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Message
            <textarea className="min-h-36 rounded-lg border border-white/15 bg-black/20 px-4 py-3 text-base leading-6 outline-none transition focus:border-white/40" value={form.message} onChange={(event) => update("message", event.target.value)} required maxLength={2000} />
          </label>
          {error ? <p className="rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</p> : null}
          {status === "sent" ? <p className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">Message sent successfully.</p> : null}
          <button
            className="rounded-lg px-5 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: theme.accentColor, color: theme.backgroundColor }}
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function getVisitorId() {
  const key = "portzen.visitorId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(key, next);
  return next;
}
