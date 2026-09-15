/**
 * 節日派對：香港與中國內地的法定節日，加上重要的傳統節日。
 * 每個節日配 AI 生成的卡通插畫（client/public/images/festivals/）。
 * 注意：英文句子用 `word|翻譯` 標註，必須「一個英文單字」對一個翻譯
 * （BilingualText 以空白切詞），不可寫成多字詞組標註。
 */
export type Festival = {
  id: string;
  zh: string;
  en: string;
  dateZh: string;
  dateEn: string;
  /** 適用地區說明 */
  areaZh: string;
  img: string;
  factZh: string;
  factEn: string;
};

export const FESTIVALS: Festival[] = [
  {
    id: "newyear",
    zh: "元旦",
    en: "New Year's Day",
    dateZh: "1月1日",
    dateEn: "1 January",
    areaZh: "內地及香港法定",
    img: "/images/festivals/01-newyear.png",
    factZh: "新年第一天，大家會一起倒數和看煙花。",
    factEn: "We|我們 count|倒數 down|一起 and|並且 watch|看 the|煙花 fireworks|煙花 on|在 New|新年 Year's|新年 Day|一天.",
  },
  {
    id: "newyeareve",
    zh: "除夕",
    en: "Chinese New Year's Eve",
    dateZh: "農曆年最後一天",
    dateEn: "last day of the lunar year",
    areaZh: "內地法定",
    img: "/images/festivals/02-newyeareve.png",
    factZh: "全家人圍在一起吃團年飯，迎接新年。",
    factEn: "The|整個 family|家庭 eats|吃 a|一頓 big|豐盛的 dinner|晚餐 together|一起 on|在 this|這 day|日子.",
  },
  {
    id: "spring",
    zh: "春節",
    en: "Spring Festival",
    dateZh: "農曆正月初一",
    dateEn: "1st day of the 1st lunar month",
    areaZh: "內地及香港法定",
    img: "/images/festivals/03-spring.png",
    factZh: "又叫做農曆新年，有舞獅、紅包和橘子。",
    factEn: "It|它 is|是 the|這 lunar|農曆 new|新 year|年 with|有 lion|獅子 dances|舞 and|和 red|紅 packets|紅包.",
  },
  {
    id: "lantern",
    zh: "元宵節",
    en: "Lantern Festival",
    dateZh: "農曆正月十五",
    dateEn: "15th day of the 1st lunar month",
    areaZh: "傳統節日",
    img: "/images/festivals/04-lantern.png",
    factZh: "掛起彩色花燈，吃一碗甜甜的湯圓。",
    factEn: "We|我們 see|看 colourful|五彩的 lanterns|花燈 and|和 eat|吃 sweet|甜的 rice|糯米 balls|湯圓.",
  },
  {
    id: "chingming",
    zh: "清明節",
    en: "Ching Ming Festival",
    dateZh: "4月4日或5日前後",
    dateEn: "4 or 5 April",
    areaZh: "內地及香港法定",
    img: "/images/festivals/05-chingming.png",
    factZh: "春天去掃墓、踏青，也會放風箏。",
    factEn: "Families|家人 tidy|整理 family|先人 graves|墓 and|和 fly|放 kites|風箏 in|在 spring|春天.",
  },
  {
    id: "easter",
    zh: "復活節",
    en: "Easter",
    dateZh: "春分月圓後第一個星期日",
    dateEn: "first Sunday after the full moon",
    areaZh: "香港法定",
    img: "/images/festivals/06-easter.png",
    factZh: "有復活兔和彩蛋，小朋友會玩尋蛋遊戲。",
    factEn: "The|復活 Easter|復活節 bunny|兔子 hides|藏 eggs|彩蛋 for|給 children|小朋友 to|去 find|尋找.",
  },
  {
    id: "labour",
    zh: "勞動節",
    en: "Labour Day",
    dateZh: "5月1日",
    dateEn: "1 May",
    areaZh: "內地及香港法定",
    img: "/images/festivals/07-labour.png",
    factZh: "感謝每一位努力工作的勞動者。",
    factEn: "We|我們 thank|感謝 all|所有 the|勤勞 hard-working|勤勞 workers|勞動者 on|在 this|這 day|日子.",
  },
  {
    id: "buddha",
    zh: "佛誕",
    en: "Buddha's Birthday",
    dateZh: "農曆四月初八",
    dateEn: "8th day of the 4th lunar month",
    areaZh: "香港法定",
    img: "/images/festivals/08-buddha.png",
    factZh: "人們到寺院浴佛，學習慈悲與愛心。",
    factEn: "People|人們 visit|參觀 temples|寺院 and|和 bathe|浴 the|佛像 Buddha|佛陀 statue|佛像 with|用 water|清水.",
  },
  {
    id: "dragonboat",
    zh: "端午節",
    en: "Dragon Boat Festival",
    dateZh: "農曆五月初五",
    dateEn: "5th day of the 5th lunar month",
    areaZh: "內地及香港法定",
    img: "/images/festivals/09-dragonboat.png",
    factZh: "看龍舟比賽，吃香香的竹葉粽子。",
    factEn: "We|我們 watch|看 dragon|龍舟 boat|龍舟 races|比賽 and|和 eat|吃 sticky|糯米的 rice|米 dumplings|粽子.",
  },
  {
    id: "hksar",
    zh: "香港回歸紀念日",
    en: "HKSAR Establishment Day",
    dateZh: "7月1日",
    dateEn: "1 July",
    areaZh: "香港法定",
    img: "/images/festivals/10-hksar.png",
    factZh: "香港特別行政區在一九九七年七月一日成立，有煙花匯演。",
    factEn: "Hong|香港 Kong|香港 was|在 born|成立 on|在 1|一日 July|七月 in|在 1997|一九九七.",
  },
  {
    id: "midautumn",
    zh: "中秋節",
    en: "Mid-Autumn Festival",
    dateZh: "農曆八月十五",
    dateEn: "15th day of the 8th lunar month",
    areaZh: "內地及香港法定",
    img: "/images/festivals/11-midautumn.png",
    factZh: "月亮最圓的晚上，提燈籠、吃月餅、賞月。",
    factEn: "The|這 moon|月亮 is|是 round|圓的 and|而我們 we|我們 eat|吃 mooncakes|月餅 at|在 night|晚上.",
  },
  {
    id: "national",
    zh: "國慶日",
    en: "National Day",
    dateZh: "10月1日",
    dateEn: "1 October",
    areaZh: "內地及香港法定",
    img: "/images/festivals/12-national.png",
    factZh: "慶祝中華人民共和國成立，到處都是紅旗。",
    factEn: "China|中國 celebrates|慶祝 her|她的 birthday|生日 with|用 red|紅 flags|旗子 everywhere|到處.",
  },
  {
    id: "chungyeung",
    zh: "重陽節",
    en: "Chung Yeung Festival",
    dateZh: "農曆九月初九",
    dateEn: "9th day of the 9th lunar month",
    areaZh: "香港法定",
    img: "/images/festivals/13-chungyeung.png",
    factZh: "登高遠望、賞菊花，也會去掃墓。",
    factEn: "People|人們 climb|登高 mountains|高山 and|和 enjoy|賞 chrysanthemums|菊花 on|在 this|這 day|日子.",
  },
  {
    id: "halloween",
    zh: "萬聖節",
    en: "Halloween",
    dateZh: "10月31日",
    dateEn: "31 October",
    areaZh: "西方節日",
    img: "/images/festivals/14-halloween.png",
    factZh: "穿上有趣服裝，提著南瓜燈說「不給糖就搗蛋」。",
    factEn: "Children|小朋友 wear|穿 costumes|服裝 and|和 say|說 trick|搗蛋 or|或者 treat|給糖.",
  },
  {
    id: "wintersolstice",
    zh: "冬至",
    en: "Winter Solstice",
    dateZh: "12月21日或22日",
    dateEn: "21 or 22 December",
    areaZh: "傳統節日",
    img: "/images/festivals/15-wintersolstice.png",
    factZh: "一年中黑夜最長的一天，全家吃湯圓團圓。",
    factEn: "It|這 is|是 the|全年 longest|最長 night|黑夜 of|在 the|一年 year|年 for|讓 families|家人 to|一起 gather|團聚.",
  },
  {
    id: "christmas",
    zh: "聖誕節",
    en: "Christmas Day",
    dateZh: "12月25日",
    dateEn: "25 December",
    areaZh: "香港法定",
    img: "/images/festivals/16-christmas.png",
    factZh: "佈置聖誕樹，聖誕老人會送來禮物。",
    factEn: "Santa|聖誕老人 brings|送 gifts|禮物 and|而聖誕樹 the|聖誕樹 tree|聖誕樹 wears|掛滿 lights|燈飾.",
  },
];

/** 每輪連線配對數 */
export const PAIRS_PER_ROUND = 4;
