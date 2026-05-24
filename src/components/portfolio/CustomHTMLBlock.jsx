import DOMPurify from "dompurify";

export default function CustomHTMLBlock({ html = "" }) {
  const clean = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["script", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });

  return (
    <div
      className="prose prose-invert max-w-none prose-a:text-cyan-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/50"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
