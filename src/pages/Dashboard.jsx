import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { defaultPortfolio, sectionTypes, templates, themePresets } from "../data/portfolioSchema";
import { useAuth } from "../contexts/AuthContext";
import { getPortfolioByUid, savePortfolio } from "../services/portfolioService";
import useUsernameAvailability from "../hooks/useUsernameAvailability";
import { normalizeUsername, validateUsername, wordsCount } from "../utils/username";
import TemplateRenderer from "../templates/TemplateRenderer";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import LoadingScreen from "../components/ui/LoadingScreen";

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Dashboard({ view }) {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ ...defaultPortfolio });
  const [savedUsername, setSavedUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const availability = useUsernameAvailability(portfolio.username, user?.uid);

  useEffect(() => {
    getPortfolioByUid(user.uid)
      .then((data) => {
        const next = {
          ...defaultPortfolio,
          ...data,
          uid: user.uid,
          email: user.email,
          displayName: data.displayName || user.displayName || "",
          socials: {
            ...defaultPortfolio.socials,
            ...data.socials,
            email: data.socials?.email || user.email || "",
          },
        };
        setPortfolio(next);
        setSavedUsername(next.username || "");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const completion = useMemo(() => {
    const fields = [portfolio.username, portfolio.displayName, portfolio.headline, portfolio.bio, portfolio.sections?.length, portfolio.socials?.github];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [portfolio]);

  async function save() {
    try {
      const validation = validateUsername(portfolio.username);
      if (!validation.ok) {
        toast.error(validation.reason);
        return;
      }
      if (!portfolio.displayName.trim()) {
        toast.error("Full name is required.");
        return;
      }
      if (!portfolio.headline.trim()) {
        toast.error("Headline is required.");
        return;
      }
      if (availability.status === "taken") {
        toast.error("Username is already taken.");
        return;
      }
      if (availability.status === "checking") {
        toast.error("Wait for username check to finish.");
        return;
      }

      const saved = await savePortfolio(user.uid, { ...portfolio, username: validation.username });
      setPortfolio((prev) => ({ ...prev, ...saved, username: validation.username }));
      setSavedUsername(validation.username);
      toast.success("Portfolio saved");
    } catch (error) {
      toast.error(error.message);
    }
  }

  function openPublicView() {
    if (!savedUsername) {
      toast.error("Save a username before opening public view.");
      return;
    }
    if (portfolio.username !== savedUsername) {
      toast.error("Save your username changes before opening public view.");
      return;
    }
    window.open(`/${savedUsername}`, "_blank");
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black capitalize">{view}</h1>
          <p className="mt-1 text-zinc-400">Custom URL: portzen.in/{portfolio.username || "username"}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" disabled={!savedUsername || portfolio.username !== savedUsername} onClick={openPublicView}>Public View</Button>
          <Button onClick={save}>Save Changes</Button>
        </div>
      </div>

      {view === "overview" && <Overview portfolio={portfolio} completion={completion} />}
      {view === "edit" && <Builder portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />}
      {view === "projects" && <Projects portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "experience" && <Experience portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "templates" && <Templates portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "stories" && <Stories portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "settings" && <Settings portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />}
    </div>
  );
}

function Overview({ portfolio, completion }) {
  const stats = [
    ["Views", portfolio.analytics?.views || 0],
    ["Bookmarks", portfolio.analytics?.bookmarks || 0],
    ["Clicks", portfolio.analytics?.clicks || 0],
    ["Sections", portfolio.sections?.length || 0],
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-4">
          <h2 className="text-xl font-bold">Launch checklist</h2>
          <div className="mt-4 h-3 rounded-full bg-zinc-900"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${completion}%` }} /></div>
          <p className="mt-3 text-sm text-zinc-400">{completion}% complete. Add projects, stories, social links, and a resume before sharing.</p>
        </div>
      </div>
      <div className="h-[720px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="origin-top scale-[0.55] md:scale-[0.58]"><TemplateRenderer portfolio={portfolio} /></div>
      </div>
    </div>
  );
}

function Builder({ portfolio, setPortfolio, availability }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
      <div className="space-y-5">
        <ProfileEditor portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />
        <ThemeDesigner portfolio={portfolio} setPortfolio={setPortfolio} />
        <SectionManager portfolio={portfolio} setPortfolio={setPortfolio} />
      </div>
      <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-auto rounded-2xl border border-white/10 bg-white/5">
        <TemplateRenderer portfolio={portfolio} />
      </div>
    </div>
  );
}

function ProfileEditor({ portfolio, setPortfolio, availability }) {
  const update = (key, value) => setPortfolio((prev) => ({ ...prev, [key]: value }));
  const updateSocial = (key, value) => setPortfolio((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
  return (
    <Panel title="Portfolio Basics">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Username" hint={availability.message}>
          <input className={inputClass} value={portfolio.username} onChange={(e) => update("username", normalizeUsername(e.target.value))} />
        </Field>
        <Field label="Full name"><input className={inputClass} value={portfolio.displayName} onChange={(e) => update("displayName", e.target.value)} /></Field>
        <Field label="Headline"><input className={inputClass} value={portfolio.headline} onChange={(e) => update("headline", e.target.value)} /></Field>
      </div>
      <Field label="Bio"><textarea className={inputClass} rows={3} value={portfolio.bio} onChange={(e) => update("bio", e.target.value)} /></Field>
      <Field label="Summary"><textarea className={inputClass} rows={4} value={portfolio.summary} onChange={(e) => update("summary", e.target.value)} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        {["github", "linkedin", "website", "email"].map((key) => <Field key={key} label={key}><input className={inputClass} value={portfolio.socials?.[key] || ""} onChange={(e) => updateSocial(key, e.target.value)} /></Field>)}
      </div>
    </Panel>
  );
}

function ThemeDesigner({ portfolio, setPortfolio }) {
  const theme = { ...defaultPortfolio.theme, ...portfolio.theme };
  const updateTheme = (updates) => {
    setPortfolio((prev) => ({
      ...prev,
      accentColor: updates.accentColor || prev.accentColor,
      theme: { ...defaultPortfolio.theme, ...prev.theme, ...updates },
    }));
  };

  return (
    <Panel title="Theme Designer">
      <div className="grid gap-3 sm:grid-cols-2">
        {themePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => updateTheme(preset)}
            className={`rounded-xl border p-3 text-left transition ${theme.name === preset.name ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-zinc-950/60 hover:border-white/30"}`}
          >
            <div className="flex gap-2">
              {[preset.backgroundColor, preset.surfaceColor, preset.accentColor, preset.textColor].map((color) => (
                <span key={color} className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: color }} />
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold">{preset.name}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ColorField label="Accent" value={theme.accentColor} onChange={(value) => updateTheme({ accentColor: value })} />
        <ColorField label="Background" value={theme.backgroundColor} onChange={(value) => updateTheme({ backgroundColor: value })} />
        <ColorField label="Text" value={theme.textColor} onChange={(value) => updateTheme({ textColor: value })} />
        <ColorField label="Surface" value={theme.surfaceColor} onChange={(value) => updateTheme({ surfaceColor: value })} />
        <Field label="Font family">
          <select className={inputClass} value={theme.fontFamily} onChange={(e) => updateTheme({ fontFamily: e.target.value })}>
            <option value="Inter, system-ui, sans-serif">Inter / System</option>
            <option value="Georgia, serif">Editorial Serif</option>
            <option value="'Courier New', monospace">Mono</option>
          </select>
        </Field>
        <Field label={`Corner radius: ${theme.cornerRadius}px`}>
          <input className="w-full accent-cyan-300" type="range" min="4" max="28" value={theme.cornerRadius} onChange={(e) => updateTheme({ cornerRadius: Number(e.target.value) })} />
        </Field>
      </div>
    </Panel>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex gap-3">
        <input className="h-12 w-14 rounded-xl border border-white/10 bg-zinc-950" type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

function SectionManager({ portfolio, setPortfolio }) {
  const [draggedId, setDraggedId] = useState(null);

  function addSection(type) {
    const id = makeId(type.toLowerCase().replace(/\s+/g, "-"));
    const data = type === "Custom" ? { components: [{ id: makeId("c"), componentType: "customCard", props: { title: "New card", description: "Describe this highlight." } }] } : { items: [] };
    setPortfolio((prev) => ({ ...prev, sections: [...prev.sections, { id, type, title: type, data }] }));
  }
  function remove(id) {
    setPortfolio((prev) => ({ ...prev, sections: prev.sections.filter((section) => section.id !== id) }));
  }
  function title(id, value) {
    setPortfolio((prev) => ({ ...prev, sections: prev.sections.map((section) => section.id === id ? { ...section, title: value } : section) }));
  }
  function reorder(targetId) {
    if (!draggedId || draggedId === targetId) return;
    setPortfolio((prev) => {
      const next = [...prev.sections];
      const from = next.findIndex((section) => section.id === draggedId);
      const to = next.findIndex((section) => section.id === targetId);
      if (from < 0 || to < 0) return prev;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, sections: next };
    });
  }
  return (
    <Panel title="Dynamic Sections">
      <div className="flex flex-wrap gap-2">{sectionTypes.map((type) => <Button key={type} variant="secondary" onClick={() => addSection(type)}>Add {type}</Button>)}</div>
      <div className="mt-5 space-y-3">
        {portfolio.sections.map((section) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => {
              setDraggedId(section.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              reorder(section.id);
            }}
            onDragEnd={() => setDraggedId(null)}
            className={`rounded-xl border p-4 transition ${draggedId === section.id ? "border-cyan-300 bg-cyan-300/10 opacity-70" : "border-white/10 bg-zinc-950/60"}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="cursor-grab select-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 active:cursor-grabbing">Drag</span>
              <input className={inputClass} value={section.title} onChange={(e) => title(section.id, e.target.value)} />
              <span className="rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400">{section.type}</span>
              <Button variant="danger" onClick={() => remove(section.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Projects({ portfolio, setPortfolio }) {
  const projectsSection = portfolio.sections.find((section) => section.type === "Projects");
  const projects = projectsSection?.data?.items || [];
  const updateProjects = (items) => setPortfolio((prev) => ({ ...prev, sections: prev.sections.map((section) => section.id === projectsSection.id ? { ...section, data: { ...section.data, items } } : section) }));
  const add = () => updateProjects([...projects, { id: `p-${Date.now()}`, title: "New Project", description: "", techStack: [], githubUrl: "", liveUrl: "", coverImage: "", screenshots: [], featured: false }]);
  return <CollectionEditor title="Projects" items={projects} add={add} updateItems={updateProjects} fields={["title", "description", "githubUrl", "liveUrl"]} />;
}

function Experience({ portfolio, setPortfolio }) {
  const section = portfolio.sections.find((item) => item.type === "Experience");
  const items = section?.data?.items || [];
  const updateItems = (next) => setPortfolio((prev) => ({ ...prev, sections: prev.sections.map((item) => item.id === section.id ? { ...item, data: { ...item.data, items: next } } : item) }));
  const add = () => updateItems([...items, { role: "Role", company: "Company", period: "2026", summary: "" }]);
  return <CollectionEditor title="Experience" items={items} add={add} updateItems={updateItems} fields={["role", "company", "period", "summary"]} />;
}

function CollectionEditor({ title, items, add, updateItems, fields }) {
  function update(index, field, value) {
    const next = items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item);
    updateItems(next);
  }
  return (
    <Panel title={title} action={<Button onClick={add}>Add {title.slice(0, -1)}</Button>}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4" key={item.id || index}>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => <Field key={field} label={field}><input className={inputClass} value={item[field] || ""} onChange={(e) => update(index, field, e.target.value)} /></Field>)}
            </div>
            <Button className="mt-3" variant="danger" onClick={() => updateItems(items.filter((_, itemIndex) => itemIndex !== index))}>Delete</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Templates({ portfolio, setPortfolio }) {
  return <div className="grid gap-4 md:grid-cols-3">{templates.map((template) => (
    <button key={template.id} onClick={() => setPortfolio((prev) => ({ ...prev, template: template.id, accentColor: template.accent, theme: { ...defaultPortfolio.theme, ...prev.theme, accentColor: template.accent } }))} className={`rounded-2xl border p-5 text-left transition ${portfolio.template === template.id ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
      <div className="h-36 rounded-xl bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/10 to-emerald-400/20" />
      <h3 className="mt-4 text-xl font-bold">{template.name}</h3>
      <p className="mt-2 text-sm text-zinc-400">{template.description}</p>
    </button>
  ))}</div>;
}

function Stories({ portfolio, setPortfolio }) {
  const [text, setText] = useState("");
  function addStory() {
    if (wordsCount(text) > 100) return toast.error("Stories are limited to 100 words");
    setPortfolio((prev) => ({ ...prev, stories: [{ id: `s-${Date.now()}`, text, createdAt: new Date().toISOString() }, ...prev.stories] }));
    setText("");
  }
  return (
    <Panel title="Developer Stories">
      <Field label={`New story (${wordsCount(text)}/100 words)`}><textarea className={inputClass} rows={3} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <Button onClick={addStory} disabled={!text.trim()}>Publish Story</Button>
      <div className="mt-5 grid gap-3">
        {portfolio.stories.map((story) => <div key={story.id} className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-zinc-500">{new Date(story.createdAt).toLocaleString()}</p><p className="mt-2">{story.text}</p><Button className="mt-3" variant="danger" onClick={() => setPortfolio((prev) => ({ ...prev, stories: prev.stories.filter((item) => item.id !== story.id) }))}>Delete</Button></div>)}
      </div>
    </Panel>
  );
}

function Settings({ portfolio, setPortfolio, availability }) {
  return (
    <Panel title="Settings">
      <ProfileEditor portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-bold">Premium placeholders</h3>
        <p className="mt-2 text-sm text-zinc-400">Resume PDF export, AI bio suggestions, favicon upload, portfolio cloning, bookmarking, and share tracking are modeled for backend integration.</p>
      </div>
    </Panel>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-zinc-400">{label}</p><p className="mt-3 text-3xl font-black text-cyan-300">{value}</p></div>;
}

function Panel({ title, action, children }) {
  return <section className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{title}</h2>{action}</div><div className="space-y-4">{children}</div></section>;
}
