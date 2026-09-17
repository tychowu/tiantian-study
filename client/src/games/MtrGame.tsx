import { AnimatePresence, motion } from "framer-motion";
import { Check, Map as MapIcon, RotateCcw, Star, Volume2, ZoomIn, ZoomOut } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { MTR_LINES, type MtrLine } from "@/data/mtrLines";
import { MTR_MAP, OFFICIAL_MAP_POSITIONS, OFFICIAL_MAP_SIZE } from "@/data/mtrMap";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

/**
 * 港鐵小車長：認識四條港鐵綫和站名（真實路綫色、站名完整）。
 * 學站名模式：點站名就會唸出來，還可以把小火車開到那一站；
 * 下一站模式：列車停在某一站，猜猜下一站是哪裡（三選一），共 10 題；
 * 鐵路地圖模式：以港鐵路綫圖為底圖，點站點就會顯示站名和可轉乘路綫。
 */
type QuizItem = {
  line: MtrLine;
  fromIndex: number;
  answer: string;
  options: string[];
};

const ROUND = 10;

type OfficialStation = {
  zh: string;
  en: string;
  x: number;
  y: number;
  lines: { key: string; zh: string; en: string; color: string }[];
};

/** 合併轉車站，避免同一位置疊上多個點擊區。 */
const OFFICIAL_STATIONS = Array.from(
  MTR_MAP.reduce((stations, line) => {
    line.stations.forEach((item) => {
      const position = OFFICIAL_MAP_POSITIONS[item.zh];
      if (!position) return;
      const existing = stations.get(item.zh);
      const lineInfo = { key: line.key, zh: line.zh, en: line.en, color: line.color };
      if (existing) existing.lines.push(lineInfo);
      else stations.set(item.zh, { zh: item.zh, en: item.en, ...position, lines: [lineInfo] });
    });
    return stations;
  }, new Map<string, OfficialStation>()).values(),
).sort((a, b) => a.zh.localeCompare(b.zh, "zh-Hant"));

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** 隨機出一題：隨機一條綫、隨機一站，答案就是它的下一站。 */
function buildQuestion(): QuizItem {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const line = MTR_LINES[randInt(0, MTR_LINES.length - 1)];
    const fromIndex = randInt(0, line.stations.length - 2);
    if (line.skipQuizFrom?.includes(fromIndex)) continue;
    const answer = line.stations[fromIndex + 1].zh;
    const others = line.stations
      .map((station) => station.zh)
      .filter((name) => name !== answer);
    const options = shuffle([answer, ...shuffle(others).slice(0, 2)]);
    return { line, fromIndex, answer, options };
  }
  // 後備題（理論上不會走到）
  const line = MTR_LINES[0];
  return { line, fromIndex: 0, answer: line.stations[1].zh, options: [line.stations[1].zh, line.stations[2].zh, line.stations[3].zh] };
}

const buildQuiz = (): QuizItem[] => Array.from({ length: ROUND }, buildQuestion);

export default function MtrGame() {
  const [mode, setMode] = useState<"learn" | "quiz" | "map">("map");
  const [lineKey, setLineKey] = useState(MTR_LINES[0].key);
  const [trainAt, setTrainAt] = useState(0);

  const [quiz, setQuiz] = useState<QuizItem[]>(buildQuiz);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [round, setRound] = useState(0);

  const [mapPick, setMapPick] = useState<OfficialStation | null>(null);
  const [mapZoom, setMapZoom] = useState(1);

  const line = MTR_LINES.find((item) => item.key === lineKey)!;
  const question = quiz[Math.min(step, quiz.length - 1)];
  const finished = step + 1 >= ROUND && picked === question.answer;

  const startQuiz = () => {
    setQuiz(buildQuiz());
    setStep(0);
    setPicked(null);
    setScore(0);
    setArrived(false);
    setRound((current) => current + 1);
    setMode("quiz");
  };

  const choose = (option: string) => {
    if (picked) return;
    setPicked(option);
    if (option === question.answer) {
      setScore((current) => current + 1);
      setArrived(true);
      playCorrect();
      speak(`${question.line.stations[question.fromIndex].zh}，下一站，${option}`, "zh");
    } else {
      playWrong();
      speak(`不是喔，下一站是${question.answer}`, "zh");
    }
  };

  const next = () => {
    if (step + 1 >= ROUND) {
      startQuiz();
      return;
    }
    setStep((current) => current + 1);
    setPicked(null);
    setArrived(false);
  };

  /** 學習模式：點站名就唸出來，小火車也開過去。 */
  const tapStation = (name: string, index: number) => {
    setTrainAt(index);
    speak(name, "zh");
  };

  /** 地圖模式：點站點顯示站名並朗讀 */
  const tapMapStation = (station: OfficialStation) => {
    setMapPick(station);
    speak(station.zh, "zh");
  };

  return (
    <div className={`game-body ${mode === "map" ? "mtr-game-body" : ""}`}>
      <div className="mx-controls">
        <div className="mx-modes">
          <button type="button" className={`mx-mode ${mode === "map" ? "is-on" : ""}`} onClick={() => setMode("map")}>
            <span aria-hidden="true">🗺️</span>
            全港鐵路地圖
            <i>Map</i>
          </button>
          <button type="button" className={`mx-mode ${mode === "learn" ? "is-on" : ""}`} onClick={() => setMode("learn")}>
            <span aria-hidden="true">🎧</span>
            學站名
            <i>Learn</i>
          </button>
          <button type="button" className={`mx-mode ${mode === "quiz" ? "is-on" : ""}`} onClick={startQuiz}>
            <span aria-hidden="true">🚆</span>
            下一站是哪裡
            <i>Quiz</i>
          </button>
        </div>
        <div className="mx-levels"><span>點站名就會唸給你聽</span></div>
      </div>

      {mode === "learn" && (
        <>
          <div className="mtr-lines">
            {MTR_LINES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`mtr-line-chip ${item.key === lineKey ? "is-on" : ""}`}
                style={{ "--line": item.color, "--line-tint": item.tint } as CSSProperties}
                onClick={() => { setLineKey(item.key); setTrainAt(0); speak(item.zh, "zh"); }}
              >
                <span className="mtr-line-swatch" aria-hidden="true" />
                {item.zh}
              </button>
            ))}
          </div>

          <div className="mtr-map" style={{ "--line": line.color, "--line-tint": line.tint } as CSSProperties}>
            <div className="mtr-map-head">
              <b>{line.zh}</b>
              <i>{line.en}</i>
              <em>共 {line.stations.length} 站</em>
            </div>
            {line.stations.map((station, index) => (
              <div key={station.zh} className={`mtr-stop ${index === trainAt ? "is-here" : ""}`}>
                <span className="mtr-dot" aria-hidden="true">
                  <AnimatePresence>{index === trainAt && <motion.span key="train" className="mtr-train" initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .4, opacity: 0 }}>🚆</motion.span>}</AnimatePresence>
                </span>
                <button type="button" className="mtr-stop-btn" onClick={() => tapStation(station.zh, index)}>
                  <b>{station.zh}</b>
                  <i>{station.en}{station.note ? `（${station.note}）` : ""}</i>
                </button>
                <button type="button" className="pt-speak" onClick={() => speak(station.zh, "zh")} aria-label={`聆聽 ${station.zh}`}>
                  <Volume2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="game-notice">小火車現在停在「{line.stations[trainAt].zh}」。點別的站名，火車就會開過去！</div>
        </>
      )}

      {mode === "quiz" && (
        <>
          <div className="game-progress-strip">
            <div className="progress-track"><span style={{ width: `${(step / ROUND) * 100}%` }} /></div>
            <span><Star size={13} fill="currentColor" /> 第 {Math.min(step + 1, ROUND)} / {ROUND} 題 · 答對 {score}</span>
          </div>

          <motion.article
            className={`task-paper mtr-quiz ${picked ? (picked === question.answer ? "result-correct" : "result-incorrect") : ""}`}
            key={`${round}-${step}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="task-topline">
              <span>列車任務 {String(step + 1).padStart(2, "0")}</span>
              <span>{question.line.zh}</span>
            </div>

            <div className="mtr-quiz-row">
              <div className="mtr-quiz-now">
                <span aria-hidden="true">📍</span>
                <div>
                  <b>現在</b>
                  <i>{question.line.stations[question.fromIndex].zh}</i>
                </div>
              </div>
              <div className="mtr-quiz-arrow" aria-hidden="true">{arrived ? "🚆" : "➜"}</div>
              <div className={`mtr-quiz-next ${arrived ? "is-arrived" : ""}`}>
                <span aria-hidden="true">{arrived ? "✅" : "❓"}</span>
                <div>
                  <b>下一站</b>
                  <i>{arrived ? question.answer : "？？？"}</i>
                </div>
              </div>
            </div>

            <div className="mtr-quiz-options">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`pk-option ${picked ? (option === question.answer ? "is-right" : option === picked ? "is-wrong" : "") : ""}`}
                  onClick={() => choose(option)}
                  disabled={Boolean(picked) && option !== question.answer && option !== picked}
                >
                  <b>{option}</b>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {picked && (
                <motion.div
                  className={`feedback ${picked === question.answer ? "correct-feedback" : "incorrect-feedback"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {picked === question.answer ? (
                    <>
                      <img src="/images/tiantian-success-stars_5462d800.webp" alt="" />
                      <div>
                        <span>嘟嘟！到站了</span>
                        <p>{question.line.stations[question.fromIndex].zh} → {question.answer}，你答對了！</p>
                      </div>
                      <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
                    </>
                  ) : (
                    <>
                      <div className="retry-face">?</div>
                      <div>
                        <span>下一站是「{question.answer}」</span>
                        <p>再聽一次：{question.line.stations[question.fromIndex].zh} 的下一站是 {question.answer}。</p>
                      </div>
                      <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>

          <div className="lesson-footer">
            <button className="nav-question" onClick={startQuiz}><RotateCcw size={17} /> 重新開始</button>
            <span>累計答對 <b>{score}</b> 題</span>
            <button className="nav-question" onClick={next} disabled={!picked}>下一題 →</button>
          </div>
        </>
      )}

      {mode === "map" && (
        <>
          <div className="mtr-official-toolbar">
            <div className="mtr-zoom-controls" aria-label="地圖縮放">
              <button type="button" onClick={() => setMapZoom((value) => Math.max(1, +(value - .35).toFixed(2)))} disabled={mapZoom <= 1} aria-label="縮小地圖"><ZoomOut size={19} /></button>
              <span>{Math.round(mapZoom * 100)}%</span>
              <button type="button" onClick={() => setMapZoom((value) => Math.min(1.7, +(value + .35).toFixed(2)))} disabled={mapZoom >= 1.7} aria-label="放大地圖"><ZoomIn size={19} /></button>
            </div>
          </div>
          {mapPick && (
            <motion.div className="mtr-picked-station" key={mapPick.zh} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
              <span className="mtr-picked-pin" aria-hidden="true">📍</span>
              <div><b>{mapPick.zh}</b><i>{mapPick.en}</i></div>
              <div className="mtr-picked-lines">
                {mapPick.lines.map((item) => <span key={item.key} style={{ "--line": item.color } as CSSProperties}>{item.zh}</span>)}
              </div>
              <button type="button" onClick={() => speak(mapPick.zh, "zh")} aria-label={`聆聽 ${mapPick.zh}`}><Volume2 size={18} /></button>
            </motion.div>
          )}
          <div className="mtr-fullmap" aria-label="可縮放的全港港鐵互動路綫圖">
            <div className="mtr-official-canvas" style={{ width: `${mapZoom * 100}%` }}>
              <img src="/images/mtr-routemap-2024.jpg" alt="港鐵全港路綫圖，包含重鐵、機場快綫、迪士尼綫和輕鐵" draggable={false} />
              <svg viewBox={`0 138 ${OFFICIAL_MAP_SIZE.width} ${OFFICIAL_MAP_SIZE.height - 138}`} role="group" aria-label="可點擊的港鐵站點">
                {OFFICIAL_STATIONS.map((station) => {
                  const active = mapPick?.zh === station.zh;
                  return (
                    <g
                      key={station.zh}
                      className={`mtr-map-station ${active ? "is-active" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${station.zh} ${station.en}，${station.lines.map((item) => item.zh).join("、")}`}
                      onClick={() => tapMapStation(station)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          tapMapStation(station);
                        }
                      }}
                    >
                      <circle className="mtr-station-hit" cx={station.x} cy={station.y} r="22" />
                      <circle className="mtr-station-focus" cx={station.x} cy={station.y} r={active ? 15 : 11} />
                      <title>{`${station.zh} ${station.en}（${station.lines.map((item) => item.zh).join("、")}）`}</title>
                    </g>
                  );
                })}
                {mapPick && (() => {
                  const labelWidth = 176;
                  const labelHeight = 70;
                  const labelX = Math.min(Math.max(mapPick.x - labelWidth / 2, 20), OFFICIAL_MAP_SIZE.width - labelWidth - 20);
                  const labelY = mapPick.y < 245 ? mapPick.y + 38 : mapPick.y - 88;
                  return <g className="mtr-selected-label" aria-hidden="true">
                    <rect x={labelX} y={labelY} width={labelWidth} height={labelHeight} rx="15" />
                    <text x={labelX + labelWidth / 2} y={labelY + 27} textAnchor="middle" dominantBaseline="middle" className="is-zh">{mapPick.zh}</text>
                    <text x={labelX + labelWidth / 2} y={labelY + 51} textAnchor="middle" dominantBaseline="middle" className="is-en">{mapPick.en}</text>
                  </g>;
                })()}
              </svg>
            </div>
          </div>
          <div className="game-notice"><MapIcon size={14} /> 點一下地圖上的站點，就會放大顯示、朗讀站名和轉乘路綫！</div>
        </>
      )}
    </div>
  );
}
