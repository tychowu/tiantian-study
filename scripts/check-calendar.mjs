import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
const {code} = await transform(await readFile('client/src/lib/calendarLearning.ts','utf8'), {loader:'ts',format:'esm'});
const c = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
for (const [year, leap] of [[1900,false],[2000,true],[2024,true],[2026,false],[2028,true],[2100,false],[2400,true]]) {
  assert.equal(c.isLeapYear(year),leap);
  assert.equal(c.daysInMonth(year,2),leap?29:28);
  assert.equal(Array.from({length:12},(_,i)=>c.daysInMonth(year,i+1)).reduce((a,b)=>a+b),leap?366:365);
}
const d=(year,month,day)=>({year,month,day});
assert.deepEqual(c.shiftDay(d(2026,12,31),1),d(2027,1,1));
assert.deepEqual(c.shiftDay(d(2026,2,28),1),d(2026,3,1));
assert.deepEqual(c.shiftDay(d(2028,2,28),1),d(2028,2,29));
assert.deepEqual(c.shiftDay(d(2028,2,29),1),d(2028,3,1));
assert.deepEqual(c.shiftMonth(d(2026,1,31),1),d(2026,2,28));
assert.deepEqual(c.shiftMonth(d(2028,3,31),-1),d(2028,2,29));
assert.deepEqual(c.hongKongToday(new Date('2026-09-22T15:59:59Z')),d(2026,9,22));
assert.deepEqual(c.hongKongToday(new Date('2026-09-22T16:00:00Z')),d(2026,9,23));
assert.deepEqual(c.hongKongToday(new Date('2026-12-31T16:00:00Z')),d(2027,1,1));
assert.equal(c.weekday(d(2026,9,23)),3);
assert.deepEqual(c.SEASONS.flatMap(s=>s.months).sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i+1));
assert.equal(c.seasonFor(12).name,'冬季');
assert.equal(c.seasonFor(2).name,'冬季');
console.log('Calendar regression checks passed: leap rules, month lengths, rollover, HK midnight, weekdays, seasons.');
