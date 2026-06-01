const siteName = "PortZen";
const defaultDescription = "Create a polished developer portfolio with custom sections, live previews, analytics, and clean public pages.";

export const pageSeo = {
  home: {
    title: "PortZen | Developer Portfolio Builder",
    description: defaultDescription,
    type: "website",
  },
  login: {
    title: "Login | PortZen",
    description: "Log in to manage your PortZen developer portfolio, projects, stories, templates, and public profile.",
  },
  signup: {
    title: "Create Account | PortZen",
    description: "Claim a custom portfolio URL and start building a responsive developer portfolio with PortZen.",
  },
  forgotPassword: {
    title: "Reset Password | PortZen",
    description: "Reset your PortZen account password and get back to editing your developer portfolio.",
  },
  dashboard: {
    title: "Dashboard | PortZen",
    description: "Edit your portfolio content, design theme, projects, stories, templates, and publishing settings.",
  },
  admin: {
    title: "Admin | PortZen",
    description: "Manage PortZen users, templates, analytics, and platform settings.",
  },
  preview: {
    title: "Template Preview | PortZen",
    description: "Preview responsive PortZen portfolio templates before applying them to your public profile.",
  },
};

export function applyPageSeo({ title, description = defaultDescription, type = "website", path = window.location.pathname, noIndex = false }) {
  const canonical = `${window.location.origin}${path}`;
  document.title = title;
  upsertMeta("description", description);
  upsertMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
  upsertMeta("og:title", title, "property");
  upsertMeta("og:description", description, "property");
  upsertMeta("og:type", type, "property");
  upsertMeta("og:site_name", siteName, "property");
  upsertMeta("og:url", canonical, "property");
  upsertMeta("twitter:card", "summary_large_image");
  upsertMeta("twitter:title", title);
  upsertMeta("twitter:description", description);
  upsertLink("canonical", canonical);
}

export function applyPortfolioSeo(portfolio) {
  const name = portfolio?.displayName || portfolio?.username || "Developer Portfolio";
  const description = portfolio?.headline || portfolio?.bio || "Developer portfolio built with PortZen.";
  applyPageSeo({
    title: `${name} | PortZen`,
    description,
    type: "profile",
    path: `/${portfolio?.username || ""}`,
    noIndex: portfolio?.banned,
  });
}

export function blogDescription(portfolio, story) {
  if (story?.description) return story.description;
  if (story?.text) return story.text.replace(/\s+/g, " ").slice(0, 155);
  return portfolio?.developerBlog?.description || portfolio?.headline || "Developer blog built with PortZen.";
}

export function applyDeveloperBlogSeo(portfolio) {
  const name = portfolio?.displayName || portfolio?.username || "Developer";
  const blog = portfolio?.developerBlog || {};
  applyPageSeo({
    title: `${blog.title || "Developer Blog"} by ${name} | PortZen`,
    description: blog.description || `${name}'s developer blog, career journey, lessons learned, and current work.`,
    type: "website",
    path: `/${portfolio?.username || ""}/developer-blog`,
    noIndex: portfolio?.banned || !blog.enabled,
  });
}

export function applyDeveloperBlogPostSeo(portfolio, story) {
  const name = portfolio?.displayName || portfolio?.username || "Developer";
  applyPageSeo({
    title: `${story?.title || "Developer Blog Post"} by ${name} | PortZen`,
    description: blogDescription(portfolio, story),
    type: "article",
    path: `/${portfolio?.username || ""}/developer-blog/${story?.slug || story?.id || ""}`,
    noIndex: portfolio?.banned || !portfolio?.developerBlog?.enabled || !story,
  });
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

function upsertLink(rel, href) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}
