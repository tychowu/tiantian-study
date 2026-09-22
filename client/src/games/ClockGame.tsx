import { BookOpen, Check, Clock3, Gauge, ListOrdered, Move, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { playCorrect, playWrong } from "@/lib/sound";
import { speak } from "@/lib/speech";

type Mode = "face" | "read" | "set" | "day" | "challenge";
type Time = { h: number; m: number };
const ROUTINE = [
  { h: 8, m: 0, order: 8 * 60, label: "起床", emoji: "🌅", tag: "早上" },
  { h: 9, m: 0, order: 9 * 60, label: "上學", emoji: "🎒", tag: "早上" },
  { h: 12, m: 0, order: 12 * 60, label: "放學", emoji: "🏫", tag: "中午" },
  { h: 12, m: 30, order: 12 * 60 + 30, label: "午飯", emoji: "🍚", tag: "中午" },
  { h: 2, m: 0, order: 14 * 60, label: "上家教課", emoji: "📚", tag: "下午" },
  { h: 6, m: 30, order: 18 * 60 + 30, label: "吃晚餐", emoji: "🍲", tag: "傍晚" },
  { h: 8, m: 30, order: 20 * 60 + 30, label: "洗澡", emoji: "🛁", tag: "晚上" },
  { h: 9, m: 0, order: 21 * 60, label: "睡覺", emoji: "🌙", tag: "晚上" },
];
const CONTEXTS = ["天天該起床了", "準備上學", "大家一起吃午飯", "放學回家", "該上床睡覺了"];
const pad = (n: number) => String(n).padStart(2,"0");
const format = (time: Time) => `${time.h}:${pad(time.m)}`;
const zhHour = ["十二","一","二","三","四","五","六","七","八","九","十","十一","十二"];
const wording = ({h,m}:Time) => ({ written: `${zhHour[h]}點${m ? `${m}分` : "正"}`, cantonese: m===0?`${zhHour[h]}點正`:m===30?`${zhHour[h]}點半`:m%5===0?`${zhHour[h]}點${m/5}個字`:`${zhHour[h]}點${m}分`, english: m===0?`${h} o'clock`:m===15?`a quarter past ${h}`:m===30?`half past ${h}`:m===45?`a quarter to ${h===12?1:h+1}`:`${h} ${pad(m)}` });
const choices = (time:Time) => Array.from(new Set([format(time),`${time.h}:${pad((time.m+15)%60)}`,`${time.h===12?1:time.h+1}:${pad(time.m)}`,`${time.h}:${pad((time.m+30)%60)}`])).slice(0,4).sort(()=>Math.random()-.5);
const randomTime = (difficulty:number):Time => { const minuteSets=[[0],[0,30],[0,15,30,45],Array.from({length:12},(_,i)=>i*5)]; const set=minuteSets[difficulty-1]; return {h:Math.ceil(Math.random()*12),m:set[Math.floor(Math.random()*set.length)]}; };

function ClockFace({ time, interactive=false, showMinuteRing=false, activeHand, onHand, onChange }:{time:Time;interactive?:boolean;showMinuteRing?:boolean;activeHand?:"hour"|"minute"|null;onHand?:(hand:"hour"|"minute")=>void;onChange?:(time:Time)=>void}) {
  const svgRef=useRef<SVGSVGElement>(null); const dragging=useRef<"hour"|"minute"|null>(null);
  const move=(clientX:number,clientY:number)=>{ if(!dragging.current||!svgRef.current||!onChange)return; const box=svgRef.current.getBoundingClientRect(); const x=clientX-box.left-box.width/2; const y=clientY-box.top-box.height/2; let deg=Math.atan2(y,x)*180/Math.PI+90;if(deg<0)deg+=360; if(dragging.current==="minute")onChange({...time,m:(Math.round(deg/6/5)*5)%60}); else onChange({...time,h:(Math.round(deg/30)%12)||12}); };
  const hourAngle=(time.h%12)*30+time.m*.5; const minuteAngle=time.m*6;
  return <svg ref={svgRef} className="clock-face" viewBox="0 0 360 400" role="img" aria-label={`時鐘顯示${format(time)}`} onPointerMove={e=>move(e.clientX,e.clientY)} onPointerUp={()=>{dragging.current=null;}} onPointerLeave={()=>{dragging.current=null;}}>
    <path d="M78 63 L48 30 M282 63 L312 30" className="clock-bells"/><circle cx="180" cy="185" r="142" className="clock-body"/><circle cx="180" cy="185" r="123" className="clock-dial"/>
    {Array.from({length:60},(_,i)=>{const a=i*6*Math.PI/180;const major=i%5===0;return <line key={i} x1={180+Math.sin(a)*(major?107:113)} y1={185-Math.cos(a)*(major?107:113)} x2={180+Math.sin(a)*118} y2={185-Math.cos(a)*118} className={major?"clock-tick major":"clock-tick"}/>;})}
    {Array.from({length:12},(_,i)=>{const n=i+1,a=n*30*Math.PI/180;return <text key={n} x={180+Math.sin(a)*91} y={191-Math.cos(a)*91} textAnchor="middle" className="clock-number">{n}</text>;})}
    {showMinuteRing&&Array.from({length:12},(_,i)=>{const n=(i+1)*5,a=(i+1)*30*Math.PI/180;return <text key={n} x={180+Math.sin(a)*132} y={190-Math.cos(a)*132} textAnchor="middle" className="clock-minute-number">{n}</text>;})}
    <g className={`clock-hand hour ${activeHand==="hour"?"is-active":""}`} transform={`rotate(${hourAngle} 180 185)`} onPointerDown={e=>{if(interactive){dragging.current="hour";(e.currentTarget as SVGGElement).setPointerCapture?.(e.pointerId);}onHand?.("hour");}}><line x1="180" y1="195" x2="180" y2="112"/><circle cx="180" cy="112" r="13" className="clock-hit"/></g>
    <g className={`clock-hand minute ${activeHand==="minute"?"is-active":""}`} transform={`rotate(${minuteAngle} 180 185)`} onPointerDown={e=>{if(interactive){dragging.current="minute";(e.currentTarget as SVGGElement).setPointerCapture?.(e.pointerId);}onHand?.("minute");}}><line x1="180" y1="202" x2="180" y2="76"/><circle cx="180" cy="76" r="13" className="clock-hit"/></g>
    <circle cx="180" cy="185" r="11" className="clock-pin"/><path d="M115 335 H245 M135 326 L120 350 M225 326 L240 350" className="clock-feet"/>
  </svg>;
}

export default function ClockGame(){
  const [mode,setMode]=useState<Mode>("face"); const [difficulty,setDifficulty]=useState(1);
  useGameBack(mode !== "face", () => setMode("face"));
  const [faceTime,setFaceTime]=useState<Time>({h:3,m:20}); const [activeHand,setActiveHand]=useState<"hour"|"minute"|null>(null); const [showRing,setShowRing]=useState(false);
  const [readTime,setReadTime]=useState(()=>randomTime(1)); const [readPick,setReadPick]=useState<string|null>(null); const readChoices=useMemo(()=>choices(readTime),[readTime]);
  const [target,setTarget]=useState<Time>(()=>({h:8,m:30})); const [setTime,setSetTime]=useState<Time>({h:8,m:0}); const [setMessage,setSetMessage]=useState<string|null>(null);
  const [routineOrder,setRoutineOrder]=useState<typeof ROUTINE>([]); const [routinePool,setRoutinePool]=useState(()=>[...ROUTINE].sort(()=>Math.random()-.5));
  const [challengeTime,setChallengeTime]=useState(()=>randomTime(2)); const [challengeScore,setChallengeScore]=useState(0); const [challengeRound,setChallengeRound]=useState(0); const [timed,setTimed]=useState(false); const [timeLeft,setTimeLeft]=useState(60);
  useEffect(()=>{if(!timed||timeLeft<=0)return;const timer=window.setInterval(()=>setTimeLeft(value=>Math.max(0,value-1)),1000);return()=>window.clearInterval(timer);},[timed,timeLeft]);
  const sayTime=(time:Time)=>{const w=wording(time);speak(`${w.written}。廣東話會說，${w.cantonese}。英文是，${w.english}`,"zh");};
  const answerRead=(value:string)=>{if(readPick)return;setReadPick(value);if(value===format(readTime)){playCorrect();sayTime(readTime);}else{playWrong();speak(`再看一看，短針看小時，長針看分鐘`,"zh");}};
  const checkSet=()=>{const minutes=Math.abs((setTime.h%12)*60+setTime.m-((target.h%12)*60+target.m));if(minutes<=2){setSetMessage("答對！兩根針都到家了。");playCorrect();sayTime(target);}else if(setTime.h===target.h&&target.m>=30){setSetMessage("分針走到一半，時針也要跟著走一點點喔。看看時針的半格位置。");playWrong();}else{setSetMessage("再試試：短針看小時，長針每一格是5分鐘。");playWrong();}};
  const addRoutine=(item:typeof ROUTINE[number])=>{const expected=[...ROUTINE].sort((a,b)=>a.order-b.order)[routineOrder.length];if(item.label===expected.label){setRoutineOrder(c=>[...c,item]);setRoutinePool(c=>c.filter(x=>x.label!==item.label));playCorrect();}else{playWrong();speak("想想一天裡先做什麼，再做什麼", "zh");}};
  const challengeOptions=useMemo(()=>choices(challengeTime),[challengeTime]); const answerChallenge=(v:string)=>{if(timed&&timeLeft<=0)return;if(v===format(challengeTime)){setChallengeScore(s=>s+1);playCorrect();}else playWrong();setChallengeRound(r=>r+1);setChallengeTime(randomTime(difficulty));};
  const modes=[["face","認識鐘面",BookOpen],["read","我會看時間",Clock3],["set","我會撥時鐘",Move],["day","天天的一天",ListOrdered],["challenge","挑戰",Gauge]] as const;
  return <div className="game-body clock-game-body"><div className="clock-modes">{modes.map(([key,label,Icon],i)=><button key={key} type="button" className={mode===key?"is-on":""} onClick={()=>setMode(key)}><em>{i+1}</em><Icon size={18}/>{label}</button>)}</div>
    <div className="clock-difficulties">{["整點","半點","一刻／三刻","5分鐘"].map((label,i)=><button key={label} type="button" className={difficulty===i+1?"is-on":""} onClick={()=>setDifficulty(i+1)}>{i+1}. {label}</button>)}</div>
    {mode==="face"&&<section className="clock-panel"><header><span>關卡 1</span><h2>認識黃色小鬧鐘</h2><p>點短針、長針，再打開分鐘外圈。</p></header><div className="clock-learn"><ClockFace time={faceTime} showMinuteRing={showRing} activeHand={activeHand} onHand={hand=>{setActiveHand(hand);speak(hand==="hour"?"我是時針，短短的，走得慢":"我是分針，長長的，走得快","zh");}}/><div className="clock-parts"><button type="button" className={activeHand==="hour"?"is-on":""} onClick={()=>{setActiveHand("hour");speak("我是時針，短短的，走得慢","zh");}}>短針＝時針</button><button type="button" className={activeHand==="minute"?"is-on":""} onClick={()=>{setActiveHand("minute");speak("我是分針，長長的，走得快","zh");}}>長針＝分針</button><button type="button" className={showRing?"is-on":""} onClick={()=>setShowRing(v=>!v)}>分鐘外圈 {showRing?"已打開":""}</button><div><b>分針指到 4</b><strong>4 × 5 = 20 分</strong><p>「一個字」也是 5 分鐘，所以 4 個字就是 20 分鐘。</p></div></div></div></section>}
    {mode==="read"&&<section className="clock-panel"><header><span>關卡 2 · 生活情境</span><h2>現在幾點？</h2><p>{CONTEXTS[Math.floor((readTime.h%12)/3)]??"看看時鐘"}</p></header><div className="clock-question"><ClockFace time={readTime}/><div className="clock-options">{readChoices.map(v=><button key={v} type="button" className={readPick?v===format(readTime)?"is-right":v===readPick?"is-wrong":"":""} onClick={()=>answerRead(v)}>{v}</button>)}{readPick&&<button type="button" className="clock-next" onClick={()=>{setReadTime(randomTime(difficulty));setReadPick(null);}}>下一題 →</button>}</div></div></section>}
    {mode==="set"&&<section className="clock-panel"><header><span>關卡 3 · 最關鍵的輸出</span><h2>請撥到 {format(target)}</h2><p>拖動兩根針。分針走的時候，時針也會慢慢往前。</p></header><div className="clock-question"><ClockFace time={setTime} interactive onChange={setSetTime}/><div className="clock-set-card"><b>目标 {format(target)}</b><span>你撥的是 {format(setTime)}</span><button type="button" onClick={checkSet}><Check size={17}/> 檢查</button><button type="button" onClick={()=>{const next=randomTime(difficulty);setTarget(next);setSetTime({h:next.h,m:0});setSetMessage(null);}}>換一個時間</button>{setMessage&&<p>{setMessage}</p>}</div></div></section>}
    {mode==="day"&&<section className="clock-panel"><header><span>關卡 4</span><h2>天天的一天</h2><p>按一天發生的先後順序，把生活卡排進時間軸。</p></header><div className="clock-day-line">{routineOrder.map(item=><div key={item.label}><span>{item.emoji}</span><b>{item.label}</b><i>{item.tag} {format(item)}</i></div>)}</div><div className="clock-routine-pool">{routinePool.map(item=><button key={item.label} type="button" onClick={()=>addRoutine(item)}><span>{item.emoji}</span><b>{item.label}</b><i>{item.tag} {format(item)}</i></button>)}</div>{routinePool.length===0&&<div className="clock-success"><Check/> 一天排好了！時間讓生活變得有順序。</div>}</section>}
    {mode==="challenge"&&<section className="clock-panel"><header><span>關卡 5 · 可選速度挑戰</span><h2>看誰最快讀對</h2><p>平時不開計時；想挑戰時再打開，不讓速度蓋過理解。</p></header><label className="clock-timer-toggle"><input type="checkbox" checked={timed} onChange={e=>{setTimed(e.target.checked);setTimeLeft(60);setChallengeScore(0);setChallengeRound(0);}}/> 開啟 60 秒挑戰</label><div className="clock-question"><ClockFace time={challengeTime}/><div className="clock-options"><strong><Star fill="#ffb400"/> {challengeScore} 分 · 第 {challengeRound+1} 题 {timed?`· ${timeLeft} 秒`:""}</strong>{timed&&timeLeft===0&&<p>時間到！你答對了 {challengeScore} 題。</p>}{challengeOptions.map(v=><button key={v} type="button" disabled={timed&&timeLeft===0} onClick={()=>answerChallenge(v)}>{v}</button>)}</div></div></section>}
  </div>;
}
import { useGameBack } from "@/lib/gameBack";
