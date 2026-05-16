import { NavLink, Outlet } from "react-router-dom";

const links = [
  ["Users", "/admin/users"],
  ["Analytics", "/admin/analytics"],
  ["Templates", "/admin/templates"],
  ["Settings", "/admin/settings"],
  ["Dashboard", "/dashboard/overview"],
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
        <aside className="border-r border-white/10 bg-black/30 p-5">
          <div className="mb-8 text-2xl font-black">PortZen Admin</div>
          <nav className="grid gap-2">
            {links.map(([label, href]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm ${isActive ? "bg-fuchsia-400 text-zinc-950" : "text-zinc-300 hover:bg-white/5"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
