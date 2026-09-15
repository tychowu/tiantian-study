/**
 * 名勝探險：中國內地和香港小朋友值得認識的著名景點與博物館。
 * 每個名勝配一張真實的標誌性照片（client/public/images/landmarks/，
 * 攝影圖片來自維基百科／維基共享資源）。
 * 圖鑑模式：點卡片看雙語詳情；小測驗模式：讀一句英文提示猜名稱（無圖）。
 * 英文句子用 `word|翻譯` 標註，必須「一個英文單字」對一個翻譯。
 */
export type Landmark = {
  zh: string;
  en: string;
  /** 真實照片路徑 */
  photo: string;
  region: "mainland" | "hongkong";
  /** 繁中簡介兩句 */
  introZh: string;
  /** 英文簡介（word|翻譯 標註） */
  introEn: string;
  /** 小測驗用：一句英文提示（無圖，word|翻譯 標註） */
  clueEn: string;
};

export const LANDMARKS: Landmark[] = [
  {
    zh: "萬里長城",
    en: "The Great Wall",
    photo: "/images/landmarks/greatwall.jpg",
    region: "mainland",
    introZh: "萬里長城好長好長，從山上一直爬到天邊。古時候的人用它保護家園。",
    introEn: "The wall|長城 is very long|長的. It sits on the mountains|山 like a dragon|龍.",
    clueEn: "It is a very very long wall on the green mountains. People built|建造 it long ago to keep|保護 the country|國家 safe|安全.",
  },
  {
    zh: "北京故宮",
    en: "The Forbidden City",
    photo: "/images/landmarks/forbiddencity.jpg",
    region: "mainland",
    introZh: "北京故宮有九千多間金黃屋頂的房子，以前的皇帝就住在這裡。",
    introEn: "The palace|宮殿 has golden|金色的 roofs|屋頂. The emperor|皇帝 lived here.",
    clueEn: "It is a big old palace in Beijing. The emperor|皇帝 of China|中國 lived there, and the roofs|屋頂 are golden|金色的.",
  },
  {
    zh: "天壇",
    en: "The Temple of Heaven",
    photo: "/images/landmarks/templeofheaven.jpg",
    region: "mainland",
    introZh: "天壇的圓形藍瓦好漂亮，皇帝以前在這裡祈求風調雨順。",
    introEn: "The temple|廟宇 has a round|圓形的 blue|藍色 roof|屋頂. It looks like the sky|天空.",
    clueEn: "It is a temple|廟宇 with a round|圓形 blue|藍色 roof|屋頂 in Beijing. The emperor|皇帝 prayed|祈禱 there for good|好的 weather|天氣.",
  },
  {
    zh: "兵馬俑",
    en: "The Terracotta Army",
    photo: "/images/landmarks/terracotta.jpg",
    region: "mainland",
    introZh: "兵馬俑是幾千個泥土士兵，排得整整齊齊，守護著皇帝。",
    introEn: "The army|軍隊 is made of thousands|幾千 clay|泥土 soldiers|士兵.",
    clueEn: "Thousands|幾千 of clay|泥土 soldiers|士兵 stand|站 in rows|排隊 in Xi'an. They were made|製造 long, long ago.",
  },
  {
    zh: "東方明珠",
    en: "The Oriental Pearl Tower",
    photo: "/images/landmarks/orientalpearl.jpg",
    region: "mainland",
    introZh: "東方明珠塔在上海，圓圓的球一顆接一顆，晚上會發亮。",
    introEn: "The tower|塔 is in Shanghai|上海. Its pink|粉紅色 balls|球 shine at night|晚上.",
    clueEn: "It is a tall|高的 tower|塔 in Shanghai|上海 with round|圓形 pink|粉紅 balls|圓球 on it.",
  },
  {
    zh: "頤和園",
    en: "The Summer Palace",
    photo: "/images/landmarks/summerpalace.jpg",
    region: "mainland",
    introZh: "頤和園在北京，有山、有大湖和長長的走廊，皇帝夏天在這裡避暑。",
    introEn: "It has a lake|湖 and a long|長的 corridor|走廊. The emperor|皇帝 stayed there in summer|夏天.",
    clueEn: "It is a beautiful|美麗 royal|皇家 garden|花園 in Beijing with a big lake|湖 and boats|小船.",
  },
  {
    zh: "桂林山水",
    en: "Guilin Scenery",
    photo: "/images/landmarks/guilin.jpg",
    region: "mainland",
    introZh: "桂林的山一座座像筆架，灕江的水清清的，竹筏慢慢漂。",
    introEn: "The hills|小山 look like brushes|毛筆. The river|江 water|水 is clear|清澈.",
    clueEn: "Green|綠 hills|山 stand by a clear|清澈 river|江 in Guilin|桂林. People ride bamboo|竹 rafts|竹筏 on the water|水.",
  },
  {
    zh: "太平山頂",
    en: "Victoria Peak",
    photo: "/images/landmarks/victoriapeak.jpg",
    region: "hongkong",
    introZh: "坐山頂纜車慢慢爬上山，可以看到整個香港漂亮的海景。",
    introEn: "The tram|纜車 climbs up high|高高地. We see the whole city|城市 from the top|山頂.",
    clueEn: "It is the highest|最高的 hill|山 in Hong Kong|香港. A little tram|纜車 climbs|爬 up to the top|山頂.",
  },
  {
    zh: "維多利亞港",
    en: "Victoria Harbour",
    photo: "/images/landmarks/victoriaharbour.jpg",
    region: "hongkong",
    introZh: "維多利亞港的海水藍藍的，船隻來來往往，晚上還有燈光匯演。",
    introEn: "The harbour|海港 has blue|藍色的 water|海水. At night|晚上, the lights|燈光 dance|舞動.",
    clueEn: "It is the big|大的 blue|藍色 harbour|海港 between|之間 Hong Kong Island|香港島 and Kowloon|九龍. Many ships|船 sail|航行 there.",
  },
  {
    zh: "天星小輪",
    en: "Star Ferry",
    photo: "/images/landmarks/starferry.jpg",
    region: "hongkong",
    introZh: "天星小輪是很有名的綠白色小船，坐它過海好開心。",
    introEn: "The ferry|渡輪 is a green|綠色 and white|白色 boat|船. It crosses the sea|海.",
    clueEn: "It is a green|綠 and white|白 ferry|渡輪 that carries|載 people across|過 the harbour|海港 in Hong Kong|香港.",
  },
  {
    zh: "天壇大佛",
    en: "The Big Buddha",
    photo: "/images/landmarks/bigbuddha.jpg",
    region: "hongkong",
    introZh: "天壇大佛好高好高，要爬好多級階梯，在昂坪的山上靜靜坐著。",
    introEn: "The Buddha|大佛 sits high on a mountain|山 on Lantau|大嶼山 Island|島.",
    clueEn: "A very big|大的 bronze|青銅 Buddha|佛 sits|坐 on a mountain|山 on Lantau|大嶼山 Island|島 in Hong Kong|香港.",
  },
  {
    zh: "香港迪士尼樂園",
    en: "Hong Kong Disneyland",
    photo: "/images/landmarks/disneyland.jpg",
    region: "hongkong",
    introZh: "迪士尼樂園有城堡、花車巡遊和米奇老鼠，是歡樂的王國。",
    introEn: "Disneyland|迪士尼 has a castle|城堡 and Mickey|米奇 Mouse|老鼠. It is a happy kingdom|王國.",
    clueEn: "It is a happy|快樂 theme park|樂園 in Hong Kong|香港 with a castle|城堡 and Mickey|米奇 Mouse|老鼠.",
  },
  {
    zh: "海洋公園",
    en: "Ocean Park",
    photo: "/images/landmarks/oceanpark.jpg",
    region: "hongkong",
    introZh: "海洋公園可以看熊貓和企鵝，還有好刺激的過山車。",
    introEn: "The park|公園 has pandas|熊貓 and penguins|企鵝 and exciting|刺激的 rides|機動遊戲.",
    clueEn: "It is a sea|海洋 park|公園 in Hong Kong|香港. You can see pandas|熊貓, fish|魚 and ride|乘坐 a cable car|纜車.",
  },
  {
    zh: "香港科學館",
    en: "Hong Kong Science Museum",
    photo: "/images/landmarks/scimuseum.jpg",
    region: "hongkong",
    introZh: "科學館裡好多可以動手玩的展品，還有一部好大的能量穿梭機。",
    introEn: "The museum|博物館 has hands-on|動手做的 exhibits|展品 and a big|大的 energy|能量 machine|機器.",
    clueEn: "It is a museum|博物館 in Tsim Sha Tsui|尖沙咀 with many hands-on|動手做 science|科學 exhibits|展品.",
  },
];
