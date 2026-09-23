import fs from 'node:fs';
const seeds = JSON.parse(fs.readFileSync('docs/chinese-pdf-scenes.json', 'utf8'));
const positions = [[5, 7], [55, 7], [5, 57], [55, 57]];
const labels = ['第一格', '第二格', '第三格', '第四格'];
const connectors = ['起初', '接着', '後來', '最後'];
const imaginedEndings = [
  '我猜媽媽覺得很窩心。孩子可能會說：「我們一起做，你就可以休息啦！」',
  '我猜女孩很有成功感。她可能會說：「我每天都有留意它的變化呢！」',
  '我想孩子發現了錢有不同用途。他可能會說：「我想留一些，也分享一些。」',
  '我猜孩子希望牙齒舒服一點。他可能會說：「媽媽，今晚陪我刷牙好嗎？」',
  '我猜孩子鬆了一口氣。他可能會說：「幸好我先告訴媽媽，請警員幫忙。」',
  '我猜他很高興。他可能會說：「慢慢來，我也可以學會！」',
  '我猜媽媽想知道孩子哪裡不舒服。下次出門，他可能會記得看看天氣。',
  '我猜婆婆覺得心裡暖暖的。女孩可能會說：「謝謝你一直照顧我！」',
  '在這個童話裡，朋友們可能會說：「謝謝你，我們也一起想辦法吧！」',
  '我猜孩子感到被關心。他可能會說：「謝謝你們先問我需要甚麼幫忙。」',
  '我猜小烏龜很想念家人。牠可能會說：「我帶了好多路上的故事來！」',
  '我猜孩子喜歡不用趕時間的早上。他可能會說：「今晚先把書包收拾好吧。」',
  '我猜孩子不喜歡衣服濕濕的感覺。他可能會說：「下次先看看會不會下雨。」',
  '我猜老人很感激。女孩可能會想：「筆袋可以慢慢存錢買，銀包要還給失主。」',
  '我猜兄弟很驚訝。他們可能會說：「我們玩得太久，雪條都變了樣！」',
  '我猜孩子喜歡精神飽滿的感覺。他可能會說：「遊戲明天再玩，今晚先休息。」',
  '在這個童話裡，小蜘蛛可能會說：「休息一下，再換個方法試試！」',
  '我猜孩子覺得分類像找朋友。他們可能會說：「先看清楚圖案，再放進去。」',
  '我猜孩子很期待品嚐。他可能會說：「這個圓圓胖胖的，是我包的！」',
  '我猜孩子對新食物有點好奇。他可能會說：「這個是甚麼味道呢？」',
  '我猜兄弟發現一起想辦法也很好玩。他們可能會說：「今次我們輪流飛！」',
  '在這個童話裡，朋友們可能會說：「垃圾不丟進河裡，小河才更舒服。」',
  '我猜兔爺爺覺得很窩心。小兔可能會說：「你好好休息，我們輕聲陪你。」',
  '我猜孩子很想把黑板看清楚。他可能會說：「原來可以告訴大人，找人幫忙。」',
  '我猜女孩很有成功感。她可能會說：「謝謝爸爸陪我一次又一次練習！」',
  '我猜大家覺得很有趣。孩子可能會說：「火車出發，下一站是想像小鎮！」',
  '我猜媽媽很驚喜。姊妹可能會一起說：「生日快樂，這是我們做的！」',
  '我猜狐狸很感動。牠可能會說：「謝謝你們停下來陪我。」',
  '我猜孩子比開始時更有信心。他們可能會說：「謝謝支持！不方便也沒關係。」',
  '我猜孩子記住了雀鳥的動作。他可能會說：「我想把今天看到的畫下來！」',
  '我猜小狐狸想補救。牠可能會說：「對不起，下次我會先問你。」',
];
const stories = seeds.map((s, index) => ({
  id: `chinese-pdf-${s.id}`, title: s.title, emoji: s.emoji,
  focus: s.focus, format: 'four', image: `chinese-pdf-${s.id}${s.id === 'box-train' ? '-v2' : ''}`,
  sourcePages: [index * 2 + 1, index * 2 + 2],
  alt: `四格故事，依次看左上、右上、左下、右下。${s.events.map((e, i) => `${labels[i]}，${e}`).join('')}`,
  clues: s.questions.map((question, i) => ({ label: labels[i], x: positions[i][0], y: positions[i][1], question })),
  thoughts: [
    { icon: '🔎', question: s.thought, starter: '我想……，因為……' },
    { icon: '💬', question: `選一格，替${s.focus.includes('童話') ? '小動物' : '圖中的人'}說一句心裡的話。你從甚麼表情或動作想到的？`, starter: '如果我是……，我會說：「……」' },
    { icon: '🌈', question: s.ending, starter: '接下來，可能……' },
  ],
  events: s.events.map((text, i) => ({ icon: ['🌤️', '🎬', '🧩', '🌈'][i], text })),
  ending: s.ending,
  example: s.events.map((e, i) => `${connectors[i]}，${e}`).join('') + imaginedEndings[index],
}));
fs.writeFileSync('client/src/data/chinesePdfStories.json', JSON.stringify(stories, null, 2) + '\n');
console.log(`Prepared ${stories.length} stories from ${stories.length * 2} PDF pages.`);
