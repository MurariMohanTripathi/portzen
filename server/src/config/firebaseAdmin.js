import admin from "firebase-admin";

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  }

  return admin.credential.applicationDefault();
}

if (!admin.apps.length) {
  admin.initializeApp(
    process.env.FUNCTIONS_EMULATOR || process.env.K_SERVICE
      ? undefined
      : { credential: getCredential() },
  );
}

export { admin };
export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
