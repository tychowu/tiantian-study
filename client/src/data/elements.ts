/**
 * 元素週期表資料（繁體中文 + English）
 * 欄位：原子序, 符號, 中文名, 英文名, 原子量, 分類, 列(row), 行(col), 小圖示, 中文小知識, 英文小知識, 中文用途, 英文用途
 * 英文句子用 `word|中文` 標註可點擊翻譯的字；未標註的字會查共用詞典。
 */

export type CategoryKey =
  | "alkali"
  | "alkaline"
  | "transition"
  | "metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export const CATEGORY_META: Record<
  CategoryKey,
  { zh: string; en: string; color: string; tint: string }
> = {
  alkali: { zh: "鹼金屬", en: "Alkali Metal", color: "#FF6B3D", tint: "#FFEDE3" },
  alkaline: { zh: "鹼土金屬", en: "Alkaline Earth", color: "#E8A13C", tint: "#FDF1DC" },
  transition: { zh: "過渡金屬", en: "Transition Metal", color: "#4E93AC", tint: "#E6F1F6" },
  metal: { zh: "其他金屬", en: "Other Metal", color: "#7FA65C", tint: "#EDF4E4" },
  metalloid: { zh: "類金屬", en: "Metalloid", color: "#9B7BB8", tint: "#F2ECF8" },
  nonmetal: { zh: "非金屬", en: "Non-metal", color: "#4FA98A", tint: "#E4F4EE" },
  halogen: { zh: "鹵素", en: "Halogen", color: "#D9705E", tint: "#FBEBE7" },
  noble: { zh: "惰性氣體", en: "Noble Gas", color: "#6C7FD1", tint: "#EBEEFB" },
  lanthanide: { zh: "鑭系", en: "Lanthanide", color: "#D07FA6", tint: "#FBE9F2" },
  actinide: { zh: "錒系", en: "Actinide", color: "#A9754F", tint: "#F5EBE2" },
};

export type ElementCategory = CategoryKey;

export type ChemElement = {
  n: number;
  sym: string;
  zh: string;
  en: string;
  mass: string;
  cat: CategoryKey;
  row: number;
  col: number;
  icon: string;
  factZh: string;
  factEn: string;
  useZh: string;
  useEn: string;
};

type Row = [
  number, string, string, string, string, CategoryKey, number, number, string, string, string, string, string,
];

const RAW: Row[] = [
  [1, "H", "氫", "Hydrogen", "1.008", "nonmetal", 1, 1, "💧", "宇宙裡最多、也最輕的元素。", "Hydrogen|氫氣 is|是 the lightest|最輕的 gas|氣體 in the universe|宇宙.", "氣球、火箭燃料", "balloons|氣球 and rocket|火箭 fuel|燃料"],
  [2, "He", "氦", "Helium", "4.003", "noble", 1, 18, "🎈", "比空氣輕又不會燃燒，很安全。", "Helium|氦 makes|讓 balloons|氣球 float|飄起來.", "氣球、潛水氣瓶", "balloons|氣球 and diving|潛水 tanks|氣瓶"],
  [3, "Li", "鋰", "Lithium", "6.94", "alkali", 2, 1, "🔋", "手機和電動車的電池都有它。", "Lithium|鋰 powers|供電 our phones|手機.", "充電電池", "rechargeable|可充電的 batteries|電池"],
  [4, "Be", "鈹", "Beryllium", "9.01", "alkaline", 2, 2, "🛩️", "又輕又硬，飛機和太空船會用到。", "It is|它是 light|輕的 and strong|堅固的.", "飛機零件", "airplane|飛機 parts|零件"],
  [5, "B", "硼", "Boron", "10.81", "metalloid", 2, 13, "🧼", "硼砂可以做出軟軟的黏土。", "Boron|硼 makes|做出 soft|軟軟的 slime|黏土.", "玻璃、清潔劑", "glass|玻璃 and soap|肥皂"],
  [6, "C", "碳", "Carbon", "12.01", "nonmetal", 2, 14, "💎", "鑽石和鉛筆芯都是碳做的。", "Diamonds|鑽石 are made of|由…做成 carbon|碳.", "鑽石、鉛筆", "diamonds|鑽石 and pencils|鉛筆"],
  [7, "N", "氮", "Nitrogen", "14.01", "nonmetal", 2, 15, "🌬️", "空氣裡最多的就是氮氣。", "Air|空氣 is mostly|大部分是 nitrogen|氮.", "肥料、冷凍", "fertilizer|肥料 and freezing|冷凍"],
  [8, "O", "氧", "Oxygen", "16.00", "nonmetal", 2, 16, "🫁", "我們呼吸需要的就是氧氣。", "We breathe|呼吸 oxygen|氧氣 every day|每天.", "呼吸、醫療", "breathing|呼吸 and medicine|醫療"],
  [9, "F", "氟", "Fluorine", "19.00", "halogen", 2, 17, "🦷", "牙膏裡有它，可以保護牙齒。", "Fluorine|氟 protects|保護 our teeth|牙齒.", "牙膏", "toothpaste|牙膏"],
  [10, "Ne", "氖", "Neon", "20.18", "noble", 2, 18, "🪧", "通電後會發出紅橙色的光。", "Neon|氖 lights|燈 glow|發光 red|紅色的.", "霓虹燈", "neon|霓虹 lights|燈"],
  [11, "Na", "鈉", "Sodium", "22.99", "alkali", 3, 1, "🧂", "和氯合起來，就是鹽巴。", "Sodium|鈉 plus|加上 chlorine|氯 makes|變成 salt|鹽.", "食鹽", "table|餐桌上的 salt|鹽"],
  [12, "Mg", "鎂", "Magnesium", "24.31", "alkaline", 3, 2, "🎆", "燃燒時會發出很亮很亮的光。", "It burns|燃燒 with a bright|明亮的 light|光.", "煙火、合金", "fireworks|煙火 and alloys|合金"],
  [13, "Al", "鋁", "Aluminium", "26.98", "metal", 3, 13, "🥫", "輕輕的，而且不容易生鏽。", "It is light|輕的 and does not rust|生鏽.", "飲料罐、門窗", "cans|罐子 and windows|窗戶"],
  [14, "Si", "矽", "Silicon", "28.09", "metalloid", 3, 14, "💻", "沙子裡有它，電腦晶片也是。", "Chips|晶片 are made from|由…製成 silicon|矽.", "晶片、玻璃", "chips|晶片 and glass|玻璃"],
  [15, "P", "磷", "Phosphorus", "30.97", "nonmetal", 3, 15, "🔥", "火柴一劃就起火，靠的就是它。", "It helps|幫助 matches|火柴 light|點燃.", "火柴、肥料", "matches|火柴 and fertilizer|肥料"],
  [16, "S", "硫", "Sulfur", "32.06", "nonmetal", 3, 16, "🥚", "黃黃的，聞起來像臭雞蛋。", "It is yellow|黃色的 and smells|聞起來 bad|臭臭的.", "橡膠、藥品", "rubber|橡膠 and medicine|藥"],
  [17, "Cl", "氯", "Chlorine", "35.45", "halogen", 3, 17, "🏊", "可以幫游泳池的水殺菌。", "It keeps|保持 pools|游泳池 clean|乾淨.", "消毒、淨水", "cleaning|清潔 water|水"],
  [18, "Ar", "氬", "Argon", "39.95", "noble", 3, 18, "💡", "躲在燈泡裡，保護燈絲。", "It protects|保護 the bulb|燈泡 inside|在裡面.", "燈泡、焊接", "light|燈 bulb|燈泡 and welding|焊接"],
  [19, "K", "鉀", "Potassium", "39.10", "alkali", 4, 1, "🍌", "香蕉裡有很多很多的鉀。", "Bananas|香蕉 are full of|充滿 potassium|鉀.", "香蕉、肥料", "bananas|香蕉 and fertilizer|肥料"],
  [20, "Ca", "鈣", "Calcium", "40.08", "alkaline", 4, 2, "🥛", "牛奶裡的鈣讓骨頭變強壯。", "Calcium|鈣 makes bones|骨頭 strong|強壯.", "牛奶、骨骼", "milk|牛奶 and bones|骨頭"],
  [21, "Sc", "鈧", "Scandium", "44.96", "transition", 4, 3, "🚲", "讓腳踏車和球棒更輕更耐用。", "It makes bikes|腳踏車 light|輕的 and tough|耐用.", "運動器材", "sports|運動 gear|器材"],
  [22, "Ti", "鈦", "Titanium", "47.87", "transition", 4, 4, "🦾", "很堅固，還能安全地放進身體。", "It is strong|堅固的 and safe|安全的 for the body|身體.", "人工關節、眼鏡", "implants|植入物 and glasses|眼鏡"],
  [23, "V", "釩", "Vanadium", "50.94", "transition", 4, 5, "🔧", "加一點點，鋼鐵就更耐撞。", "It makes steel|鋼鐵 much tougher|更堅韌.", "工具、彈簧", "tools|工具 and springs|彈簧"],
  [24, "Cr", "鉻", "Chromium", "52.00", "transition", 4, 6, "✨", "讓金屬亮晶晶，也不會生鏽。", "It makes metal|金屬 shiny|亮晶晶的.", "不鏽鋼、電鍍", "shiny|亮亮的 steel|鋼"],
  [25, "Mn", "錳", "Manganese", "54.94", "transition", 4, 7, "🪫", "乾電池裡面常常見到它。", "It works|工作 inside batteries|電池.", "電池、鋼鐵", "batteries|電池 and steel|鋼"],
  [26, "Fe", "鐵", "Iron", "55.85", "transition", 4, 8, "🧲", "磁鐵最喜歡的金屬就是鐵。", "Magnets|磁鐵 love|喜愛 iron|鐵.", "建築、鍋具", "buildings|建築 and pans|鍋子"],
  [27, "Co", "鈷", "Cobalt", "58.93", "transition", 4, 9, "🎨", "能做出很漂亮的藍色顏料。", "It makes a lovely|漂亮的 blue|藍色 color|顏色.", "藍色顏料、電池", "blue|藍色 paint|顏料 and batteries|電池"],
  [28, "Ni", "鎳", "Nickel", "58.69", "transition", 4, 10, "🪙", "硬幣裡常常含有鎳。", "Coins|硬幣 often contain|含有 nickel|鎳.", "硬幣、不鏽鋼", "coins|硬幣 and steel|鋼"],
  [29, "Cu", "銅", "Copper", "63.55", "transition", 4, 11, "🔌", "電線最愛用的金屬。", "Wires|電線 are made of|由…做成 copper|銅.", "電線、水管", "wires|電線 and pipes|水管"],
  [30, "Zn", "鋅", "Zinc", "65.38", "transition", 4, 12, "🩹", "擦在傷口上，好得更快。", "It helps cuts|傷口 heal|癒合.", "藥膏、防鏽", "ointment|藥膏 and coating|塗層"],
  [31, "Ga", "鎵", "Gallium", "69.72", "metal", 4, 13, "🌡️", "放在手心就會慢慢融化。", "It melts|融化 in your hand|手心.", "溫度計、LED", "thermometers|溫度計 and LEDs|發光二極體"],
  [32, "Ge", "鍺", "Germanium", "72.63", "metalloid", 4, 14, "📷", "紅外線鏡頭靠它看見熱。", "It helps cameras|相機 see|看見 heat|熱.", "紅外線、光纖", "infrared|紅外線 lenses|鏡頭"],
  [33, "As", "砷", "Arsenic", "74.92", "metalloid", 4, 15, "☠️", "有毒，使用時要很小心。", "It is poisonous|有毒的. Be careful|要小心!", "半導體", "semiconductors|半導體"],
  [34, "Se", "硒", "Selenium", "78.97", "nonmetal", 4, 16, "🥜", "堅果裡有一點點，對身體好。", "Nuts|堅果 contain|含有 a little|一點點 selenium|硒.", "保健食品", "healthy|健康的 food|食物"],
  [35, "Br", "溴", "Bromine", "79.90", "halogen", 4, 17, "🧪", "紅棕色的液體，味道很刺鼻。", "It is a red|紅色的 liquid|液體.", "阻燃劑、藥品", "medicine|藥 and safety|安全 gear|用品"],
  [36, "Kr", "氪", "Krypton", "83.80", "noble", 4, 18, "🔦", "強力燈泡裡的隱形幫手。", "It glows|發光 inside special|特別的 lamps|燈.", "高功率燈泡", "bright|明亮的 lamps|燈"],
  [37, "Rb", "銣", "Rubidium", "85.47", "alkali", 5, 1, "⏰", "科學家用它做出最準的時鐘。", "It makes super|超級 accurate|準確的 clocks|時鐘.", "原子鐘", "atomic|原子的 clocks|時鐘"],
  [38, "Sr", "鍶", "Strontium", "87.62", "alkaline", 5, 2, "🎇", "煙火裡的紅色就是它變的。", "It gives fireworks|煙火 a red|紅色 glow|光芒.", "煙火", "fireworks|煙火"],
  [39, "Y", "釔", "Yttrium", "88.91", "transition", 5, 3, "📺", "讓螢幕發出亮亮的顏色。", "It makes screens|螢幕 glow|發光 with color|顏色.", "螢幕、燈泡", "screens|螢幕 and lamps|燈泡"],
  [40, "Zr", "鋯", "Zirconium", "91.22", "transition", 5, 4, "💍", "像寶石一樣閃亮，也耐高溫。", "It shines|閃耀 like a gem|寶石.", "珠寶、陶瓷", "jewelry|珠寶 and ceramics|陶瓷"],
  [41, "Nb", "鈮", "Niobium", "92.91", "transition", 5, 5, "🚄", "磁浮列車的超能力金屬。", "It helps maglev|磁浮 trains|列車 float|漂浮.", "超導磁鐵", "super|超級 magnets|磁鐵"],
  [42, "Mo", "鉬", "Molybdenum", "95.95", "transition", 5, 6, "⚙️", "讓機器很熱的時候也不軟掉。", "It keeps machines|機器 strong|堅固 when hot|熱的.", "鋼鐵合金", "strong|堅固的 steel|鋼"],
  [43, "Tc", "鎝", "Technetium", "98", "transition", 5, 7, "🏥", "醫院檢查身體的好幫手。", "Doctors|醫生 use|使用它 it to scan|掃描 the body|身體.", "醫學顯影", "medical|醫療 scans|檢查"],
  [44, "Ru", "釕", "Ruthenium", "101.07", "transition", 5, 8, "💾", "讓電子零件更耐用。", "It makes electronics|電子產品 last|耐用 longer|更久.", "電子零件", "electronics|電子產品"],
  [45, "Rh", "銠", "Rhodium", "102.91", "transition", 5, 9, "🚗", "汽車排氣管裡的淨化高手。", "It cleans|淨化 car|汽車 exhaust|廢氣.", "觸媒轉化器", "car|汽車 parts|零件"],
  [46, "Pd", "鈀", "Palladium", "106.42", "transition", 5, 10, "🧽", "像海綿一樣吸住很多氣體。", "It soaks|吸收 up gas|氣體 like a sponge|海綿.", "觸媒、電子", "catalysts|觸媒 and electronics|電子產品"],
  [47, "Ag", "銀", "Silver", "107.87", "transition", 5, 11, "🥈", "導電最快，也最會反光。", "Silver|銀 carries|傳導 electricity|電 the best|最好.", "首飾、鏡子", "jewelry|珠寶 and mirrors|鏡子"],
  [48, "Cd", "鎘", "Cadmium", "112.41", "transition", 5, 12, "🖌️", "可以做出鮮豔的黃色顏料。", "Artists|藝術家 used|使用過 it for bright|鮮豔的 yellow|黃色.", "顏料、電池", "paint|顏料 and batteries|電池"],
  [49, "In", "銦", "Indium", "114.82", "metal", 5, 13, "📱", "手機螢幕摸得到，靠的就是它。", "It makes touch|觸控 screens|螢幕 work|運作.", "觸控螢幕", "touch|觸控 screens|螢幕"],
  [50, "Sn", "錫", "Tin", "118.71", "metal", 5, 14, "🧻", "錫箔紙可以用來包食物。", "Foil|錫箔紙 wraps|包起來 our food|食物.", "錫箔、焊錫", "foil|錫箔紙 and solder|焊錫"],
  [51, "Sb", "銻", "Antimony", "121.76", "metalloid", 5, 15, "🧯", "加進衣服裡，比較不容易著火。", "It slows|減慢 down fire|火.", "阻燃劑", "fire|防火 safety|安全"],
  [52, "Te", "碲", "Tellurium", "127.60", "metalloid", 5, 16, "☀️", "太陽能板裡的小幫手。", "It helps solar|太陽能 panels|板 work|運作.", "太陽能板", "solar|太陽能 panels|板"],
  [53, "I", "碘", "Iodine", "126.90", "halogen", 5, 17, "💊", "受傷時擦的藥水裡有它。", "It kills|殺死 germs|細菌 on skin|皮膚.", "消毒藥水", "medicine|藥水"],
  [54, "Xe", "氙", "Xenon", "131.29", "noble", 5, 18, "📸", "相機閃光燈用的氣體。", "It makes camera|相機 flashes|閃光 bright|明亮.", "閃光燈", "camera|相機 flashes|閃光燈"],
  [55, "Cs", "銫", "Caesium", "132.91", "alkali", 6, 1, "🕰️", "一秒有多長，由它來定義。", "It defines|定義 the second|秒.", "原子鐘", "atomic|原子的 clocks|時鐘"],
  [56, "Ba", "鋇", "Barium", "137.33", "alkaline", 6, 2, "🩻", "照 X 光時喝的白色液體。", "It helps X-rays|X光 show|看清楚 the tummy|肚子.", "X 光檢查", "X-ray|X光 tests|檢查"],
  [57, "La", "鑭", "Lanthanum", "138.91", "lanthanide", 9, 3, "🔍", "相機鏡頭裡的重要材料。", "It makes camera|相機 lenses|鏡頭 clear|清晰.", "鏡頭玻璃", "camera|相機 lenses|鏡頭"],
  [58, "Ce", "鈰", "Cerium", "140.12", "lanthanide", 9, 4, "🕯️", "打火石一擦就冒出火花。", "It makes sparks|火花 when scratched|刮到.", "打火石", "lighters|打火機"],
  [59, "Pr", "鐠", "Praseodymium", "140.91", "lanthanide", 9, 5, "🟩", "玻璃加上它會變成漂亮綠色。", "It colors|染上 glass|玻璃 green|綠色.", "玻璃染色", "green|綠色的 glass|玻璃"],
  [60, "Nd", "釹", "Neodymium", "144.24", "lanthanide", 9, 6, "🎧", "耳機裡的強力小磁鐵。", "It makes tiny|小小的 strong|強力的 magnets|磁鐵.", "耳機、馬達", "earphones|耳機 and motors|馬達"],
  [61, "Pm", "鉕", "Promethium", "145", "lanthanide", 9, 7, "🌙", "會自己發出淡淡的光。", "It glows|發光 in the dark|黑暗中.", "夜光塗料", "glow|夜光的 paint|塗料"],
  [62, "Sm", "釤", "Samarium", "150.36", "lanthanide", 9, 8, "🛰️", "太空船裡耐熱的磁鐵。", "It works|運作 in hot|很熱的 places|地方.", "太空磁鐵", "space|太空 magnets|磁鐵"],
  [63, "Eu", "銪", "Europium", "151.96", "lanthanide", 9, 9, "💶", "鈔票防偽會發出紅光。", "It helps money|鈔票 stay safe|安全.", "防偽螢光", "banknotes|鈔票"],
  [64, "Gd", "釓", "Gadolinium", "157.25", "lanthanide", 9, 10, "🩺", "讓身體檢查的照片更清楚。", "It makes body|身體 scans|檢查 clearer|更清楚.", "MRI 顯影", "medical|醫療 scans|檢查"],
  [65, "Tb", "鋱", "Terbium", "158.93", "lanthanide", 9, 11, "🟢", "讓燈泡發出綠色的光。", "It gives lamps|燈泡 a green|綠色 glow|光芒.", "綠色螢光", "green|綠色的 light|光"],
  [66, "Dy", "鏑", "Dysprosium", "162.50", "lanthanide", 9, 12, "⚡", "電動車的馬達少不了它。", "It powers|驅動 electric|電動的 cars|汽車.", "電動車", "electric|電動的 cars|汽車"],
  [67, "Ho", "鈥", "Holmium", "164.93", "lanthanide", 9, 13, "🔬", "醫生用的雷射裡有它。", "Doctors|醫生 use|使用 its laser|雷射.", "醫療雷射", "medical|醫療 lasers|雷射"],
  [68, "Er", "鉺", "Erbium", "167.26", "lanthanide", 9, 14, "📡", "網路訊號靠它跑得又遠又快。", "It carries|傳送 internet|網路 signals|訊號.", "光纖網路", "internet|網路 cables|纜線"],
  [69, "Tm", "銩", "Thulium", "168.93", "lanthanide", 9, 15, "🩻", "做成像筆一樣的小 X 光機。", "It makes small|小型 X-ray|X光 tools|工具.", "小型 X 光", "small|小型 X-ray|X光 tools|工具"],
  [70, "Yb", "鐿", "Ytterbium", "173.05", "lanthanide", 9, 16, "⏱️", "做出世界上最準的時鐘。", "It keeps|保持 time|時間 very well|很準.", "精密時鐘", "precise|精準的 clocks|時鐘"],
  [71, "Lu", "鎦", "Lutetium", "174.97", "lanthanide", 9, 17, "🪨", "又硬又稀少，用途很特別。", "It is hard|堅硬 and very rare|稀有的.", "特殊合金", "special|特別的 alloys|合金"],
  [72, "Hf", "鉿", "Hafnium", "178.49", "transition", 6, 4, "🖥️", "電腦晶片裡的絕緣小幫手。", "It helps chips|晶片 work|運作 better|更好.", "電腦晶片", "computer|電腦 chips|晶片"],
  [73, "Ta", "鉭", "Tantalum", "180.95", "transition", 6, 5, "📲", "讓手機裡的零件變得更小。", "It makes phones|手機 parts|零件 tiny|很小.", "電容器", "phone|手機 parts|零件"],
  [74, "W", "鎢", "Tungsten", "183.84", "transition", 6, 6, "💡", "熔點最高的金屬，舊燈泡的燈絲。", "It has the highest|最高的 melting|熔化 point|溫度.", "燈絲、刀具", "lamp|燈泡 filaments|燈絲"],
  [75, "Re", "錸", "Rhenium", "186.21", "transition", 6, 7, "✈️", "噴射引擎裡不怕熱的金屬。", "It stays|保持 strong|堅固 in jet|噴射 engines|引擎.", "飛機引擎", "jet|噴射 engines|引擎"],
  [76, "Os", "鋨", "Osmium", "190.23", "transition", 6, 8, "🏋️", "世界上最重的金屬之一。", "It is one of the heaviest|最重的 metals|金屬.", "鋼筆尖", "pen|鋼筆 tips|筆尖"],
  [77, "Ir", "銥", "Iridium", "192.22", "transition", 6, 9, "☄️", "恐龍滅絕的線索藏在它身上。", "It tells|告訴 us about dinosaurs|恐龍.", "火花塞", "spark|火花 plugs|火星塞"],
  [78, "Pt", "鉑", "Platinum", "195.08", "transition", 6, 10, "💍", "閃亮又穩定，永遠不變色。", "It is shiny|閃亮的 and never|從不 rusts|生鏽.", "首飾、觸媒", "jewelry|珠寶 and catalysts|觸媒"],
  [79, "Au", "金", "Gold", "196.97", "transition", 6, 11, "🏅", "黃澄澄的，永遠不會生鏽。", "Gold|金 stays|保持 shiny|閃亮 forever|永遠.", "首飾、錢幣", "jewelry|珠寶 and coins|錢幣"],
  [80, "Hg", "汞", "Mercury", "200.59", "transition", 6, 12, "🌡️", "唯一會流動的金屬。", "It is the only|唯一的 liquid|液體 metal|金屬.", "溫度計", "thermometers|溫度計"],
  [81, "Tl", "鉈", "Thallium", "204.38", "metal", 6, 13, "🚫", "有毒，生活中要盡量避開。", "It is dangerous|危險的. Keep|保持 away|遠離.", "（有毒）", "dangerous|危險的"],
  [82, "Pb", "鉛", "Lead", "207.20", "metal", 6, 14, "🛡️", "很重，可以擋住 X 光。", "It blocks|擋住 X-rays|X光.", "電池、防護", "batteries|電池 and shields|防護罩"],
  [83, "Bi", "鉍", "Bismuth", "208.98", "metal", 6, 15, "🌈", "結晶會出現漂亮的彩虹色。", "Its crystals|結晶 look like rainbows|彩虹.", "藥品、合金", "medicine|藥 and alloys|合金"],
  [84, "Po", "釙", "Polonium", "209", "metal", 6, 16, "⚛️", "居禮夫人發現的元素。", "Marie|瑪麗 Curie|居禮夫人 found|發現了 it.", "（放射性）", "radioactive|有放射性的"],
  [85, "At", "砈", "Astatine", "210", "halogen", 6, 17, "🧬", "地球上最稀有的元素之一。", "It is the rarest|最稀有的 element|元素 on Earth|地球.", "（極稀有）", "rare|稀有的"],
  [86, "Rn", "氡", "Radon", "222", "noble", 6, 18, "🏠", "會從土壤悄悄跑進房子裡。", "It can|可能 enter|進入 houses|房子 from soil|泥土.", "（放射性）", "radioactive|有放射性的"],
  [87, "Fr", "鍅", "Francium", "223", "alkali", 7, 1, "⚡", "很不穩定，只能存在一下子。", "It lasts|存在 only|只 a moment|一下子.", "（研究用）", "for research|研究用 only|而已"],
  [88, "Ra", "鐳", "Radium", "226", "alkaline", 7, 2, "☢️", "以前的夜光手錶會用到它。", "It glowed|發過光 on old|舊的 watches|手錶.", "（放射性）", "radioactive|有放射性的"],
  [89, "Ac", "錒", "Actinium", "227", "actinide", 10, 3, "🔬", "會發出看不見的光。", "It glows|發光 in the dark|黑暗中.", "（研究用）", "for research|研究用 only|而已"],
  [90, "Th", "釷", "Thorium", "232.04", "actinide", 10, 4, "🕯️", "可能是未來的核燃料。", "It may|可能 power|供電 the future|未來.", "核能研究", "nuclear|核能 research|研究"],
  [91, "Pa", "鏷", "Protactinium", "231.04", "actinide", 10, 5, "🧪", "非常稀少又昂貴。", "It is very rare|稀有的 and costly|昂貴的.", "（研究用）", "for research|研究用 only|而已"],
  [92, "U", "鈾", "Uranium", "238.03", "actinide", 10, 6, "⚛️", "核電廠發電用的燃料。", "It powers|供電 nuclear|核能 plants|發電廠.", "核燃料", "nuclear|核能 fuel|燃料"],
  [93, "Np", "錼", "Neptunium", "237", "actinide", 10, 7, "🪐", "用海王星的名字命名。", "It is named|命名 after Neptune|海王星.", "（研究用）", "for research|研究用 only|而已"],
  [94, "Pu", "鈽", "Plutonium", "244", "actinide", 10, 8, "🚀", "太空船的電力來源。", "It powers|供電 space|太空 ships|太空船.", "太空電力", "space|太空的 power|電力"],
  [95, "Am", "鋂", "Americium", "243", "actinide", 10, 9, "🚨", "家裡的煙霧偵測器有它。", "It is inside|在…裡面 smoke|煙霧 alarms|警報器.", "煙霧偵測器", "smoke|煙霧 alarms|警報器"],
  [96, "Cm", "鋦", "Curium", "247", "actinide", 10, 10, "🔥", "用居禮夫婦的名字命名。", "It honors|紀念 the Curies|居禮夫婦.", "（研究用）", "for research|研究用 only|而已"],
  [97, "Bk", "鉳", "Berkelium", "247", "actinide", 10, 11, "🏙️", "用美國一座城市命名。", "It is named|命名 after a city|城市.", "（研究用）", "for research|研究用 only|而已"],
  [98, "Cf", "鉲", "Californium", "251", "actinide", 10, 12, "🛠️", "可以幫忙找地底下的礦。", "It helps find|尋找 oil|石油 and metal|金屬.", "（研究用）", "for research|研究用 only|而已"],
  [99, "Es", "鎄", "Einsteinium", "252", "actinide", 10, 13, "🧠", "用愛因斯坦的名字命名。", "It honors|紀念 Albert|阿爾伯特 Einstein|愛因斯坦.", "（研究用）", "for research|研究用 only|而已"],
  [100, "Fm", "鐨", "Fermium", "257", "actinide", 10, 14, "🔬", "用科學家費米的名字命名。", "It honors|紀念 Enrico|恩里科 Fermi|費米.", "（研究用）", "for research|研究用 only|而已"],
  [101, "Md", "鍆", "Mendelevium", "258", "actinide", 10, 15, "📜", "紀念週期表的發明人。", "It honors|紀念 Mendeleev|門得列夫 who made|做了 this table|週期表.", "（研究用）", "for research|研究用 only|而已"],
  [102, "No", "鍩", "Nobelium", "259", "actinide", 10, 16, "🏆", "用諾貝爾獎的名字命名。", "It is named|命名 after the Nobel|諾貝爾 Prize|獎.", "（研究用）", "for research|研究用 only|而已"],
  [103, "Lr", "鐒", "Lawrencium", "266", "actinide", 10, 17, "⚗️", "用加速器發明人的名字命名。", "It honors|紀念 Ernest|歐內斯特 Lawrence|勞倫斯.", "（研究用）", "for research|研究用 only|而已"],
  [104, "Rf", "鑪", "Rutherfordium", "267", "transition", 7, 4, "⚛️", "用拉塞福的名字命名。", "It honors|紀念 Ernest|歐內斯特 Rutherford|拉塞福.", "（研究用）", "for research|研究用 only|而已"],
  [105, "Db", "𨧀", "Dubnium", "268", "transition", 7, 5, "🧪", "在俄國的實驗室做出來。", "It was made|被製造 in Russia|俄羅斯.", "（研究用）", "for research|研究用 only|而已"],
  [106, "Sg", "𨭎", "Seaborgium", "269", "transition", 7, 6, "🧑‍🔬", "用科學家西博格的名字命名。", "It honors|紀念 Glenn|格倫 Seaborg|西博格.", "（研究用）", "for research|研究用 only|而已"],
  [107, "Bh", "𨨏", "Bohrium", "270", "transition", 7, 7, "🔬", "德國的實驗室做出來。", "It was made|被製造 in Germany|德國.", "（研究用）", "for research|研究用 only|而已"],
  [108, "Hs", "𨭆", "Hassium", "269", "transition", 7, 8, "🧪", "用德國一個邦的名字命名。", "It is named|命名 after a German|德國的 state|邦.", "（研究用）", "for research|研究用 only|而已"],
  [109, "Mt", "鿏", "Meitnerium", "278", "transition", 7, 9, "👩‍🔬", "紀念女科學家邁特納。", "It honors|紀念 Lise|莉澤 Meitner|邁特納.", "（研究用）", "for research|研究用 only|而已"],
  [110, "Ds", "鐽", "Darmstadtium", "281", "transition", 7, 10, "🏭", "用德國城市的名字命名。", "It is named|命名 after a city|城市 in Germany|德國.", "（研究用）", "for research|研究用 only|而已"],
  [111, "Rg", "錀", "Roentgenium", "282", "transition", 7, 11, "🩻", "紀念發現 X 光的科學家。", "It honors|紀念 the man|這個人 who found|發現 X-rays|X光.", "（研究用）", "for research|研究用 only|而已"],
  [112, "Cn", "鎶", "Copernicium", "285", "transition", 7, 12, "🌌", "用天文學家哥白尼的名字命名。", "It honors|紀念 Copernicus|哥白尼 who studied|研究 stars|星星.", "（研究用）", "for research|研究用 only|而已"],
  [113, "Nh", "鉨", "Nihonium", "286", "metal", 7, 13, "🇯🇵", "日本科學家做出來的元素。", "It was made|被製造 in Japan|日本.", "（研究用）", "for research|研究用 only|而已"],
  [114, "Fl", "鈇", "Flerovium", "289", "metal", 7, 14, "🧊", "俄國的實驗室做出來。", "It was made|被製造 by Russian|俄羅斯的 scientists|科學家.", "（研究用）", "for research|研究用 only|而已"],
  [115, "Mc", "鏌", "Moscovium", "290", "metal", 7, 15, "🏛️", "用莫斯科的名字命名。", "It is named|命名 after Moscow|莫斯科.", "（研究用）", "for research|研究用 only|而已"],
  [116, "Lv", "鉝", "Livermorium", "293", "metal", 7, 16, "🔬", "用美國實驗室的名字命名。", "It is named|命名 after a US|美國的 lab|實驗室.", "（研究用）", "for research|研究用 only|而已"],
  [117, "Ts", "鿬", "Tennessine", "294", "halogen", 7, 17, "🎸", "用美國一個州的名字命名。", "It is named|命名 after a US|美國的 state|州.", "（研究用）", "for research|研究用 only|而已"],
  [118, "Og", "鿫", "Oganesson", "294", "noble", 7, 18, "🧑‍🔬", "用科學家奧加涅相的名字命名。", "It honors|紀念 Yuri|尤里 Oganessian|奧加涅相.", "（研究用）", "for research|研究用 only|而已"],
];

export const ELEMENTS: ChemElement[] = RAW.map(
  ([n, sym, zh, en, mass, cat, row, col, icon, factZh, factEn, useZh, useEn]) => ({
    n, sym, zh, en, mass, cat, row, col, icon, factZh, factEn, useZh, useEn,
  }),
);

export const ELEMENT_BY_NUMBER = new Map(ELEMENTS.map((item) => [item.n, item]));

export const CATEGORY_ORDER: CategoryKey[] = [
  "alkali",
  "alkaline",
  "transition",
  "metal",
  "metalloid",
  "nonmetal",
  "halogen",
  "noble",
  "lanthanide",
  "actinide",
];

/** 週期表網格：第 9、10 列是拉出來的鑭系與錒系。 */
export const GRID_ROWS = 10;
export const GRID_COLS = 18;
