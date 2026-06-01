const siteName = "PortZen";
const defaultDescription = "Create a professional developer portfolio with custom sections, live previews, project CMS, developer blog, analytics, themes, and SEO-ready public pages.";
const defaultKeywords = "developer portfolio builder, portfolio website builder, programmer portfolio, software engineer portfolio, online portfolio, developer blog, PortZen";
const defaultImage = "/og-image.png";

export const pageSeo = {
  home: {
    title: "PortZen | Developer Portfolio Builder for Software Engineers",
    description: defaultDescription,
    keywords: defaultKeywords,
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

export function applyPageSeo({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  type = "website",
  path = window.location.pathname,
  image = defaultImage,
  noIndex = false,
  jsonLd,
}) {
  const canonical = `${window.location.origin}${path}`;
  const imageUrl = image?.startsWith("http") ? image : `${window.location.origin}${image || defaultImage}`;
  document.title = title;
  upsertMeta("description", description);
  upsertMeta("keywords", keywords);
  upsertMeta("author", siteName);
  upsertMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
  upsertMeta("og:title", title, "property");
  upsertMeta("og:description", description, "property");
  upsertMeta("og:type", type, "property");
  upsertMeta("og:site_name", siteName, "property");
  upsertMeta("og:url", canonical, "property");
  upsertMeta("og:image", imageUrl, "property");
  upsertMeta("og:image:alt", title, "property");
  upsertMeta("twitter:card", "summary_large_image");
  upsertMeta("twitter:title", title);
  upsertMeta("twitter:description", description);
  upsertMeta("twitter:image", imageUrl);
  upsertLink("canonical", canonical);
  upsertJsonLd(jsonLd || websiteJsonLd({ title, description, canonical }));
}

export function applyPortfolioSeo(portfolio) {
  const name = portfolio?.displayName || portfolio?.username || "Developer Portfolio";
  const description = portfolio?.headline || portfolio?.bio || "Developer portfolio built with PortZen.";
  applyPageSeo({
    title: `${name} | PortZen`,
    description,
    keywords: `${name}, developer portfolio, software engineer portfolio, projects, resume, developer blog, PortZen`,
    type: "profile",
    path: `/${portfolio?.username || ""}`,
    image: portfolio?.profileImage || defaultImage,
    noIndex: portfolio?.banned,
    jsonLd: profileJsonLd(portfolio, name, description),
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
    keywords: `${name} developer blog, software engineer blog, career journey, developer portfolio, programming lessons`,
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
    keywords: `${story?.title || "developer blog post"}, ${name}, developer blog, software engineer portfolio, programming journey`,
    type: "article",
    path: `/${portfolio?.username || ""}/developer-blog/${story?.slug || story?.id || ""}`,
    noIndex: portfolio?.banned || !portfolio?.developerBlog?.enabled || !story,
    jsonLd: articleJsonLd(portfolio, story),
  });
}

function websiteJsonLd({ title, description, canonical }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: window.location.origin,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${window.location.origin}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "WebPage",
      name: title,
      url: canonical,
    },
  };
}

function profileJsonLd(portfolio, name, description) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${window.location.origin}/${portfolio?.username || ""}`,
    description,
    image: portfolio?.profileImage || undefined,
    sameAs: publicUrls(portfolio),
  };
}

function articleJsonLd(portfolio, story) {
  if (!story) return undefined;
  const name = portfolio?.displayName || portfolio?.username || "Developer";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: story.title || "Developer Blog Post",
    description: blogDescription(portfolio, story),
    datePublished: story.createdAt,
    dateModified: story.updatedAt || story.createdAt,
    author: {
      "@type": "Person",
      name,
      url: `${window.location.origin}/${portfolio?.username || ""}`,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: window.location.origin,
    },
    mainEntityOfPage: `${window.location.origin}/${portfolio?.username || ""}/developer-blog/${story.slug || story.id || ""}`,
  };
}

function publicUrls(portfolio = {}) {
  const customLinks = Array.isArray(portfolio.links) ? portfolio.links.map((link) => link.value).filter((value) => /^https?:\/\//i.test(value)) : [];
  const socialLinks = Object.values(portfolio.socials || {}).filter((value) => /^https?:\/\//i.test(value));
  return [...new Set([...customLinks, ...socialLinks])];
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

function upsertJsonLd(data) {
  const id = "portzen-jsonld";
  let tag = document.head.querySelector(`script[data-seo="${id}"]`);
  if (!data) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.setAttribute("data-seo", id);
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}
