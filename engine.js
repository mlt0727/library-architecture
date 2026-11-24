'use strict';
// 画布引擎：相机、按缩放层级显隐（LOD）、连线上的数据包、场景循环、面板与目录。
// 内容在 world.js，场景动画在 scenes.js。
(() => {
const $ = s => document.querySelector(s);
const cv = $('#world'), ctx = cv.getContext('2d');
const panelEl = $('#panel'), tocEl = $('#toc'), crumbEl = $('#crumbs'), hintEl = $('#hint');
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const smooth = v => { v = clamp(v); return v * v * (3 - 2 * v); };
const lerp = (a, b, f) => a + (b - a) * f;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FONT = '"Microsoft YaHei UI","PingFang SC","Noto Sans CJK SC",system-ui,sans-serif';
const MONO = 'Consolas,"SF Mono",Menlo,"Courier New",monospace';
const TONE = {
  ink: ['#263348', '#eef0f3'], soft: ['#5f6976', '#f1f1ee'], muted: ['#8b9099', '#f3f1ec'], line: ['#cbc4b4', '#f6f3ec'],
  blue: ['#4a63d8', '#edf0fd'], indigo: ['#5d55c9', '#efedfc'], purple: ['#8056bc', '#f3edfb'], teal: ['#15877f', '#e4f4f1'],
  orange: ['#cc7027', '#fdefe0'], yellow: ['#c08a12', '#fdf4d6'], pink: ['#c2477f', '#fdeaf2'], red: ['#cf4a3c', '#fdebe8'],
  green: ['#2f9a57', '#e6f5ea'],
};
const col = (tone, i = 0) => (TONE[tone] || [tone, tone])[i];
const PAPER = '#fffdf9', EDGE = '#d8d2c4', ACCENT = '#d3752f';

const ICON = {
  laptop: 'M4 6h16v10H4z M2 19h20', phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M11 18h2',
  globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18',
  mini: 'M5 5h6v6H5z M13 5h6v6h-6z M5 13h6v6H5z M16 13v6 M13 16h6', gate: 'M4 20V9l8-5l8 5v11 M9 20v-6h6v6 M3 20h18',
  split: 'M3 12h18 M9 12l6-6h6 M9 12l6 6h6', dns: 'M4 5h16v5H4z M4 14h16v5H4z M7 7.5h.01 M7 16.5h.01',
  cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z M4 7.5l8 4.5l8-4.5 M12 12v9', grid: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  list: 'M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01', book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M5 17a3 3 0 0 1 3-3h11',
  books: 'M4 4h4v16H4z M9 4h4v16H9z M14.5 6.5l3.8-1l3 13.5l-3.8 1z', user: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6',
  seat: 'M7 4v9h10V4 M5 13h14v4H5z M7 17v4 M17 17v4', bell: 'M6 17V11a6 6 0 0 1 12 0v6l2 2H4z M10 21h4',
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z M16 16l5 5', mesh: 'M5 5h4v4H5z M15 5h4v4h-4z M5 15h4v4H5z M15 15h4v4h-4z M9 7h6 M9 17h6 M7 9v6 M17 9v6',
  db: 'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3s-3.1 3-7 3s-7-1.3-7-3z M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6 M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
  bolt: 'M13 3L5 14h6l-1 7l8-11h-6z', queue: 'M3 7h4v10H3z M10 7h4v10h-4z M17 7h4v10h-4z', chart: 'M4 4v16h16 M7 15l4-5l3 3l5-7',
  trace: 'M4 6h10 M8 12h12 M6 18h7', logs: 'M6 3h9l4 4v14H6z M9 10h7 M9 14h7 M9 18h4',
  branch: 'M7 7v10 M7 10c0 4 10 1 10 5 M9 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0z M9 19a2 2 0 1 1-4 0a2 2 0 0 1 4 0z M19 17a2 2 0 1 1-4 0a2 2 0 0 1 4 0z',
  check: 'M5 4h14v16H5z M8.5 12l2.5 2.5l4.5-5', layers: 'M12 3l9 5l-9 5l-9-5z M3 12l9 5l9-5 M3 16l9 5l9-5',
  belt: 'M4 16h16 M4 16a2.5 2.5 0 0 0 0 5h16a2.5 2.5 0 0 0 0-5 M8 5h8v7H8z', flag: 'M5 21V4 M5 5h12l-2 4l2 4H5',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9c-4.5-1-8-4-8-9V6z', plug: 'M9 3v5 M15 3v5 M6 8h12v4a6 6 0 0 1-12 0z M12 18v3',
  code: 'M8 7l-5 5l5 5 M16 7l5 5l-5 5 M14 4l-4 16', scale: 'M4 20h16 M6 20V10 M12 20V4 M18 20v-7',
  server: 'M4 4h16v6H4z M4 14h16v6H4z M8 7h.01 M8 17h.01', swap: 'M4 8h14l-3-3 M20 16H6l3 3', pulse: 'M3 12h4l2-6l4 12l2-6h6',
  key: 'M8 14a4 4 0 1 1 3.9-5H21v3h-2v2h-3v-2h-4.1A4 4 0 0 1 8 14z', sidecar: 'M3 6h11v12H3z M16 9h5v9h-5z M14 13h2',
  box: 'M4 4h16v16H4z M12 4v16 M4 12h16', lock: 'M6 11h12v9H6z M8 11V8a4 4 0 0 1 8 0v3', zip: 'M6 3h9l4 4v14H6z M11 3v3 M11 8v2 M11 12v2',
  copy: 'M4 4h11v11H4z M9 9h11v11H9z', clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M12 7v5l3 2',
  people: 'M9 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6z M3 20c0-3 3-5 6-5s6 2 6 5 M17 11a2.5 2.5 0 1 0 0-5 M17 15c2.5 0 4 1.5 4 4',
  zoom: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z M16 16l5 5 M8 11h6 M11 8v6', warn: 'M12 4l9 16H3z M12 10v4 M12 17h.01',
};
const paths = {};
function icon(name, x, y, size, color, lw = 1.8) {
  const d = ICON[name] || ICON.box, p = paths[name] || (paths[name] = new Path2D(d));
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke(p); ctx.restore();
}

// ---------- 世界树 ----------
const ROOT = { id: 'root', kids: [], ax: 0, ay: 0, aw: 1000, ah: 625, depth: 0, title: UI.home, open: 1, vis: 1 };
const NODE = { root: ROOT };
for (const n of WORLD) {
  const p = NODE[n.parent || 'root'], u = p.aw / 1000;
  Object.assign(n, { up: p, kids: [], ax: p.ax + n.x * u, ay: p.ay + n.y * u, aw: n.w * u, ah: n.h * u, depth: p.depth + 1, scene: SCENES[n.id], t0: 0 });
  n.tone = n.tone || p.tone || 'blue'; n.ch = n.ch ?? p.ch; n.m = Math.max(n.aw, n.ah); // 决定何时“打开”的尺寸
  p.kids.push(n); NODE[n.id] = n;
}
const SIDE = { l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1] };
for (const e of EDGES) {
  e.A = NODE[e.a]; e.B = NODE[e.b]; e.ph = Math.random(); e.tone = e.tone || 'blue';
  if (!e.sa) {
    const dx = e.B.ax + e.B.aw / 2 - e.A.ax - e.A.aw / 2, dy = e.B.ay + e.B.ah / 2 - e.A.ay - e.A.ah / 2;
    if (Math.abs(dx) >= Math.abs(dy)) { e.sa = dx > 0 ? 'r' : 'l'; e.sb = dx > 0 ? 'l' : 'r'; } else { e.sa = dy > 0 ? 'b' : 't'; e.sb = dy > 0 ? 't' : 'b'; }
  }
}
const TOURN = TOUR.map(id => NODE[id]);

// ---------- 相机 ----------
const TOP = 52, PANEL_W = 372, TOC_W = 250;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q = new URLSearchParams(location.search);
const LOD = +Q.get('lod') || 1;                  // 调试：?lod=0.4 让方框更早打开
const PH = Q.has('ph') ? +Q.get('ph') : null;    // 调试：?ph=2 让每个场景停在第 3 步（配合 pf=0~1 选该步内的位置）
let W = 0, H = 0, dpr = 1, home = 1, LO = 300, HI = 440, minS = .5, maxS = 100;
let cam = { x: 0, y: 0, s: 1 }, anim = null, zoomA = null;
let time = 0, last = 0, paused = reduce, sel = null, hover = null, focus = ROOT;
let cards = [], frames = [], scenes = [];

function avail() {
  const wide = W > 820, pw = sel && wide ? PANEL_W + 14 : 0, ph = sel && !wide ? H * .44 : 0;
  const tw = !tocEl.hidden && W >= 900 ? TOC_W + 10 : 0; // 目录开着时，把内容让到它右边
  return { x: tw, y: TOP, w: W - pw - tw, h: H - TOP - ph - (ph ? 6 : 62) }; // 底部留一条给小地图、提示和缩放按钮
}
function resize() {
  dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  home = Math.min(W / 1000, (H - TOP) / 625) * .95;
  LO = Math.max(home * 345, 240) * LOD; HI = LO * 1.42; minS = home * .7; maxS = Math.max(home, 1) * 110;
}
function fitView(n) {
  const a = avail(), pad = n === ROOT ? .97 : n.scene ? .97 : n.kids.length ? .9 : .5;
  let s = Math.min(a.w / n.aw, a.h / n.ah) * pad;
  if (n !== ROOT && (n.scene || n.kids.length)) s = Math.max(s, HI * 1.04 / n.m);
  return { s, cx: n.ax + n.aw / 2, cy: n.ay + n.ah / 2 };
}
function go(v, instant) {
  const a = avail(), fx = a.x + a.w / 2, fy = a.y + a.h / 2, s0 = cam.s, cx0 = cam.x + fx / s0, cy0 = cam.y + fy / s0;
  zoomA = null;
  if (instant || reduce) { cam.s = v.s; cam.x = v.cx - fx / v.s; cam.y = v.cy - fy / v.s; anim = null; return; }
  const dist = Math.hypot(v.cx - cx0, v.cy - cy0) * Math.min(s0, v.s), vp = Math.min(a.w, a.h), far = dist > vp * 1.1;
  const dip = far ? Math.log(dist / (vp * .55)) : 0;
  const dur = Math.min(1.9, .45 + .13 * Math.abs(Math.log(v.s / s0)) + (far ? .25 + .14 * dip : 0));
  anim = { s0, cx0, cy0, s1: v.s, cx1: v.cx, cy1: v.cy, fx, fy, t: 0, dur, dip, far };
}
function stepCamera(dt) {
  if (anim) {
    const A = anim; A.t += dt;
    const u = Math.min(1, A.t / A.dur), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    const L0 = Math.log(A.s0), L1 = Math.log(A.s1);
    let s = Math.exp(lerp(L0, L1, e) - A.dip * Math.sin(Math.PI * e)), cx = lerp(A.cx0, A.cx1, e), cy = lerp(A.cy0, A.cy1, e);
    if (!A.far && Math.abs(L1 - L0) > .02) { // 绕不动点缩放：目标在视野里时不会甩镜头
      const k = A.s0 / s, fxw = (A.cx1 * A.s1 - A.cx0 * A.s0) / (A.s1 - A.s0), fyw = (A.cy1 * A.s1 - A.cy0 * A.s0) / (A.s1 - A.s0);
      cx = fxw + (A.cx0 - fxw) * k; cy = fyw + (A.cy0 - fyw) * k;
    }
    cam.s = s; cam.x = cx - A.fx / s; cam.y = cy - A.fy / s;
    if (u >= 1) anim = null;
  } else if (zoomA) {
    const Z = zoomA, ls = Math.log(cam.s), lt = Math.log(Z.s), nl = lt + (ls - lt) * Math.exp(-dt * 16);
    cam.s = Math.exp(nl); cam.x = Z.wx - Z.px / cam.s; cam.y = Z.wy - Z.py / cam.s;
    if (Math.abs(nl - lt) < .002) zoomA = null;
  }
  const cx = clamp(cam.x + W / 2 / cam.s, -80, 1080), cy = clamp(cam.y + H / 2 / cam.s, -80, 705);
  cam.x = cx - W / 2 / cam.s; cam.y = cy - H / 2 / cam.s;
}
function zoomAt(px, py, f) {
  anim = null;
  const s = clamp((zoomA ? zoomA.s : cam.s) * f, minS, maxS);
  zoomA = { s, px, py, wx: cam.x + px / cam.s, wy: cam.y + py / cam.s };
}

// ---------- 文字 ----------
function setFont(size, weight = 400, mono) { ctx.font = `${weight} ${size}px ${mono ? MONO : FONT}`; }
function fit(str, maxW, size, weight = 400, min = size * .55, mono) {
  setFont(size, weight, mono); const w = ctx.measureText(str).width;
  if (w > maxW) { size = Math.max(min, size * maxW / w); setFont(size, weight, mono); }
  return size;
}
const wcache = new Map();
function wrap(str, maxW) {
  const key = ctx.font + '|' + (maxW | 0) + '|' + str; let r = wcache.get(key); if (r) return r;
  if (wcache.size > 800) wcache.clear();
  const toks = str.match(/[⺀-￿]|[^\s⺀-￿]+\s*|\s+/g) || []; r = []; let line = '';
  for (const tk of toks) {
    if (line && ctx.measureText((line + tk).trimEnd()).width > maxW) { r.push(line.trimEnd()); line = tk.trimStart(); } else line += tk;
  }
  if (line.trim()) r.push(line.trimEnd());
  wcache.set(key, r); return r;
}
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); }

// ---------- 绘制：背景、方框、连线 ----------
function background() {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#faf6ec'); g.addColorStop(.5, '#fbfaf6'); g.addColorStop(1, '#faf7f1');
  ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const g0 = Math.pow(2, Math.ceil(Math.log2(24 / cam.s))), sp = g0 * cam.s, fa = (sp - 24) / 24; // 点阵间距随缩放翻倍，画布显得无限
  const x0 = Math.floor(cam.x / g0), y0 = Math.floor(cam.y / g0), nx = Math.ceil(W / sp) + 1, ny = Math.ceil(H / sp) + 1;
  for (const pass of [0, 1]) {
    ctx.beginPath();
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
      const gx = x0 + i, gy = y0 + j, major = !(gx & 1) && !(gy & 1);
      if (major === !pass) ctx.rect((gx * g0 - cam.x) * cam.s - .7, (gy * g0 - cam.y) * cam.s - .7, 1.4, 1.4);
    }
    ctx.fillStyle = '#b9ae96'; ctx.globalAlpha = pass ? .5 * fa : .5; ctx.fill();
  }
}
const off = n => n.sx > W || n.sy > H || n.sx + n.sw < 0 || n.sy + n.sh < 0;
function visit(n, a) {
  const m = n.m * cam.s, vis = a * clamp((m - 5) / 12);
  const o = (n.kids.length || n.scene) ? smooth((m - LO) / (HI - LO)) : 0;
  n.open = o; n.vis = vis;
  if (vis < .01) return;
  if (o < 1) cards.push([n, vis * (1 - o)]);
  if (o > 0) { frames.push([n, vis * o]); if (n.scene) scenes.push([n, vis * o]); else for (const k of n.kids) visit(k, vis * o); }
}
function chip(x, y, s, n) {
  ctx.fillStyle = col(n.tone, 1); rr(x, y, s, s, s * .24); ctx.fill();
  icon(n.icon, x + s * .19, y + s * .19, s * .62, col(n.tone), 1.9);
}
function fwStrip(n, x, y, w, h, long, size = clamp(h * .56, 8, 13)) { // 每个服务底部的“通信框架”条：人人都有，点它飞到展开的那一份
  n.strip = [x, y, w, h];
  ctx.fillStyle = col('purple', 1); rr(x, y, w, h, Math.min(8, h * .4)); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = col('purple'); ctx.stroke();
  if (h < 11) return;
  let s = long ? UI.fwLong : UI.fw; fit(s, w - 12, size, 600, size * .7);
  if (ctx.measureText(s).width > w - 10) { s = UI.fw; fit(s, w - 12, size, 600, 7); } // 长说明放不下就只写名字
  ctx.fillStyle = col('purple'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x + w / 2, y + h / 2 + .5);
}
function drawCard(n, a) {
  if (off(n)) return;
  const x = n.sx, y = n.sy, w = n.sw, H0 = n.sh, hot = n === hover, isSel = n === sel, tc = col(n.tone);
  const fh = n.fw && w > 64 ? clamp(H0 * .17, 9, 30) : 0, r = clamp(Math.min(w, H0) * .1, 2, 14);
  let h = H0;
  ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(92,73,48,.09)'; rr(x, y + (hot ? 4 : 2), w, h, r); ctx.fill();
  ctx.fillStyle = PAPER; rr(x, y, w, h, r); ctx.fill();
  ctx.lineWidth = hot || isSel ? 2 : 1.2; ctx.strokeStyle = isSel ? ACCENT : hot ? tc : EDGE; ctx.stroke();
  if (w < 24 || h < 18) { ctx.globalAlpha = a * .55; ctx.fillStyle = tc; rr(x + w * .3, y + h * .3, w * .4, h * .4, 2); ctx.fill(); return; }
  if (fh) { fwStrip(n, x + 4, y + H0 - fh - 4, w - 8, fh, w > 300); h = H0 - fh - 4; } // 下面的排版只用条以上的区域
  const zoomable = n.kids.length || n.scene, pad = clamp(w * .07, 4, 18), tw = w - pad * 2;
  let ic = clamp(Math.min(w * .3, h * .36), 11, 42), ft = clamp(w * .1, 8.5, 19);
  ctx.textBaseline = 'middle';
  if (h < ic + ft * 1.3 + pad * 1.4) { // 横排：图标 + 标题
    ic = clamp(h * .52, 10, 26); ft = clamp(h * .3, 8.5, 16);
    if (w < ic + pad * 2 + ft * 2.5) { chip(x + (w - ic) / 2, y + (h - ic) / 2, ic, n); return; }
    ft = fit(n.title, tw - ic - 6, ft, 700, 7.5); const t0 = ctx.measureText(n.title).width, gx = x + (w - ic - 6 - t0) / 2;
    chip(gx, y + (h - ic) / 2, ic, n); ctx.fillStyle = col('ink'); ctx.textAlign = 'left'; ctx.fillText(n.title, gx + ic + 6, y + h / 2 + .5);
  } else {
    ft = fit(n.title, tw, ft, 700, 8);
    const fs = clamp(ft * .72, 9, 13); let sub = [];
    if (n.sub && w >= 104 && h >= ic + ft * 1.3 + fs * 1.5 + pad * 2) { setFont(fs); sub = wrap(n.sub, tw).slice(0, 2); }
    const fd = clamp(w * .031, 11, 15); let desc = [];
    if (!zoomable && n.desc && w >= 280) {
      setFont(fd); desc = wrap(n.desc, w * .8);
      desc = desc.slice(0, Math.max(0, Math.floor((h - pad * 2 - ic - ft * 1.3 - sub.length * fs * 1.45 - 16) / (fd * 1.65))));
    }
    const total = ic + 7 + ft * 1.2 + sub.length * fs * 1.45 + (desc.length ? 12 + desc.length * fd * 1.65 : 0);
    let cy = y + (h - total) / 2;
    chip(x + (w - ic) / 2, cy, ic, n); cy += ic + 7 + ft * .6;
    ctx.textAlign = 'center'; setFont(ft, 700); ctx.fillStyle = col('ink'); ctx.fillText(n.title, x + w / 2, cy); cy += ft * .6;
    setFont(fs); ctx.fillStyle = col('soft'); for (const l of sub) { cy += fs * .72; ctx.fillText(l, x + w / 2, cy); cy += fs * .73; }
    if (desc.length) { cy += 12; setFont(fd); ctx.fillStyle = col('soft'); for (const l of desc) { cy += fd * .82; ctx.fillText(l, x + w / 2, cy); cy += fd * .83; } }
  }
  if (n.no && w > 96) { setFont(clamp(w * .05, 9, 12), 700, true); ctx.textAlign = 'left'; ctx.fillStyle = ACCENT; ctx.fillText(n.no, x + pad * .8, y + pad * .75 + 4); }
  if (zoomable && w > 84) icon('zoom', x + w - pad * .7 - 13, y + pad * .6, 13, hot ? tc : '#b3ab9a', 2);
  if (n.live && w > 56) { ctx.globalAlpha = a * (.55 + .45 * Math.sin(time * 3 + n.ax)); ctx.fillStyle = col('green'); ctx.beginPath(); ctx.arc(x + pad * .8 + 3, y + pad * .8 + 3, 3, 0, 7); ctx.fill(); }
}
function drawFrame(n, a) {
  if (off(n)) return;
  const x = n.sx, y = n.sy, w = n.sw, h = n.sh, r = clamp(w * .014, 6, 20), tc = col(n.tone);
  if (n.scene) {
    ctx.globalAlpha = a; ctx.fillStyle = 'rgba(92,73,48,.08)'; rr(x, y + 3, w, h, r); ctx.fill();
    ctx.fillStyle = PAPER; rr(x, y, w, h, r); ctx.fill();
    ctx.lineWidth = n === sel ? 2 : 1.3; ctx.strokeStyle = n === sel ? ACCENT : EDGE; ctx.stroke(); return;
  }
  ctx.globalAlpha = a * .5; ctx.fillStyle = col(n.tone, 1); rr(x, y, w, h, r); ctx.fill();
  ctx.globalAlpha = a * (n === sel ? 1 : .75); ctx.setLineDash([7, 5]); ctx.lineWidth = n === sel ? 2 : 1.4; ctx.strokeStyle = n === sel ? ACCENT : tc; ctx.stroke(); ctx.setLineDash([]);
  const fs = clamp(w * .021, 11.5, 16), pad = clamp(w * .018, 8, 20);
  ctx.globalAlpha = a; icon(n.icon, x + pad, y + pad, fs * 1.3, tc, 2);
  setFont(fs, 700); ctx.fillStyle = tc; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(n.title, x + pad + fs * 1.7, y + pad + fs * .68);
  if (n.sub && w > 430) { const tw = ctx.measureText(n.title).width; setFont(fs * .82); ctx.fillStyle = col('soft'); ctx.fillText(n.sub, x + pad + fs * 1.7 + tw + 12, y + pad + fs * .7); }
  if (n.fw && NODE.fw.up !== n) { const fh = clamp(h * .085, 14, 34); fwStrip(n, x + pad, y + h - fh - pad * .7, w - pad * 2, fh, true); }
}
function anchor(n, side, shift = 0) {
  const [nx, ny] = SIDE[side];
  return [n.sx + n.sw * (.5 + nx * .5 + (ny ? shift : 0)), n.sy + n.sh * (.5 + ny * .5 + (nx ? shift : 0)), nx, ny];
}
function drawEdge(e, dt) {
  const A = e.A, B = e.B; let al = Math.min(A.vis, B.vis);
  if (e.agg) al *= 1 - Math.min(A.open, B.open);
  if (al < .02) return;
  const p1 = anchor(A, e.sa, e.fa), p2 = anchor(B, e.sb, e.fb), len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  if (len < 10 || Math.max(p1[0], p2[0]) < -len * .3 || Math.min(p1[0], p2[0]) > W + len * .3 || Math.max(p1[1], p2[1]) < -len * .3 || Math.min(p1[1], p2[1]) > H + len * .3) return;
  const d = len * .42, c1x = p1[0] + p1[2] * d, c1y = p1[1] + p1[3] * d, c2x = p2[0] + p2[2] * d, c2y = p2[1] + p2[3] * d;
  const at = t => { const m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, q = t * t * t; return [a * p1[0] + b * c1x + c * c2x + q * p2[0], a * p1[1] + b * c1y + c * c2y + q * p2[1]]; };
  ctx.globalAlpha = al * (e.dash ? .6 : .9); ctx.strokeStyle = e.dash ? col(e.tone) : '#cbc4b4'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
  if (e.dash) ctx.setLineDash([4, 5]);
  ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, p2[0], p2[1]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); // 箭头
  ctx.moveTo(p2[0], p2[1]); ctx.lineTo(p2[0] + p2[2] * 7 - p2[3] * 3.6, p2[1] + p2[3] * 7 + p2[2] * 3.6); ctx.lineTo(p2[0] + p2[2] * 7 + p2[3] * 3.6, p2[1] + p2[3] * 7 - p2[2] * 3.6); ctx.fill();
  e.ph = (e.ph + dt * clamp((e.dash ? 55 : 95) / len, .015, 1.1)) % 1;
  const lg = Math.log2(Math.max(1, len / 160)), fl = Math.floor(lg), nb = Math.min(8, 1 << fl), fr = fl >= 3 ? 0 : lg - fl;
  const cap = Math.min(.4, 9 / len);
  const packet = (p, tone, side, pa) => {
    const q = at(p), q0 = at(Math.max(0, p - cap)), tx = q[0] - q0[0], ty = q[1] - q0[1], tl = Math.hypot(tx, ty) || 1, ox = -ty / tl * side, oy = tx / tl * side;
    ctx.globalAlpha = al * pa * smooth(Math.min(p, 1 - p) * 14); ctx.strokeStyle = col(tone);
    ctx.beginPath(); if (e.dash) { ctx.lineWidth = 3.2; ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0] + .01, q[1]); } else { ctx.lineWidth = 4.2; ctx.moveTo(q0[0] + ox, q0[1] + oy); ctx.lineTo(q[0] + ox, q[1] + oy); }
    ctx.stroke();
  };
  for (let i = 0; i < nb * 2; i++) {
    const pa = i & 1 ? smooth(fr * 1.6) : 1; if (pa < .02) continue;
    const p = (e.ph + i / (nb * 2)) % 1;
    packet(p, e.tone, e.back ? 3.2 : 0, pa);
    if (e.back) packet(1 - ((p + .5 / nb) % 1), e.back, 3.2, pa);
  }
  if (e.label && len > 190 && al > .4) {
    const q = at(.5); setFont(11, 500); const tw = ctx.measureText(e.label).width + 12;
    ctx.globalAlpha = al; ctx.fillStyle = '#fbf8f0'; rr(q[0] - tw / 2, q[1] - 9, tw, 18, 9); ctx.fill();
    ctx.fillStyle = col('soft'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e.label, q[0], q[1] + .5);
  }
}

// ---------- 场景工具箱：单位是 1000×625 的板面 ----------
const K = {
  t: 0, d: 1, i: 0, lerp, clamp, col,
  p: (a, b) => clamp((K.t - a) / (b - a)),
  e: (a, b) => smooth((K.t - a) / (b - a)),
  on: (a, b = 1e9) => K.t >= a && K.t < b,
  blink: (hz = 2) => .5 + .5 * Math.sin(K.t * hz * Math.PI * 2),
  al(a, fn) { a = clamp(a); if (a < .01) return; const g = ctx.globalAlpha; ctx.globalAlpha = g * a; fn(); ctx.globalAlpha = g; },
  rect(x, y, w, h, tone = 'line', o = {}) {
    const g = ctx.globalAlpha; ctx.globalAlpha = g * (o.a ?? 1); rr(x, y, w, h, o.r ?? 10);
    if (o.fill !== 0) { ctx.fillStyle = o.fill || col(tone, 1); ctx.fill(); }
    if (o.lw !== 0) { ctx.lineWidth = o.lw || 2; ctx.strokeStyle = col(tone); if (o.dash) ctx.setLineDash([9, 7]); ctx.stroke(); ctx.setLineDash([]); }
    ctx.globalAlpha = g;
  },
  box(x, y, w, h, title, sub, tone = 'blue', o = {}) {
    const g = ctx.globalAlpha; if (o.dim) ctx.globalAlpha = g * .3;
    ctx.fillStyle = 'rgba(92,73,48,.09)'; rr(x, y + 3, w, h, 10); ctx.fill();
    ctx.fillStyle = o.hot ? col(tone, 1) : PAPER; rr(x, y, w, h, 10); ctx.fill();
    ctx.lineWidth = o.hot ? 3 : 2; ctx.strokeStyle = col(tone); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (title) { fit(title, w - 16, o.size || 21, 700); ctx.fillStyle = col('ink'); ctx.fillText(title, x + w / 2, y + h / 2 - (sub ? 11 : 0)); }
    if (sub) { fit(sub, w - 14, 16, 400, 9, o.mono); ctx.fillStyle = col(o.st || 'soft'); ctx.fillText(sub, x + w / 2, y + h / 2 + (title ? 15 : 0)); }
    ctx.globalAlpha = g;
  },
  cyl(x, y, w, h, title, sub, tone = 'indigo', o = {}) {
    const g = ctx.globalAlpha; if (o.dim) ctx.globalAlpha = g * .3;
    const ry = Math.min(h * .14, 16), c = col(tone);
    ctx.fillStyle = o.hot ? col(tone, 1) : PAPER; ctx.strokeStyle = c; ctx.lineWidth = o.hot ? 3 : 2;
    ctx.beginPath(); ctx.moveTo(x, y + ry); ctx.lineTo(x, y + h - ry); ctx.ellipse(x + w / 2, y + h - ry, w / 2, ry, 0, Math.PI, 0, true); ctx.lineTo(x + w, y + ry); ctx.ellipse(x + w / 2, y + ry, w / 2, ry, 0, 0, Math.PI, true); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col(tone, 1); ctx.beginPath(); ctx.ellipse(x + w / 2, y + ry, w / 2, ry, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (title) { fit(title, w - 12, o.size || 20, 700); ctx.fillStyle = col('ink'); ctx.fillText(title, x + w / 2, y + h / 2 + ry * .6 - (sub ? 10 : 0)); }
    if (sub) { fit(sub, w - 10, 16, 400, 9, o.mono); ctx.fillStyle = col(o.st || 'soft'); ctx.fillText(sub, x + w / 2, y + h / 2 + ry * .6 + (title ? 14 : 0)); }
    ctx.globalAlpha = g;
  },
  txt(x, y, s, size = 20, tone = 'ink', align = 'center', weight = 500, maxW) {
    if (maxW) fit(String(s), maxW, size, weight); else setFont(size, weight);
    ctx.fillStyle = col(tone); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y);
  },
  mono(x, y, s, size = 18, tone = 'ink', align = 'center', weight = 500, maxW) {
    if (maxW) fit(String(s), maxW, size, weight, 8, true); else setFont(size, weight, true);
    ctx.fillStyle = col(tone); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y);
  },
  para(x, y, s, maxW, size = 18, tone = 'ink', lh = 1.5) {
    setFont(size); ctx.fillStyle = col(tone); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    wrap(s, maxW).forEach((l, i) => ctx.fillText(l, x, y + i * size * lh));
  },
  ln(pts, tone = 'line', o = {}) {
    const g = ctx.globalAlpha; ctx.globalAlpha = g * (o.a ?? 1);
    ctx.strokeStyle = col(tone); ctx.lineWidth = o.w || 2; ctx.lineCap = ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.stroke(); ctx.setLineDash([]);
    if (o.arrow) {
      const n = pts.length, dx = pts[n - 2] - pts[n - 4], dy = pts[n - 1] - pts[n - 3], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, x = pts[n - 2], y = pts[n - 1];
      ctx.fillStyle = col(tone); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - ux * 12 - uy * 6, y - uy * 12 + ux * 6); ctx.lineTo(x - ux * 12 + uy * 6, y - uy * 12 - ux * 6); ctx.fill();
    }
    ctx.globalAlpha = g;
  },
  at(pts, p) { // 折线上按比例取点
    let total = 0; const seg = [];
    for (let i = 0; i + 3 < pts.length; i += 2) { const l = Math.hypot(pts[i + 2] - pts[i], pts[i + 3] - pts[i + 1]); seg.push(l); total += l; }
    let dist = clamp(p) * total;
    for (let i = 0; i < seg.length; i++) {
      if (dist <= seg[i] || i === seg.length - 1) { const f = seg[i] ? dist / seg[i] : 0, j = i * 2; return [lerp(pts[j], pts[j + 2], f), lerp(pts[j + 1], pts[j + 3], f), (pts[j + 2] - pts[j]) / (seg[i] || 1), (pts[j + 3] - pts[j + 1]) / (seg[i] || 1)]; }
      dist -= seg[i];
    }
  },
  pkt(pts, p, tone = 'blue', label) {
    const [x, y, ux, uy] = K.at(pts, smooth(p));
    ctx.strokeStyle = col(tone); ctx.lineWidth = 11; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - ux * 9, y - uy * 9); ctx.lineTo(x + ux * 9, y + uy * 9); ctx.stroke();
    if (label) { setFont(15, 700, true); ctx.fillStyle = col(tone); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, y - 19); }
    return [x, y];
  },
  go(pts, a, b, tone, label) { if (K.t < a || K.t >= b) return false; K.pkt(pts, (K.t - a) / (b - a), tone, label); return true; },
  pill(x, y, s, tone = 'muted', size = 17) {
    setFont(size, 700); const w = ctx.measureText(s).width + size * 1.3, h = size * 1.75;
    ctx.fillStyle = col(tone, 1); rr(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col(tone); ctx.stroke();
    ctx.fillStyle = col(tone); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 1);
  },
  dot(x, y, r, tone = 'blue', a = 1) { const g = ctx.globalAlpha; ctx.globalAlpha = g * a; ctx.fillStyle = col(tone); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.globalAlpha = g; },
  ring(x, y, r, tone = 'blue', w = 2.5, f = 1) { ctx.strokeStyle = col(tone); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); ctx.stroke(); },
  bar(x, y, w, h, f, tone = 'blue') {
    ctx.fillStyle = '#ece7db'; rr(x, y, w, h, h / 2); ctx.fill();
    if (f > .01) { ctx.fillStyle = col(tone); rr(x, y, Math.max(h, w * clamp(f)), h, h / 2); ctx.fill(); }
  },
  no(x, y, s = 13) { K.ln([x - s, y - s, x + s, y + s], 'red', { w: 5 }); K.ln([x - s, y + s, x + s, y - s], 'red', { w: 5 }); },
  yes(x, y, s = 13) { K.ln([x - s, y, x - s * .3, y + s * .7, x + s, y - s * .7], 'green', { w: 5 }); },
  who(x, y, tone = 'blue', label) {
    ctx.fillStyle = col(tone, 1); ctx.strokeStyle = col(tone); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y - 13, 11, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 19, y + 22); ctx.quadraticCurveTo(x - 19, y + 2, x, y + 2); ctx.quadraticCurveTo(x + 19, y + 2, x + 19, y + 22); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (label) K.txt(x, y + 40, label, 16, 'soft');
  },
  ic(name, x, y, size, tone = 'ink') { icon(name, x - size / 2, y - size / 2, size, col(tone), 2); },
  plot(x, y, w, h, fn, tone = 'blue', upto = 1, lw = 3) { // fn(0..1) → 0..1
    ctx.strokeStyle = col(tone); ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = 0; i <= 60 * upto; i++) { const u = i / 60, px = x + u * w, py = y + h - clamp(fn(u)) * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
  },
};
function drawScene(n, a) {
  if (off(n)) return;
  const sc = n.scene; let T = ((time - n.t0) % sc.d + sc.d) % sc.d;
  if (PH != null) { const j = Math.min(PH, sc.cuts.length - 1); T = lerp(sc.cuts[j], sc.cuts[j + 1] ?? sc.d, +Q.get('pf') || .75); }
  let i = 0; while (i + 1 < sc.cuts.length && T >= sc.cuts[i + 1]) i++;
  n.step = i;
  ctx.save(); ctx.translate(n.sx, n.sy); ctx.scale(n.sw / 1000, n.sw / 1000); rr(0, 0, 1000, 625, 14); ctx.clip(); ctx.globalAlpha = a;
  let hx = 34; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  if (n.no) { setFont(22, 700, true); ctx.fillStyle = ACCENT; ctx.fillText(n.no, hx, 45); hx += ctx.measureText(n.no).width + 14; }
  setFont(25, 700); ctx.fillStyle = col('ink'); ctx.fillText(n.title, hx, 44);
  for (let j = 0; j < sc.cuts.length; j++) { // 步骤进度
    const x = 966 - (sc.cuts.length - 1 - j) * 30, end = sc.cuts[j + 1] ?? sc.d;
    ctx.fillStyle = '#ebe5d8'; rr(x - 24, 41, 24, 6, 3); ctx.fill();
    if (j <= i) { ctx.fillStyle = ACCENT; rr(x - 24, 41, 24 * (j < i ? 1 : clamp((T - sc.cuts[j]) / (end - sc.cuts[j]))), 6, 3); ctx.fill(); }
  }
  K.t = T; K.d = sc.d; K.i = i;
  sc.draw(K);
  if (n.fw) { const u = n.sw / 1000; ctx.globalAlpha = a; fwStrip(n, 30, 506, 940, 34, true, 17); n.strip = [n.sx + 30 * u, n.sy + 506 * u, 940 * u, 34 * u]; } // 服务场景里也带着框架条
  ctx.globalAlpha = a; ctx.fillStyle = '#faf5ea'; rr(28, 550, 944, 60, 12); ctx.fill(); ctx.strokeStyle = '#e9e0cf'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(62, 580, 16, 0, 7); ctx.fill();
  setFont(18, 700, true); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i + 1, 62, 581);
  const cap = n.steps?.[i] || ''; setFont(21, 500); let lines = wrap(cap, 866), fs = 21;
  if (lines.length > 1) { fs = 17.5; setFont(fs, 500); lines = wrap(cap, 866).slice(0, 2); }
  ctx.fillStyle = col('ink'); ctx.textAlign = 'left';
  lines.forEach((l, j) => ctx.fillText(l, 92, 581 + (j - (lines.length - 1) / 2) * fs * 1.35));
  ctx.restore();
}
function minimap() {
  const a = smooth((cam.s / home - 1.5) / 1.5); if (a < .02 || W < 620) return;
  const mw = 80, mh = 50, x = (!tocEl.hidden && W >= 900 ? TOC_W + 22 : 12), y = H - mh - 8, u = mw / 1000;
  ctx.globalAlpha = a * .95; ctx.fillStyle = PAPER; rr(x, y, mw, mh, 8); ctx.fill(); ctx.strokeStyle = EDGE; ctx.lineWidth = 1; ctx.stroke();
  for (const z of ROOT.kids) { ctx.globalAlpha = a * (focusPath.includes(z) ? .95 : .45); ctx.fillStyle = col(z.tone); rr(x + z.ax * u, y + z.ay * u, z.aw * u, z.ah * u, 2); ctx.fill(); }
  ctx.globalAlpha = a; ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.6;
  const vx = clamp(x + cam.x * u, x, x + mw - 4), vy = clamp(y + cam.y * u, y, y + mh - 4);
  ctx.strokeRect(vx, vy, Math.max(4, Math.min(x + mw - vx, W / cam.s * u)), Math.max(4, Math.min(y + mh - vy, H / cam.s * u)));
}

// ---------- 主循环 ----------
let focusPath = [];
function frame(now) {
  const raw = (now - last) / 1000 || 0, dt = Math.min(.05, raw); last = now;
  if (!paused) time += dt;
  stepCamera(Math.min(.25, raw)); // 镜头用真实时间，标签页被降频时也能按时飞到
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  background();
  for (const n of WORLD) { n.sx = (n.ax - cam.x) * cam.s; n.sy = (n.ay - cam.y) * cam.s; n.sw = n.aw * cam.s; n.sh = n.ah * cam.s; n.vis = 0; n.open = 0; n.strip = null; }
  cards = []; frames = []; scenes = [];
  for (const z of ROOT.kids) visit(z, 1);
  for (const [n, a] of frames) if (!n.scene) drawFrame(n, a);
  for (const e of EDGES) drawEdge(e, paused ? 0 : dt);
  for (const [n, a] of cards) drawCard(n, a);
  for (const [n, a] of scenes) { drawFrame(n, a); drawScene(n, a); } // 场景盖在连线之上
  minimap();
  ctx.globalAlpha = 1;
  // 视野中心落在哪个打开的方框里 → 面包屑
  const a = avail(), fx = a.x + a.w / 2, fy = a.y + a.h / 2; let f = ROOT;
  for (const [n, al] of frames) if (al > .55 && n.depth > f.depth && fx > n.sx && fx < n.sx + n.sw && fy > n.sy && fy < n.sy + n.sh) f = n;
  if (f !== focus) { focus = f; crumbs(); }
  if (sel?.scene && sel.step !== shownStep) { shownStep = sel.step; panelEl.querySelectorAll('.steps li').forEach((li, i) => li.classList.toggle('on', i === shownStep)); }
  requestAnimationFrame(frame);
}
function hit(px, py) {
  for (let i = cards.length - 1; i >= 0; i--) { const [n, a] = cards[i]; if (a > .35 && px >= n.sx && px <= n.sx + n.sw && py >= n.sy && py <= n.sy + n.sh) return n; }
  for (let i = frames.length - 1; i >= 0; i--) { const [n, a] = frames[i]; if (a > .35 && px >= n.sx && px <= n.sx + n.sw && py >= n.sy && py <= n.sy + n.sh) return n; }
  return null;
}

// ---------- 选中、面板、目录、面包屑 ----------
let shownStep = -1; const openD = { code: false, who: false };
function select(n, force) {
  sel = n && n !== ROOT ? n : null; panel();
  history.replaceState(null, '', sel ? '#' + sel.id : location.pathname + location.search);
  const v = fitView(n || ROOT);
  if (force || (n && cam.s < v.s * 1.5)) go(v); // 点击只会放大或对齐；点空白处只是取消选中，不会把你从深处拽出来
  tocEl.querySelectorAll('[data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === sel?.id));
}
function highlight(code) { // 极简着色：注释和字符串
  return esc(code).replace(/(^|\s)((?:#|\/\/|--) .*)$/gm, '$1<i>$2</i>').replace(/(&quot;[^&\n]*?&quot;|'[^'\n]*')/g, '<b>$1</b>');
}
function panel() {
  const n = sel; shownStep = -1;
  panelEl.hidden = !n; document.body.classList.toggle('has-panel', !!n);
  if (!n) return;
  const ti = TOURN.indexOf(n), prev = TOURN[ti - 1], next = ti >= 0 ? TOURN[ti + 1] : null;
  // 原片时间是一个不显眼的入口：跳到旧版里对应的那一节，那里可以直接播放原片
  const v1 = V1[n.id] || (/^\d+\.\d+$/.test(n.no || '') ? n.no.replace('.', '/') : ''), href = 'v1/#' + (v1 ? 'chapter/' + v1 : n.ch ? 'chapter/' + n.ch : 'intro');
  const kick = [n.ch != null ? esc(String(n.ch).padStart(2, '0') + ' ' + CH[n.ch]) : '', n.at ? `<a href="${href}" title="${esc(UI.filmTip)}">${UI.film} ${n.at} ↗</a>` : ''].filter(Boolean).join(' · ');
  panelEl.innerHTML = `<button class="x" data-act="close" aria-label="${UI.close}">×</button>
<p class="kick">${kick}</p>
<h2>${n.no ? `<i>${n.no}</i>` : ''}${esc(n.title)}</h2>${n.sub ? `<p class="sub">${esc(n.sub)}</p>` : ''}
<p class="desc">${esc(n.desc || '')}</p>
${n.steps ? `<h3>${UI.steps}</h3><ol class="steps">${n.steps.map((s, i) => `<li><button data-step="${i}">${esc(s)}</button></li>`).join('')}</ol>` : ''}
${n.kids.length ? `<h3>${UI.inside}</h3><div class="kids">${n.kids.map(k => `<button data-go="${k.id}">${esc(k.title)}</button>`).join('')}</div>` : ''}
${n.fw && NODE.fw.up !== n ? `<div class="kids fwgo"><button data-go="fw">${UI.fwGo}</button></div>` : ''}
${n.note ? `<p class="note"><b>${UI.note}</b>${esc(n.note)}</p>` : ''}
${n.code ? `<details data-d="code"${openD.code ? ' open' : ''}><summary>${UI.code}<small>${esc(n.lang || '')}</small></summary><pre><code>${highlight(n.code.trim())}</code></pre></details>` : ''}
${n.vendors ? `<details data-d="who"${openD.who ? ' open' : ''}><summary>${UI.who}</summary>${n.vendors.map(([label, list]) => `<p class="vl">${esc(label)}</p><div class="chips">${list.map(v => `<span>${esc(v)}</span>`).join('')}</div>`).join('')}</details>` : ''}
<nav class="pn"><button data-go="${n.up === ROOT ? '' : n.up.id}" data-force="1">↑ ${esc(n.up === ROOT ? UI.home : n.up.title)}</button>${prev ? `<button data-go="${prev.id}" data-force="1" title="${esc(prev.title)}">← ${UI.prev}</button>` : ''}${next ? `<button data-go="${next.id}" data-force="1" title="${esc(next.title)}">${UI.next} →</button>` : ''}</nav>`;
  panelEl.scrollTop = 0;
}
panelEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.act === 'close') select(null);
  else if (b.dataset.step) { sel.t0 = time - sel.scene.cuts[+b.dataset.step] - .01; }
  else if ('go' in b.dataset) select(NODE[b.dataset.go] || null, true);
});
panelEl.addEventListener('toggle', e => { if (e.target.dataset?.d) openD[e.target.dataset.d] = e.target.open; }, true);

function crumbs() {
  focusPath = []; for (let n = focus; n && n !== ROOT; n = n.up) focusPath.unshift(n);
  crumbEl.innerHTML = `<button data-go="">${UI.home}</button>` + focusPath.map(n => `<span>›</span><button data-go="${n.id}">${esc(n.title)}</button>`).join('');
}
crumbEl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(NODE[b.dataset.go] || null, true); });

tocEl.innerHTML = `<h2>${UI.toc}</h2><p>${UI.tocNote}</p><h3>${UI.ask}</h3>` + ASK.map(([q, id]) => `<button data-go="${id}">${esc(q)}</button>`).join('') + CH.map((name, c) => {
  const items = TOURN.filter(n => n.ch === c); if (!items.length) return '';
  return `<h3><i>${String(c).padStart(2, '0')}</i>${esc(name)}</h3>` + items.map(n => `<button data-go="${n.id}">${n.no ? `<i>${n.no}</i>` : ''}${esc(n.title)}</button>`).join('');
}).join('') + `<p class="old"><a href="v1/">${UI.old}</a></p>`;
tocEl.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (!b) return; if (W < 900) toggleToc(false); select(NODE[b.dataset.go], true); });
function toggleToc(on = tocEl.hidden) { tocEl.hidden = !on; $('#b-toc').setAttribute('aria-pressed', on); if (last && !sel && focus === ROOT) go(fitView(ROOT)); }

// ---------- 输入 ----------
const ptr = new Map(); let moved = 0, pinch = 0, touchedOnce = false;
function touched() { if (!touchedOnce) { touchedOnce = true; hintEl.classList.add('gone'); } }
cv.addEventListener('wheel', e => {
  e.preventDefault(); touched();
  zoomAt(e.offsetX, e.offsetY, Math.exp(-e.deltaY * (e.deltaMode ? 30 : 1) * (e.ctrlKey ? .01 : .0017)));
}, { passive: false });
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.offsetX, e.offsetY]); moved = ptr.size > 1 ? 99 : 0; anim = null; zoomA = null; pinch = 0;
  cv.classList.add('drag');
});
cv.addEventListener('pointermove', e => {
  const p = ptr.get(e.pointerId);
  if (!p) { const h = hit(e.offsetX, e.offsetY); if (h !== hover) { hover = h; cv.classList.toggle('over', !!h); } return; }
  const dx = e.offsetX - p[0], dy = e.offsetY - p[1]; p[0] = e.offsetX; p[1] = e.offsetY; moved += Math.abs(dx) + Math.abs(dy);
  if (ptr.size === 1) { if (moved > 4) { cam.x -= dx / cam.s; cam.y -= dy / cam.s; touched(); } return; }
  const [a, b] = [...ptr.values()], dist = Math.hypot(a[0] - b[0], a[1] - b[1]), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  if (pinch) { const wx = cam.x + mx / cam.s, wy = cam.y + my / cam.s; cam.s = clamp(cam.s * dist / pinch, minS, maxS); cam.x = wx - mx / cam.s - dx / 2 / cam.s; cam.y = wy - my / cam.s - dy / 2 / cam.s; }
  pinch = dist; touched();
});
const release = e => {
  if (!ptr.delete(e.pointerId)) return; pinch = 0;
  if (!ptr.size) { cv.classList.remove('drag'); if (moved < 5 && e.type === 'pointerup') { touched(); const n = hit(e.offsetX, e.offsetY), s = n?.strip; s && e.offsetX >= s[0] && e.offsetX <= s[0] + s[2] && e.offsetY >= s[1] && e.offsetY <= s[1] + s[3] ? select(NODE.fw, true) : select(n); } }
};
cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', release);
cv.addEventListener('pointerleave', () => { hover = null; });
addEventListener('keydown', e => {
  if (e.target.closest?.('input,textarea,summary') || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key, pan = 90 / cam.s;
  if (k === '+' || k === '=') zoomAt(W / 2, H / 2, 1.5);
  else if (k === '-' || k === '_') zoomAt(W / 2, H / 2, 1 / 1.5);
  else if (k === '0') select(null, true);
  else if (k === 'Escape') { if (!tocEl.hidden && W < 900) toggleToc(false); else select(sel ? (sel.up === ROOT ? null : sel.up) : focus.up && focus.up !== ROOT ? focus.up : null, true); }
  else if (k === ' ' && e.target === cv) togglePause();
  else if (k === 'ArrowLeft' && e.target === cv) cam.x -= pan; else if (k === 'ArrowRight' && e.target === cv) cam.x += pan;
  else if (k === 'ArrowUp' && e.target === cv) cam.y -= pan; else if (k === 'ArrowDown' && e.target === cv) cam.y += pan;
  else if (k === ']' || k === '[') { const i = TOURN.indexOf(sel), n = TOURN[k === ']' ? i + 1 : i < 0 ? 0 : i - 1]; if (n) select(n, true); }
  else return;
  e.preventDefault(); touched();
});
function togglePause() { paused = !paused; const b = $('#b-pause'); b.textContent = paused ? UI.play : UI.pause; b.setAttribute('aria-pressed', paused); }
$('#zoom').addEventListener('click', e => {
  const z = e.target.closest('button')?.dataset.z; if (!z) return;
  const a = avail(); z === 'home' ? select(null, true) : zoomAt(a.x + a.w / 2, a.y + a.h / 2, z === 'in' ? 1.7 : 1 / 1.7);
});
$('#b-toc').onclick = () => toggleToc(); $('#b-pause').onclick = togglePause;
$('.brand').onclick = e => { e.preventDefault(); select(null, true); };

// ---------- 界面文字与启动 ----------
$('.brand span').textContent = UI.brand; $('#b-toc').textContent = UI.toc; $('#b-pause').textContent = paused ? UI.play : UI.pause;
$('#b-src').textContent = UI.source; hintEl.textContent = matchMedia('(pointer: coarse)').matches ? UI.hintTouch : UI.hint; cv.setAttribute('aria-label', UI.aria);
const lang = $('#b-lang'); lang.textContent = UI.other; lang.href = UI.otherHref; lang.onclick = () => { lang.href = UI.otherHref + location.hash; };
document.querySelectorAll('#zoom button').forEach(b => { b.title = UI['z' + b.dataset.z]; b.setAttribute('aria-label', b.title); });
addEventListener('resize', () => {
  const atHome = !sel && focus === ROOT && !anim, cx = cam.x + W / 2 / cam.s, cy = cam.y + H / 2 / cam.s, k = cam.s / home;
  resize(); if (atHome) return go(fitView(ROOT), true);
  cam.s = k * home; cam.x = cx - W / 2 / cam.s; cam.y = cy - H / 2 / cam.s;
});
addEventListener('hashchange', () => { const n = NODE[location.hash.slice(1)]; if (n && n !== sel) select(n, true); });
resize(); crumbs();
if (W >= 1180) toggleToc(true);
const start = NODE[location.hash.slice(1)];
if (start && start !== ROOT) { if (PH == null) { sel = start; panel(); } go(fitView(start), true); } else go(fitView(ROOT), true);
requestAnimationFrame(frame);
})();
