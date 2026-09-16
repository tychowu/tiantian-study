import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Star, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BilingualText from "@/components/BilingualText";
import SpeakableZh from "@/components/SpeakableZh";
import { LANDMARKS, type Landmark } from "@/data/landmarks";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

/**
 * 名勝探險：中國內地與香港的著名景點和博物館（真實照片圖鑑）。
 * 小測驗：只讀一句英文提示（無圖），三個純文字選項（中英地名，無圖無 icon）；
 * 第一次答錯不會公佈答案，可以再試一次；答對放煙花，綠色框只顯示中文。
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

/** 煙花：答對時全螢幕慶祝（純 CSS 粒子） */
function Fireworks({ onDone }: { onDone: () => void }) {
  const bursts = useMemo(
    () =>
      Array.from({ length: 5 }, (_, b) => ({
        left: 12 + Math.random() * 76,
        top: 10 + Math.random() * 55,
        delay: b * 0.22,
        hue: [8, 35, 45, 200, 330][b % 5],
        particles: Array.from({ length: 14 }, (_, i) => {
          const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
          const dist = 60 + Math.random() * 70;
          return {
            tx: `${Math.cos(angle) * dist}px`,
            ty: `${Math.sin(angle) * dist}px`,
          };
        }),
      })),
    [],
  );
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return (
    <div className="fw-layer" aria-hidden="true">
      {bursts.map((burst, b) => (
        <div key={b} className="fw-burst" style={{ left: `${burst.left}%`, top: `${burst.top}%`, animationDelay: `${burst.delay}s` }}>
          {burst.particles.map((p, i) => (
            <span
              key={i}
              className="fw-particle"
              style={{ background: `hsl(${burst.hue} 90% 60%)`, ["--tx" as string]: p.tx, ["--ty" as string]: p.ty, animationDelay: `${burst.delay}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LandmarkGame() {
  const [mode, setMode] = useState<"gallery" | "quiz">("gallery");
  const [region, setRegion] = useState<"mainland" | "hongkong">("mainland");
  const [selected, setSelected] = useState<Landmark | null>(null);

  const [quiz, setQuiz] = useState<QuizQuestion[]>(buildQuiz);
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [fireworks, setFireworks] = useState(false);

  const question = quiz[Math.min(step, quiz.length - 1)];
  const finished = step + 1 >= ROUND && solved;

  const startQuiz = () => {
    setQuiz(buildQuiz());
    setStep(0);
    setSolved(false);
    setWrongPicks([]);
    setShowAnswer(false);
    setScore(0);
    setFireworks(false);
    setRound((current) => current + 1);
    setMode("quiz");
  };

  const choose = (option: Landmark) => {
    if (solved || wrongPicks.includes(option.zh) || showAnswer) return;
    if (option.zh === question.answer.zh) {
      setSolved(true);
      setScore((current) => current + 1);
      setFireworks(true);
      playCorrect();
      speak(`答對了！這是${question.answer.zh}。${question.answer.introZh.split("。")[0]}。`, "zh");
    } else {
      const nextWrong = [...wrongPicks, option.zh];
      setWrongPicks(nextWrong);
      playWrong();
      // 已經錯過一次：這次不再給機會，公佈答案後繼續
      if (nextWrong.length >= 2) {
        setShowAnswer(true);
        speak(`差一點點。答案是${question.answer.zh}。`, "zh");
      } else {
        speak(`不對喔，再試一次！`, "zh");
      }
    }
  };

  const next = () => {
    if (step + 1 >= ROUND) {
      startQuiz();
      return;
    }
    setStep((current) => current + 1);
    setSolved(false);
    setWrongPicks([]);
    setShowAnswer(false);
  };

  const mainland = LANDMARKS.filter((item) => item.region === "mainland");
  const hongkong = LANDMARKS.filter((item) => item.region === "hongkong");

  return (
    <div className="game-body">
      {fireworks && <Fireworks onDone={() => setFireworks(false)} />}

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
          {/* 內地與香港分開兩個標籤 */}
          <div className="lm-tabs">
            <button
              type="button"
              className={`lm-tab ${region === "mainland" ? "is-on" : ""}`}
              onClick={() => { setRegion("mainland"); setSelected(null); }}
            >
              🐉 中國內地的名勝 <i>{mainland.length}</i>
            </button>
            <button
              type="button"
              className={`lm-tab ${region === "hongkong" ? "is-on" : ""}`}
              onClick={() => { setRegion("hongkong"); setSelected(null); }}
            >
              ⛵ 香港的名勝 <i>{hongkong.length}</i>
            </button>
          </div>
          <div className="lm-grid">
            {(region === "mainland" ? mainland : hongkong).map((item) => (
              <button key={item.zh} type="button" className="lm-card" onClick={() => { setSelected(item); speak(item.zh, "zh"); }}>
                <span className="lm-photo"><img src={item.photo} alt={item.zh} loading="lazy" /></span>
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
            className={`task-paper lm-quiz ${solved ? "result-correct" : wrongPicks.length && !showAnswer ? "result-incorrect" : ""}`}
            key={`${round}-${step}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="task-topline"><span>名勝任務 {String(step + 1).padStart(2, "0")}</span><span>猜猜這是哪裡？</span></div>
            {/* 題目：只有一句英文，沒有圖片 */}
            <div className="lm-quiz-clue">
              <BilingualText text={question.answer.clueEn} size="lg" />
            </div>
            {/* 選項：只有中英文地名，沒有圖片與圖示 */}
            <div className="lm-quiz-options">
              {question.options.map((option) => {
                const isRight = solved && option.zh === question.answer.zh;
                const isWrongPick = wrongPicks.includes(option.zh);
                return (
                  <button
                    key={option.zh}
                    type="button"
                    className={`pk-option lm-quiz-option ${isRight ? "is-right" : ""} ${isWrongPick ? "is-wrong" : ""}`}
                    onClick={() => choose(option)}
                    disabled={solved || isWrongPick || showAnswer}
                  >
                    <b>{option.zh}</b>
                    <i>{option.en}</i>
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {/* 答對：綠色框只放中文，不放任何英文 */}
              {solved && (
                <motion.div
                  className="feedback correct-feedback"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <img src="/images/tiantian-success-stars_5462d800.webp" alt="" />
                  <div>
                    <span>答對了！這是{question.answer.zh}。</span>
                    <p>{question.answer.introZh.split("。")[0]}。</p>
                  </div>
                  <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
                </motion.div>
              )}
              {/* 第一次答錯：不公佈答案，再給一次機會 */}
              {wrongPicks.length === 1 && !solved && (
                <motion.div
                  className="feedback incorrect-feedback"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="retry-face">?</div>
                  <div>
                    <span>不對喔，再試一次！</span>
                    <p>還有兩個選擇，想一想再選。</p>
                  </div>
                </motion.div>
              )}
              {/* 兩次都錯：公佈答案 */}
              {showAnswer && (
                <motion.div
                  className="feedback incorrect-feedback"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="retry-face">?</div>
                  <div>
                    <span>差一點點，答案是「{question.answer.zh}」。</span>
                    <p>{question.answer.introZh.split("。")[0]}。下一題繼續加油！</p>
                  </div>
                  <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
          <div className="lesson-footer">
            <button className="nav-question" onClick={startQuiz}><RotateCcw size={17} /> 重新開始</button>
            <span>累計答對 <b>{score}</b> 題</span>
            <button className="nav-question" onClick={next} disabled={!solved && !showAnswer}>下一題 →</button>
          </div>
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div className="pt-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="pt-detail-card lm-detail" initial={{ scale: .94, y: 16 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 24 }} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="pt-close" onClick={() => setSelected(null)} aria-label="關閉"><X size={20} /></button>
              <div className="lm-detail-hero lm-detail-hero-photo">
                <img src={selected.photo} alt={selected.zh} />
              </div>
              <div className="pt-name-row">
                <h3 className="pt-name-zh">{selected.zh}</h3>
                <button type="button" className="pt-speak" onClick={() => speak(selected.zh, "zh")} aria-label={`聆聽 ${selected.zh}`}><Volume2 size={14} /></button>
              </div>
              <p className="pt-en-name">
                {selected.en}
                <button type="button" className="pt-speak" onClick={() => speak(selected.en, "en")} aria-label={`聆聽 ${selected.en}`}><Volume2 size={14} /></button>
              </p>
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
