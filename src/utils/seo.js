export function applyPortfolioSeo(portfolio) {
  const name = portfolio?.displayName || portfolio?.username || "Developer Portfolio";
  const description = portfolio?.headline || portfolio?.bio || "Developer portfolio built with PortZen.";
  document.title = `${name} | PortZen`;
  upsertMeta("description", description);
  upsertMeta("og:title", `${name} | PortZen`, "property");
  upsertMeta("og:description", description, "property");
  upsertMeta("og:type", "profile", "property");
}

function upsertMeta(name, content, attr = "name") {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content || "");
}
