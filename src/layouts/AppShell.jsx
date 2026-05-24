import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

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
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.14),transparent_26%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-zinc-950/70 p-5 backdrop-blur-xl">
          <div className="mb-8 text-2xl font-black">Port<span className="text-cyan-300">Zen</span></div>
          <nav className="grid gap-2">
            {links.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) => `rounded-xl px-4 py-3 text-sm transition ${isActive ? "bg-cyan-400 text-zinc-950" : "text-zinc-300 hover:bg-white/5"}`}
              >
                {label}
              </NavLink>
            ))}
            {isAdmin ? <NavLink to="/admin/users" className="rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5">Admin</NavLink> : null}
          </nav>
        </aside>
        <section>
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/70 px-5 py-4 backdrop-blur-xl">
            <div>
              <p className="text-sm text-zinc-500">Workspace</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => navigator.clipboard?.writeText("https://portzen.in/murari")}>Copy Link</Button>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </div>
          </header>
          <main className="p-5 lg:p-8">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
