import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import { getPortfolioByUid } from "../services/portfolioService";
import BrandLogo from "../components/brand/BrandLogo";
import PageSeo from "../components/seo/PageSeo";
import SiteFooter from "../components/layout/SiteFooter";
import { pageSeo } from "../utils/seo";

const links = [
  ["Overview", "/dashboard/overview"],
  ["Edit", "/dashboard/edit"],
  ["Projects", "/dashboard/projects"],
  ["Experience", "/dashboard/experience"],
  ["Templates", "/dashboard/templates"],
  ["Code Your Own Folio", "/dashboard/code"],
  ["Stories", "/dashboard/stories"],
  ["Settings", "/dashboard/settings"],
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [publicUsername, setPublicUsername] = useState("");

  useEffect(() => {
    if (!user?.uid) return undefined;
    let active = true;
    getPortfolioByUid(user.uid).then((portfolio) => {
      if (active) setPublicUsername(portfolio.username || "");
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [user?.uid]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PageSeo {...pageSeo.dashboard} />
      <div className="fixed inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,0.56),rgba(9,9,11,0.96)_40%,rgba(76,29,49,0.38))]" />
      <div className="relative grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-zinc-950/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-8"><BrandLogo /></div>
          <nav className="grid gap-2">
            {links.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) => `rounded-lg px-4 py-3 text-sm transition ${isActive ? "bg-cyan-300 text-zinc-950 shadow-lg shadow-cyan-500/15" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section>
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/75 px-5 py-4 shadow-lg shadow-black/10 backdrop-blur-xl">
            <div>
              <p className="text-sm text-zinc-500">Workspace</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" disabled={!publicUsername} onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/${publicUsername}`)}>Copy Link</Button>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </div>
          </header>
          <main className="p-5 lg:p-8">
            <Outlet />
          </main>
          <SiteFooter variant="compact" className="border-l border-white/10 lg:ml-0" />
        </section>
      </div>
    </div>
  );
}
