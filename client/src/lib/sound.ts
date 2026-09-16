/**
 * 小測驗音效：答對「叮咚」、答錯「嗯喔」。
 * 用瀏覽器內建的 Web Audio API 現場合成，不需要任何音訊檔案，離線也能播。
 * 家長可以在舞台右上角把音效關掉，設定會記在本機（localStorage）。
 */

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

const STORAGE_KEY = "tt-quiz-sound"; // "off" 表示靜音

let ctx: AudioContext | null = null;
let muted = false;

if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    muted = false;
  }
}

/** 目前是否播放音效。 */
export function isSoundOn(): boolean {
  return !muted;
}

/** 開關音效（關掉後答對答錯都不出聲）。 */
export function setSoundOn(on: boolean): void {
  muted = !on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* 隱私模式下寫不進去也沒關係 */
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  // iOS / Safari 會把音訊鎖住，使用者點過畫面後要手動恢復。
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** 播一個音符：freq 頻率、at 起點秒數、dur 長度、type 波形、vol 音量。 */
function note(
  audio: AudioContext,
  freq: number,
  at: number,
  dur: number,
  type: OscillatorType,
  vol: number,
): void {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + at);

  gain.gain.setValueAtTime(0.0001, audio.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol, audio.currentTime + at + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + at + dur);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime + at);
  osc.stop(audio.currentTime + at + dur + 0.02);
}

/** 答對：三個音往上跑的小叮咚（C5 → E5 → G5）。 */
export function playCorrect(): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;
  note(audio, 523.25, 0, 0.16, "sine", 0.22);
  note(audio, 659.25, 0.1, 0.16, "sine", 0.22);
  note(audio, 783.99, 0.2, 0.26, "sine", 0.24);
  note(audio, 1046.5, 0.3, 0.3, "triangle", 0.1);
}

/** 答錯：兩個音往下掉的柔和「嗯喔」，不刺耳。 */
export function playWrong(): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;
  note(audio, 392, 0, 0.15, "triangle", 0.18);
  note(audio, 311.13, 0.13, 0.24, "triangle", 0.18);
}

/** 連對 / 過關時的小慶祝（五個音往上）。 */
export function playCheer(): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;
  [523.25, 587.33, 659.25, 783.99, 1046.5].forEach((freq, index) => {
    note(audio, freq, index * 0.09, 0.22, "sine", 0.2);
  });
}
