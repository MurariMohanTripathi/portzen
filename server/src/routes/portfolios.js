import { Router } from "express";
import { requireFirebaseUser } from "../middleware/auth.js";
import { db, FieldValue } from "../config/firebaseAdmin.js";

const router = Router();
const reservedUsernames = new Set(["admin", "api", "support", "login", "signup"]);
const portfolios = db.collection("portfolios");
const usernames = db.collection("usernames");
const users = db.collection("users");

function normalizeSnapshot(snapshot) {
  return snapshot.exists ? { uid: snapshot.id, ...snapshot.data() } : null;
}

router.get("/me", requireFirebaseUser, async (req, res, next) => {
  try {
    const snapshot = await portfolios.doc(req.user.uid).get();
    res.json(normalizeSnapshot(snapshot) || { uid: req.user.uid });
  } catch (error) {
    next(error);
  }
});

router.get("/availability/:username", async (req, res, next) => {
  try {
    const snapshot = await usernames.doc(req.params.username).get();
    const username = snapshot.exists ? snapshot.data() : null;
    const ownerUid = username?.uid;
    res.json({ available: !username || (!username.reserved && ownerUid === req.query.currentUid) });
  } catch (error) {
    next(error);
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const snapshot = await portfolios.where("username", "==", req.params.username).limit(1).get();
    if (snapshot.empty) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }
    const item = snapshot.docs[0];
    res.json({ uid: item.id, ...item.data() });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireFirebaseUser, async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const portfolio = req.body || {};
    const now = FieldValue.serverTimestamp();
    const previous = await portfolios.doc(uid).get();
    const previousUsername = previous.exists ? previous.data().username : null;
    const nextUsername = portfolio.username || "";
    const batch = db.batch();

    if (nextUsername) {
      if (reservedUsernames.has(nextUsername)) {
        res.status(400).json({ message: "This username is reserved." });
        return;
      }
      const usernameRef = usernames.doc(nextUsername);
      const usernameSnapshot = await usernameRef.get();
      if (usernameSnapshot.exists && usernameSnapshot.data().uid !== uid) {
        res.status(409).json({ message: "Username is already taken" });
        return;
      }
      batch.set(usernameRef, { uid, username: nextUsername, updatedAt: now }, { merge: true });
    }

    if (previousUsername && previousUsername !== nextUsername) {
      batch.delete(usernames.doc(previousUsername));
    }

    const payload = {
      ...portfolio,
      uid,
      username: nextUsername,
      published: Boolean(nextUsername),
      email: portfolio.email || req.user.email || "",
      updatedAt: now,
      createdAt: previous.exists ? previous.data().createdAt || now : now,
    };

    batch.set(portfolios.doc(uid), payload, { merge: true });
    batch.set(users.doc(uid), {
      uid,
      email: payload.email,
      username: nextUsername,
      displayName: portfolio.displayName || req.user.name || "",
      updatedAt: now,
    }, { merge: true });

    await batch.commit();
    res.json({ ...portfolio, uid, email: payload.email });
  } catch (error) {
    next(error);
  }
});

router.post("/:uid/analytics/view", async (req, res, next) => {
  try {
    await portfolios.doc(req.params.uid).set({
      analytics: { views: FieldValue.increment(1) },
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    res.json({ uid: req.params.uid, tracked: true });
  } catch (error) {
    next(error);
  }
});

export default router;
