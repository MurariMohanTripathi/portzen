export default function SectionWrapper({ title, children, muted = "text-white/65", mutedStyle, id }) {
  return (
    <section id={id} className="py-10">
      {title ? <h2 className="text-3xl font-black">{title}</h2> : null}
      <div className={`${title ? "mt-5" : ""} ${mutedStyle ? "" : muted}`} style={mutedStyle}>{children}</div>
    </section>
  );
}
