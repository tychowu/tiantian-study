import { motion } from "framer-motion";
import { BookOpen, Check, Grid3X3, RotateCcw, Sparkles, Star, Volume2 } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

type Mode = "understand" | "map" | "quiz" | "stars";
type Mastery = Record<string, { level: number; last: number }>;
const CN = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const ORDER = [2, 5, 9, 3, 4, 6, 7, 8, 1];

const cnNumber = (value: number) => value <= 10 ? CN[value] : value < 20 ? `十${value % 10 ? CN[value % 10] : ""}` : `${CN[Math.floor(value / 10)]}十${value % 10 ? CN[value % 10] : ""}`;
const chant = (a: number, b: number) => {
  const low = Math.min(a, b); const high = Math.max(a, b); const result = low * high;
  return `${CN[low]}${CN[high]}${result < 10 ? "得" : ""}${cnNumber(result)}`;
};
/** 口訣填空：只挖掉最後面的得數，避免「一一得一」被替換成「＿＿一得一」 */
const hideResult = (a: number, b: number) => {
  const text = chant(a, b);
  const target = cnNumber(a * b);
  const at = text.lastIndexOf(target);
  return at < 0 ? text : `${text.slice(0, at)}＿＿${text.slice(at + target.length)}`;
};
const keyFor = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`;
const randomPair = (factor?: number) => factor ? [Math.ceil(Math.random() * 9), factor] as const : [Math.ceil(Math.random() * 9), Math.ceil(Math.random() * 9)] as const;
const choicesFor = (answer: number, max = 81) => {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < 4 && guard < 80) {
    const value = answer + Math.ceil(Math.random() * 6) * (Math.random() < .5 ? 1 : -1);
    if (value >= 1 && value <= max) set.add(value);
    guard += 1;
  }
  return Array.from(set).sort(() => Math.random() - .5);
};

function DotArray({ rows, cols, compact = false }: { rows: number; cols: number; compact?: boolean }) {
  return <div className={`tt-dots ${compact ? "is-compact" : ""}`} style={{ "--rows": rows, "--cols": cols } as CSSProperties} aria-label={`${rows}排，每排${cols}個，共${rows * cols}個`}>
    {Array.from({ length: rows * cols }, (_, index) => <motion.i key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: Math.min(index * .018, .45) }} />)}
  </div>;
}

export default function TimesTableGame() {
  const [mode, setMode] = useState<Mode>("understand");
  const [rows, setRows] = useState(3); const [cols, setCols] = useState(4);
  const [mastery, setMastery] = useState<Mastery>({});
  const savePractice = (a: number, b: number, correct: boolean) => {
    const key = keyFor(a, b); const old = mastery[key]?.level ?? 0;
    const next = { ...mastery, [key]: { level: correct ? Math.min(3, old + 1) : Math.max(0, old - 1), last: Date.now() } };
    setMastery(next);
  };
  const say = (a: number, b: number) => speak(`${chant(a, b)}。${a}乘${b}等於${a * b}。`, "zh");

  const [quizStep, setQuizStep] = useState(0); const [quizPair, setQuizPair] = useState(() => randomPair());
  const [quizPick, setQuizPick] = useState<number | null>(null); const [quizWrong, setQuizWrong] = useState(false);
  const quizType = quizStep % 3; const quizAnswer = quizType === 2 ? quizPair[0] : quizPair[0] * quizPair[1];
  const quizChoices = useMemo(() => choicesFor(quizAnswer, quizType === 2 ? 9 : 81), [quizAnswer, quizStep, quizType]);
  const chooseQuiz = (value: number) => {
    if (quizPick !== null) return; setQuizPick(value);
    if (value === quizAnswer) { playCorrect(); savePractice(quizPair[0], quizPair[1], true); say(quizPair[0], quizPair[1]); }
    else { playWrong(); setQuizWrong(true); savePractice(quizPair[0], quizPair[1], false); speak(`看一看，${quizPair[0]}排${quizPair[1]}個，一共有${quizPair[0] * quizPair[1]}個。${chant(quizPair[0], quizPair[1])}`, "zh"); }
  };
  const nextQuiz = () => { setQuizStep((value) => value + 1); setQuizPair(randomPair()); setQuizPick(null); setQuizWrong(false); };

  const [starFactor, setStarFactor] = useState(ORDER[0]); const [starQuestion, setStarQuestion] = useState(() => randomPair(ORDER[0]));
  const [streak, setStreak] = useState(0); const [stars, setStars] = useState(0); const [roundCount, setRoundCount] = useState(0);
  const answerStar = (value: number) => {
    const correct = starQuestion[0] * starQuestion[1]; const ok = value === correct;
    if (ok) { const nextStreak = streak + 1; setStreak(nextStreak); if (nextStreak % 5 === 0) setStars((current) => current + 1); playCorrect(); savePractice(starQuestion[0], starQuestion[1], true); }
    else { setStreak(0); playWrong(); savePractice(starQuestion[0], starQuestion[1], false); }
    setRoundCount((current) => current + 1); setStarQuestion(randomPair(starFactor));
  };

  const modes = [
    ["understand", "看懂乘法", BookOpen], ["map", "九九表地圖", Grid3X3], ["quiz", "挑戰問答", Sparkles], ["stars", "闖關拿星星", Star],
  ] as const;
  return <div className="game-body tt-game-body">
    <div className="tt-modes">{modes.map(([key,label,Icon], index) => <button key={key} type="button" className={mode === key ? "is-on" : ""} onClick={() => { setMode(key); if (key === "map") setMastery({}); }}><em>{index + 1}</em><Icon size={18}/>{label}</button>)}</div>

    {mode === "understand" && <section className="tt-panel"><header><span>關卡 1</span><h2>乘法，就是一排排一樣多</h2><p>拉動兩個滑桿，親手搭出你的糖果點陣。</p></header><div className="tt-understand"><div className="tt-sliders"><label>幾排 <b>{rows}</b><input type="range" min="1" max="9" value={rows} onChange={(event) => setRows(Number(event.target.value))}/></label><label>每排幾個 <b>{cols}</b><input type="range" min="1" max="9" value={cols} onChange={(event) => setCols(Number(event.target.value))}/></label><button type="button" onClick={() => { setRows(cols); setCols(rows); }}>↻ 轉 90° 看看</button></div><div className="tt-array-card"><DotArray rows={rows} cols={cols}/><strong>{rows} × {cols} = {rows * cols}</strong><p>{rows} × {cols} 就是 {Array.from({length:rows},()=>cols).join(" + ")} = {rows * cols}</p><button type="button" onClick={() => say(rows,cols)}><Volume2 size={17}/> {chant(rows,cols)}</button></div></div><div className="tt-discovery">✨ 轉一轉，{rows} × {cols} 和 {cols} × {rows} 的總數沒有變！記住一半，就等於學會另一半。</div></section>}

    {mode === "map" && <section className="tt-panel"><header><span>關卡 2</span><h2>九九表地圖</h2><p>點一格聽口訣；顏色越深，表示越熟練。</p></header><div className="tt-map">{Array.from({length:9},(_,r)=><div key={r} className="tt-map-row"><button type="button" className="tt-row-head" onClick={() => speak(Array.from({length:9},(_,c)=>chant(r+1,c+1)).join("。"),"zh")}>{r+1} 的歌 <Volume2 size={13}/></button>{Array.from({length:9},(_,c)=>{const level=mastery[keyFor(r+1,c+1)]?.level??0; return <button key={c} type="button" className={`tt-fact mastery-${level}`} onClick={()=>{say(r+1,c+1);savePractice(r+1,c+1,true);}}><b>{chant(r+1,c+1)}</b><i>{r+1}×{c+1}={((r+1)*(c+1))}</i></button>;})}</div>)}</div></section>}

    {mode === "quiz" && <section className="tt-panel"><header><span>關卡 3 · A／B／C 三種題型</span><h2>{quizType === 0 ? `${hideResult(quizPair[0], quizPair[1])}` : quizType === 1 ? `${quizPair[0]} × ${quizPair[1]} = ?` : `? × ${quizPair[1]} = ${quizPair[0]*quizPair[1]}`}</h2><p>{quizType === 2 ? "倒過來找乘數，才是真正記住了。" : "先在腦海裡唸一次口訣。"}</p></header><div className="tt-quiz-options">{quizChoices.map(value=><button key={value} type="button" className={quizPick!==null ? value===quizAnswer?"is-right":value===quizPick?"is-wrong":"":""} onClick={()=>chooseQuiz(value)}>{value}</button>)}</div>{quizWrong&&<div className="tt-help-array"><span>不是只說「再算一次」——看見它為什麼是 {quizPair[0]*quizPair[1]}：</span><DotArray rows={quizPair[0]} cols={quizPair[1]} compact/><b>{chant(quizPair[0],quizPair[1])}</b></div>}{quizPick!==null&&<button className="tt-next" type="button" onClick={nextQuiz}>下一題 →</button>}</section>}

    {mode === "stars" && <section className="tt-panel"><header><span>關卡 4 · 平時不計時</span><h2>按難度闖關拿星星</h2><p>2、5、9 先走，再挑戰 3、4、6，最後攻克 7 和 8。</p></header><div className="tt-factor-tabs">{ORDER.map(factor=><button key={factor} type="button" className={starFactor===factor?"is-on":""} onClick={()=>{setStarFactor(factor);setStarQuestion(randomPair(factor));setStreak(0);setRoundCount(0);}}>{factor} 的關</button>)}</div><div className="tt-star-board"><div className="tt-stars">{Array.from({length:Math.max(2,stars)},(_,index)=><Star key={index} size={34} fill={index<stars?"#ffb400":"transparent"} color="#d89a00"/>)}</div><h3>{starQuestion[0]} × {starQuestion[1]} = ?</h3><div className="tt-quiz-options">{choicesFor(starQuestion[0]*starQuestion[1]).map(value=><button key={value} type="button" onClick={()=>answerStar(value)}>{value}</button>)}</div><p>第 {Math.min(roundCount+1,10)} / 10 題 · 连对 {streak} · 每連對 5 題亮一顆星</p>{roundCount>=10&&<button type="button" className="tt-next" onClick={()=>{setRoundCount(0);setStreak(0);setStars(0);}}><RotateCcw size={16}/> 再闖一次</button>}</div></section>}
  </div>;
}
