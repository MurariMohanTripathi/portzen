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

const portfolios = collection(db, "portfolios");
const usernames = collection(db, "usernames");
const users = collection(db, "users");

export async function getPortfolioByUid(uid) {
  const snapshot = await getDoc(doc(portfolios, uid));
  return snapshot.exists() 
    ? { ...defaultPortfolio, ...snapshot.data(), uid } 
    : { ...defaultPortfolio, uid };
}

export async function getPortfolioByUsername(username) {
  const q = query(portfolios, where("username", "==", username), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const item = snapshot.docs[0];
  return { ...defaultPortfolio, ...item.data(), uid: item.id };
}

export async function savePortfolio(uid, portfolio) {
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

export async function checkUsernameAvailability(username, currentUid) {
  const snapshot = await getDoc(doc(usernames, username));
  if (!snapshot.exists()) return true;
  return snapshot.data().uid === currentUid;
}

export async function incrementPortfolioView(uid) {
  if (!uid) return;
  await updateDoc(doc(portfolios, uid), {
    "analytics.views": increment(1),
  });
}

export async function listAdminUsers() {
  const snapshot = await getDocs(query(users, limit(100)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function deleteUserRecord(uid) {
  await deleteDoc(doc(users, uid));
  await deleteDoc(doc(portfolios, uid));
}