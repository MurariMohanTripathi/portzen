export default function SectionWrapper({ title, children, muted = "text-white/65", id }) {
  return (
    <section id={id} className="py-10">
      <h2 className="text-3xl font-black">{title}</h2>
      <div className={`mt-5 ${muted}`}>{children}</div>
    </section>
  );
}
