/**
 * 全港重鐵綫資料。
 * 站序供遊戲使用；OFFICIAL_MAP_POSITIONS 對應使用者提供的港鐵路綫圖底圖。
 */
export type MapStation = { zh: string; en: string; x: number; y: number };

export type MapLine = {
  key: string;
  zh: string;
  en: string;
  color: string;
  paths: string[];
  stations: MapStation[];
};

const station = (zh: string, en: string, x: number, y: number): MapStation => ({ zh, en, x, y });

export const MTR_MAP: MapLine[] = [
  {
    key: "tsuen-wan", zh: "荃灣綫", en: "Tsuen Wan Line", color: "#E2231A",
    paths: ["90,235 125,265 160,295 195,325 240,360 300,395 340,420 380,440 420,460 465,480 465,510 465,540 465,570 465,600 500,690 430,710"],
    stations: [
      station("荃灣", "Tsuen Wan", 90, 235), station("大窩口", "Tai Wo Hau", 125, 265),
      station("葵興", "Kwai Hing", 160, 295), station("葵芳", "Kwai Fong", 195, 325),
      station("荔景", "Lai King", 240, 360), station("美孚", "Mei Foo", 300, 395),
      station("荔枝角", "Lai Chi Kok", 340, 420), station("長沙灣", "Cheung Sha Wan", 380, 440),
      station("深水埗", "Sham Shui Po", 420, 460), station("太子", "Prince Edward", 465, 480),
      station("旺角", "Mong Kok", 465, 510), station("油麻地", "Yau Ma Tei", 465, 540),
      station("佐敦", "Jordan", 465, 570), station("尖沙咀", "Tsim Sha Tsui", 465, 600),
      station("金鐘", "Admiralty", 500, 690), station("中環", "Central", 430, 710),
    ],
  },
  {
    key: "kwun-tong", zh: "觀塘綫", en: "Kwun Tong Line", color: "#00AB4E",
    paths: ["600,590 555,560 465,540 465,510 465,480 610,465 665,450 710,430 750,430 790,430 835,450 875,470 915,490 955,510 995,535 1030,560 1070,560"],
    stations: [
      station("黃埔", "Whampoa", 600, 590), station("何文田", "Ho Man Tin", 555, 560),
      station("油麻地", "Yau Ma Tei", 465, 540), station("旺角", "Mong Kok", 465, 510),
      station("太子", "Prince Edward", 465, 480), station("石硤尾", "Shek Kip Mei", 610, 465),
      station("九龍塘", "Kowloon Tong", 665, 450), station("樂富", "Lok Fu", 710, 430),
      station("黃大仙", "Wong Tai Sin", 750, 430), station("鑽石山", "Diamond Hill", 790, 430),
      station("彩虹", "Choi Hung", 835, 450), station("九龍灣", "Kowloon Bay", 875, 470),
      station("牛頭角", "Ngau Tau Kok", 915, 490), station("觀塘", "Kwun Tong", 955, 510),
      station("藍田", "Lam Tin", 995, 535), station("油塘", "Yau Tong", 1030, 560),
      station("調景嶺", "Tiu Keng Leng", 1070, 560),
    ],
  },
  {
    key: "island", zh: "港島綫", en: "Island Line", color: "#0071CE",
    paths: ["190,735 230,725 270,715 320,710 430,710 500,690 570,700 630,700 680,690 720,680 760,670 805,660 850,650 895,640 940,630 985,635 1030,650"],
    stations: [
      station("堅尼地城", "Kennedy Town", 190, 735), station("香港大學", "HKU", 230, 725),
      station("西營盤", "Sai Ying Pun", 270, 715), station("上環", "Sheung Wan", 320, 710),
      station("中環", "Central", 430, 710), station("金鐘", "Admiralty", 500, 690),
      station("灣仔", "Wan Chai", 570, 700), station("銅鑼灣", "Causeway Bay", 630, 700),
      station("天后", "Tin Hau", 680, 690), station("炮台山", "Fortress Hill", 720, 680),
      station("北角", "North Point", 760, 670), station("鰂魚涌", "Quarry Bay", 805, 660),
      station("太古", "Tai Koo", 850, 650), station("西灣河", "Sai Wan Ho", 895, 640),
      station("筲箕灣", "Shau Kei Wan", 940, 630), station("杏花邨", "Heng Fa Chuen", 985, 635),
      station("柴灣", "Chai Wan", 1030, 650),
    ],
  },
  {
    key: "south-island", zh: "南港島綫", en: "South Island Line", color: "#B5BD00",
    paths: ["500,690 520,745 500,780 460,805 420,825"],
    stations: [
      station("金鐘", "Admiralty", 500, 690), station("海洋公園", "Ocean Park", 520, 745),
      station("黃竹坑", "Wong Chuk Hang", 500, 780), station("利東", "Lei Tung", 460, 805),
      station("海怡半島", "South Horizons", 420, 825),
    ],
  },
  {
    key: "east-rail", zh: "東鐵綫", en: "East Rail Line", color: "#5EB6E4",
    paths: [
      "500,690 545,655 570,600 590,530 665,450 760,360 790,315 820,280 850,245 890,210 920,175 950,140 980,105 1000,60",
      "790,315 830,255 850,245",
      "980,105 1070,80",
    ],
    stations: [
      station("金鐘", "Admiralty", 500, 690), station("會展", "Exhibition Centre", 545, 655),
      station("紅磡", "Hung Hom", 570, 600), station("旺角東", "Mong Kok East", 590, 530),
      station("九龍塘", "Kowloon Tong", 665, 450), station("大圍", "Tai Wai", 760, 360),
      station("沙田", "Sha Tin", 790, 315), station("火炭", "Fo Tan", 820, 280),
      station("馬場", "Racecourse", 830, 255), station("大學", "University", 850, 245),
      station("大埔墟", "Tai Po Market", 890, 210), station("太和", "Tai Wo", 920, 175),
      station("粉嶺", "Fanling", 950, 140), station("上水", "Sheung Shui", 980, 105),
      station("羅湖", "Lo Wu", 1000, 60), station("落馬洲", "Lok Ma Chau", 1070, 80),
    ],
  },
  {
    key: "tuen-ma", zh: "屯馬綫", en: "Tuen Ma Line", color: "#9A3820",
    paths: ["70,505 85,465 110,425 145,395 180,365 230,340 275,355 300,395 340,480 420,585 480,615 570,600 555,560 640,540 700,510 750,475 790,430 760,390 760,360 805,380 835,370 865,360 895,350 925,340 955,330 985,320 1015,300"],
    stations: [
      station("屯門", "Tuen Mun", 70, 505), station("兆康", "Siu Hong", 85, 465),
      station("天水圍", "Tin Shui Wai", 110, 425), station("朗屏", "Long Ping", 145, 395),
      station("元朗", "Yuen Long", 180, 365), station("錦上路", "Kam Sheung Road", 230, 340),
      station("荃灣西", "Tsuen Wan West", 275, 355), station("美孚", "Mei Foo", 300, 395),
      station("南昌", "Nam Cheong", 340, 480), station("柯士甸", "Austin", 420, 585),
      station("尖東", "East Tsim Sha Tsui", 480, 615), station("紅磡", "Hung Hom", 570, 600),
      station("何文田", "Ho Man Tin", 555, 560), station("土瓜灣", "To Kwa Wan", 640, 540),
      station("宋皇臺", "Sung Wong Toi", 700, 510), station("啟德", "Kai Tak", 750, 475),
      station("鑽石山", "Diamond Hill", 790, 430), station("顯徑", "Hin Keng", 760, 390),
      station("大圍", "Tai Wai", 760, 360), station("車公廟", "Che Kung Temple", 805, 380),
      station("沙田圍", "Sha Tin Wai", 835, 370), station("第一城", "City One", 865, 360),
      station("石門", "Shek Mun", 895, 350), station("大水坑", "Tai Shui Hang", 925, 340),
      station("恆安", "Heng On", 955, 330), station("馬鞍山", "Ma On Shan", 985, 320),
      station("烏溪沙", "Wu Kai Sha", 1015, 300),
    ],
  },
  {
    key: "tung-chung", zh: "東涌綫", en: "Tung Chung Line", color: "#F38B00",
    paths: ["400,710 400,620 360,560 340,480 240,360 200,440 140,550 80,620"],
    stations: [
      station("香港", "Hong Kong", 400, 710), station("九龍", "Kowloon", 400, 620),
      station("奧運", "Olympic", 360, 560), station("南昌", "Nam Cheong", 340, 480),
      station("荔景", "Lai King", 240, 360), station("青衣", "Tsing Yi", 200, 440),
      station("欣澳", "Sunny Bay", 140, 550), station("東涌", "Tung Chung", 80, 620),
    ],
  },
  {
    key: "airport-express", zh: "機場快綫", en: "Airport Express", color: "#00888A",
    paths: ["414,720 414,630 210,450 88,660 45,690"],
    stations: [
      station("香港", "Hong Kong", 414, 720), station("九龍", "Kowloon", 414, 630),
      station("青衣", "Tsing Yi", 210, 450), station("機場", "Airport", 88, 660),
      station("博覽館", "AsiaWorld-Expo", 45, 690),
    ],
  },
  {
    key: "disneyland", zh: "迪士尼綫", en: "Disneyland Resort Line", color: "#F550A5",
    paths: ["140,550 110,590"],
    stations: [station("欣澳", "Sunny Bay", 140, 550), station("迪士尼", "Disneyland Resort", 110, 590)],
  },
  {
    key: "tseung-kwan-o", zh: "將軍澳綫", en: "Tseung Kwan O Line", color: "#7D3F98",
    paths: ["760,680 805,670 1030,570 1070,570 1100,610 1100,660 1070,700", "1100,610 1160,625"],
    stations: [
      station("北角", "North Point", 760, 680), station("鰂魚涌", "Quarry Bay", 805, 670),
      station("油塘", "Yau Tong", 1030, 570), station("調景嶺", "Tiu Keng Leng", 1070, 570),
      station("將軍澳", "Tseung Kwan O", 1100, 610), station("坑口", "Hang Hau", 1100, 660),
      station("寶琳", "Po Lam", 1070, 700), station("康城", "LOHAS Park", 1160, 625),
    ],
  },
];

/** 官方路綫圖底圖的座標系，站點用同一 viewBox 疊加，縮放時不會走位。 */
export const OFFICIAL_MAP_SIZE = { width: 1920, height: 1294 } as const;

export const OFFICIAL_MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "天水圍": { x: 235, y: 234 },
  "羅湖": { x: 672, y: 241 }, "上水": { x: 755, y: 245 }, "粉嶺": { x: 839, y: 241 },
  "太和": { x: 923, y: 241 }, "大埔墟": { x: 1007, y: 241 }, "大學": { x: 1103, y: 241 },
  "第一城": { x: 1327, y: 242 }, "石門": { x: 1414, y: 242 }, "大水坑": { x: 1501, y: 242 },
  "恆安": { x: 1588, y: 242 }, "馬鞍山": { x: 1674, y: 242 }, "烏溪沙": { x: 1761, y: 242 },
  "落馬洲": { x: 615, y: 273 }, "朗屏": { x: 267, y: 291 },
  "火炭": { x: 1143, y: 330 }, "馬場": { x: 1174, y: 330 }, "沙田圍": { x: 1280, y: 330 },
  "兆康": { x: 200, y: 349 }, "元朗": { x: 263, y: 349 }, "車公廟": { x: 1280, y: 398 },
  "沙田": { x: 1143, y: 398 }, "錦上路": { x: 267, y: 415 }, "屯門": { x: 200, y: 440 },
  "大圍": { x: 1147, y: 466 }, "荃灣西": { x: 298, y: 489 }, "顯徑": { x: 1251, y: 497 },
  "荔景": { x: 626, y: 562 }, "美孚": { x: 700, y: 562 }, "石硤尾": { x: 1032, y: 558 },
  "九龍塘": { x: 1143, y: 562 }, "樂富": { x: 1201, y: 558 }, "黃大仙": { x: 1263, y: 558 },
  "鑽石山": { x: 1390, y: 562 }, "荃灣": { x: 298, y: 559 }, "大窩口": { x: 392, y: 559 },
  "葵興": { x: 472, y: 559 }, "葵芳": { x: 552, y: 559 }, "荔枝角": { x: 773, y: 559 },
  "長沙灣": { x: 852, y: 559 }, "深水埗": { x: 929, y: 559 }, "彩虹": { x: 1452, y: 559 },
  "九龍灣": { x: 1508, y: 570 }, "太子": { x: 981, y: 611 }, "牛頭角": { x: 1520, y: 620 },
  "寶琳": { x: 1766, y: 621 }, "青衣": { x: 530, y: 625 }, "啟德": { x: 1390, y: 622 },
  "南昌": { x: 696, y: 636 }, "旺角": { x: 981, y: 666 }, "旺角東": { x: 1143, y: 670 },
  "觀塘": { x: 1520, y: 681 }, "宋皇臺": { x: 1355, y: 692 }, "坑口": { x: 1766, y: 696 },
  "博覽館": { x: 342, y: 702 }, "欣澳": { x: 447, y: 718 }, "油麻地": { x: 981, y: 721 },
  "土瓜灣": { x: 1306, y: 741 }, "藍田": { x: 1520, y: 741 }, "奧運": { x: 693, y: 742 },
  "何文田": { x: 1186, y: 772 }, "機場": { x: 291, y: 773 }, "佐敦": { x: 977, y: 775 },
  "迪士尼": { x: 503, y: 784 }, "油塘": { x: 1566, y: 795 }, "調景嶺": { x: 1643, y: 795 },
  "將軍澳": { x: 1721, y: 802 }, "黃埔": { x: 1260, y: 802 }, "九龍": { x: 790, y: 828 },
  "柯士甸": { x: 872, y: 828 }, "東涌": { x: 329, y: 831 }, "尖沙咀": { x: 977, y: 841 },
  "紅磡": { x: 1102, y: 849 }, "康城": { x: 1766, y: 865 }, "尖東": { x: 1009, y: 875 },
  "香港": { x: 831, y: 947 }, "會展": { x: 1009, y: 947 },
  "堅尼地城": { x: 465, y: 985 }, "香港大學": { x: 557, y: 985 }, "西營盤": { x: 648, y: 985 },
  "上環": { x: 739, y: 985 }, "中環": { x: 831, y: 985 }, "金鐘": { x: 921, y: 985 },
  "灣仔": { x: 1009, y: 985 }, "銅鑼灣": { x: 1101, y: 985 }, "天后": { x: 1192, y: 985 },
  "炮台山": { x: 1282, y: 985 }, "北角": { x: 1372, y: 981 }, "鰂魚涌": { x: 1463, y: 981 },
  "太古": { x: 1553, y: 985 }, "西灣河": { x: 1643, y: 985 }, "筲箕灣": { x: 1728, y: 1049 },
  "海洋公園": { x: 977, y: 1080 }, "黃竹坑": { x: 868, y: 1129 }, "杏花邨": { x: 1766, y: 1130 },
  "海怡半島": { x: 611, y: 1185 }, "利東": { x: 730, y: 1185 }, "柴灣": { x: 1766, y: 1207 },
};
