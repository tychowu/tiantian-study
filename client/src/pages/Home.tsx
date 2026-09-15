/**
 * 天天的學習台：挑一張星球卡，就會飛進全螢幕的小遊戲。
 * 設計語言沿用「天天的奇想書桌」——米白紙張、深海軍藍、天天橙、膠帶與貼紙。
 */
import { motion } from "framer-motion";
import { Rocket, Sparkles, Star } from "lucide-react";
import { useState, type ComponentType, type CSSProperties } from "react";
import GameStage from "@/components/GameStage";
import EnglishGame from "@/games/EnglishGame";
import FestivalGame from "@/games/FestivalGame";
import LandmarkGame from "@/games/LandmarkGame";
import MathGame from "@/games/MathGame";
import MtrGame from "@/games/MtrGame";
import PeriodicTableGame from "@/games/PeriodicTableGame";
import SentenceGame from "@/games/SentenceGame";
import WeatherGame from "@/games/WeatherGame";

type GameMeta = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  /** 手繪貼紙插畫（透明背景 PNG）；沒有就退回 emoji。 */
  img?: string;
  accent: string;
  badge?: string;
  stars: string;
  Component: ComponentType;
};

const GAMES: GameMeta[] = [
  {
    id: "sentence",
    title: "句子星球",
    subtitle: "打亂詞語・排出完整的句子",
    icon: "🪐",
    img: "/images/cards/sentence.png",
    accent: "#4E93AC",
    badge: "50 題",
    stars: "中英混排",
    Component: SentenceGame,
  },
  {
    id: "elements",
    title: "元素週期表",
    subtitle: "118 個元素・中英雙語小知識",
    icon: "⚛️",
    img: "/images/cards/periodic.png",
    accent: "#FF6B3D",
    badge: "NEW",
    stars: "點字看翻譯",
    Component: PeriodicTableGame,
  },
  {
    id: "math",
    title: "數字探險",
    subtitle: "衛星・行星・恆星，三種難度闖關",
    icon: "🔢",
    img: "/images/cards/math.png",
    accent: "#7FA65C",
    badge: "NEW",
    stars: "加減乘一站學會",
    Component: MathGame,
  },
  {
    id: "english",
    title: "英文單字",
    subtitle: "看圖拼字・50 個入門單字",
    icon: "🔤",
    img: "/images/cards/english.png",
    accent: "#6C7FD1",
    badge: "NEW",
    stars: "聽發音拼出它",
    Component: EnglishGame,
  },
  {
    id: "festival",
    title: "節日派對",
    subtitle: "翻開卡牌・配對中西節日",
    icon: "🎉",
    img: "/images/cards/festival.png",
    accent: "#E0524E",
    badge: "NEW",
    stars: "翻牌配對",
    Component: FestivalGame,
  },
  {
    id: "landmark",
    title: "名勝探險",
    subtitle: "中國與香港的名勝・博物館",
    icon: "🗺️",
    img: "/images/cards/landmark.png",
    accent: "#B5712F",
    badge: "NEW",
    stars: "圖鑑＋小測驗",
    Component: LandmarkGame,
  },
  {
    id: "mtr",
    title: "港鐵小車長",
    subtitle: "四條港鐵綫・學站名開火車",
    icon: "🚆",
    img: "/images/cards/mtr.png",
    accent: "#00888A",
    badge: "NEW",
    stars: "點站名聽發音",
    Component: MtrGame,
  },
  {
    id: "weather",
    title: "天氣小站長",
    subtitle: "天文台天氣符號・警告信號",
    icon: "🌦️",
    img: "/images/cards/weather.png",
    accent: "#3E82C4",
    badge: "NEW",
    stars: "認符號學安全",
    Component: WeatherGame,
  },
];

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = GAMES.find((item) => item.id === activeId);

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
          <span className="desk-star">
            <Star size={14} fill="currentColor" /> 今天的學習護照
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
          <p>八顆學習星球已經亮起來了，點一張就會飛進全螢幕的小遊戲。</p>
        </div>
        <img className="hero-art" src="/images/tiantian-hero-desk_71c399ad.webp" alt="紙張、詞語卡與鉛筆火箭組成的學習書桌插畫" />
      </section>

      <div className="desk-wrap">
        <div className="desk-head">
          <h2><Rocket size={20} /> 學習星球</h2>
          <span>已完成 0 / 8 顆</span>
        </div>

        <div className="game-grid">
          {GAMES.map((game, index) => (
            <motion.button
              key={game.id}
              type="button"
              className="game-card"
              style={{ "--accent": game.accent } as CSSProperties}
              onClick={() => setActiveId(game.id)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -5, rotate: -0.6 }}
            >
              <span className="paper-tape tape-left" aria-hidden="true" />
              <span className="paper-tape tape-right" aria-hidden="true" />
              {game.badge && <span className="game-badge">{game.badge}</span>}
              <span className="game-icon" aria-hidden="true">
                {game.img ? <img src={game.img} alt="" loading="lazy" /> : game.icon}
              </span>
              <b className="game-title">{game.title}</b>
              <span className="game-sub">{game.subtitle}</span>
              <span className="game-foot">
                <span className="game-stars"><Star size={12} fill="currentColor" /> {game.stars}</span>
                <span className="game-go">開始 →</span>
              </span>
            </motion.button>
          ))}
        </div>

        <div className="tiny-reminder desk-reminder">
          <span>小提醒</span>
          <p>慢慢玩沒關係，每一個嘗試都很棒。想換遊戲，按左上角的「回到學習台」就可以了。</p>
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
          <active.Component />
        </GameStage>
      )}
    </main>
  );
}
