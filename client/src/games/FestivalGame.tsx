import { AnimatePresence, motion } from "framer-motion";
import { Link2, RotateCcw, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BilingualText from "@/components/BilingualText";
import { FESTIVALS, PAIRS_PER_ROUND, type Festival } from "@/data/festivals";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

/**
 * 節日派對：連線配對。
 * 左欄是「節日名稱＋日期」，右欄是節日卡通圖片；
 * 點名稱再點圖片（或先點圖片再點名稱）把它們連起來。
 * 全部 16 個節日分成 4 輪，連對會朗讀並亮出小知識。
 */
type Line = { key: number; x1: number; y1: number; x2: number; y2: number; ok: boolean };

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** 把 16 個節日分成 4 輪、每輪 4 個 */
const makeRounds = (): Festival[][] => {
  const pool = shuffle(FESTIVALS);
  const rounds: Festival[][] = [];
  for (let i = 0; i < pool.length; i += PAIRS_PER_ROUND) {
    rounds.push(pool.slice(i, i + PAIRS_PER_ROUND));
  }
  return rounds;
};

export default function FestivalGame() {
  const [rounds] = useState<Festival[][]>(makeRounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [leftOrder, setLeftOrder] = useState<Festival[]>(() => shuffle(rounds[0]));
  const [rightOrder, setRightOrder] = useState<Festival[]>(() => shuffle(rounds[0]));
  const [pickedLeft, setPickedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [lastFact, setLastFact] = useState<Festival | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineKey = useRef(0);

  const round = rounds[roundIndex];
  const roundDone = round.every((f) => matched.includes(f.id));
  const allDone = roundIndex === rounds.length - 1 && roundDone;
  const totalMatched = matched.length;

  /** 計算左卡中心到右卡中心的連線（相對棋盤容器） */
  const drawLine = useCallback((leftIdx: number, rightIdx: number, ok: boolean) => {
    const board = boardRef.current?.getBoundingClientRect();
    const a = leftRefs.current[leftIdx]?.getBoundingClientRect();
    const b = rightRefs.current[rightIdx]?.getBoundingClientRect();
    if (!board || !a || !b) return;
    const x1 = a.right - board.left;
    const y1 = a.top + a.height / 2 - board.top;
    const x2 = b.left - board.left;
    const y2 = b.top + b.height / 2 - board.top;
    lineKey.current += 1;
    const line: Line = { key: lineKey.current, x1, y1, x2, y2, ok };
    setLines((current) => [...current, line]);
    if (!ok) {
      window.setTimeout(() => {
        setLines((current) => current.filter((item) => item.key !== line.key));
      }, 800);
    }
  }, []);

  const restart = () => {
    setRoundIndex(0);
    setLeftOrder(shuffle(rounds[0]));
    setRightOrder(shuffle(rounds[0]));
    setPickedLeft(null);
    setMatched([]);
    setLines([]);
    setLastFact(null);
  };

  const nextRound = () => {
    const next = roundIndex + 1;
    setRoundIndex(next);
    setLeftOrder(shuffle(rounds[next]));
    setRightOrder(shuffle(rounds[next]));
    setPickedLeft(null);
    setLines([]);
  };

  /** 點左欄（名稱） */
  const tapLeft = (festival: Festival, index: number) => {
    if (matched.includes(festival.id)) return;
    speak(`${festival.zh}，${festival.en}`, "zh");
    setPickedLeft((current) => (current === festival.id ? null : festival.id));
    void index;
  };

  /** 點右欄（圖片）：必須先選了左邊的名稱 */
  const tapRight = (festival: Festival, rightIndex: number) => {
    if (matched.includes(festival.id)) return;
    if (!pickedLeft) {
      speak("先點左邊的節日名稱，再來連圖片", "zh");
      return;
    }
    const leftIndex = leftOrder.findIndex((item) => item.id === pickedLeft);
    if (leftIndex < 0) return;
    if (leftOrder[leftIndex].id === festival.id) {
      // 連對了：畫綠線、朗讀、亮出小知識
      drawLine(leftIndex, rightIndex, true);
      setMatched((current) => [...current, festival.id]);
      setLastFact(festival);
      setPickedLeft(null);
      playCorrect();
      speak(`${festival.zh}，${festival.dateZh}`, "zh");
      window.setTimeout(() => speak(festival.factZh, "zh"), 1400);
    } else {
      drawLine(leftIndex, rightIndex, false);
      setWrongPair(festival.id);
      playWrong();
      window.setTimeout(() => setWrongPair(null), 800);
      setPickedLeft(null);
    }
  };

  useEffect(() => {
    if (roundDone && !allDone) {
      const timer = window.setTimeout(() => undefined, 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [roundDone, allDone]);

  const progressPercent = useMemo(() => (totalMatched / FESTIVALS.length) * 100, [totalMatched]);

  return (
    <div className="game-body">
      <div className="game-progress-strip">
        <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
        <span><Star size={13} fill="currentColor" /> 第 {roundIndex + 1} / {rounds.length} 輪・連對 {totalMatched} / {FESTIVALS.length}</span>
      </div>

      <p className="ft-hint"><Link2 size={15} /> 點左邊的節日名稱，再點右邊的圖片，把它們連起來！</p>

      <div className="ft-board" ref={boardRef}>
        <svg className="ft-lines" aria-hidden="true">
          {lines.map((line) => (
            <line
              key={line.key}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              className={line.ok ? "is-ok" : "is-bad"}
            />
          ))}
        </svg>

        <div className="ft-col">
          {leftOrder.map((festival, index) => {
            const isMatched = matched.includes(festival.id);
            const isPicked = pickedLeft === festival.id;
            return (
              <button
                key={festival.id}
                type="button"
                ref={(el) => { leftRefs.current[index] = el; }}
                className={`ft-name ${isPicked ? "is-picked" : ""} ${isMatched ? "is-matched" : ""}`}
                onClick={() => tapLeft(festival, index)}
              >
                <b>{festival.zh}</b>
                <i>{festival.en}</i>
                <em>{isMatched ? `${festival.dateZh} · ${festival.dateEn}` : festival.areaZh}</em>
              </button>
            );
          })}
        </div>

        <div className="ft-col ft-col-pics">
          {rightOrder.map((festival, index) => {
            const isMatched = matched.includes(festival.id);
            const isWrong = wrongPair === festival.id;
            return (
              <motion.button
                key={festival.id}
                type="button"
                ref={(el) => { rightRefs.current[index] = el; }}
                className={`ft-pic ${isMatched ? "is-matched" : ""} ${isWrong ? "is-wrong" : ""}`}
                onClick={() => tapRight(festival, index)}
                animate={isWrong ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.42 }}
              >
                <img src={festival.img} alt={festival.zh} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lastFact && (
          <motion.div
            className="ft-fact"
            key={`${lastFact.id}-${matched.length}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <b aria-hidden="true">🎈</b>
            <div>
              <span>{lastFact.zh} · {lastFact.en}（{lastFact.dateZh}）</span>
              <p>{lastFact.factZh}</p>
              <div className="ft-fact-en"><BilingualText text={lastFact.factEn} /></div>
            </div>
          </motion.div>
        )}
        {allDone && (
          <motion.div className="ft-party" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}>
            <b aria-hidden="true">🎉🥮🏮🎄</b>
            <span>好厲害！16 個節日全部連對了！</span>
            <p>你認識了中國內地和香港的法定節日，還有重要的傳統節日。</p>
            <button type="button" onClick={restart}><RotateCcw size={17} /> 再玩一次</button>
          </motion.div>
        )}
        {roundDone && !allDone && (
          <motion.div className="ft-party" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}>
            <span>這一輪連對了！</span>
            <button type="button" onClick={nextRound}>下一輪 →</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
