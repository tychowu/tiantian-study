/**
 * 港鐵小車長：四條香港小朋友最常坐的港鐵綫。
 * 學站名模式：點站名朗讀；下一站模式：列車向前開，猜下一站。
 * 站名用香港慣用字（如「綫」「尖沙咀」），顏色對應港鐵路綫色。
 */
export type MtrStation = { zh: string; en: string };

export type MtrLine = {
  key: string;
  zh: string;
  en: string;
  color: string;
  tint: string;
  icon: string;
  stations: MtrStation[];
};

export const MTR_LINES: MtrLine[] = [
  {
    key: "tsuen-wan",
    zh: "荃灣綫",
    en: "Tsuen Wan Line",
    color: "#E2231A",
    tint: "#FCE9E7",
    icon: "🔴",
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
      { zh: "荃灣", en: "Tsuen Wan" },
    ],
  },
  {
    key: "kwun-tong",
    zh: "觀塘綫",
    en: "Kwun Tong Line",
    color: "#00A040",
    tint: "#E6F4EA",
    icon: "🟢",
    stations: [
      { zh: "黃埔", en: "Whampoa" },
      { zh: "油麻地", en: "Yau Ma Tei" },
      { zh: "旺角", en: "Mong Kok" },
      { zh: "九龍塘", en: "Kowloon Tong" },
      { zh: "黃大仙", en: "Wong Tai Sin" },
      { zh: "鑽石山", en: "Diamond Hill" },
      { zh: "彩虹", en: "Choi Hung" },
      { zh: "九龍灣", en: "Kowloon Bay" },
      { zh: "觀塘", en: "Kwun Tong" },
      { zh: "藍田", en: "Lam Tin" },
    ],
  },
  {
    key: "island",
    zh: "港島綫",
    en: "Island Line",
    color: "#0075C4",
    tint: "#E5F1F9",
    icon: "🔵",
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
      { zh: "北角", en: "North Point" },
    ],
  },
  {
    key: "east-rail",
    zh: "東鐵綫",
    en: "East Rail Line",
    color: "#00888A",
    tint: "#E4F2F2",
    icon: "🚄",
    stations: [
      { zh: "金鐘", en: "Admiralty" },
      { zh: "紅磡", en: "Hung Hom" },
      { zh: "旺角東", en: "Mong Kok East" },
      { zh: "九龍塘", en: "Kowloon Tong" },
      { zh: "大圍", en: "Tai Wai" },
      { zh: "沙田", en: "Sha Tin" },
      { zh: "大埔墟", en: "Tai Po Market" },
      { zh: "太和", en: "Tai Wo" },
      { zh: "粉嶺", en: "Fanling" },
      { zh: "上水", en: "Sheung Shui" },
    ],
  },
];
