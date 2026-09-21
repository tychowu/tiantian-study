export type Story = {
  id: string; title: string; focus: string; emoji: string; alt: string;
  format: "single" | "four"; image: string;
  clues: { label: string; x: number; y: number; question: string }[];
  thoughts: { icon: string; question: string; starter: string }[];
  events: { icon: string; text: string }[];
  ending: string; example: string;
};
import { MORE_STORIES } from "./storiesMore";
export const STORIES: Story[] = [
  {
    id: "rain", title: "雨天的紅雨傘", focus: "人物・動作・關心", emoji: "☔",
    format: "single", image: "rain-flat",
    alt: "公園下着雨。穿黃雨衣的孩子拿着紅雨傘，穿藍衣的孩子伸出手，橘貓躲在長椅下面。",
    clues: [
      { label: "人物", x: 25, y: 45, question: "你看見誰？用衣服的顏色介紹他們。" },
      { label: "動作", x: 48, y: 52, question: "藍衣孩子的手在做甚麼？試着做出同樣的動作。" },
      { label: "小貓", x: 82, y: 74, question: "小貓在哪裡？試用『在……下面』說一句。" },
      { label: "天氣", x: 67, y: 13, question: "你從哪些地方看出下雨了？" },
    ],
    thoughts: [
      { icon: "😊", question: "藍衣孩子可能有甚麼感受？你看到甚麼線索？", starter: "我猜他可能……，因為我看到……" },
      { icon: "💬", question: "如果你是拿雨傘的孩子，你會說甚麼？", starter: "我會對朋友說：「……」" },
      { icon: "🐈", question: "小貓為甚麼躲在長椅下？還有別的可能嗎？", starter: "可能是……，也可能是……" },
    ],
    events: [{ icon: "🌧️", text: "兩個朋友在公園遇上下雨。" }, { icon: "☂️", text: "一個朋友邀請另一個一起撐傘。" }, { icon: "🏡", text: "他們一起走到有屋簷的地方避雨。" }],
    ending: "如果雨停了，他們和小貓接下來會怎樣？",
    example: "有一天，兩個朋友在公園遇上下雨。一個朋友拿着紅雨傘，另一個伸出手。我猜他想一起避雨。拿傘的朋友說：『過來一起撐傘吧！』後來，他們走到屋簷下，等雨停了再出發。這是我想像的故事。",
  },
  {
    id: "blocks", title: "倒下的積木塔", focus: "表情・原因・合作", emoji: "🧱",
    format: "single", image: "blocks-flat",
    alt: "遊戲室裡，彩色積木散落在地毯上。橙衣孩子雙手放在頭旁，另一個孩子拿着藍積木。旁邊有紅色玩具車。",
    clues: [
      { label: "表情", x: 25, y: 31, question: "橙衣孩子的眼睛、嘴巴和手是怎樣的？" },
      { label: "積木", x: 47, y: 70, question: "積木在哪裡？它們有甚麼顏色和形狀？" },
      { label: "朋友", x: 78, y: 42, question: "另一個孩子手裡拿着甚麼？正在看哪裡？" },
      { label: "小車", x: 12, y: 83, question: "小車在積木旁邊。只看這張圖，能確定是小車撞倒的嗎？" },
    ],
    thoughts: [
      { icon: "🤔", question: "積木為甚麼倒了？想出兩種可能。", starter: "可能是……；另一個可能是……" },
      { icon: "💛", question: "如果朋友不開心，你會怎樣說？", starter: "我會說：「……」" },
      { icon: "🤝", question: "兩個人可以怎樣一起解決？", starter: "我們可以先……，再……" },
    ],
    events: [{ icon: "🏗️", text: "兩個朋友一起搭積木塔。" }, { icon: "💥", text: "積木塔倒了，他們停下來看一看。" }, { icon: "🤝", text: "他們商量方法，一起重新搭建。" }],
    ending: "他們會搭回高塔，還是變成一座橋？你來決定！",
    example: "兩個朋友在遊戲室搭積木。忽然，積木塔倒了，橙衣孩子張大嘴巴。我猜他很驚訝，但圖中沒有告訴我們塔為甚麼倒下。朋友說：『我們一起再試試！』後來，他們把底部搭寬，做出一座新的城堡。這是我編的其中一個版本。",
  },
  {
    id: "seed", title: "小芽長大了", focus: "四格・先後・變化", emoji: "🌱",
    format: "four", image: "seed-four",
    alt: "一頁四格，從左上開始。第一格女孩把種子放進花盆；第二格她給泥土澆水；第三格她發現長出了小芽；第四格她把小芽畫在紙上，小貓在旁邊看。",
    clues: [
      { label: "第一格", x: 5, y: 7, question: "先看左上角。女孩把甚麼放進花盆？試用『起初』開頭。" },
      { label: "第二格", x: 55, y: 7, question: "再看右上角。女孩正在做甚麼？這時泥土上有小芽嗎？" },
      { label: "第三格", x: 5, y: 57, question: "接着看左下角。花盆裡有甚麼變化？女孩的表情怎樣？" },
      { label: "第四格", x: 55, y: 57, question: "最後看右下角。女孩怎樣記下小芽的樣子？" },
    ],
    thoughts: [
      { icon: "⏮️", question: "比較第二格和第三格。中間可能經過多久？", starter: "我猜過了……，因為……" },
      { icon: "🔎", question: "如果想知道小芽有沒有長高，可以怎樣觀察？", starter: "我想每天……，再比較……" },
      { icon: "🐈", question: "如果小貓會說話，它想對女孩說甚麼？", starter: "在我的想像裡，小貓說：「……」" },
    ],
    events: [{ icon: "🫘", text: "女孩把種子種進泥土。" }, { icon: "💧", text: "她用水壺給泥土澆水。" }, { icon: "🌱", text: "過了一些日子，她發現小芽冒出來。" }, { icon: "✏️", text: "她把小芽畫在紙上。" }],
    ending: "過了一段時間，小芽會變成甚麼？也可以編一個奇妙版本！",
    example: "起初，女孩把種子放進花盆。接着，她拿水壺給泥土澆水。後來，綠色的小芽冒出來了！我猜她等了好些日子，所以看到小芽時特別開心。最後，她把小芽畫在紙上，小貓在旁邊看。我想她明天還會再畫一張，看看小芽有沒有長高。",
  },
  ...MORE_STORIES,
];
