import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { ProgressState } from "@/lib/storage";
import { DEFAULT } from "@/lib/storage";

export async function syncUserProgress(userId: string, state: ProgressState): Promise<void> {
  const docRef = doc(db, "users", userId, "data", "progress");
  await setDoc(docRef, state, { merge: true });
}

export async function fetchUserProgress(userId: string): Promise<ProgressState | null> {
  const docRef = doc(db, "users", userId, "data", "progress");
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  // Deep merge: ensure modules with steps arrays are properly reconstructed
  const modules = { ...DEFAULT.modules };
  for (const k of [1, 2, 3, 4] as const) {
    const saved = data.modules?.[k];
    if (saved) {
      modules[k] = {
        progress: saved.progress ?? 0,
        completed: saved.completed ?? false,
        steps: Array.isArray(saved.steps) ? saved.steps : DEFAULT.modules[k].steps,
      };
    }
  }

  return {
    ...DEFAULT,
    ...data,
    modules,
  } as ProgressState;
}

export async function logChatMessage(userId: string, moduleKey: string, msg: { from: string; text: string }) {
  const chatsRef = collection(db, "users", userId, "chats", moduleKey, "messages");
  await addDoc(chatsRef, {
    ...msg,
    timestamp: serverTimestamp(),
  });
}