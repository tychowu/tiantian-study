import { FESTIVAL_PROFILES, type FestivalProfile } from "./festivals";

export type FestivalLanguage = "zh" | "en";
type EnglishDetails = {
  date: string; activities: [string, string, string]; food: string;
  where: string; blessing: string; clue: string;
};
// Food examples describe regional customs, not rules for every family.
export const FESTIVAL_ENGLISH: Record<string, EnglishDetails> = {
  newyear: {
    date: "1 January",
    activities: ["Make a New Year wish", "Spend time with family", "Join New Year events"],
    food: "No special food is required. Families choose their favourites.",
    where: "Mainland China and Hong Kong", blessing: "Happy New Year!",
    clue: "It is the first day of the calendar year.",
  },
  newyeareve: {
    date: "Last day of the lunar year, usually in January or February",
    activities: ["Get together with family", "Put up red couplets", "Stay up to welcome the new year"],
    food: "Reunion dinner, fish, chicken and rice cake",
    where: "Mainland China and Chinese families around the world",
    blessing: "Welcome the new year! May the whole family be together!",
    clue: "It is the day before Chinese New Year.",
  },
  spring: {
    date: "1st day of the 1st lunar month, usually in January or February",
    activities: ["Watch lion dances", "Receive red packets", "Visit family and friends"],
    food: "Rice cake, sweets and mandarins",
    where: "Mainland China and Hong Kong", blessing: "Wishing you wealth and good luck!",
    clue: "Look for lion dances, red packets and red decorations.",
  },
  lantern: {
    date: "15th day of the 1st lunar month, usually in February or March",
    activities: ["Look at lanterns", "Solve lantern riddles", "Get together with family"],
    food: "Tangyuan and yuanxiao (rice balls); some regions also have dumplings",
    where: "Chinese communities around the world", blessing: "May your family be happy together!",
    clue: "It is the first full-moon festival after Chinese New Year.",
  },
  chingming: {
    date: "Around 4 or 5 April",
    activities: ["Remember ancestors", "Go for a spring walk", "Fly kites"],
    food: "Roast pig, roast pork, roast duck and poached chicken in Guangdong; ai ban and qingtuan (green rice cakes) in some regions",
    where: "Mainland China and Hong Kong", blessing: "May your family be safe and well.",
    clue: "Families visit graves and go for spring walks.",
  },
  easter: {
    date: "A Sunday in March or April, set by the church calendar",
    activities: ["Go on an egg hunt", "Decorate eggs", "Learn the Easter story"],
    food: "Eggs, chocolate eggs and hot cross buns",
    where: "Hong Kong and many other places", blessing: "Happy Easter! A day of hope and joy!",
    clue: "Children look for hidden eggs.",
  },
  labour: {
    date: "1 May",
    activities: ["Thank workers", "Learn about different jobs", "Say thank you to people at work"],
    food: "There is no fixed traditional food.",
    where: "Mainland China and Hong Kong", blessing: "Thank you for your hard work!",
    clue: "We thank people who work hard to help us.",
  },
  buddha: {
    date: "8th day of the 4th lunar month, usually in April or May",
    activities: ["Visit a temple", "Bathe a Buddha statue", "Learn to be kind"],
    food: "Some Buddhists eat vegetarian food.",
    where: "A Hong Kong public holiday; also observed elsewhere", blessing: "Wishing you peace and good luck!",
    clue: "People gently pour water over a Buddha statue.",
  },
  dragonboat: {
    date: "5th day of the 5th lunar month, usually in May or June",
    activities: ["Watch dragon boat races", "Hang mugwort in some regions", "Learn about Qu Yuan"],
    food: "Zongzi (sticky rice dumplings wrapped in leaves)",
    where: "Mainland China and Hong Kong", blessing: "Wishing you a safe and healthy festival!",
    clue: "Long boats race across the water.",
  },
  hksar: {
    date: "1 July",
    activities: ["Watch a flag-raising ceremony", "Join celebration events", "Learn about Hong Kong"],
    food: "There is no fixed traditional food.",
    where: "Hong Kong", blessing: "Best wishes for Hong Kong!",
    clue: "It marks the establishment of the HKSAR in 1997.",
  },
  midautumn: {
    date: "15th day of the 8th lunar month, usually in September or October; sometimes August",
    activities: ["Get together with family", "Look at the moon", "Carry lanterns"],
    food: "Mooncakes and pomelos",
    where: "Mainland China and Hong Kong; Hong Kong has a holiday the next day",
    blessing: "A bright moon and a happy family!",
    clue: "Families enjoy the autumn moon and share mooncakes.",
  },
  national: {
    date: "1 October",
    activities: ["Watch a flag-raising ceremony", "Put up national flags", "Join National Day events"],
    food: "There is no fixed traditional food.",
    where: "Mainland China and Hong Kong", blessing: "Best wishes for our country!",
    clue: "You can see many red national flags.",
  },
  chungyeung: {
    date: "9th day of the 9th lunar month, usually in October; sometimes September or November",
    activities: ["Walk up hills", "Look at chrysanthemums", "Remember ancestors"],
    food: "Chung Yeung cakes in some regions",
    where: "Hong Kong and Chinese communities elsewhere", blessing: "Wishing you good health!",
    clue: "People walk up hills and enjoy autumn flowers.",
  },
  halloween: {
    date: "31 October",
    activities: ["Wear fun costumes", "Carry pumpkin lanterns", "Go trick-or-treating"],
    food: "Sweets and pumpkin treats; customs vary.",
    where: "Hong Kong and many other places", blessing: "Happy Halloween!",
    clue: "Look for pumpkin lanterns, sweets and costumes.",
  },
  wintersolstice: {
    date: "Around 21 or 22 December",
    activities: ["Get together with family", "Greet older relatives", "Notice the short days and long nights"],
    food: "Family dinner and tangyuan; dumplings in parts of northern China",
    where: "Chinese families around the world", blessing: "Happy Winter Solstice! Enjoy family time!",
    clue: "In Hong Kong, it is the time of year with the shortest daylight.",
  },
  christmas: {
    date: "25 December",
    activities: ["Decorate a Christmas tree", "Exchange gifts", "Sing Christmas songs"],
    food: "Gingerbread, Christmas cake and roast turkey; customs vary.",
    where: "Hong Kong and many places around the world", blessing: "Merry Christmas!",
    clue: "Look for Christmas trees, stars and presents.",
  },
};

/** Keep stable IDs and dates for game logic, localise the existing display fields. */
export function festivalProfiles(language: FestivalLanguage): FestivalProfile[] {
  if (language === "zh") return FESTIVAL_PROFILES;
  return FESTIVAL_PROFILES.map(f => {
    const e = FESTIVAL_ENGLISH[f.id];
    return { ...f, zh: f.en, dateZh: f.dateEn, dateGuideZh: e.date,
      activities: e.activities, foodPlay: e.food, where: e.where,
      blessing: e.blessing, clue: e.clue };
  });
}
