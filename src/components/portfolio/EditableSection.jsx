import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../ui/Button";
import { inputClass } from "../ui/Field";

export default function EditableSection({ section, onTitle, onToggle, onDuplicate, onRemove, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border p-4 transition ${isDragging ? "border-cyan-300 bg-cyan-300/10 opacity-80" : "border-white/10 bg-zinc-950/60"}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="cursor-grab rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 active:cursor-grabbing" {...attributes} {...listeners}>Drag</button>
        <input className={`${inputClass} min-w-0 flex-1`} value={section.title} onChange={(event) => onTitle(event.target.value)} />
        <span className="rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400">{section.type}</span>
        <Button variant="secondary" onClick={onToggle}>{section.visible === false ? "Show" : "Hide"}</Button>
        <Button variant="secondary" onClick={onDuplicate}>Duplicate</Button>
        <Button variant="danger" onClick={onRemove}>Delete</Button>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
