import { useEffect, useRef, useState } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/hooks/useProgress";
import { useT } from "@/hooks/useT";
import { ElectronAvatar } from "./ElectronAvatar";
import { faqAnswer } from "@/lib/faq";
import { chatAPI, type ChatMessage } from "@/lib/api";

export function ChatSidebar({ open, onClose, moduleKey, contextLabel }: { open: boolean; onClose: () => void; moduleKey: string; contextLabel: string }) {
  const t = useT();
  const { state, pushChat } = useProgress();
  const messages = state.chat[moduleKey] ?? [];
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      pushChat(moduleKey, { from: "bot", text: `Hi! I'm Electron. How can I help you with "${contextLabel}"?` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey]);

  useEffect(() => { scroll.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages.length, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    pushChat(moduleKey, { from: "user", text });
    setInput("");
    setTyping(true);

    try {
      // Build history from current messages for context
      const history: ChatMessage[] = messages
        .slice(-10) // last 10 messages for context
        .map((m) => ({ role: m.from === "user" ? "user" : "model", message: m.text }));

      const { reply } = await chatAPI.send(text, moduleKey, history);
      pushChat(moduleKey, { from: "bot", text: reply });
    } catch {
      // Fallback to local FAQ if API is unavailable
      const fallback = faqAnswer(text, moduleKey);
      pushChat(moduleKey, { from: "bot", text: fallback });
    } finally {
      setTyping(false);
    }
  };

  const suggestions = [
    "What is an election?",
    "How does a manifesto work?",
    "What is the model code of conduct?",
  ];

  return (
    <aside
      className={`fixed right-0 top-0 z-[60] flex h-screen w-[340px] flex-col border-l bg-card shadow-card transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      aria-hidden={!open}
    >
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("chatTitle")}
          </div>
          <p className="text-xs text-muted-foreground">Module: {contextLabel}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close chat"><X className="h-4 w-4" /></Button>
      </header>

      <div ref={scroll} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "items-end gap-2"}`}>
            {m.from === "bot" && <ElectronAvatar size={28} />}
            <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <ElectronAvatar size={28} />
            <div className="rounded-2xl bg-secondary px-3 py-2 text-xs text-muted-foreground">{t("typing")}</div>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              {s}
            </button>
          ))}
        </div>
      </div>

      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => { e.preventDefault(); send(input); }}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("chatHint")} />
        <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
      </form>
    </aside>
  );
}