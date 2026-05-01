import { dictionaries, type DictKey } from "@/i18n";
import { useProgress } from "./useProgress";

export function useT() {
  const { state } = useProgress();
  const lang = state.lang in dictionaries ? state.lang : "en";
  const dict = dictionaries[lang as keyof typeof dictionaries];
  return (key: DictKey) => dict[key] ?? key;
}