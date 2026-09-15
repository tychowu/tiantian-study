/**
 * 元素小知識的英文三連句（每個元素三句，與中文小知識內容不重複）。
 *
 * 句子用 `word|中文` 標註可點擊翻譯＋發音；未標註的詞會查共用詞典（glossary）。
 * 由腳本掃描本檔案自動把標註詞補進詞典。
 */

export const FACT_EN: Record<number, string[]> = {
  1: [
    "The Sun|太陽 is a giant|巨大的 ball|球 of hydrogen|氫氣.",
    "Water|水 is made|組成 of hydrogen|氫 and oxygen|氧.",
    "Rockets|火箭 burn|燃燒 hydrogen|氫 to fly|飛 into space|太空.",
  ],
  2: [
    "Your voice|聲音 sounds|聽起來 funny|有趣 when you breathe|吸入 helium|氦氣.",
    "Helium|氦氣 was found|被發現 on the Sun|太陽 before Earth|地球.",
    "Party|派對 balloons|氣球 float|飄 because of helium|氦氣.",
  ],
  3: [
    "Lithium|鋰 is inside|在裡面 the battery|電池 of your toys|玩具.",
    "It is so light|很輕 that it floats|會浮 on oil|油.",
    "Some|有些 drinks|飲料 once|曾經 used|用 lithium|鋰 as medicine|藥.",
  ],
  4: [
    "Beryllium|鈹 is light|輕 but stronger|更硬 than steel|鋼.",
    "Space telescopes|太空望遠鏡 use|用 beryllium|鈹 mirrors|鏡子.",
    "Its|它的 crystals|晶體 can sparkle|閃爍 like little|小小的 windows|窗.",
  ],
  5: [
    "Boron|硼 helps|幫助 make glass|玻璃 that hates|不怕 heat|熱.",
    "Your laundry|洗衣粉 has boron|硼 inside|在裡面.",
    "Plants|植物 need|需要 a tiny|一點點 bit of boron|硼 to grow|長大.",
  ],
  6: [
    "Pencil|鉛筆 lead|筆芯 is not lead|鉛, it is carbon|碳.",
    "Coal|煤炭 and sugar|糖 are full|充滿 of carbon|碳.",
    "Carbon|碳 atoms|原子 can stack|堆疊 into diamonds|鑽石.",
  ],
  7: [
    "The air|空氣 you breathe|呼吸 is mostly|大部分 nitrogen|氮氣.",
    "Nitrogen|氮氣 helps|幫助 plants|植物 grow|生長 big|高大 and green|翠綠.",
    "Lightning|閃電 makes the rain|雨水 full|充滿 of nitrogen|氮.",
  ],
  8: [
    "Fish|魚 use gills|鰓 to take|取得 oxygen|氧 from water|水.",
    "Fire|火焰 needs|需要 oxygen|氧 to keep burning|繼續燒.",
    "Ozone|臭氧 high above|在高空 protects|保護 your skin|皮膚.",
  ],
  9: [
    "Fluorine|氟 keeps|讓 your teeth|牙齒 strong|強壯 and white|潔白.",
    "It is the most|最 hungry|活潑 element|元素 — it grabs|搶 electrons|電子.",
    "Non-stick|不沾鍋 pans|平底鍋 are coated|塗著 fluorine|氟 plastic|塑膠.",
  ],
  10: [
    "Neon|氖 lights|點亮 the signs|招牌 of big cities|大城市.",
    "Neon|氖 glows|發光 red-orange|橘紅色 in glass tubes|玻璃管.",
    "It was trapped|被封在 old air|舊空氣 for a hundred|一百 years|年.",
  ],
  11: [
    "Salt|鹽 is sodium|鈉 holding hands|牽著 with chlorine|氯.",
    "A cut|切 sodium|鈉 into water|水 makes a loud|大聲 boom|爆炸.",
    "Street lamps|路燈 glow|發光 yellow|黃色 from sodium|鈉.",
  ],
  12: [
    "Fireworks|煙火 use magnesium|鎂 to shine|閃 super|超 bright|亮.",
    "Chlorophyll|葉綠素 in leaves|葉子 has a magnesium|鎂 atom|原子.",
    "Magnesium|鎂 helps|幫助 your bones|骨骼 stay|保持 strong|強壯.",
  ],
  13: [
    "Aluminium|鋁 foil|鋁箔紙 wraps|包住 your sandwich|三明治.",
    "Airplanes|飛機 are built|建造 from light|輕 aluminium|鋁.",
    "A foil|鋁箔 ball|球 can reflect|反射 light|光 like a mirror|鏡子.",
  ],
  14: [
    "Sand|沙子 on the beach|海灘 is mostly|大部分 silicon|矽.",
    "Computer|電腦 chips|晶片 are carved|刻出 from silicon|矽.",
    "Glass|玻璃 windows|窗 are frozen|凝固的 silicon|矽.",
  ],
  15: [
    "Match|火柴 heads|頭 once|曾經 used|用 phosphorus|磷 to catch fire|點火.",
    "Your bones|骨骼 and teeth|牙齒 store|儲存 phosphorus|磷.",
    "Some|有些 pond|池塘 water glows|發光 from phosphorus|磷-like things|東西.",
  ],
  16: [
    "Rotten|臭 eggs|蛋 smell|聞起來 like sulfur|硫.",
    "Sulfur|硫 makes yellow|黃色 crystals|晶體 near|在附近 volcanoes|火山.",
    "Gunpowder|火藥 mixes|混合 sulfur|硫 with charcoal|木炭.",
  ],
  17: [
    "Swimming pools|游泳池 use chlorine|氯 to kill|殺 germs|細菌.",
    "Chlorine|氯 is a green|綠色 gas|氣體 with a sharp|刺鼻 smell|氣味.",
    "Your table salt|食鹽 is half|一半 chlorine|氯.",
  ],
  18: [
    "Argon|氬 fills|填充 light bulbs|燈泡 so they last|耐用 longer|更久.",
    "It hides|藏在 the air|空氣 and never|從不 reacts|反應.",
    "Double|雙層 windows|窗 are filled|灌滿 with argon|氬.",
  ],
  19: [
    "Bananas|香蕉 are famous|有名 for potassium|鉀.",
    "Potassium|鉀 helps|幫助 your muscles|肌肉 move|動起來.",
    "It burns|燃燒 with a lilac|淡紫色 flame|火焰.",
  ],
  20: [
    "Chalk|粉筆 and seashells|貝殼 are made of calcium|鈣.",
    "Milk|牛奶 gives|提供 you calcium|鈣 for strong bones|強健骨骼.",
    "Calcium|鈣 makes your heart|心臟 beat|跳動 steady|平穩.",
  ],
  21: [
    "Scandium|鈧 makes bike|腳踏車 frames|車架 light|輕 and tough|堅固.",
    "It was found|被發現 by looking|觀察 at sunlight|陽光 first|先.",
    "Stadium|體育館 lights|燈 use|用 scandium|鈧 to glow|發亮.",
  ],
  22: [
    "Titanium|鈦 is as strong|一樣強 as steel|鋼 but much lighter|輕得多.",
    "Rockets|火箭 and submarines|潛水艇 wear|用 titanium|鈦 armor|外殼.",
    "Its|它的 white paint|白漆 colors|著色 paper|紙 and toothpaste|牙膏.",
  ],
  23: [
    "Vanadium|釩 makes sword|劍 blades|刃 springy|有彈性.",
    "Some|有些 sea|海洋 animals|動物 have vanadium|釩 blood|血液.",
    "It gives|賦予 steel|鋼 tools|工具 extra|額外 strength|力量.",
  ],
  24: [
    "Rubies|紅寶石 get their red|紅色 from chromium|鉻.",
    "Emeralds|祖母綠 are beryl|綠柱石 with chromium|鉻 inside|在裡面.",
    "Chromium|鉻 keeps|讓 bike|腳踏車 handlebars|把手 from rusting|生鏽.",
  ],
  25: [
    "Manganese|錳 helps|幫助 steel|鋼 armor|盔甲 knights|騎士 once|曾經 wore|穿.",
    "Caves|洞穴 are painted|畫滿 with manganese|錳 by old painters|古人.",
    "Your body|身體 uses|用 it in tiny|微量 amounts|份量.",
  ],
  26: [
    "Earth's|地球 core|地核 is a giant|巨大 iron|鐵 ball|球.",
    "Blood|血液 gets its red|紅色 from iron|鐵.",
    "Meteorites|隕石 are often|常常 chunks|塊 of iron|鐵.",
  ],
  27: [
    "Cobalt|鈷 makes glass|玻璃 a deep|深 blue|寶藍色.",
    "Magnets|磁鐵 love|喜歡 cobalt|鈷 inside|在裡面.",
    "Super|超 strong magnets|磁鐵 mix|混合 cobalt|鈷 and samarium|釤.",
  ],
  28: [
    "A five|伍 cent|分 coin|硬幣 in America|美國 is called|叫做 a nickel|鎳幣.",
    "Nickel|鎳 keeps|讓 spoons|湯匙 shiny|閃亮 and rust-free|不生鏽.",
    "Earth's|地球 center|中心 has a nickel|鎳 and iron|鐵 heart|核心.",
  ],
  29: [
    "The Statue|雕像 of Liberty|自由 is copper|銅 turned green|變綠.",
    "Copper|銅 wires|電線 carry|輸送 electricity|電 into your home|家.",
    "A penny|壹分銅幣 is mostly|大部分 copper|銅.",
  ],
  30: [
    "Zinc|鋅 coats|包著 nails|釘子 so rain|雨水 cannot rust|生鏽 them.",
    "Sunscreen|防曬乳 uses|用 zinc|鋅 to block|擋 sunshine|陽光.",
    "Your body|身體 needs|需要 zinc|鋅 to heal|癒合 cuts|傷口.",
  ],
  31: [
    "Gallium|鎵 melts|熔化 in your warm|溫暖 hand|手.",
    "LED|燈 lamps|燈 glow|發光 thanks to|多虧 gallium|鎵.",
    "It was a mystery|謎 that a fortune-teller|算命師 once|曾經 guessed|猜中.",
  ],
  32: [
    "Germanium|鍺 was the first|第一 transistor|電晶體 metal|金屬.",
    "Some|有些 special|特殊 glasses|玻璃 carry|含 germanium|鍺.",
    "It hides|藏在 coal|煤炭 dust|灰塵 in tiny|微量 bits|份量.",
  ],
  33: [
    "Old wallpaper|舊壁紙 once|曾經 used|用 arsenic|砷 green|綠色 paint|顏料.",
    "Arsenic|砷 was a famous|著名 poison|毒藥 in old stories|故事.",
    "Special|特殊 chips|晶片 use|用 a tiny|一點點 bit of it|它.",
  ],
  34: [
    "Shampoo|洗髮精 sometimes|有時 uses|用 selenium|硒 to fix|治 dandruff|頭皮屑.",
    "Selenium|硒 helps|幫助 photocells|光電池 read|讀 light|光.",
    "Soil|土壤 has tiny|微量 selenium|硒 for plants|植物.",
  ],
  35: [
    "Bromine|溴 is one of the only|唯一 liquid|液態 elements|元素.",
    "It smells|聞起來 strong|刺鼻 — its name|名字 means|意思是 stink|惡臭.",
    "Old cameras|舊相機 film|底片 used|用 bromine|溴.",
  ],
  36: [
    "Krypton|氪 once|曾經 defined|定義 the meter|公尺.",
    "Camera|相機 flashes|閃光燈 used|用 krypton|氪 gas|氣體.",
    "It hides|藏在 the air|空氣, shy|害羞 and rare|稀有.",
  ],
  37: [
    "Rubidium|銣 atomic clocks|原子鐘 keep|保持 GPS|定位 on time|準時.",
    "It explodes|爆炸 in water|水 like its cousin|親戚 sodium|鈉.",
    "Its|它的 name|名字 comes from|來自 a ruby|紅寶石 red line|紅線 in light|光.",
  ],
  38: [
    "Red|紅色 fireworks|煙火 glow|發亮 from strontium|鍶.",
    "Strontium|鍶 helps|幫助 bones|骨骼 stay|保持 strong|強壯.",
    "It was found|被發現 in a Scottish|蘇格蘭 village|村庄 mine|礦坑.",
  ],
  39: [
    "Yttrium|釔 comes from|來自 one Swedish|瑞典 village|村莊.",
    "White|白色 LED|燈 lamps|燈 use|用 yttrium|釔 powder|粉末.",
    "Superconductors|超導體 need|需要 yttrium|釔 to work|運作.",
  ],
  40: [
    "Zirconium|鋯 gems|寶石 look like|像 diamonds|鑽石.",
    "Nuclear|核能 plants|電廠 clad|包覆 fuel|燃料 rods|棒 with zirconium|鋯.",
    "It shrugs|不怕 off acids|酸 and heat|高溫.",
  ],
  41: [
    "Niobium|鈳 makes MRI|磁振造影 machines|機器 superconduct|超導.",
    "Jewelry|首飾 made of niobium|鈳 can be many|多種 colors|顏色.",
    "It was once|曾經 named|命名 after|紀念 a Greek|希臘 princess|公主.",
  ],
  42: [
    "Molybdenum|鉬 makes sword|寶劍 steel|鋼 super|超 hard|堅硬.",
    "Enzymes|酵素 in your body|身體 need|需要 molybdenum|鉬.",
    "It was mistaken|被誤認 for lead|鉛 for centuries|好幾世紀.",
  ],
  43: [
    "Technetium|鎝 was the first|第一 man-made|人造 element|元素.",
    "Doctors|醫生 use|用 it to take|拍攝 pictures|影像 inside you|你體內.",
    "It slowly|慢慢地 fades|衰變 away|消失 over years|數年.",
  ],
  44: [
    "Ruthenium|釕 makes electrical|電子 contacts|接點 last|耐用 longer|更久.",
    "It was found|被發現 in Russian|俄羅斯 ore|礦石.",
    "Fountain|鋼筆 pen tips|筆尖 once|曾經 wore|鑲 ruthenium|釕.",
  ],
  45: [
    "Rhodium|銠 makes car|汽車 exhaust|排氣 cleaner|乾淨.",
    "It is one of the priciest|最貴 metals|金屬 on Earth|地球.",
    "White gold|白K金 is gold|金 plated|鍍 with rhodium|銠.",
  ],
  46: [
    "Palladium|鈀 is named|命名 after|紀念 an asteroid|小行星.",
    "It cleans|淨化 car|汽車 fumes|廢氣 like a filter|濾網.",
    "Some|有些 jewelry|首飾 is pure|純 palladium|鈀.",
  ],
  47: [
    "Mirrors|鏡子 are backed|鍍上 with silver|銀.",
    "Silver|銀 kills|殺 germs|細菌 — old milk|牛奶 pots|壺 used|用它.",
    "Photography|攝影 film|底片 once|曾經 loved|愛用 silver|銀.",
  ],
  48: [
    "Cadmium|鎘 makes paint|顏料 bright|鮮豔 yellow|黃色.",
    "Old batteries|舊電池 were made of cadmium|鎘 and nickel|鎳.",
    "It hides|藏在 zinc|鋅 ore|礦石 and is toxic|有毒.",
  ],
  49: [
    "Touch|觸控 screens|螢幕 are made with indium|銦.",
    "Indium|銦 squeaks|吱吱叫 when you bend|彎 it.",
    "It was named|命名 after|紀念 the indigo|靛藍 line|光譜線 in its light|光.",
  ],
  50: [
    "Tin|錫 cans|罐頭 are steel|鋼 wearing|穿著 a tin|錫 coat|外衣.",
    "Bend|彎 a tin|錫 rod|棒 and it crackles|喀喀响 — tin|錫 cry|鳴叫.",
    "Bronze|青銅 is copper|銅 mixed|混合 with tin|錫.",
  ],
  51: [
    "Antimony|銻 was used|被用 by Egyptians|埃及人 as eye|眼影 makeup|化妝品.",
    "It makes flame|火焰 retardants|阻燃劑 for sofas|沙發.",
    "Its symbol|符號 Sb|銻 comes from|來自 Greek|希臘 words|字.",
  ],
  52: [
    "Tellurium|碲 is rarer|比...更稀有 than gold|金 in Earth's|地殼 crust|地殼.",
    "It gives|讓 garlic|蒜 breath|口氣 to people|人 who touch|碰 it.",
    "Solar|太陽能 panels|板 use|用 cadmium|鎘 tellurium|碲.",
  ],
  53: [
    "Your thyroid|甲狀腺 needs|需要 a pinch|一點碘 of iodine|碘.",
    "Iodine|碘 turns|變 purple|紫色 when it heats|受熱 up.",
    "Seaweed|海藻 is full|富含 of iodine|碘.",
  ],
  54: [
    "Xenon|氙 lights|點亮 camera|相機 flashes|閃光 and lighthouses|燈塔.",
    "It is used|被用 as a gentle|溫和 anesthetic|麻醉劑.",
    "Xenon|氙 ion|離子 engines|引擎 push|推進 spacecraft|太空船.",
  ],
  55: [
    "Caesium|銫 atomic clocks|原子鐘 define|定義 the second|秒.",
    "It melts|熔化 in your hand|手 like warm|溫的 butter|奶油.",
    "It explodes|爆炸 in water|水 even|即使 more|更 than sodium|鈉.",
  ],
  56: [
    "Barium|鋇 makes firework|煙火 skies|夜空 green|綠色.",
    "Doctors|醫生 use|用 barium|鋇 milkshake|顯影劑 for X-ray|X光 photos|拍攝.",
    "Its|它的 name|名字 means|意思是 heavy|重的 in Greek|希臘語.",
  ],
  57: [
    "Lanthanum|鑭 makes camera|相機 lenses|鏡头 crystal|晶瑩 clear|清澈.",
    "Hybrid|油電車 car|汽車 batteries|電池 use|用 lanthanum|鑭.",
    "It hides|藏在 mischmetal|混合稀土 for lighter|打火機 flints|火石.",
  ],
  58: [
    "Cerium|鈰 sparks|點火 in every|每個 lighter|打火機.",
    "It polishes|拋光 glass|玻璃 to a mirror|鏡面 shine|光亮.",
    "It is the most|最 common|常見 rare|稀土 earth|元素 in crust|地殼.",
  ],
  59: [
    "Praseodymium|鐠 colors|染 welder|焊工 goggles|護目鏡 green|綠色.",
    "It makes strong|強力 magnets|磁鐵 with neodymium|釹.",
    "Its|它的 name|名字 means|意思是 green twin|綠色雙生子.",
  ],
  60: [
    "Neodymium|釹 magnets|磁鐵 lift|吸起 things|東西 many|多倍 times|倍 their weight|重量.",
    "Headphones|耳機 sound|音質 great|很棒 because of neodymium|釹.",
    "Laser|雷射 pointers|筆 once|曾經 used|用 neodymium|釹 crystals|晶體.",
  ],
  61: [
    "Promethium|鉅 glows|發光 faintly|微弱 for years|多年.",
    "It lights|照亮 watch|手錶 dials|錶面 without radium|鐳.",
    "It is the only|唯一 radioactive|放射性 lanthanide|鑭系 element|元素.",
  ],
  62: [
    "Samarium|釤 magnets|磁鐵 work|運作 in blazing|熾熱 heat|高溫.",
    "It was named|命名 after|紀念 a Russian|俄羅斯 mine|礦場 engineer|工程師.",
    "Cancer|癌症 treatments|治療 once|曾經 used|用 samarium|釤.",
  ],
  63: [
    "Europium|銪 makes money|鈔票 glow|發光 under UV|紫外線 light|光.",
    "Old TV|電視 red|紅色 glow|螢光 came from|來自 europium|銪.",
    "It is named|命名 after|紀念 the continent|大洲 Europe|歐洲.",
  ],
  64: [
    "Gadolinium|釓 helps|幫助 MRI|磁振造影 photos|影像 show|顯示 clearly|清晰.",
    "It turns|變 magnetic|磁性 near|靠近 cold|低溫.",
    "It was found|被發現 hidden|藏在 inside|裡面 another|另一 element|元素.",
  ],
  65: [
    "Terbium|鋱 makes green|綠色 phosphors|螢光粉 for screens|螢幕.",
    "Sonar|聲納 systems|系統 use|用 terbium|鋱 alloys|合金.",
    "It was found|被發現 in the same|同一 Swedish|瑞典 quarry|採石場 as yttrium|釔.",
  ],
  66: [
    "Dysprosium|鏑 keeps|讓 magnets|磁鐵 strong|強 in electric|電動 car|車 motors|馬達.",
    "Its|它的 name|名字 means|意思是 hard|難 to get|取得 in Greek|希臘語.",
    "Nuclear|核能 control rods|控制棒 use|用 dysprosium|鏑.",
  ],
  67: [
    "Holmium|鈥 has the strongest|最強 magnetic|磁力 pull|拉力 of any|任何 element|元素.",
    "It makes very|非常 strong|強 magnets|磁鐵 in labs|實驗室.",
    "Lasers|雷射 for surgery|手術 use|用 holmium|鈥.",
  ],
  68: [
    "Erbium|鉺 boosts|放大 light|光 in fiber|光纖 cables|線 across oceans|跨洋.",
    "It colors|染 glass|玻璃 a pretty|漂亮 pink|粉紅色.",
    "It was found|被發現 in one Swedish|瑞典 mine|礦坑 among|在...之中 many|多種 elements|元素.",
  ],
  69: [
    "Thulium|銩 is the rarest|最稀有 stable|穩定 rare|稀土 earth|元素.",
    "Portable|手提 X-ray|X光 machines|機 use|用 thulium|銩.",
    "It was named|命名 after|紀念 mythical|傳說 Thule|圖勒 land|之地.",
  ],
  70: [
    "Ytterbium|鐿 atomic clocks|原子鐘 are super|超 precise|精準.",
    "It hides|藏在 three|三 different|不同 crystal|晶體 forms|形態.",
    "It was named|命名 after|紀念 the village|村莊 Ytterby|伊特比.",
  ],
  71: [
    "Lutetium|鎦 is the hardest|最硬 and densest|最密 lanthanide|鑭系.",
    "PET|正子掃描 scans|掃描 use|用 lutetium|鎦 crystals|晶體.",
    "It wraps|包住 up|收尾 the lanthanide|鑭系 row|一排.",
  ],
  72: [
    "Hafnium|鉿 rods|棒 catch|吸收 neutrons|中子 in nuclear|核能 submarines|潛艇.",
    "It was found|被發現 hiding|藏 in zirconium|鋯 ore|礦石.",
    "Its|它的 name|名字 is the old|古 name|名 of Copenhagen|哥本哈根.",
  ],
  73: [
    "Tantalum|鉭 makes phone|手機 parts|零件 tiny|微小 and reliable|可靠.",
    "Body|人體 implants|植入物 use|用 tantalum|鉭 — the body|身體 ignores|不排斥 it.",
    "It was named|命名 after|紀念 Greek|希臘 king|國王 Tantalus|坦塔羅斯.",
  ],
  74: [
    "Tungsten|鎢 filaments|燈絲 made old bulbs|燈泡 glow|發光.",
    "It has the highest|最高 melting|熔點 point|溫度 of all|所有 metals|金屬.",
    "Its|它的 name|名字 in Swedish|瑞典語 means|意思是 heavy stone|重石頭.",
  ],
  75: [
    "Rhenium|錸 makes jet|噴射 engine|引擎 blades|葉片 heat-proof|耐熱.",
    "It was the last|最後 stable|穩定 element|元素 to be found|被發現.",
    "It is one of the rarest|最稀有 metals|金屬 on Earth|地球.",
  ],
  76: [
    "Osmium|鋨 is the densest|最密 natural|天然 element|元素.",
    "A litre|公升 of osmium|鋨 weighs|重 over 22|廿二 kilograms|公斤.",
    "Pen|鋼筆 tips|筆尖 once|曾經 used|用 osmium|鋨 alloy|合金.",
  ],
  77: [
    "Iridium|銥 marks|標記 the dinosaur|恐龍 extinction|滅絕 layer|地層.",
    "It is super|超 resistant|耐腐蝕 — acids|酸 give up|放棄 on it.",
    "Spark plugs|火星塞 use|用 iridium|銥 tips|尖頭.",
  ],
  78: [
    "Platinum|鉑 crowns|牙冠 hold|固定 teeth|牙齒 gently|溫和.",
    "Car|汽車 catalytic|觸媒 converters|轉換器 use|用 platinum|鉑.",
    "It is so rare|稀有 that all of it|全部 would fit|放得進 a swimming pool|泳池.",
  ],
  79: [
    "Gold|金 leaf|金箔 is beaten|捶薄 until it glows|透光.",
    "Astronaut|太空人 helmets|頭盔 get a thin|薄層 gold|金 coating|鍍層 for sun|陽光 protection|防護.",
    "Most|大多 of Earth's|地球 gold|金 sank|沉 into the core|地核 long ago|很久以前.",
  ],
  80: [
    "Thermometers|溫度計 once|曾經 used|用 silver|銀 shining mercury|汞.",
    "Mercury|汞 beads|珠 roll|滾 like tiny|小小的 mirrors|鏡子.",
    "Old lighthouses|燈塔 floated|浮著 on mercury|汞 baths|槽.",
  ],
  81: [
    "Thallium|鉈 was once|曾經 a rat|老鼠 poison|毒藥.",
    "Its|它的 flame|火焰 glows|發亮 pure|純 green|綠色.",
    "Special|特殊 glass|玻璃 for infrared|紅外線 uses|用 thallium|鉈.",
  ],
  82: [
    "Roman|羅馬 pipes|水管 were made of lead|鉛 — not safe|不安全!",
    "Pencil|鉛筆 lead|芯 is graphite|石墨, never|從不 lead|鉛.",
    "Lead|鉛 blocks|擋住 X-rays|X光 and radiation|輻射.",
  ],
  83: [
    "Bismuth|鉍 grows|長出 rainbow|彩虹 staircase|階梯 crystals|晶體.",
    "Stomach|胃 medicine|胃藥 sometimes|有時 contains|含 bismuth|鉍.",
    "It was the mystery|謎 metal|金屬 inside|在裡面 old alchemy|煉金 pots|鍋.",
  ],
  84: [
    "Marie|瑪麗 Curie|居禮 studied|研究 polonium|釙 from tons|噸 of ore|礦石.",
    "It is named|命名 after|紀念 Poland|波蘭, her homeland|祖國.",
    "It is so hot|高溫 self-heating|自發熱 it melts|熔化 nearby air|空氣.",
  ],
  85: [
    "Astatine|砈 is the rarest|最稀有 natural|天然 element|元素 on Earth|地球.",
    "Maybe|可能 less than one gram|一克 exists|存在 at any time|任何時刻.",
    "Doctors|醫生 study|研究 it for cancer|癌症 therapy|治療.",
  ],
  86: [
    "Radon|氡 seeps|滲出 from rocky|多岩 ground|地面 into basements|地下室.",
    "It is a heavy|重的 radioactive|放射性 gas|氣體.",
    "Old spas|溫泉 once|曾經 advertised|宣稱 radon|氡 as healthy|健康 — wrong|錯了!",
  ],
  87: [
    "Francium|鍅 is found|存在 for only|只有 moments|片刻 at a time|一次.",
    "It is the most|最 unstable|不穩定 of the first|前 101 elements|元素.",
    "It was discovered|被發現 in France|法國 by Marguerite|瑪格麗特 Perey|佩雷.",
  ],
  88: [
    "Radium|鐳 made old watch|手錶 hands|指針 glow|發光 green|綠色.",
    "The Radium|鐳 Girls|女孩 painted|畫錶盤 dials|錶面 with glowing|發光 paint|漆.",
    "Marie|瑪麗 Curie|居禮's notebooks|筆記 are still|仍然 radioactive|放射性 today|今天.",
  ],
  89: [
    "Actinium|錒 glows|發光 a pale|淡 blue|藍色 in the dark|黑暗.",
    "It was found|被發現 hiding|藏在 uranium|鈾 ore|礦石.",
    "Doctors|醫生 test|試驗 it for targeted|標靶 cancer|癌症 therapy|治療.",
  ],
  90: [
    "Thorium|釷 was named|命名 after|紀念 Thor|索爾, the thunder|雷神 god|神.",
    "Camping|露營 lamp|燈 mantles|紗罩 once|曾經 glowed|發光 with thorium|釷.",
    "It could|可能 power|供能 future|未來 nuclear|核能 reactors|反應爐.",
  ],
  91: [
    "Protactinium|鏷 is a ghost|幽影 between|在之間 actinium|錒 and uranium|鈾.",
    "Only|只有 about 125|一百廿五 grams|克 exists|存在 worldwide|全球.",
    "It helps|幫助 scientists|科學家 date|測定 old ocean|海洋 sediments|沉積物.",
  ],
  92: [
    "Uranium|鈾 powers|驅動 nuclear|核能 power plants|電廠.",
    "A pellet|燃料丸 the size|大小 of a fingertip|指尖 equals|等於 a ton|噸 of coal|煤.",
    "Its|它的 name|名字 comes from|來自 the planet|行星 Uranus|天王星.",
  ],
  93: [
    "Neptunium|錼 was the first|第一 element|元素 beyond|超過 uranium|鈾.",
    "It is named|命名 after|紀念 the planet|行星 Neptune|海王星.",
    "Smoke|煙霧 detectors|偵測器 once|曾經 considered|考慮 using|用 neptunium|錼.",
  ],
  94: [
    "Plutonium|鈽 powered|驅動 the Voyager|航海家 probes|探測器 leaving|離開 the solar|太陽 system|系統.",
    "It is named|命名 after|紀念 the planet|行星 Pluto|冥王星.",
    "A warm|溫熱 lump|塊 of plutonium|鈽 feels|摸起來 like a living body|活體.",
  ],
  95: [
    "Americium|鋂 sits|坐 inside|裡面 smoke|煙 alarms|警報器 at home|家.",
    "It is named|命名 after|紀念 the Americas|美洲.",
    "It was first|首 made|製成 in a Chicago|芝加哥 lab|實驗室 in 1944|一九四四.",
  ],
  96: [
    "Curium|鋦 honors|紀念 the Curies|居禮夫婦.",
    "It powers|供能 Mars|火星 rover|探測車 tools|儀器.",
    "Alpha|阿爾法 particles|粒子 from curium|鋦 glow|發光 purple|紫色.",
  ],
  97: [
    "Berkelium|鉳 is named|命名 after|紀念 Berkeley|柏克萊 city|城市.",
    "Only|只有 tiny|極小 amounts|份量 have ever|曾 been made|製成.",
    "It helped|幫助 create|合成 elements|元素 like tennessine|Ts.",
  ],
  98: [
    "Californium|鉲 is used|被用 to start|啟動 nuclear|核能 reactors|反應爐.",
    "It is so rare|稀有 it costs|值 millions|數百萬 per|每 gram|克.",
    "Gold|黃金 prospectors|探礦者 use|用它 to sniff|探測 for gold|金.",
  ],
  99: [
    "Einsteinium|鑀 was found|被發現 in the ash|灰 of a hydrogen|氫 bomb|彈 test|試爆.",
    "It is named|命名 after|紀念 Albert|阿爾伯特 Einstein|愛因斯坦.",
    "It glows|發光 blue|藍色 from its own|自身 radiation|輻射.",
  ],
  100: [
    "Fermium|鐨 is named|命名 after|紀念 Enrico|恩里科 Fermi|費米.",
    "It was also|也 found|現蹤 in bomb|核彈 debris|殘骸.",
    "It exists|存在 for only|只有 days|幾天 before fading|衰變.",
  ],
  101: [
    "Mendelevium|鍆 honors|紀念 Mendeleev|門得列夫, the table's|週期表 creator|創造者.",
    "It was made|合成 by smashing|撞擊 atoms|原子 one at a time|一次一個.",
    "Only|只有 a few|幾個 atoms|原子 were made|製成 at first|最初.",
  ],
  102: [
    "Nobelium|鍩 honors|紀念 Alfred|阿爾弗雷德 Nobel|諾貝爾 of the prizes|獎項.",
    "Its|它的 discovery|發現 was argued|爭論 over for years|多年.",
    "It was hunted|追尋 in Sweden|瑞典, Russia|俄羅斯 and America|美國.",
  ],
  103: [
    "Lawrencium|鐒 is named|命名 after|紀念 Ernest|歐內斯特 Lawrence|勞倫斯.",
    "He invented|發明 the cyclotron|迴旋加速器 that makes new elements|新元素.",
    "It closes|收尾 the actinide|錒系 row|一排.",
  ],
  104: [
    "Rutherfordium|鑪 is named|命名 after|紀念 Ernest|歐內斯特 Rutherford|拉塞福.",
    "It lives|存在 for only|只有 seconds|幾秒.",
    "America|美國 and Russia|俄羅斯 both|都 claimed|宣稱 it first|最早.",
  ],
  105: [
    "Dubnium|𨧀 is named|命名 after|紀念 Dubna|杜布納, a Russian|俄羅斯 science|科學 town|小鎮.",
    "It was made|合成 by firing|轟擊 tiny|微小 ions|離子.",
    "Its|它的 chemistry|化學 is still|仍然 a puzzle|謎題.",
  ],
  106: [
    "Seaborgium|𨭎 was named|命名 after|紀念 a living|在世 scientist|科學家 — Glenn|格倫 Seaborg|西博格.",
    "He helped|協助 discover|發現 ten|十 elements|元素.",
    "It exists|存在 for only|只有 moments|片刻.",
  ],
  107: [
    "Bohrium|𨨏 honors|紀念 Niels|尼爾斯 Bohr|波耳.",
    "He drew|繪製 the atom|原子 like a tiny|小小 solar|太陽 system|系統.",
    "It was made|合成 in Darmstadt|達姆施塔特, Germany|德國.",
  ],
  108: [
    "Hassium|𨭆 is named|命名 after|紀念 the German|德國 state|邦 of Hesse|黑森.",
    "It is one of the heaviest|最重 elements|元素 ever|曾 made|製成.",
    "It survives|存活 for only|只有 seconds|幾秒.",
  ],
  109: [
    "Meitnerium|䥑 honors|紀念 Lise|莉澤 Meitner|邁特納.",
    "She explained|解釋 nuclear|核能 fission|分裂 but was overlooked|被忽略 for the prize|獎.",
    "It was the first|第一 element|元素 named|命名 after|紀念 a woman|女性 scientist|科學家.",
  ],
  110: [
    "Darmstadtium|𨨏 is named|命名 after|紀念 Darmstadt|達姆施塔特 city|城市.",
    "It was made|製成 by smashing|對撞 nickel|鎳 and lead|鉛.",
    "It lasts|存活 less than|不到 a millisecond|一毫秒.",
  ],
  111: [
    "Roentgenium|𩬍 honors|紀念 Wilhelm|威廉 Röntgen|倫琴.",
    "He discovered|發現 X-rays|X光 and won|贏 the first|首屆 physics|物理 Nobel|諾貝爾獎.",
    "It might|可能 behave|表現 like gold|金, scientists|科學家 think|認為.",
  ],
  112: [
    "Copernicium|鎶 honors|紀念 Copernicus|哥白尼.",
    "He moved|移動 the Sun|太陽 to the center|中心 of the sky|天空 map|星圖.",
    "It may|可能 be a gas|氣體 metal|金屬 — boiling|沸騰 at room temperature|室溫.",
  ],
  113: [
    "Nihonium|鉨 is the first|第一 element|元素 found|發現 in Asia|亞洲.",
    "It is named|命名 after|紀念 Japan|日本 — Nihon|日本.",
    "A Japanese|日本 team|團隊 spent|花了 nine|九年 years|年 hunting|追尋 it.",
  ],
  114: [
    "Flerovium|鈇 is named|命名 after|紀念 the Flerov|弗廖羅夫 lab|實驗室.",
    "It sits|坐 on the island|島 of stability|穩定之島 scientists|科學家 hunt|追尋.",
    "It may|可能 act|表現 like a noble|惰性 gas|氣體.",
  ],
  115: [
    "Moscovium|鏌 is named|命名 after|紀念 Moscow|莫斯科 region|地區.",
    "It was made|合成 by firing|轟擊 calcium|鈣 at americium|鋂.",
    "It decays|衰變 away|消失 in a blink|一眨眼.",
  ],
  116: [
    "Livermorium|鉝 is named|命名 after|紀念 Livermore|利弗莫爾 lab|實驗室.",
    "It was once|曾經 nicknamed|暱稱 the smelliest|最臭 element|元素 as a joke|玩笑.",
    "Only|只有 a few|幾個 atoms|原子 have been|被 made|製成.",
  ],
  117: [
    "Tennessine|Ts honors|紀念 Tennessee|田納西 state|州.",
    "It is a halogen|鹵素 like iodine|碘 but super|超 heavy|重.",
    "It was made|製成 by a Russian|俄羅斯-American|美國 team|團隊.",
  ],
  118: [
    "Oganesson|鿫 is the heaviest|最重 element|元素 ever|曾 made|製成.",
    "It honors|紀念 Yuri|尤里 Oganessian|奧加涅相 — named|命名 while|在...時 alive|在世.",
    "It may|可能 be a reactive|活潑 solid|固體, not a lazy|惰性 gas|氣體.",
  ],
};

/** 取某元素的英文三連句。 */
export function elementFactsEn(n: number): string[] {
  return FACT_EN[n] ?? [];
}
