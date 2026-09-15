import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Star, Volume2, X } from "lucide-react";
import { useMemo, useState } from "react";
import BilingualText from "@/components/BilingualText";
import SpeakableZh from "@/components/SpeakableZh";
import { LANDMARKS, type Landmark } from "@/data/landmarks";
import { speak } from "@/lib/speech";

/**
 * 名勝探險：中國與香港的著名景點和博物館。
 * 圖鑑模式：點卡片看雙語詳情（逐字點讀）；
 * 小測驗模式：看 emoji 提示，三選一猜名稱，共 10 題。
 */
type QuizQuestion = { answer: Landmark; options: Landmark[] };

const ROUND = 10;
const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildQuiz = (): QuizQuestion[] => {
  const picks = shuffle(LANDMARKS).slice(0, ROUND);
  return picks.map((answer) => {
    const distractors = shuffle(LANDMARKS.filter((item) => item.zh !== answer.zh)).slice(0, 2);
    return { answer, options: shuffle([answer, ...distractors]) };
  });
};

export default function LandmarkGame() {
  const [mode, setMode] = useState<"gallery" | "quiz">("gallery");
  const [selected, setSelected] = useState<Landmark | null>(null);

  const [quiz, setQuiz] = useState<QuizQuestion[]>(buildQuiz);
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

  const choose = (option: Landmark) => {
    if (picked) return;
    setPicked(option.zh);
    if (option.zh === question.answer.zh) {
      setScore((current) => current + 1);
      speak(`答對了，這是${question.answer.zh}。${question.answer.introZh.split("。")[0]}。`, "zh");
    } else {
      speak(`這是${question.answer.zh}，再看看吧。`, "zh");
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

  const china = LANDMARKS.filter((item) => item.region === "china");
  const hongkong = LANDMARKS.filter((item) => item.region === "hongkong");

  return (
    <div className="game-body">
      <div className="mx-controls">
        <div className="mx-modes">
          <button type="button" className={`mx-mode ${mode === "gallery" ? "is-on" : ""}`} onClick={() => { setSelected(null); setMode("gallery"); }}>
            <span aria-hidden="true">🗺️</span>
            名勝圖鑑
            <i>Gallery</i>
          </button>
          <button type="button" className={`mx-mode ${mode === "quiz" ? "is-on" : ""}`} onClick={startQuiz}>
            <span aria-hidden="true">🧩</span>
            名勝小測驗
            <i>Quiz</i>
          </button>
        </div>
        <div className="mx-levels"><span>點卡片聽介紹，點字看翻譯</span></div>
      </div>

      {mode === "gallery" && (
        <>
          <p className="lm-group"><b aria-hidden="true">🐉</b> 中國的名勝</p>
          <div className="lm-grid">
            {china.map((item) => (
              <button key={item.zh} type="button" className="lm-card" onClick={() => { setSelected(item); speak(item.zh, "zh"); }}>
                <b aria-hidden="true">{item.icon}</b>
                <i>{item.zh}</i>
                <em>{item.en}</em>
              </button>
            ))}
          </div>
          <p className="lm-group"><b aria-hidden="true">⛵</b> 香港的名勝</p>
          <div className="lm-grid">
            {hongkong.map((item) => (
              <button key={item.zh} type="button" className="lm-card" onClick={() => { setSelected(item); speak(item.zh, "zh"); }}>
                <b aria-hidden="true">{item.icon}</b>
                <i>{item.zh}</i>
                <em>{item.en}</em>
              </button>
            ))}
          </div>
          <div className="game-notice">點任何一張卡片，就會聽到它的名字，還可以看到小介紹喔！</div>
        </>
      )}

      {mode === "quiz" && (
        <>
          <div className="game-progress-strip">
            <div className="progress-track"><span style={{ width: `${(step / ROUND) * 100}%` }} /></div>
            <span><Star size={13} fill="currentColor" /> 第 {Math.min(step + 1, ROUND)} / {ROUND} 題 · 答對 {score}</span>
          </div>
          <motion.article
            className={`task-paper lm-quiz ${picked ? (picked === question.answer.zh ? "result-correct" : "result-incorrect") : ""}`}
            key={`${round}-${step}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="paper-tape tape-left" aria-hidden="true" />
            <span className="paper-tape tape-right" aria-hidden="true" />
            <div className="task-topline"><span>名勝任務 {String(step + 1).padStart(2, "0")}</span><span>猜猜這是哪裡？</span></div>
            <div className="lm-quiz-stage">
              <span className="lm-quiz-icon" aria-hidden="true">{question.answer.icon}</span>
              <SpeakableZh text={question.answer.introZh.split("。")[0] + "。"} />
            </div>
            <div className="lm-quiz-options">
              {question.options.map((option) => (
                <button
                  key={option.zh}
                  type="button"
                  className={`pk-option ${picked ? (option.zh === question.answer.zh ? "is-right" : option.zh === picked ? "is-wrong" : "") : ""}`}
                  onClick={() => choose(option)}
                  disabled={Boolean(picked) && option.zh !== question.answer.zh && option.zh !== picked}
                >
                  <span aria-hidden="true">{option.icon}</span>
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
                        <p><BilingualText text={question.answer.introEn} /></p>
                      </div>
                      <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
                    </>
                  ) : (
                    <>
                      <div className="retry-face">?</div>
                      <div>
                        <span>正確答案是「{question.answer.zh}」</span>
                        <p>{question.answer.introZh.split("。")[0]}。再猜下一個！</p>
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

      <AnimatePresence>
        {selected && (
          <motion.div className="pt-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="pt-detail-card lm-detail" initial={{ scale: .94, y: 16 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 24 }} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="pt-close" onClick={() => setSelected(null)} aria-label="關閉"><X size={20} /></button>
              <div className="lm-detail-hero">
                <span className="lm-detail-icon" aria-hidden="true">{selected.icon}</span>
                <div className="pt-name-row">
                  <h3 className="pt-name-zh">{selected.zh}</h3>
                  <button type="button" className="pt-speak" onClick={() => speak(selected.zh, "zh")} aria-label={`聆聽 ${selected.zh}`}><Volume2 size={14} /></button>
                </div>
                <p className="pt-en-name">
                  {selected.en}
                  <button type="button" className="pt-speak" onClick={() => speak(selected.en, "en")} aria-label={`聆聽 ${selected.en}`}><Volume2 size={14} /></button>
                </p>
              </div>
              <div className="pt-section lm-detail-body">
                <span className="pt-label">小介紹 · About</span>
                <div className="pt-fact-group">
                  <SpeakableZh text={selected.introZh} size="lg" />
                  <BilingualText text={selected.introEn} size="lg" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
