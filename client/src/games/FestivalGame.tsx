import { motion } from "framer-motion";
import {
  BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight,
  Link2, MapPin, Moon, PartyPopper, Sparkles, Star, Sun, Utensils,
} from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FESTIVAL_PROFILES as BASE_FESTIVALS, PAIRS_PER_ROUND, type FestivalProfile } from "@/data/festivals";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak, stopSpeaking } from "@/lib/speech";

import { StageLanguageContext } from "@/components/GameStage";
import { festivalProfiles, type FestivalLanguage } from "@/data/festivalEnglish";
import { festivalText } from "@/data/festivalText";

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

const makeQuiz = (FESTIVAL_PROFILES: FestivalProfile[], english: boolean): QuizQuestion[] => shuffle(FESTIVAL_PROFILES).slice(0, 10).map((festival, index) => {
  const reverse = index % 2 === 1;
  if (reverse) {
    return {
      festival, reverse,
      prompt: english ? `Which festival has these activities: ${festival.activities.join(", ")}?` : `要「${festival.activities.join(english ? ", " : "、")}」，這是哪個節日？`,
      correct: festival.zh,
      options: shuffle([festival.zh, ...shuffle(FESTIVAL_PROFILES.filter((item) => item.id !== festival.id)).slice(0, 2).map((item) => item.zh)]),
    };
  }
  const distractors = shuffle(FESTIVAL_PROFILES.filter((item) => item.id !== festival.id).flatMap((item) => item.activities))
    .filter((activity) => !festival.activities.includes(activity as never)).slice(0, 2);
  return {
    festival, reverse,
    prompt: english ? `What can you do at ${festival.zh}?` : `${festival.zh}到了，你會做什麼？`,
    correct: festival.activities[0],
    options: shuffle([festival.activities[0], ...distractors]),
  };
});

const seasonForMonth = (month: number) => month <= 2 || month === 12 ? "winter" : month <= 5 ? "spring" : month <= 8 ? "summer" : "autumn";

export default function FestivalGame() {
  const [language, setLanguage] = useState<FestivalLanguage>("zh");
  const [level, setLevel] = useState<Level>("files");
  const [fileIndex, setFileIndex] = useState(0);
  const [stamps, setStamps] = useState<Set<string>>(() => new Set());
  const setStageLanguage = useContext(StageLanguageContext);
  useEffect(() => { setStageLanguage(language); return () => { stopSpeaking(); setStageLanguage("zh"); }; }, [language, setStageLanguage]);
  return <div lang={language === "en" ? "en" : "zh-Hant"}>
    <div className="festival-language-tabs" role="group" aria-label={language === "en" ? "Language" : "語言"}>
      <button type="button" aria-pressed={language === "zh"} onClick={() => { stopSpeaking(); setLanguage("zh"); }}>中文</button>
      <button type="button" aria-pressed={language === "en"} onClick={() => { stopSpeaking(); setLanguage("en"); }}>English</button>
    </div>
    <FestivalContent level={level} setLevel={setLevel} language={language} fileIndex={fileIndex} setFileIndex={setFileIndex} stamps={stamps} setStamps={setStamps} />
  </div>;
}

function FestivalContent({ level, setLevel, language, fileIndex, setFileIndex, stamps, setStamps }: {
  level: Level; setLevel: React.Dispatch<React.SetStateAction<Level>>;
  language: FestivalLanguage; fileIndex: number;
  setFileIndex: React.Dispatch<React.SetStateAction<number>>;
  stamps: Set<string>; setStamps: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const english = language === "en";
  const t = (text: string) => festivalText(text, language);
  const FESTIVAL_PROFILES = useMemo(() => festivalProfiles(language), [language]);
  const months = english ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : MONTHS;
  const say = (text: string) => speak(text, language);
  const localise = (festival: FestivalProfile) => FESTIVAL_PROFILES.find(f => f.id === festival.id)!;
  const translatedText = (text: string) => {
    if (!english) return text;
    for (const base of BASE_FESTIVALS) {
      const local = localise(base);
      if (text === base.zh) return local.zh;
      const activity = base.activities.indexOf(text);
      if (activity >= 0) return local.activities[activity];
    }
    return text;
  };

  useGameBack(level !== "files", () => setLevel("files"));

  const collectStamp = useCallback((festivalId: string) => {
    setStamps((current) => {
      if (current.has(festivalId)) return current;
      const next = new Set(current).add(festivalId);
      return next;
    });
  }, [setStamps]);

  const currentFile = FESTIVAL_PROFILES[fileIndex];
  useEffect(() => { if (level === "files") collectStamp(currentFile.id); }, [collectStamp, currentFile.id, level]);
  const [timelineRound, setTimelineRound] = useState(0);
  const timelineSource = useMemo(() => TIMELINE_ROUNDS[timelineRound].map((id) => BASE_FESTIVALS.find((item) => item.id === id)!), [timelineRound]);
  const [timelineBaseCards, setTimelineCards] = useState<FestivalProfile[]>(() => shuffle(TIMELINE_ROUNDS[0].map((id) => BASE_FESTIVALS.find((item) => item.id === id)!)));
  const timelineCards = timelineBaseCards.map(localise);
  const [timelinePlaced, setTimelinePlaced] = useState<Record<string, number>>({});
  const [timelinePick, setTimelinePick] = useState<string | null>(null);
  const [timelineResult, setTimelineFeedback] = useState<{ ok: boolean; id: string } | null>(null);
  const resultFestival = FESTIVAL_PROFILES.find(f => f.id === timelineResult?.id);
  const timelineFeedback = timelineResult && resultFestival ? { ok: timelineResult.ok, text: timelineResult.ok ? `${t("答對！")}${resultFestival.dateGuideZh}` : `${t("再想想：")}${resultFestival.clue}` } : null;
  useEffect(() => {
    setTimelineCards(shuffle(timelineSource)); setTimelinePlaced({}); setTimelinePick(null); setTimelineFeedback(null);
  }, [timelineSource]);
  const placeOnMonth = (festivalId: string, month: number) => {
    const festival = FESTIVAL_PROFILES.find((item) => item.id === festivalId);
    if (!festival || timelinePlaced[festival.id]) return;
    const possibleMonths: Record<string, number[]> = { newyeareve: [1, 2], spring: [1, 2], lantern: [2, 3], easter: [3, 4], buddha: [4, 5], dragonboat: [5, 6], midautumn: [8, 9, 10], chungyeung: [9, 10, 11] };
    if ((possibleMonths[festival.id] ?? [festival.month]).includes(month)) {
      setTimelinePlaced((current) => ({ ...current, [festival.id]: month })); setTimelinePick(null);
      setTimelineFeedback({ ok: true, id: festival.id }); collectStamp(festival.id); playCorrect();
      say(english ? `Well done! ${festival.zh}. ${festival.dateGuideZh}` : `答對，${festival.zh}，${festival.dateGuideZh}`);
    } else { setTimelineFeedback({ ok: false, id: festival.id }); playWrong(); }
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => makeQuiz(BASE_FESTIVALS, false));
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizPick] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const rawQuestion = quiz[quizIndex];
  const question = { ...rawQuestion, festival: localise(rawQuestion.festival),
    prompt: english ? (rawQuestion.reverse ? `Which festival has these activities: ${localise(rawQuestion.festival).activities.join(", ")}?` : `What can you do at ${localise(rawQuestion.festival).zh}?`) : rawQuestion.prompt,
    correct: translatedText(rawQuestion.correct), options: rawQuestion.options.map(translatedText) };
  const quizPick = quizChoice === null ? null : translatedText(quizChoice);
  const chooseQuiz = (option: string) => {
    if (quizPick) return;
    setQuizPick(rawQuestion.options[question.options.indexOf(option)]);
    if (option === question.correct) {
      setQuizScore((score) => score + 1); collectStamp(question.festival.id); playCorrect(); say(`${question.festival.zh}. ${question.festival.blessing}`);
    } else { playWrong(); say(`${t("答案是")} ${question.correct}`); }
  };
  const nextQuiz = () => {
    if (quizIndex === quiz.length - 1) { setQuiz(makeQuiz(BASE_FESTIVALS, false)); setQuizIndex(0); setQuizScore(0); setQuizPick(null); }
    else { setQuizIndex((index) => index + 1); setQuizPick(null); }
  };

  const [matchMode, setMatchMode] = useState<MatchMode>("picture");
  const [matchRound, setMatchRound] = useState(0);
  const [matchDeck] = useState(() => shuffle(BASE_FESTIVALS));
  const matchItems = useMemo(() => matchDeck.slice(matchRound * PAIRS_PER_ROUND, matchRound * PAIRS_PER_ROUND + PAIRS_PER_ROUND), [matchDeck, matchRound]);
  const [leftBaseOrder, setLeftOrder] = useState<FestivalProfile[]>(() => shuffle(matchDeck.slice(0, 4)));
  const [rightBaseOrder, setRightOrder] = useState<FestivalProfile[]>(() => shuffle(matchDeck.slice(0, 4)));
  const leftOrder = leftBaseOrder.map(localise);
  const rightOrder = rightBaseOrder.map(localise);
  const [pickedLeft, setPickedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const resetMatch = useCallback((items: FestivalProfile[]) => {
    setLeftOrder(shuffle(items)); setRightOrder(shuffle(items)); setPickedLeft(null); setMatched([]); setLines([]); setWrongPair(null);
  }, []);
  useEffect(() => { if (matchMode !== "region") resetMatch(matchItems); }, [matchItems, matchMode, resetMatch]);
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const updateLines = () => {
      const bounds = board.getBoundingClientRect();
      setLines(matched.flatMap((id, key) => {
        const left = leftRefs.current[leftBaseOrder.findIndex(f => f.id === id)]?.getBoundingClientRect();
        const right = rightRefs.current[rightBaseOrder.findIndex(f => f.id === id)]?.getBoundingClientRect();
        return left && right ? [{ key, x1: left.right - bounds.left, y1: left.top + left.height / 2 - bounds.top, x2: right.left - bounds.left, y2: right.top + right.height / 2 - bounds.top }] : [];
      }));
    };
    updateLines();
    const observer = new ResizeObserver(updateLines);
    observer.observe(board);
    return () => observer.disconnect();
  }, [matched, leftBaseOrder, rightBaseOrder, language, level, matchMode]);
  const tapMatchRight = (festival: FestivalProfile) => {
    if (!pickedLeft || matched.includes(festival.id)) return;
    if (pickedLeft === festival.id) {
      setMatched((current) => [...current, festival.id]); setPickedLeft(null);
      collectStamp(festival.id); playCorrect(); say(`${festival.zh}. ${t("連對了")}`);
    } else { setWrongPair(festival.id); setPickedLeft(null); playWrong(); window.setTimeout(() => setWrongPair(null), 650); }
  };

  const regionPool = useMemo(() => shuffle(BASE_FESTIVALS.filter((item) => item.region !== "other")), []);
  const [regionRound, setRegionRound] = useState(0);
  const regionItems = regionPool.slice(regionRound * 4, regionRound * 4 + 4).map(localise);
  const [regionPick, setRegionPick] = useState<string | null>(null);
  const [regionPlaced, setRegionPlaced] = useState<string[]>([]);
  const [regionResult, setRegionMessage] = useState<{ id: string; ok: boolean } | null>(null);
  const regionFestival = FESTIVAL_PROFILES.find(f => f.id === regionResult?.id);
  const regionMessage = regionResult && regionFestival ? `${t(regionResult.ok ? "答對！" : "再看看地區線索：")}${regionFestival.zh}: ${regionFestival.where}` : null;
  useEffect(() => { setRegionPick(null); setRegionPlaced([]); setRegionMessage(null); }, [regionRound]);
  const placeInRegion = (festivalId: string, region: "both" | "mainland" | "hongkong") => {
    const festival = regionItems.find((item) => item.id === festivalId);
    if (!festival || regionPlaced.includes(festivalId)) return;
    if (festival.region === region) {
      setRegionPlaced((current) => [...current, festivalId]); setRegionPick(null); setRegionMessage({ id: festival.id, ok: true });
      collectStamp(festival.id); playCorrect();
    } else { setRegionMessage({ id: festival.id, ok: false }); playWrong(); }
  };

  const levels: { key: Level; label: string; sub: string; icon: typeof BookOpen }[] = [
    { key: "files", label: t("節日小檔案"), sub: t("先認識"), icon: BookOpen },
    { key: "timeline", label: t("送節日回家"), sub: t("練日期"), icon: CalendarDays },
    { key: "practice", label: t("節日我做主"), sub: t("練習俗"), icon: Sparkles },
    { key: "match", label: t("配對大挑戰"), sub: t("總複習"), icon: Link2 },
  ];

  return <div className="game-body festival-game-body">
    <nav className="festival-levels" aria-label={t("節日派對關卡")}>
      {levels.map((item, index) => { const Icon = item.icon; return <button key={item.key} type="button" className={level === item.key ? "is-on" : ""} onClick={() => setLevel(item.key)}><em>{index + 1}</em><Icon size={19} /><span>{item.label}<i>{item.sub}</i></span></button>; })}
    </nav>

    {level === "files" && <section className="festival-stage">
      <StageHead eyebrow={t("關卡 1 · 純學習，不計分")} title={t("節日小檔案")} copy={t("先看圖、點文字聽介紹，再把節日記在日曆上。")} side={`${fileIndex + 1} / ${FESTIVAL_PROFILES.length}`} />
      <motion.article className="festival-file" key={currentFile.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
        <figure className="festival-file-visual"><img src={currentFile.img} alt={`${currentFile.zh}：${currentFile.activities.join(english ? ", " : "、")}`} /></figure>
        <div className="festival-file-info">
          <div className="festival-file-title"><span className={`festival-region region-${currentFile.region}`}>{currentFile.where}</span><h3><button type="button" onClick={() => say(currentFile.zh)}>{currentFile.zh}</button></h3>{!english && <button type="button" className="festival-en-name" lang="en" onClick={() => speak(currentFile.en, "en")}>{currentFile.en}</button>}<small className="festival-read-hint">{t("點文字，聽發音")}</small></div>
          <dl className="festival-five-grid">
            <InfoField language={language} wide icon={currentFile.calendar === "lunar" ? <Moon size={19} /> : <Sun size={19} />} label={t("什麼時候")} text={currentFile.dateGuideZh} />
            <InfoField language={language} icon={<PartyPopper size={19} />} label={t("做什麼")} text={currentFile.activities.join(english ? ", " : "、")} />
            <InfoField language={language} icon={<Utensils size={19} />} label={t("吃什麼")} text={currentFile.foodPlay} />
            <InfoField language={language} icon={<MapPin size={19} />} label={t("哪裡過")} text={currentFile.where} />
            <InfoField language={language} icon={<Sparkles size={19} />} label={t("祝福語")} text={currentFile.blessing} />
          </dl>
        </div>
      </motion.article>
      <div className="festival-file-nav"><button type="button" onClick={() => setFileIndex((index) => (index - 1 + FESTIVAL_PROFILES.length) % FESTIVAL_PROFILES.length)}><ChevronLeft size={20} />{t("上一張")}</button><button type="button" onClick={() => setFileIndex((index) => (index + 1) % FESTIVAL_PROFILES.length)}>{t("下一張")}<ChevronRight size={20} /></button></div>
    </section>}

    {level === "timeline" && <section className="festival-stage">
      <StageHead eyebrow={t("關卡 2 · 日期回憶")} title={t("送節日回家")} copy={t("這是代表月份練習，並非某一年的日曆。農曆節日每年會移動；先點卡片，再點月份。")} side={english ? `Set ${timelineRound + 1}` : `第 ${timelineRound + 1} 組`} />
      <div className="festival-timeline" aria-label={t("一月至十二月時間軸")}>{months.map((month, index) => { const monthNumber = index + 1; const here = timelineCards.filter((festival) => timelinePlaced[festival.id] === monthNumber); return <button key={month} type="button" className={`festival-month ${seasonForMonth(monthNumber)}`} onClick={() => timelinePick && placeOnMonth(timelinePick, monthNumber)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeOnMonth(event.dataTransfer.getData("text/plain"), monthNumber); }}><b>{month}</b><i>{monthNumber <= 2 || monthNumber === 12 ? t("冬") : monthNumber <= 5 ? t("春") : monthNumber <= 8 ? t("夏") : t("秋")}</i>{here.map((festival) => <span key={festival.id}>{festival.stamp} {festival.zh}</span>)}</button>; })}</div>
      <div className="festival-loose-cards">{timelineCards.filter((festival) => !timelinePlaced[festival.id]).map((festival) => <button key={festival.id} type="button" draggable className={timelinePick === festival.id ? "is-picked" : ""} onClick={() => setTimelinePick(festival.id)} onDragStart={(event) => event.dataTransfer.setData("text/plain", festival.id)}><img src={festival.img} alt="" /><span><b>{festival.zh}</b><i>{festival.calendar === "lunar" ? t("🌙 農曆節日") : t("☀️ 公曆節日")}</i></span></button>)}</div>
      {timelineFeedback && <motion.div className={`festival-feedback ${timelineFeedback.ok ? "is-ok" : "is-clue"}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{timelineFeedback.ok ? t("啪！ ") : "💡 "}{timelineFeedback.text}</motion.div>}
      {Object.keys(timelinePlaced).length === timelineCards.length && <Complete text={t("這組全都回家了！")} action={t("下一組 →")} onClick={() => setTimelineRound((round) => (round + 1) % TIMELINE_ROUNDS.length)} />}
    </section>}

    {level === "practice" && <section className="festival-stage">
      <StageHead eyebrow={t("關卡 3 · 習俗辨別")} title={t("節日我做主")} copy={t("正向題和反向題輪流出現，找出容易混淆的小差別。")} side={`${quizScore} / ${quiz.length} ★`} />
      <div className="festival-quiz-progress"><span style={{ width: `${((quizIndex + (quizPick ? 1 : 0)) / quiz.length) * 100}%` }} /></div>
      <motion.article className="festival-quiz" key={`${question.festival.id}-${quizIndex}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}><div className="festival-quiz-picture"><img src={question.festival.img} alt={t("節日提示圖")} /></div><div className="festival-quiz-main"><span>{question.reverse ? t("看習俗猜節日") : t("看節日選活動")}</span><h3>{question.prompt}</h3><div className="festival-quiz-options">{question.options.map((option) => <button key={option} type="button" disabled={Boolean(quizPick)} className={quizPick ? option === question.correct ? "is-right" : option === quizPick ? "is-wrong" : "" : ""} onClick={() => chooseQuiz(option)}>{option}</button>)}</div></div></motion.article>
      {quizPick && <motion.div className="festival-reveal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div><b>{quizPick === question.correct ? t("答對了！") : `${t("答案是")} ${question.correct}`}</b><span>{english ? `Three activities for ${question.festival.zh}` : `${question.festival.zh}的三件事`}</span></div><ul>{question.festival.activities.map((activity) => <li key={activity}><Check size={15} /> {activity}</li>)}</ul><strong>{t("一起說：")}{question.festival.blessing}</strong><button type="button" onClick={nextQuiz}>{quizIndex === quiz.length - 1 ? t("再玩一輪") : t("下一題")} →</button></motion.div>}
    </section>}

    {level === "match" && <section className="festival-stage">
      <StageHead eyebrow={t("關卡 4 · 多維度總複習")} title={t("配對大挑戰")} copy={t("不只認圖片，日期、習俗和地區也要真的記住。")} side={english ? `Set ${matchRound + 1}` : `第 ${matchRound + 1} 組`} />
      <div className="festival-match-modes">{([['picture',t("名稱 ↔ 圖")],['date',t("日期 ↔ 節日")],['custom',t("習俗／食物 ↔ 節日")],['region',t("哪裡有公眾假期")]] as [MatchMode,string][]).map(([key,label]) => <button key={key} type="button" className={matchMode === key ? "is-on" : ""} onClick={() => setMatchMode(key)}>{label}</button>)}</div>
      {matchMode !== "region" ? <><p className="ft-hint"><Link2 size={15} />{t("先點左邊，再點右邊，把正確答案連起來。")}</p><div className={`ft-board mode-${matchMode}`} ref={boardRef}><svg className="ft-lines" aria-hidden="true">{lines.map((line) => <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className="is-ok" />)}</svg><div className="ft-col">{leftOrder.map((festival, index) => <button key={festival.id} type="button" ref={(element) => { leftRefs.current[index] = element; }} className={`ft-name ${pickedLeft === festival.id ? "is-picked" : ""} ${matched.includes(festival.id) ? "is-matched" : ""}`} onClick={() => !matched.includes(festival.id) && setPickedLeft(festival.id)}>{matchMode === "picture" && <><b>{festival.zh}</b>{!english && <i>{festival.en}</i>}</>}{matchMode === "date" && <><b>{festival.calendar === "lunar" ? "🌙" : "☀️"} {festival.dateZh}</b><i>{festival.dateGuideZh}</i></>}{matchMode === "custom" && <><b>{festival.foodPlay}</b><i>{festival.activities[0]}</i></>}</button>)}</div><div className="ft-col ft-col-pics">{rightOrder.map((festival, index) => <motion.button key={festival.id} type="button" ref={(element) => { rightRefs.current[index] = element; }} className={`ft-pic ${matchMode !== "picture" ? "is-text" : ""} ${matched.includes(festival.id) ? "is-matched" : ""} ${wrongPair === festival.id ? "is-wrong" : ""}`} onClick={() => tapMatchRight(festival)} animate={wrongPair === festival.id ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}>{matchMode === "picture" ? <img src={festival.img} alt={festival.zh} /> : <><b>{festival.zh}</b>{!english && <i>{festival.en}</i>}</>}</motion.button>)}</div></div>{matched.length === matchItems.length && <Complete text={t("全部連對了！")} action={t("下一組 →")} onClick={() => setMatchRound((round) => (round + 1) % Math.ceil(FESTIVAL_PROFILES.length / PAIRS_PER_ROUND))} />}</> : <><p className="ft-hint"><MapPin size={15} />{t("按公眾假期分類，不是只有這些地方慶祝。先點卡片，再點地區。")}</p><div className="festival-region-cards">{regionItems.filter((festival) => !regionPlaced.includes(festival.id)).map((festival) => <button key={festival.id} type="button" draggable className={regionPick === festival.id ? "is-picked" : ""} onClick={() => setRegionPick(festival.id)} onDragStart={(event) => event.dataTransfer.setData("text/plain", festival.id)}><img src={festival.img} alt="" /><b>{festival.zh}</b></button>)}</div><div className="festival-region-buckets">{(["mainland", "hongkong", "both"] as const).map((region) => <button key={region} type="button" className={`region-${region}`} onClick={() => regionPick && placeInRegion(regionPick, region)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeInRegion(event.dataTransfer.getData("text/plain"), region); }}><span>{region === "mainland" ? "🏮" : region === "hongkong" ? "🌺" : "🤝"}</span><b>{t(REGION_LABELS[region])}</b><i>{regionPlaced.filter((id) => regionItems.find((item) => item.id === id)?.region === region).map((id) => FESTIVAL_PROFILES.find((item) => item.id === id)?.zh).join(english ? ", " : "、") || t("放到這裡")}</i></button>)}</div>{regionMessage && <div className="festival-feedback is-ok">{regionMessage}</div>}{regionPlaced.length === regionItems.length && <Complete text={t("地區也分對了！")} action={t("下一組 →")} onClick={() => setRegionRound((round) => (round + 1) % Math.ceil(regionPool.length / 4))} />}</>}
    </section>}

    <section className="festival-calendar-card"><header><div><span>{t("我的節日曆")}</span><p>{t("認識或答對節日就記下名稱。月份只作示意，實際日期每年可能不同。")}</p></div><b>{stamps.size} / {FESTIVAL_PROFILES.length}</b></header><div className="festival-calendar-wheel">{months.map((month, index) => <div key={month}><b>{month}</b><span>{FESTIVAL_PROFILES.filter((festival) => festival.month === index + 1 && stamps.has(festival.id)).map((festival) => <button type="button" key={festival.id} onClick={() => say(festival.zh)}>{festival.zh}</button>)}</span></div>)}</div></section>
  </div>;
}

function StageHead({ eyebrow, title, copy, side }: { eyebrow: string; title: string; copy: string; side: string }) {
  return <header className="festival-stage-head"><div><small>{eyebrow}</small><h2>{title}</h2><p>{copy}</p></div><b>{side}</b></header>;
}

function InfoField({ wide = false, icon, label, text, language }: { wide?: boolean; icon: ReactNode; label: string; text: string; language: FestivalLanguage }) {
  const t = (text: string) => festivalText(text, language);
  return <div className={wide ? "is-wide" : ""}>
    <dt>{icon} {label}</dt>
    <dd><button type="button" onClick={() => speak(text, language)} title={t("點文字，聽發音")}>{text}</button></dd>
  </div>;
}

function Complete({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return <div className="festival-complete"><Check size={20} /> {text}<button type="button" onClick={onClick}>{action}</button></div>;
}
import { useGameBack } from "@/lib/gameBack";
