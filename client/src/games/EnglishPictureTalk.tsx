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
    <div className="english-talk-workspace"><div className="english-talk-picture-column"><div className="story-picture-panel"><div className="story-picture"><img src={`/images/stories/${story.image}.webp`} alt={story.alt} draggable={false}/>{word !== null && <span className="english-picture-marker" style={{ left: `${story.words[word].x}%`, top: `${story.words[word].y}%` }} aria-hidden="true">⭕️</span>}</div></div>
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
  useGameBack(selected !== null, () => setSelected(null), 30);
  const story = ENGLISH_STORIES.find(s => s.id === selected);
  useEffect(() => () => stopSpeaking(), []);
  return <div lang="en" className="english-picture-talk">{story ? <Session key={story.id} story={story}/> : <><h1>Let's Talk About Pictures</h1><p>Look closely. Find words. Share your ideas.</p><div className="story-selection">{ENGLISH_STORIES.map(s => <button key={s.id} onClick={() => setSelected(s.id)}><img src={`/images/stories/${s.image}.webp`} alt={s.alt}/><span className="story-selection-copy"><strong>{s.title}</strong><span>Key Words · Guided Questions · My Picture Talk</span><b>Let's begin →</b></span></button>)}</div></>}</div>;
}
