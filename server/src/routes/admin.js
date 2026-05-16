import { Router } from "express";
import { requireFirebaseUser, requireSuperAdmin } from "../middleware/auth.js";
import { db, FieldValue } from "../config/firebaseAdmin.js";

const router = Router();
const users = db.collection("users");
const portfolios = db.collection("portfolios");
const usernames = db.collection("usernames");

router.use(requireFirebaseUser, requireSuperAdmin);

router.get("/users", async (_req, res, next) => {
  try {
    const snapshot = await users.limit(100).get();
    res.json(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  } catch (error) {
    next(error);
  }
});

router.get("/analytics", async (_req, res, next) => {
  try {
    const [userSnapshot, portfolioSnapshot] = await Promise.all([
      users.count().get(),
      portfolios.count().get(),
    ]);
    res.json({
      users: userSnapshot.data().count,
      portfolios: portfolioSnapshot.data().count,
      templates: 3,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:uid", async (req, res, next) => {
  try {
    await users.doc(req.params.uid).set({
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    res.json({ uid: req.params.uid, updates: req.body, status: "updated" });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:uid", async (req, res, next) => {
  try {
    const portfolioSnapshot = await portfolios.doc(req.params.uid).get();
    const username = portfolioSnapshot.exists ? portfolioSnapshot.data().username : null;
    const batch = db.batch();
    batch.delete(users.doc(req.params.uid));
    batch.delete(portfolios.doc(req.params.uid));
    if (username) batch.delete(usernames.doc(username));
    await batch.commit();
    res.json({ uid: req.params.uid, status: "deleted" });
  } catch (error) {
    next(error);
  }
});

router.post("/reserved-usernames", async (req, res, next) => {
  try {
    const username = req.body.username;
    await usernames.doc(username).set({
      username,
      reserved: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    res.status(201).json({ username, reserved: true });
  } catch (error) {
    next(error);
  }
});

export default router;
