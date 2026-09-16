import { motion } from "framer-motion";
import {
  BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight,
  Link2, MapPin, Moon, PartyPopper, Sparkles, Star, Sun, Utensils, Volume2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FESTIVAL_PROFILES, PAIRS_PER_ROUND, type FestivalProfile } from "@/data/festivals";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

type Level = "files" | "timeline" | "practice" | "match";
type MatchMode = "picture" | "date" | "custom" | "region";
type Line = { key: number; x1: number; y1: number; x2: number; y2: number };
type QuizQuestion = { festival: FestivalProfile; prompt: string; correct: string; options: string[]; reverse: boolean };

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const TIMELINE_ROUNDS = [
  ["newyear", "chingming", "dragonboat", "midautumn"],
  ["spring", "easter", "hksar", "christmas"],
  ["lantern", "labour", "buddha", "national"],
  ["newyeareve", "chungyeung", "halloween", "wintersolstice"],
];
const REGION_LABELS = { mainland: "內地", hongkong: "香港", both: "兩地都有" } as const;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const makeQuiz = (): QuizQuestion[] => shuffle(FESTIVAL_PROFILES).slice(0, 10).map((festival, index) => {
  const reverse = index % 2 === 1;
  if (reverse) {
    return {
      festival, reverse,
      prompt: `要「${festival.activities.join("、")}」，這是哪個節日？`,
      correct: festival.zh,
      options: shuffle([festival.zh, ...shuffle(FESTIVAL_PROFILES.filter((item) => item.id !== festival.id)).slice(0, 2).map((item) => item.zh)]),
    };
  }
  const distractors = shuffle(FESTIVAL_PROFILES.filter((item) => item.id !== festival.id).flatMap((item) => item.activities))
    .filter((activity) => !festival.activities.includes(activity as never)).slice(0, 2);
  return {
    festival, reverse,
    prompt: `${festival.zh}到了，你會做什麼？`,
    correct: festival.activities[0],
    options: shuffle([festival.activities[0], ...distractors]),
  };
});

const seasonForMonth = (month: number) => month <= 2 || month === 12 ? "winter" : month <= 5 ? "spring" : month <= 8 ? "summer" : "autumn";

export default function FestivalGame() {
  const [level, setLevel] = useState<Level>("files");
  const [fileIndex, setFileIndex] = useState(0);
  const [stamps, setStamps] = useState<Set<string>>(() => new Set<string>());

  const collectStamp = useCallback((festivalId: string) => {
    setStamps((current) => {
      if (current.has(festivalId)) return current;
      const next = new Set(current).add(festivalId);
      return next;
    });
  }, []);

  const currentFile = FESTIVAL_PROFILES[fileIndex];
  useEffect(() => { if (level === "files") collectStamp(currentFile.id); }, [collectStamp, currentFile.id, level]);
  const [timelineRound, setTimelineRound] = useState(0);
  const timelineSource = useMemo(() => TIMELINE_ROUNDS[timelineRound].map((id) => FESTIVAL_PROFILES.find((item) => item.id === id)!), [timelineRound]);
  const [timelineCards, setTimelineCards] = useState<FestivalProfile[]>(() => shuffle(TIMELINE_ROUNDS[0].map((id) => FESTIVAL_PROFILES.find((item) => item.id === id)!)));
  const [timelinePlaced, setTimelinePlaced] = useState<Record<string, number>>({});
  const [timelinePick, setTimelinePick] = useState<string | null>(null);
  const [timelineFeedback, setTimelineFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    setTimelineCards(shuffle(timelineSource)); setTimelinePlaced({}); setTimelinePick(null); setTimelineFeedback(null);
  }, [timelineSource]);
  const placeOnMonth = (festivalId: string, month: number) => {
    const festival = FESTIVAL_PROFILES.find((item) => item.id === festivalId);
    if (!festival || timelinePlaced[festival.id]) return;
    if (festival.month === month) {
      setTimelinePlaced((current) => ({ ...current, [festival.id]: month })); setTimelinePick(null);
      setTimelineFeedback({ ok: true, text: `答對！${festival.dateGuideZh}` }); collectStamp(festival.id); playCorrect();
      speak(`答對，${festival.zh}，${festival.dateGuideZh}`, "zh");
    } else { setTimelineFeedback({ ok: false, text: `再想想：${festival.clue}` }); playWrong(); }
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>(makeQuiz);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPick, setQuizPick] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const question = quiz[quizIndex];
  const chooseQuiz = (option: string) => {
    if (quizPick) return;
    setQuizPick(option);
    if (option === question.correct) {
      setQuizScore((score) => score + 1); collectStamp(question.festival.id); playCorrect(); speak(`${question.festival.zh}，${question.festival.blessing}`, "zh");
    } else { playWrong(); speak(`答案是${question.correct}`, "zh"); }
  };
  const nextQuiz = () => {
    if (quizIndex === quiz.length - 1) { setQuiz(makeQuiz()); setQuizIndex(0); setQuizScore(0); setQuizPick(null); }
    else { setQuizIndex((index) => index + 1); setQuizPick(null); }
  };

  const [matchMode, setMatchMode] = useState<MatchMode>("picture");
  const [matchRound, setMatchRound] = useState(0);
  const [matchDeck] = useState(() => shuffle(FESTIVAL_PROFILES));
  const matchItems = useMemo(() => matchDeck.slice(matchRound * PAIRS_PER_ROUND, matchRound * PAIRS_PER_ROUND + PAIRS_PER_ROUND), [matchDeck, matchRound]);
  const [leftOrder, setLeftOrder] = useState<FestivalProfile[]>(() => shuffle(matchDeck.slice(0, 4)));
  const [rightOrder, setRightOrder] = useState<FestivalProfile[]>(() => shuffle(matchDeck.slice(0, 4)));
  const [pickedLeft, setPickedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineKey = useRef(0);
  const resetMatch = useCallback((items: FestivalProfile[]) => {
    setLeftOrder(shuffle(items)); setRightOrder(shuffle(items)); setPickedLeft(null); setMatched([]); setLines([]); setWrongPair(null);
  }, []);
  useEffect(() => { if (matchMode !== "region") resetMatch(matchItems); }, [matchItems, matchMode, resetMatch]);
  const drawLine = (leftIndex: number, rightIndex: number) => {
    const board = boardRef.current?.getBoundingClientRect();
    const left = leftRefs.current[leftIndex]?.getBoundingClientRect();
    const right = rightRefs.current[rightIndex]?.getBoundingClientRect();
    if (!board || !left || !right) return;
    lineKey.current += 1;
    setLines((current) => [...current, { key: lineKey.current, x1: left.right - board.left, y1: left.top + left.height / 2 - board.top, x2: right.left - board.left, y2: right.top + right.height / 2 - board.top }]);
  };
  const tapMatchRight = (festival: FestivalProfile, rightIndex: number) => {
    if (!pickedLeft || matched.includes(festival.id)) return;
    const leftIndex = leftOrder.findIndex((item) => item.id === pickedLeft);
    if (pickedLeft === festival.id) {
      drawLine(leftIndex, rightIndex); setMatched((current) => [...current, festival.id]); setPickedLeft(null);
      collectStamp(festival.id); playCorrect(); speak(`${festival.zh}，連對了`, "zh");
    } else { setWrongPair(festival.id); setPickedLeft(null); playWrong(); window.setTimeout(() => setWrongPair(null), 650); }
  };

  const regionPool = useMemo(() => shuffle(FESTIVAL_PROFILES.filter((item) => item.region !== "other")), []);
  const [regionRound, setRegionRound] = useState(0);
  const regionItems = useMemo(() => regionPool.slice(regionRound * 4, regionRound * 4 + 4), [regionPool, regionRound]);
  const [regionPick, setRegionPick] = useState<string | null>(null);
  const [regionPlaced, setRegionPlaced] = useState<string[]>([]);
  const [regionMessage, setRegionMessage] = useState<string | null>(null);
  useEffect(() => { setRegionPick(null); setRegionPlaced([]); setRegionMessage(null); }, [regionRound]);
  const placeInRegion = (festivalId: string, region: "both" | "mainland" | "hongkong") => {
    const festival = regionItems.find((item) => item.id === festivalId);
    if (!festival || regionPlaced.includes(festivalId)) return;
    if (festival.region === region) {
      setRegionPlaced((current) => [...current, festivalId]); setRegionPick(null); setRegionMessage(`答對！${festival.zh}：${festival.where}`);
      collectStamp(festival.id); playCorrect();
    } else { setRegionMessage(`再看看地區線索：${festival.clue}`); playWrong(); }
  };

  const levels: { key: Level; label: string; sub: string; icon: typeof BookOpen }[] = [
    { key: "files", label: "節日小檔案", sub: "先認識", icon: BookOpen },
    { key: "timeline", label: "送節日回家", sub: "練日期", icon: CalendarDays },
    { key: "practice", label: "節日我做主", sub: "練習俗", icon: Sparkles },
    { key: "match", label: "配對大挑戰", sub: "總複習", icon: Link2 },
  ];

  return <div className="game-body festival-game-body">
    <nav className="festival-levels" aria-label="節日派對關卡">
      {levels.map((item, index) => { const Icon = item.icon; return <button key={item.key} type="button" className={level === item.key ? "is-on" : ""} onClick={() => setLevel(item.key)}><em>{index + 1}</em><Icon size={19} /><span>{item.label}<i>{item.sub}</i></span></button>; })}
    </nav>

    {level === "files" && <section className="festival-stage">
      <StageHead eyebrow="關卡 1 · 純學習，不計分" title="節日小檔案" copy="先看圖、聽故事，再把節日郵戳收進你的日曆。" side={`${fileIndex + 1} / ${FESTIVAL_PROFILES.length}`} />
      <motion.article className="festival-file" key={currentFile.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
        <figure className="festival-file-visual"><img src={currentFile.img} alt={`${currentFile.zh}：${currentFile.activities.join("、")}`} /><figcaption><span>{currentFile.stamp}</span>{currentFile.foodPlay}</figcaption></figure>
        <div className="festival-file-info">
          <div className="festival-file-title"><span className={`festival-region region-${currentFile.region}`}>{currentFile.where}</span><h3><button type="button" onClick={() => speak(currentFile.zh, "zh")}>{currentFile.zh} <Volume2 size={17} /></button></h3><button type="button" className="festival-en-name" onClick={() => speak(currentFile.en, "en")}>{currentFile.en} <Volume2 size={14} /></button></div>
          <dl className="festival-five-grid">
            <InfoField wide icon={currentFile.calendar === "lunar" ? <Moon size={19} /> : <Sun size={19} />} label="什麼時候" text={currentFile.dateGuideZh} />
            <InfoField icon={<PartyPopper size={19} />} label="做什麼" text={currentFile.activities.join("、")} />
            <InfoField icon={<Utensils size={19} />} label="吃／玩什麼" text={currentFile.foodPlay} />
            <InfoField icon={<MapPin size={19} />} label="哪裡過" text={currentFile.where} />
            <InfoField icon={<Sparkles size={19} />} label="祝福語" text={currentFile.blessing} />
          </dl>
        </div>
      </motion.article>
      <div className="festival-file-nav"><button type="button" onClick={() => setFileIndex((index) => (index - 1 + FESTIVAL_PROFILES.length) % FESTIVAL_PROFILES.length)}><ChevronLeft size={20} /> 上一張</button><span>{currentFile.stamp} 郵戳已收集</span><button type="button" onClick={() => setFileIndex((index) => (index + 1) % FESTIVAL_PROFILES.length)}>下一張 <ChevronRight size={20} /></button></div>
    </section>}

    {level === "timeline" && <section className="festival-stage">
      <StageHead eyebrow="關卡 2 · 日期回憶" title="送節日回家" copy="拖動節日卡到月份；iPad 也可以先點卡片，再點月份。" side={`第 ${timelineRound + 1} 組`} />
      <div className="festival-timeline" aria-label="一月至十二月時間軸">{MONTHS.map((month, index) => { const monthNumber = index + 1; const here = timelineCards.filter((festival) => timelinePlaced[festival.id] === monthNumber); return <button key={month} type="button" className={`festival-month ${seasonForMonth(monthNumber)}`} onClick={() => timelinePick && placeOnMonth(timelinePick, monthNumber)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeOnMonth(event.dataTransfer.getData("text/plain"), monthNumber); }}><b>{month}</b><i>{monthNumber <= 2 || monthNumber === 12 ? "冬" : monthNumber <= 5 ? "春" : monthNumber <= 8 ? "夏" : "秋"}</i>{here.map((festival) => <span key={festival.id}>{festival.stamp} {festival.zh}</span>)}</button>; })}</div>
      <div className="festival-loose-cards">{timelineCards.filter((festival) => !timelinePlaced[festival.id]).map((festival) => <button key={festival.id} type="button" draggable className={timelinePick === festival.id ? "is-picked" : ""} onClick={() => setTimelinePick(festival.id)} onDragStart={(event) => event.dataTransfer.setData("text/plain", festival.id)}><img src={festival.img} alt="" /><span><b>{festival.zh}</b><i>{festival.calendar === "lunar" ? "🌙 農曆節日" : "☀️ 公曆節日"}</i></span></button>)}</div>
      {timelineFeedback && <motion.div className={`festival-feedback ${timelineFeedback.ok ? "is-ok" : "is-clue"}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{timelineFeedback.ok ? "啪！ " : "💡 "}{timelineFeedback.text}</motion.div>}
      {Object.keys(timelinePlaced).length === timelineCards.length && <Complete text="這組全都回家了！" action="下一組 →" onClick={() => setTimelineRound((round) => (round + 1) % TIMELINE_ROUNDS.length)} />}
    </section>}

    {level === "practice" && <section className="festival-stage">
      <StageHead eyebrow="關卡 3 · 習俗辨別" title="節日我做主" copy="正向題和反向題輪流出現，找出容易混淆的小差別。" side={`${quizScore} / ${quiz.length} ★`} />
      <div className="festival-quiz-progress"><span style={{ width: `${((quizIndex + (quizPick ? 1 : 0)) / quiz.length) * 100}%` }} /></div>
      <motion.article className="festival-quiz" key={`${question.festival.id}-${quizIndex}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}><div className="festival-quiz-picture"><img src={question.festival.img} alt="節日提示圖" /></div><div className="festival-quiz-main"><span>{question.reverse ? "看習俗猜節日" : "看節日選活動"}</span><h3>{question.prompt}</h3><div className="festival-quiz-options">{question.options.map((option) => <button key={option} type="button" disabled={Boolean(quizPick)} className={quizPick ? option === question.correct ? "is-right" : option === quizPick ? "is-wrong" : "" : ""} onClick={() => chooseQuiz(option)}>{option}</button>)}</div></div></motion.article>
      {quizPick && <motion.div className="festival-reveal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div><b>{quizPick === question.correct ? "答對了！" : `答案是「${question.correct}」`}</b><span>{question.festival.zh}的三件事</span></div><ul>{question.festival.activities.map((activity) => <li key={activity}><Check size={15} /> {activity}</li>)}</ul><strong>一起說：{question.festival.blessing}</strong><button type="button" onClick={nextQuiz}>{quizIndex === quiz.length - 1 ? "再玩一輪" : "下一題"} →</button></motion.div>}
    </section>}

    {level === "match" && <section className="festival-stage">
      <StageHead eyebrow="關卡 4 · 多維度總複習" title="配對大挑戰" copy="不只認圖片，日期、習俗和地區也要真的記住。" side={`第 ${matchRound + 1} 組`} />
      <div className="festival-match-modes">{([['picture','名稱 ↔ 圖'],['date','日期 ↔ 節日'],['custom','習俗／食物 ↔ 節日'],['region','送回內地或香港']] as [MatchMode,string][]).map(([key,label]) => <button key={key} type="button" className={matchMode === key ? "is-on" : ""} onClick={() => setMatchMode(key)}>{label}</button>)}</div>
      {matchMode !== "region" ? <><p className="ft-hint"><Link2 size={15} /> 先點左邊，再點右邊，把正確答案連起來。</p><div className={`ft-board mode-${matchMode}`} ref={boardRef}><svg className="ft-lines" aria-hidden="true">{lines.map((line) => <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className="is-ok" />)}</svg><div className="ft-col">{leftOrder.map((festival, index) => <button key={festival.id} type="button" ref={(element) => { leftRefs.current[index] = element; }} className={`ft-name ${pickedLeft === festival.id ? "is-picked" : ""} ${matched.includes(festival.id) ? "is-matched" : ""}`} onClick={() => !matched.includes(festival.id) && setPickedLeft(festival.id)}>{matchMode === "picture" && <><b>{festival.zh}</b><i>{festival.en}</i></>}{matchMode === "date" && <><b>{festival.calendar === "lunar" ? "🌙" : "☀️"} {festival.dateZh}</b><i>{festival.dateGuideZh}</i></>}{matchMode === "custom" && <><b>{festival.foodPlay}</b><i>{festival.activities[0]}</i></>}</button>)}</div><div className="ft-col ft-col-pics">{rightOrder.map((festival, index) => <motion.button key={festival.id} type="button" ref={(element) => { rightRefs.current[index] = element; }} className={`ft-pic ${matchMode !== "picture" ? "is-text" : ""} ${matched.includes(festival.id) ? "is-matched" : ""} ${wrongPair === festival.id ? "is-wrong" : ""}`} onClick={() => tapMatchRight(festival, index)} animate={wrongPair === festival.id ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}>{matchMode === "picture" ? <img src={festival.img} alt={festival.zh} /> : <><b>{festival.zh}</b><i>{festival.en}</i></>}</motion.button>)}</div></div>{matched.length === matchItems.length && <Complete text="全部連對了！" action="下一組 →" onClick={() => setMatchRound((round) => (round + 1) % Math.ceil(FESTIVAL_PROFILES.length / PAIRS_PER_ROUND))} />}</> : <><p className="ft-hint"><MapPin size={15} /> 拖動卡片到地區；iPad 可以先點卡片，再點地區。</p><div className="festival-region-cards">{regionItems.filter((festival) => !regionPlaced.includes(festival.id)).map((festival) => <button key={festival.id} type="button" draggable className={regionPick === festival.id ? "is-picked" : ""} onClick={() => setRegionPick(festival.id)} onDragStart={(event) => event.dataTransfer.setData("text/plain", festival.id)}><img src={festival.img} alt="" /><b>{festival.zh}</b></button>)}</div><div className="festival-region-buckets">{(["mainland", "hongkong", "both"] as const).map((region) => <button key={region} type="button" className={`region-${region}`} onClick={() => regionPick && placeInRegion(regionPick, region)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeInRegion(event.dataTransfer.getData("text/plain"), region); }}><span>{region === "mainland" ? "🏮" : region === "hongkong" ? "🌺" : "🤝"}</span><b>{REGION_LABELS[region]}</b><i>{regionPlaced.filter((id) => regionItems.find((item) => item.id === id)?.region === region).map((id) => FESTIVAL_PROFILES.find((item) => item.id === id)?.zh).join("、") || "放到這裡"}</i></button>)}</div>{regionMessage && <div className="festival-feedback is-ok">{regionMessage}</div>}{regionPlaced.length === regionItems.length && <Complete text="地區也分對了！" action="下一組 →" onClick={() => setRegionRound((round) => (round + 1) % Math.ceil(regionPool.length / 4))} />}</>}
    </section>}

    <section className="festival-calendar-card"><header><div><span>我的節日曆</span><p>每次进入都会开始一张新的节日历；认识或答对节日就留下邮戳。</p></div><b>{stamps.size} / {FESTIVAL_PROFILES.length}</b></header><div className="festival-calendar-wheel">{MONTHS.map((month, index) => <div key={month}><b>{month}</b><span>{FESTIVAL_PROFILES.filter((festival) => festival.month === index + 1 && stamps.has(festival.id)).map((festival) => <i key={festival.id} title={festival.zh}>{festival.stamp}</i>)}</span></div>)}</div></section>
  </div>;
}

function StageHead({ eyebrow, title, copy, side }: { eyebrow: string; title: string; copy: string; side: string }) {
  return <header className="festival-stage-head"><div><small>{eyebrow}</small><h2>{title}</h2><p>{copy}</p></div><b>{side}</b></header>;
}

function InfoField({ wide = false, icon, label, text }: { wide?: boolean; icon: ReactNode; label: string; text: string }) {
  return <div className={wide ? "is-wide" : ""}>
    <dt>{icon} {label}</dt>
    <dd><span>{text}</span><button type="button" onClick={() => speak(text, "zh")} aria-label={`播放${label}`}><Volume2 size={17} /></button></dd>
  </div>;
}

function Complete({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return <div className="festival-complete"><Check size={20} /> {text}<button type="button" onClick={onClick}>{action}</button></div>;
}
