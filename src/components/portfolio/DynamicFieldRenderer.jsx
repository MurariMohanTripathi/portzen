import Field, { inputClass } from "../ui/Field";

export default function DynamicFieldRenderer({ section, onChange }) {
  const props = section.props || {};

  if (section.type === "About" || section.type === "Contact") {
    return <Field label="Text"><textarea className={inputClass} rows={3} value={props.text || ""} onChange={(event) => onChange({ ...props, text: event.target.value })} /></Field>;
  }

  if (section.type === "Skills") {
    return <Field label="Skills"><input className={inputClass} value={(props.items || []).join(", ")} onChange={(event) => onChange({ ...props, items: splitList(event.target.value) })} placeholder="React, Firebase, Tailwind" /></Field>;
  }

  if (section.type === "GitHub Stats") {
    return <Field label="GitHub username"><input className={inputClass} value={props.username || ""} onChange={(event) => onChange({ ...props, username: event.target.value.trim() })} /></Field>;
  }

  if (section.type === "CustomHTML") {
    return <Field label="Safe HTML"><textarea className={`${inputClass} font-mono`} rows={5} value={props.html || ""} onChange={(event) => onChange({ ...props, html: event.target.value })} /></Field>;
  }

  return null;
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
