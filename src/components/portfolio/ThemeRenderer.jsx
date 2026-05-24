import CyberpunkTheme from "../../themes/CyberpunkTheme";
import MinimalTheme from "../../themes/MinimalTheme";
import GlassTheme from "../../themes/GlassTheme";

const themes = {
  cyberpunk: CyberpunkTheme,
  modern: CyberpunkTheme,
  minimal: MinimalTheme,
  glass: GlassTheme,
};

export default function ThemeRenderer({ portfolio }) {
  const Theme = themes[portfolio.template] || CyberpunkTheme;
  return <Theme portfolio={portfolio} />;
}
