import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase";

export async function uploadProjectImage(uid, file) {
  if (!uid || !file) return "";
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const imageRef = ref(storage, `users/${uid}/projects/${Date.now()}-${safeName}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}
