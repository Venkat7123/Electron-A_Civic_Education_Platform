import { en } from "./en";
import { hi } from "./hi";
import { ta } from "./ta";

export type Lang = "en" | "hi" | "ta" | "te" | "kn";
export const SUPPORTED: { code: Lang; label: string; native: string; ready: boolean }[] = [
  { code: "en", label: "English", native: "English", ready: true },
  { code: "ta", label: "Tamil", native: "தமிழ்", ready: true },
  { code: "hi", label: "Hindi", native: "हिंदी", ready: false },
  { code: "te", label: "Telugu", native: "తెలుగు", ready: false },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", ready: false },
];

export const dictionaries = { en, hi, ta } as const;
export type DictKey = keyof typeof en;