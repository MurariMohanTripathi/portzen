import { sectionTypes } from "../data/portfolioSchema";

export function makeId(prefix = "section") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sectionProps(section) {
  return section?.props || section?.data || {};
}

export function normalizeSection(section) {
  const type = section?.type || "About";
  return {
    id: section?.id || makeId(type.toLowerCase().replace(/\s+/g, "-")),
    type,
    visible: section?.visible !== false,
    title: section?.title || type,
    props: sectionProps(section),
  };
}

export function normalizeSections(sections = []) {
  return sections.map(normalizeSection).filter((section) => sectionTypes.includes(section.type) || section.type === "Custom");
}

export function createSection(type) {
  const base = {
    id: makeId(type.toLowerCase().replace(/\s+/g, "-")),
    type,
    visible: true,
    title: type,
    props: {},
  };

  if (["Skills", "Social Links"].includes(type)) return { ...base, props: { items: [] } };
  if (["Projects", "Experience", "Certifications", "Achievements", "Education"].includes(type)) return { ...base, props: { items: [] } };
  if (type === "About") return { ...base, props: { text: "" } };
  if (type === "Contact") return { ...base, props: { text: "" } };
  if (type === "GitHub Stats") return { ...base, props: { username: "" } };
  if (type === "CustomHTML") return { ...base, props: { html: "<p>Add safe custom HTML here.</p>" } };
  return base;
}

export function duplicateSection(section) {
  return {
    ...normalizeSection(section),
    id: makeId(section.type.toLowerCase().replace(/\s+/g, "-")),
    title: `${section.title || section.type} Copy`,
  };
}
