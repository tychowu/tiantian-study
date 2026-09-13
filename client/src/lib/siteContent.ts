/**
 * 天天的奇想書桌：網站內容與視覺資源總表。
 * 新增課程、替換圖片或調整品牌文案時，優先從這裡維護。
 */

export const SITE_ASSETS = {
  logo: "/images/tiantian-pencil-rocket-logo_94715784.webp",
  hero: "/images/tiantian-hero-desk_71c399ad.webp",
  portrait: "/images/tiantian-portrait_29b4d9d2.png",
  successStars: "/images/tiantian-success-stars_5462d800.webp",
  wordPlanet: "/images/tiantian-word-planet_fcacffbd.webp",
} as const;

export const SITE_COPY = {
  brand: { name: "天天", descriptor: "的學習平台", ariaLabel: "回到天天的學習平台首頁" },
  hero: {
    eyebrow: "今天的語言任務",
    title: ["把詞語送上", "會說話的軌道。"],
    description: "中英文題目混合練習，挑一張詞語卡，排出你心裡完整又漂亮的句子。",
  },
  lesson: {
    title: "句子星球",
    station: "第一站",
    progressLabel: "探索星圖",
    progressNote: "完成一題，點亮一顆小星星。",
    overviewLabel: "今天的學習路線",
  },
} as const;

export const COURSE_MODULES = [
  { order: "01", title: "句子星球", note: "中英混合造句", kind: "active" as const },
  { order: "02", title: "故事星球", note: "下一段星際旅程", kind: "locked" as const },
  { order: "03", title: "數字星球", note: "下一段星際旅程", kind: "locked" as const },
] as const;

export const LESSON_OVERVIEW = [
  { value: "50", label: "道混合題目", note: "繁中 × English", tone: "orange" },
  { value: "01", label: "目前學習星球", note: "從句子開始", tone: "green" },
  { value: "∞", label: "持續增加內容", note: "故事、數字與更多", tone: "yellow" },
] as const;
