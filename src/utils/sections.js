import { getDefaultSectionProps, sectionTypeIds } from "../portfolio/sectionRegistry.jsx";

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
    props: { ...getDefaultSectionProps(type), ...sectionProps(section) },
  };
}

export function normalizeSections(sections = []) {
  return sections.map(normalizeSection).filter((section) => sectionTypeIds.includes(section.type) || section.type === "Custom");
}

export function createSection(type) {
  const base = {
    id: makeId(type.toLowerCase().replace(/\s+/g, "-")),
    type,
    visible: true,
    title: type,
    props: getDefaultSectionProps(type),
  };
  return base;
}

export function duplicateSection(section) {
  return {
    ...normalizeSection(section),
    id: makeId(section.type.toLowerCase().replace(/\s+/g, "-")),
    title: `${section.title || section.type} Copy`,
  };
}
