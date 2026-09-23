import pdfStories from "./englishPdfStories.json";

export type EnglishStory = {
  id: string; title: string; image: string; alt: string;
  category?: string;
  source?: { pdfPage: number; card: number };
  words: { text: string; x: number; y: number; sentence: string }[];
  questions: { text: string; starter: string; idea: string }[];
  model: string[];
};

const ORIGINAL_ENGLISH_STORIES: EnglishStory[] = [
  {
    id: "garden", title: "A Day in the Garden", image: "english-garden",
    alt: "A family is working in a sunny garden. Mum is planting flowers. The girl is watering the plants. Dad is holding a spade. There is a bucket beside him.",
    words: [
      { text: "garden", x: 10, y: 55, sentence: "The family is in the garden." },
      { text: "flowers", x: 23, y: 72, sentence: "Mum is planting flowers." },
      { text: "water the plants", x: 42, y: 61, sentence: "The girl is watering the plants." },
      { text: "spade", x: 72, y: 56, sentence: "Dad is holding a spade." },
      { text: "bucket", x: 94, y: 73, sentence: "There is a bucket beside Dad." },
      { text: "grass", x: 84, y: 93, sentence: "The grass is green." },
      { text: "fence", x: 39, y: 38, sentence: "There is a fence behind the family." },
      { text: "family", x: 33, y: 38, sentence: "The family is working together." },
    ],
    questions: [
      { text: "Where is the family?", starter: "The family is in the…", idea: "The family is in the garden." },
      { text: "What is the girl doing?", starter: "She is…", idea: "She is watering the plants." },
      { text: "What is Dad holding?", starter: "Dad is holding a…", idea: "Dad is holding a spade." },
      { text: "What can you see behind the family?", starter: "I can see a…", idea: "I can see a fence behind the family." },
      { text: "Do you like growing plants? Why?", starter: "I like… because… / I do not like…", idea: "I like growing plants because I like flowers. You can have a different answer!" },
    ],
    model: ["It is a sunny day.", "The family is in the garden.", "Mum is planting flowers and the girl is watering the plants.", "Dad is holding a spade. A bucket is beside him.", "There is green grass and a fence behind the family.", "They look happy. I think they enjoy working together."],
  },
  {
    id: "living-room", title: "Story Time at Home", image: "english-living-room",
    alt: "A family is sitting together on a sofa in the living room. Dad is reading a book. Mum and the girl are listening. A small puppy is on an armchair. There are plants, family pictures, a floor lamp and a television.",
    words: [
      { text: "living room", x: 23, y: 19, sentence: "The family is in the living room." },
      { text: "sofa", x: 78, y: 64, sentence: "They are sitting on the sofa." },
      { text: "read a book", x: 53, y: 51, sentence: "Dad is reading a book." },
      { text: "listen", x: 63, y: 40, sentence: "Mum and the girl are listening." },
      { text: "puppy", x: 15, y: 62, sentence: "The puppy is on the armchair." },
      { text: "floor lamp", x: 82, y: 12, sentence: "There is a floor lamp beside the sofa." },
      { text: "television", x: 96, y: 35, sentence: "The television is off." },
      { text: "family pictures", x: 51, y: 10, sentence: "There are family pictures on the wall." },
    ],
    questions: [
      { text: "Which room is this?", starter: "This is the…", idea: "This is the living room." },
      { text: "What is Dad doing?", starter: "Dad is…", idea: "Dad is reading a book." },
      { text: "What are Mum and the girl doing?", starter: "They are…", idea: "They are listening to Dad." },
      { text: "Where is the puppy?", starter: "The puppy is on the…", idea: "The puppy is on the armchair." },
      { text: "What do you like doing with your family?", starter: "I like… with my family.", idea: "I like reading with my family. You may like a different activity!" },
    ],
    model: ["This is a living room.", "Dad, Mum and the girl are sitting on the sofa.", "Dad is reading a book. Mum and the girl are listening.", "Their puppy is on the armchair.", "I can see a floor lamp, family pictures and a television.", "The family looks happy. I think they enjoy story time."],
  },
  {
    id: "canteen", title: "Lunch at School", image: "english-canteen", category: "School and Learning",
    alt: "Children are having lunch in the school canteen. A boy is getting food on a tray. A girl is waiting behind him. At the table, a girl is eating and a boy is drinking milk. There is fruit on the table.",
    words: [
      { text: "canteen", x: 48, y: 13, sentence: "The children are in the school canteen." },
      { text: "lunch", x: 59, y: 67, sentence: "It is time for lunch." },
      { text: "tray", x: 27, y: 53, sentence: "The boy is holding a tray." },
      { text: "rice", x: 57, y: 70, sentence: "The girl is eating rice." },
      { text: "vegetables", x: 66, y: 70, sentence: "There are vegetables on the plate." },
      { text: "milk", x: 82, y: 61, sentence: "The boy is drinking milk." },
      { text: "fruit", x: 65, y: 84, sentence: "There is fruit on the table." },
      { text: "wait", x: 52, y: 30, sentence: "The girl is waiting for her food." },
    ],
    questions: [
      { text: "Where are the children?", starter: "They are in the…", idea: "They are in the school canteen." },
      { text: "What is on the girl's plate?", starter: "There is…", idea: "There is rice and there are vegetables." },
      { text: "What is the boy at the table drinking?", starter: "He is drinking…", idea: "He is drinking milk." },
      { text: "What fruit can you see?", starter: "I can see…", idea: "I can see apples and bananas." },
      { text: "What do you like eating for lunch?", starter: "I like eating…", idea: "I like eating rice and vegetables. Tell us about your own lunch!" },
    ],
    model: ["The children are in the school canteen.", "It is lunchtime.", "One boy is getting food on a tray. A girl is waiting behind him.", "At the table, a girl is eating rice and vegetables.", "A boy is drinking milk. There are apples and bananas on the table.", "The children look happy to have lunch together."],
  },
];

export const ENGLISH_STORIES: EnglishStory[] = [...ORIGINAL_ENGLISH_STORIES, ...pdfStories];
