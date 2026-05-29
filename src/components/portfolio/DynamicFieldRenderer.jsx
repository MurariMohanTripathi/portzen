import { SectionEditor } from "../../portfolio/sectionRegistry.jsx";

export default function DynamicFieldRenderer({ section, onChange }) {
  return <SectionEditor section={section} onChange={onChange} />;
}
