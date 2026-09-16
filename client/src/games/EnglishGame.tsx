import { AnimatePresence, motion } from "framer-motion";
import { Eraser, Lightbulb, RotateCcw, Star, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { speak } from "@/lib/speech";

type Word = { en: string; zh: string; icon: string };

/**
 * 50 個入門單字，難度對齊 Raz 分級 aa–D（學前～一年級常見詞），
 * 全部可以配圖，不分主題直接輪流出題。
 */
const WORDS: Word[] = [
  { en: "cat", zh: "貓", icon: "🐱" },
  { en: "dog", zh: "狗", icon: "🐶" },
  { en: "fish", zh: "魚", icon: "🐟" },
  { en: "bird", zh: "鳥", icon: "🐦" },
  { en: "frog", zh: "青蛙", icon: "🐸" },
  { en: "duck", zh: "鴨子", icon: "🦆" },
  { en: "bear", zh: "熊", icon: "🐻" },
  { en: "pig", zh: "豬", icon: "🐷" },
  { en: "cow", zh: "牛", icon: "🐮" },
  { en: "bee", zh: "蜜蜂", icon: "🐝" },
  { en: "hand", zh: "手", icon: "✋" },
  { en: "foot", zh: "腳", icon: "🦶" },
  { en: "eye", zh: "眼睛", icon: "👁️" },
  { en: "nose", zh: "鼻子", icon: "👃" },
  { en: "ear", zh: "耳朵", icon: "👂" },
  { en: "mouth", zh: "嘴巴", icon: "👄" },
  { en: "red", zh: "紅色", icon: "🔴" },
  { en: "blue", zh: "藍色", icon: "🔵" },
  { en: "green", zh: "綠色", icon: "🟢" },
  { en: "pink", zh: "粉紅色", icon: "💗" },
  { en: "brown", zh: "棕色", icon: "🟤" },
  { en: "black", zh: "黑色", icon: "⚫" },
  { en: "apple", zh: "蘋果", icon: "🍎" },
  { en: "banana", zh: "香蕉", icon: "🍌" },
  { en: "bread", zh: "麵包", icon: "🍞" },
  { en: "egg", zh: "蛋", icon: "🥚" },
  { en: "milk", zh: "牛奶", icon: "🥛" },
  { en: "cake", zh: "蛋糕", icon: "🍰" },
  { en: "rice", zh: "米飯", icon: "🍚" },
  { en: "juice", zh: "果汁", icon: "🧃" },
  { en: "book", zh: "書", icon: "📕" },
  { en: "pen", zh: "筆", icon: "🖊️" },
  { en: "bag", zh: "背包", icon: "🎒" },
  { en: "cup", zh: "杯子", icon: "🥤" },
  { en: "box", zh: "盒子", icon: "📦" },
  { en: "ball", zh: "球", icon: "⚽" },
  { en: "car", zh: "汽車", icon: "🚗" },
  { en: "bus", zh: "公車", icon: "🚌" },
  { en: "ship", zh: "船", icon: "🚢" },
  { en: "kite", zh: "風箏", icon: "🪁" },
  { en: "sun", zh: "太陽", icon: "☀️" },
  { en: "moon", zh: "月亮", icon: "🌙" },
  { en: "star", zh: "星星", icon: "⭐" },
  { en: "tree", zh: "樹", icon: "🌳" },
  { en: "flower", zh: "花", icon: "🌼" },
  { en: "rain", zh: "雨", icon: "🌧️" },
  { en: "snow", zh: "雪", icon: "❄️" },
  { en: "cloud", zh: "雲", icon: "☁️" },
  { en: "fire", zh: "火", icon: "🔥" },
  { en: "water", zh: "水", icon: "💧" },
];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

type Letter = { id: string; char: string; used: boolean };

const makeLetters = (word: string): Letter[] =>
  shuffle(word.split("")).map((char, index) => ({ id: `${char}-${index}-${crypto.randomUUID()}`, char, used: false }));

export default function EnglishGame() {
  const [queue, setQueue] = useState<Word[]>(() => shuffle(WORDS));
  const [index, setIndex] = useState(0);
  // 注意：字母盤必須與 queue[0] 同一個詞，先前各自 shuffle 造成第一題圖與字母對不上
  const [letters, setLetters] = useState<Letter[]>(() => makeLetters(queue[0].en));
  const [slots, setSlots] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [score, setScore] = useState(0);

  const word = useMemo(() => queue[index], [queue, index]);

  const loadWord = (list: Word[], position: number) => {
    const next = list[position];
    setIndex(position);
    setLetters(makeLetters(next.en));
    setSlots([]);
    setResult(null);
    setHintCount(0);
  };

  const replayRound = () => {
    const list = shuffle(WORDS);
    setQueue(list);
    setScore(0);
    loadWord(list, 0);
  };

  const tapLetter = (id: string) => {
    if (result === "correct") return;
    const letter = letters.find((item) => item.id === id);
    if (!letter || letter.used) return;
    setLetters((current) => current.map((item) => (item.id === id ? { ...item, used: true } : item)));
    setSlots((current) => [...current, id]);
    setResult(null);
  };

  const pullLetter = (id: string) => {
    if (result === "correct") return;
    setLetters((current) => current.map((item) => (item.id === id ? { ...item, used: false } : item)));
    setSlots((current) => current.filter((item) => item !== id));
    setResult(null);
  };

  const reset = () => {
    setLetters((current) => current.map((item) => ({ ...item, used: false })));
    setSlots([]);
    setResult(null);
  };

  const check = () => {
    const built = slots.map((id) => letters.find((item) => item.id === id)?.char ?? "").join("");
    if (built.length < word.en.length) return;
    if (built === word.en) {
      setResult("correct");
      setScore((current) => current + 1);
    } else {
      setResult("incorrect");
    }
  };

  const goNext = () => {
    if (index + 1 >= queue.length) {
      replayRound();
      return;
    }
    loadWord(queue, index + 1);
  };

  return (
    <div className="game-body">
      <div className="game-progress-strip">
        <div className="progress-track"><span style={{ width: `${(index / queue.length) * 100}%` }} /></div>
        <span><Star size={13} fill="currentColor" /> 第 {index + 1} / {queue.length} 個字 · 拼對 {score}</span>
      </div>

      <motion.article
        className={`task-paper en-paper ${result ? `result-${result}` : ""}`}
        key={`${word.en}-${index}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >

        <div className="en-stage">
          <div className="en-picture" aria-hidden="true">{word.icon}</div>
          <div className="en-hint">
            <p className="en-zh">{word.zh}</p>
            <p className="en-count">{word.en.length} 個字母</p>
            {/* 提示＝朗讀單字，不顯示文字本身 */}
            <button type="button" className="en-tip" onClick={() => { setHintCount((c) => c + 1); speak(word.en, "en"); }}>
              <Lightbulb size={15} /> {hintCount > 0 ? "再聽一次" : "給我提示"}
              <Volume2 size={15} />
            </button>
          </div>
        </div>

        <div className="sentence-zone-label">
          <span>我的拼字軌道</span>
          <button onClick={reset} disabled={slots.length === 0 || result === "correct"}>
            <Eraser size={15} /> 清空
          </button>
        </div>
        <div className={`sentence-zone en-slots ${slots.length === 0 ? "is-empty" : ""}`}>
          {slots.length === 0 ? (
            <span>點下面的字母，把英文單字拼出來！</span>
          ) : (
            slots.map((id) => {
              const letter = letters.find((item) => item.id === id);
              return letter ? (
                <button key={id} type="button" className="selected-word en-slot" onClick={() => pullLetter(id)}>
                  {letter.char}
                </button>
              ) : null;
            })
          )}
        </div>

        <div className="word-bank-label">字母盤</div>
        <div className="word-bank">
          {letters.map((letter) => (
            <button
              key={letter.id}
              type="button"
              disabled={letter.used}
              className={`word-tile en-letter ${letter.used ? "is-selected" : ""}`}
              onClick={() => tapLetter(letter.id)}
            >
              {letter.char}
            </button>
          ))}
        </div>

        <div className="answer-actions">
          <button className="secondary-action" onClick={reset}>
            <RotateCcw size={17} /> 重排
          </button>
          <button className="check-action" onClick={check} disabled={slots.length < word.en.length}>
            檢查拼字
          </button>
        </div>

        <AnimatePresence>
          {result === "correct" && (
            <motion.div className="feedback correct-feedback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <img src="/images/tiantian-success-stars_5462d800.webp" alt="" />
              <div>
                <span>拼對了！{word.en}</span>
                <p>
                  {word.icon} {word.zh} · {word.en}
                </p>
              </div>
              <button onClick={goNext}>下一個 →</button>
            </motion.div>
          )}
          {result === "incorrect" && (
            <motion.div className="feedback incorrect-feedback" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="retry-face">?</div>
              <div>
                <span>再看一下字母順序！</span>
                <p>聽聽看這個字怎麼唸，然後再排一次。</p>
              </div>
              <button onClick={reset}>重新排</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>

      <div className="lesson-footer">
        <button className="nav-question" onClick={() => index > 0 && loadWord(queue, index - 1)} disabled={index === 0}>
          ← 上一個
        </button>
        <span>拼對 <b>{score}</b> 個字</span>
        <button className="nav-question" onClick={goNext}>
          下一個 →
        </button>
      </div>
    </div>
  );
}
