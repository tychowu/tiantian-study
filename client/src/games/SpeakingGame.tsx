import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Volume2, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { speak, stopSpeaking } from "@/lib/speech";
import { STORIES, type Story } from "@/data/stories";

const STEPS = ["👀 看一看", "💭 想一想", "🚂 接起來", "💬 說故事"];
const CHECKS = ["👧 我介紹了誰和哪裡", "🎬 我說了發生甚麼事", "💛 我加了感受或原因", "🌈 我說了自己的結尾"];
function Voice({ text, label = "聽提示" }: { text: string; label?: string }) {
  return <button className="story-voice" onClick={() => speak(text, "zh")} aria-label={label}><Volume2 size={18}/>{label}</button>;
}
function StorySession({ story, onBack, onComplete }: { story: Story; onBack: () => void; onComplete: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [clue, setClue] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const [thought, setThought] = useState(0);
  const [train, setTrain] = useState<number[]>([]);
  const [reference, setReference] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [example, setExample] = useState(false);
  const [showClues, setShowClues] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => () => stopSpeaking(), []);
  const changeStep = (next: number) => { stopSpeaking(); setStep(next); };
  const prompt = clue === null ? "先靜靜看一看。你最先注意到甚麼？點圖上的小圓點找線索。" : story.clues[clue].question;
  const four = story.format === "four";
  const connectors = four ? ["起初", "接着", "後來", "最後"] : ["起初", "接着", "最後"];
  const sequenceHelp = four ? "四張情節卡對應四格圖片。按左上、右上、左下、右下的順序，找出每格發生的事。" : "下面是三張想像情節卡。按你想說的先後，依次點選。";
  const trainText = train.map((id, i) => `${connectors[i]}，${story.events[id].text}`).join("");
  return <>
    <div className="story-topline"><button onClick={onBack}><ArrowLeft size={17}/> 換一幅圖</button><h1>{story.emoji} {story.title}</h1><span>慢慢說，不計時</span></div>
    <nav className="story-steps" aria-label="說故事步驟">{STEPS.map((s, i) => <button key={s} aria-pressed={step === i} onClick={() => changeStep(i)}>{s}</button>)}</nav>
    <div className="story-workspace">
      <section className="story-picture-panel">
        <div className="story-picture"><img src={`/images/stories/${story.image}.webp`} alt={story.alt} draggable={false}/>{(four || (step === 0 && showClues)) && story.clues.map((c, i) => <motion.button key={c.label} className={`story-hotspot ${seen.includes(i) ? "is-seen" : ""}`} style={{ left: `${c.x}%`, top: `${c.y}%` }} animate={reduced || seen.includes(i) ? {} : { scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * .3 }} aria-label={`觀察${c.label}`} aria-pressed={clue === i} onClick={() => { setClue(i); setSeen(v => v.includes(i) ? v : [...v, i]); speak(c.question, "zh"); }}>{four ? i + 1 : seen.includes(i) ? "✓" : i + 1}</motion.button>)}</div>
        <div className="story-picture-tools"><span>{four ? "四格故事 · 左上 → 右上 → 左下 → 右下" : "單頁看圖 · Picture talk"}</span>{step === 0 && !four && <button aria-pressed={showClues} onClick={() => setShowClues(v => !v)}>{showClues ? "隱藏線索點" : "顯示線索點"}</button>}<Voice text={story.alt} label="聽圖片描述"/></div>
        <p className="story-picture-note">👀 我看到的：圖裡的線索。　💭 我猜的：可能發生的事。</p>
      </section>
      <motion.section key={step} className="story-coach" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {step === 0 && <><small>觀察 · Observe</small><h2>小眼睛，找一找</h2><p className="story-question" aria-live="polite">{prompt}</p><Voice text={prompt}/><div className="story-clue-list">{story.clues.map((c, i) => <button key={c.label} aria-pressed={clue === i} onClick={() => { setClue(i); setSeen(v => v.includes(i) ? v : [...v, i]); speak(c.question, "zh"); }}>{seen.includes(i) ? "✓" : "○"} {c.label}</button>)}</div><div className="story-starter">試着說：<strong>我看到……在……</strong><span>加一個顏色、位置或動作，句子就更清楚。</span></div><p>不必找完，也可以先說你最喜歡的細節。</p></>}
        {step === 1 && <><small>想法 · Imagine</small><h2>你怎麼想？</h2><div className="story-thought-tabs">{story.thoughts.map((t, i) => <button key={t.icon} aria-label={`想一想：${t.question}`} aria-pressed={thought === i} onClick={() => { setThought(i); speak(t.question, "zh"); }}>{t.icon}</button>)}</div><p className="story-question">{story.thoughts[thought].question}</p><Voice text={story.thoughts[thought].question}/><div className="story-starter"><span>開頭小幫手</span><strong>{story.thoughts[thought].starter}</strong></div><p>答案可以不同。說說是哪條線索讓你這樣想。</p></>}
        {step === 2 && <><small>先後 · Sequence</small><h2>故事小火車</h2><p>{sequenceHelp}</p><Voice text={sequenceHelp}/><div className={`story-train ${four ? "story-train-four" : ""}`}>{story.events.map((_, slot) => <button key={slot} className={train[slot] !== undefined ? "is-filled" : ""} disabled={train[slot] === undefined} aria-label={`${connectors[slot]}：${train[slot] === undefined ? "等你選情節" : story.events[train[slot]].text + "，按一下移除"}`} onClick={() => { setTrain(v => v.filter((_, i) => i !== slot)); setReference(false); }}><small>{connectors[slot]}</small><b>{train[slot] === undefined ? "＋" : story.events[train[slot]].icon}</b><span>{train[slot] === undefined ? "等你選" : story.events[train[slot]].text}</span></button>)}</div><div className="story-event-pool">{(four ? [2, 0, 3, 1] : [2, 0, 1]).map(id => <button key={id} disabled={train.includes(id)} onClick={() => { setTrain(v => [...v, id]); setReference(false); speak(story.events[id].text, "zh"); }}>{story.events[id].icon} {story.events[id].text}</button>)}</div><div className="story-inline-actions"><button onClick={() => { setTrain([]); setReference(false); }}><RotateCcw size={16}/> 重新排</button>{train.length === story.events.length && <Voice text={trainText} label="聽我的順序"/>}<button onClick={() => setReference(v => !v)}>看看一種排法</button></div>{reference && <p className="story-starter">{story.events.map((e, i) => `${connectors[i]}：${e.text}`).join(" ")}<span>{four ? "先按圖片的先後說一遍，再想像接下來會發生甚麼。" : "這是一種排法，不是唯一的故事。你的順序說得通嗎？"}</span></p>}</>}
        {step === 3 && <><small>表達 · Tell a story</small><h2>{finished ? "你的故事，值得被聽見！" : "現在，換你當說故事的人"}</h2><p>看着圖，說給身邊的人聽。用自己的話就好。</p><div className="story-speaking-cues"><span>👧 誰？哪裡？</span><span>🎬 發生甚麼？</span><span>💛 怎樣想？</span><span>🌈 最後呢？</span></div><p className="story-question">{story.ending}</p><Voice text={`看着圖，用自己的話說一個故事。誰在哪裡？發生甚麼事？人物有甚麼感受？${story.ending}`}/><div className="story-checks">{CHECKS.map((c, i) => <button key={c} aria-pressed={checked.includes(i)} onClick={() => setChecked(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i])}>{checked.includes(i) ? "✓ " : "○ "}{c}</button>)}</div><small>說完後自己勾選，不是電腦評分。這個遊戲不錄音、不上傳聲音。</small><button className="story-primary" onClick={() => { if (finished) { setFinished(false); setChecked([]); setExample(false); } else { setFinished(true); onComplete(story.id); } }}>{finished ? "🌟 我還想再說一次" : "🌟 我說好了"}</button>{finished && <motion.p className="story-celebration" initial={reduced ? false : { scale: .85 }} animate={{ scale: 1 }}>✨ 已留下你的故事足印！每次都可以有新版本。</motion.p>}<button onClick={() => setExample(v => !v)}>{example ? "收起示範" : "想聽一個不同版本？"}</button>{example && <div className="story-example"><b>一種可能，不是標準答案</b><p>{story.example}</p><Voice text={story.example} label="聽示範故事"/></div>}</>}
        <div className="story-step-actions">{step > 0 && <button onClick={() => changeStep(step - 1)}><ArrowLeft size={16}/> 上一步</button>}{step < 3 && <button className="story-primary" onClick={() => changeStep(step + 1)}>下一步 <ArrowRight size={16}/></button>}</div>
      </motion.section>
    </div>
    <details className="story-parent-note"><summary>給陪伴的大人：怎樣接住孩子的話</summary><p>先聽完，再問一個問題：「你從哪裡看出來？」孩子只說「小貓」，可以接成「小貓躲在椅子下面」，再邀請他補充。不急着糾正猜想，也不要把示範當成背誦答案。</p><p>五歲可以從一句完整描述開始；想多說時，再加上「因為」「後來」。孩子不想用情節卡，可以直接編自己的故事。完成足印只代表孩子按了「我說好了」，不是能力評分。</p></details>
  </>;
}
export default function SpeakingGame() {
  const [format, setFormat] = useState<"single" | "four">("single");
  const [selected, setSelected] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => { try { const v = JSON.parse(localStorage.getItem("tiantian-story-footprints-v1") ?? "[]"); return Array.isArray(v) ? v.filter(id => STORIES.some(s => s.id === id)) : []; } catch { return []; } });
  const story = STORIES.find(s => s.id === selected);
  const complete = (id: string) => { setCompleted(current => { const next = current.includes(id) ? current : [...current, id]; try { localStorage.setItem("tiantian-story-footprints-v1", JSON.stringify(next)); } catch { /* Optional local progress only. */ } return next; }); };
  return <div className="game-body story-game">{story ? <StorySession key={story.id} story={story} onBack={() => setSelected(null)} onComplete={complete}/> : <><div className="story-picker-heading"><h1>挑一幅圖，說你的故事</h1><Voice text="挑一幅喜歡的圖。先看一看，再想一想，把事情接起來，說出你的故事。沒有倒數，也沒有唯一答案。" label="怎樣玩"/></div><p className="story-picker-intro">👀 找線索 → 💭 說想法 → 🚂 排先後 → 💬 講故事</p><nav className="story-format-tabs" aria-label="圖片類型"><button aria-pressed={format === "single"} onClick={() => setFormat("single")}>🖼️ 單頁看圖</button><button aria-pressed={format === "four"} onClick={() => setFormat("four")}>▦ 一頁四格</button></nav><p className="story-format-hint">{format === "single" ? "一幅大圖：找人物、動作、表情和位置。" : "四格連續圖：按順序觀察，說清楚事情怎樣發生。"}</p><div className="story-selection">{STORIES.filter(s => s.format === format).map((s, i) => <button key={s.id} onClick={() => setSelected(s.id)}><img src={`/images/stories/${s.image}.webp`} alt={s.alt}/><span className="story-selection-copy"><small>故事 {i + 1} · {s.focus}</small><strong>{s.emoji} {s.title}</strong><span>{completed.includes(s.id) ? "🌟 已留下故事足印 · 再說新版本" : "打開圖片，一起說說看 →"}</span></span></button>)}</div><p className="story-picker-intro">可以說一句，也可以說一整段。你的想法，和別人不同也沒關係。</p></>}</div>;
}
