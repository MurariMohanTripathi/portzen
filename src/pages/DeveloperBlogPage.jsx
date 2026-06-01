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

export default function DeveloperBlogPage() {
  const { username } = useParams();
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
  const posts = sortPosts(resolved?.stories);
  const blog = resolved?.developerBlog || defaultPortfolio.developerBlog;
  const name = resolved?.displayName || resolved?.username || "Developer";
  const unavailable = !resolved || resolved.banned || !blog.enabled;

  if (loading) return <LoadingScreen />;

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
      <PageSeo
        title={`${blog.title || "Developer Blog"} by ${name} | PortZen`}
        description={blog.description || `${name}'s developer blog, career journey, lessons learned, and current work.`}
        type="website"
        path={`/${username}/developer-blog`}
        noIndex={unavailable}
      />
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Link className="text-sm font-semibold" style={{ color: theme.accentColor }} to={`/${username}`}>Back to portfolio</Link>
        {unavailable ? (
          <section className="mt-16 rounded-lg border p-6" style={{ borderColor: theme.borderColor, backgroundColor: withAlpha(theme.surfaceColor, 0.86) }}>
            <h1 className="text-3xl font-black">Developer blog is unavailable</h1>
            <p className="mt-3 leading-7" style={{ color: theme.mutedTextColor }}>This portfolio has not enabled public blog posts yet.</p>
          </section>
        ) : (
          <>
            <header className="py-12">
              <p className="text-sm font-semibold uppercase" style={{ color: theme.accentColor }}>Developer Blog</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{blog.title || "Developer Blog"}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: theme.mutedTextColor }}>{blog.description}</p>
              {!blog.usePortfolioTheme ? <p className="mt-4 text-sm" style={{ color: theme.mutedTextColor }}>Independent blog theme</p> : null}
            </header>
            <section className="grid gap-4">
              {posts.length ? posts.map((post) => (
                <article className="rounded-lg border p-5 shadow-sm" style={{ borderColor: theme.borderColor, backgroundColor: withAlpha(theme.surfaceColor, 0.9), color: readableText(theme.surfaceColor) }} key={post.id}>
                  <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: theme.mutedSurfaceTextColor }}>
                    <time>{formatDate(post.createdAt)}</time>
                    {post.topic ? <span className="rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: withAlpha(theme.accentColor, 0.16), color: theme.accentColor }}>{post.topic}</span> : null}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold">
                    <Link style={{ color: readableText(theme.surfaceColor) }} to={`/${username}/developer-blog/${postSlug(post)}`}>{post.title || "Career update"}</Link>
                  </h2>
                  <p className="mt-3 leading-7" style={{ color: theme.mutedSurfaceTextColor }}>{blogDescription(resolved, post)}</p>
                </article>
              )) : (
                <div className="rounded-lg border p-5" style={{ borderColor: theme.borderColor, backgroundColor: withAlpha(theme.surfaceColor, 0.86) }}>
                  <p style={{ color: theme.mutedSurfaceTextColor }}>No posts have been published yet.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
      {resolved ? <SiteFooter variant="detailed" portfolio={themedPortfolio} /> : null}
    </main>
  );
}

function sortPosts(posts = []) {
  return Array.isArray(posts) ? posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
}

function postSlug(post) {
  return post.slug || post.id;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
}
