import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  onExit: () => void;
  children: ReactNode;
};

export default function GameStage({ title, subtitle, icon, accent, onExit, children }: Props) {
  const [isFull, setIsFull] = useState(false);
  const [barHidden, setBarHidden] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      if (event.key === "Escape" && !document.fullscreenElement) onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

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
        <button type="button" className="stage-back" onClick={onExit}>
          <ArrowLeft size={19} /> 回到學習台
        </button>
        <span className="stage-title-mini">
          <span className="stage-icon" aria-hidden="true">
            {icon}
          </span>
          <b>{title}</b>
        </span>
        <button
          type="button"
          className="stage-full"
          onClick={toggleFullscreen}
          aria-label={isFull ? "退出全螢幕" : "全螢幕"}
        >
          {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <div className="stage-scroll" ref={scrollRef}>
        <p className="stage-subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
