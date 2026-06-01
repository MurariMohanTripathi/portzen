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
  ["Developer Blog", "/dashboard/stories"],
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
        <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-zinc-950/92 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl lg:sticky lg:inset-auto lg:top-0 lg:h-screen lg:border-r lg:border-t-0 lg:bg-zinc-950/75 lg:p-5">
          <div className="mb-8 hidden lg:block"><BrandLogo /></div>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
            {links.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) => `shrink-0 rounded-lg px-4 py-3 text-sm font-semibold transition lg:w-full ${isActive ? "bg-cyan-300 text-zinc-950 shadow-lg shadow-cyan-500/15" : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white lg:bg-transparent"}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="min-w-0 pb-24 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/82 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-xl sm:px-5 lg:px-6">
            <div className="mb-3 lg:hidden"><BrandLogo /></div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-zinc-500">Workspace</p>
              <p className="truncate font-semibold">{user?.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
              <Button className="w-full sm:w-auto" variant="secondary" disabled={!publicUsername} onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/${publicUsername}`)}>Copy Link</Button>
              <Button className="w-full sm:w-auto" variant="danger" onClick={handleLogout}>Logout</Button>
            </div>
            </div>
          </header>
          <main className="min-w-0 p-4 sm:p-5 lg:p-8">
            <Outlet />
          </main>
          <SiteFooter variant="compact" className="border-l border-white/10 lg:ml-0" />
        </section>
      </div>
    </div>
  );
}
