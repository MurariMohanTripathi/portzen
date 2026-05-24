import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import { templates } from "../data/portfolioSchema";
import { deleteUserRecord, listAdminUsers, updateAdminUser } from "../services/portfolioService";

export default function AdminDashboard({ view }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listAdminUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const filtered = useMemo(() => users.filter((user) => `${user.email} ${user.username} ${user.displayName}`.toLowerCase().includes(search.toLowerCase())), [users, search]);

  if (view === "analytics") return <Analytics users={users} />;
  if (view === "templates") return <TemplateAdmin />;
  if (view === "settings") return <Settings />;

  async function remove(uid) {
    await deleteUserRecord(uid);
    setUsers((prev) => prev.filter((user) => user.uid !== uid));
    toast.success("User record deleted");
  }

  async function updateUser(uid, updates) {
    try {
      await updateAdminUser(uid, updates);
      setUsers((prev) => prev.map((user) => user.uid === uid ? { ...user, ...updates } : user));
      toast.success("User updated");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-black">User Management</h1>
      <Field label="Search users"><input className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="email, username, name" /></Field>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-400"><tr><th className="p-4">User</th><th className="p-4">Username</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {filtered.map((user) => (
              <tr className="border-t border-white/10 align-top" key={user.uid}>
                <td className="p-4">
                  <p className="font-semibold">{user.displayName || user.email}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </td>
                <td className="p-4">
                  <input className={inputClass} value={user.username || ""} onChange={(event) => setUsers((prev) => prev.map((item) => item.uid === user.uid ? { ...item, username: event.target.value } : item))} />
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${user.banned ? "bg-red-500/15 text-red-200" : "bg-emerald-500/15 text-emerald-200"}`}>{user.banned ? "Banned" : user.role || "user"}</span>
                </td>
                <td className="flex flex-wrap gap-2 p-4">
                  <Button variant="secondary" onClick={() => updateUser(user.uid, { username: user.username || "" })}>Save username</Button>
                  <Button variant="secondary" onClick={() => updateUser(user.uid, { banned: !user.banned })}>{user.banned ? "Unban" : "Ban"}</Button>
                  {user.username ? <Button variant="secondary" onClick={() => window.open(`/${user.username}`, "_blank")}>View</Button> : null}
                  <Button variant="danger" onClick={() => remove(user.uid)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Analytics({ users }) {
  return (
    <section>
      <h1 className="text-3xl font-black">Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[["Users", users.length], ["Featured", 12], ["Stories", 48], ["Templates", templates.length]].map(([label, value]) => <div className="rounded-2xl border border-white/10 bg-white/5 p-5" key={label}><p className="text-zinc-400">{label}</p><p className="mt-3 text-3xl font-black text-fuchsia-300">{value}</p></div>)}
      </div>
      <div className="mt-6 h-72 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),transparent)] p-5">Chart placeholder for active users, portfolio views, template adoption, and story activity.</div>
    </section>
  );
}

function TemplateAdmin() {
  return <section><h1 className="text-3xl font-black">Template Management</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{templates.map((template) => <div className="rounded-2xl border border-white/10 bg-white/5 p-5" key={template.id}><h3 className="text-xl font-bold">{template.name}</h3><p className="mt-2 text-sm text-zinc-400">{template.description}</p><Button className="mt-4" variant="secondary">Feature Template</Button></div>)}</div></section>;
}

function Settings() {
  return <section className="rounded-2xl border border-white/10 bg-white/5 p-5"><h1 className="text-3xl font-black">Admin Settings</h1><p className="mt-3 text-zinc-400">Reserved usernames, banned usernames, domain overrides, template visibility, and superadmin policies belong here.</p></section>;
}
