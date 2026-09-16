/**
 * 發音：用瀏覽器內建的語音合成（Web Speech API）。
 *
 * 中文**一律以廣東話（粵語）為第一優先**。這一點很重要：
 * 粵語語音的 lang 是「yue-HK」而不是「zh-HK」，名稱通常是「善怡 / Sinji」，
 * 若只照 "zh-TW / zh-Hant" 去篩選，永遠選不到粵語，會靜靜降級成國語或普通話；
 * 而且每台裝置裝的語音不同（電腦有、手機可能沒有），很容易「電腦是粵語、手機變國語」。
 *
 * 因此這裡定了一套固定的優先順序，讓 iPhone / iPad / Mac / 電腦都走同一條規則：
 *   嚴格粵語 → 香港中文(zh-HK) → 繁體中文(zh-TW/zh-Hant) → 其他中文
 * 另外處理了 iOS 的兩個老問題：語音清單非同步載入、cancel() 後要延遲才 speak。
 */

type Lang = "en" | "zh";

const voiceCache: Partial<Record<Lang, SpeechSynthesisVoice | null>> = {};

/** 中文句子裡要跳過的符號（不朗讀、也不可點）。 */
const SKIP = /^[\s，。、！？；：（）「」『』—…·．,.!?;:()\-–—/\\|]+$/;

const norm = (value: string) => value.toLowerCase().replace(/_/g, "-");

/** 粵語語音的「名稱」關鍵字（各平台叫法不同，全部收錄）。 */
const CANTONESE_NAMES = ["善怡", "sinji", "sin-ji", "粵語", "粤语", "cantonese", "廣東話", "广东话"];
/** 粵語語音的「lang」前綴。注意 yue-HK 才是標準標籤，zh-HK 是備援。 */
const CANTONESE_LANGS = ["yue", "zh-yue"];
/** 香港中文：絕大多數裝置上就是粵語。 */
const HONGKONG_LANGS = ["zh-hk", "zh-hant-hk"];

/** 備援：繁體中文（國語）語音的名稱優先順序。 */
const HAN_NAMES = ["美嘉", "meijia", "ting-ting", "婷婷", "google 繁體中文", "google 普通话（中國）", "microsoft yating", "microsoft hanhan"];
const HAN_LANGS = ["zh-tw", "zh-hant", "zh-hk", "zh"];

const EN_NAMES = ["Samantha", "Karen", "Moira", "Google US English", "Microsoft Zira", "Daniel"];

function allVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  try {
    return window.speechSynthesis.getVoices() ?? [];
  } catch {
    return [];
  }
}

/** 在一組語音裡，先按名稱優先順序挑，其次選本機語音（離線可用、延遲低）。 */
function bestOf(pool: SpeechSynthesisVoice[], names: string[]): SpeechSynthesisVoice {
  for (const name of names) {
    const hit = pool.find((voice) => norm(voice.name).includes(norm(name)));
    if (hit) return hit;
  }
  const local = pool.find((voice) => voice.localService);
  return local ?? pool[0];
}

/** 挑中文語音：粵語優先，沒有才往後降級。 */
function pickChineseVoice(): SpeechSynthesisVoice | null {
  const voices = allVoices();
  if (!voices.length) return null;

  const chinese = voices.filter(
    (voice) => norm(voice.lang).startsWith("zh") || norm(voice.lang).startsWith("yue"),
  );
  if (!chinese.length) return null;

  // ① 嚴格粵語：lang 是 yue-*，或名稱帶「善怡 / Sinji / 粵語 / Cantonese」
  const strictCantonese = chinese.filter(
    (voice) =>
      CANTONESE_LANGS.some((prefix) => norm(voice.lang).startsWith(prefix)) ||
      CANTONESE_NAMES.some((name) => norm(voice.name).includes(name)),
  );
  if (strictCantonese.length) return bestOf(strictCantonese, CANTONESE_NAMES);

  // ② 香港中文 zh-HK（多數裝置即粵語）
  const hongKong = chinese.filter((voice) =>
    HONGKONG_LANGS.some((prefix) => norm(voice.lang).startsWith(prefix)),
  );
  if (hongKong.length) return bestOf(hongKong, CANTONESE_NAMES);

  // ③ 繁體中文備援
  const han = chinese.filter((voice) =>
    ["zh-tw", "zh-hant"].some((prefix) => norm(voice.lang).startsWith(prefix)),
  );
  const hanPool = han.length ? han : chinese.filter((voice) => HAN_LANGS.some((p) => norm(voice.lang).startsWith(p)));
  if (hanPool.length) return bestOf(hanPool, HAN_NAMES);

  // ④ 其他中文（例如只有 zh-CN）
  const rest = chinese.length ? chinese : voices;
  return rest.length ? bestOf(rest, HAN_NAMES) : null;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = allVoices();
  if (!voices.length) return null;
  const pool = voices.filter((voice) => norm(voice.lang).startsWith("en"));
  if (!pool.length) return null;
  return bestOf(pool, EN_NAMES);
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (voiceCache[lang] !== undefined) return voiceCache[lang] ?? null;

  const voices = allVoices();
  if (!voices.length) return null; // 清單還沒載入（iOS 常見），不快取，下次再試

  const picked = lang === "zh" ? pickChineseVoice() : pickEnglishVoice();
  voiceCache[lang] = picked;
  return picked;
}

/** 瀏覽器是否支援發音（不支援時呼叫方要隱藏喇叭按鈕）。 */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** 監聽語音清單載入（Safari / iOS 是非同步的），載入後清掉快取重挑。 */
export function onVoicesReady(callback: (ready: boolean) => void): () => void {
  if (!canSpeak()) return () => {};
  const check = () => {
    const ready = allVoices().length > 0;
    if (ready) {
      voiceCache.zh = undefined;
      voiceCache.en = undefined;
    }
    callback(ready);
  };
  check();
  window.speechSynthesis.addEventListener?.("voiceschanged", check);
  return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
}

/** iOS：cancel() 之後要讓主執行緒轉一圈再 speak，否則會無聲。 */
function needsDelay(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iP(hone|ad|od)/i.test(ua) || (/Macintosh/i.test(ua) && (navigator.maxTouchPoints ?? 0) > 1);
}

/** 朗讀一小段文字。英文 rate 0.8、中文 0.85，讓小朋友聽得清楚。 */
export function speak(text: string, lang: Lang = "en", rate?: number): void {
  if (!canSpeak()) return;
  const clean = (lang === "en" ? text.replace(/\|[^\s]*/g, "") : text).trim();
  if (!clean) return;

  const run = () => {
    const voice = pickVoice(lang);
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* 忽略 */
    }
    const utterance = new SpeechSynthesisUtterance(clean);
    // lang 跟著語音走，避免系統因為 lang 與 voice 不一致而偷偷換成別的聲音。
    utterance.lang = voice?.lang ?? (lang === "zh" ? "yue-HK" : "en-US");
    utterance.rate = rate ?? (lang === "zh" ? 0.85 : 0.8);
    utterance.pitch = 1.15;
    if (voice) utterance.voice = voice;
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      /* 忽略：某些瀏覽器在語音還沒就緒時會丟錯 */
    }
  };

  // 語音清單還沒載入（iOS第一次）：等它準備好再唸，不要用錯的語音。
  if (!allVoices().length && lang === "zh") {
    let done = false;
    const once = () => {
      if (done) return;
      done = true;
      run();
    };
    window.speechSynthesis.addEventListener?.("voiceschanged", once, { once: true });
    window.setTimeout(() => {
      if (!done) {
        done = true;
        run();
      }
    }, 400);
    return;
  }

  if (needsDelay()) window.setTimeout(run, 60);
  else run();
}

/** 停止朗讀。 */
export function stopSpeaking(): void {
  if (canSpeak()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* 忽略 */
    }
  }
}

/**
 * 目前實際會用到的中文語音資訊，給介面判斷「這台裝置有沒有廣東話」。
 * 沒有粵語時可以提示家長去系統下載語音包，而不是默默變成國語。
 */
export function getChineseVoiceInfo(): { name: string; lang: string; cantonese: boolean } | null {
  const voice = pickVoice("zh");
  if (!voice) return null;
  const lang = norm(voice.lang);
  const name = norm(voice.name);
  const cantonese =
    CANTONESE_LANGS.some((prefix) => lang.startsWith(prefix)) ||
    CANTONESE_NAMES.some((key) => name.includes(key)) ||
    HONGKONG_LANGS.some((prefix) => lang.startsWith(prefix));
  return { name: voice.name, lang: voice.lang, cantonese };
}

/** 判斷這個字要不要朗讀（標點符號就跳過）。 */
export function isSpeakableChar(char: string): boolean {
  return !SKIP.test(char);
}
