import { useState } from "react";
import { motion } from "framer-motion";
import { speak } from "@/lib/speech";
import { initial, capacity, step, type CrystalAction } from "@/lib/crystalModel";

const SPECIMENS = [
  { name: "磷酸二氫銨", en: "ADP", id: "adp", shape: "四方柱 · 尖頂", copy: "像有尖屋頂的小柱子！內部按四方晶系的規則重複排列，常形成四方柱和錐形晶面。", formula: "NH₄H₂PO₄", file: "Ammonium_Dihydrogen_Phosphate_crystals.jpg", author: "Damien Miller", license: "CC BY 3.0", url: "https://creativecommons.org/licenses/by/3.0/" },
  { name: "明礬", en: "Alum", id: "alum", shape: "八面體", copy: "像兩個方形金字塔底對底，有八個三角形面。真實晶體的面不一定一樣大。", formula: "KAl(SO₄)₂·12H₂O", file: "Potassium_alum_octahedral_like_crystal.jpg", author: "Ude", license: "CC BY-SA 3.0", url: "https://creativecommons.org/licenses/by-sa/3.0/" },
  { name: "食鹽", en: "Salt", id: "salt", shape: "立方體", copy: "像小方塊！鈉離子和氯離子有規則地交替排列，常形成互相垂直的方形晶面。這張實物有一個方向長得較長。", formula: "NaCl", file: "Halite-251628.jpg", author: "Rob Lavinsky, iRocks.com", license: "CC BY-SA 3.0", url: "https://creativecommons.org/licenses/by-sa/3.0/" },
  { name: "水晶", en: "Quartz", id: "quartz", shape: "六方柱外形 · 多面尖頂", copy: "找找六個柱面和頂端的斜面！常溫水晶屬於三方晶系，常見外形卻是六方柱，尖頂由菱面體晶面組成，不是四角金字塔。", formula: "SiO₂", file: "Quartz_Crystal.jpg", author: "USGS", license: "公有領域", url: "https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits" },
];
const hints: Record<CrystalAction, string> = {
  add: "晶粉先沉到底部，攪拌看看能溶多少。", stir: "攪拌幫晶粉溶解，但不能超過現在的平衡容量。",
  heat: "升溫了！這種模型晶粉能溶得更多。試試攪拌，再降溫。", cool: "降溫讓容量減少；已溶解的粒子若超過容量，就是過飽和！",
  seed: "半圓晶種是排隊起點。按「過一天」，看看不同方向的晶柱！", day: "蒸發了 15 ml 水。多出的粒子可以加入晶簇；沒有晶種時，過飽和可能暫時保留。",
  water: "加了 15 ml 水，容量增加；原來的晶體也可能重新溶解。",
};
function Cluster({ amount, seeded }: { amount: number; seeded: boolean }) {
  return <svg className="crystal-cluster" viewBox="0 0 260 250" role="img" aria-label="半圓晶種與向不同方向生長的晶簇">
    <defs><linearGradient id="crystal-facet" x2="1" y2="1"><stop stopColor="#e2dbff"/><stop offset=".5" stopColor="#a784ed"/><stop offset="1" stopColor="#5a9dd1"/></linearGradient></defs>
    {[-65, -43, 37, 62, -22, 19, -5, 48, -48].map((angle, i) => {
      const growth = Math.min(1, Math.max(0, amount - i * .25) / (12 + i % 3 * 3));
      return <g key={angle} transform={`translate(${130 + (i % 3 - 1) * 13} 220) rotate(${angle})`}>
        <motion.path initial={false} animate={{ d: `M${-13 * Math.min(1,growth*2)} 0V${-114*growth}L0 ${-142*growth} ${16*Math.min(1,growth*2)} ${-112*growth}V0Z`, opacity: growth > 0 ? 1 : 0 }} transition={{ duration: 1.8, delay: i * .07 }} fill="url(#crystal-facet)" stroke="#68529b" strokeWidth="1.4"/>
        <motion.path initial={false} animate={{ d: `M0 0V${-109*growth}L${-13*Math.min(1,growth*2)} ${-114*growth} 0 ${-142*growth} ${16*Math.min(1,growth*2)} ${-112*growth} 0 ${-109*growth}`, opacity: growth > 0 ? 1 : 0 }} transition={{ duration: 1.8, delay: i * .07 }} fill="#fff" fillOpacity=".36" stroke="#fff" strokeOpacity=".65"/>
      </g>;
    })}
    {seeded && <g><path d="M96 226a34 34 0 0 1 68 0Z" fill="#eabd68" stroke="#b98337" strokeWidth="2"/><path d="M106 217a25 25 0 0 1 28-22" fill="none" stroke="#fff2be" strokeWidth="5" strokeLinecap="round"/></g>}
  </svg>;
}
export default function CrystalGame() {
  const [sample, setSample] = useState(initial);
  const [tab, setTab] = useState(0);
  useGameBack(tab !== 0, () => setTab(0));
  const [specimen, setSpecimen] = useState(0);
  const [hint, setHint] = useState("從 25°C、80 ml 水開始。先猜猜：升溫能溶進更多晶粉嗎？");
  const [effect, setEffect] = useState({ action: "", tick: 0 });
  const cap = capacity(sample);
  const status = sample.dissolved > cap ? "過飽和" : sample.dissolved === cap ? "飽和" : "未飽和";
  const info = sample.dissolved > cap ? `已溶解 ${sample.dissolved}，比現在的容量 ${cap} 多！晶種會幫多出的粒子排隊。` : sample.dissolved === cap ? "剛好到達這個溫度、水量下的平衡容量。" : "還有空間！升溫或加水，都能讓容量增加。";
  const act = (action: CrystalAction) => {
    const next = step(sample, action);
    setSample(next); setEffect(e => ({ action, tick: e.tick + 1 }));
    setHint(next.crystal < sample.crystal ? "容量增加了，部分晶體重新溶進水裡！" : next.crystal > sample.crystal ? "多出的粒子排在一起，晶柱朝不同方向慢慢長出來！" : hints[action]);
  };
  const material = SPECIMENS[specimen];
  return <div className="game-body crystal-game">
    <nav className="crystal-tabs">{["① 調一杯晶體水", "② 晶體形狀館"].map((title, i) => <button key={title} aria-pressed={tab === i} onClick={() => setTab(i)}>{title}</button>)}</nav>
    {tab === 0 ? <div className="crystal-workspace">
      <section className="crystal-scene"><div className="crystal-scene-top"><b>第 {sample.day} 天</b><span>🌡 {sample.temp}°C · 💧 {sample.water} ml 毫升</span></div>
        <div className={`crystal-vessel crystal-effect-${effect.action}`}>
          <motion.div className="crystal-water" animate={{ height: `${sample.water / 140 * 83}%`, backgroundColor: sample.temp > 55 ? "#ffd5bd" : "#9be8ee" }} transition={{ duration: 1.2 }}>
            {Array.from({ length: sample.dissolved }, (_, i) => <motion.i key={i} style={{ left: `${8 + i * 29 % 82}%`, top: `${8 + i * 19 % 72}%` }} animate={{ x: [-5, 7, -5], y: [0, -(sample.temp / 4), 0] }} transition={{ duration: 3 - sample.temp / 50 + i % 2, repeat: Infinity }}/>) }
          </motion.div>
          <div className="crystal-graduations" aria-hidden="true"><span>140 ml ─</span><span>100 ─</span><span>60 ─</span><span>20 ─</span></div>
          <div className="crystal-bed">{Array.from({ length: Math.min(30, sample.powder) }, (_, i) => <i key={i}/>)}</div>
          <Cluster amount={sample.crystal} seeded={sample.seeded}/>
          <motion.div key={effect.tick} className="crystal-action-effect" initial={{ opacity: 1, y: 25 }} animate={{ opacity: 0, y: -60 }} transition={{ duration: 1.8 }}>{effect.action === "day" ? "☀ −15 ml" : effect.action === "water" ? "💧 +15 ml" : effect.action === "heat" ? "♨ +15°C" : effect.action === "cool" ? "❄ −15°C" : effect.action === "stir" ? "🌀" : ""}</motion.div>
        </div>
        <div className="crystal-capacity-chart"><b>溫度 ↑　平衡容量 ↑</b><div>{[25,40,55,70,85].map(t => <span key={t} className={sample.temp === t ? "active" : ""}><i style={{ height: 12 + (t - 25) * .6 }}/><strong>{capacity({ ...sample, temp: t })}</strong><small>{t}°C</small></span>)}</div><small>同樣 {sample.water} ml 水 · 晶粉粒子量（示意）</small></div>
        <div className="crystal-status" data-status={status}><h2>{status} <small>{status === "過飽和" ? "Supersaturated" : status === "飽和" ? "Saturated" : "Unsaturated"}</small></h2><p>{info}</p></div>
        <div className="crystal-counts"><span>已溶解 <b>{sample.dissolved}</b></span><span>平衡容量 <b>{cap}</b></span><span>未溶粉末 <b>{sample.powder}</b></span><span>長成晶體 <b>{sample.crystal}</b></span></div>
      </section>
      <aside className="crystal-panel"><h2>你的實驗工具</h2><div className="crystal-tools">
        <button disabled={sample.temp >= 85} onClick={() => act("heat")}>♨ 升溫 15°C</button><button disabled={sample.temp <= 25} onClick={() => act("cool")}>❄️ 降溫 15°C</button>
        <button disabled={sample.dissolved + sample.powder + sample.crystal >= 40} onClick={() => act("add")}>🥄 加一匙晶粉</button><button onClick={() => act("stir")}>🌀 攪拌溶解</button>
        <button disabled={sample.seeded} onClick={() => act("seed")}>🌱 放入半圓晶種</button><button disabled={sample.water < 15} onClick={() => act("day")}>☀️ 過一天 −15 ml</button><button disabled={sample.water > 125} onClick={() => act("water")}>💧 加一點水 +15 ml</button>
      </div><p className="crystal-hint" aria-live="polite">{hint}</p><button onClick={() => speak(hint + info, "zh")}>🔊 聽小提示</button>
      <div className="crystal-mission"><h3>試試：熱水變冷水</h3><p>升溫兩次 → 加粉六次 → 攪拌 → 降溫兩次。</p><p>容量從 12 變成 6，已溶解的 12 還在水裡：過飽和了！</p><p>放晶種 → 過一天：粒子排隊，長成晶簇。</p><h3>結晶 · Crystallization</h3><p>分散的粒子按規則排好，變成固體。再升溫或加水，會怎樣？</p></div>
      <button onClick={() => { setSample(initial); setHint("新的實驗：25°C、80 ml 水。先猜再試！"); setEffect({ action: "", tick: 0 }); }}>↺ 重新開始</button>
      <small>水量單位：ml（毫升）。晶粉以模型粒子量計算，一匙＝2；不是克數或配方。溫度範圍 25–85°C；水少於 15 ml 時先加水。蒸發速度、容量和晶簇顏色均為教學示意；並非所有物質都同樣隨升溫增加溶解度。晶種本身不計入晶粉量。</small>
      </aside>
    </div> : <section className="crystal-gallery"><div className="crystal-specimens">{SPECIMENS.map((s, i) => <button key={s.en} aria-pressed={specimen === i} onClick={() => setSpecimen(i)}><img src={`/images/crystals/${s.id}.webp`} alt={`${s.name}實物照片`}/><b>{s.name}</b><small>{s.en}</small></button>)}</div>
      <div className="crystal-exhibit"><figure className="crystal-photo"><motion.img key={material.id} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} src={`/images/crystals/${material.id}.webp`} alt={`${material.name}：${material.shape}實物照片`}/><figcaption>實物照片 · {material.author}<br/><a href={`https://commons.wikimedia.org/wiki/File:${material.file}`} target="_blank" rel="noreferrer">原始照片</a> · <a href={material.url} target="_blank" rel="noreferrer">{material.license}</a><br/>僅轉為 WebP，保留原圖比例</figcaption></figure>
      <div><small>{material.formula}</small><h2>{material.name} · {material.shape}</h2><p>{material.copy}</p><button onClick={() => speak(material.copy, "zh")}>🔊 聽解說</button><p className="crystal-hint">裡面的排列規則，加上各個晶面生長的快慢，決定晶體外形。不是杯子把它壓成這個形狀！</p><p>找一找：實物的晶面，和你想像的一樣嗎？</p><small>晶簇由許多晶體朝不同方向生長而成。天然水晶不是把套裝晶粉倒進熱水就能種出來。</small></div></div></section>}
    <details className="crystal-notes"><summary>給大人的實驗筆記與資料來源</summary><p>套裝照片未列晶粉成分，不能判定是磷酸二氫銨。請依原說明，由成人處理熱水和晶粉，勿品嚐。過飽和是暫時狀態，也可能自行成核；本遊戲用晶種與時間按鈕放慢過程。未溶粉末也能提供成核表面。</p><p>食鹽溶解度隨溫度變化較小；水晶（二氧化矽）的形成條件與套裝實驗不同。</p><a href="https://www.mrsec.psu.edu/education-outreach/public/nano-activities-kids/liquid-metal/growing-crystals" target="_blank" rel="noreferrer">Penn State：晶體生長</a> · <a href="https://www.jstage.jst.go.jp/article/jcrsj1940/5/1-2/5_1-2_21/_article" target="_blank" rel="noreferrer">ADP 晶體結構研究</a> · <a href="https://www.mindat.org/min-3337.html" target="_blank" rel="noreferrer">水晶晶形資料</a></details>
  </div>;
}
import { useGameBack } from "@/lib/gameBack";
