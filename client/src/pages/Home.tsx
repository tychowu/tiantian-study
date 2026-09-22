/**
 * 天天的學習台：挑一張星球卡，就會飛進全螢幕的小遊戲。
 * 設計語言沿用「天天的奇想書桌」——米白紙張、深海軍藍、天天橙、膠帶與貼紙。
 */
import GameShelf from "@/components/GameShelf";
import { GripVertical, LockKeyhole, Rocket, Sparkles, UnlockKeyhole } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type FormEvent } from "react";
import GameStage from "@/components/GameStage";
import EnglishGame from "@/games/EnglishGame";
import FestivalGame from "@/games/FestivalGame";
import ClockGame from "@/games/ClockGame";
import LandmarkGame from "@/games/LandmarkGame";
import MathGame from "@/games/MathGame";
import MtrGame from "@/games/MtrGame";
import PeriodicTableGame from "@/games/PeriodicTableGame";
import SentenceGame from "@/games/SentenceGame";
import TimesTableGame from "@/games/TimesTableGame";
import WeatherGame from "@/games/WeatherGame";
import MatterLabGame from "@/games/MatterLabGame";
import RampLabGame from "@/games/RampLabGame";
import HanziGame from "@/games/HanziGame";
import CrystalGame from "@/games/CrystalGame";
import SpeakingGame from "@/games/SpeakingGame";
import { APP_VERSION, APP_VERSION_DATE } from "@/lib/version";
import { getChineseVoiceInfo, onVoicesReady } from "@/lib/speech";

type GameMeta = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  /** 手繪貼紙插畫（透明背景 PNG）；沒有就退回 emoji。 */
  img?: string;
  accent: string;
  stars: string;
  Component?: ComponentType;
  comingSoon?: boolean;
  testOnly?: boolean;
};

const GAMES: GameMeta[] = [
  { id: "crystal", title: "晶體小花園", subtitle: "升溫、降溫、放晶種，種出閃亮的晶簇", icon: "💎", img: "/images/cards/crystal-garden.webp", accent: "#8b68c7", stars: "過飽和・結晶・實物圖鑑", Component: CrystalGame },
  {
    id: "matter-lab",
    title: "物質粒子實驗室",
    subtitle: "加熱、冷卻和追蹤小粒子，看懂固體、液體與氣體",
    icon: "🧪",
    img: "/images/cards/matter-lab.webp",
    accent: "#16A9B6",
    stars: "八關・預測・粒子模型",
    Component: MatterLabGame,
  },
  {
    id: "ramp-lab",
    title: "斜坡實驗室",
    subtitle: "讓兩輛小車一起出發，用公平實驗找出運動規律",
    icon: "🏎️",
    img: "/images/cards/ramp-lab.webp",
    accent: "#F06A3E",
    stars: "九關・運動・控制變量",
    Component: RampLabGame,
    testOnly: true,
  },
  {
    id: "sentence",
    title: "句子魔法工場",
    subtitle: "把中英文詞語變成會說話的完整句子",
    icon: "🪐",
    img: "/images/cards/sentence.webp",
    accent: "#4E93AC",
    stars: "排句子・聽發音",
    Component: SentenceGame,
  },
  {
    id: "math",
    title: "數字宇宙站",
    subtitle: "駕駛小火箭，穿越加減乘三座數字星球",
    icon: "🔢",
    img: "/images/cards/math-v2.webp",
    accent: "#7FA65C",
    stars: "三種難度闖關",
    Component: MathGame,
  },
  {
    id: "times-table",
    title: "九九糖果陣",
    subtitle: "用彩色點陣看懂乘法，把中文口訣唱成兒歌",
    icon: "✖️",
    img: "/images/cards/times-table-v3.webp",
    accent: "#EF8C2F",
    stars: "點陣・口訣・逆向題",
    Component: TimesTableGame,
  },
  {
    id: "elements",
    title: "元素偵探所",
    subtitle: "打開 118 個元素檔案，發現世界由什麼組成",
    icon: "⚛️",
    img: "/images/cards/periodic.png",
    accent: "#FF6B3D",
    stars: "分類・發音・小知識",
    Component: PeriodicTableGame,
  },
  {
    id: "clock",
    title: "時鐘小工程師",
    subtitle: "認識長短針、親手撥鐘，學懂點、字和英文時間",
    icon: "⏰",
    img: "/images/cards/clock-v3.webp",
    accent: "#E9A526",
    stars: "五關學會看時間",
    Component: ClockGame,
  },
  {
    id: "english",
    title: "單字拼拼島",
    subtitle: "看圖、聽聲音，把 50 個英文單字拼回來",
    icon: "🔤",
    img: "/images/cards/english.png",
    accent: "#6C7FD1",
    stars: "看圖・聽音・拼字",
    Component: EnglishGame,
  },
  {
    id: "festival",
    title: "節日時光機",
    subtitle: "沿着一年四季旅行，認識日期、習俗與祝福語",
    icon: "🎉",
    img: "/images/cards/festival.png",
    accent: "#E0524E",
    stars: "四關收集節日郵戳",
    Component: FestivalGame,
  },
  {
    id: "landmark",
    title: "名勝環遊號",
    subtitle: "搭上環遊列車，尋訪內地與香港的名勝博物館",
    icon: "🗺️",
    img: "/images/cards/landmark-v2.webp",
    accent: "#B5712F",
    stars: "照片圖鑑・線索猜猜看",
    Component: LandmarkGame,
  },
  {
    id: "mtr",
    title: "港鐵小車長",
    subtitle: "沿着全港鐵路出發，認站名、找轉車線、猜下一站",
    icon: "🚆",
    img: "/images/cards/mtr.png",
    accent: "#00888A",
    stars: "真實路線圖互動",
    Component: MtrGame,
  },
  {
    id: "weather",
    title: "天氣觀察站",
    subtitle: "讀懂天文台符號與警告，做會保護自己的小站長",
    icon: "🌦️",
    img: "/images/cards/weather.png",
    accent: "#3E82C4",
    stars: "看符號・學安全",
    Component: WeatherGame,
  },
  {
    id: "hanzi",
    title: "漢字筆順屋",
    subtitle: "四冊八十個繁體字，從基本筆畫到部件組合，跟着故事練寫字",
    icon: "✍️",
    img: "/images/cards/hanzi-v2.webp",
    accent: "#D05B73",
    stars: "看筆順・沿線寫・自己寫",
    Component: HanziGame,
  },
  {
    id: "speaking",
    title: "故事表達家",
    subtitle: "看圖找線索，把人物、事情和感受組成自己的故事",
    icon: "💬",
    img: "/images/cards/speaking-v3.webp",
    accent: "#4AA58B",
    stars: "觀察・組織・說故事",
    Component: SpeakingGame,
  },
];

const DEFAULT_GAMES = [...GAMES.filter((game) => !game.testOnly), ...GAMES.filter((game) => game.testOnly)];
const GAME_ORDER_KEY = "tiantian-game-order-v1";
const TEST_UNLOCK_KEY = "tiantian-science-test-unlocked";
const TEST_PASSWORD = "wd12345";

function loadGameOrder() {
  if (typeof window === "undefined") return DEFAULT_GAMES;
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(GAME_ORDER_KEY) ?? "[]");
    const ids = Array.isArray(saved) ? Array.from(new Set(saved.filter((id): id is string => typeof id === "string"))) : [];
    const ordered = ids.map((id) => GAMES.find((game) => game.id === id)).filter((game): game is GameMeta => Boolean(game));
    const missing = DEFAULT_GAMES.filter((game) => !ordered.some((item) => item.id === game.id));
    return [...ordered, ...missing];
  } catch {
    return DEFAULT_GAMES;
  }
}

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = GAMES.find((item) => item.id === activeId);
  const [voice, setVoice] = useState<ReturnType<typeof getChineseVoiceInfo>>(null);
  const [games] = useState<GameMeta[]>(loadGameOrder);
  const [showTestUnlock, setShowTestUnlock] = useState(false);
  const [testPassword, setTestPassword] = useState("");
  const [testError, setTestError] = useState(false);
  const [testUnlocked, setTestUnlocked] = useState(() => typeof window !== "undefined" && window.sessionStorage.getItem(TEST_UNLOCK_KEY) === "1");
  const passwordRef = useRef<HTMLInputElement>(null);

  // 語音清單是非同步載入的（iOS 尤其慢），載好後才知道這台裝置有沒有廣東話。
  useEffect(() => onVoicesReady((ready) => setVoice(ready ? getChineseVoiceInfo() : null)), []);

  const openTestUnlock = () => {
    setShowTestUnlock(true);
    setTestError(false);
    window.setTimeout(() => passwordRef.current?.focus(), 0);
  };

  const submitTestPassword = (event: FormEvent) => {
    event.preventDefault();
    if (testPassword !== TEST_PASSWORD) {
      setTestError(true);
      return;
    }
    window.sessionStorage.setItem(TEST_UNLOCK_KEY, "1");
    setTestUnlocked(true);
    setShowTestUnlock(false);
    setTestPassword("");
    setTestError(false);
  };

  return (
    <main className="learning-shell">
      <div className="desk-grain" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <img src="/images/tiantian-pencil-rocket-logo_94715784.webp" alt="" />
          </span>
          <span className="brand-wordmark">
            <b>天天</b>
            <i>的學習台</i>
          </span>
        </div>
        <div className="topbar-actions">
          <span className="app-version" title={`更新日期 ${APP_VERSION_DATE}`}>
            v{APP_VERSION}
          </span>
        </div>
      </header>

      <section className="hero-strip">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> 今天想先玩哪一個？</span>
          <h1>
            把卡片翻開，<br />
            <span>就開始一場小冒險。</span>
          </h1>
          <p>{GAMES.length} 個學習星球正在集合，點一張就會飛進全螢幕的小遊戲。</p>
        </div>
        <img className="hero-art" src="/images/tiantian-hero-learning-v2.jpg" alt="書本、地球、星球與鉛筆火箭組成的繽紛學習冒險插畫" />
      </section>

      <div className="desk-wrap">
        <div className="desk-head">
          <h2><Rocket size={20} /> 學習星球</h2>
          <div className="desk-actions">
            <span className="drag-tip"><GripVertical size={15} /> 拖曳卡片可自由排列</span>
            <button type="button" className={`test-entry ${testUnlocked ? "is-unlocked" : ""}`} onClick={() => {
              if (testUnlocked) {
                window.sessionStorage.removeItem(TEST_UNLOCK_KEY);
                setTestUnlocked(false);
              } else {
                openTestUnlock();
              }
            }}>
              {testUnlocked ? <UnlockKeyhole size={15} /> : <LockKeyhole size={15} />}
              {testUnlocked ? "測試模式已開啟" : "測試入口"}
            </button>
          </div>
        </div>

        {showTestUnlock && !testUnlocked && (
          <form className={`test-unlock ${testError ? "has-error" : ""}`} onSubmit={submitTestPassword}>
            <div><LockKeyhole size={20} /><span><b>新遊戲測試入口</b><i>輸入測試密碼後，本次瀏覽期間可以開啟。</i></span></div>
            <input ref={passwordRef} type="password" value={testPassword} onChange={(event) => { setTestPassword(event.target.value); setTestError(false); }} placeholder="輸入測試密碼" autoComplete="off" aria-label="測試密碼" />
            <button type="submit">解鎖測試</button>
            <button type="button" className="test-cancel" onClick={() => { setShowTestUnlock(false); setTestPassword(""); setTestError(false); }}>取消</button>
            {testError && <p>密碼不正確，請再試一次。</p>}
          </form>
        )}

        <GameShelf initialGames={games} testUnlocked={testUnlocked} onOpen={(id) => {
          const game = GAMES.find(g => g.id === id);
          if (game?.testOnly && !testUnlocked) openTestUnlock();
          else setActiveId(id);
        }} />

        {voice && !voice.cantonese && (
          <div className="voice-reminder">
            <span>發音小提醒</span>
            <p>
              這台裝置還沒安裝廣東話語音，目前會用「{voice.name}」發音。
              iPhone / iPad 請到「設定 → 輔助使用 → 朗讀內容 → 聲音 → 中文」下載「善怡」（粵語），
              裝好後重新開啟就會是廣東話囉。
            </p>
          </div>
        )}

        <div className="tiny-reminder desk-reminder">
          <span>小提醒</span>
          <p>慢慢玩沒關係，每一個嘗試都很棒。按左上角的「Back」返回上一層；在遊戲最外層再按一次，就回到學習台。</p>
        </div>
      </div>

      {active && (
        <GameStage
          title={active.title}
          subtitle={active.subtitle}
          icon={active.icon}
          accent={active.accent}
          onExit={() => setActiveId(null)}
        >
          {active.Component && <active.Component />}
        </GameStage>
      )}
    </main>
  );
}
