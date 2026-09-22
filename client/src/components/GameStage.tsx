import { ArrowLeft, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { createContext, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GameBackContext, type BackEntry } from "@/lib/gameBack";
import { stopSpeaking } from "@/lib/speech";
import { isSoundOn, setSoundOn } from "@/lib/sound";

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  onExit: () => void;
  children: ReactNode;
};

export const StageLanguageContext = createContext<(language: "zh" | "en") => void>(() => {});

export default function GameStage({ accent, onExit, children }: Props) {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const english = language === "en";
  const [isFull, setIsFull] = useState(false);
  const [barHidden, setBarHidden] = useState(false);
  const [soundOn, setSoundOnState] = useState(isSoundOn);
  const scrollRef = useRef<HTMLDivElement>(null);
  const backEntries = useRef(new Set<BackEntry>());
  const registerBack = useCallback((entry: BackEntry) => {
    backEntries.current.add(entry);
    return () => { backEntries.current.delete(entry); };
  }, []);
  const goBack = useCallback(() => {
    stopSpeaking();
    const entry = Array.from(backEntries.current).sort((a, b) => b.priority - a.priority)[0];
    if (entry) entry.run(); else onExit();
    scrollRef.current?.scrollTo({ top: 0 });
    setBarHidden(false);
  }, [onExit]);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack]);

  // 往下滑就把左上角按鈕收起來；滑回頂端再出現。
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    let last = 0;
    const onScroll = () => {
      const top = node.scrollTop;
      setBarHidden(top > 90 && top > last);
      last = top;
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  // 元素卡片等彈層打開時，按鈕也跟著藏起來，不擋畫面。
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setBarHidden(Boolean(document.querySelector(".pt-detail")));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stage" style={{ "--accent": accent } as CSSProperties}>
      <div className="desk-grain" aria-hidden="true" />

      <div className={`stage-fab ${barHidden ? "is-hidden" : ""}`}>
        <button type="button" className="stage-back" onClick={goBack}>
          <ArrowLeft size={19} /> Back
        </button>
        <span className="stage-corner-actions">
          <button
            type="button"
            className={`stage-full stage-sound ${soundOn ? "" : "is-off"}`}
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              setSoundOnState(next);
            }}
            aria-label={english ? soundOn ? "Turn sound off" : "Turn sound on" : soundOn ? "關閉音效" : "開啟音效"}
            title={english ? soundOn ? "Turn sound off" : "Turn sound on" : soundOn ? "關閉音效" : "開啟音效"}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button type="button" className="stage-full" onClick={toggleFullscreen} aria-label={english ? isFull ? "Exit full screen" : "Full screen" : isFull ? "退出全螢幕" : "全螢幕"}>
            {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </span>
      </div>

      <div className="stage-scroll" ref={scrollRef}>
        <GameBackContext.Provider value={registerBack}><StageLanguageContext.Provider value={setLanguage}>{children}</StageLanguageContext.Provider></GameBackContext.Provider>
      </div>
    </div>
  );
}
