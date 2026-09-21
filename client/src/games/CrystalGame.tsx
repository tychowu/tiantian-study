import { useState } from "react";
import { motion } from "framer-motion";
import { speak } from "@/lib/speech";

const SPECIMENS = [
  { name: "磷酸二氫銨", en: "ADP", shape: "四方柱配尖頂", type: "prism", color: "#9571dc", copy: "內部按四方晶系的規則重複排列，常長成帶尖頂的柱子。不同方向長得快慢不同。", formula: "NH₄H₂PO₄" },
  { name: "明礬", en: "Alum", shape: "八面體", type: "octa", color: "#55bcb9", copy: "常見形狀像兩個方形金字塔底對底，共有八個三角形面。它屬於立方晶系，外形卻不一定是方塊！", formula: "KAl(SO₄)₂·12H₂O" },
  { name: "食鹽", en: "Salt", shape: "立方體", type: "cube", color: "#e5aa51", copy: "鈉離子和氯離子有規則地交替排列，常長成方方正正的立方體。", formula: "NaCl" },
  { name: "水晶", en: "Quartz", shape: "六邊柱配尖頂", type: "quartz", color: "#6fafe0", copy: "矽和氧連成重複的立體網絡。常見外形有六個柱面；常溫水晶屬於三方晶系。不是把粉倒進熱水就能種出來！", formula: "SiO₂" },
] as const;

function Gem({ type, color }: { type: string; color: string }) {
  return <svg viewBox="0 0 180 200" role="img" aria-label={type === "cube" ? "立方體" : type === "octa" ? "八面體" : "帶尖頂的晶柱"} style={{ color }}>
    {type === "cube" ? <g stroke="#18304c" strokeWidth="3"><path fill="currentColor" d="M25 60 90 25 155 60 155 140 90 178 25 140Z"/><path fill="#fff" opacity=".5" d="M25 60 90 25 155 60 90 98Z"/><path fill="#18304c" opacity=".2" d="M90 98 155 60 155 140 90 178Z"/><path fill="none" d="M25 60 90 98 155 60M90 98V178"/></g>
    : type === "octa" ? <g stroke="#18304c" strokeWidth="3"><path fill="currentColor" d="M90 15 165 100 90 185 15 100Z"/><path fill="#fff" opacity=".45" d="M90 15V118L15 100Z"/><path fill="#18304c" opacity=".2" d="M90 118 165 100 90 185Z"/><path fill="none" d="M15 100 90 118 165 100M90 15V185"/></g>
    : <g stroke="#18304c" strokeWidth="3"><path fill="currentColor" d="M90 10 140 65 140 165 90 190 40 165 40 65Z"/><path fill="#fff" opacity=".5" d="M90 10 90 85 40 65Z"/><path fill="#18304c" opacity=".2" d="M90 85 140 65 140 165 90 190Z"/><path fill="none" d="M40 65 90 85 140 65M90 85V190"/>{type === "quartz" && <path fill="none" d="M65 72V178M115 75V178"/>}</g>}
  </svg>;
}

type Sample = { temp: number; water: number; dissolved: number; powder: number; crystal: number; seeded: boolean; day: number };
const initial: Sample = { temp: 80, water: 80, dissolved: 0, powder: 0, crystal: 0, seeded: false, day: 0 };
const capacity = (s: Sample) => Math.round((4 + s.temp / 10) * s.water / 80);

export default function CrystalGame() {
  const [sample, setSample] = useState<Sample>(initial);
  const [tab, setTab] = useState(0);
  const [specimen, setSpecimen] = useState(0);
  const [layers, setLayers] = useState(1);
  const [hint, setHint] = useState("先加幾匙晶粉，再按攪拌！");
  const cap = capacity(sample);
  const status = sample.dissolved > cap ? "過飽和" : sample.dissolved === cap ? "飽和" : "未飽和";
  const info = sample.dissolved > cap ? "水裡暫時擠着太多已溶解的粒子，晶種可以幫它們排隊。" : sample.dissolved === cap ? "在這個溫度和水量下，已達到平衡溶解容量。" : "現在還能溶進更多晶粉。";
  const material = SPECIMENS[specimen];
  const act = (action: "add" | "stir" | "cool" | "seed" | "day" | "water") => {
    setSample(s => {
      const n = { ...s };
      if (action === "add") { n.powder += 2; setHint("粉末先沉在底部。攪拌看看能溶多少！"); }
      if (action === "stir") { const amount = Math.min(n.powder, Math.max(0, capacity(n) - n.dissolved)); n.powder -= amount; n.dissolved += amount; setHint(amount ? "粉末分散到水裡了，但沒有消失。" : "容量滿了！再攪拌也不能無限溶解。"); }
      if (action === "cool") { n.temp = Math.max(20, n.temp - 20); setHint("降溫後，這種模型晶粉的平衡溶解容量變少了。"); }
      if (action === "water") { n.water = Math.min(120, n.water + 20); setHint("水變多，能容納的晶粉也變多。"); }
      if (action === "seed") { n.seeded = true; setHint("晶種是排隊起點。按「過一天」觀察！"); }
      if (action === "day") {
        n.day += 1; n.water = Math.max(20, n.water - 5);
        const excess = Math.max(0, n.dissolved - capacity(n));
        if (n.seeded || n.powder > 0) { n.dissolved -= excess; n.crystal += excess; }
        const deficit = Math.max(0, capacity(n) - n.dissolved);
        const redissolve = Math.min(n.crystal, deficit);
        n.crystal -= redissolve; n.dissolved += redissolve;
        setHint(excess && (n.seeded || n.powder > 0) ? "多出的粒子加入晶體，晶體長大了！" : redissolve ? "未飽和的水讓部分晶體重新溶解。" : "水慢慢蒸發。沒有晶種時，過飽和狀態可能暫時保留。");
      }
      // Undissolved powder provides nucleation surfaces: do not retain a supersaturated solution beside it.
      if (n.powder > 0 && n.dissolved > capacity(n)) { const excess = n.dissolved - capacity(n); n.dissolved -= excess; n.crystal += excess; }
      return n;
    });
  };
  return <div className="game-body crystal-game">
    <header className="crystal-hero"><div><small>CRYSTAL GARDEN · 晶體小花園</small><h1>把看不見的粒子，種成閃亮晶體</h1><p>天天的小實驗，變成一座可以探索的花園。</p></div><img src="/images/cards/crystal-garden.webp" alt="晶體花園插畫"/></header>
    <nav className="crystal-tabs">{["① 調一杯晶體水", "② 晶體形狀館"].map((title, i) => <button key={title} aria-pressed={tab === i} onClick={() => setTab(i)}>{title}</button>)}</nav>
    {tab === 0 ? <div className="crystal-workspace">
      <section className="crystal-scene"><div className="crystal-scene-top"><b>第 {sample.day} 天</b><span>{sample.temp}°C · {sample.water} 份水</span></div>
        <div className="crystal-vessel"><motion.div className="crystal-water" animate={{ height: `${sample.water / 120 * 75}%` }}>
          {Array.from({ length: sample.dissolved }, (_, i) => <motion.i key={i} style={{ left: `${8 + i * 29 % 82}%`, top: `${8 + i * 19 % 65}%` }} animate={{ x: [-5, 7, -5], y: [0, -10, 0] }} transition={{ duration: 2 + i % 3, repeat: Infinity }}/>)}
        </motion.div>
        <div className="crystal-bed">{Array.from({ length: Math.min(24, sample.powder) }, (_, i) => <i key={i}/>)}</div>
        {(sample.seeded || sample.crystal > 0) && <motion.div className="growing-gem" animate={{ scale: Math.min(1.6, .22 + sample.crystal * .095) }} transition={{ type: "spring", damping: 12 }}><Gem type="prism" color="#9270d8"/></motion.div>}
        </div><div className="crystal-status"><h2>{status} <small>{status === "過飽和" ? "Supersaturated" : status === "飽和" ? "Saturated" : "Unsaturated"}</small></h2><p>{info}</p></div>
        <div className="crystal-counts"><span>已溶解 <b>{sample.dissolved}</b></span><span>平衡容量 <b>{cap}</b></span><span>未溶粉末 <b>{sample.powder}</b></span><span>長成晶體 <b>{sample.crystal}</b></span></div>
      </section>
      <aside className="crystal-panel"><h2>你的實驗工具</h2><div className="crystal-tools">
        <button disabled={sample.dissolved + sample.powder + sample.crystal >= 30} onClick={() => act("add")}>🥄 加兩份晶粉</button><button onClick={() => act("stir")}>🌀 攪拌溶解</button>
        <button disabled={sample.temp <= 20} onClick={() => act("cool")}>❄️ 降溫 20°C</button><button disabled={sample.seeded} onClick={() => act("seed")}>💎 放入晶種</button>
        <button onClick={() => act("day")}>☀️ 過一天</button><button disabled={sample.water >= 120} onClick={() => act("water")}>💧 加一點水</button>
      </div><p className="crystal-hint" aria-live="polite">{hint}</p><button className="crystal-read" onClick={() => speak(hint + info, "zh")}>🔊 聽小提示</button>
      <div className="crystal-mission"><h3>結晶 · Crystallization</h3><p>原本散在水裡的粒子，有規則地排在一起，變成固體晶體。</p><h3>試試這條探索路線</h3><p>加粉六次 → 攪拌 → 降溫 → 放晶種 → 過一天。</p><p>再加水，晶體會怎樣？</p></div>
      <button onClick={() => { setSample(initial); setHint("新的實驗開始！"); }}>↺ 重新開始</button>
      <small>這是示意模型，份數不是克數，也不是實驗配方。真實生長可能需要數天；過飽和也可能自行成核。種晶本身不計入晶粉份數。</small>
      </aside>
    </div> : <section className="crystal-gallery"><div className="crystal-specimens">{SPECIMENS.map((s, i) => <button key={s.en} aria-pressed={specimen === i} onClick={() => { setSpecimen(i); setLayers(1); }}><Gem type={s.type} color={s.color}/><b>{s.name}</b><small>{s.en}</small></button>)}</div>
      <div className="crystal-exhibit"><div className="crystal-large-gem"><motion.div key={specimen} animate={{ rotateY: [0, 22, 0], scale: .65 + layers * .07 }} transition={{ rotateY: { repeat: Infinity, duration: 5 }, scale: { duration: .5 } }}><Gem type={material.type} color={material.color}/></motion.div></div>
<div><small>{material.formula}</small><h2>{material.name} · {material.shape}</h2><p>{material.copy}</p><button onClick={() => setLayers(n => n >= 5 ? 1 : n + 1)}>✨ {layers >= 5 ? "重新觀察" : "長大一層"}</button><button onClick={() => speak(material.copy, "zh")}>🔊 聽解說</button><p className="crystal-hint">粒子按自己的規則重複排列；各個晶面長得快慢不同，形成不同外形。不是杯子把晶體壓成這個形狀！</p><small>展示常見理想晶形。溫度、雜質和生長空間也會影響外觀；顏色只是方便辨認。放大動畫是形狀示意，並非原子排列圖。</small></div></div></section>}
    <details className="crystal-notes"><summary>給大人的實驗筆記與資料來源</summary><p>照片介紹熱水溶解、冷卻、加入晶種及靜置 4–7 天，但未列出晶粉成分，不能確認是哪種物質。套裝晶體不等於二氧化矽水晶。熱水與晶粉由成人處理，勿品嚐；依原套裝說明操作。</p><p>食鹽的溶解度隨溫度變化較小，常用蒸發法；水晶的形成條件與套裝水溶液實驗不同。</p><a href="https://www.mrsec.psu.edu/education-outreach/public/nano-activities-kids/liquid-metal/growing-crystals" target="_blank" rel="noreferrer">Penn State：晶體生長</a> · <a href="https://www.sciencedirect.com/science/article/pii/S0022024822003025" target="_blank" rel="noreferrer">ADP 晶體研究</a> · <a href="https://www.mindat.org/min-3337.html" target="_blank" rel="noreferrer">水晶晶形資料</a></details>
  </div>;
}
