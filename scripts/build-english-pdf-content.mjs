// Compile reviewed, human-authored teaching notes into the game's typed dataset.
import fs from 'node:fs';
const readRows = path => fs.readFileSync(path, 'utf8').trim().split('\n').filter(row => !row.startsWith('#')).map(row => row.split('|'));
const inventory = JSON.parse(fs.readFileSync('docs/english-pdf-card-inventory.json', 'utf8'));
const coaching = new Map(readRows('docs/english-pdf-coaching.txt').map(([id, ...fields]) => [id, fields]));
const markersPath = 'docs/english-pdf-markers.json';
const markers = fs.existsSync(markersPath) ? JSON.parse(fs.readFileSync(markersPath, 'utf8')) : {};
const rows = readRows('docs/english-pdf-scenes.txt');
if (rows.length !== 86 || inventory.length !== 86) throw new Error('Expected all 86 PDF cards');
const stories = rows.map(([id, category, setting, vocabulary, actions, personal]) => {
  const source = inventory.find(card => card.id === id);
  if (!source || !coaching.has(id)) throw new Error(`Missing source/coaching: ${id}`);
  const [question1, question2, reflection] = coaching.get(id);
  const sentences = actions.split(';');
  const nouns = vocabulary.split(';');
  if (nouns.length !== 8 || sentences.length !== 4) throw new Error(`Invalid lesson: ${id}`);
  return {
    id: `pdf-${id}`, title: source.title, image: `english-pdf-${id}`, category,
    source: { pdfPage: source.page, card: source.card },
    alt: sentences.join(' '),
    words: nouns.map((noun, index) => ({
      text: noun.replace(/^(a|an|the) /, ''),
      ...(markers[id]?.[index] ? { x: markers[id][index][0], y: markers[id][index][1] } : {}),
      sentence: `I can see ${noun}.`,
    })),
    questions: [
      { text: 'Where does this picture take place?', starter: 'This picture shows…', idea: `This picture shows a scene ${setting}.` },
      { text: question1, starter: sentences[0].split(/\b(is|are|has|have)\b/)[0].trim() + '…', idea: sentences[0] },
      { text: question2, starter: sentences[1].split(/\b(is|are|has|have)\b/)[0].trim() + '…', idea: sentences[1] },
      { text: 'What else can you see happening?', starter: 'I can also see…', idea: sentences[2] + ' ' + sentences[3] },
      { text: personal, starter: 'I think… / I would… / I like…', idea: reflection + ' Your answer can be different!' },
    ],
    model: [`This picture shows a scene ${setting}.`, ...sentences, reflection],
  };
});
fs.writeFileSync('client/src/data/englishPdfStories.json', JSON.stringify(stories, null, 2) + '\n');
console.log(`Built ${stories.length} lessons, ${stories.length * 8} words, ${stories.length * 5} questions.`);
