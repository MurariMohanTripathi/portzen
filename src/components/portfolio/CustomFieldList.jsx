import Button from "../ui/Button";
import Field, { inputClass } from "../ui/Field";

export default function CustomFieldList({
  title,
  items = [],
  onChange,
  addLabel = "Add item",
  fields = [
    { key: "label", label: "Label", placeholder: "GitHub" },
    { key: "value", label: "Value", placeholder: "https://github.com/username" },
  ],
}) {
  function addItem() {
    onChange([...items, makeEmptyItem(fields)]);
  }

  function updateItem(index, key, value) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  function removeItem(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/55 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-bold">{title}</h3>
        <Button className="w-full sm:w-auto" variant="secondary" onClick={addItem}>{addLabel}</Button>
      </div>
      <div className="mt-4 space-y-3">
        {items.length ? items.map((item, index) => (
          <div key={item.id || index} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <Field key={field.key} label={field.label}>
                  <input
                    className={inputClass}
                    value={item[field.key] || ""}
                    placeholder={field.placeholder}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                  />
                </Field>
              ))}
            </div>
            <button type="button" className="mt-3 text-sm font-semibold text-red-200 hover:text-red-100" onClick={() => removeItem(index)}>
              Delete
            </button>
          </div>
        )) : <p className="text-sm text-zinc-500">Nothing added yet.</p>}
      </div>
    </div>
  );
}

function makeEmptyItem(fields) {
  return fields.reduce((item, field) => ({ ...item, [field.key]: "" }), { id: `field-${Date.now()}` });
}
