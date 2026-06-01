import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import BrandLogo from "../components/brand/BrandLogo";
import PageSeo from "../components/seo/PageSeo";
import SiteFooter from "../components/layout/SiteFooter";
import { pageSeo } from "../utils/seo";

const features = [
  {
    title: "Portfolio Website Builder",
    description: "Create a public developer portfolio with hero, about, skills, projects, experience, education, achievements, contact, custom fields, and resume sections.",
  },
  {
    title: "Developer Blog",
    description: "Publish career updates, learning notes, interview reflections, project breakdowns, and long-form posts on dedicated SEO-ready blog URLs.",
  },
  {
    title: "Project CMS",
    description: "Add projects with descriptions, tech stacks, GitHub links, live demos, cover images, featured flags, and portfolio-ready cards.",
  },
  {
    title: "Live Preview Editor",
    description: "Edit content, reorder sections, switch devices, choose templates, and see portfolio changes before publishing.",
  },
  {
    title: "Theme System",
    description: "Customize portfolio and blog themes with colors, surfaces, fonts, corner radius, and readable contrast balancing.",
  },
  {
    title: "SEO and Sharing",
    description: "Public profiles and blog posts use canonical links, Open Graph tags, Twitter cards, descriptions, and structured data.",
  },
  {
    title: "Custom Code Mode",
    description: "Advanced users can build a fully custom portfolio page with their own HTML and CSS while keeping builder data saved.",
  },
  {
    title: "Analytics Ready",
    description: "Track views, unique visitors, clicks, bookmarks, and admin-level portfolio activity with Firebase-backed data.",
  },
  {
    title: "Firebase Deployment",
    description: "Built for Firebase Authentication, Firestore, Storage, Hosting, and Functions with protected dashboard and admin flows.",
  },
];

const benefits = [
  "Claim a clean username URL",
  "Import and connect GitHub",
  "Publish career blogs",
  "Choose portfolio templates",
  "Use separate blog themes",
  "Manage projects and experience",
  "Preview mobile, tablet, desktop",
  "Share SEO-ready public pages",
];

const seoJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PortZen",
  applicationCategory: "WebApplication",
  operatingSystem: "Web",
  description: "Developer portfolio website builder with portfolio templates, project CMS, developer blog, SEO-ready public pages, analytics, and Firebase deployment.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: features.map((feature) => feature.title),
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <PageSeo {...pageSeo.home} path="/" jsonLd={seoJsonLd} />
      <div className="fixed inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,0.72),rgba(9,9,11,0.9)_38%,rgba(63,24,74,0.58)),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[auto,40px_40px,40px_40px]" />
      <div className="relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link to="/" aria-label="PortZen home"><BrandLogo /></Link>
          <div className="hidden gap-8 text-sm text-zinc-300 md:flex">
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="flex gap-3">
            <Link to="/login"><Button variant="secondary">Login</Button></Link>
            <Link to="/signup"><Button>Start Free</Button></Link>
          </div>
        </nav>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-sm shadow-cyan-500/10">Custom URL preview: portzen.in/murari</div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Build a professional developer portfolio that is ready to rank, share, and grow.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">PortZen helps software engineers, students, freelancers, and founders launch SEO-ready portfolio websites with projects, experience, developer blogs, themes, analytics, and custom URLs.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button className="px-6 py-3">Create Portfolio</Button></Link>
              <Link to="/preview/modern"><Button className="px-6 py-3" variant="secondary">Preview Template</Button></Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {["SEO-ready pages", "Developer blog", "Live dashboard"].map((item) => <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-4 text-sm text-zinc-200 shadow-lg shadow-black/10 backdrop-blur" key={item}>{item}</div>)}
            </div>
          </div>
          <AnimatedPreview />
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black">Everything users need to publish a serious developer portfolio</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">PortZen combines portfolio building, blogging, publishing, and SEO basics in one dashboard, so users can show projects, explain their learning journey, and give recruiters a clean place to understand their work.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:border-cyan-200/35 hover:bg-zinc-900/90" key={feature.title}><div className="mb-5 h-10 w-10 rounded-lg border border-cyan-300/20 bg-cyan-300/15" /><h3 className="text-xl font-bold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{feature.description}</p></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-4xl font-black">Built for portfolio search intent</h2>
              <p className="mt-4 text-lg leading-8 text-zinc-300">Every public portfolio can present the content people search for: developer projects, software engineering experience, resume links, GitHub, skills, case studies, and a developer blog with individual post URLs.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100" key={benefit}>{benefit}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="templates" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="text-4xl font-black">Portfolio templates with one flexible data model</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">Switch designs without rewriting content. Projects, blog posts, links, custom fields, and sections stay portable across templates.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["Modern Developer", "Minimal", "Glassmorphism"].map((name, index) => <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5 shadow-xl shadow-black/10" key={name}><div className={`h-52 rounded-lg ${index === 1 ? "bg-zinc-100" : "bg-gradient-to-br from-cyan-300/20 to-rose-300/20"}`} /><h3 className="mt-4 text-xl font-bold">{name}</h3></div>)}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20">
          <div className="rounded-lg border border-white/10 bg-gradient-to-r from-cyan-400/10 via-zinc-900/70 to-rose-300/10 p-8 text-center shadow-2xl shadow-black/20">
            <h2 className="text-4xl font-black">Launch a developer portfolio today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-300">Start with a public portfolio, then grow into custom themes, developer blogs, analytics, admin workflows, premium exports, and advanced publishing tools.</p>
            <Link className="mt-8 inline-flex" to="/signup"><Button className="px-7 py-3">Claim your username</Button></Link>
          </div>
        </section>

        <SiteFooter variant="detailed" />
      </div>
    </main>
  );
}

function AnimatedPreview() {
  return (
    <div className="relative">
      <div className="relative rounded-lg border border-white/10 bg-zinc-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-cyan-300 to-rose-300" />
          <div><h3 className="text-2xl font-bold">Murari Tripathi</h3><p className="text-cyan-200">Full Stack Developer</p></div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-32 rounded-lg border border-white/10 bg-black/30 p-4"><div className="h-3 w-24 rounded bg-cyan-300/50" /><div className="mt-3 h-3 w-32 rounded bg-white/20" /></div>
          <div className="h-32 rounded-lg border border-white/10 bg-black/30 p-4"><div className="h-3 w-20 rounded bg-rose-300/50" /><div className="mt-3 h-3 w-28 rounded bg-white/20" /></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{["React", "Firebase", "Express", "MongoDB"].map((item) => <span className="rounded-full bg-white/10 px-3 py-1 text-sm" key={item}>{item}</span>)}</div>
      </div>
    </div>
  );
}
