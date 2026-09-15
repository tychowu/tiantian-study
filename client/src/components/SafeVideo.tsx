import { Maximize, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * 只給小朋友看的 YouTube 播放器：
 * - 影片用 YouTube IFrame API 載入，關掉所有會跳去 YouTube 的入口；
 * - iframe 本身 pointer-events: none，點哪裡都不會跳轉、不會推薦別的影片；
 * - 只提供「播放／暫停」和「全螢幕」兩顆按鈕，全螢幕由外框負責，iPad 上也能用。
 */

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
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
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

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
        },
        events: {
          onStateChange: (event: any) => setPlaying(event.data === 1),
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* 忽略銷毀時的錯誤 */
      }
      if (host) host.textContent = "";
      playerRef.current = null;
    };
  }, [videoId, title]);

  const handlePlay = () => {
    setStarted(true);
    playerRef.current?.playVideo();
  };

  const handleToggle = () => {
    if (playing) {
      playerRef.current?.pauseVideo();
    } else {
      setStarted(true);
      playerRef.current?.playVideo();
    }
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

  return (
    <div className="safe-video-wrap">
      <div className="pt-video safe-video" ref={boxRef}>
        <div
          className="safe-video-host"
          ref={hostRef}
          style={started ? undefined : { backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)` }}
        />
        {!playing && (
          <button
            type="button"
            className="safe-video-cover"
            onClick={handlePlay}
            aria-label={started ? "繼續播放影片" : "播放影片"}
          >
            <span className="safe-video-cover-icon">
              <Play size={30} />
            </span>
            <span className="safe-video-cover-text">{started ? "繼續播放" : "播放影片"}</span>
          </button>
        )}
        <div className="safe-video-controls">
          <button type="button" onClick={handleToggle} aria-label={playing ? "暫停影片" : "播放影片"}>
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button type="button" onClick={handleFullscreen} aria-label="影片全螢幕">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
