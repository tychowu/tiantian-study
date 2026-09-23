import assert from 'node:assert/strict';
import fs from 'node:fs';

const stories = JSON.parse(fs.readFileSync('client/src/data/englishPdfStories.json', 'utf8'));
const inventory = JSON.parse(fs.readFileSync('docs/english-pdf-card-inventory.json', 'utf8'));
assert.equal(stories.length, 86, 'Every PDF card must be included');
assert.equal(new Set(stories.map(s => s.id)).size, 86, 'Unique story IDs');
assert.equal(new Set(stories.map(s => s.source.card)).size, 86, 'No duplicate source cards');
assert.equal(new Set(stories.map(s => s.source.pdfPage)).size, 27, 'All 27 source pages covered');
for (const entry of inventory) {
  const story = stories.find(s => s.id === `pdf-${entry.id}`);
  assert.ok(story, `Missing PDF card ${entry.card}`);
  assert.equal(story.source.pdfPage, entry.page);
  assert.equal(story.source.card, entry.card);
  assert.equal(story.title, entry.title);
  assert.equal(story.words.length, 8, story.id);
  assert.equal(story.questions.length, 5, story.id);
  assert.equal(story.model.length, 6, story.id);
  assert.equal(new Set(story.words.map(w => w.text)).size, 8, story.id);
  assert.ok(story.category && story.alt.length > 30, story.id);
  assert.ok(!/[\u3400-\u9fff]/.test(JSON.stringify(story)), `${story.id}: English only`);
  const path = `client/public/images/stories/${story.image}.webp`;
  assert.ok(fs.existsSync(path), `Missing illustration: ${path}`);
  assert.ok(fs.statSync(path).size > 10000, `Unexpectedly small illustration: ${path}`);
  for (const word of story.words) {
    assert.ok(word.sentence && word.text, story.id);
    assert.ok(Number.isFinite(word.x) && word.x >= 0 && word.x <= 100, `${story.id}: ${word.text} x`);
    assert.ok(Number.isFinite(word.y) && word.y >= 0 && word.y <= 100, `${story.id}: ${word.text} y`);
  }
  for (const question of story.questions) {
    assert.ok(question.text.endsWith('?'), story.id);
    assert.ok(question.starter && question.idea, story.id);
  }
}
const UI = fs.readFileSync('client/src/games/EnglishPictureTalk.tsx', 'utf8');
assert.ok(UI.includes('⭕️'), 'Use the requested circle, never a star marker');
assert.ok(UI.includes('loading="lazy"'), 'Do not eagerly load 89 full-size illustrations');
assert.ok(UI.includes('useGameBack(selected !== null'), 'Back returns to the picture library');
assert.ok(!UI.includes('Slow voice') && !UI.includes('Listen to the picture'), 'Keep removed controls absent');
const existing = fs.readFileSync('client/src/data/englishStories.ts', 'utf8');
for (const id of ['garden', 'living-room', 'canteen']) assert.ok(existing.includes(`id: "${id}"`));
console.log('PASS: 86 PDF cards / 27 pages / 688 word markers / 430 questions / 516 sample sentences; 3 original cards preserved.');
