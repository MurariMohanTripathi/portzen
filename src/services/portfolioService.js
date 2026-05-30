import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { defaultPortfolio, reservedUsernames } from "../data/portfolioSchema";
import { normalizeSections } from "../utils/sections";

const portfolios = collection(db, "portfolios");
const usernames = collection(db, "usernames");
const users = collection(db, "users");

export async function getPortfolioByUid(uid) {
  const snapshot = await getDoc(doc(portfolios, uid));
  const profileSnapshot = await getDoc(doc(users, uid, "profile", "main"));
  const sectionSnapshot = await getDocs(query(collection(users, uid, "sections"), orderBy("order", "asc")));
  const storiesSnapshot = await getDocs(query(collection(users, uid, "stories"), orderBy("createdAt", "desc"), limit(25)));
  const base = snapshot.exists() ? snapshot.data() : {};
  const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
  const sections = sectionSnapshot.empty ? base.sections : sectionSnapshot.docs.map((item) => item.data());
  const stories = storiesSnapshot.empty ? base.stories : storiesSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return normalizePortfolio({ ...base, ...profile, sections, stories, uid });
}

export async function getPortfolioByUsername(username) {
  const q = query(portfolios, where("username", "==", username), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const item = snapshot.docs[0];
  return normalizePortfolio({ ...item.data(), uid: item.id });
}

export async function savePortfolio(uid, portfolio) {
  const nextUsername = portfolio.username || "";
  const sections = normalizeSections(portfolio.sections);
  const stories = (portfolio.stories || []).slice(0, 50);
  const payload = {
    ...portfolio,
    uid,
    username: nextUsername,
    sections,
    stories,
    published: Boolean(nextUsername),
    updatedAt: serverTimestamp(),
    createdAt: portfolio.createdAt || serverTimestamp(),
  };

  await runTransaction(db, async (transaction) => {
    const portfolioRef = doc(portfolios, uid);
    const userRef = doc(users, uid);
    const previous = await transaction.get(portfolioRef);
    const previousUsername = previous.exists() ? previous.data().username : "";

    if (nextUsername) {
      if (reservedUsernames.includes(nextUsername)) {
        throw new Error("This username is reserved.");
      }
      const usernameRef = doc(usernames, nextUsername);
      const usernameSnapshot = await transaction.get(usernameRef);
      const ownerUid = usernameSnapshot.exists() ? usernameSnapshot.data().uid : null;
      if (ownerUid && ownerUid !== uid) {
        throw new Error("Username is already taken.");
      }
      transaction.set(usernameRef, { uid, username: nextUsername, updatedAt: serverTimestamp() }, { merge: true });
    }

    if (previousUsername && previousUsername !== nextUsername) {
      transaction.delete(doc(usernames, previousUsername));
    }

    transaction.set(portfolioRef, payload, { merge: true });
    transaction.set(userRef, {
      uid,
      email: portfolio.email || auth.currentUser?.email || "",
      username: nextUsername,
      displayName: portfolio.displayName,
      role: portfolio.role || "user",
      banned: Boolean(portfolio.banned),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });

  const profilePayload = { ...payload };
  delete profilePayload.sections;
  delete profilePayload.stories;
  const batch = writeBatch(db);
  const profileRef = doc(users, uid, "profile", "main");
  const analyticsRef = doc(users, uid, "analytics", "summary");
  batch.set(profileRef, profilePayload, { merge: true });
  batch.set(analyticsRef, payload.analytics || defaultPortfolio.analytics, { merge: true });
  sections.forEach((section, order) => {
    batch.set(doc(users, uid, "sections", section.id), { ...section, order }, { merge: true });
  });
  stories.forEach((story) => {
    batch.set(doc(users, uid, "stories", story.id), story, { merge: true });
  });
  await batch.commit();

  return payload;
}

export async function checkUsernameAvailability(username, currentUid) {
  if (!username || reservedUsernames.includes(username)) return false;
  const snapshot = await getDoc(doc(usernames, username));
  if (!snapshot.exists()) return true;
  return snapshot.data().uid === currentUid;
}

export async function incrementPortfolioView(uid, visitorId) {
  if (!uid) return;
  const visitorRef = visitorId ? doc(users, uid, "analytics", "visitors", visitorId) : null;
  await runTransaction(db, async (transaction) => {
    const portfolioRef = doc(portfolios, uid);
    const analyticsRef = doc(users, uid, "analytics", "summary");
    let isUnique = false;
    if (visitorRef) {
      const visitor = await transaction.get(visitorRef);
      isUnique = !visitor.exists();
      transaction.set(visitorRef, { firstSeenAt: serverTimestamp(), lastSeenAt: serverTimestamp() }, { merge: true });
    }
    transaction.set(portfolioRef, {
      "analytics.views": increment(1),
      "analytics.visits": increment(1),
      ...(isUnique ? { "analytics.uniqueVisitors": increment(1) } : {}),
    }, { merge: true });
    transaction.set(analyticsRef, {
      views: increment(1),
      visits: increment(1),
      ...(isUnique ? { uniqueVisitors: increment(1) } : {}),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

export async function listAdminUsers() {
  const snapshot = await getDocs(query(users, limit(100)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function deleteUserRecord(uid) {
  const portfolioSnapshot = await getDoc(doc(portfolios, uid));
  const username = portfolioSnapshot.exists() ? portfolioSnapshot.data().username : "";
  if (username) await deleteDoc(doc(usernames, username));
  await deleteDoc(doc(users, uid));
  await deleteDoc(doc(portfolios, uid));
}

export async function updateAdminUser(uid, updates) {
  await runTransaction(db, async (transaction) => {
    const userRef = doc(users, uid);
    const portfolioRef = doc(portfolios, uid);
    if (Object.prototype.hasOwnProperty.call(updates, "username")) {
      const nextUsername = updates.username || "";
      if (nextUsername && reservedUsernames.includes(nextUsername)) throw new Error("This username is reserved.");
      const previous = await transaction.get(portfolioRef);
      const previousUsername = previous.exists() ? previous.data().username : "";
      if (nextUsername) {
        const usernameRef = doc(usernames, nextUsername);
        const usernameSnapshot = await transaction.get(usernameRef);
        const ownerUid = usernameSnapshot.exists() ? usernameSnapshot.data().uid : null;
        if (ownerUid && ownerUid !== uid) throw new Error("Username is already taken.");
        transaction.set(usernameRef, { uid, username: nextUsername, updatedAt: serverTimestamp() }, { merge: true });
      }
      if (previousUsername && previousUsername !== nextUsername) transaction.delete(doc(usernames, previousUsername));
    }
    transaction.set(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
    transaction.set(portfolioRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
  });
}

function normalizePortfolio(data = {}) {
  return {
    ...defaultPortfolio,
    ...data,
    analytics: { ...defaultPortfolio.analytics, ...data.analytics },
    socials: { ...defaultPortfolio.socials, ...data.socials },
    links: normalizeCustomList(data.links || defaultPortfolio.links),
    facts: normalizeCustomList(data.facts || defaultPortfolio.facts),
    theme: { ...defaultPortfolio.theme, ...data.theme },
    display: { ...defaultPortfolio.display, ...data.display },
    customCode: { ...defaultPortfolio.customCode, ...data.customCode },
    sections: normalizeSections(data.sections || defaultPortfolio.sections),
    stories: data.stories || defaultPortfolio.stories,
  };
}

function normalizeCustomList(items = []) {
  return items.filter(Boolean).map((item, index) => ({
    id: item.id || `item-${index}`,
    label: item.label || "",
    value: item.value || "",
  }));
}
