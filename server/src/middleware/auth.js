import { admin } from "../config/firebaseAdmin.js";

export async function requireFirebaseUser(req, _res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      const error = new Error("Missing bearer token");
      error.status = 401;
      throw error;
    }
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}

export function requireSuperAdmin(req, _res, next) {
  const admins = (process.env.SUPERADMIN_EMAILS || "").split(",").map((email) => email.trim());
  if (!admins.includes(req.user?.email)) {
    const error = new Error("SuperAdmin access required");
    error.status = 403;
    next(error);
    return;
  }
  next();
}
