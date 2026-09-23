import { useEffect, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { speak, stopSpeaking } from "@/lib/speech";
import { useGameBack } from "@/lib/gameBack";
import { MONTH_NAMES, WEEK_NAMES, SEASONS, hongKongToday, daysInMonth, isLeapYear, shiftDay, shiftMonth, weekday, sameDay, dateWords, seasonFor, type CalendarDay } from "@/lib/calendarLearning";

const AREAS = [
  { id: "today", icon: "📅", title: "今天是哪一天？", en: "Today", text: "翻一翻日曆，走到明天！" },
  { id: "seasons", icon: "🌳", title: "一年四季轉轉看", en: "Seasons", text: "12 個月份，4 個季節。" },
  { id: "days", icon: "🧱", title: "月份有幾天？", en: "Days in a month", text: "先猜一猜，再數日期積木。" },
  { id: "leap", icon: "🐸", title: "二月的秘密", en: "Leap year", text: "28 還是 29？多一天去探險！" },
] as const;
type Area = typeof AREAS[number]["id"];
function Listen({ text }: { text: string }) { return <button className="date-listen" aria-label={`聽一聽：${text}`} onClick={() => speak(text, "zh")}><Volume2 size={18}/> 聽一聽</button>; }
function DayTiles({ count, special = false }: { count: number; special?: boolean }) {
  const reduced = useReducedMotion();
  return <div className="date-tiles" aria-label={`${count} 天，每格代表一天`}>{Array.from({ length: count }, (_, i) => <motion.button key={i} initial={reduced ? false : { opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduced ? 0 : i * .015 }} className={special && i === 28 ? "date-extra" : ""} onClick={() => speak(`${i + 1}日${special && i === 28 ? '，閏年二月多出的一天' : ''}`, "zh")}>{i + 1}</motion.button>)}</div>;
}

function TodayLab({ today }: { today: CalendarDay }) {
  const [chosen, setChosen] = useState<CalendarDay | null>(null);
  const d = chosen ?? today;
  const [message, setMessage] = useState("點日期格，聽聽它是哪一天。橙色外框標着真正的今天。");
  const [target, setTarget] = useState<CalendarDay | null>(null);
  const total = daysInMonth(d.year, d.month);
  const move = (next: CalendarDay) => {
    setChosen(next);
    setMessage(next.year !== d.year ? `跨年啦！從 ${d.year} 年走到 ${next.year} 年。` : next.month !== d.month ? `換月啦！${d.month} 月有 ${total} 天，現在來到 ${next.month} 月。` : dateWords(next));
  };
  const mission = (kind: "today" | "tomorrow" | "end") => {
    const next = kind === "today" ? today : kind === "tomorrow" ? shiftDay(today, 1) : { ...d, day: total };
    setTarget(next); setChosen({ ...next, day: 1 });
    const text = kind === "today" ? "找找真正的今天。" : kind === "tomorrow" ? `今天是 ${today.month} 月 ${today.day} 日，明天在哪一格？` : `找出 ${d.month} 月的最後一天。`;
    setMessage(text); speak(text, "zh");
  };
  return <div className="date-two-columns">
    <section className="date-paper">
      <div className="date-calendar-heading"><button aria-label="上一個月" onClick={() => move(shiftMonth(d, -1))}><ChevronLeft/></button><h2>{d.year} 年 · {d.month} 月</h2><button aria-label="下一個月" onClick={() => move(shiftMonth(d, 1))}><ChevronRight/></button></div>
      <button className="date-english" onClick={() => speak(MONTH_NAMES[d.month - 1], "en")}>{MONTH_NAMES[d.month - 1]}</button>
      <div className="date-calendar" aria-label={`${d.year}年${d.month}月日曆`}>
        {WEEK_NAMES.map(w => <span className="date-weekday" key={w}>{w.slice(-1)}</span>)}
        {Array.from({ length: weekday({ ...d, day: 1 }) }, (_, i) => <span key={`blank-${i}`} aria-hidden="true"/>)}
        {Array.from({ length: total }, (_, i) => { const cell = { ...d, day: i + 1 }; return <button key={i} aria-label={`${dateWords(cell)}${sameDay(cell, today) ? '，今天' : ''}`} aria-pressed={sameDay(cell, d)} aria-current={sameDay(cell, today) ? "date" : undefined} onClick={() => { setChosen(cell); const text = target ? sameDay(cell, target) ? `✨ 找到了！${dateWords(cell)}。` : `你選了 ${cell.day} 日，再看看小任務的線索吧。` : dateWords(cell); setMessage(text); speak(text, "zh"); if (target && sameDay(cell, target)) setTarget(null); }}>{i + 1}{sameDay(cell, today) && <small>今天</small>}</button>; })}
      </div><p className="date-caption">一格是 1 天 · 一排是 1 星期 · 1 星期有 7 天</p>
    </section>
    <section className="date-paper date-console">
      <p className="date-eyebrow">{sameDay(d, today) ? "📍 真正的今天" : "🚀 正在探索的日期"}</p>
      <div className="date-address">{[{ value: d.year, unit: "年", en: "Year", text: "一年有十二個月。" }, { value: d.month, unit: "月", en: "Month", text: `${d.month}月有${total}天。` }, { value: d.day, unit: "日", en: "Day", text: "一天過後，日期向前走一格。" }].map(x => <button key={x.unit} onClick={() => speak(`${x.value}${x.unit}。${x.text}`, "zh")}><b>{x.value}</b><span>{x.unit}</span><small>{x.en}</small></button>)}</div>
      <h3>{WEEK_NAMES[weekday(d)]} · {seasonFor(d.month).icon} {seasonFor(d.month).name}</h3>
      <div className="date-actions"><button onClick={() => move(shiftDay(d, -1))}>← 前一天</button><button className="date-primary" onClick={() => move(shiftDay(d, 1))}>過一天 →</button><button onClick={() => { setChosen(null); setTarget(null); setMessage(`回到今天：${dateWords(today)}。`); }}>📍 回到今天</button></div>
      <p className="date-feedback" role="status">{message}</p><Listen text={message}/>
      <h3>🔎 日期小任務</h3><div className="date-actions"><button onClick={() => mission("today")}>找今天</button><button onClick={() => mission("tomorrow")}>找明天</button><button onClick={() => mission("end")}>找月底</button></div>
      <h3>🚪 看看換月與跨年</h3><div className="date-actions"><button onClick={() => { setTarget(null); move({ ...d, day: total }); }}>跳到月底</button><button onClick={() => { setTarget(null); move({ year: d.year, month: 12, day: 31 }); }}>跳到 12 月 31 日</button></div>
    </section>
  </div>;
}

function SeasonsLab({ today }: { today: CalendarDay }) {
  const [month, setMonth] = useState(today.month);
  const season = seasonFor(month);
  return <div className="date-two-columns"><section className="date-paper date-wheel-panel"><h2>點一個月份，轉一圈！</h2><div className="date-wheel"><div className="date-wheel-centre" style={{ background: season.color }}><span>{season.icon}</span><strong>{season.name}</strong><button onClick={() => speak(season.en, "en")}>{season.en}</button></div>{MONTH_NAMES.map((_, i) => { const angle = (i * 30 - 90) * Math.PI / 180; return <button className="date-wheel-month" key={i} aria-pressed={month === i + 1} style={{ left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 40 * Math.sin(angle)}%`, background: seasonFor(i + 1).color }} onClick={() => { setMonth(i + 1); speak(`${i + 1}月，${seasonFor(i + 1).name}`, "zh"); }}>{i + 1}<small>月</small></button>; })}</div><div className="date-actions"><button onClick={() => setMonth(month === 1 ? 12 : month - 1)}>← 上個月</button><button className="date-primary" onClick={() => setMonth(month === 12 ? 1 : month + 1)}>下個月 →</button></div></section>
    <section className="date-paper"><div className="date-season-scene" style={{ "--season-color": season.color } as CSSProperties}><span className="date-season-cloud">☁️</span><span className="date-season-symbol" key={season.name}>{season.icon}</span><span className="date-season-tree">🌳</span></div><h2>{month} 月住在{season.name}</h2><button className="date-english" onClick={() => speak(MONTH_NAMES[month - 1], "en")}>{MONTH_NAMES[month - 1]}</button><p>{season.text}</p><Listen text={`${month}月是${season.name}。${season.text}${season.activity}`}/><p className="date-feedback">👀 {season.activity}</p><div className="date-season-list">{SEASONS.map(s => <button key={s.name} aria-pressed={s.name === season.name} onClick={() => setMonth(s.months[0])}>{s.icon} {s.name}<span>{s.months.join("、")} 月</span></button>)}</div><p className="date-caption">這裡用香港的「氣象四季」來記月份。冬季跨過新年：12 月 → 1 月 → 2 月。實際天氣不會在換月時突然改變。</p></section></div>;
}

function MonthDaysLab({ today }: { today: CalendarDay }) {
  const [month, setMonth] = useState(today.month);
  const [year, setYear] = useState(today.year);
  const [reveal, setReveal] = useState(false);
  const [feedback, setFeedback] = useState("先選一個月份，猜猜它有幾天。");
  const count = daysInMonth(year, month);
  useEffect(() => { setFeedback(`猜猜 ${year} 年 ${month} 月有幾天？`); }, [year, month]);
  const pick = (m: number) => { setMonth(m); setReveal(false); setFeedback(`猜猜 ${year} 年 ${m} 月有幾天？`); };
  return <div className="date-two-columns"><section className="date-paper"><h2>12 個月份小房子</h2><p>1 年 = 12 個月。每個月的天數不一定一樣。</p><div className="date-month-houses">{MONTH_NAMES.map((name, i) => <button key={name} aria-pressed={month === i + 1} onClick={() => pick(i + 1)}><span>{seasonFor(i + 1).icon}</span><strong>{i + 1} 月</strong><small>{name}</small></button>)}</div><p className="date-memory">🎵 一、三、五、七、八、十、十二，都是 31 天！</p><Listen text="一月、三月、五月、七月、八月、十月、十二月，都是三十一天。四月、六月、九月、十一月，都是三十天。二月平年二十八天，閏年二十九天。"/></section>
    <section className="date-paper"><div className="date-calendar-heading"><button aria-label="上一年" onClick={() => { setYear(year - 1); setReveal(false); }}>−</button><h2>{year} 年 · {month} 月</h2><button aria-label="下一年" onClick={() => { setYear(year + 1); setReveal(false); }}>＋</button></div><p>先猜，再揭曉。慢慢探索，沒有分數。</p><div className="date-guesses">{[28, 29, 30, 31].map(n => <button key={n} onClick={() => { setReveal(true); const text = n === count ? `✨ 你發現了！這個月有 ${count} 天。` : `一起數數看：這個月有 ${count} 天。`; setFeedback(text); speak(text, "zh"); }}>{n}<small>天</small></button>)}</div><button className="date-primary" onClick={() => { setReveal(true); setFeedback(`${year} 年 ${month} 月有 ${count} 天，每格是一天。`); }}>👀 打開日期積木</button><p role="status" className="date-feedback">{feedback}</p>{reveal ? <><DayTiles key={`${year}-${month}`} count={count} special={month === 2 && count === 29}/><h3>{month} 月 = {count} 天</h3></> : <div className="date-mystery">🧩<span>日期積木藏起來了</span></div>}<p className="date-caption">二月最特別：平年 28 天，閏年 29 天。七月和八月連在一起，兩個月都是 31 天。</p></section></div>;
}

function LeapLab({ today }: { today: CalendarDay }) {
  const [year, setYear] = useState(today.year);
  const [step, setStep] = useState(0);
  const leap = isLeapYear(year), count = daysInMonth(year, 2);
  const change = (y: number) => { setYear(y); setStep(0); };
  const walk = shiftDay({ year, month: 2, day: 28 }, step);
  return <div className="date-two-columns"><section className="date-paper"><div className="date-calendar-heading"><button aria-label="二月上一年" disabled={year <= 1600} onClick={() => change(year - 1)}>−</button><h2>{year} 年</h2><button aria-label="二月下一年" disabled={year >= 2400} onClick={() => change(year + 1)}>＋</button></div><p className="date-leap-label">{leap ? "🐸 閏年 · Leap year" : "🌱 平年 · Common year"}</p><DayTiles key={year} count={count} special={leap}/><h2>二月有 {count} 天</h2><p>這一年有 <strong>{leap ? 366 : 365}</strong> 天，仍然是 <strong>12</strong> 個月。</p><div className="date-actions">{[today.year, 2028, 2000, 2100].filter((v, i, a) => a.indexOf(v) === i).map(y => <button key={y} aria-pressed={year === y} onClick={() => change(y)}>{y === today.year ? `今年 ${y}` : y}</button>)}</div></section>
    <section className="date-paper"><h2>從 2 月 28 日往前走</h2><p>先猜：下一天是 2 月 29 日，還是 3 月 1 日？</p><div className="date-leap-walk" aria-live="polite"><span>🐸</span><strong>{walk.month} 月 {walk.day} 日</strong><small>{WEEK_NAMES[weekday(walk)]}</small></div><div className="date-actions"><button className="date-primary" disabled={step >= 2} onClick={() => { setStep(step + 1); speak(dateWords(shiftDay(walk, 1)), "zh"); }}>跳到下一天 →</button><button onClick={() => setStep(0)}>再看一次</button></div><p className="date-feedback">{leap ? "這一年二月多一格！2 月 28 日 → 2 月 29 日 → 3 月 1 日。" : "這一年二月只有 28 格！2 月 28 日之後就是 3 月 1 日。"}</p><Listen text={`我們選的${year}年是${leap ? '閏年' : '平年'}。二月有${count}天。${leap ? '多出的一天叫閏日。' : '二月二十八日之後，就是三月一日。'}`}/><h3>🌍 為甚麼要多一天？</h3><p>地球繞太陽一圈，約比 365 天多一點。曆法隔一段時間補一天，讓日期和季節保持配合。</p><div className="date-distinction"><strong>閏日，不是閏月</strong><p>公曆：二月加 <b>1 天</b>，叫「閏日」。<br/>農曆：有些年份加 <b>1 個月</b>，叫「閏月」。<br/>這個遊戲探索的是公曆。</p></div><details><summary>給好奇的你：每 4 年都一定是閏年嗎？</summary><p>通常每 4 年一次。不過，整百的年份要能被 400 整除才是閏年。所以 2000 年是閏年，2100 年不是。按左邊年份比較一下！</p><Listen text="通常每四年有一個閏年。但是整百的年份，要能被四百整除才是閏年。二千年是閏年，二千一百年不是。"/></details></section></div>;
}

export default function CalendarGame() {
  const [today, setToday] = useState(hongKongToday);
  const [area, setArea] = useState<Area | null>(null);
  useGameBack(area !== null, () => setArea(null), 20);
  useEffect(() => {
    const update = () => setToday(previous => { const next = hongKongToday(); return sameDay(previous, next) ? previous : next; });
    const timer = window.setInterval(update, 30000);
    window.addEventListener("focus", update); document.addEventListener("visibilitychange", update);
    return () => { clearInterval(timer); window.removeEventListener("focus", update); document.removeEventListener("visibilitychange", update); stopSpeaking(); };
  }, []);
  return <div className="game-body date-game"><div className="date-topline"><h1>📅 日期小探險家</h1><button onClick={() => speak(`今天是${dateWords(today)}`, "zh")}>📍 香港今天：{dateWords(today)}</button></div>{area === null ? <><p className="date-intro">一天接一天，一月接一月。一起找到你在時間裡的位置。</p><div className="date-area-grid">{AREAS.map(a => <button key={a.id} onClick={() => { stopSpeaking(); setArea(a.id); }}><span>{a.icon}</span><h2>{a.title}</h2><small>{a.en}</small><p>{a.text}</p><b>開始探索 →</b></button>)}</div><p className="date-caption">先玩「今天是哪一天」，再試試月份和二月的秘密。所有探索都不計時、不評分。</p></> : <><nav className="date-tabs" aria-label="日期探索區">{AREAS.map(a => <button key={a.id} aria-pressed={area === a.id} onClick={() => { stopSpeaking(); setArea(a.id); }}>{a.icon} {a.title}</button>)}</nav>{area === "today" && <TodayLab today={today}/>} {area === "seasons" && <SeasonsLab today={today}/>} {area === "days" && <MonthDaysLab today={today}/>} {area === "leap" && <LeapLab today={today}/>}</>}<details className="date-sources"><summary>給陪伴的大人：日期與季節說明</summary><p>日期以裝置時間換算為香港時區，每半分鐘及返回畫面時更新。這裡採用公曆，以及北半球的氣象四季；不是農曆月份或節氣分季。</p><p>資料參考香港天文台：<a href="https://www.hko.gov.hk/tc/gts/time/basicterms-leapyear.htm" target="_blank" rel="noreferrer">閏年</a> · <a href="https://www.hko.gov.hk/tc/education/climate/general-climatology/00545-definition-of-seasons.html" target="_blank" rel="noreferrer">季節的劃分</a> · <a href="https://www.hko.gov.hk/tc/gts/time/lunarcal.htm" target="_blank" rel="noreferrer">農曆曆法</a></p></details></div>;
}
