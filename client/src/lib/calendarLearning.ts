export type CalendarDay = { year: number; month: number; day: number };
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEK_NAMES = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
export function isLeapYear(year: number) { return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0); }
export function daysInMonth(year: number, month: number) { return month === 2 ? (isLeapYear(year) ? 29 : 28) : [4, 6, 9, 11].includes(month) ? 30 : 31; }
export function hongKongToday(now = new Date()): CalendarDay {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Hong_Kong", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}
export function dateNumber(d: CalendarDay) { const date = new Date(0); date.setUTCFullYear(d.year, d.month - 1, d.day); return date.getTime(); }
export function shiftDay(d: CalendarDay, amount: number): CalendarDay {
  const next = new Date(dateNumber(d) + amount * 86400000);
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() };
}
export function shiftMonth(d: CalendarDay, amount: number): CalendarDay {
  const next = new Date(dateNumber({ year: d.year, month: d.month + amount, day: 1 }));
  const year = next.getUTCFullYear(), month = next.getUTCMonth() + 1;
  return { year, month, day: Math.min(d.day, daysInMonth(year, month)) };
}
export function weekday(d: CalendarDay) { return new Date(dateNumber(d)).getUTCDay(); }
export function sameDay(a: CalendarDay, b: CalendarDay) { return dateNumber(a) === dateNumber(b); }
export function dateWords(d: CalendarDay) { return `${d.year}年${d.month}月${d.day}日，${WEEK_NAMES[weekday(d)]}`; }
export const SEASONS = [
  { name: "春季", en: "Spring", icon: "🌷", months: [3, 4, 5], color: "#e8b7ce", text: "春天，留意新葉和花朵。", activity: "到窗邊看看：你找到甚麼顏色的花或葉？" },
  { name: "夏季", en: "Summer", icon: "☀️", months: [6, 7, 8], color: "#f2cc78", text: "夏天，香港通常較熱，也常有雨。", activity: "想想夏天出門，你會帶水、帽子，還是雨傘？" },
  { name: "秋季", en: "Autumn", icon: "🍂", months: [9, 10, 11], color: "#efb28d", text: "秋天，留意天氣和葉子的變化。", activity: "香港很多樹全年都綠綠的。你家附近的樹呢？" },
  { name: "冬季", en: "Winter", icon: "🧣", months: [12, 1, 2], color: "#a9cee5", text: "冬天，香港通常較涼，冷時要添衣。", activity: "冬天不一定會下雪。想一想香港冬天穿甚麼？" },
];
export function seasonFor(month: number) { return SEASONS.find(s => s.months.includes(month))!; }
