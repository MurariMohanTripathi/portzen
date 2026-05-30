import { Link } from "react-router-dom";
import BrandLogo from "../brand/BrandLogo";

const year = new Date().getFullYear();

export default function SiteFooter({ variant = "compact", portfolio, className = "" }) {
  if (variant === "compact") {
    return (
      <footer className={`relative border-t border-white/10 bg-zinc-950/75 px-5 py-4 text-sm text-zinc-400 backdrop-blur-xl ${className}`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <Link to="/" aria-label="PortZen home">
            <BrandLogo compact />
          </Link>
          <p className="text-center">Copyright {year} PortZen. Build yours at <a className="font-semibold text-cyan-200 hover:text-cyan-100" href="https://portzen.in">portzen.in</a></p>
        </div>
      </footer>
    );
  }

  const accent = portfolio?.accentColor || portfolio?.theme?.accentColor || "#67e8f9";
  const surface = portfolio?.theme?.surfaceColor || "#111827";
  const text = portfolio?.theme?.textColor || "#f8fafc";

  return (
    <footer
      className={`relative border-t px-5 py-10 ${className}`}
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${surface}ee, rgba(9,9,11,0.96))`,
        color: text,
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
        <div>
          <Link to="/" className="inline-flex" aria-label="PortZen home">
            <BrandLogo />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
            PortZen helps developers publish sharp, responsive portfolios with custom sections, themes, analytics, and share-ready pages.
          </p>
        </div>

        <nav className="grid gap-3 text-sm text-zinc-300" aria-label="Footer navigation">
          <span className="font-semibold text-white">Navigate</span>
          <Link className="hover:text-cyan-200" to="/">Landing page</Link>
          <Link className="hover:text-cyan-200" to="/signup">Create account</Link>
          <Link className="hover:text-cyan-200" to="/login">Login</Link>
        </nav>

        <div className="grid gap-3 text-sm text-zinc-300">
          <span className="font-semibold text-white">PortZen</span>
          <a className="hover:text-cyan-200" href="https://portzen.in">portzen.in</a>
          <span>Copyright {year} PortZen.</span>
        </div>
      </div>
    </footer>
  );
}
