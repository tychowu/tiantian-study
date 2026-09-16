import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Star, Volume2 } from "lucide-react";
import { useState } from "react";
import BilingualText from "@/components/BilingualText";
import SpeakableZh from "@/components/SpeakableZh";
import { WEATHER_ITEMS, type WeatherItem } from "@/data/weather";
import { speak } from "@/lib/speech";

/**
 * 天氣小站長：香港天文台的天氣符號與警告信號。
 * 圖鑑模式：點符號聽說明；小測驗模式：看符號三選一，共 10 題。
 */
type QuizItem = { answer: WeatherItem; options: WeatherItem[] };

const ROUND = 10;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildQuiz = (): QuizItem[] => {
  const picks = shuffle(WEATHER_ITEMS).slice(0, ROUND);
  return picks.map((answer) => {
    const distractors = shuffle(WEATHER_ITEMS.filter((item) => item.zh !== answer.zh)).slice(0, 2);
    return { answer, options: shuffle([answer, ...distractors]) };
  });
};

export default function WeatherGame() {
  const [mode, setMode] = useState<"gallery" | "quiz">("gallery");
  const [selected, setSelected] = useState<WeatherItem | null>(null);

  const [quiz, setQuiz] = useState<QuizItem[]>(buildQuiz);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const question = quiz[Math.min(step, quiz.length - 1)];
  const finished = step + 1 >= ROUND && picked === question.answer.zh;

  const startQuiz = () => {
    setQuiz(buildQuiz());
    setStep(0);
    setPicked(null);
    setScore(0);
    setRound((current) => current + 1);
    setMode("quiz");
  };

  const choose = (option: WeatherItem) => {
    if (picked) return;
    setPicked(option.zh);
    if (option.zh === question.answer.zh) {
      setScore((current) => current + 1);
      speak(`答對了，這是${question.answer.zh}。${question.answer.factZh}`, "zh");
    } else {
      speak(`這是${question.answer.zh}。${question.answer.factZh}`, "zh");
    }
  };

  const next = () => {
    if (step + 1 >= ROUND) {
      startQuiz();
      return;
    }
    setStep((current) => current + 1);
    setPicked(null);
  };

  const weather = WEATHER_ITEMS.filter((item) => item.type === "weather");
  const warnings = WEATHER_ITEMS.filter((item) => item.type === "warning");

  return (
    <div className="game-body">
      <div className="mx-controls">
        <div className="mx-modes">
          <button type="button" className={`mx-mode ${mode === "gallery" ? "is-on" : ""}`} onClick={() => { setSelected(null); setMode("gallery"); }}>
            <span aria-hidden="true">🌤️</span>
            符號圖鑑
            <i>Gallery</i>
          </button>
          <button type="button" className={`mx-mode ${mode === "quiz" ? "is-on" : ""}`} onClick={startQuiz}>
            <span aria-hidden="true">🎯</span>
            符號小測驗
            <i>Quiz</i>
          </button>
        </div>
        <div className="mx-levels"><span>看符號，選出它的名字</span></div>
      </div>

      {mode === "gallery" && (
        <>
          <p className="lm-group"><b aria-hidden="true">☀️</b> 天氣符號</p>
          <div className="wx-grid">
            {weather.map((item) => (
              <button
                key={item.zh}
                type="button"
                className={`wx-card ${selected?.zh === item.zh ? "is-on" : ""}`}
                onClick={() => { setSelected(item); speak(`${item.zh}。${item.factZh}`, "zh"); }}
              >
                <span className={`wx-pic ${item.type === "weather" ? "is-outline" : ""}`}><img src={item.img} alt={item.zh} loading="lazy" /></span>
                <i>{item.zh}</i>
                <em>{item.en}</em>
              </button>
            ))}
          </div>
          <p className="lm-group"><b aria-hidden="true">⚠️</b> 警告信號</p>
          <div className="wx-grid">
            {warnings.map((item) => (
              <button
                key={item.zh}
                type="button"
                className={`wx-card is-warning ${selected?.zh === item.zh ? "is-on" : ""}`}
                onClick={() => { setSelected(item); speak(`${item.zh}。${item.factZh}`, "zh"); }}
              >
                <span className={`wx-pic ${item.type === "weather" ? "is-outline" : ""}`}><img src={item.img} alt={item.zh} loading="lazy" /></span>
                <i>{item.zh}</i>
                <em>{item.en}</em>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div className="wx-note" key={selected.zh} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span className={`wx-pic wx-pic-lg ${selected.type === "weather" ? "is-outline" : ""}`}><img src={selected.img} alt="" /></span>
                <div>
                  <span>{selected.zh} · {selected.en}</span>
                  <SpeakableZh text={selected.factZh} size="lg" />
                  <BilingualText text={selected.factEn} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!selected && <div className="game-notice">點一個符號，就會聽到它的名字和一句小提醒喔！</div>}
        </>
      )}

      {mode === "quiz" && (
        <>
          <div className="game-progress-strip">
            <div className="progress-track"><span style={{ width: `${(step / ROUND) * 100}%` }} /></div>
            <span><Star size={13} fill="currentColor" /> 第 {Math.min(step + 1, ROUND)} / {ROUND} 題 · 答對 {score}</span>
          </div>

          <motion.article
            className={`task-paper wx-quiz ${picked ? (picked === question.answer.zh ? "result-correct" : "result-incorrect") : ""}`}
            key={`${round}-${step}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="task-topline">
              <span>天氣任務 {String(step + 1).padStart(2, "0")}</span>
              <span>{question.answer.type === "warning" ? "警告信號" : "天氣符號"}</span>
            </div>

            <div className="wx-quiz-stage">
              <span className={`wx-pic wx-pic-lg ${question.answer.type === "weather" ? "is-outline" : ""}`} aria-hidden="true"><img src={question.answer.img} alt="" /></span>
              <p>這是什麼呢？</p>
              <button type="button" className="pt-speak" onClick={() => speak("這是什麼天氣符號呢？", "zh")} aria-label="再聽一次題目">
                <Volume2 size={14} />
              </button>
            </div>

            <div className="wx-quiz-options">
              {question.options.map((option) => (
                <button
                  key={option.zh}
                  type="button"
                  className={`pk-option ${picked ? (option.zh === question.answer.zh ? "is-right" : option.zh === picked ? "is-wrong" : "") : ""}`}
                  onClick={() => choose(option)}
                  disabled={Boolean(picked) && option.zh !== question.answer.zh && option.zh !== picked}
                >
                  <b>{option.zh}</b>
                  <i>{option.en}</i>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {picked && (
                <motion.div
                  className={`feedback ${picked === question.answer.zh ? "correct-feedback" : "incorrect-feedback"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {picked === question.answer.zh ? (
                    <>
                      <img src="/images/tiantian-success-stars_5462d800.webp" alt="" />
                      <div>
                        <span>答對了！這是{question.answer.zh}</span>
                        <p>{question.answer.factZh}</p>
                        <div className="wx-feedback-en"><BilingualText text={question.answer.factEn} /></div>
                      </div>
                      <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
                    </>
                  ) : (
                    <>
                      <div className="retry-face">?</div>
                      <div>
                        <span>正確答案是「{question.answer.zh}」</span>
                        <p>{question.answer.factZh}</p>
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
    </div>
  );
}
