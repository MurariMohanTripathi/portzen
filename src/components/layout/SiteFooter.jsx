import { Link } from "react-router-dom";
import BrandLogo from "../brand/BrandLogo";
import { normalizeTheme, readableText, withAlpha } from "../../utils/themeColors";

const year = new Date().getFullYear();

export default function SiteFooter({ variant = "compact", portfolio, className = "" }) {
  const theme = normalizeTheme(portfolio || {});
  const footerSurface = portfolio ? theme.surfaceColor : "#09090b";
  const footerText = portfolio ? readableText(footerSurface) : "#f8fafc";
  const mutedText = withAlpha(footerText, 0.72);
  const linkStyle = { color: theme.accentColor };
  const logoProps = {
    accentColor: theme.accentColor,
    textColor: footerText,
    mutedColor: mutedText,
    surfaceColor: withAlpha(theme.backgroundColor, 0.92),
  };

  if (variant === "compact") {
    return (
      <footer
        className={`relative border-t px-5 py-4 text-sm backdrop-blur-xl ${className}`}
        style={{
          borderColor: portfolio ? theme.borderColor : "rgba(255,255,255,0.1)",
          backgroundColor: portfolio ? withAlpha(footerSurface, 0.86) : "rgba(9,9,11,0.75)",
          color: portfolio ? mutedText : "#a1a1aa",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <Link to="/" aria-label="PortZen home">
            <BrandLogo compact {...logoProps} />
          </Link>
          <p className="text-center">Copyright {year} PortZen. Build yours at <a className="font-semibold" style={linkStyle} href="https://portzen.in">portzen.in</a></p>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`relative border-t px-5 py-10 ${className}`}
      style={{
        borderColor: theme.borderColor,
        background: `linear-gradient(135deg, ${withAlpha(footerSurface, 0.96)}, ${withAlpha(theme.backgroundColor, 0.98)})`,
        color: footerText,
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
        <div>
          <Link to="/" className="inline-flex" aria-label="PortZen home">
            <BrandLogo {...logoProps} />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6" style={{ color: mutedText }}>
            PortZen helps developers publish sharp, responsive portfolios with custom sections, themes, analytics, and share-ready pages.
          </p>
        </div>

        <nav className="grid gap-3 text-sm" style={{ color: mutedText }} aria-label="Footer navigation">
          <span className="font-semibold" style={{ color: footerText }}>Navigate</span>
          <Link style={linkStyle} to="/">Landing page</Link>
          <Link style={linkStyle} to="/signup">Create account</Link>
          <Link style={linkStyle} to="/login">Login</Link>
        </nav>

        <div className="grid gap-3 text-sm" style={{ color: mutedText }}>
          <span className="font-semibold" style={{ color: footerText }}>PortZen</span>
          <a style={linkStyle} href="https://portzen.in">portzen.in</a>
          <span>Copyright {year} PortZen.</span>
        </div>
      </div>
    </footer>
  );
}
