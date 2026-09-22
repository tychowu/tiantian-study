import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Eye, Fan, FlaskConical, Pause, Play, Snowflake, Sparkles, ThermometerSun, Waves } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

type WaterState = "ice" | "melting" | "water" | "boiling";
type Prediction = WaterState | null;

const LEVELS = [
  ["溫度校準", "Temperature"],
  ["0°C 融化點", "Melting point"],
  ["室溫也蒸發", "Evaporation"],
  ["100°C 沸騰", "Boiling point"],
  ["蒸氣變水滴", "Condensation"],
  ["粒子守恆", "Conservation"],
  ["公平測試", "Fair test"],
  ["自由實驗", "Free lab"],
] as const;

const STATE_COPY: Record<WaterState, { zh: string; en: string; note: string }> = {
  ice: { zh: "固態冰", en: "Solid ice", note: "粒子排列整齊，只在原位附近振動。" },
  melting: { zh: "冰＋液態水", en: "Melting", note: "在 0°C，冰和水可以同時存在。" },
  water: { zh: "液態水", en: "Liquid water", note: "粒子靠得很近，但能互相滑過。" },
  boiling: { zh: "水＋水蒸氣", en: "Boiling", note: "在 1 atm 下，100°C 起水的內部也形成氣泡。" },
};

const PARTICLES = Array.from({ length: 36 }, (_, id) => ({
  id,
  liquidX: 8 + ((id * 31) % 85),
  liquidY: 53 + ((id * 19) % 39),
  gasX: 7 + ((id * 43) % 87),
  gasY: 8 + ((id * 29) % 76),
  delay: (id % 9) * .06,
}));

function getWaterState(temperature: number): WaterState {
  if (temperature < 0) return "ice";
  if (temperature === 0) return "melting";
  if (temperature < 100) return "water";
  return "boiling";
}

function ParticleLens({ temperature, paused, lid, tracked }: { temperature: number; paused: boolean; lid: boolean; tracked: boolean }) {
  const state = getWaterState(temperature);
  const gasCount = state === "boiling" ? 14 : state === "water" ? Math.min(5, Math.floor((temperature + 15) / 24)) : state === "melting" ? 1 : 0;
  return (
    <div className={`particle-lens is-${state} ${paused ? "is-paused" : ""}`}>
      <div className="lens-title"><Eye size={15} /><span>粒子鏡頭 <i>Particle view</i></span></div>
      <div className="particle-field">
        {PARTICLES.map((particle) => {
          const inGas = particle.id >= PARTICLES.length - gasCount;
          const inIce = state === "ice" || (state === "melting" && particle.id < 18);
          const left = inIce ? 18 + (particle.id % 6) * 12.5 : inGas ? particle.gasX : particle.liquidX;
          const top = inIce ? 57 + Math.floor((particle.id % 36) / 6) * 6.7 : inGas ? particle.gasY : particle.liquidY;
          const travel = Math.max(.4, (temperature + 25) / 65);
          return <motion.i key={particle.id} className={`${inGas ? "is-gas" : ""} ${tracked && particle.id === 9 ? "is-tracked" : ""}`} style={{ left: `${left}%`, top: `${top}%` }} animate={paused ? undefined : inIce ? { x: [-1, 1, -1], y: [0, -1, 0] } : inGas ? { x: [-9 * travel, 8 * travel, -4 * travel], y: [8, -12, 6] } : { x: [-5 * travel, 6 * travel, -3 * travel], y: [3, -4, 2] }} transition={{ duration: inIce ? .55 : inGas ? .9 : 1.35, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}><b /><em /><span /></motion.i>;
        })}
        {lid && temperature >= 65 && <div className="lens-condensation">冷卻後聚在一起</div>}
      </div>
      <div className="particle-key"><span><i />一個水分子 H₂O</span><b>{state === "boiling" ? "液體內也有氣泡" : state === "water" ? "表面少量粒子會逃走" : "粒子沒有消失"}</b></div>
    </div>
  );
}

function Beaker({ temperature, lid, surface, airflow }: { temperature: number; lid: boolean; surface: "narrow" | "wide"; airflow: boolean }) {
  const state = getWaterState(temperature);
  const hot = temperature >= 100;
  return (
    <div className={`macro-lab is-${state} is-${surface}`}>
      <div className="macro-title"><FlaskConical size={15} /><span>眼睛看到 <i>Macroscopic view</i></span></div>
      {airflow && <motion.div className="lab-air" animate={{ x: [-4, 8, -4] }} transition={{ repeat: Infinity, duration: 1.1 }}><Fan size={28} /><i /><i /><i /></motion.div>}
      <div className="lab-stand">
        {lid && <div className="beaker-lid"><span>{temperature >= 65 ? "冷蓋" : "透明蓋"}</span>{temperature >= 65 && Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>}
        <div className="beaker">
          {state !== "ice" && <motion.div className="beaker-water" initial={false} animate={{ height: surface === "wide" ? "43%" : "55%" }}>
            <i className="water-surface" />
            {hot && Array.from({ length: 12 }, (_, i) => <motion.b key={i} style={{ left: `${8 + (i * 37) % 82}%` }} animate={{ y: [80 + (i % 4) * 10, -10], scale: [.45, 1.15], opacity: [0, .8, 0] }} transition={{ repeat: Infinity, duration: 1.25 + (i % 3) * .22, delay: (i % 6) * .17 }} />)}
          </motion.div>}
          {(state === "ice" || state === "melting") && <div className="ice-cubes">{Array.from({ length: state === "ice" ? 7 : 4 }, (_, i) => <motion.i key={i} animate={{ y: state === "melting" ? [0, -4, 0] : 0, rotate: [i * 5 - 8, i * 5 - 4, i * 5 - 8] }} transition={{ repeat: Infinity, duration: 2 + i * .08 }} />)}</div>}
          <div className="beaker-shine" />
        </div>
        <div className="hotplate"><span className={temperature > 25 ? "is-hot" : ""} /><b>{temperature}°C</b></div>
      </div>
      {temperature > 0 && <div className={`vapor-path ${hot ? "is-boiling" : ""}`}>{Array.from({ length: hot ? 7 : 3 }, (_, i) => <motion.i key={i} animate={{ y: [5, -72], x: [0, i % 2 ? 12 : -10], opacity: [0, .72, 0] }} transition={{ repeat: Infinity, duration: hot ? 1.7 : 3.4, delay: i * .34 }} />)}</div>}
      <div className="macro-caption">{state === "ice" ? "看得見冰塊" : state === "melting" ? "冰正在變成水" : hot ? "整杯水翻滾、冒泡" : "水面平靜，仍會慢慢蒸發"}</div>
    </div>
  );
}

export default function MatterLabGame() {
  const [level, setLevel] = useState(0);
  useGameBack(level !== 0, () => setLevel(0));
  const [temperature, setTemperature] = useState(22);
  const [prediction, setPrediction] = useState<Prediction>(null);
  const [revealed, setRevealed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lid, setLid] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [surface, setSurface] = useState<"narrow" | "wide">("narrow");
  const [airflow, setAirflow] = useState(false);

  const state = getWaterState(temperature);
  const stateCopy = STATE_COPY[state];
  const sliderProgress = ((temperature + 20) / 140) * 100;
  const evaporationScore = useMemo(() => temperature <= 0 ? 0 : Math.min(100, Math.round(8 + temperature * .48 + (surface === "wide" ? 22 : 0) + (airflow ? 18 : 0) + (temperature >= 100 ? 25 : 0))), [temperature, surface, airflow]);
  const escapedParticles = !lid && temperature > 0 ? Math.min(12, Math.floor(evaporationScore / 10)) : 0;

  const configureLevel = (next: number) => {
    setLevel(next); setPrediction(null); setRevealed(false); setPaused(false); setTracked(false); setSurface("narrow"); setAirflow(false);
    setLid(next === 4 || next === 5);
    setTemperature([22, 0, 42, 100, 100, 100, 42, 22][next]);
  };
  const choosePrediction = (next: WaterState) => { setPrediction(next); setRevealed(false); speak(`我猜是${STATE_COPY[next].zh}`, "zh"); };
  const reveal = () => { setRevealed(true); prediction === state ? playCorrect() : playWrong(); };


  return (
    <div className="game-body science-game matter-game matter-redesign">
      <nav className="science-levels" aria-label="物質粒子實驗室關卡">{LEVELS.map(([zh, en], index) => <button key={zh} type="button" className={level === index ? "is-on" : ""} onClick={() => configureLevel(index)}><em>{index + 1}</em><span><b>{zh}</b><i>{en}</i></span></button>)}</nav>

      <section className="matter-dashboard">
        <div className="matter-observation">
          <div className="matter-toolbar"><span>1 atm · 標準大氣壓</span><button onClick={() => setPaused((value) => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? "播放" : "暫停"}</button><button className={tracked ? "is-on" : ""} onClick={() => setTracked((value) => !value)}><Eye size={16} />追蹤一粒 H₂O</button></div>
          <div className="matter-two-views"><Beaker temperature={temperature} lid={lid} surface={surface} airflow={airflow} /><ParticleLens temperature={temperature} paused={paused} lid={lid} tracked={tracked} /></div>
          <div className="phase-readout"><div className={`phase-symbol is-${state}`}>{state === "ice" ? "🧊" : state === "melting" ? "🧊💧" : state === "water" ? "💧" : "♨️"}</div><div><small>此刻的狀態 · Current state</small><strong>{stateCopy.zh}</strong><i>{stateCopy.en}</i><p>{stateCopy.note}</p></div><b className="phase-temperature">{temperature}<span>°C</span></b></div>
        </div>

        <aside className="matter-controls-new">
          <div className="matter-temperature-control">
            <div><ThermometerSun size={20} /><span><b>溫度</b><i>Temperature</i></span><strong>{temperature}°C</strong></div>
            <input aria-label="水的溫度" type="range" min="-20" max="120" step="1" value={temperature} style={{ "--temp": `${sliderProgress}%` } as CSSProperties} onChange={(event) => { setTemperature(Number(event.target.value)); setRevealed(false); }} />
            <div className="temperature-marks"><span>−20<br /><i>冰</i></span><span>0<br /><i>融化</i></span><span>42<br /><i>液態水</i></span><span>100<br /><i>沸騰</i></span><span>120</span></div>
            <div className="temperature-presets">{[-10, 0, 22, 42, 99, 100].map((value) => <button key={value} className={temperature === value ? "is-on" : ""} onClick={() => { setTemperature(value); setRevealed(false); }}>{value}°</button>)}</div>
          </div>

          {level <= 3 && <div className="matter-prediction"><small>先猜一猜 · Prediction</small><p>在 {temperature}°C、1 atm 下，水樣本最合適的描述是？</p><div>{(["ice", "melting", "water", "boiling"] as WaterState[]).map((item) => <button key={item} className={prediction === item ? "is-on" : ""} onClick={() => choosePrediction(item)}><span>{item === "ice" ? "🧊" : item === "melting" ? "🧊💧" : item === "water" ? "💧" : "♨️"}</span><b>{STATE_COPY[item].zh}</b></button>)}</div><button className="science-primary" disabled={!prediction} onClick={reveal}><Sparkles size={17} />揭曉並解釋</button></div>}

          {(level >= 2 || level === 7) && <div className="matter-variable-card"><small>實驗條件 · Variables</small><div className="matter-variable-grid"><button className={lid ? "is-on" : ""} onClick={() => setLid((value) => !value)}><span>{lid ? "🔒" : "🫙"}</span><b>{lid ? "密閉" : "開放"}</b><i>{lid ? "Closed" : "Open"}</i></button><button className={surface === "wide" ? "is-on" : ""} onClick={() => setSurface((value) => value === "wide" ? "narrow" : "wide")}><Waves size={23} /><b>{surface === "wide" ? "寬水面" : "窄水面"}</b><i>Surface area</i></button><button className={airflow ? "is-on" : ""} onClick={() => setAirflow((value) => !value)}><Fan size={23} /><b>{airflow ? "有氣流" : "無氣流"}</b><i>Airflow</i></button></div></div>}

          <div className="matter-data-card"><small>觀察數據 · Evidence</small><dl><div><dt>模型粒子總數</dt><dd>36</dd></div><div><dt>容器內／蓋上</dt><dd>{36 - escapedParticles}</dd></div><div><dt>離開畫面</dt><dd>{escapedParticles}</dd></div><div><dt>蒸發趨勢</dt><dd><span className="evaporation-bar"><i style={{ width: `${evaporationScore}%` }} /></span>{evaporationScore < 30 ? "慢" : evaporationScore < 70 ? "較快" : "快"}</dd></div></dl><p>{lid ? "密閉系統：蒸發的粒子會留在系統內，總數仍是 36。" : "開放系統：離開畫面的粒子不是消失，而是進入周圍空氣。"}</p></div>
          {level === 6 && <div className="fair-test-note"><Check size={19} /><div><b>公平測試檢查</b><p>比較前先固定兩個條件，只改「溫度、面積、氣流」其中一個。</p></div></div>}
          {level === 4 && <div className="condense-note"><Snowflake size={20} /><div><b>凝結 · Condensation</b><p>氣態 H₂O 失去能量，靠近並形成液態水滴。</p></div></div>}
          <AnimatePresence>{revealed && prediction && <motion.div className={`matter-result ${prediction === state ? "is-right" : "is-learning"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Check size={20} /><div><b>{prediction === state ? "預測正確！" : "預測不同，正好可以修正模型。"}</b><span>{temperature}°C 是「{stateCopy.zh}」。{stateCopy.note}</span></div></motion.div>}</AnimatePresence>
        </aside>
      </section>
      <footer className="science-footer"><button disabled={level === 0} onClick={() => configureLevel(level - 1)}><ChevronLeft />上一關</button><span>水蒸氣是看不見的氣體；白霧其實是細小液滴。</span><button disabled={level === LEVELS.length - 1} onClick={() => configureLevel(level + 1)}>下一關<ChevronRight /></button></footer>
    </div>
  );
}
import { useGameBack } from "@/lib/gameBack";
