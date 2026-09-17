import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Flag, Gauge, LockKeyhole, Play, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { playCorrect } from "@/lib/sound";
import { speak } from "@/lib/speech";

type Surface = "smooth" | "wood" | "felt" | "sand";
type Winner = "A" | "B" | "same";

const LEVELS = [
  ["同時出發", "Same start"],
  ["哪條坡更陡", "Slope"],
  ["從哪裡出發", "Height"],
  ["粗糙與光滑", "Friction"],
  ["重車更快嗎", "Mass"],
  ["速度不等於距離", "Speed & distance"],
  ["神秘軌道", "Mystery track"],
  ["公平實驗", "Fair test"],
  ["工程挑戰", "Engineering"],
] as const;

const SURFACES: Record<Surface, { zh: string; en: string; drag: number; emoji: string }> = {
  smooth: { zh: "光滑", en: "Smooth", drag: 0, emoji: "✨" },
  wood: { zh: "木板", en: "Wood", drag: 0.25, emoji: "🪵" },
  felt: { zh: "毛氈", en: "Felt", drag: 0.55, emoji: "🧶" },
  sand: { zh: "沙面", en: "Sand", drag: 0.9, emoji: "🏖️" },
};

type CarSettings = { slope: number; height: number; surface: Surface; weight: number };

const baseA: CarSettings = { slope: 22, height: 70, surface: "smooth", weight: 1 };
const baseB: CarSettings = { slope: 22, height: 70, surface: "smooth", weight: 1 };

function durationOf(car: CarSettings) {
  const slopeHelp = Math.max(0.5, car.slope / 22);
  const heightHelp = Math.max(0.65, car.height / 70);
  const friction = 1 + SURFACES[car.surface].drag;
  return Math.max(1.2, Math.min(4.8, (3.25 * friction) / (slopeHelp * heightHelp)));
}

function RampLane({ name, color, car, duration, running, runId, mystery }: { name: "A" | "B"; color: string; car: CarSettings; duration: number; running: boolean; runId: number; mystery: boolean }) {
  return (
    <div className="ramp-lane-wrap">
      <div className="ramp-label" style={{ background: color }}>{name}</div>
      <div className="ramp-lane" style={{ transform: `rotate(${car.slope / 2.8}deg)`, background: mystery ? "#6c7180" : color }}>
        <motion.div key={runId} className="ramp-car" initial={{ x: "0%" }} animate={{ x: running ? "calc(100% - 58px)" : "0%" }} transition={{ duration, ease: [0.25, 0.8, 0.35, 1] }}>
          <span style={{ background: color }}>●</span><i /><i />
        </motion.div>
        <div className={`ramp-texture is-${car.surface}`} />
      </div>
      <span className="ramp-angle">{mystery ? "?" : `${car.slope}°`}</span>
    </div>
  );
}

export default function RampLabGame() {
  const [level, setLevel] = useState(0);
  const [a, setA] = useState<CarSettings>(baseA);
  const [b, setB] = useState<CarSettings>(baseB);
  const [prediction, setPrediction] = useState<Winner | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const [fairFixed, setFairFixed] = useState(false);
  const [target, setTarget] = useState(66);

  const timeA = useMemo(() => durationOf(a), [a]);
  const timeB = useMemo(() => durationOf(b), [b]);
  const actual: Winner = Math.abs(timeA - timeB) < 0.16 ? "same" : timeA < timeB ? "A" : "B";

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => { setRunning(false); setFinished(true); playCorrect(); }, Math.max(timeA, timeB) * 1000 + 250);
    return () => window.clearTimeout(timer);
  }, [running, runId, timeA, timeB]);

  const configureLevel = (next: number) => {
    setLevel(next); setPrediction(null); setFinished(false); setRunning(false); setFairFixed(false);
    if (next === 0) { setA(baseA); setB(baseB); }
    if (next === 1) { setA({ ...baseA, slope: 16 }); setB({ ...baseB, slope: 34 }); }
    if (next === 2) { setA({ ...baseA, height: 45 }); setB({ ...baseB, height: 90 }); }
    if (next === 3) { setA({ ...baseA, surface: "smooth" }); setB({ ...baseB, surface: "felt" }); }
    if (next === 4) { setA({ ...baseA, weight: 1 }); setB({ ...baseB, weight: 2 }); }
    if (next === 5) { setA({ ...baseA, slope: 32, surface: "felt" }); setB({ ...baseB, slope: 18, surface: "smooth" }); }
    if (next === 6) { setA({ ...baseA, surface: "wood", slope: 28 }); setB({ ...baseB, surface: "sand", slope: 32 }); }
    if (next === 7) { setA({ slope: 18, height: 45, surface: "felt", weight: 1 }); setB({ slope: 34, height: 88, surface: "smooth", weight: 2 }); }
    if (next === 8) { setA({ ...baseA, slope: 25 }); setB({ ...baseB, slope: 25 }); }
  };

  const start = () => {
    if (!prediction && level < 7) {
      speak("先作出預測，哪一輛車會先到呢？", "zh");
      return;
    }
    setFinished(false); setRunId((value) => value + 1); setRunning(true);
  };

  const fair = () => {
    setB({ ...a }); setFairFixed(true); setPrediction("same"); speak("現在只有一個條件不同，這是一個公平實驗", "zh");
  };

  const levelCopy = [
    ["兩輛車會一起到嗎？", "先用完全相同的條件，學會甚麼叫公平起點。"],
    ["坡度會改變速度嗎？", "只改變斜坡 Slope，其他條件自動鎖定。"],
    ["從高處出發會怎樣？", "比較釋放高度 Height，不把距離和速度混在一起。"],
    ["哪種表面阻力更大？", "觀察摩擦力 Friction 怎樣改變運動。"],
    ["重車一定更快嗎？", "質量 Mass 改變了，理想情況下到達時間仍很接近。"],
    ["最快、最遠、先到一樣嗎？", "用證據分清速度 Speed、距離 Distance 和時間 Time。"],
    ["看運動，找出神秘表面", "軌道資料被遮住了，請從結果推測原因。"],
    ["修好不公平的實驗", "找出同時改變的條件，再按一下讓它們一致。"],
    ["讓車停在目標區", "調整坡度與表面，把發現變成工程設計。"],
  ][level];

  const setCar = (which: "A" | "B", patch: Partial<CarSettings>) => {
    const setter = which === "A" ? setA : setB;
    setter((current) => ({ ...current, ...patch })); setFinished(false);
  };

  return (
    <div className="game-body science-game ramp-game">
      <header className="science-hero ramp-hero"><div><span>斜坡實驗室 · Ramp Lab</span><h1>{levelCopy[0]}</h1><p>{levelCopy[1]}</p></div><div className="science-badge"><Gauge size={18} /> 預測 · 比較 · 找證據</div></header>

      <nav className="science-levels" aria-label="斜坡實驗室關卡">
        {LEVELS.map(([zh, en], index) => <button key={zh} type="button" className={level === index ? "is-on" : ""} onClick={() => configureLevel(index)}><em>{index + 1}</em><span><b>{zh}</b><i>{en}</i></span></button>)}
      </nav>

      <section className="science-workbench ramp-workbench">
        <div className="science-scene ramp-scene">
          <div className="ramp-sky"><i /><i /><i /><Flag size={30} /></div>
          <RampLane name="A" color="#ff7048" car={a} duration={timeA} running={running} runId={runId} mystery={level === 6} />
          <RampLane name="B" color="#3c8ed8" car={b} duration={timeB} running={running} runId={runId} mystery={level === 6} />
          <div className="ramp-times"><span>A {finished ? `${timeA.toFixed(1)} s` : "—"}</span><span>B {finished ? `${timeB.toFixed(1)} s` : "—"}</span></div>
          {level === 8 && <div className="target-zone" style={{ left: `${target}%` }}><Flag size={18} /><b>目標區</b></div>}
        </div>

        <aside className="science-controls">
          {level < 7 && <div className="prediction-card ramp-prediction"><small>我的預測 · Prediction</small><p>哪一輛車會先到終點？</p><div><button className={prediction === "A" ? "is-on" : ""} onClick={() => setPrediction("A")}><b>A 車</b><i>Car A</i></button><button className={prediction === "same" ? "is-on" : ""} onClick={() => setPrediction("same")}><b>同時</b><i>Same</i></button><button className={prediction === "B" ? "is-on" : ""} onClick={() => setPrediction("B")}><b>B 車</b><i>Car B</i></button></div></div>}

          {(level === 1 || level === 5 || level === 8) && <div className="dual-control"><small>坡度 · Slope</small>{(["A", "B"] as const).map((which) => { const car = which === "A" ? a : b; const locked = level === 1 && which === "A"; return <label key={which}><b>{which}</b><input type="range" min="12" max="40" value={car.slope} disabled={locked} onChange={(e) => setCar(which, { slope: Number(e.target.value) })} /><strong>{car.slope}°</strong>{locked && <LockKeyhole size={14} />}</label>; })}</div>}

          {level === 2 && <div className="dual-control"><small>釋放高度 · Height</small>{(["A", "B"] as const).map((which) => { const car = which === "A" ? a : b; return <label key={which}><b>{which}</b><input type="range" min="30" max="100" value={car.height} onChange={(e) => setCar(which, { height: Number(e.target.value) })} /><strong>{car.height}</strong></label>; })}</div>}

          {(level === 3 || level === 6 || level === 8) && <div className="surface-control"><small>軌道表面 · Surface</small>{(["A", "B"] as const).map((which) => { const car = which === "A" ? a : b; return <label key={which}><b>{which}</b><select value={car.surface} onChange={(e) => setCar(which, { surface: e.target.value as Surface })}>{(Object.keys(SURFACES) as Surface[]).map((surface) => <option key={surface} value={surface}>{SURFACES[surface].emoji} {SURFACES[surface].zh} · {SURFACES[surface].en}</option>)}</select></label>; })}</div>}

          {level === 4 && <div className="mass-compare"><small>質量 · Mass</small><div><span>🚗<b>A 車</b><i>1 個配重</i></span><span>🚙<b>B 車</b><i>2 個配重</i></span></div><p>兩車外形和車輪相同，只有質量不同。</p></div>}

          {level === 7 && <div className="fair-fixer"><small>找出問題 · Spot the variables</small><ul><li>A、B 坡度不同</li><li>釋放高度不同</li><li>表面也不同</li></ul><button className={fairFixed ? "is-done" : ""} onClick={fair}>{fairFixed ? <Check /> : <RotateCcw />} {fairFixed ? "已變成公平實驗" : "只保留一個變量"}</button></div>}

          {level === 8 && <label className="science-slider target-slider"><span><b>目標位置</b><i>Target</i><strong>{target}%</strong></span><input type="range" min="52" max="84" value={target} onChange={(e) => setTarget(Number(e.target.value))} /></label>}

          <button type="button" className="science-primary" onClick={start} disabled={running || (level === 7 && !fairFixed)}><Play size={18} fill="currentColor" /> {running ? "小車前進中…" : "同時放手"}</button>

          <AnimatePresence>{finished && <motion.div className="science-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Sparkles size={20} /><div><b>{prediction === actual ? "預測和結果一致！" : "意外的結果最值得研究！"}</b><span>{actual === "same" ? "兩車幾乎同時到達" : `${actual} 車先到達`} · 再改一個條件試試</span></div></motion.div>}</AnimatePresence>

          <div className="discovery-note"><small>變量鎖 · Variable lock</small><p>{level === 0 ? "所有條件相同，兩輛車應該一起到達。" : level === 4 ? "相同形狀的小車，增加質量不一定令它更快。" : "現在只比較畫面中可調整的條件，其他條件保持相同。"}</p></div>
        </aside>
      </section>

      <footer className="science-footer"><button disabled={level === 0} onClick={() => configureLevel(level - 1)}><ChevronLeft /> 上一關</button><span>公平比較：一次只改變一個變量 Variable。</span><button disabled={level === LEVELS.length - 1} onClick={() => configureLevel(level + 1)}>下一關 <ChevronRight /></button></footer>
    </div>
  );
}
