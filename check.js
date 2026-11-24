// 自检：node check.js
// 1) 每个场景在每个时刻都能画完不报错；2) 英文版里没有残留中文；3) 目录、连线、步骤数都对得上。
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const CJK = /[　-〿一-鿿＀-￯]/;
for (const lang of ['zh-CN', 'en']) {
  const ctx = vm.createContext({ document: { documentElement: { lang } }, Math, console });
  vm.runInContext(fs.readFileSync('world.js', 'utf8') + fs.readFileSync('scenes.js', 'utf8') + ';this.X={WORLD,EDGES,TOUR,SCENES,UI,CH,ASK,V1}', ctx);
  const { WORLD, EDGES, TOUR, SCENES, UI, CH, ASK, V1 } = ctx.X, ids = new Set(WORLD.map(n => n.id)), seen = [];
  const say = v => { if (typeof v === 'string') seen.push(v); };
  JSON.stringify([UI, CH, ASK, WORLD.map(({ title, sub, desc, steps, note, vendors, code }) => [title, sub, desc, steps, note, vendors, code])], (k, v) => (say(v), v));
  for (const id of [...TOUR, ...Object.keys(V1), ...ASK.map(a => a[1]), ...EDGES.flatMap(e => [e.a, e.b]), ...WORLD.map(n => n.parent).filter(Boolean)]) assert(ids.has(id), 'unknown id ' + id);
  for (const id in SCENES) assert(ids.has(id), 'scene without a node: ' + id);
  const parents = new Set(WORLD.map(n => n.parent)); // 不允许只有文字的空方框：每个方框要么有子方框，要么有动画
  for (const n of WORLD) assert(parents.has(n.id) || SCENES[n.id], 'box with neither children nor an animation: ' + n.id);
  for (const n of WORLD) if (SCENES[n.id]) { assert.equal(n.steps.length, SCENES[n.id].cuts.length, n.id + ': steps vs cuts'); assert(Math.abs(n.w / n.h - 1.6) < .02, n.id + ': scene boards are 16:10'); }
  const clamp = v => Math.max(0, Math.min(1, v)), k = new Proxy({
    lerp: (a, b, f) => a + (b - a) * f, clamp, col: () => '#000',
    p: (a, b) => clamp((k.t - a) / (b - a)), e: (a, b) => clamp((k.t - a) / (b - a)), on: (a, b = 1e9) => k.t >= a && k.t < b, blink: () => .5,
    al: (a, fn) => fn(), pkt: (pts, p, tone, label) => (say(label), [pts[0], pts[1]]), at: pts => [pts[0], pts[1], 1, 0],
    go: (pts, a, b, tone, label) => (say(label), k.t >= a && k.t < b),
  }, { get: (o, key) => key in o ? o[key] : (...args) => args.forEach(say) });
  for (const [id, sc] of Object.entries(SCENES)) for (let T = 0; T < sc.d; T += .1) {
    k.t = T; k.d = sc.d; k.i = sc.cuts.filter(c => c <= T).length - 1;
    try { sc.draw(k); } catch (err) { throw new Error(`${id} @ ${T.toFixed(1)}s: ${err.message}`); }
  }
  if (lang === 'en') for (const s of new Set(seen)) assert(s === UI.other || !CJK.test(s), 'Chinese left in the English build: ' + s); // 只有语言切换按钮上的“中文”例外
  console.log(lang, 'ok:', WORLD.length, 'boxes,', Object.keys(SCENES).length, 'scenes,', EDGES.length, 'edges,', new Set(seen).size, 'strings');
}
