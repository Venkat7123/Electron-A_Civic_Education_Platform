import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Bot, Volume2, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRANSCRIPTS_EN, TRANSCRIPTS_TA } from "@/lib/transcripts";
import { motion } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";

export function VoicePanel({ moduleId, step }: { moduleId: number; step: number }) {
  const [playing, setPlaying] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { state } = useProgress();
  const lang = state.lang === "ta" ? "ta" : "en";

  const transcripts = lang === "ta" ? TRANSCRIPTS_TA : TRANSCRIPTS_EN;
  const text = transcripts[`${moduleId}-${step}`] || "";

  useEffect(() => {
    synth.cancel();
    setPlaying(false);

    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    
    const setVoice = () => {
      const voices = synth.getVoices();
      let preferred;
      if (lang === "ta") {
        preferred = voices.find(v => v.name.includes("ta-IN-Wavenet-D")) || voices.find(v => v.name.includes("Tamil")) || voices.find(v => v.lang.includes("ta-IN")) || voices.find(v => v.lang.includes("ta"));
      } else {
        preferred = voices.find(v => v.lang.includes("en-IN")) || voices.find(v => v.lang.includes("en"));
      }
      if (preferred) u.voice = preferred;
    };
    
    if (synth.getVoices().length > 0) setVoice();
    else synth.onvoiceschanged = setVoice;

    u.onstart = () => setPlaying(true);
    u.onresume = () => setPlaying(true);
    u.onpause = () => setPlaying(false);
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);

    utteranceRef.current = u;

    const timer = setTimeout(() => {
      synth.speak(u);
    }, 300);

    return () => {
      clearTimeout(timer);
      synth.cancel();
    };
  }, [moduleId, step, text, lang, synth]);

  const togglePlay = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
    } else if (synth.paused) {
      synth.resume();
    } else if (utteranceRef.current) {
      synth.speak(utteranceRef.current);
    }
  };

  const stop = () => {
    synth.cancel();
    setPlaying(false);
  };

  if (!text) return null;

  return (
    <motion.aside 
      drag 
      dragMomentum={false}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-6 bottom-6 z-40 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md cursor-move"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-violet-100 bg-violet-50/50 px-4 py-3">
        <GripHorizontal className="h-4 w-4 text-violet-300 mr-1 opacity-50" />
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-200 text-violet-700 shadow-sm">
          <Bot className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-violet-800">Gemini Guide</h3>
        </div>
        {playing && <Volume2 className="h-4 w-4 animate-pulse text-violet-500" />}
      </div>

      {/* Transcript text (Side panel above the voice controls) */}
      <div className="max-h-48 overflow-y-auto p-4">
        <p className="text-[13px] leading-relaxed text-slate-700 font-medium">
          {text}
        </p>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center gap-3 border-t bg-slate-50/50 p-3">
        <Button 
          size="icon" 
          variant={playing ? "default" : "outline"} 
          className={playing ? "bg-violet-600 hover:bg-violet-700 shadow-md" : "border-slate-300 hover:bg-slate-100"} 
          onClick={togglePlay}
          title={playing ? "Pause" : "Play"}
          aria-label={playing ? "Pause voice guide" : "Play voice guide"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="border-slate-300 hover:bg-slate-100 text-slate-600" 
          onClick={stop}
          title="Stop"
          aria-label="Stop voice guide"
        >
          <Square className="h-4 w-4 fill-current" />
        </Button>
      </div>
    </motion.aside>
  );
}
