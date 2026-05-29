export function normalizeTheme(portfolio = {}) {
  const source = portfolio.theme || {};
  const backgroundColor = source.backgroundColor || "#09090b";
  const textColor = readableText(backgroundColor, source.textColor);
  const surfaceColor = source.surfaceColor || mixColor(backgroundColor, textColor === "#ffffff" ? "#ffffff" : "#000000", textColor === "#ffffff" ? 12 : 5);
  const accentColor = source.accentColor || portfolio.accentColor || "#22d3ee";
  const surfaceTextColor = readableText(surfaceColor);

  return {
    ...source,
    backgroundColor,
    surfaceColor,
    textColor,
    accentColor,
    surfaceTextColor,
    mutedTextColor: withAlpha(textColor, 0.72),
    mutedSurfaceTextColor: withAlpha(surfaceTextColor, 0.7),
    borderColor: withAlpha(accentColor, 0.28),
    cornerRadius: source.cornerRadius || 14,
    fontFamily: source.fontFamily || "Inter, system-ui, sans-serif",
  };
}

export function readableText(background, preferred) {
  if (preferred && contrastRatio(preferred, background) >= 4.5) return preferred;
  return contrastRatio("#ffffff", background) >= contrastRatio("#111827", background) ? "#ffffff" : "#111827";
}

export function contrastRatio(a, b) {
  const first = relativeLuminance(hexToRgb(a));
  const second = relativeLuminance(hexToRgb(b));
  const light = Math.max(first, second);
  const dark = Math.min(first, second);
  return (light + 0.05) / (dark + 0.05);
}

export function mixColor(hex, target, amount) {
  const base = hexToRgb(hex);
  const next = hexToRgb(target);
  const ratio = amount / 100;
  return rgbToHex({
    r: Math.round(base.r + (next.r - base.r) * ratio),
    g: Math.round(base.g + (next.g - base.g) * ratio),
    b: Math.round(base.b + (next.b - base.b) * ratio),
  });
}

export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexToRgb(hex = "#000000") {
  const clean = String(hex).replace("#", "").padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
