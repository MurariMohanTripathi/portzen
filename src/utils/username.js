import { reservedUsernames } from "../data/portfolioSchema";

export function normalizeUsername(value) {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "").slice(0, 20);
}

export function validateUsername(value) {
  const username = normalizeUsername(value);
  if (username.length < 3) return { ok: false, reason: "Use at least 3 characters." };
  if (username.length > 20) return { ok: false, reason: "Use 20 characters or fewer." };
  if (!/^[a-z0-9_]+$/.test(username)) return { ok: false, reason: "Use lowercase letters, numbers, and underscores only." };
  if (reservedUsernames.includes(username)) return { ok: false, reason: "This username is reserved." };
  return { ok: true, username };
}

export function wordsCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
