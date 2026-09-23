import fs from 'node:fs';
import assert from 'node:assert/strict';
const stories = JSON.parse(fs.readFileSync('client/src/data/chinesePdfStories.json', 'utf8'));
assert.equal(stories.length, 31);
assert.equal(new Set(stories.map(s => s.id)).size, 31);
for (const [i, s] of stories.entries()) {
  assert.deepEqual(s.sourcePages, [i * 2 + 1, i * 2 + 2]);
  assert.equal(s.format, 'four');
  assert.equal(s.clues.length, 4);
  assert.equal(s.thoughts.length, 3);
  assert.equal(s.events.length, 4);
  for (const c of s.clues) assert.ok(c.question && c.label && c.x > 0 && c.x < 100 && c.y > 0 && c.y < 100);
  assert.ok(s.example && s.alt && s.ending);
  assert.ok(fs.existsSync(`client/public/images/stories/${s.image}.webp`), `Missing illustration: ${s.id}`);
}
console.log('PASS: 31 complete Chinese stories, all 62 source pages, all illustrations.');
