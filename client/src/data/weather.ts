/**
 * 天氣小站長：香港天文台常見的天氣符號與警告信號。
 * 每題顯示符號大卡，三選一；答對朗讀一句說明。
 * type: weather = 天氣符號；warning = 警告信號。
 * 英文句子用 `word|翻譯` 標註，必須「一個英文單字」對一個翻譯。
 */
export type WeatherItem = {
  zh: string;
  en: string;
  icon: string;
  type: "weather" | "warning";
  /** 答對時朗讀的繁中說明（一句） */
  factZh: string;
  /** 英文一句（word|翻譯 標註） */
  factEn: string;
};

export const WEATHER_ITEMS: WeatherItem[] = [
  {
    zh: "天晴",
    en: "Sunny",
    icon: "☀️",
    type: "weather",
    factZh: "大太陽出來了，記得戴帽子和喝水。",
    factEn: "The sun|太陽 is bright|明亮的. Wear|戴 a hat|帽子 and drink water|水.",
  },
  {
    zh: "多雲",
    en: "Cloudy",
    icon: "⛅",
    type: "weather",
    factZh: "雲朵把太陽遮住了，天氣涼涼的很舒服。",
    factEn: "Clouds|雲 cover the sun. The weather|天氣 feels cool|涼爽的.",
  },
  {
    zh: "落雨",
    en: "Rainy",
    icon: "🌧️",
    type: "weather",
    factZh: "下雨天要帶雨傘或穿雨衣，小心地板濕滑。",
    factEn: "Take an umbrella|雨傘 when it rains|下雨. The floor|地板 is wet|濕的.",
  },
  {
    zh: "雷暴",
    en: "Thunderstorm",
    icon: "⛈️",
    type: "weather",
    factZh: "閃電打雷時，要留在室內，不要走到空曠的地方。",
    factEn: "During thunder|打雷, stay inside|室內. Do not go outside|外面.",
  },
  {
    zh: "大霧",
    en: "Foggy",
    icon: "🌫️",
    type: "weather",
    factZh: "霧把東西都藏起來了，行車要慢慢開。",
    factEn: "Fog|霧 hides everything|一切. Cars drive slowly|慢慢地.",
  },
  {
    zh: "彩虹",
    en: "Rainbow",
    icon: "🌈",
    type: "weather",
    factZh: "雨後出現七色彩虹，紅橙黃綠藍靛紫！",
    factEn: "A rainbow|彩虹 has seven|七 colors|顏色 after the rain|雨後.",
  },
  {
    zh: "三號強風信號",
    en: "Strong Wind Signal 3",
    icon: "💨",
    type: "warning",
    factZh: "三號風球表示風好大，出行要小心，留在家裡最安全。",
    factEn: "Signal|信號 3|三 means strong|強勁的 wind|風. Stay safe|安全的.",
  },
  {
    zh: "八號烈風或暴風信號",
    en: "Gale Signal 8",
    icon: "🌀",
    type: "warning",
    factZh: "八號風球時學校和商店都會關門，我們要留在家裡。",
    factEn: "Signal|信號 8|八 means a big typhoon|颱風 is coming. Stay home|在家裡.",
  },
  {
    zh: "十號颶風信號",
    en: "Hurricane Signal 10",
    icon: "🌪️",
    type: "warning",
    factZh: "十號風球是最厲害的，風好大好大，千萬不要出門。",
    factEn: "Signal|信號 10|十 is the strongest|最強的. Do not go out|出門.",
  },
  {
    zh: "黃色暴雨警告",
    en: "Amber Rainstorm Warning",
    icon: "🟡",
    type: "warning",
    factZh: "黃雨表示大雨來了，記得帶傘，注意路上的水。",
    factEn: "Amber|黃色 rain|雨 means heavy|大的 rain|雨. Bring an umbrella|雨傘.",
  },
  {
    zh: "紅色暴雨警告",
    en: "Red Rainstorm Warning",
    icon: "🔴",
    type: "warning",
    factZh: "紅雨時雨好大好大，要留在安全的地方。",
    factEn: "Red|紅色 rain|雨 means very heavy|非常大 rain|雨. Stay in a safe|安全的 place|地方.",
  },
  {
    zh: "黑色暴雨警告",
    en: "Black Rainstorm Warning",
    icon: "⚫",
    type: "warning",
    factZh: "黑雨是最嚴重的暴雨，千萬不要外出。",
    factEn: "Black|黑色 rain|雨 is the heaviest|最大的 rain|雨. Do not go outside|外面.",
  },
];
