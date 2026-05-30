/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { hasAdminAccess } from "../services/adminService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [adminEnabled, setAdminEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setRole("user");
        setAdminEnabled(false);
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, "users", currentUser.uid));
        setRole(snapshot.exists() ? snapshot.data().role || "user" : "user");
        setAdminEnabled(await hasAdminAccess(currentUser));
      } catch {
        setRole("user");
        setAdminEnabled(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    loginWithGoogle: () => signInWithPopup(auth, googleProvider),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    logout: () => signOut(auth),
    isAdmin: adminEnabled || role === "admin" ||
      user?.email === import.meta.env.VITE_SUPERADMIN_EMAIL ||
      (import.meta.env.VITE_SUPERADMIN_EMAILS || "").split(",").map((item) => item.trim()).includes(user?.email),
    adminEnabled,
  }), [user, loading, role, adminEnabled]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
