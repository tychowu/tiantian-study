/**
 * 天氣小站長：香港天文台的天氣符號與警告信號（官方圖片版）。
 * 圖片來源：香港天文台（www.hko.gov.hk）官方圖示，
 * 天氣符號 = images/HKOWxIconOutline/picNN.png，警告信號 = wxinfo/dailywx/images/*.gif。
 * type: weather = 天氣符號；warning = 警告信號。
 * 英文句子用 `word|翻譯` 標註，必須「一個英文單字」對一個翻譯。
 */
export type WeatherItem = {
  zh: string;
  en: string;
  /** 天文台官方圖片 */
  img: string;
  /** weather 符號放深藍底上（白描邊圖示）；warning 直接顯示 */
  type: "weather" | "warning";
  /** 繁中說明（一句） */
  factZh: string;
  /** 英文一句（word|翻譯 標註） */
  factEn: string;
};

export const WEATHER_ITEMS: WeatherItem[] = [
  // ============ 天氣符號（天文台預報圖示） ============
  {
    zh: "天晴",
    en: "Sunny",
    img: "/images/weather/pic50.png",
    type: "weather",
    factZh: "大太陽出來了，記得戴帽子和喝水。",
    factEn: "The sun|太陽 is bright|明亮的. Wear|戴 a hat|帽子 and drink water|水.",
  },
  {
    zh: "大致天晴",
    en: "Mostly Sunny",
    img: "/images/weather/pic51.png",
    type: "weather",
    factZh: "大部分時間有太陽，只有幾朵雲。",
    factEn: "The sun|太陽 is out|出來 with a few|幾朵 clouds|雲.",
  },
  {
    zh: "部分時間有陽光",
    en: "Sunny Periods",
    img: "/images/weather/pic52.png",
    type: "weather",
    factZh: "太陽和雲輪流玩捉迷藏。",
    factEn: "The sun|太陽 and clouds|雲 take turns|輪流 in the sky|天空.",
  },
  {
    zh: "驟雨",
    en: "Showers",
    img: "/images/weather/pic54.png",
    type: "weather",
    factZh: "一陣一陣的雨，出門記得帶傘。",
    factEn: "It rains|下雨 on and off|一陣一陣. Take|帶 an umbrella|雨傘.",
  },
  {
    zh: "多雲",
    en: "Cloudy",
    img: "/images/weather/pic60.png",
    type: "weather",
    factZh: "雲朵把太陽遮住了，天色灰灰的。",
    factEn: "Clouds|雲 cover|遮住 the sun|太陽 in the sky|天空.",
  },
  {
    zh: "密雲",
    en: "Overcast",
    img: "/images/weather/pic61.png",
    type: "weather",
    factZh: "好多好多雲，把整個天空都蓋住了。",
    factEn: "Many|很多 clouds|雲 fill|蓋住 the whole|整個 sky|天空.",
  },
  {
    zh: "雨",
    en: "Rain",
    img: "/images/weather/pic63.png",
    type: "weather",
    factZh: "下雨天路濕滑，慢慢走不要跑。",
    factEn: "It is raining|下雨. Walk|走 slowly|慢慢地 on wet|濕滑 roads|路.",
  },
  {
    zh: "大雨",
    en: "Heavy Rain",
    img: "/images/weather/pic64.png",
    type: "weather",
    factZh: "雨下得很大，留在室內最安全。",
    factEn: "The rain|雨 is heavy|很大. Stay|留在 indoors|室內.",
  },
  {
    zh: "雷暴",
    en: "Thunderstorms",
    img: "/images/weather/pic65.png",
    type: "weather",
    factZh: "又打雷又閃電，不要站在空曠的地方。",
    factEn: "Thunder|雷 and lightning|閃電! Stay|留在 away from|遠離 open|空曠 places|地方.",
  },
  {
    zh: "大風",
    en: "Windy",
    img: "/images/weather/pic80.png",
    type: "weather",
    factZh: "風好大，帽子可能會被吹走喔。",
    factEn: "The wind|風 blows|吹 very hard|很大 today|今天.",
  },
  {
    zh: "霧",
    en: "Fog",
    img: "/images/weather/pic83.png",
    type: "weather",
    factZh: "白茫茫的霧，看不清楚遠方，要小心。",
    factEn: "Fog|霧 makes|使 it hard|難 to see|看 the way|路.",
  },
  {
    zh: "寒冷",
    en: "Cold",
    img: "/images/weather/pic93.png",
    type: "weather",
    factZh: "天氣很冷，穿上暖暖的外套。",
    factEn: "It is cold|寒冷. Wear|穿 a warm|暖暖的 coat|外套.",
  },
  // ============ 警告信號（天文台官方） ============
  {
    zh: "一號戒備信號",
    en: "Standby Signal No.1",
    img: "/images/weather/tc1.gif",
    type: "warning",
    factZh: "有颱風靠近香港，記得留意天氣消息。",
    factEn: "A typhoon|颱風 is near|靠近 Hong Kong|香港. Be careful|小心.",
  },
  {
    zh: "三號強風信號",
    en: "Strong Wind Signal No.3",
    img: "/images/weather/tc3.gif",
    type: "warning",
    factZh: "風力增強了，把花盆和玩具收進屋內。",
    factEn: "Strong|強 winds|風! Bring|收進 loose|鬆的 things|東西 inside|屋內.",
  },
  {
    zh: "八號東北烈風或暴風信號",
    en: "No.8 NE Gale or Storm Signal",
    img: "/images/weather/tc8ne.gif",
    type: "warning",
    factZh: "八號風球！不用上學，留在家中安全的地方。",
    factEn: "Signal|信號 No.|八號 8! Stay|留 home|在家 and keep|保持 safe|安全.",
  },
  {
    zh: "八號東南烈風或暴風信號",
    en: "No.8 SE Gale or Storm Signal",
    img: "/images/weather/tc8se.gif",
    type: "warning",
    factZh: "八號風球（東南），風從東南邊吹來。",
    factEn: "Signal|信號 No.|八號 8 with gales|烈風 from|從 the southeast|東南.",
  },
  {
    zh: "八號西南烈風或暴風信號",
    en: "No.8 SW Gale or Storm Signal",
    img: "/images/weather/tc8sw.gif",
    type: "warning",
    factZh: "八號風球（西南），風從西南邊吹來。",
    factEn: "Signal|信號 No.|八號 8 with gales|烈風 from|從 the southwest|西南.",
  },
  {
    zh: "八號西北烈風或暴風信號",
    en: "No.8 NW Gale or Storm Signal",
    img: "/images/weather/tc8nw.gif",
    type: "warning",
    factZh: "八號風球（西北），風從西北邊吹來。",
    factEn: "Signal|信號 No.|八號 8 with gales|烈風 from|從 the northwest|西北.",
  },
  {
    zh: "九號烈風或暴風風力增強信號",
    en: "Increasing Gale or Storm Signal No.9",
    img: "/images/weather/tc9.gif",
    type: "warning",
    factZh: "九號風球，風越來越猛，快躲到安全的房間。",
    factEn: "Signal|信號 No.|九號 9! The wind|風 is getting|越來越 stronger|更強.",
  },
  {
    zh: "十號颶風信號",
    en: "Hurricane Signal No.10",
    img: "/images/weather/tc10.gif",
    type: "warning",
    factZh: "十號風球是最強的風球，千萬不要出門。",
    factEn: "Signal|信號 No.|十號 10 is the strongest|最強 wind|風 signal|信號. Stay|留在 inside|室內.",
  },
  {
    zh: "黃色暴雨警告信號",
    en: "Amber Rainstorm Warning",
    img: "/images/weather/raina.gif",
    type: "warning",
    factZh: "大雨快來了，黃色代表要小心留意。",
    factEn: "Amber|黃色 means|表示 heavy|大雨 rain|雨 may|可能 come|來 soon|很快.",
  },
  {
    zh: "紅色暴雨警告信號",
    en: "Red Rainstorm Warning",
    img: "/images/weather/rainr.gif",
    type: "warning",
    factZh: "紅色暴雨，雨好大，不要外出。",
    factEn: "Red|紅色 rainstorm|暴雨 warning|警告! Do not|不要 go out|外出.",
  },
  {
    zh: "黑色暴雨警告信號",
    en: "Black Rainstorm Warning",
    img: "/images/weather/rainb.gif",
    type: "warning",
    factZh: "黑色暴雨是最強的暴雨警告，留在室內最安全。",
    factEn: "Black|黑色 is the strongest|最強 rainstorm|暴雨 warning|警告. Stay|留在 indoors|室內.",
  },
  {
    zh: "雷暴警告",
    en: "Thunderstorm Warning",
    img: "/images/weather/ts.gif",
    type: "warning",
    factZh: "打雷了！不要在空曠地方或樹下停留。",
    factEn: "Thunder|雷! Keep|遠離 away from|遠離 trees|樹 and open|空曠 areas|地方.",
  },
  {
    zh: "新界北部水浸特別報告",
    en: "Special Announcement on Flooding in NT North",
    img: "/images/weather/ntfl.gif",
    type: "warning",
    factZh: "新界北部可能會淹水，遠離低窪地方。",
    factEn: "Water|水 may|可能 flood|淹 in the north|北部. Stay|遠離 away from|離開 low|低窪 places|地方.",
  },
  {
    zh: "山泥傾瀉警告",
    en: "Landslip Warning",
    img: "/images/weather/landslip.gif",
    type: "warning",
    factZh: "大雨後山坡可能滑落，不要靠近斜坡。",
    factEn: "Stay|遠離 away from|離開 slopes|斜坡 because|因為 of landslides|山泥傾瀉.",
  },
  {
    zh: "強烈季候風信號",
    en: "Strong Monsoon Signal",
    img: "/images/weather/msn.gif",
    type: "warning",
    factZh: "季候風帶來強風，小心招牌和固定好物品。",
    factEn: "Strong|強 monsoon|季候風 winds|風 blow|吹 in Hong Kong|香港. Be careful|小心.",
  },
  {
    zh: "霜凍警告",
    en: "Frost Warning",
    img: "/images/weather/frost.gif",
    type: "warning",
    factZh: "高山上的草地可能結霜，好冷喔。",
    factEn: "Frost|霜 may|可能 form|結 on grass|草地 in cold|寒冷 weather|天氣.",
  },
  {
    zh: "黃色火災危險警告",
    en: "Yellow Fire Danger Warning",
    img: "/images/weather/firey.gif",
    type: "warning",
    factZh: "天氣乾燥，火警危險提高了，小心火燭。",
    factEn: "The air|空氣 is dry|乾燥. Be|要 careful|小心 with fire|火.",
  },
  {
    zh: "紅色火災危險警告",
    en: "Red Fire Danger Warning",
    img: "/images/weather/firer.gif",
    type: "warning",
    factZh: "非常乾燥，最容易起火，千萬不可以玩火。",
    factEn: "Fire|火 danger|危險 is very|非常 high|高. Never|千萬不要 play|玩 with fire|火.",
  },
  {
    zh: "寒冷天氣警告",
    en: "Cold Weather Warning",
    img: "/images/weather/cold.gif",
    type: "warning",
    factZh: "天氣變得很冷，穿多一件衣服保暖。",
    factEn: "It is cold|寒冷. Wear|穿 more|更多 warm|保暖 clothes|衣服.",
  },
  {
    zh: "酷熱天氣警告",
    en: "Very Hot Weather Warning",
    img: "/images/weather/vhot.gif",
    type: "warning",
    factZh: "天氣好熱好熱，多喝水，避免長時間在戶外。",
    factEn: "It is very|非常 hot|熱. Drink|喝 lots|多 of water|水 and rest|休息.",
  },
  {
    zh: "海嘯警告",
    en: "Tsunami Warning",
    img: "/images/weather/tsunami-warn.gif",
    type: "warning",
    factZh: "海嘯可能來到，快離開海邊往高處跑。",
    factEn: "A tsunami|海嘯 may|可能 come|來. Leave|離開 the beach|海灘 quickly|快點.",
  },
];
