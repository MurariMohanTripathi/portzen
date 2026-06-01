import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { defaultPortfolio } from "../data/portfolioSchema";
import { getPortfolioByUsername } from "../services/portfolioService";
import LoadingScreen from "../components/ui/LoadingScreen";
import SiteFooter from "../components/layout/SiteFooter";
import PageSeo from "../components/seo/PageSeo";
import { blogDescription } from "../utils/seo";
import { normalizeDeveloperBlog, portfolioWithBlogTheme } from "../utils/blogTheme";
import { normalizeTheme, readableText, withAlpha } from "../utils/themeColors";

export default function DeveloperBlogPostPage() {
  const { username, postSlug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPortfolioByUsername(username)
      .then((data) => {
        if (active) setPortfolio(data);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [username]);

  const resolved = portfolio ? { ...defaultPortfolio, ...portfolio, developerBlog: normalizeDeveloperBlog(portfolio) } : null;
  const themedPortfolio = resolved ? portfolioWithBlogTheme(resolved) : defaultPortfolio;
  const theme = normalizeTheme(themedPortfolio);
  const blog = resolved?.developerBlog || defaultPortfolio.developerBlog;
  const post = findPost(resolved?.stories, postSlug);
  const name = resolved?.displayName || resolved?.username || "Developer";
  const unavailable = !resolved || resolved.banned || !blog.enabled || !post;

  if (loading) return <LoadingScreen />;

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
      <PageSeo
        title={`${post?.title || "Developer Blog Post"} by ${name} | PortZen`}
        description={blogDescription(resolved, post)}
        type="article"
        path={`/${username}/developer-blog/${postSlug}`}
        noIndex={unavailable}
      />
      <div className="mx-auto max-w-3xl px-5 py-12">
        <Link className="text-sm font-semibold" style={{ color: theme.accentColor }} to={`/${username}/developer-blog`}>Back to developer blog</Link>
        {unavailable ? (
          <section className="mt-16 rounded-lg border p-6" style={{ borderColor: theme.borderColor, backgroundColor: withAlpha(theme.surfaceColor, 0.86) }}>
            <h1 className="text-3xl font-black">Blog post unavailable</h1>
            <p className="mt-3 leading-7" style={{ color: theme.mutedSurfaceTextColor }}>This post does not exist or the developer blog is not public.</p>
          </section>
        ) : (
          <article className="mt-10">
            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: theme.mutedTextColor }}>
              <time>{formatDate(post.createdAt)}</time>
              {post.topic ? <span className="rounded-full px-3 py-1 font-semibold" style={{ backgroundColor: withAlpha(theme.accentColor, 0.16), color: theme.accentColor }}>{post.topic}</span> : null}
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">{post.title || "Career update"}</h1>
            {post.description ? <p className="mt-5 text-xl leading-8" style={{ color: theme.mutedTextColor }}>{post.description}</p> : null}
            <div
              className="mt-10 rounded-lg border p-6 text-lg leading-8 shadow-sm"
              style={{ borderColor: theme.borderColor, backgroundColor: withAlpha(theme.surfaceColor, 0.9), color: readableText(theme.surfaceColor) }}
            >
              <p className="whitespace-pre-wrap">{post.text}</p>
            </div>
          </article>
        )}
      </div>
      {resolved ? <SiteFooter variant="detailed" portfolio={themedPortfolio} /> : null}
    </main>
  );
}

function findPost(posts = [], slug = "") {
  if (!Array.isArray(posts)) return null;
  return posts.find((post) => post.slug === slug || post.id === slug) || null;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
}
