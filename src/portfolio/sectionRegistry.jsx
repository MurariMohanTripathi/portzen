/* eslint-disable react-refresh/only-export-components */
import Field, { inputClass } from "../components/ui/Field";
import CustomFieldList from "../components/portfolio/CustomFieldList";

const emptyItem = {
  Projects: { id: "", title: "", description: "", techStack: [], githubUrl: "", liveUrl: "", coverImage: "", screenshots: [], featured: false },
  Experience: { role: "", company: "", period: "", summary: "" },
  Education: { title: "", school: "", period: "", summary: "" },
  Certifications: { title: "", issuer: "", date: "", description: "" },
  Achievements: { title: "", date: "", description: "" },
};

export const sectionRegistry = {
  Hero: {
    label: "Hero",
    defaultProps: { cta: "View Projects", location: "" },
    editor: HeroEditor,
  },
  About: {
    label: "About",
    defaultProps: { text: "" },
    editor: TextEditor,
  },
  Projects: {
    label: "Projects",
    defaultProps: { items: [] },
    editor: CollectionSectionEditor,
  },
  Skills: {
    label: "Skills",
    defaultProps: { items: [] },
    editor: ListEditor,
  },
  Experience: {
    label: "Experience",
    defaultProps: { items: [] },
    editor: CollectionSectionEditor,
  },
  Certifications: {
    label: "Certifications",
    defaultProps: { items: [] },
    editor: CollectionSectionEditor,
  },
  Achievements: {
    label: "Achievements",
    defaultProps: { items: [] },
    editor: CollectionSectionEditor,
  },
  Education: {
    label: "Education",
    defaultProps: { items: [] },
    editor: CollectionSectionEditor,
  },
  Contact: {
    label: "Contact",
    defaultProps: { text: "" },
    editor: TextEditor,
  },
  "Social Links": {
    label: "Social Links",
    defaultProps: {},
    editor: HelpEditor,
  },
  "GitHub Stats": {
    label: "GitHub Stats",
    defaultProps: { username: "" },
    editor: GitHubEditor,
  },
  "User Stories": {
    label: "User Stories",
    defaultProps: {},
    editor: HelpEditor,
  },
  "Custom Fields": {
    label: "Custom Fields",
    defaultProps: { items: [] },
    editor: CustomFieldsEditor,
  },
  Resume: {
    label: "Resume",
    defaultProps: { url: "", label: "Download Resume PDF" },
    editor: ResumeEditor,
  },
  CustomHTML: {
    label: "Custom HTML",
    defaultProps: { html: "<p>Add safe custom HTML here.</p>" },
    editor: CustomHtmlEditor,
  },
};

export const sectionTypeIds = Object.keys(sectionRegistry);

export function getSectionConfig(type) {
  return sectionRegistry[type] || null;
}

export function getDefaultSectionProps(type) {
  return { ...(getSectionConfig(type)?.defaultProps || {}) };
}

export function SectionEditor({ section, onChange }) {
  const Editor = getSectionConfig(section.type)?.editor || FallbackEditor;
  return <Editor section={section} props={section.props || {}} onChange={onChange} />;
}

function HeroEditor({ props, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="CTA text">
        <input className={inputClass} value={props.cta || ""} onChange={(event) => onChange({ ...props, cta: event.target.value })} />
      </Field>
      <Field label="Location">
        <input className={inputClass} value={props.location || ""} onChange={(event) => onChange({ ...props, location: event.target.value })} />
      </Field>
    </div>
  );
}

function TextEditor({ props, onChange }) {
  return (
    <Field label="Text">
      <textarea className={inputClass} rows={3} value={props.text || ""} onChange={(event) => onChange({ ...props, text: event.target.value })} />
    </Field>
  );
}

function ListEditor({ props, onChange }) {
  return (
    <Field label="Items">
      <input className={inputClass} value={(props.items || []).join(", ")} onChange={(event) => onChange({ ...props, items: splitList(event.target.value) })} placeholder="React, Firebase, Tailwind" />
    </Field>
  );
}

function GitHubEditor({ props, onChange }) {
  return (
    <Field label="GitHub username">
      <input className={inputClass} value={props.username || ""} onChange={(event) => onChange({ ...props, username: event.target.value.trim() })} />
    </Field>
  );
}

function ResumeEditor({ props, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Button label">
        <input className={inputClass} value={props.label || ""} onChange={(event) => onChange({ ...props, label: event.target.value })} />
      </Field>
      <Field label="Resume URL">
        <input className={inputClass} value={props.url || ""} onChange={(event) => onChange({ ...props, url: event.target.value })} placeholder="https://..." />
      </Field>
    </div>
  );
}

function CustomHtmlEditor({ props, onChange }) {
  return (
    <Field label="Safe HTML">
      <textarea className={`${inputClass} font-mono`} rows={5} value={props.html || ""} onChange={(event) => onChange({ ...props, html: event.target.value })} />
    </Field>
  );
}

function CustomFieldsEditor({ props, onChange }) {
  return (
    <CustomFieldList
      title="Fields"
      addLabel="Add field"
      items={props.items || []}
      onChange={(items) => onChange({ ...props, items })}
      fields={[
        { key: "label", label: "Label", placeholder: "Availability" },
        { key: "value", label: "Value", placeholder: "Open to internships" },
      ]}
    />
  );
}

function CollectionSectionEditor({ section, props, onChange }) {
  const items = props.items || [];
  const fields = getCollectionFields(section.type);

  function update(index, field, value) {
    const normalized = field === "techStack" ? splitList(value) : field === "featured" ? Boolean(value) : value;
    onChange({ ...props, items: items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: normalized } : item) });
  }

  function add() {
    const next = { ...(emptyItem[section.type] || { title: "", description: "" }), id: `${section.type.toLowerCase()}-${Date.now()}` };
    onChange({ ...props, items: [...items, next] });
  }

  return (
    <div className="space-y-3">
      <button type="button" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-cyan-300/60" onClick={add}>
        Add item
      </button>
      {items.map((item, index) => (
        <div key={item.id || index} className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="grid gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <Field key={field} label={field}>
                {field === "featured" ? (
                  <input className="h-5 w-5 accent-cyan-300" type="checkbox" checked={Boolean(item[field])} onChange={(event) => update(index, field, event.target.checked)} />
                ) : (
                  <input className={inputClass} value={Array.isArray(item[field]) ? item[field].join(", ") : item[field] || ""} onChange={(event) => update(index, field, event.target.value)} />
                )}
              </Field>
            ))}
          </div>
          <button type="button" className="mt-3 text-sm font-semibold text-red-200 hover:text-red-100" onClick={() => onChange({ ...props, items: items.filter((_, itemIndex) => itemIndex !== index) })}>
            Delete item
          </button>
        </div>
      ))}
    </div>
  );
}

function HelpEditor({ section }) {
  return <p className="text-sm leading-6 text-zinc-400">{section.type} uses your portfolio-level data and does not need section-specific fields.</p>;
}

function FallbackEditor({ props, onChange }) {
  return (
    <Field label="JSON props">
      <textarea className={`${inputClass} font-mono`} rows={4} value={JSON.stringify(props, null, 2)} onChange={(event) => {
        try {
          onChange(JSON.parse(event.target.value));
        } catch {
          onChange(props);
        }
      }} />
    </Field>
  );
}

function getCollectionFields(type) {
  if (type === "Projects") return ["title", "description", "techStack", "githubUrl", "liveUrl", "coverImage", "featured"];
  if (type === "Experience") return ["role", "company", "period", "summary"];
  if (type === "Education") return ["title", "school", "period", "summary"];
  if (type === "Certifications") return ["title", "issuer", "date", "description"];
  if (type === "Achievements") return ["title", "date", "description"];
  return ["title", "description"];
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
