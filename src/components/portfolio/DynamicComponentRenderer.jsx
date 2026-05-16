function markdownToHtml(text = "") {
  return text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export default function DynamicComponentRenderer({ component }) {
  const props = component?.props || {};

  switch (component?.componentType) {
    case "textBlock":
      return <p className="leading-7 text-current/75">{props.text}</p>;
    case "image":
      return <img className="h-56 w-full rounded-xl object-cover" src={props.src} alt={props.alt || ""} />;
    case "button":
      return <a className="inline-flex rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-zinc-950" href={props.href}>{props.label}</a>;
    case "markdown":
      return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(props.markdown) }} />;
    case "code":
      return <pre className="overflow-auto rounded-xl border border-white/10 bg-black/60 p-4 text-sm text-cyan-100"><code>{props.code}</code></pre>;
    case "stats":
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-3xl font-black">{props.value}</div>
          <div className="mt-1 text-sm text-current/60">{props.label}</div>
        </div>
      );
    case "customCard":
    default:
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h4 className="text-lg font-bold">{props.title || "Custom Card"}</h4>
          <p className="mt-2 text-sm leading-6 text-current/70">{props.description || "Add custom fields from the builder."}</p>
        </div>
      );
  }
}
