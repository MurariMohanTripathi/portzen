import DynamicComponentRenderer from "./DynamicComponentRenderer";
import CustomHTMLBlock from "./CustomHTMLBlock";
import SectionWrapper from "./SectionWrapper";
import { sectionProps } from "../../utils/sections";
import { normalizeTheme, readableText, withAlpha } from "../../utils/themeColors";

function list(value) {
  return Array.isArray(value) ? value : [];
}

export default function SectionRenderer({ section, portfolio, variant = "dark" }) {
  const theme = normalizeTheme(portfolio);
  const props = sectionProps(section);
  const display = {
    showName: true,
    showHeadline: true,
    showBio: true,
    showAvatar: true,
    showLocation: true,
    showHeroCta: true,
    showSocialsInHero: true,
    showUsername: false,
    ...portfolio.display,
  };
  const mutedStyle = { color: theme.mutedTextColor };
  const cardClass = "border shadow-sm";
  const cardStyle = {
    backgroundColor: withAlpha(theme.surfaceColor, variant === "light" ? 0.94 : 0.86),
    borderColor: theme.borderColor,
    borderRadius: theme.cornerRadius,
    color: theme.surfaceTextColor,
  };
  const cardMutedStyle = { color: theme.mutedSurfaceTextColor };
  const accentText = readableText(theme.accentColor);

  switch (section.type) {
    case "Hero":
      return (
        <section className="py-16">
          <div className="max-w-4xl">
            {display.showAvatar && portfolio.profileImage ? <img className="mb-8 h-24 w-24 rounded-full border-4 object-cover shadow-2xl" style={{ borderColor: portfolio.accentColor }} src={portfolio.profileImage} alt={portfolio.displayName || "Profile"} /> : null}
            {display.showUsername && portfolio.username ? <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: theme.accentColor }}>/{portfolio.username}</p> : null}
            {display.showName ? <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">{portfolio.displayName}</h1> : null}
            {display.showHeadline ? <p className="mt-5 text-2xl leading-snug" style={{ color: theme.accentColor }}>{portfolio.headline}</p> : null}
            {display.showBio ? <p className="mt-6 max-w-2xl text-lg leading-8" style={mutedStyle}>{portfolio.bio}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              {display.showHeroCta && props.cta ? <a href="#projects" className="rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg" style={{ backgroundColor: theme.accentColor, color: accentText, boxShadow: `0 16px 40px ${withAlpha(theme.accentColor, 0.18)}` }}>{props.cta}</a> : null}
              {display.showLocation ? <FactPills facts={mergeFacts(portfolio, props)} mutedStyle={mutedStyle} accentColor={theme.accentColor} /> : null}
            </div>
            {display.showSocialsInHero ? <div className="mt-6"><SocialLinks portfolio={portfolio} cardClass={cardClass} cardStyle={cardStyle} compact /></div> : null}
          </div>
        </section>
      );
    case "About":
      return <Block title={section.title} mutedStyle={mutedStyle}><p className="leading-8">{props.text || portfolio.summary}</p></Block>;
    case "Skills":
    case "Tech Stack":
      return <Block title={section.title} mutedStyle={mutedStyle}><div className="flex flex-wrap gap-3">{list(props.items).map((skill) => <span className={`${cardClass} px-4 py-2 text-sm`} style={cardStyle} key={skill}>{skill}</span>)}</div></Block>;
    case "Projects":
    case "Open Source":
      return (
        <Block title={section.title} mutedStyle={mutedStyle} id="projects">
          <div className="grid gap-4 md:grid-cols-2">
            {list(props.items).map((project) => (
              <article className={`${cardClass} p-5`} style={cardStyle} key={project.id || project.title}>
                {project.coverImage ? <img className="mb-4 aspect-video w-full rounded-xl object-cover" src={project.coverImage} alt="" loading="lazy" /> : null}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.featured ? <span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ backgroundColor: withAlpha(theme.accentColor, 0.16), color: theme.accentColor }}>Featured</span> : null}
                </div>
                <p className="mt-3 text-sm leading-6" style={cardMutedStyle}>{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{list(project.techStack).map((tech) => <span className="rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: withAlpha(theme.surfaceTextColor, 0.09), color: theme.surfaceTextColor }} key={tech}>{tech}</span>)}</div>
                <div className="mt-4 flex gap-3 text-sm font-semibold">
                  {project.githubUrl ? <a style={{ color: theme.accentColor }} href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a> : null}
                  {project.liveUrl ? <a style={{ color: theme.accentColor }} href={project.liveUrl} target="_blank" rel="noreferrer">Live</a> : null}
                </div>
              </article>
            ))}
          </div>
        </Block>
      );
    case "Experience":
    case "Education":
    case "Certifications":
    case "Achievements":
      return <Timeline section={section} cardClass={cardClass} mutedStyle={mutedStyle} cardMutedStyle={cardMutedStyle} cardStyle={cardStyle} />;
    case "User Stories":
    case "Blogs":
      return (
        <Block title={section.title} mutedStyle={mutedStyle}>
          <div className="grid gap-4 md:grid-cols-2">
            {list(portfolio.stories).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((story) => (
              <article className={`${cardClass} p-5`} style={cardStyle} key={story.id}>
                <time className="text-xs" style={cardMutedStyle}>{new Date(story.createdAt).toLocaleDateString()}</time>
                <p className="mt-3 leading-7">{story.text}</p>
              </article>
            ))}
          </div>
        </Block>
      );
    case "Resume":
      return <Block title={section.title} mutedStyle={mutedStyle}><a className="font-semibold" style={{ color: theme.accentColor }} href={props.url || "#"}>{props.label || "Download Resume PDF"}</a></Block>;
    case "Contact":
      return <Block title={section.title} mutedStyle={mutedStyle}><p>{props.text}</p><p className="mt-3 font-semibold">{portfolio.socials?.email}</p></Block>;
    case "Social Links":
      return <Block title={section.title} mutedStyle={mutedStyle}><SocialLinks portfolio={portfolio} cardClass={cardClass} cardStyle={cardStyle} /></Block>;
    case "Custom Fields":
      return <Block title={section.title} mutedStyle={mutedStyle}><FieldGrid items={list(props.items)} cardClass={cardClass} cardStyle={cardStyle} cardMutedStyle={cardMutedStyle} /></Block>;
    case "GitHub Stats":
      return <GitHubStats section={section} portfolio={portfolio} cardClass={cardClass} cardMutedStyle={cardMutedStyle} cardStyle={cardStyle} />;
    case "CustomHTML":
      return <Block title={section.title} mutedStyle={mutedStyle}><CustomHTMLBlock html={props.html} /></Block>;
    case "Custom":
      return <Block title={section.title} mutedStyle={mutedStyle}><div className="grid gap-4 md:grid-cols-2">{list(props.components).map((component) => <DynamicComponentRenderer key={component.id} component={component} />)}</div></Block>;
    default:
      return <Block title={section.title} mutedStyle={mutedStyle}><pre className="text-sm">{JSON.stringify(props, null, 2)}</pre></Block>;
  }
}

function FieldGrid({ items, cardClass, cardStyle, cardMutedStyle }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.filter((item) => item.label || item.value).map((item, index) => (
        <div className={`${cardClass} p-4`} style={cardStyle} key={item.id || index}>
          <p className="text-sm" style={cardMutedStyle}>{item.label}</p>
          <p className="mt-2 font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function Block({ title, children, mutedStyle, id }) {
  return <SectionWrapper title={title} mutedStyle={mutedStyle} id={id}>{children}</SectionWrapper>;
}

function Timeline({ section, cardClass, mutedStyle, cardMutedStyle, cardStyle }) {
  const props = sectionProps(section);
  return (
    <Block title={section.title} mutedStyle={mutedStyle}>
      <div className="space-y-4">
        {list(props.items).map((item, index) => (
          <article className={`${cardClass} p-5`} style={cardStyle} key={`${item.role || item.title}-${index}`}>
            <h3 className="font-bold">{item.role || item.title}</h3>
            <p className="mt-1 text-sm">{item.company || item.issuer || item.school}</p>
            <p className="mt-1 text-xs" style={cardMutedStyle}>{item.period || item.date}</p>
            <p className="mt-3 text-sm leading-6" style={cardMutedStyle}>{item.summary || item.description}</p>
          </article>
        ))}
      </div>
    </Block>
  );
}

function SocialLinks({ portfolio, cardClass, cardStyle, compact = false }) {
  const links = publicLinks(portfolio);
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a className={`${cardClass} ${compact ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"}`} style={cardStyle} href={socialHref(link.label, link.value)} target={isEmail(link.value) ? undefined : "_blank"} rel="noreferrer" key={`${link.label}-${link.value}`}>{link.label}</a>
      ))}
    </div>
  );
}

function publicLinks(portfolio) {
  const custom = Array.isArray(portfolio.links) ? portfolio.links.filter((link) => link.label && link.value) : [];
  const legacy = Object.entries(portfolio.socials || {})
    .filter(([, value]) => value)
    .map(([label, value]) => ({ label: label === "devto" ? "DEV" : titleCase(label), value }));
  return custom.length ? custom : legacy;
}

function mergeFacts(portfolio, props) {
  const facts = Array.isArray(portfolio.facts) ? portfolio.facts.filter((fact) => fact.label && fact.value) : [];
  if (facts.length) return facts;
  return props.location ? [{ label: "Location", value: props.location }] : [];
}

function FactPills({ facts, mutedStyle, accentColor }) {
  return facts.map((fact) => (
    <span key={`${fact.label}-${fact.value}`} className="rounded-xl border px-4 py-2.5 text-sm" style={{ ...mutedStyle, borderColor: withAlpha(accentColor, 0.28) }}>
      <span className="font-semibold">{fact.label}:</span> {fact.value}
    </span>
  ));
}

function socialHref(label, href) {
  if (isEmail(href) || label.toLowerCase() === "email") return `mailto:${href.replace(/^mailto:/i, "")}`;
  if (/^https?:\/\//i.test(href)) return href;
  return `https://${href}`;
}

function isEmail(value = "") {
  return /^mailto:/i.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function titleCase(value = "") {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function GitHubStats({ section, portfolio, cardClass, cardMutedStyle, cardStyle }) {
  const props = sectionProps(section);
  const github = portfolio.github || {};
  const username = props.username || portfolio.githubUsername || github.username || portfolio.socials?.github?.split("/").filter(Boolean).pop();
  if (!username) return null;

  return (
    <Block title={section.title} mutedStyle={cardMutedStyle}>
      <div className="grid gap-4 md:grid-cols-3">
        {[["Followers", github.followers || 0], ["Public repos", github.publicRepos || 0], ["Repo stars", github.stars || 0]].map(([label, value]) => (
          <div className={`${cardClass} p-5`} style={cardStyle} key={label}>
            <p className="text-sm" style={cardMutedStyle}>{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list(github.repos).map((repo) => (
          <a className={`${cardClass} p-4`} style={cardStyle} href={repo.url} target="_blank" rel="noreferrer" key={repo.id}>
            <h3 className="font-bold">{repo.name}</h3>
            <p className="mt-2 text-sm" style={cardMutedStyle}>{repo.description}</p>
            <p className="mt-3 text-xs">{repo.language} {repo.stars ? `- ${repo.stars} stars` : ""}</p>
          </a>
        ))}
      </div>
    </Block>
  );
}
