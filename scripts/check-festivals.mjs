import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFile } from "node:fs/promises";

const compiled = await build({ entryPoints: ["client/src/data/festivalEnglish.ts"], bundle: true, write: false, platform: "node", format: "esm" });
const { festivalProfiles, FESTIVAL_ENGLISH } = await import("data:text/javascript;base64," + Buffer.from(compiled.outputFiles[0].text).toString("base64"));
const zh = festivalProfiles("zh"), en = festivalProfiles("en");
assert.equal(zh.length, 16);
assert.equal(en.length, 16);
assert.equal(Object.keys(FESTIVAL_ENGLISH).length, 16);
for (let i = 0; i < zh.length; i++) {
  assert.equal(zh[i].id, en[i].id);
  assert.equal(en[i].activities.length, 3);
  for (const value of [en[i].zh, en[i].dateZh, en[i].dateGuideZh, en[i].where, en[i].foodPlay, en[i].blessing, en[i].clue, ...en[i].activities]) {
    assert(value.length > 0);
    assert(!/[\u3400-\u9fff]/.test(value), value);
  }
  assert(!zh[i].activities.some(a => a.startsWith("吃")), zh[i].id);
}
const get = id => zh.find(f => f.id === id);
assert.equal(get("newyeareve").foodPlay, "團年飯、魚、雞、年糕");
assert.equal(get("newyeareve").blessing, "辭舊迎新，闔家團圓！");
assert.equal(get("spring").blessing, "恭喜發財，大吉大利！");
for (const food of ["湯圓", "元宵", "餃子"]) assert(get("lantern").foodPlay.includes(food));
for (const food of ["燒豬", "燒肉", "燒鴨", "白切雞", "艾粄", "青團"]) assert(get("chingming").foodPlay.includes(food));
assert.equal(get("easter").foodPlay, "雞蛋、巧克力蛋、熱十字麵包");
const source = await readFile("client/src/games/FestivalGame.tsx", "utf8");
assert(!source.includes("郵戳已收集"));
assert(!source.includes("吃／玩什麼"));
const texts = await readFile("client/src/data/festivalText.ts", "utf8");
const keys = [...source.matchAll(/t\("([^"]+)"\)/g)].map(m => m[1]);
for (const key of keys) assert(texts.includes(JSON.stringify(key)), "Missing UI translation: " + key);
console.log("PASS: 16 bilingual festivals, requested content, food/activity separation, UI translation keys and removed labels.");
