import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Star } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

/** 三種難度：衛星（兩位數加或減）→ 行星（兩位數加減混合）→ 恆星（個位乘法＋加減）。 */
type Difficulty = "satellite" | "planet" | "star";

type Question = { text: string; answer: number };

const DIFF_META: { key: Difficulty; zh: string; en: string; icon: string; hint: string }[] = [
  {
    key: "satellite",
    zh: "衛星",
    en: "Satellite",
    icon: "🛰️",
    hint: "兩位數的加法或減法",
  },
  {
    key: "planet",
    zh: "行星",
    en: "Planet",
    icon: "🪐",
    hint: "兩位數加減混合運算",
  },
  {
    key: "star",
    zh: "恆星",
    en: "Star",
    icon: "⭐",
    hint: "個位數乘法＋加減",
  },
];

const ROUND = 10;

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** 產生一道「衛星」題：兩位數加法或減法（加法答案可以超過 100）。 */
function buildSatellite(): Question {
  const a = randInt(10, 99);
  const b = randInt(10, 99);
  if (Math.random() < 0.5) {
    return { text: `${a} + ${b} = ?`, answer: a + b };
  }
  const [big, small] = a >= b ? [a, b] : [b, a];
  return { text: `${big} − ${small} = ?`, answer: big - small };
}

/** 產生一道「行星」題：兩位數加減混合（兩步）。 */
function buildPlanet(): Question {
  const a = randInt(10, 99);
  const b = randInt(10, 99);
  const c = randInt(10, 99);
  if (Math.random() < 0.5) {
    return { text: `${a} + ${b} − ${c} = ?`, answer: a + b - c };
  }
  return { text: `${a} − ${b} + ${c} = ?`, answer: a - b + c };
}

/** 產生一道「恆星」題：個位數乘法，再加或減一個兩位數。 */
function buildStar(): Question {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = randInt(10, 99);
  if (Math.random() < 0.5) {
    return { text: `${a} × ${b} + ${c} = ?`, answer: a * b + c };
  }
  return { text: `${a} × ${b} − ${c} = ?`, answer: a * b - c };
}

const BUILDERS: Record<Difficulty, () => Question> = {
  satellite: buildSatellite,
  planet: buildPlanet,
  star: buildStar,
};

const buildRound = (difficulty: Difficulty): Question[] =>
  Array.from({ length: ROUND }, () => BUILDERS[difficulty]());

function buildOptions(answer: number) {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < 4 && guard < 60) {
    const delta = randInt(-9, 9) || 1;
    const next = answer + delta;
    if (next >= 0) set.add(next);
    guard += 1;
  }
  while (set.size < 4) set.add(answer + set.size);
  const list = Array.from(set);
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export default function MathGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("satellite");
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() => buildRound("satellite"));
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const question = questions[Math.min(step, questions.length - 1)];
  const options = useMemo(() => buildOptions(question.answer), [question]);
  const diffMeta = DIFF_META.find((item) => item.key === difficulty)!;

  const restart = useCallback(
    (next: Difficulty = difficulty) => {
      setQuestions(buildRound(next));
      setStep(0);
      setScore(0);
      setStreak(0);
      setResult(null);
      setPicked(null);
      setRound((current) => current + 1);
    },
    [difficulty],
  );

  const choose = (value: number) => {
    if (result === "correct") return;
    setPicked(value);
    if (value === question.answer) {
      setResult("correct");
      setScore((current) => current + 1);
      setStreak((current) => current + 1);
    } else {
      setResult("incorrect");
      setStreak(0);
    }
  };

  const next = () => {
    if (step + 1 >= ROUND) {
      restart();
      return;
    }
    setStep((current) => current + 1);
    setResult(null);
    setPicked(null);
  };

  const finished = step + 1 >= ROUND && result === "correct";

  return (
    <div className="game-body">
      <div className="mx-controls">
        <div className="mx-modes">
          {DIFF_META.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`mx-mode ${difficulty === item.key ? "is-on" : ""}`}
              title={item.hint}
              onClick={() => {
                setDifficulty(item.key);
                restart(item.key);
              }}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.zh}
              <i>{item.en}</i>
            </button>
          ))}
        </div>
        <div className="mx-levels">
          <span>{diffMeta.hint}</span>
        </div>
      </div>

      <div className="game-progress-strip">
        <div className="progress-track"><span style={{ width: `${(step / ROUND) * 100}%` }} /></div>
        <span><Star size={13} fill="currentColor" /> 第 {Math.min(step + 1, ROUND)} / {ROUND} 題 · 答對 {score}</span>
      </div>

      <motion.article
        className={`task-paper mx-paper ${result ? `result-${result}` : ""}`}
        key={`${round}-${step}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className="paper-tape tape-left" aria-hidden="true" />
        <span className="paper-tape tape-right" aria-hidden="true" />
        <div className="task-topline">
          <span>數字任務 {String(step + 1).padStart(2, "0")}</span>
          <span>連對 {streak} 🔥</span>
        </div>

        <p className="mx-question">{question.text}</p>

        <div className="mx-options">
          {options.map((value) => (
            <button
              key={value}
              type="button"
              className={`mx-option ${picked === value ? (value === question.answer ? "is-right" : "is-wrong") : ""}`}
              onClick={() => choose(value)}
              disabled={result === "correct"}
            >
              {value}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {result === "correct" && (
            <motion.div className="feedback correct-feedback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <img src="/images/tiantian-success-stars_5462d800.webp" alt="" />
              <div>
                <span>答對了！星星亮起來</span>
                <p>{question.text.replace("?", String(question.answer))}</p>
              </div>
              <button onClick={next}>{finished ? "再玩一輪" : "下一題"} <Check size={17} /></button>
            </motion.div>
          )}
          {result === "incorrect" && (
            <motion.div className="feedback incorrect-feedback" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="retry-face">?</div>
              <div>
                <span>差一點點，再算一次！</span>
                <p>慢慢數，你也可以用手指頭幫忙。</p>
              </div>
              <button onClick={() => { setResult(null); setPicked(null); }}>再試試</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>

      <div className="lesson-footer">
        <button className="nav-question" onClick={() => restart()}>
          <RotateCcw size={17} /> 重新開始
        </button>
        <span>累計答對 <b>{score}</b> 題</span>
        <button className="nav-question" onClick={next} disabled={result !== "correct"}>
          下一題 →
        </button>
      </div>
    </div>
  );
}
