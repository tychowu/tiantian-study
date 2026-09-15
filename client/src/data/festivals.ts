/**
 * 節日派對：中西方小朋友熟悉的八個節日。
 * 翻牌配對用；配對成功後朗讀名稱並顯示一句小知識。
 * 注意：英文句子用 `word|翻譯` 標註，必須「一個英文單字」對一個翻譯
 * （BilingualText 以空白切詞），不可寫成多字詞組標註。
 */
export type Festival = {
  zh: string;
  en: string;
  icon: string;
  /** 配對成功時朗讀的小知識（一句話，繁中） */
  factZh: string;
  /** 圖鑑卡上的英文一句（word|翻譯 標註，可點看詞義） */
  factEn: string;
};

export const FESTIVALS: Festival[] = [
  {
    zh: "農曆新年",
    en: "Chinese New Year",
    icon: "🧧",
    factZh: "新年會派紅包、舞獅，還可以吃好多糖果。",
    factEn: "We get red|紅色 packets|紅包 and watch lion|獅子 dances|舞獅.",
  },
  {
    zh: "中秋節",
    en: "Mid-Autumn Festival",
    icon: "🥮",
    factZh: "中秋節吃月餅，還提燈籠去看又圓又亮的月亮。",
    factEn: "We eat mooncakes|月餅 and light lanterns|燈籠 at night|晚上.",
  },
  {
    zh: "端午節",
    en: "Dragon Boat Festival",
    icon: "🐉",
    factZh: "端午節吃粽子，還會看龍舟比賽，好熱鬧！",
    factEn: "We eat rice|糯米 dumplings|粽子 and watch dragon|龍 boats|船.",
  },
  {
    zh: "元宵節",
    en: "Lantern Festival",
    icon: "🏮",
    factZh: "元宵節到處掛滿紅紅的燈籠，還可以猜燈謎。",
    factEn: "Red|紅色 lanterns|燈籠 glow|發光 everywhere|到處 and we guess riddles|燈謎.",
  },
  {
    zh: "聖誕節",
    en: "Christmas",
    icon: "🎄",
    factZh: "聖誕節有聖誕樹和禮物，還會唱聖誕歌。",
    factEn: "We decorate a Christmas|聖誕節 tree|樹 and open presents|禮物.",
  },
  {
    zh: "萬聖節",
    en: "Halloween",
    icon: "🎃",
    factZh: "萬聖節打扮成小超人或小公主，去要糖果。",
    factEn: "We wear|穿 costumes|戲服 and ask for candy|糖果.",
  },
  {
    zh: "復活節",
    en: "Easter",
    icon: "🥚",
    factZh: "復活節把雞蛋塗得五彩繽紛，再一起去尋蛋。",
    factEn: "We paint|塗上 colorful|繽紛的 eggs|蛋 and hunt|尋找 for them.",
  },
  {
    zh: "生日會",
    en: "Birthday Party",
    icon: "🎂",
    factZh: "生日會吹蠟燭、切蛋糕，大家唱生日歌。",
    factEn: "We blow out candles|蠟燭 and sing|唱 a birthday|生日 song|歌.",
  },
];
