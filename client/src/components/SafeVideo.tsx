import { Maximize, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 只給小朋友看的 YouTube 播放器：
 * - 影片用 YouTube IFrame API 載入，關掉所有會跳去 YouTube 的入口；
 * - iframe 本身 pointer-events: none，點哪裡都不會跳轉、不會推薦別的影片；
 * - 自訂播放／暫停、進度滑軌和全螢幕控制，全螢幕由外框負責，iPad 上也能用。
 * - 播放後控制列會自動消隱，移入、移動指標或鍵盤聚焦時再顯示。
 */

type YTPlayer = {
  playVideo?: () => void;
  pauseVideo?: () => void;
  destroy?: () => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

function loadYouTubeApi(): Promise<any> {
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      if (window.YT?.Player) {
        resolve(window.YT);
        return;
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return apiPromise;
}

type Props = {
  videoId: string;
  title: string;
};

export default function SafeVideo({ videoId, title }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pendingPlayRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    if (!playing || hoveringRef.current) return;
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3200);
  }, [clearHideTimer, playing]);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    let cancelled = false;
    let player: YTPlayer | null = null;
    const host = hostRef.current;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !host) return;
      // YT 會把掛載點換成 iframe，所以每次都塞一個全新的 div。
      const mount = document.createElement("div");
      host.appendChild(mount);
      player = new YT.Player(mount, {
        videoId,
        title,
        playerVars: {
          rel: 0, // 結束不出現推薦影片
          controls: 0, // 關掉 YouTube 自己的整排控制列，畫面只剩影片本身
          fs: 0, // 隱藏 YouTube 的全螢幕鈕，改用我們的
          disablekb: 1, // 停用鍵盤控制，避免誤觸
          playsinline: 1, // iPad 上不強制跳出全螢幕 App 模式
          iv_load_policy: 3, // 不顯示影片內嵌的資訊卡
          modestbranding: 1,
          showinfo: 0,
          cc_load_policy: 0,
          autohide: 1,
        },
        events: {
          onReady: (event: any) => {
            if (cancelled) return;
            playerRef.current = event.target as YTPlayer;
            setReady(true);
            setDuration(Number(event.target?.getDuration?.()) || 0);
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              event.target?.playVideo?.();
            }
          },
          onStateChange: (event: any) => {
            const isPlaying = event.data === 1;
            setPlaying(isPlaying);
            setControlsVisible(true);
            if (event.data === 0) {
              const total = Number(event.target?.getDuration?.()) || 0;
              setDuration(total);
              setCurrentTime(total);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch {
        /* 忽略銷毀時的錯誤 */
      }
      if (host) host.textContent = "";
      playerRef.current = null;
      clearHideTimer();
    };
  }, [clearHideTimer, videoId, title]);

  useEffect(() => {
    if (!started) return;
    const syncProgress = () => {
      const player = playerRef.current;
      const nextDuration = Number(player?.getDuration?.()) || 0;
      const nextTime = Number(player?.getCurrentTime?.()) || 0;
      if (nextDuration > 0) setDuration(nextDuration);
      setCurrentTime(nextTime);
    };
    syncProgress();
    const timer = window.setInterval(syncProgress, playing ? 250 : 800);
    return () => window.clearInterval(timer);
  }, [playing, started]);

  useEffect(() => {
    if (playing) scheduleHide();
    else {
      clearHideTimer();
      setControlsVisible(true);
    }
    return clearHideTimer;
  }, [clearHideTimer, playing, scheduleHide]);

  const play = () => {
    const player = playerRef.current;
    if (ready && typeof player?.playVideo === "function") player.playVideo();
    else pendingPlayRef.current = true;
  };

  const handlePlay = () => {
    setStarted(true);
    setControlsVisible(true);
    play();
  };

  const handleToggle = () => {
    if (playing) {
      const player = playerRef.current;
      if (typeof player?.pauseVideo === "function") player.pauseVideo();
    } else {
      setStarted(true);
      play();
    }
  };

  const handleSeek = (value: number) => {
    const next = Math.max(0, Math.min(value, duration || value));
    setCurrentTime(next);
    const player = playerRef.current;
    if (typeof player?.seekTo === "function") player.seekTo(next, true);
    revealControls();
  };

  const handleFullscreen = () => {
    const box = boxRef.current;
    if (!box) return;
    const request =
      box.requestFullscreen ??
      (box as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void }).webkitRequestFullscreen;
    try {
      request?.call(box);
    } catch {
      /* iPad 舊版不支援時靜靜放棄 */
    }
  };

  const formatTime = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
  };

  return (
    <div className="safe-video-wrap">
      <div
        className="pt-video safe-video"
        ref={boxRef}
        onPointerEnter={() => {
          hoveringRef.current = true;
          clearHideTimer();
          setControlsVisible(true);
        }}
        onPointerMove={revealControls}
        onPointerLeave={() => {
          hoveringRef.current = false;
          scheduleHide();
        }}
        onFocusCapture={revealControls}
        onBlurCapture={scheduleHide}
      >
        <div
          className="safe-video-host"
          ref={hostRef}
          style={started ? undefined : { backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)` }}
        />
        {!started && (
          <button
            type="button"
            className="safe-video-cover"
            onClick={handlePlay}
            aria-label={ready ? "播放影片" : "載入並播放影片"}
          >
            <span className="safe-video-cover-icon">
              <Play size={30} />
            </span>
            <span className="safe-video-cover-text">{ready ? "播放影片" : "載入影片"}</span>
          </button>
        )}
        <div className={`safe-video-controls ${controlsVisible || !started ? "" : "is-hidden"}`}>
          <button type="button" onClick={handleToggle} aria-label={playing ? "暫停影片" : "播放影片"}>
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <span className="safe-video-time" aria-hidden="true">{formatTime(currentTime)}</span>
          <input
            className="safe-video-range"
            type="range"
            min="0"
            max={Math.max(duration, 1)}
            step="0.1"
            value={Math.min(currentTime, Math.max(duration, 1))}
            onChange={(event) => handleSeek(Number(event.target.value))}
            aria-label="影片播放進度"
          />
          <span className="safe-video-time" aria-hidden="true">{formatTime(duration)}</span>
          <button type="button" onClick={handleFullscreen} aria-label="影片全螢幕">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
