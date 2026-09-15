/**
 * 港鐵小車長：四條主要港鐵綫。
 * 顏色採用港鐵路綫圖的官方路綫色，站名完整不遺漏。
 * 學站名模式：點站名朗讀；下一站模式：猜下一站。
 */
export type MtrStation = {
  zh: string;
  en: string;
  /** 備註（如：馬場站只在賽馬日使用） */
  note?: string;
};

export type MtrLine = {
  key: string;
  zh: string;
  en: string;
  /** 港鐵官方路綫色 */
  color: string;
  tint: string;
  stations: MtrStation[];
  /** 這些站的「下一站」不拿來出題（分叉／只在賽馬日停車） */
  skipQuizFrom?: number[];
};

export const MTR_LINES: MtrLine[] = [
  {
    key: "tsuen-wan",
    zh: "荃灣綫",
    en: "Tsuen Wan Line",
    color: "#ED1B2F",
    tint: "#FCE9E7",
    stations: [
      { zh: "中環", en: "Central" },
      { zh: "金鐘", en: "Admiralty" },
      { zh: "尖沙咀", en: "Tsim Sha Tsui" },
      { zh: "佐敦", en: "Jordan" },
      { zh: "油麻地", en: "Yau Ma Tei" },
      { zh: "旺角", en: "Mong Kok" },
      { zh: "太子", en: "Prince Edward" },
      { zh: "深水埗", en: "Sham Shui Po" },
      { zh: "長沙灣", en: "Cheung Sha Wan" },
      { zh: "荔枝角", en: "Lai Chi Kok" },
      { zh: "美孚", en: "Mei Foo" },
      { zh: "荔景", en: "Lai King" },
      { zh: "葵芳", en: "Kwai Fong" },
      { zh: "葵興", en: "Kwai Hing" },
      { zh: "大窩口", en: "Tai Wo Hau" },
      { zh: "荃灣", en: "Tsuen Wan" },
    ],
  },
  {
    key: "kwun-tong",
    zh: "觀塘綫",
    en: "Kwun Tong Line",
    color: "#00A651",
    tint: "#E6F4EA",
    stations: [
      { zh: "黃埔", en: "Whampoa" },
      { zh: "何文田", en: "Ho Man Tin" },
      { zh: "土瓜灣", en: "To Kwa Wan" },
      { zh: "宋皇臺", en: "Sung Wong Toi" },
      { zh: "啟德", en: "Kai Tak" },
      { zh: "鑽石山", en: "Diamond Hill" },
      { zh: "彩虹", en: "Choi Hung" },
      { zh: "九龍灣", en: "Kowloon Bay" },
      { zh: "牛頭角", en: "Ngau Tau Kok" },
      { zh: "觀塘", en: "Kwun Tong" },
      { zh: "藍田", en: "Lam Tin" },
      { zh: "油塘", en: "Yau Tong" },
      { zh: "調景嶺", en: "Tiu Keng Leng" },
    ],
  },
  {
    key: "island",
    zh: "港島綫",
    en: "Island Line",
    color: "#0075C2",
    tint: "#E5F1F9",
    stations: [
      { zh: "堅尼地城", en: "Kennedy Town" },
      { zh: "香港大學", en: "HKU" },
      { zh: "西營盤", en: "Sai Ying Pun" },
      { zh: "上環", en: "Sheung Wan" },
      { zh: "中環", en: "Central" },
      { zh: "金鐘", en: "Admiralty" },
      { zh: "灣仔", en: "Wan Chai" },
      { zh: "銅鑼灣", en: "Causeway Bay" },
      { zh: "天后", en: "Tin Hau" },
      { zh: "炮台山", en: "Fortress Hill" },
      { zh: "北角", en: "North Point" },
      { zh: "鰂魚涌", en: "Quarry Bay" },
      { zh: "太古", en: "Tai Koo" },
      { zh: "西灣河", en: "Sai Wan Ho" },
      { zh: "筲箕灣", en: "Shau Kei Wan" },
      { zh: "杏花邨", en: "Heng Fa Chuen" },
      { zh: "柴灣", en: "Chai Wan" },
    ],
  },
  {
    key: "east-rail",
    zh: "東鐵綫",
    en: "East Rail Line",
    color: "#53B7E8",
    tint: "#EAF6FC",
    stations: [
      { zh: "金鐘", en: "Admiralty" },
      { zh: "會展", en: "Exhibition Centre" },
      { zh: "紅磡", en: "Hung Hom" },
      { zh: "旺角東", en: "Mong Kok East" },
      { zh: "九龍塘", en: "Kowloon Tong" },
      { zh: "大圍", en: "Tai Wai" },
      { zh: "沙田", en: "Sha Tin" },
      { zh: "馬場", en: "Racecourse", note: "只在賽馬日停車" },
      { zh: "火炭", en: "Fo Tan" },
      { zh: "大學", en: "University" },
      { zh: "大埔墟", en: "Tai Po Market" },
      { zh: "太和", en: "Tai Wo" },
      { zh: "粉嶺", en: "Fanling" },
      { zh: "上水", en: "Sheung Shui" },
      { zh: "落馬洲", en: "Lok Ma Chau" },
      { zh: "羅湖", en: "Lo Wu" },
    ],
    // 沙田的下一站是馬場（賽馬日才停）；上水的下一站分叉去落馬洲／羅湖，都不出題
    skipQuizFrom: [6, 13, 14],
  },
];
