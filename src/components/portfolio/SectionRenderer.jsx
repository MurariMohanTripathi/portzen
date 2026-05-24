import DynamicComponentRenderer from "./DynamicComponentRenderer";
import CustomHTMLBlock from "./CustomHTMLBlock";
import SectionWrapper from "./SectionWrapper";
import { sectionProps } from "../../utils/sections";

function list(value) {
  return Array.isArray(value) ? value : [];
}

export default function SectionRenderer({ section, portfolio, variant = "dark" }) {
  const theme = portfolio.theme || {};
  const props = sectionProps(section);
  const muted = variant === "light" ? "text-zinc-600" : "text-white/65";
  const card = variant === "light" ? "border-zinc-200 bg-white" : "border-white/10 bg-white/5";
  const cardStyle = {
    backgroundColor: `${theme.surfaceColor || "#18181b"}dd`,
    borderColor: `${portfolio.accentColor}30`,
    borderRadius: theme.cornerRadius || 16,
  };

  switch (section.type) {
    case "Hero":
      return (
        <section className="grid gap-8 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: portfolio.accentColor }}>portzen.in/{portfolio.username}</p>
            <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">{portfolio.displayName}</h1>
            <p className="mt-4 text-2xl" style={{ color: portfolio.accentColor }}>{portfolio.headline}</p>
            <p className={`mt-6 max-w-2xl leading-8 ${muted}`}>{portfolio.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {props.cta ? <a href="#projects" className="rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-950" style={{ backgroundColor: portfolio.accentColor }}>{props.cta}</a> : null}
              {props.location ? <span className={`rounded-xl border px-4 py-2.5 text-sm ${muted}`} style={{ borderColor: `${portfolio.accentColor}33` }}>{props.location}</span> : null}
            </div>
          </div>
          <div className={`border ${card} p-6`} style={cardStyle}>
            <div className="aspect-square" style={{ borderRadius: theme.cornerRadius || 16, background: `linear-gradient(135deg, ${portfolio.accentColor}66, ${theme.surfaceColor || "#18181b"}, ${theme.textColor || "#ffffff"}22)` }} />
          </div>
        </section>
      );
    case "About":
      return <Block title={section.title} muted={muted}><p className="leading-8">{props.text || portfolio.summary}</p></Block>;
    case "Skills":
    case "Tech Stack":
      return <Block title={section.title} muted={muted}><div className="flex flex-wrap gap-3">{list(props.items).map((skill) => <span className={`border ${card} px-4 py-2 text-sm`} style={cardStyle} key={skill}>{skill}</span>)}</div></Block>;
    case "Projects":
    case "Open Source":
      return (
        <Block title={section.title} muted={muted} id="projects">
          <div className="grid gap-4 md:grid-cols-2">
            {list(props.items).map((project) => (
              <article className={`border ${card} p-5`} style={cardStyle} key={project.id || project.title}>
                {project.coverImage ? <img className="mb-4 aspect-video w-full rounded-xl object-cover" src={project.coverImage} alt="" loading="lazy" /> : null}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.featured ? <span className="rounded-full px-2 py-1 text-xs" style={{ backgroundColor: `${portfolio.accentColor}22`, color: portfolio.accentColor }}>Featured</span> : null}
                </div>
                <p className={`mt-3 text-sm leading-6 ${muted}`}>{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{list(project.techStack).map((tech) => <span className="rounded-lg bg-black/10 px-2 py-1 text-xs" key={tech}>{tech}</span>)}</div>
                <div className="mt-4 flex gap-3 text-sm font-semibold">
                  {project.githubUrl ? <a style={{ color: portfolio.accentColor }} href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a> : null}
                  {project.liveUrl ? <a style={{ color: portfolio.accentColor }} href={project.liveUrl} target="_blank" rel="noreferrer">Live</a> : null}
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
      return <Timeline section={section} card={card} muted={muted} cardStyle={cardStyle} />;
    case "User Stories":
    case "Blogs":
      return (
        <Block title={section.title} muted={muted}>
          <div className="grid gap-4 md:grid-cols-2">
            {list(portfolio.stories).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((story) => (
              <article className={`border ${card} p-5`} style={cardStyle} key={story.id}>
                <time className={`text-xs ${muted}`}>{new Date(story.createdAt).toLocaleDateString()}</time>
                <p className="mt-3 leading-7">{story.text}</p>
              </article>
            ))}
          </div>
        </Block>
      );
    case "Resume":
      return <Block title={section.title} muted={muted}><a className="font-semibold" style={{ color: portfolio.accentColor }} href={props.url || "#"}>Download Resume PDF</a></Block>;
    case "Contact":
      return <Block title={section.title} muted={muted}><p>{props.text}</p><p className="mt-3 font-semibold">{portfolio.socials?.email}</p></Block>;
    case "Social Links":
      return <Block title={section.title} muted={muted}><SocialLinks portfolio={portfolio} card={card} cardStyle={cardStyle} /></Block>;
    case "GitHub Stats":
      return <GitHubStats section={section} portfolio={portfolio} card={card} muted={muted} cardStyle={cardStyle} />;
    case "CustomHTML":
      return <Block title={section.title} muted={muted}><CustomHTMLBlock html={props.html} /></Block>;
    case "Custom":
      return <Block title={section.title} muted={muted}><div className="grid gap-4 md:grid-cols-2">{list(props.components).map((component) => <DynamicComponentRenderer key={component.id} component={component} />)}</div></Block>;
    default:
      return <Block title={section.title} muted={muted}><pre className="text-sm">{JSON.stringify(props, null, 2)}</pre></Block>;
  }
}

function Block({ title, children, muted, id }) {
  return <SectionWrapper title={title} muted={muted} id={id}>{children}</SectionWrapper>;
}

function Timeline({ section, card, muted, cardStyle }) {
  const props = sectionProps(section);
  return (
    <Block title={section.title} muted={muted}>
      <div className="space-y-4">
        {list(props.items).map((item, index) => (
          <article className={`border ${card} p-5`} style={cardStyle} key={`${item.role || item.title}-${index}`}>
            <h3 className="font-bold">{item.role || item.title}</h3>
            <p className="mt-1 text-sm">{item.company || item.issuer || item.school}</p>
            <p className={`mt-1 text-xs ${muted}`}>{item.period || item.date}</p>
            <p className={`mt-3 text-sm leading-6 ${muted}`}>{item.summary || item.description}</p>
          </article>
        ))}
      </div>
    </Block>
  );
}

function SocialLinks({ portfolio, card, cardStyle }) {
  const links = Object.entries(portfolio.socials || {}).filter(([, value]) => value);
  return (
    <div className="flex flex-wrap gap-3">
      {links.map(([label, href]) => (
        <a className={`border ${card} px-4 py-2 text-sm capitalize`} style={cardStyle} href={label === "email" ? `mailto:${href}` : href} target={label === "email" ? undefined : "_blank"} rel="noreferrer" key={label}>{label}</a>
      ))}
    </div>
  );
}

function GitHubStats({ section, portfolio, card, muted, cardStyle }) {
  const props = sectionProps(section);
  const github = portfolio.github || {};
  const username = props.username || portfolio.githubUsername || github.username || portfolio.socials?.github?.split("/").filter(Boolean).pop();
  if (!username) return null;

  return (
    <Block title={section.title} muted={muted}>
      <div className="grid gap-4 md:grid-cols-3">
        {[["Followers", github.followers || 0], ["Public repos", github.publicRepos || 0], ["Repo stars", github.stars || 0]].map(([label, value]) => (
          <div className={`border ${card} p-5`} style={cardStyle} key={label}>
            <p className={`text-sm ${muted}`}>{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list(github.repos).map((repo) => (
          <a className={`border ${card} p-4`} style={cardStyle} href={repo.url} target="_blank" rel="noreferrer" key={repo.id}>
            <h3 className="font-bold">{repo.name}</h3>
            <p className={`mt-2 text-sm ${muted}`}>{repo.description}</p>
            <p className="mt-3 text-xs">{repo.language} {repo.stars ? `- ${repo.stars} stars` : ""}</p>
          </a>
        ))}
      </div>
    </Block>
  );
}
