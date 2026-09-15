/**
 * 元素影片（Periodic Videos 播放清單）
 *
 * 來源：https://www.youtube.com/playlist?list=PL7A1F4CF36C085DE1
 * 「All Chemical Elements in Order - Periodic Videos」，共 118 支影片，
 * 依原子序 1 → 118 排列，可直接用原子序取用。
 *
 * 資料由 yt-dlp 抓取播放清單後自動生成，勿手動編輯。
 */

export type ElementVideo = { id: string; title: string };

/** 原子序 → YouTube 影片。 */
export const ELEMENT_VIDEOS: Record<number, ElementVideo> = {
  1: { id: "6rdmpx39PRk", title: "Hydrogen - Periodic Table of Videos" }, // 氫 Hydrogen
  2: { id: "M6xZZiaLOV4", title: "Helium - Periodic Table of Videos" }, // 氦 Helium
  3: { id: "LfS10ArXTBA", title: "Lithium - Periodic Table of Videos" }, // 鋰 Lithium
  4: { id: "qy8JyQShZRA", title: "Beryllium  - Periodic Table of Videos" }, // 鈹 Beryllium
  5: { id: "JzqdHkpXuy4", title: "Boron - Periodic Table of Videos" }, // 硼 Boron
  6: { id: "QuW4_bRHbUk", title: "Carbon - Periodic Table of Videos" }, // 碳 Carbon
  7: { id: "H8XNdqA18-M", title: "Nitrogen - Periodic Table of Videos" }, // 氮 Nitrogen
  8: { id: "WuG5WTId-IY", title: "Oxygen - Periodic Table of Videos" }, // 氧 Oxygen
  9: { id: "vtWp45Eewtw", title: "Fluorine - Periodic Table of Videos" }, // 氟 Fluorine
  10: { id: "ILkvZKSVRI4", title: "Neon (new) - Periodic Table of Videos" }, // 氖 Neon
  11: { id: "7IT2I3LtlNE", title: "Sodium - Periodic Table of Videos" }, // 鈉 Sodium
  12: { id: "FKkWdizutxI", title: "Magnesium - Periodic Table of Videos" }, // 鎂 Magnesium
  13: { id: "4AhZ8503WPs", title: "Aluminium (or Aluminum) - Periodic Table of Videos" }, // 鋁 Aluminium
  14: { id: "a2aWO5cL410", title: "Silicon - Periodic Table of Videos" }, // 矽 Silicon
  15: { id: "LSYLUat03A4", title: "Phosphorus - Periodic Table of Videos" }, // 磷 Phosphorus
  16: { id: "mGMR72X8V-U", title: "Sulfur  - Periodic Table of Videos" }, // 硫 Sulfur
  17: { id: "BXCfBl4rmh0", title: "Chlorine - Periodic Table of Videos" }, // 氯 Chlorine
  18: { id: "N0Gw6-xMLlo", title: "Argon - Periodic Table of Videos" }, // 氬 Argon
  19: { id: "pPdevJTGAYY", title: "Potassium - Periodic Table of Videos" }, // 鉀 Potassium
  20: { id: "V9fuY8_ffFg", title: "Calcium - Periodic Table of Videos" }, // 鈣 Calcium
  21: { id: "gab_2a7gyLU", title: "SCANDIUM (new) - Periodic Table of Videos" }, // 鈧 Scandium
  22: { id: "MpFTQYynrc4", title: "Titanium - Periodic Table of Videos" }, // 鈦 Titanium
  23: { id: "MbCmaQzrZoc", title: "Vanadium - Periodic Table of Videos" }, // 釩 Vanadium
  24: { id: "9NPjdDS11C4", title: "Chromium - Periodic Table of Videos" }, // 鉻 Chromium
  25: { id: "uTVtBuY9Q-0", title: "Manganese - Periodic Table of Videos" }, // 錳 Manganese
  26: { id: "jZZcgnKl_Gg", title: "IRON (new video) - Periodic Table of Videos" }, // 鐵 Iron
  27: { id: "MWtL3pvGC68", title: "Cobalt - Periodic Table of Videos" }, // 鈷 Cobalt
  28: { id: "AUmoaZn9bek", title: "Nickel - Periodic Table of Videos" }, // 鎳 Nickel
  29: { id: "kop1sWzTK-I", title: "Copper - Periodic Table of Videos" }, // 銅 Copper
  30: { id: "99wPiMb-k0o", title: "Zinc - Periodic Table of Videos" }, // 鋅 Zinc
  31: { id: "N6ccRvKKwZQ", title: "Gallium (beating heart) - Periodic Table of Videos" }, // 鎵 Gallium
  32: { id: "osrKWVknkgs", title: "Germanium - Periodic Table of Videos" }, // 鍺 Germanium
  33: { id: "yD8Vz-mFHgI", title: "Arsenic - Periodic Table of Videos" }, // 砷 Arsenic
  34: { id: "IHrUtKjcAFE", title: "Selenium - Periodic Table of Videos" }, // 硒 Selenium
  35: { id: "Slt3_5upuSs", title: "Bromine - Periodic Table of Videos" }, // 溴 Bromine
  36: { id: "il4OOY7Zseg", title: "Krypton - Periodic Table of Videos" }, // 氪 Krypton
  37: { id: "0XLGopBovoI", title: "Rubidium - Periodic Table of Videos" }, // 銣 Rubidium
  38: { id: "d5ztPGrsgNQ", title: "Strontium - Periodic Table of Videos" }, // 鍶 Strontium
  39: { id: "NxbOQ1FhqdQ", title: "Yttrium - Periodic Table of Videos" }, // 釔 Yttrium
  40: { id: "gNJE2MPktvg", title: "Zirconium - Periodic Table of Videos" }, // 鋯 Zirconium
  41: { id: "2ciPAsVTq6c", title: "Niobium - Periodic Table of Videos" }, // 鈮 Niobium
  42: { id: "ZRQ3vBGskds", title: "Molybdenum - Periodic Table of Videos" }, // 鉬 Molybdenum
  43: { id: "ud5c1TVkcnU", title: "Technetium - Periodic Table of Videos" }, // 鎝 Technetium
  44: { id: "wl5ZYb0hDTc", title: "Ruthenium - Periodic Table of Videos" }, // 釕 Ruthenium
  45: { id: "PPSO5798k2I", title: "Rhodium - Periodic Table of Videos" }, // 銠 Rhodium
  46: { id: "4ALTGeqmNFM", title: "Palladium - Periodic Table of Videos" }, // 鈀 Palladium
  47: { id: "pPd5qAb4J50", title: "Silver - Periodic Table of Videos" }, // 銀 Silver
  48: { id: "boRius1DYdQ", title: "Cadmium - Periodic Table of Videos" }, // 鎘 Cadmium
  49: { id: "TviX7V-ay5I", title: "Indium - Periodic Table of Videos" }, // 銦 Indium
  50: { id: "rXZscASelkc", title: "Tin - Periodic Table of Videos" }, // 錫 Tin
  51: { id: "kcc6qNT3BoU", title: "Antimony - Periodic Table of Videos" }, // 銻 Antimony
  52: { id: "5ChFbVu4Mpk", title: "Tellurium - Periodic Table of Videos" }, // 碲 Tellurium
  53: { id: "JUBsJLRSM64", title: "Iodine - Periodic Table of Videos" }, // 碘 Iodine
  54: { id: "Ejoct_6pQ74", title: "Xenon - Periodic Table of Videos" }, // 氙 Xenon
  55: { id: "5aD6HwUE2c0", title: "Caesium or Cesium - Periodic Table of Videos" }, // 銫 Caesium
  56: { id: "9srJdQU3NOo", title: "Barium - Periodic Table of Videos" }, // 鋇 Barium
  57: { id: "Q21clW0s0B8", title: "Lanthanum - Periodic Table of Videos" }, // 鑭 Lanthanum
  58: { id: "frD3126ry8o", title: "Cerium - Periodic Table of Videos" }, // 鈰 Cerium
  59: { id: "IL06CzXF3ns", title: "Praseodymium - Periodic Table of Videos" }, // 鐠 Praseodymium
  60: { id: "PBbl-3_R3mk", title: "Neodymium - Periodic Table of Videos" }, // 釹 Neodymium
  61: { id: "HplP_MY78NQ", title: "Promethium - Periodic Table of Videos" }, // 鉕 Promethium
  62: { id: "RBTO5f8U218", title: "Samarium (new) - Periodic Table of Videos" }, // 釤 Samarium
  63: { id: "88YOmg_FUVo", title: "Europium - Periodic Table of Videos" }, // 銪 Europium
  64: { id: "YIxjFKBl5eg", title: "Gadolinium (new) - Periodic Table of Videos" }, // 釓 Gadolinium
  65: { id: "On5LjH9TQxY", title: "Terbium - Periodic Table of Videos" }, // 鋱 Terbium
  66: { id: "8TE3iRXVcmY", title: "Dysprosium (new) - Periodic Table of Videos" }, // 鏑 Dysprosium
  67: { id: "HQahtzCU0BU", title: "Holmium - Periodic Table of Videos" }, // 鈥 Holmium
  68: { id: "E-DY_RT4fJ4", title: "Erbium - Periodic Table of Videos" }, // 鉺 Erbium
  69: { id: "vS0vhYdOGMc", title: "Thulium (new) - Periodic Table of Videos" }, // 銩 Thulium
  70: { id: "H8XtiaWm5eY", title: "Ytterbium - Periodic Table of Videos" }, // 鐿 Ytterbium
  71: { id: "7wrDfRnRHqI", title: "Lutetium - Periodic Table of Videos" }, // 鎦 Lutetium
  72: { id: "Qb9f5uBKJhg", title: "Hafnium - Periodic Table of Videos" }, // 鉿 Hafnium
  73: { id: "51xFP1Yn3g0", title: "Tantalum - Periodic Table of Videos" }, // 鉭 Tantalum
  74: { id: "59ph6I0DoQE", title: "Tungsten (new) - Periodic Table of Videos" }, // 鎢 Tungsten
  75: { id: "YOmStzA2azw", title: "RHENIUM (new) - Periodic Table of Videos" }, // 錸 Rhenium
  76: { id: "AdX-T2Vv68Y", title: "Osmium - Periodic Table of Videos" }, // 鋨 Osmium
  77: { id: "cuovE4OQi2g", title: "Iridium - Periodic Table of Videos" }, // 銥 Iridium
  78: { id: "byzaoji_9kk", title: "Platinum - Periodic Table of Videos" }, // 鉑 Platinum
  79: { id: "7dF0QTzcuac", title: "Gold & Casio Watch - Periodic Table of Videos" }, // 金 Gold
  80: { id: "oL0M_6bfzkU", title: "Mercury - Periodic Table of Videos" }, // 汞 Mercury
  81: { id: "4SVhSZ-rfLM", title: "Thallium - Periodic Table of Videos" }, // 鉈 Thallium
  82: { id: "2ERfPN5JLX8", title: "Lead - Periodic Table of Videos" }, // 鉛 Lead
  83: { id: "vyIo-c7VmIM", title: "Bismuth - Periodic Table of Videos" }, // 鉍 Bismuth
  84: { id: "bbr5yWwsI1o", title: "Polonium - Periodic Table of Videos" }, // 釙 Polonium
  85: { id: "GP8jJgzEmwE", title: "Astatine - Periodic Table of Videos" }, // 砈 Astatine
  86: { id: "mTuC_LrEfbU", title: "Radon - Periodic Table of Videos" }, // 氡 Radon
  87: { id: "hpYxllgfMSg", title: "Francium - Periodic Table of Videos" }, // 鍅 Francium
  88: { id: "5_I6vj-lXNM", title: "Radium - Periodic Table of Videos" }, // 鐳 Radium
  89: { id: "rKm0ShaJNFM", title: "Actinium - Periodic Table of Videos" }, // 錒 Actinium
  90: { id: "2yZGcr0mpw0", title: "Thorium - Periodic Table of Videos" }, // 釷 Thorium
  91: { id: "bsIMMa7iEKU", title: "Protactinium - Periodic Table of Videos" }, // 鏷 Protactinium
  92: { id: "B8vVZTvJNGk", title: "Uranium  - Periodic Table of Videos" }, // 鈾 Uranium
  93: { id: "1D75B0_URbE", title: "Neptunium - Periodic Table of Videos" }, // 錼 Neptunium
  94: { id: "89UNPdNtOoE", title: "REAL PLUTONIUM" }, // 鈽 Plutonium
  95: { id: "CC-L-CITg3k", title: "Americium - Periodic Table of Videos" }, // 鋂 Americium
  96: { id: "sZobqPFNcwg", title: "Curium - Periodic Table of Videos" }, // 鋦 Curium
  97: { id: "7p1D9C1qkZY", title: "Berkelium - Periodic Table of Videos" }, // 鉳 Berkelium
  98: { id: "E0wtKOG8trE", title: "Californium - Periodic Table of Videos" }, // 鉲 Californium
  99: { id: "UdJeLlwrVUI", title: "Einsteinium - Periodic Table of Videos" }, // 鎄 Einsteinium
  100: { id: "SQhI52sqanA", title: "Fermium - Periodic Table of Videos" }, // 鐨 Fermium
  101: { id: "0JlshAo8DuE", title: "Mendelevium - Periodic Table of Videos" }, // 鍆 Mendelevium
  102: { id: "t_ZpauMxapY", title: "Nobelium - Periodic Table of Videos" }, // 鍩 Nobelium
  103: { id: "_zBsnnJOkyA", title: "Lawrencium - Periodic Table of Videos" }, // 鐒 Lawrencium
  104: { id: "dOj9ZjKnJcY", title: "Rutherfordium - Periodic Table of Videos" }, // 鑪 Rutherfordium
  105: { id: "5d4VekfRnMs", title: "Dubnium - Periodic Table of Videos" }, // 𨧀 Dubnium
  106: { id: "UWq0djr790E", title: "Seaborgium - Periodic Table of Videos" }, // 𨭎 Seaborgium
  107: { id: "okJnQIjELY4", title: "Bohrium - Periodic Table of Videos" }, // 𨨏 Bohrium
  108: { id: "u4GEVxbLego", title: "Hassium - Periodic Table of Videos" }, // 𨭆 Hassium
  109: { id: "N8VR7Qscq4k", title: "Meitnerium - Periodic Table of Videos" }, // 鿏 Meitnerium
  110: { id: "lhvMqva3-7M", title: "Darmstadtium - Periodic Table of Videos" }, // 鐽 Darmstadtium
  111: { id: "MTq1hzhCF0g", title: "Roentgenium - Periodic Table of Videos" }, // 錀 Roentgenium
  112: { id: "QHcbQfcwegY", title: "Copernicium - Periodic Table of Videos" }, // 鎶 Copernicium
  113: { id: "-HcSEKuYGM8", title: "Nihonium - Periodic Table of Videos" }, // 鉨 Nihonium
  114: { id: "5L-NNFPiRog", title: "Flerovium (NEW ELEMENT!) - Periodic Table of Videos" }, // 鈇 Flerovium
  115: { id: "ewQAJtbgr7w", title: "Moscovium - Periodic Table of Videos" }, // 鏌 Moscovium
  116: { id: "YWKlqO9niuY", title: "The Smelliest Element - Livermorium - Periodic Table of Videos" }, // 鉝 Livermorium
  117: { id: "1RGlXh9eC5E", title: "Tennessine - Periodic Table of Videos" }, // 鿬 Tennessine
  118: { id: "VMv44bIBdQI", title: "Oganesson - Periodic Table of Videos" }, // 鿫 Oganesson
};

/** 取某元素的影片，沒有就回傳 null。 */
export function elementVideo(n: number): ElementVideo | null {
  return ELEMENT_VIDEOS[n] ?? null;
}
