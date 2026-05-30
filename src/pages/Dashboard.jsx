import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { defaultPortfolio, sectionTypes, templates, themePresets } from "../data/portfolioSchema";
import { useAuth } from "../contexts/AuthContext";
import { getPortfolioByUid, savePortfolio } from "../services/portfolioService";
import { fetchGitHubProfile } from "../services/githubService";
import { uploadProjectImage } from "../services/storageService";
import useUsernameAvailability from "../hooks/useUsernameAvailability";
import { normalizeUsername, validateUsername, wordsCount } from "../utils/username";
import { createSection, duplicateSection, normalizeSections } from "../utils/sections";
import TemplateRenderer from "../templates/TemplateRenderer";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import LoadingScreen from "../components/ui/LoadingScreen";
import DragDropContainer from "../components/portfolio/DragDropContainer";
import EditableSection from "../components/portfolio/EditableSection";
import DynamicFieldRenderer from "../components/portfolio/DynamicFieldRenderer";
import CustomCodePortfolio from "../components/portfolio/CustomCodePortfolio";
import CustomFieldList from "../components/portfolio/CustomFieldList";
import PageSeo from "../components/seo/PageSeo";

export default function Dashboard({ view }) {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ ...defaultPortfolio });
  const [savedUsername, setSavedUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const lastSavedSnapshot = useRef("");
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
          display: { ...defaultPortfolio.display, ...data.display },
          links: normalizeCustomList(data.links || defaultPortfolio.links),
          facts: normalizeCustomList(data.facts || defaultPortfolio.facts),
          customCode: { ...defaultPortfolio.customCode, ...data.customCode },
          sections: normalizeSections(data.sections || defaultPortfolio.sections),
        };
        setPortfolio(next);
        setSavedUsername(next.username || "");
        lastSavedSnapshot.current = snapshotPortfolio(next);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const completion = useMemo(() => {
    const fields = [portfolio.username, portfolio.displayName, portfolio.headline, portfolio.bio, portfolio.sections?.length, portfolio.socials?.github];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [portfolio]);

  useEffect(() => {
    if (loading) return;
    setDirty(snapshotPortfolio(portfolio) !== lastSavedSnapshot.current);
  }, [loading, portfolio]);

  const save = useCallback(async ({ silent = false } = {}) => {
    try {
      const validation = validateUsername(portfolio.username);
      if (!validation.ok) {
        if (!silent) toast.error(validation.reason);
        return;
      }
      if (!portfolio.customCode?.enabled && !portfolio.displayName.trim()) {
        if (!silent) toast.error("Full name is required.");
        return;
      }
      if (!portfolio.customCode?.enabled && !portfolio.headline.trim()) {
        if (!silent) toast.error("Headline is required.");
        return;
      }
      if (availability.status === "taken") {
        if (!silent) toast.error("Username is already taken.");
        return;
      }
      if (availability.status === "checking") {
        if (!silent) toast.error("Wait for username check to finish.");
        return;
      }

      setSaveStatus(silent ? "autosaving" : "saving");
      const saved = await savePortfolio(user.uid, { ...portfolio, username: validation.username });
      const resolved = { ...portfolio, ...saved, username: validation.username };
      setPortfolio((prev) => ({ ...prev, ...saved, username: validation.username }));
      setSavedUsername(validation.username);
      lastSavedSnapshot.current = snapshotPortfolio(resolved);
      setDirty(false);
      setSaveStatus(silent ? "autosaved" : "saved");
      if (!silent) toast.success("Portfolio saved");
    } catch (error) {
      setSaveStatus("error");
      if (!silent) toast.error(error.message);
    }
  }, [availability.status, portfolio, user.uid]);

  useEffect(() => {
    if (loading || !dirty || saveStatus === "saving" || saveStatus === "autosaving") return undefined;
    const timeout = setTimeout(() => save({ silent: true }), 2200);
    return () => clearTimeout(timeout);
  }, [dirty, loading, save, saveStatus]);

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
      <PageSeo
        title={`${view[0].toUpperCase()}${view.slice(1)} | PortZen Dashboard`}
        description="Edit your portfolio content, visual theme, dynamic sections, projects, stories, templates, and publishing settings."
        noIndex
      />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black capitalize">{view}</h1>
          <p className="mt-1 text-zinc-400">Custom URL: portzen.in/{portfolio.username || "username"}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" disabled={!savedUsername || portfolio.username !== savedUsername} onClick={openPublicView}>Public View</Button>
          <SaveIndicator dirty={dirty} saveStatus={saveStatus} />
          <Button onClick={() => save()}>Save Changes</Button>
        </div>
      </div>

      {view === "overview" && <Overview portfolio={portfolio} completion={completion} savedUsername={savedUsername} dirty={dirty} />}
      {view === "edit" && <Builder portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />}
      {view === "projects" && <Projects portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "experience" && <Experience portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "templates" && <Templates portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "code" && <CodeYourOwnFolio portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "stories" && <Stories portfolio={portfolio} setPortfolio={setPortfolio} />}
      {view === "settings" && <Settings portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />}
    </div>
  );
}

function snapshotPortfolio(portfolio) {
  return JSON.stringify({
    ...portfolio,
    updatedAt: undefined,
    createdAt: undefined,
  });
}

function normalizeCustomList(items = []) {
  return items.filter(Boolean).map((item, index) => ({
    id: item.id || `item-${index}`,
    label: item.label || "",
    value: item.value || "",
  }));
}

function SaveIndicator({ dirty, saveStatus }) {
  const labels = {
    idle: dirty ? "Unsaved changes" : "Saved",
    saving: "Saving...",
    autosaving: "Autosaving...",
    autosaved: "Autosaved",
    saved: "Saved",
    error: "Save failed",
  };
  return <span className="hidden rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-300 shadow-sm shadow-black/10 md:inline-flex">{labels[saveStatus] || labels.idle}</span>;
}

function Overview({ portfolio, completion, savedUsername, dirty }) {
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
        <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5 shadow-xl shadow-black/10 md:col-span-4">
          <h2 className="text-xl font-bold">Launch checklist</h2>
          <div className="mt-4 h-3 rounded-full bg-zinc-900"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${completion}%` }} /></div>
          <p className="mt-3 text-sm text-zinc-400">{completion}% complete. Add projects, stories, social links, and a resume before sharing.</p>
        </div>
        <PublishPanel portfolio={portfolio} savedUsername={savedUsername} dirty={dirty} />
      </div>
      <div className="h-[720px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/20">
        <div className="origin-top scale-[0.55] md:scale-[0.58]"><TemplateRenderer portfolio={portfolio} /></div>
      </div>
    </div>
  );
}

function PublishPanel({ portfolio, savedUsername, dirty }) {
  const url = savedUsername ? `https://portzen.in/${savedUsername}` : "";
  const checks = [
    ["Username", Boolean(savedUsername)],
    ["Name and headline", Boolean(portfolio.displayName && portfolio.headline)],
    ["Projects", Boolean(portfolio.sections?.find((section) => section.type === "Projects")?.props?.items?.length)],
    ["Social link", Boolean(Object.values(portfolio.socials || {}).some(Boolean))],
    ["Saved changes", !dirty],
  ];

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5 shadow-xl shadow-black/10 md:col-span-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold">Publish center</h2>
          <p className="mt-1 text-sm text-zinc-400">{url || "Choose and save a username to unlock your public link."}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={!url} onClick={() => navigator.clipboard?.writeText(url)}>Copy Link</Button>
          <Button disabled={!url || dirty} onClick={() => window.open(`/${savedUsername}`, "_blank")}>Open</Button>
        </div>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-5">
        {checks.map(([label, done]) => (
          <span key={label} className={`rounded-lg border px-3 py-2 text-xs ${done ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-zinc-950/60 text-zinc-400"}`}>
            {done ? "Done" : "Todo"}: {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Builder({ portfolio, setPortfolio, availability }) {
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const previewWidths = { mobile: "max-w-[390px]", tablet: "max-w-[760px]", desktop: "max-w-none" };

  return (
    <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
      <div className="space-y-5">
        <ProfileEditor portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />
        <ThemeDesigner portfolio={portfolio} setPortfolio={setPortfolio} />
        <SectionManager portfolio={portfolio} setPortfolio={setPortfolio} />
      </div>
      <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/20">
        <PreviewToolbar value={previewDevice} onChange={setPreviewDevice} />
        <div className="h-[calc(100%-57px)] overflow-auto p-3">
          <div className={`mx-auto min-h-full bg-zinc-950 transition-all ${previewWidths[previewDevice]}`}>
            <TemplateRenderer portfolio={portfolio} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewToolbar({ value, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950/80 px-3 py-2">
      <span className="text-sm font-semibold text-zinc-300">Live preview</span>
      <div className="flex rounded-lg border border-white/10 bg-black/20 p-1">
        {["desktop", "tablet", "mobile"].map((device) => (
          <button key={device} type="button" className={`rounded-md px-3 py-1.5 text-xs capitalize transition ${value === device ? "bg-cyan-300 text-zinc-950" : "text-zinc-300 hover:bg-white/5"}`} onClick={() => onChange(device)}>
            {device}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileEditor({ portfolio, setPortfolio, availability }) {
  const update = (key, value) => setPortfolio((prev) => ({ ...prev, [key]: value }));
  const updateDisplay = (key, value) => setPortfolio((prev) => ({ ...prev, display: { ...defaultPortfolio.display, ...prev.display, [key]: value } }));
  const display = { ...defaultPortfolio.display, ...portfolio.display };
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
        <Field label="Profile image URL"><input className={inputClass} value={portfolio.profileImage || ""} onChange={(e) => update("profileImage", e.target.value)} /></Field>
        <Field label="Hero banner URL"><input className={inputClass} value={portfolio.heroBanner || ""} onChange={(e) => update("heroBanner", e.target.value)} /></Field>
        <Field label="GitHub username"><input className={inputClass} value={portfolio.githubUsername || ""} onChange={(e) => update("githubUsername", e.target.value.trim())} /></Field>
      </div>
      <CustomFieldList
        title="Public links"
        addLabel="Add link"
        items={normalizeCustomList(portfolio.links || [])}
        onChange={(links) => update("links", links)}
        fields={[
          { key: "label", label: "Name", placeholder: "GitHub, LinkedIn, Resume" },
          { key: "value", label: "URL or email", placeholder: "https://..." },
        ]}
      />
      <CustomFieldList
        title="Quick facts"
        addLabel="Add fact"
        items={normalizeCustomList(portfolio.facts || [])}
        onChange={(facts) => update("facts", facts)}
        fields={[
          { key: "label", label: "Label", placeholder: "Location" },
          { key: "value", label: "Value", placeholder: "India" },
        ]}
      />
      <div className="rounded-lg border border-white/10 bg-zinc-950/60 p-4">
        <h3 className="font-bold">Visibility</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries({
            showName: "Name",
            showHeadline: "Headline",
            showBio: "Bio",
            showAvatar: "Avatar",
            showLocation: "Location",
            showHeroCta: "Hero button",
            showSocialsInHero: "Socials in hero",
            showUsername: "Username label",
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
              <span>{label}</span>
              <input className="h-5 w-5 accent-cyan-300" type="checkbox" checked={Boolean(display[key])} onChange={(event) => updateDisplay(key, event.target.checked)} />
            </label>
          ))}
        </div>
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
  const autoBalance = () => {
    const textColor = readableText(theme.backgroundColor);
    const surfaceColor = mixColor(theme.backgroundColor, textColor === "#ffffff" ? "#ffffff" : "#000000", textColor === "#ffffff" ? 14 : 7);
    updateTheme({ textColor, surfaceColor });
    toast.success("Theme contrast balanced");
  };

  return (
    <Panel title="Theme Designer" action={<Button variant="secondary" onClick={autoBalance}>Auto Balance</Button>}>
      <div className="grid gap-3 sm:grid-cols-2">
        {themePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => updateTheme(preset)}
            className={`rounded-lg border p-3 text-left transition ${theme.name === preset.name ? "border-cyan-300 bg-cyan-300/10 shadow-lg shadow-cyan-500/10" : "border-white/10 bg-zinc-950/60 hover:border-white/30"}`}
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

function readableText(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? "#111827" : "#ffffff";
}

function mixColor(hex, target, amount) {
  const base = hexToRgb(hex);
  const next = hexToRgb(target);
  const ratio = amount / 100;
  return rgbToHex({
    r: Math.round(base.r + (next.r - base.r) * ratio),
    g: Math.round(base.g + (next.g - base.g) * ratio),
    b: Math.round(base.b + (next.b - base.b) * ratio),
  });
}

function hexToRgb(hex = "#000000") {
  const clean = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function SectionManager({ portfolio, setPortfolio }) {
  function addSection(type) {
    setPortfolio((prev) => ({ ...prev, sections: [...normalizeSections(prev.sections), createSection(type)] }));
  }
  function remove(id) {
    setPortfolio((prev) => ({ ...prev, sections: prev.sections.filter((section) => section.id !== id) }));
  }
  function updateSection(id, updates) {
    setPortfolio((prev) => ({ ...prev, sections: normalizeSections(prev.sections).map((section) => section.id === id ? { ...section, ...updates } : section) }));
  }
  function reorder(sections) {
    setPortfolio((prev) => ({ ...prev, sections }));
  }
  const sections = normalizeSections(portfolio.sections);
  return (
    <Panel title="Dynamic Sections">
      <div className="flex flex-wrap gap-2">{sectionTypes.map((type) => <Button key={type} variant="secondary" onClick={() => addSection(type)}>Add {type}</Button>)}</div>
      <div className="mt-5 space-y-3">
        <DragDropContainer items={sections} onReorder={reorder}>
          {sections.map((section) => (
            <EditableSection
              key={section.id}
              section={section}
              onTitle={(title) => updateSection(section.id, { title })}
              onToggle={() => updateSection(section.id, { visible: section.visible === false })}
              onDuplicate={() => setPortfolio((prev) => ({ ...prev, sections: [...normalizeSections(prev.sections), duplicateSection(section)] }))}
              onRemove={() => remove(section.id)}
            >
              <DynamicFieldRenderer section={section} onChange={(props) => updateSection(section.id, { props })} />
            </EditableSection>
          ))}
        </DragDropContainer>
      </div>
    </Panel>
  );
}

function Projects({ portfolio, setPortfolio }) {
  const projectsSection = portfolio.sections.find((section) => section.type === "Projects");
  if (!projectsSection) {
    return <MissingSection type="Projects" setPortfolio={setPortfolio} />;
  }
  const projects = projectsSection?.props?.items || projectsSection?.data?.items || [];
  const updateProjects = (items) => setPortfolio((prev) => ({ ...prev, sections: prev.sections.map((section) => section.id === projectsSection.id ? { ...section, props: { ...(section.props || section.data), items } } : section) }));
  const add = () => updateProjects([...projects, { id: `p-${Date.now()}`, title: "New Project", description: "", techStack: [], githubUrl: "", liveUrl: "", coverImage: "", screenshots: [], featured: false }]);
  return <CollectionEditor title="Projects" items={projects} add={add} updateItems={updateProjects} fields={["title", "description", "techStack", "githubUrl", "liveUrl", "coverImage", "featured"]} uid={portfolio.uid} />;
}

function Experience({ portfolio, setPortfolio }) {
  const section = portfolio.sections.find((item) => item.type === "Experience");
  if (!section) {
    return <MissingSection type="Experience" setPortfolio={setPortfolio} />;
  }
  const items = section?.props?.items || section?.data?.items || [];
  const updateItems = (next) => setPortfolio((prev) => ({ ...prev, sections: prev.sections.map((item) => item.id === section.id ? { ...item, props: { ...(item.props || item.data), items: next } } : item) }));
  const add = () => updateItems([...items, { role: "Role", company: "Company", period: "2026", summary: "" }]);
  return <CollectionEditor title="Experience" items={items} add={add} updateItems={updateItems} fields={["role", "company", "period", "summary"]} />;
}

function MissingSection({ type, setPortfolio }) {
  return (
    <Panel title={`${type} section`}>
      <p className="text-sm text-zinc-400">This section was removed from the portfolio. Add it back to manage its content here.</p>
      <Button variant="secondary" onClick={() => setPortfolio((prev) => ({ ...prev, sections: [...normalizeSections(prev.sections), createSection(type)] }))}>
        Add {type}
      </Button>
    </Panel>
  );
}

function CollectionEditor({ title, items, add, updateItems, fields, uid }) {
  function update(index, field, value) {
    const normalized = field === "techStack" ? value.split(",").map((item) => item.trim()).filter(Boolean) : field === "featured" ? Boolean(value) : value;
    const next = items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: normalized } : item);
    updateItems(next);
  }
  async function upload(index, file) {
    const url = await uploadProjectImage(uid, file);
    update(index, "coverImage", url);
  }
  return (
    <Panel title={title} action={<Button onClick={add}>Add {title.slice(0, -1)}</Button>}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4" key={item.id || index}>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <Field key={field} label={field}>
                  {field === "featured" ? (
                    <input className="h-5 w-5 accent-cyan-300" type="checkbox" checked={Boolean(item[field])} onChange={(e) => update(index, field, e.target.checked)} />
                  ) : (
                    <input className={inputClass} value={Array.isArray(item[field]) ? item[field].join(", ") : item[field] || ""} onChange={(e) => update(index, field, e.target.value)} />
                  )}
                </Field>
              ))}
              {title === "Projects" ? <Field label="Upload cover"><input className={inputClass} type="file" accept="image/*" onChange={(e) => upload(index, e.target.files?.[0])} /></Field> : null}
            </div>
            <Button className="mt-3" variant="danger" onClick={() => updateItems(items.filter((_, itemIndex) => itemIndex !== index))}>Delete</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Templates({ portfolio, setPortfolio }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => setPortfolio((prev) => ({ ...prev, template: template.id, accentColor: template.accent, theme: { ...defaultPortfolio.theme, ...prev.theme, accentColor: template.accent } }))}
          className={`rounded-2xl border p-4 text-left transition ${portfolio.template === template.id ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}
        >
          <TemplateCardPreview template={template} portfolio={portfolio} />
          <h3 className="mt-4 text-xl font-bold">{template.name}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{template.description}</p>
        </button>
      ))}
    </div>
  );
}

function TemplateCardPreview({ template, portfolio }) {
  const bg = portfolio.theme?.backgroundColor || "#09090b";
  const surface = portfolio.theme?.surfaceColor || "#18181b";
  const text = portfolio.theme?.textColor || "#ffffff";
  const accent = template.accent;
  const isMinimal = template.id === "minimal";
  const isGlass = template.id === "glass";
  return (
    <div
      className="h-44 overflow-hidden rounded-xl border p-4"
      style={{
        borderColor: `${accent}55`,
        color: text,
        background: isGlass
          ? `linear-gradient(135deg, ${bg}, ${surface})`
          : isMinimal
            ? bg
            : `linear-gradient(135deg, ${bg}, ${surface} 70%, ${accent}33)`,
      }}
    >
      <div className="h-full rounded-lg border p-3" style={{ borderColor: `${accent}33`, backgroundColor: `${surface}bb` }}>
        <div className="h-2 w-20 rounded-full" style={{ backgroundColor: accent }} />
        <div className="mt-6 h-5 w-36 rounded-full bg-current opacity-90" />
        <div className="mt-3 h-3 w-48 rounded-full bg-current opacity-30" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="h-12 rounded-lg border" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}12` }} />
          <div className="h-12 rounded-lg border" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}12` }} />
        </div>
      </div>
    </div>
  );
}

function CodeYourOwnFolio({ portfolio, setPortfolio }) {
  const customCode = normalizeCustomCode(portfolio.customCode);
  const activeBlock = customCode.blocks.find((block) => block.id === customCode.activeBlockId) || customCode.blocks[0];
  const update = (updates) => {
    setPortfolio((prev) => ({
      ...prev,
      customCode: normalizeCustomCode({ ...prev.customCode, ...updates }),
    }));
  };
  const updateActiveBlock = (updates) => {
    const nextBlocks = customCode.blocks.map((block) => block.id === activeBlock.id ? { ...block, ...updates } : block);
    update({ ...updates, blocks: nextBlocks });
  };
  const addBlock = () => {
    const id = `code-${Date.now()}`;
    update({
      activeBlockId: id,
      html: "<main>\n  <h1>New custom block</h1>\n</main>",
      css: "body {\n  margin: 0;\n  font-family: Inter, system-ui, sans-serif;\n}",
      blocks: [...customCode.blocks, { id, name: "New Block", html: "<main>\n  <h1>New custom block</h1>\n</main>", css: "body {\n  margin: 0;\n  font-family: Inter, system-ui, sans-serif;\n}" }],
    });
  };
  const duplicateBlock = () => {
    const id = `code-${Date.now()}`;
    const copy = { ...activeBlock, id, name: `${activeBlock.name} Copy` };
    update({ activeBlockId: id, html: copy.html, css: copy.css, blocks: [...customCode.blocks, copy] });
  };
  const deleteBlock = () => {
    if (customCode.blocks.length === 1) return toast.error("Keep at least one code block.");
    const nextBlocks = customCode.blocks.filter((block) => block.id !== activeBlock.id);
    update({ activeBlockId: nextBlocks[0].id, html: nextBlocks[0].html, css: nextBlocks[0].css, blocks: nextBlocks });
  };
  const selectBlock = (id) => {
    const block = customCode.blocks.find((item) => item.id === id);
    if (!block) return;
    update({ activeBlockId: id, html: block.html, css: block.css });
  };
  const importCodeFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      if (file.name.toLowerCase().endsWith(".css")) updateActiveBlock({ css: text });
      else updateActiveBlock({ html: text });
      toast.success(`${file.name} imported`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,560px)_1fr]">
      <div className="space-y-5">
        <Panel
          title="Code Your Own Folio"
          action={
            <Button variant={customCode.enabled ? "primary" : "secondary"} onClick={() => update({ enabled: !customCode.enabled })}>
              {customCode.enabled ? "Code Mode On" : "Use Code Mode"}
            </Button>
          }
        >
          <p className="text-sm leading-6 text-zinc-400">
            Build a fully custom public portfolio with HTML and CSS. Normal builder sections stay saved, so switching back to normal mode will restore the generated portfolio.
          </p>
          <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
            Public code mode renders full screen with no PortZen header, navigation, theme wrapper, or generated sections.
          </div>
        </Panel>

        <Panel title="Code Blocks" action={<Button variant="secondary" onClick={addBlock}>New Block</Button>}>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Field label="Active block">
              <select className={inputClass} value={activeBlock.id} onChange={(event) => selectBlock(event.target.value)}>
                {customCode.blocks.map((block) => <option key={block.id} value={block.id}>{block.name}</option>)}
              </select>
            </Field>
            <div className="flex items-end gap-2">
              <Button variant="secondary" onClick={duplicateBlock}>Duplicate</Button>
              <Button variant="danger" onClick={deleteBlock}>Delete</Button>
            </div>
          </div>
          <Field label="Block name">
            <input className={inputClass} value={activeBlock.name || ""} onChange={(event) => updateActiveBlock({ name: event.target.value })} />
          </Field>
          <Field label="Import HTML or CSS file">
            <input className={inputClass} type="file" accept=".html,.htm,.css,text/html,text/css" onChange={(event) => importCodeFile(event.target.files?.[0])} />
          </Field>
        </Panel>

        <Panel title="HTML">
          <textarea
            className={`${inputClass} min-h-[360px] resize-y font-mono leading-6`}
            spellCheck="false"
            value={activeBlock.html}
            onChange={(event) => updateActiveBlock({ html: event.target.value })}
          />
        </Panel>

        <Panel title="CSS">
          <textarea
            className={`${inputClass} min-h-[360px] resize-y font-mono leading-6`}
            spellCheck="false"
            value={activeBlock.css}
            onChange={(event) => updateActiveBlock({ css: event.target.value })}
          />
        </Panel>
      </div>

      <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-white/10 bg-white">
        <CustomCodePortfolio customCode={{ ...customCode, html: activeBlock.html, css: activeBlock.css }} preview />
      </div>
    </div>
  );
}

function normalizeCustomCode(source = {}) {
  const fallback = defaultPortfolio.customCode;
  const blocks = Array.isArray(source.blocks) && source.blocks.length
    ? source.blocks
    : [{ id: "starter", name: "Starter Page", html: source.html || fallback.html, css: source.css || fallback.css }];
  const activeBlockId = source.activeBlockId || blocks[0].id;
  const activeBlock = blocks.find((block) => block.id === activeBlockId) || blocks[0];
  return {
    ...fallback,
    ...source,
    blocks,
    activeBlockId: activeBlock.id,
    html: activeBlock.html || "",
    css: activeBlock.css || "",
  };
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
  const upsertLink = (label, value) => setPortfolio((prev) => ({
    ...prev,
    links: upsertCustomLink(prev.links || [], label, value),
  }));
  async function syncGitHub() {
    try {
      const profile = await fetchGitHubProfile(portfolio.githubUsername || portfolio.socials?.github?.split("/").filter(Boolean).pop());
      setPortfolio((prev) => ({
        ...prev,
        github: profile,
        githubUsername: profile.username,
        profileImage: prev.profileImage || profile.avatarUrl,
        socials: { ...prev.socials, github: profile.profileUrl },
        links: upsertCustomLink(prev.links || [], "GitHub", profile.profileUrl),
      }));
      toast.success("GitHub data synced");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <Panel title="Settings">
      <ProfileEditor portfolio={portfolio} setPortfolio={setPortfolio} availability={availability} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-bold">Connected Profiles</h3>
        <p className="mt-2 text-sm text-zinc-400">Attach the profiles you want shown publicly. Empty fields stay hidden.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="GitHub username or URL">
            <input className={inputClass} value={portfolio.githubUsername || portfolio.socials?.github || ""} onChange={(event) => {
              const value = event.target.value.trim();
              setPortfolio((prev) => ({ ...prev, githubUsername: value.includes("/") ? value.split("/").filter(Boolean).pop() : value }));
              upsertLink("GitHub", value.startsWith("http") ? value : `https://github.com/${value}`);
            }} />
          </Field>
          <Field label="LinkedIn URL">
            <input className={inputClass} value={findCustomLink(portfolio.links, "LinkedIn") || portfolio.socials?.linkedin || ""} onChange={(event) => upsertLink("LinkedIn", event.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={syncGitHub}>Sync GitHub</Button>
          <Button variant="secondary" onClick={() => toast.success("LinkedIn attached. Add its URL and save changes.")}>Attach LinkedIn</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-bold">Premium placeholders</h3>
        <p className="mt-2 text-sm text-zinc-400">Resume PDF export, AI bio suggestions, favicon upload, portfolio cloning, bookmarking, and share tracking are modeled for backend integration.</p>
      </div>
    </Panel>
  );
}

function upsertCustomLink(items = [], label, value) {
  const normalized = normalizeCustomList(items);
  const index = normalized.findIndex((item) => item.label.toLowerCase() === label.toLowerCase());
  const next = { id: label.toLowerCase().replace(/\s+/g, "-"), label, value };
  if (index < 0) return [...normalized, next];
  return normalized.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item);
}

function findCustomLink(items = [], label) {
  return normalizeCustomList(items).find((item) => item.label.toLowerCase() === label.toLowerCase())?.value || "";
}

function Metric({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-zinc-400">{label}</p><p className="mt-3 text-3xl font-black text-cyan-300">{value}</p></div>;
}

function Panel({ title, action, children }) {
  return <section className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{title}</h2>{action}</div><div className="space-y-4">{children}</div></section>;
}
