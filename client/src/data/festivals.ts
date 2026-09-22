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

export type FestivalProfile = Festival & {
  calendar: "solar" | "lunar";
  /** 放到年度時間軸的代表月份；農曆節日採常見公曆月份。 */
  month: number;
  season: "春" | "夏" | "秋" | "冬";
  dateGuideZh: string;
  activities: [string, string, string];
  foodPlay: string;
  where: string;
  region: "both" | "mainland" | "hongkong" | "other";
  blessing: string;
  clue: string;
  stamp: string;
};

export const FESTIVALS: Festival[] = [
  {
    id: "newyear",
    zh: "元旦",
    en: "New Year's Day",
    dateZh: "1月1日",
    dateEn: "1 January",
    areaZh: "內地及香港公眾假期",
    img: "/images/festivals/01-newyear-v2.jpg",
    factZh: "公曆新年的第一天，大家互祝新年快樂。",
    factEn: "We wish each other a happy New Year on the first day of the calendar year.",
  },
  {
    id: "newyeareve",
    zh: "除夕",
    en: "Chinese New Year's Eve",
    dateZh: "農曆年最後一天",
    dateEn: "last day of the lunar year",
    areaZh: "內地法定",
    img: "/images/festivals/02-newyeareve-v2.jpg",
    factZh: "全家人圍在一起吃團年飯，迎接新年。",
    factEn: "The|整個 family|家庭 eats|吃 a|一頓 big|豐盛的 dinner|晚餐 together|一起 on|在 this|這 day|日子.",
  },
  {
    id: "spring",
    zh: "春節",
    en: "Spring Festival",
    dateZh: "農曆正月初一",
    dateEn: "1st day of the 1st lunar month",
    areaZh: "內地及香港公眾假期",
    img: "/images/festivals/03-spring-v2.jpg",
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
    img: "/images/festivals/04-lantern-v2.jpg",
    factZh: "掛起彩色花燈，吃一碗甜甜的湯圓。",
    factEn: "We|我們 see|看 colourful|五彩的 lanterns|花燈 and|和 eat|吃 sweet|甜的 rice|糯米 balls|湯圓.",
  },
  {
    id: "chingming",
    zh: "清明節",
    en: "Ching Ming Festival",
    dateZh: "4月4日或5日前後",
    dateEn: "4 or 5 April",
    areaZh: "內地及香港公眾假期",
    img: "/images/festivals/05-chingming-v2.jpg",
    factZh: "春天去掃墓、踏青，也會放風箏。",
    factEn: "Families|家人 tidy|整理 family|先人 graves|墓 and|和 fly|放 kites|風箏 in|在 spring|春天.",
  },
  {
    id: "easter",
    zh: "復活節",
    en: "Easter",
    dateZh: "3月或4月的星期日（按教會曆法計算）",
    dateEn: "a Sunday in March or April (church calendar)",
    areaZh: "香港公眾假期",
    img: "/images/festivals/06-easter-v2.jpg",
    factZh: "有復活兔和彩蛋，小朋友會玩尋蛋遊戲。",
    factEn: "The|復活 Easter|復活節 bunny|兔子 hides|藏 eggs|彩蛋 for|給 children|小朋友 to|去 find|尋找.",
  },
  {
    id: "labour",
    zh: "勞動節",
    en: "Labour Day",
    dateZh: "5月1日",
    dateEn: "1 May",
    areaZh: "內地及香港公眾假期",
    img: "/images/festivals/07-labour-v2.jpg",
    factZh: "感謝每一位努力工作的勞動者。",
    factEn: "We|我們 thank|感謝 all|所有 the|勤勞 hard-working|勤勞 workers|勞動者 on|在 this|這 day|日子.",
  },
  {
    id: "buddha",
    zh: "佛誕",
    en: "Buddha's Birthday",
    dateZh: "農曆四月初八",
    dateEn: "8th day of the 4th lunar month",
    areaZh: "香港公眾假期",
    img: "/images/festivals/08-buddha-v2.jpg",
    factZh: "人們到寺院浴佛，學習慈悲與愛心。",
    factEn: "People|人們 visit|參觀 temples|寺院 and|和 bathe|浴 the|佛像 Buddha|佛陀 statue|佛像 with|用 water|清水.",
  },
  {
    id: "dragonboat",
    zh: "端午節",
    en: "Dragon Boat Festival",
    dateZh: "農曆五月初五",
    dateEn: "5th day of the 5th lunar month",
    areaZh: "內地及香港公眾假期",
    img: "/images/festivals/09-dragonboat-v2.jpg",
    factZh: "看龍舟比賽，吃香香的竹葉粽子。",
    factEn: "We|我們 watch|看 dragon|龍舟 boat|龍舟 races|比賽 and|和 eat|吃 sticky|糯米的 rice|米 dumplings|粽子.",
  },
  {
    id: "hksar",
    zh: "香港回歸紀念日",
    en: "HKSAR Establishment Day",
    dateZh: "7月1日",
    dateEn: "1 July",
    areaZh: "香港公眾假期",
    img: "/images/festivals/10-hksar-v2.jpg",
    factZh: "香港特別行政區在一九九七年七月一日成立。",
    factEn: "The HKSAR was established on 1 July 1997.",
  },
  {
    id: "midautumn",
    zh: "中秋節",
    en: "Mid-Autumn Festival",
    dateZh: "農曆八月十五",
    dateEn: "15th day of the 8th lunar month",
    areaZh: "內地放假；香港翌日放假",
    img: "/images/festivals/11-midautumn-v2.jpg",
    factZh: "農曆八月十五，家人團聚、提燈籠和賞月。",
    factEn: "The|這 moon|月亮 is|是 round|圓的 and|而我們 we|我們 eat|吃 mooncakes|月餅 at|在 night|晚上.",
  },
  {
    id: "national",
    zh: "國慶日",
    en: "National Day",
    dateZh: "10月1日",
    dateEn: "1 October",
    areaZh: "內地及香港公眾假期",
    img: "/images/festivals/12-national-v2.jpg",
    factZh: "慶祝中華人民共和國成立，到處都是紅旗。",
    factEn: "China|中國 celebrates|慶祝 her|她的 birthday|生日 with|用 red|紅 flags|旗子 everywhere|到處.",
  },
  {
    id: "chungyeung",
    zh: "重陽節",
    en: "Chung Yeung Festival",
    dateZh: "農曆九月初九",
    dateEn: "9th day of the 9th lunar month",
    areaZh: "香港公眾假期",
    img: "/images/festivals/13-chungyeung-v2.jpg",
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
    img: "/images/festivals/14-halloween-v2.jpg",
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
    img: "/images/festivals/15-wintersolstice-v2.jpg",
    factZh: "北半球一年中白晝最短的時節，家人相聚過冬。",
    factEn: "In Hong Kong, this is the time of year with the shortest daylight. Families get together.",
  },
  {
    id: "christmas",
    zh: "聖誕節",
    en: "Christmas Day",
    dateZh: "12月25日",
    dateEn: "25 December",
    areaZh: "香港公眾假期",
    img: "/images/festivals/16-christmas-v2.jpg",
    factZh: "佈置聖誕樹、交換禮物；基督徒紀念耶穌誕生。",
    factEn: "People decorate trees and exchange gifts. Christians celebrate the birth of Jesus.",
  },
];

const FESTIVAL_DETAILS: Record<string, Omit<FestivalProfile, keyof Festival>> = {
  newyear: {
    calendar: "solar", month: 1, season: "冬", dateGuideZh: "公曆1月1日",
    activities: ["說新年願望", "與家人相聚", "參加新年活動"], foodPlay: "沒有固定的節日食品，各家自由選擇", where: "內地和香港都會過",
    region: "both", blessing: "新年快樂！", clue: "它是公曆一年的第一天。", stamp: "🎆",
  },
  newyeareve: {
    calendar: "lunar", month: 2, season: "冬", dateGuideZh: "農曆年最後一天（通常是1月或2月）",
    activities: ["一家人團聚", "貼揮春", "守歲迎新"], foodPlay: "團年飯、魚、雞、年糕", where: "內地和華人家庭",
    region: "mainland", blessing: "辭舊迎新，闔家團圓！", clue: "它在春節的前一天，家人會吃團年飯。", stamp: "🍲",
  },
  spring: {
    calendar: "lunar", month: 2, season: "冬", dateGuideZh: "農曆正月初一（通常是1月或2月）",
    activities: ["舞獅賀歲", "收紅包", "向親友拜年"], foodPlay: "年糕、糖果、橘子", where: "內地和香港都會過",
    region: "both", blessing: "恭喜發財，大吉大利！", clue: "會看到舞獅、紅包和很多紅色裝飾。", stamp: "🧧",
  },
  lantern: {
    calendar: "lunar", month: 2, season: "春", dateGuideZh: "農曆正月十五（通常是2月或3月）",
    activities: ["賞花燈", "猜燈謎", "與家人團聚"], foodPlay: "湯圓、元宵；部分地區也吃餃子", where: "各地華人社區",
    region: "other", blessing: "團團圓圓！", clue: "春節後的第一個月圓夜，會猜燈謎。", stamp: "🏮",
  },
  chingming: {
    calendar: "solar", month: 4, season: "春", dateGuideZh: "公曆4月4日或5日前後",
    activities: ["拜祭先人", "春日踏青", "放風箏"], foodPlay: "燒豬、燒肉、燒鴨、白切雞（廣東常見）；艾粄、青團（各地做法不同）", where: "內地和香港都會過",
    region: "both", blessing: "珍惜家人，平安健康。", clue: "春天柳樹變綠時，人們會掃墓和踏青。", stamp: "🪁",
  },
  easter: {
    calendar: "solar", month: 4, season: "春", dateGuideZh: "3月或4月的星期日，日期按教會曆法計算",
    activities: ["尋找彩蛋", "裝飾彩蛋", "認識復活節故事"], foodPlay: "雞蛋、巧克力蛋、熱十字麵包", where: "香港復活節假期及許多西方地區",
    region: "hongkong", blessing: "充滿希望和歡樂！", clue: "小朋友會尋找兔子藏起來的彩蛋。", stamp: "🥚",
  },
  labour: {
    calendar: "solar", month: 5, season: "春", dateGuideZh: "公曆5月1日",
    activities: ["感謝勞動者", "認識不同職業", "向工作的人說謝謝"], foodPlay: "沒有固定的節日食品", where: "內地和香港都會放假",
    region: "both", blessing: "勞動最光榮！", clue: "這一天要感謝每一位努力工作的人。", stamp: "🧑‍🔧",
  },
  buddha: {
    calendar: "lunar", month: 5, season: "春", dateGuideZh: "農曆四月初八（通常是4月或5月）",
    activities: ["到寺院參觀", "參加浴佛", "學習慈悲愛心"], foodPlay: "部分信眾會吃素菜", where: "香港公眾假期；其他地區也有人慶祝",
    region: "hongkong", blessing: "平安吉祥！", clue: "人們會到寺院，以清水浴佛。", stamp: "🪷",
  },
  dragonboat: {
    calendar: "lunar", month: 6, season: "夏", dateGuideZh: "農曆五月初五（通常是5月或6月）",
    activities: ["看龍舟比賽", "掛艾草（部分地區）", "認識屈原故事"], foodPlay: "粽子", where: "內地和香港都會過",
    region: "both", blessing: "端午安康！", clue: "天氣很熱，河上會有又長又快的船。", stamp: "🐉",
  },
  hksar: {
    calendar: "solar", month: 7, season: "夏", dateGuideZh: "公曆7月1日",
    activities: ["看升旗禮", "參加慶祝活動", "認識香港故事"], foodPlay: "沒有固定的節日食品", where: "香港",
    region: "hongkong", blessing: "香港明天更美好！", clue: "它紀念香港特別行政區在1997年成立。", stamp: "🌺",
  },
  midautumn: {
    calendar: "lunar", month: 9, season: "秋", dateGuideZh: "農曆八月十五（通常是9月或10月；有時在8月）",
    activities: ["與家人團聚", "賞月亮", "提燈籠"], foodPlay: "月餅、柚子", where: "兩地都過；香港翌日放假",
    region: "both", blessing: "月圓人團圓！", clue: "秋天的月亮又大又圓，桌上有月餅。", stamp: "🥮",
  },
  national: {
    calendar: "solar", month: 10, season: "秋", dateGuideZh: "公曆10月1日",
    activities: ["看升旗禮", "掛起紅旗", "參加國慶活動"], foodPlay: "沒有固定的節日食品", where: "內地和香港都會放假",
    region: "both", blessing: "祝祖國繁榮昌盛！", clue: "到處都能看到鮮紅的國旗。", stamp: "⭐",
  },
  chungyeung: {
    calendar: "lunar", month: 10, season: "秋", dateGuideZh: "農曆九月初九（通常是10月；有時在9月或11月）",
    activities: ["登高遠望", "欣賞菊花", "拜祭先人"], foodPlay: "重陽糕（部分地區）", where: "香港公眾假期；其他地區也有人慶祝",
    region: "hongkong", blessing: "身體健康！", clue: "秋天天氣清涼，人們會登高和賞菊。", stamp: "⛰️",
  },
  halloween: {
    calendar: "solar", month: 10, season: "秋", dateGuideZh: "公曆10月31日",
    activities: ["穿趣怪服裝", "提南瓜燈", "玩不給糖就搗蛋"], foodPlay: "糖果、南瓜食品（各地不同）", where: "香港及許多西方地區",
    region: "other", blessing: "萬聖節快樂！", clue: "會看到南瓜燈、糖果和有趣的裝扮。", stamp: "🎃",
  },
  wintersolstice: {
    calendar: "solar", month: 12, season: "冬", dateGuideZh: "公曆12月21日或22日",
    activities: ["一家人團聚", "向長輩問好", "觀察冬天日短夜長"], foodPlay: "團圓飯、湯圓；北方部分地區吃餃子", where: "各地華人家庭",
    region: "other", blessing: "冬至快樂，團團圓圓！", clue: "在香港，這是一年中白晝最短的時節。", stamp: "🍡",
  },
  christmas: {
    calendar: "solar", month: 12, season: "冬", dateGuideZh: "公曆12月25日",
    activities: ["裝飾聖誕樹", "交換禮物", "唱聖誕歌"], foodPlay: "薑餅、聖誕蛋糕、烤火雞（各地不同）", where: "香港及世界多個地區",
    region: "hongkong", blessing: "聖誕快樂！", clue: "冬天會看到聖誕樹、星星和禮物。", stamp: "🎄",
  },
};

/** 四個關卡共用的完整檔案，避免日期、習俗和地區資料各說各話。 */
export const FESTIVAL_PROFILES: FestivalProfile[] = FESTIVALS.map((festival) => ({
  ...festival,
  ...FESTIVAL_DETAILS[festival.id],
}));

/** 每輪連線配對數 */
export const PAIRS_PER_ROUND = 4;
