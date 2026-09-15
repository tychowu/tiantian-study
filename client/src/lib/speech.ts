/**
 * 發音：用瀏覽器內建的語音合成（Web Speech API）。
 * 英文與繁體中文都支援；給小朋友聽，所以語速放慢一點、聲音高一點。
 */

type Lang = "en" | "zh";

const voiceCache: Partial<Record<Lang, SpeechSynthesisVoice | null>> = {};

/** 中文句子裡要跳過的符號（不朗讀、也不可點）。 */
const SKIP = /^[\s，。、！？；：（）「」『』—…·．,.!?;:()\-–—/\\|]+$/;

const PREFERRED: Record<Lang, string[]> = {
  en: ["Samantha", "Karen", "Moira", "Google US English", "Microsoft Zira", "Daniel"],
  zh: ["Meijia", "Ting-Ting", "Sinji", "Google 繁體中文", "Microsoft Yating", "Microsoft Hanhan"],
};

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (voiceCache[lang] !== undefined) return voiceCache[lang] ?? null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const wanted = lang === "zh" ? ["zh-TW", "zh-Hant", "zh"] : ["en-US", "en-GB", "en"];
  const pool = voices.filter((voice) =>
    wanted.some((prefix) => voice.lang.toLowerCase().startsWith(prefix.toLowerCase())),
  );
  if (!pool.length) return null;

  for (const name of PREFERRED[lang]) {
    const hit = pool.find((voice) => voice.name.includes(name));
    if (hit) {
      voiceCache[lang] = hit;
      return hit;
    }
  }
  voiceCache[lang] = pool[0];
  return pool[0];
}

/** 瀏覽器是否支援發音（不支援時呼叫方要隱藏喇叭按鈕）。 */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** 監聽語音清單載入（Safari 是非同步的）。 */
export function onVoicesReady(callback: (ready: boolean) => void): () => void {
  if (!canSpeak()) return () => {};
  const check = () => callback(window.speechSynthesis.getVoices().length > 0);
  check();
  window.speechSynthesis.addEventListener?.("voiceschanged", check);
  return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
}

/** 朗讀一小段文字。英文 rate 0.8、中文 0.85，讓小朋友聽得清楚。 */
export function speak(text: string, lang: Lang = "en", rate?: number): void {
  if (!canSpeak()) return;
  const clean = (lang === "en" ? text.replace(/\|[^\s]*/g, "") : text).trim();
  if (!clean) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = lang === "zh" ? "zh-TW" : "en-US";
  utterance.rate = rate ?? (lang === "zh" ? 0.85 : 0.8);
  utterance.pitch = 1.15;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

/** 停止朗讀。 */
export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/** 判斷這個字要不要朗讀（標點符號就跳過）。 */
export function isSpeakableChar(char: string): boolean {
  return !SKIP.test(char);
}
