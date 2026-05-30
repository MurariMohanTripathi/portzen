import { NavLink, Outlet, useOutletContext, useParams } from "react-router-dom";
import BrandLogo from "../components/brand/BrandLogo";
import PageSeo from "../components/seo/PageSeo";
import SiteFooter from "../components/layout/SiteFooter";
import { pageSeo } from "../utils/seo";

const links = [
  ["Users", "users"],
  ["Analytics", "analytics"],
  ["Templates", "templates"],
  ["Settings", "settings"],
  ["Dashboard", "/dashboard/overview"],
];

export default function AdminLayout() {
  const { adminUsername } = useParams();
  const { adminProfile } = useOutletContext();
  const basePath = `/admin/${adminUsername}`;
  const scopedLinks = links.map(([label, href]) => [label, href === "/dashboard/overview" ? href : `${basePath}/${href}`]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PageSeo {...pageSeo.admin} noIndex />
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
        <aside className="border-r border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20">
          <div className="mb-8">
            <BrandLogo admin />
            <p className="mt-3 text-xs text-zinc-500">{adminProfile?.email}</p>
          </div>
          <nav className="grid gap-2">
            {scopedLinks.map(([label, href]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm transition ${isActive ? "bg-cyan-300 text-zinc-950 shadow-lg shadow-cyan-500/15" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section>
          <main className="p-5 lg:p-8">
            <Outlet />
          </main>
          <SiteFooter variant="compact" />
        </section>
      </div>
    </div>
  );
}
