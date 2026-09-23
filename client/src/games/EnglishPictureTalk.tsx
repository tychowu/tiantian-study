import { useEffect, useState } from "react";
import { useGameBack } from "@/lib/gameBack";
import { ENGLISH_STORIES, type EnglishStory } from "@/data/englishStories";
import { canSpeak, speak, stopSpeaking } from "@/lib/speech";

function Session({ story }: { story: EnglishStory }) {
  const [word, setWord] = useState<number | null>(null);
  const [question, setQuestion] = useState(0);
  const [idea, setIdea] = useState(false);
  const [model, setModel] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const say = (text: string) => speak(text, "en");
  const q = story.questions[question];
  useEffect(() => () => stopSpeaking(), []);
  return <>
    <div className="story-topline"><h1>{story.title}</h1></div>
    {!canSpeak() && <p role="status">Your browser cannot read aloud. You can still explore and tell your story.</p>}
    <div className="english-talk-workspace"><div className="english-talk-picture-column"><div className="story-picture-panel"><div className="story-picture"><img src={`/images/stories/${story.image}.webp`} alt={story.alt} draggable={false}/>{word !== null && story.words[word].x !== undefined && story.words[word].y !== undefined && <span className="english-picture-marker" style={{ left: `${story.words[word].x}%`, top: `${story.words[word].y}%` }} aria-hidden="true">⭕️</span>}</div></div>
      <section className="english-section english-words-card"><h2><span className="english-step-icon" aria-hidden="true">🔎</span> Key Words</h2><p>Pick a word. Find it in the picture. Say it aloud!</p><div className="english-word-bank">{story.words.map((w, i) => <button key={w.text} aria-pressed={word === i} onClick={() => { setWord(i); say(w.text); }}>{w.text}</button>)}</div>{word !== null && <div className="english-word-example"><small>Try a sentence</small><button onClick={() => say(story.words[word].sentence)}>{story.words[word].sentence}</button></div>}</section>
    </div><div className="english-talk-sidebar"><div className="english-coaching-grid">
      <section className="english-section english-questions-card"><h2><span className="english-step-icon" aria-hidden="true">💡</span> 2. Guided Questions</h2><div className="english-question-tabs" aria-label="Choose a question">{story.questions.map((item, i) => <button key={item.text} aria-label={`Question ${i + 1}${done.includes(i) ? ", tried" : ""}`} aria-pressed={question === i} onClick={() => { stopSpeaking(); setQuestion(i); setIdea(false); say(item.text); }}>{done.includes(i) ? "✓ " : ""}{i + 1}</button>)}</div><button className="english-question" onClick={() => say(q.text)}>{q.text}</button><div className="english-starter"><small>Start with…</small><button onClick={() => say(q.starter.replaceAll("…", ""))}>{q.starter}</button></div><div className="english-actions"><button onClick={() => { setDone(v => v.includes(question) ? v : [...v, question]); }}>⭐ I tried it!</button><button aria-expanded={idea} onClick={() => setIdea(v => !v)}>{idea ? "Hide an idea" : "💡 Need an idea?"}</button></div>{idea && <button className="english-answer" onClick={() => say(q.idea)}>{q.idea}</button>}<p aria-live="polite">{done.length} of {story.questions.length} questions tried. Take your time!</p></section>
    </div>
    <section className="english-section english-model"><h2><span className="english-step-icon" aria-hidden="true">🎤</span> 3. My Picture Talk</h2><p>Use your words and answers to tell someone about the picture.</p><div className="english-speaking-cues"><span>📍 Where?</span><span>👧 Who?</span><span>🎬 Doing what?</span><span>😊 How do they feel?</span></div><div className="english-actions"><button onClick={() => setFinished(v => !v)}>{finished ? "Tell it again" : "I told my story!"}</button><button aria-expanded={model} onClick={() => { stopSpeaking(); setModel(v => !v); }}>{model ? "Hide sample" : "📖 Show a sample"}</button></div>{finished && <p role="status">🌟 Well done for sharing your ideas!</p>}{model && <div className="english-sample"><h3>One way to describe the picture</h3><p>Your story can be different. Tap a sentence to listen.</p><button onClick={() => say(story.model.join(" "))}>Listen to the whole sample</button><div>{story.model.map(sentence => <button key={sentence} onClick={() => say(sentence)}>{sentence}</button>)}</div></div>}<small>No timer. No score. Your voice is not recorded.</small></section>
    </div></div>
  </>;
}

export default function EnglishPictureTalk() {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState("All pictures");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  useGameBack(selected !== null, () => setSelected(null), 30);
  const story = ENGLISH_STORIES.find(s => s.id === selected);
  const categories = ["All pictures", ...Array.from(new Set(ENGLISH_STORIES.map(s => s.category ?? "Home and Family")))];
  const matches = ENGLISH_STORIES.filter(s => (category === "All pictures" || (s.category ?? "Home and Family") === category) && `${s.title} ${s.category ?? "Home and Family"} ${s.alt} ${s.words.map(w => w.text).join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(matches.length / 12));
  const currentPage = Math.min(page, pageCount - 1);
  const scrollTop = () => document.querySelector(".stage-scroll")?.scrollTo({ top: 0 });
  useEffect(() => () => stopSpeaking(), []);
  return <div lang="en" className="english-picture-talk">{story ? <Session key={story.id} story={story}/> : <>
    <h1>Let's Talk About Pictures</h1><p>Look closely. Find words. Share your ideas.</p>
    <div className="english-library-tools">
      <label className="english-library-search"><span>🔎 Find a picture</span><input type="search" value={search} placeholder="Try train, animals or cake" onChange={event => { setSearch(event.target.value); setPage(0); }}/></label>
      <label className="english-library-topic"><span>🧭 Explore a topic</span><select value={category} onChange={event => { setCategory(event.target.value); setPage(0); }}>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    </div>
    <p className="english-library-count" role="status">{matches.length} {matches.length === 1 ? "picture" : "pictures"} to explore</p>
    {matches.length === 0 && <div className="english-library-empty"><span aria-hidden="true">🔭</span><h2>No pictures found yet</h2><p>Try another word, or explore all the pictures.</p><button onClick={() => { setSearch(""); setCategory("All pictures"); setPage(0); }}>Show all pictures</button></div>}
    <div className="story-selection">{matches.slice(currentPage * 12, currentPage * 12 + 12).map(s => <button key={s.id} onClick={() => { stopSpeaking(); setSelected(s.id); scrollTop(); }}><img src={`/images/stories/${s.image}.webp`} alt={s.alt} loading="lazy" decoding="async" draggable={false}/><span className="story-selection-copy"><small>{s.category ?? "Home and Family"}</small><strong>{s.title}</strong><span>Key Words · Guided Questions · My Picture Talk</span><b>Let's begin →</b></span></button>)}</div>
    {pageCount > 1 && <nav className="english-library-pages" aria-label="Picture pages"><button disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); scrollTop(); }}>← Previous</button><span>Page {currentPage + 1} of {pageCount}</span><button disabled={currentPage + 1 === pageCount} onClick={() => { setPage(currentPage + 1); scrollTop(); }}>Next →</button></nav>}
  </>}</div>;
}
