import { motion } from "framer-motion";
import HanziWriter from "hanzi-writer";
import { Check, ChevronLeft, ChevronRight, Eye, PencilLine, Play, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { EXTRA_HANZI, HANZI_BOOKS } from "@/data/hanziBooks";

type PracticeMode = "watch" | "trace" | "write";
type HanziCard = {
  char: string;
  meaning: string;
  english: string;
  strokes: number;
  group: string;
  story: string;
  watch: string;
  guide: "roads" | "center" | "window" | "mountain" | "tree" | "balance" | "open" | "generic";
};

const CHARACTERS: HanziCard[] = [
  { char: "一", meaning: "一", english: "one", strokes: 1, group: "數字", story: "像一條平平的小橋，從左走到右。", watch: "橫畫要平穩，不要碰到田字格邊線。", guide: "roads" },
  { char: "二", meaning: "二", english: "two", strokes: 2, group: "數字", story: "兩條小橋排好隊：上短，下長。", watch: "兩橫之間留一口舒服的空氣。", guide: "roads" },
  { char: "三", meaning: "三", english: "three", strokes: 3, group: "數字", story: "三兄弟排隊：上短、中短、下最長。", watch: "三層間距要平均，像整齊的樓層。", guide: "roads" },
  { char: "四", meaning: "四", english: "four", strokes: 5, group: "數字", story: "先蓋小房子，再把兩個小朋友安放進去。", watch: "外框要留空間，最後一橫把門關好。", guide: "window" },
  { char: "五", meaning: "五", english: "five", strokes: 4, group: "數字", story: "上下一起托住中間彎彎的通道。", watch: "上橫較短，下橫較長，重心站穩。", guide: "balance" },
  { char: "六", meaning: "六", english: "six", strokes: 4, group: "數字", story: "小帽子下面，兩隻腳向左右打開。", watch: "點在中線，撇和點不要擠在一起。", guide: "open" },
  { char: "七", meaning: "七", english: "seven", strokes: 2, group: "數字", story: "先鋪橫路，再用彎鉤穿過它。", watch: "交叉點靠近中央，豎彎鉤要有轉彎。", guide: "center" },
  { char: "八", meaning: "八", english: "eight", strokes: 2, group: "數字", story: "兩隻腳向外走，越走越開。", watch: "先撇後捺，左右舒展但不碰邊。", guide: "open" },
  { char: "九", meaning: "九", english: "nine", strokes: 2, group: "數字", story: "先寫小撇，再走一條會轉彎的路。", watch: "橫折彎鉤是一筆，不可中途抬手。", guide: "balance" },
  { char: "十", meaning: "十", english: "ten", strokes: 2, group: "數字", story: "橫是扁擔，豎是柱子，在正中央相遇。", watch: "交叉點放在田字格中心。", guide: "center" },
  { char: "日", meaning: "太陽／日子", english: "sun / day", strokes: 4, group: "自然", story: "像一扇高高的窗，太陽光住在裡面。", watch: "寫成高瘦的長方形，不要變成胖胖的「口」。", guide: "window" },
  { char: "月", meaning: "月亮", english: "moon", strokes: 4, group: "自然", story: "彎彎月亮有一條長背和兩層月光。", watch: "外框高而窄，裡面兩橫不要碰右邊。", guide: "window" },
  { char: "水", meaning: "水", english: "water", strokes: 4, group: "自然", story: "豎鉤是水的主幹，兩旁水花向外濺。", watch: "中間站直，左右水花大致平衡。", guide: "center" },
  { char: "火", meaning: "火", english: "fire", strokes: 4, group: "自然", story: "中間的人站直，兩旁火星跳起來。", watch: "先寫兩點，再寫撇和捺；下方要舒展。", guide: "open" },
  { char: "山", meaning: "山", english: "mountain", strokes: 3, group: "自然", story: "三座山峰站成一排，中間那座最高。", watch: "中峰沿中線站直，左右山峰較矮。", guide: "mountain" },
  { char: "木", meaning: "樹木", english: "tree", strokes: 4, group: "自然", story: "豎是樹幹，撇捺是兩條滑梯般的樹枝。", watch: "樹幹在中線，左右樹枝張開。", guide: "tree" },
  { char: "口", meaning: "嘴巴", english: "mouth", strokes: 3, group: "基本字", story: "三筆圍出一張嘴，最後把底邊合上。", watch: "上面略寬、下面略窄，轉角要清楚。", guide: "window" },
  { char: "大", meaning: "大", english: "big", strokes: 3, group: "基本字", story: "一個人張開雙手，雙腳穩穩分開。", watch: "橫畫像肩膀，撇捺由中央向外伸展。", guide: "open" },
  { char: "小", meaning: "小", english: "small", strokes: 3, group: "基本字", story: "中間是大樹，兩邊是兩棵小樹苗。", watch: "豎鉤最高，左右兩點呼應。", guide: "tree" },
  { char: "人", meaning: "人", english: "person", strokes: 2, group: "基本字", story: "兩條腿分開站，身體就穩了。", watch: "先撇後捺，交接處不要太低。", guide: "open" },
];

const MODES: { id: PracticeMode; title: string; en: string; icon: typeof Eye }[] = [
  { id: "watch", title: "看筆順", en: "Watch", icon: Eye },
  { id: "trace", title: "沿線寫", en: "Trace", icon: PencilLine },
  { id: "write", title: "自己寫", en: "Write", icon: Sparkles },
];

const ALL_CHARACTERS: HanziCard[] = [...CHARACTERS, ...EXTRA_HANZI.map(([char, meaning, english, story, watch], index) => ({
  char, meaning, english, story, watch, strokes: 0,
  group: index < 20 ? (index < 10 ? "方位與身體" : "生活與自然") : index < 40 ? (index < 30 ? "部件組合" : "生活常用字") : (index < 50 ? "自然與科學" : "探索與學習"),
  guide: "generic" as const,
}))];

function StructureGuide({ kind, character }: { kind: HanziCard["guide"]; character: string }) {
  if (kind === "generic") {
    const layout = "明休林好朋河你海洋晴球植物校讀".includes(character) ? "左右" : "字安早草花青家森葉雪雲電星學書".includes(character) ? "上下" : "田目白園".includes(character) ? "包圍" : "我戲遊".includes(character) ? "舒展" : "中線";
    return <div className={`hanzi-position-guide guide-${layout}`} aria-hidden="true"><i /><i /><span>{layout === "左右" ? "左邊留位　右邊舒展" : layout === "上下" ? "上下對齊　中間留空" : layout === "包圍" ? "框內留空間" : layout === "舒展" ? "向外舒展，不碰邊" : "重心靠中線"}</span></div>;
  }
  return <div className={`hanzi-structure-guide is-${kind}`} data-character={character} aria-hidden="true"><i /><i /><i /></div>;
}

export default function HanziGame() {
  const [index, setIndex] = useState(0);
  const [bookIndex, setBookIndex] = useState(0);
  const [strokeCount, setStrokeCount] = useState<number | null>(null);
  const [mode, setMode] = useState<PracticeMode>("watch");
  useGameBack(mode !== "watch", () => setMode("watch"));
  const [message, setMessage] = useState("先看清楚每一筆從哪裡出發。");
  const [completed, setCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [loading, setLoading] = useState(true);
  const writerHost = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const characters = useMemo(() => ALL_CHARACTERS.slice(bookIndex * 20, bookIndex * 20 + 20), [bookIndex]);
  const card = characters[index];
  const book = HANZI_BOOKS[bookIndex];

  const startMode = (nextMode: PracticeMode) => {
    setMode(nextMode);
    setCompleted(false);
    setMistakes(0);
    setMessage(nextMode === "watch" ? "眼睛跟着橙色筆畫走一次。" : nextMode === "trace" ? "用手指沿着灰色輪廓寫。" : "輪廓藏起來了，靠記憶寫一次！");
  };

  useEffect(() => {
    const host = writerHost.current;
    if (!host) return;
    let cancelled = false;
    host.innerHTML = "";
    setLoading(true);
    setStrokeCount(null);
    setCompleted(false);
    setMistakes(0);
    const size = Math.max(250, Math.min(430, host.clientWidth || 360));
    const writer = HanziWriter.create(host, card.char, {
      width: size,
      height: size,
      padding: 23,
      showCharacter: false,
      showOutline: mode !== "write",
      strokeColor: "#18304c",
      outlineColor: "#c9d8d4",
      highlightColor: "#ff6b3d",
      drawingColor: "#168c94",
      drawingWidth: 14,
      strokeWidth: 7,
      outlineWidth: 3,
      strokeAnimationSpeed: 1.1,
      delayBetweenStrokes: 420,
      charDataLoader: (character, onComplete, onError) => {
        fetch(`/data/hanzi/${encodeURIComponent(character)}.json`)
          .then((response) => response.ok ? response.json() : Promise.reject(new Error("找不到字形資料")))
          .then(onComplete)
          .catch(onError);
      },
      onLoadCharDataSuccess: (data) => {
        if (cancelled) return;
        setStrokeCount(data.strokes.length);
        setLoading(false);
        if (mode === "watch") {
          writer.animateCharacter({ onComplete: () => !cancelled && setMessage("看完了！可以重播，或試試「沿線寫」。") });
        } else {
          writer.quiz({
            leniency: 1.6,
            showHintAfterMisses: 2,
            acceptBackwardsStrokes: false,
            onMistake: ({ totalMistakes }) => {
              setMistakes(totalMistakes);
              setMessage("方向或位置差一點點，看看亮起來的提示再試。");
              playWrong();
            },
            onCorrectStroke: ({ strokesRemaining }) => setMessage(strokesRemaining ? `寫對了！還有 ${strokesRemaining} 筆。` : "最後一筆也寫好了！"),
            onComplete: ({ totalMistakes }) => {
              setCompleted(true);
              setMistakes(totalMistakes);
              setMessage(totalMistakes === 0 ? "漂亮！筆順和方向全部正確。" : "完成了！再寫一次會更流暢。")
              playCorrect();
            },
          });
        }
      },
      onLoadCharDataError: () => {
        if (!cancelled) {
          setLoading(false);
          setMessage("字形資料暫時載入不到，請再試一次。");
        }
      },
    });
    writerRef.current = writer;
    const resize = new ResizeObserver(() => {
      const width = Math.min(430, host.clientWidth);
      if (width > 0) writer.updateDimensions({ width, height: width, padding: 23 });
    });
    resize.observe(host);
    return () => {
      cancelled = true;
      resize.disconnect();
      writer.cancelQuiz();
      host.innerHTML = "";
    };
  }, [card.char, mode]);

  const replay = () => {
    setCompleted(false);
    setMistakes(0);
    if (mode === "watch") {
      setMessage("再看一次：留意每一筆的起點和方向。");
      writerRef.current?.animateCharacter({ onComplete: () => setMessage("這次有看到起點嗎？輪到你寫了！") });
    } else {
      writerRef.current?.cancelQuiz();
      writerRef.current?.quiz({
        leniency: 1.6,
        showHintAfterMisses: 2,
        acceptBackwardsStrokes: false,
        onMistake: ({ totalMistakes }) => { setMistakes(totalMistakes); playWrong(); },
        onComplete: ({ totalMistakes }) => { setCompleted(true); setMistakes(totalMistakes); setMessage("完成！筆畫都回到正確位置了。"); playCorrect(); },
      });
    }
  };

  const goTo = (next: number) => {
    setIndex((next + characters.length) % characters.length);
    setMode("watch");
    setMessage("先看清楚每一筆從哪裡出發。");
  };

  return (
    <div className="game-body hanzi-game">

      <nav className="hanzi-book-tabs" aria-label="選擇漢字冊數">
        {HANZI_BOOKS.map((item, i) => <button key={item.title} aria-pressed={bookIndex === i} className={bookIndex === i ? "is-on" : ""} onClick={() => { setBookIndex(i); goTo(0); }}>
          <b>{item.title} · 20 字</b><span>{item.subtitle}</span><small>{item.focus}</small>
        </button>)}
      </nav>
      <div className="hanzi-layout">
        <aside className="hanzi-library">
          <div className="hanzi-library-title"><span>{book.title}</span><b>20 個字</b></div>
          <div className="hanzi-flat-list">{characters.map((item, itemIndex) => <button key={item.char} aria-label={item.char} className={index === itemIndex ? "is-on" : ""} onClick={() => goTo(itemIndex)}>{item.char}</button>)}</div>
          <p><Sparkles size={15} /> 小祕訣：字不要碰到田字格的邊，四周都要留呼吸位。</p>
        </aside>

        <main className="hanzi-paper">
          <div className="hanzi-mode-tabs">
            {MODES.map(({ id, title, en, icon: Icon }) => <button key={id} className={mode === id ? "is-on" : ""} onClick={() => startMode(id)}><Icon size={18} /><span><b>{title}</b><i>{en}</i></span></button>)}
          </div>

          <div className="hanzi-practice-row">
            <section className="hanzi-writing-card">
              <div className="hanzi-card-top"><span>{book.title} · 第 {index + 1} / 20 字</span><b>{strokeCount === null ? "載入筆順…" : `${strokeCount} 畫 · ${strokeCount} strokes`}</b></div>
              <div className="hanzi-grid" data-mode={mode}>
                <div className="hanzi-grid-lines" aria-hidden="true" />
                <div className="hanzi-danger-zone" aria-hidden="true" />
                <StructureGuide kind={card.guide} character={card.char} />
                <div ref={writerHost} className="hanzi-writer-host" />
                {loading && <div className="hanzi-loading">字形準備中…</div>}
              </div>
              <div className={`hanzi-feedback ${completed ? "is-complete" : ""}`}><span>{completed ? <Check size={18} /> : <PencilLine size={18} />}</span><p>{message}</p>{mistakes > 0 && <b>提示 {mistakes}</b>}</div>
              <button className="hanzi-replay" onClick={replay}>{mode === "watch" ? <Play size={17} /> : <RotateCcw size={17} />}{mode === "watch" ? "重播筆順" : "清除再寫"}</button>
            </section>

            <aside className="hanzi-story-card">
              <div className="hanzi-big-word"><motion.b key={card.char} initial={{ scale: .78, rotate: -5, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}>{card.char}</motion.b><span>{card.meaning}<i>{card.english}</i></span></div>
              <button className="hanzi-speak" onClick={() => speak(card.char, "zh")}><Volume2 size={18} /> 聽讀音</button>
              <div className="hanzi-story"><small>結構故事 · Shape story</small><p>{card.story}</p></div>
              <div className="hanzi-watch"><small>小眼睛看這裡</small><p>{card.watch}</p></div>
              <div className="hanzi-order-rule"><i>1</i><span>看起點</span><i>2</i><span>跟方向</span><i>3</i><span>留空間</span></div>
            </aside>
          </div>
        </main>
      </div>

      <footer className="hanzi-footer"><button onClick={() => goTo(index - 1)}><ChevronLeft /> 上一字</button><span>先慢慢寫正確，再慢慢寫流暢。</span><button onClick={() => goTo(index + 1)}>下一字 <ChevronRight /></button></footer>
    </div>
  );
}
import { useGameBack } from "@/lib/gameBack";
