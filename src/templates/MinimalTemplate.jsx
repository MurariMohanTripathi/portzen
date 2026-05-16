import SectionRenderer from "../components/portfolio/SectionRenderer";

export default function MinimalTemplate({ portfolio }) {
  const theme = portfolio.theme;
  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
      <div className="mx-auto max-w-4xl px-5 py-10">
        <header className="border-b pb-6" style={{ borderColor: `${portfolio.accentColor}33` }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: portfolio.accentColor }}>portzen.in/{portfolio.username}</p>
        </header>
        {portfolio.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} portfolio={portfolio} variant="light" />
        ))}
      </div>
    </main>
  );
}
