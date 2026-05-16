import axios from "axios";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { defaultPortfolio, reservedUsernames } from "../data/portfolioSchema";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});
const useClientFirestore = import.meta.env.DEV && import.meta.env.VITE_USE_CLIENT_FIRESTORE !== "false";
const portfolios = collection(db, "portfolios");
const usernames = collection(db, "usernames");
const users = collection(db, "users");

function apiError(error, fallback) {
  return new Error(error.response?.data?.message || error.message || fallback);
}

async function authHeaders() {
  if (typeof auth.authStateReady === "function") {
    await auth.authStateReady();
  }
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function shouldUseClientFallback(error) {
  return import.meta.env.DEV && (!error.response || error.response.status >= 500);
}

async function getPortfolioByUidFromClient(uid) {
  const snapshot = await getDoc(doc(portfolios, uid));
  return snapshot.exists() ? { ...defaultPortfolio, ...snapshot.data(), uid } : { ...defaultPortfolio, uid };
}

async function getPortfolioByUsernameFromClient(username) {
  const q = query(portfolios, where("username", "==", username), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const item = snapshot.docs[0];
  return { ...defaultPortfolio, ...item.data(), uid: item.id };
}

async function savePortfolioFromClient(uid, portfolio) {
  const nextUsername = portfolio.username || "";
  const payload = {
    ...portfolio,
    uid,
    username: nextUsername,
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
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });

  return payload;
}

export async function getPortfolioByUid(uid) {
  if (useClientFirestore) return getPortfolioByUidFromClient(uid);
  try {
    const headers = await authHeaders();
    if (!headers.Authorization) return getPortfolioByUidFromClient(uid);
    const response = await api.get("/portfolios/me", { headers });
    return { ...defaultPortfolio, ...response.data, uid };
  } catch (error) {
    if (shouldUseClientFallback(error) || error.response?.status === 401) {
      return getPortfolioByUidFromClient(uid);
    }
    throw error;
  }
}

export async function getPortfolioByUsername(username) {
  if (useClientFirestore) return getPortfolioByUsernameFromClient(username);
  try {
    const response = await api.get(`/portfolios/${username}`);
    return { ...defaultPortfolio, ...response.data };
  } catch (error) {
    if (error.response?.status === 404) return null;
    if (shouldUseClientFallback(error)) return getPortfolioByUsernameFromClient(username);
    throw error;
  }
}

export async function savePortfolio(uid, portfolio) {
  if (useClientFirestore) return savePortfolioFromClient(uid, portfolio);
  try {
    const headers = await authHeaders();
    if (!headers.Authorization) return savePortfolioFromClient(uid, portfolio);
    const response = await api.post("/portfolios", portfolio, { headers });
    return { ...response.data, uid };
  } catch (error) {
    if (shouldUseClientFallback(error) || error.response?.status === 401) {
      return savePortfolioFromClient(uid, portfolio);
    }
    throw apiError(error, "Unable to save portfolio");
  }
}

export async function checkUsernameAvailability(username, currentUid) {
  if (useClientFirestore) {
    const snapshot = await getDoc(doc(usernames, username));
    if (!snapshot.exists()) return true;
    return snapshot.data().uid === currentUid;
  }
  try {
    const response = await api.get(`/portfolios/availability/${username}`, { params: { currentUid } });
    return response.data.available;
  } catch (error) {
    if (!shouldUseClientFallback(error)) throw error;
    const snapshot = await getDoc(doc(usernames, username));
    if (!snapshot.exists()) return true;
    return snapshot.data().uid === currentUid;
  }
}

export async function incrementPortfolioView(uid) {
  if (!uid) return;
  if (useClientFirestore) {
    await updateDoc(doc(portfolios, uid), {
      "analytics.views": increment(1),
    });
    return;
  }
  try {
    await api.post(`/portfolios/${uid}/analytics/view`);
  } catch (error) {
    if (!shouldUseClientFallback(error)) throw error;
    await updateDoc(doc(portfolios, uid), {
      "analytics.views": increment(1),
    });
  }
}

export async function listAdminUsers() {
  if (useClientFirestore) {
    const snapshot = await getDocs(query(users, limit(100)));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }
  const response = await api.get("/admin/users", { headers: await authHeaders() });
  return response.data;
}

export async function deleteUserRecord(uid) {
  if (useClientFirestore) {
    await deleteDoc(doc(users, uid));
    await deleteDoc(doc(portfolios, uid));
    return;
  }
  try {
    await api.delete(`/admin/users/${uid}`, { headers: await authHeaders() });
  } catch (error) {
    if (!shouldUseClientFallback(error)) throw error;
    await deleteDoc(doc(users, uid));
    await deleteDoc(doc(portfolios, uid));
  }
}
