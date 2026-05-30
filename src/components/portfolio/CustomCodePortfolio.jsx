import DOMPurify from "dompurify";

function buildCustomCodeDocument(customCode = {}) {
  const cleanHtml = DOMPurify.sanitize(customCode.html || "", {
    WHOLE_DOCUMENT: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onmouseenter"],
  });
  const cleanCss = String(customCode.css || "").replace(/<\/style/gi, "<\\/style");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      html, body { min-height: 100%; }
      ${cleanCss}
    </style>
  </head>
  <body>${cleanHtml}</body>
</html>`;
}

export default function CustomCodePortfolio({ customCode, preview = false }) {
  return (
    <iframe
      title="Custom coded portfolio"
      className={preview ? "h-full w-full bg-white" : "min-h-screen w-full border-0 bg-white"}
      sandbox=""
      srcDoc={buildCustomCodeDocument(customCode)}
    />
  );
}
