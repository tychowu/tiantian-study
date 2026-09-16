import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eraser,
  Languages,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

type Language = "zh" | "en";
type Question = {
  id: number;
  language: Language;
  answer: string[];
  prompt: string;
  hint: string;
};
type WordToken = { id: string; text: string; selected: boolean };

const questions: Question[] = [
  { id: 1, language: "zh", answer: ["我", "喜歡", "吃", "蘋果"], prompt: "把詞語排成一句完整的話。", hint: "誰喜歡做什麼？" },
  { id: 2, language: "zh", answer: ["小狗", "在", "花園", "裡", "跑"], prompt: "把詞語排成一句完整的話。", hint: "先找出誰在動。" },
  { id: 3, language: "zh", answer: ["媽媽", "今天", "做", "蛋糕"], prompt: "把詞語排成一句完整的話。", hint: "想想今天發生了什麼。" },
  { id: 4, language: "zh", answer: ["太陽", "從", "東邊", "升起"], prompt: "把詞語排成一句完整的話。", hint: "這是早上的事情。" },
  { id: 5, language: "zh", answer: ["妹妹", "正在", "畫", "小花"], prompt: "把詞語排成一句完整的話。", hint: "誰正在畫東西？" },
  { id: 6, language: "zh", answer: ["小鳥", "站在", "樹枝上", "唱歌"], prompt: "把詞語排成一句完整的話。", hint: "先找出小鳥在哪裡。" },
  { id: 7, language: "zh", answer: ["爸爸", "開車", "去", "上班"], prompt: "把詞語排成一句完整的話。", hint: "爸爸要去哪裡？" },
  { id: 8, language: "zh", answer: ["我", "和", "朋友", "一起", "玩球"], prompt: "把詞語排成一句完整的話。", hint: "有誰一起玩？" },
  { id: 9, language: "zh", answer: ["天空", "有", "一朵", "白雲"], prompt: "把詞語排成一句完整的話。", hint: "先找出在天空裡的東西。" },
  { id: 10, language: "zh", answer: ["老師", "說", "一個", "故事"], prompt: "把詞語排成一句完整的話。", hint: "老師說了什麼？" },
  { id: 11, language: "zh", answer: ["小貓", "躲在", "桌子", "下面"], prompt: "把詞語排成一句完整的話。", hint: "小貓在哪裡？" },
  { id: 12, language: "zh", answer: ["我們", "排隊", "洗手"], prompt: "把詞語排成一句完整的話。", hint: "誰要洗手？" },
  { id: 13, language: "zh", answer: ["爺爺", "戴著", "一頂", "帽子"], prompt: "把詞語排成一句完整的話。", hint: "爺爺戴著什麼？" },
  { id: 14, language: "zh", answer: ["雨滴", "落在", "雨傘上"], prompt: "把詞語排成一句完整的話。", hint: "誰落在哪裡？" },
  { id: 15, language: "zh", answer: ["小魚", "在", "水裡", "游泳"], prompt: "把詞語排成一句完整的話。", hint: "小魚在做什麼？" },
  { id: 16, language: "zh", answer: ["弟弟", "把", "玩具", "收好"], prompt: "把詞語排成一句完整的話。", hint: "弟弟收好了什麼？" },
  { id: 17, language: "zh", answer: ["我們", "明天", "去", "動物園"], prompt: "把詞語排成一句完整的話。", hint: "什麼時候去哪裡？" },
  { id: 18, language: "zh", answer: ["月亮", "晚上", "掛在", "天空"], prompt: "把詞語排成一句完整的話。", hint: "先想想時間。" },
  { id: 19, language: "zh", answer: ["哥哥", "正在", "看", "圖畫書"], prompt: "把詞語排成一句完整的話。", hint: "哥哥正在做什麼？" },
  { id: 20, language: "zh", answer: ["蝴蝶", "飛到", "花朵", "旁邊"], prompt: "把詞語排成一句完整的話。", hint: "蝴蝶飛到了哪裡？" },
  { id: 21, language: "zh", answer: ["我", "想要", "一杯", "牛奶"], prompt: "把詞語排成一句完整的話。", hint: "誰想要什麼？" },
  { id: 22, language: "zh", answer: ["小明", "幫", "奶奶", "拿", "袋子"], prompt: "把詞語排成一句完整的話。", hint: "小明幫誰拿東西？" },
  { id: 23, language: "zh", answer: ["小兔子", "吃", "甜甜的", "紅蘿蔔"], prompt: "把詞語排成一句完整的話。", hint: "誰吃什麼？" },
  { id: 24, language: "zh", answer: ["風", "把", "葉子", "吹走"], prompt: "把詞語排成一句完整的話。", hint: "誰把葉子吹走？" },
  { id: 25, language: "zh", answer: ["我們", "一起", "說", "早安"], prompt: "把詞語排成一句完整的話。", hint: "一起說什麼？" },
  { id: 26, language: "en", answer: ["I", "see", "a", "red", "ball"], prompt: "Put the words in the right order.", hint: "Who sees the ball?" },
  { id: 27, language: "en", answer: ["The", "cat", "is", "on", "the", "bed"], prompt: "Put the words in the right order.", hint: "Where is the cat?" },
  { id: 28, language: "en", answer: ["We", "eat", "rice", "for", "lunch"], prompt: "Put the words in the right order.", hint: "What do we eat?" },
  { id: 29, language: "en", answer: ["My", "dad", "has", "a", "blue", "car"], prompt: "Put the words in the right order.", hint: "Who has a car?" },
  { id: 30, language: "en", answer: ["The", "sun", "is", "very", "bright"], prompt: "Put the words in the right order.", hint: "What is very bright?" },
  { id: 31, language: "en", answer: ["I", "like", "to", "draw", "stars"], prompt: "Put the words in the right order.", hint: "What do I like to draw?" },
  { id: 32, language: "en", answer: ["The", "dog", "can", "run", "fast"], prompt: "Put the words in the right order.", hint: "What can the dog do?" },
  { id: 33, language: "en", answer: ["Mom", "reads", "a", "funny", "book"], prompt: "Put the words in the right order.", hint: "What does Mom read?" },
  { id: 34, language: "en", answer: ["A", "fish", "swims", "in", "the", "pond"], prompt: "Put the words in the right order.", hint: "Where does the fish swim?" },
  { id: 35, language: "en", answer: ["My", "friend", "has", "a", "kite"], prompt: "Put the words in the right order.", hint: "What does my friend have?" },
  { id: 36, language: "en", answer: ["We", "wash", "our", "hands", "first"], prompt: "Put the words in the right order.", hint: "What do we wash first?" },
  { id: 37, language: "en", answer: ["The", "baby", "is", "sleeping", "now"], prompt: "Put the words in the right order.", hint: "What is the baby doing?" },
  { id: 38, language: "en", answer: ["I", "can", "count", "to", "ten"], prompt: "Put the words in the right order.", hint: "What can I do?" },
  { id: 39, language: "en", answer: ["Birds", "sing", "in", "the", "tree"], prompt: "Put the words in the right order.", hint: "Where do birds sing?" },
  { id: 40, language: "en", answer: ["The", "frog", "jumps", "in", "the", "rain"], prompt: "Put the words in the right order.", hint: "When does the frog jump?" },
  { id: 41, language: "en", answer: ["I", "wear", "my", "yellow", "hat"], prompt: "Put the words in the right order.", hint: "What color is my hat?" },
  { id: 42, language: "en", answer: ["We", "go", "to", "the", "park", "today"], prompt: "Put the words in the right order.", hint: "Where do we go today?" },
  { id: 43, language: "en", answer: ["The", "moon", "comes", "out", "at", "night"], prompt: "Put the words in the right order.", hint: "When does the moon come out?" },
  { id: 44, language: "en", answer: ["My", "sister", "likes", "pink", "flowers"], prompt: "Put the words in the right order.", hint: "What does my sister like?" },
  { id: 45, language: "en", answer: ["The", "bus", "stops", "by", "the", "school"], prompt: "Put the words in the right order.", hint: "Where does the bus stop?" },
  { id: 46, language: "en", answer: ["I", "help", "my", "mom", "cook"], prompt: "Put the words in the right order.", hint: "Who do I help?" },
  { id: 47, language: "en", answer: ["The", "little", "duck", "is", "happy"], prompt: "Put the words in the right order.", hint: "How is the duck?" },
  { id: 48, language: "en", answer: ["We", "play", "a", "game", "together"], prompt: "Put the words in the right order.", hint: "What do we play?" },
  { id: 49, language: "en", answer: ["The", "apple", "is", "sweet", "and", "juicy"], prompt: "Put the words in the right order.", hint: "How is the apple?" },
  { id: 50, language: "en", answer: ["I", "say", "good", "morning", "to", "my", "teacher"], prompt: "Put the words in the right order.", hint: "Who do I say good morning to?" },
];

const randomize = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
  }
  return copy;
};

const createWordBank = (answer: string[]) =>
  randomize(
    answer.map((text, index) => ({
      id: `${text}-${index}-${crypto.randomUUID()}`,
      text,
      selected: false,
    })),
  );

const normalizeEnglish = (words: string[]) => words.map((word) => word.toLocaleLowerCase());
const sameWords = (left: string[], right: string[]) => left.length === right.length && left.every((word, index) => word === right[index]);
const isFriendlyEnglishAnswer = (selected: string[], expected: string[]) => {
  const answer = normalizeEnglish(expected);
  const attempt = normalizeEnglish(selected);
  if (sameWords(attempt, answer)) return true;

  // 常见的时间／方式副词可以自然地放在句首：Today we go… / We go… today。
  const tail = answer.at(-1);
  if (tail && ["today", "now", "first", "together"].includes(tail) && sameWords(attempt, [tail, ...answer.slice(0, -1)])) return true;

  // 地点或时间介词短语也可以前置：In the rain the frog jumps。
  for (let index = 1; index < answer.length; index += 1) {
    if (["in", "at", "by"].includes(answer[index]) && sameWords(attempt, [...answer.slice(index), ...answer.slice(0, index)])) return true;
  }
  return false;
};

const displayWord = (word: string, index: number, language: Language) => language === "en" && index === 0
  ? word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
  : word;

export default function SentenceGame() {
  const [questionOrder] = useState<Question[]>(() => randomize(questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<WordToken[]>(() => createWordBank(questionOrder[0].answer));
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const question = questionOrder[questionIndex];
  const language = question.language;
  const questionNumber = questionIndex + 1;
  const sayWord = (word: string) => speak(word, language === "zh" ? "zh" : "en");

  const loadQuestion = useCallback(
    (index: number) => {
      const nextQuestion = questionOrder[index];
      setQuestionIndex(index);
      setSelectedTokenIds([]);
      setWordBank(createWordBank(nextQuestion.answer));
      setResult(null);
      setShowHint(false);
      setNotice(null);
    },
    [questionOrder],
  );

  const restartLesson = () => {
    setSelectedTokenIds([]);
    setWordBank(createWordBank(question.answer));
    setResult(null);
    setShowHint(false);
    setNotice("這一題重新開始了！");
  };

  const pickWord = (tokenId: string) => {
    if (result === "correct") return;
    const token = wordBank.find((item) => item.id === tokenId);
    if (token) sayWord(token.text);
    setSelectedTokenIds((current) => [...current, tokenId]);
    setWordBank((current) =>
      current.map((token) => (token.id === tokenId ? { ...token, selected: true } : token)),
    );
    setResult(null);
    setNotice(null);
  };

  const removeWord = (tokenId: string) => {
    if (result === "correct") return;
    const token = wordBank.find((item) => item.id === tokenId);
    if (token) sayWord(token.text);
    setWordBank((current) =>
      current.map((token) => (token.id === tokenId ? { ...token, selected: false } : token)),
    );
    setSelectedTokenIds((current) => current.filter((item) => item !== tokenId));
    setResult(null);
  };

  const clearSentence = () => {
    if (result === "correct") return;
    setWordBank((current) => current.map((token) => ({ ...token, selected: false })));
    setSelectedTokenIds([]);
    setResult(null);
  };

  const checkAnswer = () => {
    if (selectedTokenIds.length !== question.answer.length) {
      setNotice(language === "zh" ? "還有詞語在下面，快把它們放進句子裡。" : "There are still words waiting below.");
      return;
    }
    const selectedWords = selectedTokenIds.map(
      (tokenId) => wordBank.find((token) => token.id === tokenId)?.text ?? "",
    );
    const isCorrect = language === "en"
      ? isFriendlyEnglishAnswer(selectedWords, question.answer)
      : selectedWords.every((word, index) => word === question.answer[index]);
    setResult(isCorrect ? "correct" : "incorrect");
    setNotice(null);
    if (isCorrect) {
      setCompleted((current) => (current.includes(question.id) ? current : [...current, question.id]));
      playCorrect();
    } else {
      playWrong();
    }
  };

  const nextQuestion = () => {
    if (questionIndex === questionOrder.length - 1) {
      setNotice("所有題目都完成了，真厲害！");
      return;
    }
    loadQuestion(questionIndex + 1);
  };

  const builtWords = selectedTokenIds.map((tokenId) => wordBank.find((token) => token.id === tokenId)?.text ?? "");

  return (
    <div className="game-body">
      <motion.article
        className={`task-paper ${result ? `result-${result}` : ""}`}
        key={question.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, rotate: -0.8 }}
        transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="task-topline">
          <span>任務 {String(questionNumber).padStart(2, "0")} / 50</span>
          <button onClick={() => setShowHint((current) => !current)}>
            <CircleHelp size={17} /> 想一想
          </button>
        </div>
        <p className="instruction">{question.prompt}</p>

        <div className="sentence-zone-label">
          <span><Languages size={13} /> {language === "zh" ? "繁體中文" : "English"}</span>
          <button onClick={clearSentence} disabled={selectedTokenIds.length === 0 || result === "correct"}>
            <Eraser size={15} /> 清空
          </button>
        </div>
        <div className={`sentence-zone ${selectedTokenIds.length === 0 ? "is-empty" : ""}`}>
          {selectedTokenIds.length === 0 ? (
            <span>{language === "zh" ? "點一下下面的詞語卡，開始排句子吧！" : "Tap the word cards to build your sentence."}</span>
          ) : (
            selectedTokenIds.map((tokenId, index) => {
              const token = wordBank.find((item) => item.id === tokenId);
              return token ? (
                <motion.button
                  key={token.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => removeWord(token.id)}
                  className="selected-word"
                >
                  {displayWord(token.text, index, language)}
                  <X size={14} />
                </motion.button>
              ) : null;
            })
          )}
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div className="hint-note" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <Sparkles size={16} /> {question.hint}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="word-bank-label">還沒有上軌道的詞語</div>
        <div className="word-bank">
          {wordBank.map((token) => (
            <button
              key={token.id}
              disabled={token.selected}
              onClick={() => pickWord(token.id)}
              className={`word-tile ${token.selected ? "is-selected" : ""}`}
            >
              {token.text}
            </button>
          ))}
        </div>

        <div className="answer-actions">
          <button className="secondary-action" onClick={restartLesson}>
            <RotateCcw size={17} /> 重排
          </button>
          <button className="check-action" onClick={checkAnswer}>
            檢查我的句子 <ArrowRight size={18} />
          </button>
        </div>

        {notice && <p className="game-notice">{notice}</p>}

        <AnimatePresence>
          {result === "correct" && (
            <motion.div
              className="feedback correct-feedback"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.97 }}
            >
              <img src="/images/tiantian-success-stars_5462d800.webp" alt="" />
              <div>
                <span>太棒了！句子發光了</span>
                <p>{builtWords.map((word, index) => displayWord(word, index, language)).join(language === "zh" ? "" : " ")}。</p>
              </div>
              <button onClick={nextQuestion}>下一題 <ChevronRight size={17} /></button>
            </motion.div>
          )}
          {result === "incorrect" && (
            <motion.div className="feedback incorrect-feedback" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="retry-face">?</div>
              <div>
                <span>差一點點，再想一想！</span>
                <p>試著先找出「誰」，再找「做什麼」或「在哪裡」。</p>
              </div>
              <button onClick={clearSentence}>重新排</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>

      <div className="lesson-footer">
        <button className="nav-question" onClick={() => questionIndex > 0 && loadQuestion(questionIndex - 1)} disabled={questionIndex === 0}>
          <ChevronLeft size={19} /> 上一題
        </button>
        <span><Trophy size={17} /> 已完成 <b>{completed.length}</b> 題</span>
        <button className="nav-question" onClick={nextQuestion}>下一題 <ChevronRight size={19} /></button>
      </div>
    </div>
  );
}
