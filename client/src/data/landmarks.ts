/**
 * 名勝探險：中國和香港小朋友值得認識的著名景點與博物館。
 * 圖鑑模式：點卡片看雙語詳情；小測驗模式：看 emoji 提示猜名稱。
 * 英文句子用 `word|翻譯` 標註，必須「一個英文單字」對一個翻譯。
 */
export type Landmark = {
  zh: string;
  en: string;
  icon: string;
  region: "china" | "hongkong";
  /** 繁中簡介兩句 */
  introZh: string;
  /** 英文簡介（word|翻譯 標註） */
  introEn: string;
};

export const LANDMARKS: Landmark[] = [
  {
    zh: "萬里長城",
    en: "The Great Wall",
    icon: "🏯",
    region: "china",
    introZh: "萬里長城好長好長，從山上一直爬到天邊。古時候的人用它保護家園。",
    introEn: "The wall|長城 is very long|長的. It sits on the mountains|山 like a dragon|龍.",
  },
  {
    zh: "北京故宮",
    en: "The Forbidden City",
    icon: "🏛️",
    region: "china",
    introZh: "北京故宮有九千多間金黃屋頂的房子，以前的皇帝就住在這裡。",
    introEn: "The palace|宮殿 has golden|金色的 roofs|屋頂. The emperor|皇帝 lived here.",
  },
  {
    zh: "天壇",
    en: "The Temple of Heaven",
    icon: "⛩️",
    region: "china",
    introZh: "天壇的圓形藍瓦好漂亮，皇帝以前在這裡祈求風調雨順。",
    introEn: "The temple|廟宇 has a round|圓形的 blue|藍色 roof|屋頂. It looks like the sky|天空.",
  },
  {
    zh: "兵馬俑",
    en: "The Terracotta Army",
    icon: "🪖",
    region: "china",
    introZh: "兵馬俑是幾千個泥土士兵，排得整整齊齊，守護著皇帝。",
    introEn: "The army|軍隊 is made of thousands|幾千 clay|泥土 soldiers|士兵.",
  },
  {
    zh: "東方明珠",
    en: "The Oriental Pearl Tower",
    icon: "🗼",
    region: "china",
    introZh: "東方明珠塔在上海，圓圓的球一顆接一顆，晚上會發亮。",
    introEn: "The tower|塔 is in Shanghai|上海. Its pink|粉紅色 balls|球 shine at night|晚上.",
  },
  {
    zh: "太平山頂",
    en: "Victoria Peak",
    icon: "🚋",
    region: "hongkong",
    introZh: "坐山頂纜車慢慢爬上山，可以看到整個香港漂亮的海景。",
    introEn: "The tram|纜車 climbs up high|高高地. We see the whole city|城市 from the top|山頂.",
  },
  {
    zh: "維多利亞港",
    en: "Victoria Harbour",
    icon: "⛵",
    region: "hongkong",
    introZh: "維多利亞港的海水藍藍的，船隻來來往往，晚上還有燈光匯演。",
    introEn: "The harbour|海港 has blue|藍色的 water|海水. At night|晚上, the lights|燈光 dance|舞動.",
  },
  {
    zh: "天星小輪",
    en: "Star Ferry",
    icon: "⛴️",
    region: "hongkong",
    introZh: "天星小輪是很有名的綠白色小船，坐它過海好開心。",
    introEn: "The ferry|渡輪 is a green|綠色 and white|白色 boat|船. It crosses the sea|海.",
  },
  {
    zh: "天壇大佛",
    en: "The Big Buddha",
    icon: "🛕",
    region: "hongkong",
    introZh: "天壇大佛好高好高，要爬好多級階梯，在昂坪的山上靜靜坐著。",
    introEn: "The Buddha|大佛 sits high on a mountain|山 on Lantau|大嶼山 Island|島.",
  },
  {
    zh: "香港迪士尼樂園",
    en: "Hong Kong Disneyland",
    icon: "🏰",
    region: "hongkong",
    introZh: "迪士尼樂園有城堡、花車巡遊和米奇老鼠，是歡樂的王國。",
    introEn: "Disneyland|迪士尼 has a castle|城堡 and Mickey|米奇 Mouse|老鼠. It is a happy kingdom|王國.",
  },
  {
    zh: "海洋公園",
    en: "Ocean Park",
    icon: "🐼",
    region: "hongkong",
    introZh: "海洋公園可以看熊貓和企鵝，還有好刺激的過山車。",
    introEn: "The park|公園 has pandas|熊貓 and penguins|企鵝 and exciting|刺激的 rides|機動遊戲.",
  },
  {
    zh: "香港科學館",
    en: "Hong Kong Science Museum",
    icon: "🔬",
    region: "hongkong",
    introZh: "科學館裡好多可以動手玩的展品，還有一部好大的能量穿梭機。",
    introEn: "The museum|博物館 has hands-on|動手做的 exhibits|展品 and a big|大的 energy|能量 machine|機器.",
  },
];
