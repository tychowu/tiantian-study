import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BilingualText from "@/components/BilingualText";
import { FESTIVALS, type Festival } from "@/data/festivals";
import { speak } from "@/lib/speech";

/**
 * 節日派對：翻牌配對。
 * 16 張牌（8 個節日 × 2），翻到兩張相同就配對成功，
 * 朗讀節日名稱並亮出一句小知識。
 */
type Card = { key: string; festival: Festival };

const makeDeck = (): Card[] => {
  const pairs: Card[] = FESTIVALS.flatMap((festival, index) => [
    { key: `a-${index}`, festival },
    { key: `b-${index}`, festival },
  ]);
  for (let i = pairs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
};

export default function FestivalGame() {
  const [deck, setDeck] = useState<Card[]>(makeDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [lastFact, setLastFact] = useState<Festival | null>(null);
  const [busy, setBusy] = useState(false);

  const allDone = matched.length === FESTIVALS.length;

  const restart = () => {
    setDeck(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLastFact(null);
    setBusy(false);
  };

  const tapCard = (card: Card) => {
    if (busy) return;
    // 點牌就讀名：先中文再英文
    speak(`${card.festival.zh}，${card.festival.en}`, "zh");
    // 函式式更新：同一瞬間連點兩張也不會互相覆蓋
    setFlipped((current) =>
      current.length >= 2 || current.includes(card.key) ? current : [...current, card.key],
    );
  };

  // 翻開兩張時判定配對
  useEffect(() => {
    if (flipped.length !== 2) return;
    setBusy(true);
    const [first, second] = flipped.map((key) => deck.find((item) => item.key === key)!.festival);
    const timer = window.setTimeout(
      () => {
        if (first.zh === second.zh) {
          setMatched((current) => [...current, first.zh]);
          setLastFact(first);
          speak(first.factZh, "zh");
        }
        setFlipped([]);
        setBusy(false);
      },
      first.zh === second.zh ? 420 : 950,
    );
    return () => window.clearTimeout(timer);
  }, [flipped, deck]);

  const progressPercent = useMemo(() => (matched.length / FESTIVALS.length) * 100, [matched]);

  return (
    <div className="game-body">
      <div className="game-progress-strip">
        <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
        <span><Star size={13} fill="currentColor" /> 配對 {matched.length} / {FESTIVALS.length} 對</span>
      </div>

      <div className="ft-grid">
        {deck.map((card) => {
          const isOpen = flipped.includes(card.key) || matched.includes(card.festival.zh);
          return (
            <motion.button
              key={card.key}
              type="button"
              className={`ft-card ${isOpen ? "is-open" : ""} ${matched.includes(card.festival.zh) ? "is-matched" : ""}`}
              onClick={() => tapCard(card)}
              aria-label={isOpen ? card.festival.zh : "未翻開的節日牌"}
            >
              <span className="ft-card-inner">
                <span className="ft-face ft-back" aria-hidden="true">🎁</span>
                <span className="ft-face ft-front">
                  <b aria-hidden="true">{card.festival.icon}</b>
                  <i>{card.festival.zh}</i>
                  <em>{card.festival.en}</em>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {lastFact && !allDone && (
          <motion.div
            className="ft-fact"
            key={lastFact.zh}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <b aria-hidden="true">{lastFact.icon}</b>
            <div>
              <span>{lastFact.zh} · {lastFact.en}</span>
              <p>{lastFact.factZh}</p>
              <div className="ft-fact-en"><BilingualText text={lastFact.factEn} /></div>
            </div>
          </motion.div>
        )}
        {allDone && (
          <motion.div className="ft-party" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}>
            <b aria-hidden="true">🎉🥮🏮🎄</b>
            <span>好厲害！八對節日全部配對成功！</span>
            <p>你一共翻了 {moves} 次牌，認識了八個中西節日。</p>
            <button type="button" onClick={restart}><RotateCcw size={17} /> 再玩一次</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
