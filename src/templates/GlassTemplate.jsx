import SectionRenderer from "../components/portfolio/SectionRenderer";

export default function GlassTemplate({ portfolio }) {
  const theme = portfolio.theme;
  return (
    <main className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.backgroundColor}, ${theme.surfaceColor})`, color: theme.textColor, fontFamily: theme.fontFamily }}>
      <div className="pointer-events-none fixed inset-0 opacity-80" style={{ background: `radial-gradient(circle at 15% 20%, ${portfolio.accentColor}44, transparent 26%), radial-gradient(circle at 85% 10%, ${theme.textColor}22, transparent 24%)` }} />
      <div className="relative mx-auto max-w-6xl px-5 py-8">
        <div className="border p-5 backdrop-blur-2xl" style={{ borderColor: `${portfolio.accentColor}33`, backgroundColor: `${theme.surfaceColor}99`, borderRadius: theme.cornerRadius }}>
          <nav className="mb-4 flex items-center justify-between border-b pb-4" style={{ borderColor: `${portfolio.accentColor}33` }}>
            <div className="text-xl font-black">PortZen Glass</div>
            <span className="px-3 py-1 text-sm" style={{ backgroundColor: `${portfolio.accentColor}22`, borderRadius: theme.cornerRadius }}>/{portfolio.username}</span>
          </nav>
          {portfolio.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} portfolio={portfolio} variant="dark" />
          ))}
        </div>
      </div>
    </main>
  );
}
