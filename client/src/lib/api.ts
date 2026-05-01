/**
 * Centralized API client for the Electron backend.
 * Automatically attaches Firebase Auth ID token to every request.
 *
 * Usage:
 *   import { chatAPI, progressAPI, ttsAPI, certificateAPI } from "@/lib/api";
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ── Token provider ────────────────────────────────────────────────────────────
import { auth } from "@/gcp/firebase";

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

// ── Base fetcher ──────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Chat API ──────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "model";
  message: string;
}

export const chatAPI = {
  /**
   * Send a message to Electron AI.
   */
  send: (
    message: string,
    moduleContext: string,
    history: ChatMessage[] = []
  ) =>
    apiFetch<{ reply: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, moduleContext, history }),
    }),

  /**
   * Fetch chat history for a module.
   */
  history: (moduleContext: string) =>
    apiFetch<{ history: ChatMessage[] }>(
      `/api/chat/history?moduleContext=${encodeURIComponent(moduleContext)}`
    ),
};

// ── Progress API ──────────────────────────────────────────────────────────────
export interface ModuleProgress {
  completed: boolean;
  score: number;
  unlockedAt: string | null;
}

export type ProgressData = Record<string, ModuleProgress>;

export const progressAPI = {
  /**
   * Fetch all module progress.
   */
  get: () => apiFetch<ProgressData>("/api/progress"),

  /**
   * Update progress for a specific module.
   */
  update: (
    moduleId: string,
    data: { completed: boolean; score: number }
  ) =>
    apiFetch<{ success: boolean }>(`/api/progress/${moduleId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── TTS API ───────────────────────────────────────────────────────────────────
export type TtsLanguage = "en-IN" | "hi-IN" | "ta-IN" | "te-IN" | "kn-IN";

export const ttsAPI = {
  /**
   * Convert text to speech. Returns base64 MP3.
   */
  synthesize: (text: string, language: TtsLanguage) =>
    apiFetch<{ audio: string }>("/api/tts", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    }),
};

// ── Certificate API ───────────────────────────────────────────────────────────
export interface CertificateData {
  userName: string;
  issuedAt: string;
  completedModules: Array<{ moduleId: string; score: number }>;
}

export const certificateAPI = {
  /**
   * Issue or retrieve the completion certificate.
   */
  issue: () =>
    apiFetch<CertificateData>("/api/certificate", { method: "POST" }),
};
