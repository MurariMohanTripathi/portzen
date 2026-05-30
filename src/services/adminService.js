import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const admins = collection(db, "admins");
const allowedBootstrapAdminEmail = "tripathimurari599@gmail.com";

export function normalizeAdminEmail(email = "") {
  return email.trim().toLowerCase();
}

export async function getAdminAccessByUsername(adminUsername, user) {
  if (!adminUsername || !user?.email) return null;
  const snapshot = await getDoc(doc(admins, adminUsername));
  if (!snapshot.exists()) return null;

  const admin = { id: snapshot.id, ...snapshot.data() };
  const authEmail = normalizeAdminEmail(user.email);
  const adminEmail = normalizeAdminEmail(admin.email);
  if (admin.active === false || adminEmail !== authEmail) return null;

  return admin;
}

export async function hasAdminAccess(user) {
  if (!user?.email) return false;
  const authEmail = normalizeAdminEmail(user.email);
  const snapshot = await getDocs(query(admins, where("email", "==", authEmail), where("active", "==", true), limit(1)));
  return !snapshot.empty;
}

export async function ensureBootstrapAdmin(username = "murari") {
  await setDoc(doc(admins, username), {
    username,
    email: allowedBootstrapAdminEmail,
    active: true,
    role: "superadmin",
    displayName: "Murari Tripathi",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
