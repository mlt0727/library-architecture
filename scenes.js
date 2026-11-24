'use strict';
// 39 个常驻循环的小场景。每个场景画在 1000×625 的板面上（上方 70 留给标题，下方 550 以后留给字幕）。
// sc(id, 一轮的秒数, 每一步的起始秒, draw)。k 是 engine.js 里的工具箱：
// k.t 当前秒，k.i 当前步；k.p(a,b)/k.e(a,b) 时间段进度；k.go(折线, a, b, 色, 标签) 在 a~b 秒让数据包走完折线。
const SCENES = {};
const sc = (id, d, cuts, draw) => { SCENES[id] = { d, cuts, draw }; };
const WHITE = '#fffdf9';
const commit = (k, x, y, label, tone = 'purple', a = 1) => k.al(a, () => { k.dot(x, y, 20, tone); k.dot(x, y, 17, WHITE); k.mono(x, y + 1, label, 14, tone, 'center', 700); });
const tag = (k, x, y, s, tone) => k.pill(x, y, s, tone, 14);

// ---------- 课设起点 ----------
sc('s00', 12, [0, 3, 6, 9], k => {
  const msg = t('帮我写一个图书管理系统：能查书、借书、还书。', 'Build me a library system: search, borrow and return books.');
  k.rect(36, 96, 300, 190, 'line', { fill: '#fff' });
  k.txt(56, 124, t('提示词', 'Prompt'), 16, 'orange', 'left', 700);
  k.para(56, 160, msg.slice(0, Math.ceil(msg.length * k.p(.2, 2))), 262, 18);
  k.ic('clock', 74, 341, 34, 'soft');
  k.mono(104, 342, String(k.i ? 10 : Math.round(k.p(.4, 2.8) * 10)).padStart(2, '0') + ':00', 30, 'ink', 'left', 700);
  k.txt(56, 392, t('十分钟后，它能跑了', 'Ten minutes later, it runs'), 17, 'soft', 'left');
  k.rect(376, 96, 590, 322, 'ink', { fill: '#fdfbf6', lw: 3, r: 16 }); k.ln([352, 430, 990, 430], 'ink', { w: 6 });
  k.mono(671, 140, 'localhost:8080', 17, 'muted');
  k.ln([540, 250, 610, 250]); k.ln([750, 250, 820, 250]);
  const T = k.t;
  k.box(400, 200, 140, 100, t('浏览器', 'Browser'), T > 10.4 ? t('借阅成功', 'Borrowed') : t('图书列表', 'book list'), 'blue', { hot: T > 10.4 || k.on(3, 3.4), st: T > 10.4 ? 'green' : 'soft' });
  k.box(610, 200, 140, 100, t('后端', 'Backend'), '1 × JAR', 'orange', { hot: k.on(4.6, 6.2) || k.on(8.8, 9.2) });
  k.cyl(820, 185, 125, 130, 'MySQL', T > 7.4 && T < 12 ? 'stock 2' : 'stock 3', 'indigo', { hot: k.on(7.4, 8) });
  k.go([540, 250, 610, 250], 3.3, 4.6, 'blue', 'POST'); k.go([750, 250, 820, 250], 6.2, 7.4, 'blue', 'UPDATE');
  k.go([820, 250, 750, 250], 7.6, 8.8, 'green'); k.go([610, 250, 540, 250], 9.2, 10.4, 'green', '200');
  k.who(470, 468, 'orange', t('写借书', 'borrow')); k.who(680, 468, 'teal', t('写还书', 'return')); k.who(885, 468, 'purple', t('写页面', 'pages'));
});
sc('s21', 14, [0, 3.5, 7, 10.5], k => {
  const ys = [130, 250, 370], i = k.i, shut = i === 1;
  ys.forEach(y => k.who(80, y - 8, 'blue'));
  k.txt(80, 440, t('全校同学', 'the campus'), 16, 'soft');
  k.al(i >= 2 ? k.e(7, 7.8) : .25, () => k.box(690, 110, 240, 130, t('服务器', 'Server'), i === 3 ? 'lib.example.edu.cn' : t('云服务器 · 一直开机', 'cloud server · always on'), 'teal', { hot: i === 3, mono: i === 3 }));
  k.box(330, 330, 190, 120, t('同学的笔记本', 'A classmate\'s laptop'), shut ? t('已合盖', 'lid closed') : 'localhost:8080', shut ? 'red' : 'orange', { dim: shut || i === 3, st: shut ? 'red' : 'soft', mono: !shut });
  ys.forEach((y, j) => {
    const lap = [120, y, 330, 390], srv = [120, y, 690, 175];
    if (i === 0) { k.ln(lap, 'line', { a: .7 }); k.go(lap, .3 + j * .5, 1.5 + j * .5, 'blue'); k.go([330, 390, 120, y], 1.7 + j * .5, 2.9 + j * .5, 'green'); }
    if (shut) {
      k.ln(lap, 'line', { a: .7, dash: 1 }); const p = k.p(3.8 + j * .5, 5 + j * .5);
      if (p > 0) { const [x, yy] = k.pkt(lap, Math.min(p, .7), p > .7 ? 'red' : 'blue'); if (p > .7) k.no(x + 26, yy, 9); }
    }
    if (i === 3) { k.ln(srv, 'line', { a: .7 }); k.go(srv, 10.7 + j * .5, 11.9 + j * .5, 'blue'); k.go([690, 175, 120, y], 12.1 + j * .5, 13.3 + j * .5, 'green'); }
  });
  if (shut) { k.mono(425, 485, 'localhost = 127.0.0.1', 16, 'red'); k.txt(425, 512, t('只指向自己这台机器', 'points only at your own machine'), 15, 'soft'); }
  if (i === 2) { k.ln([520, 390, 810, 240], 'purple', { dash: 1, a: .6 }); k.go([520, 390, 810, 240], 7.6, 9.6, 'purple', 'library.jar'); }
});
sc('s22', 14, [0, 3.5, 7, 10.5], k => {
  const i = k.i;
  if (i < 2) {
    const g = k.e(3.5, 5), w = k.lerp(200, 300, g), h = k.lerp(140, 200, g), cpu = i ? k.lerp(1, .5, g) : k.p(0, 2.4);
    k.al(i ? 1 : 1, () => {
      k.box(500 - w / 2, 250 - h / 2, w, h, t('服务器', 'Server'), i && g > .5 ? '32 vCPU · 64 GB' : '4 vCPU · 8 GB', cpu > .9 ? 'red' : 'teal', { hot: cpu > .9 });
      k.txt(500 - w / 2, 250 + h / 2 + 32, 'CPU', 15, 'soft', 'left'); k.bar(500 - w / 2 + 44, 250 + h / 2 + 25, w - 110, 14, cpu, cpu > .9 ? 'red' : 'teal');
      k.mono(500 + w / 2, 250 + h / 2 + 32, Math.round(cpu * 100) + '%', 16, cpu > .9 ? 'red' : 'soft', 'right');
    });
    if (!i) for (let j = 0; j < Math.floor(k.p(.8, 3.3) * 8); j++) k.dot(360 - j * 30, 250, 9, 'blue', .85);
    if (!i && k.t > 1.2) k.txt(230, 205, t('请求在排队', 'requests queue up'), 16, 'red');
    if (i && k.t > 5.2) k.pill(500, 462, t('有上限 · 仍是单点', 'capped · still a single point'), 'orange');
  } else {
    [0, 1, 2].forEach(j => k.al(k.e(7.1 + j * .6, 7.8 + j * .6), () => {
      k.box(620, 105 + j * 130, 220, 96, t('实例 ', 'Instance ') + (j + 1), '4 vCPU', 'teal');
      k.bar(866, 147 + j * 130, 90, 12, i === 3 ? .35 : .5, 'teal');
    }));
    if (i === 2 && k.t > 9.2) k.pill(300, 300, t('谁来分配请求？', 'Who spreads the requests?'), 'orange');
    if (i === 3) {
      k.box(300, 255, 150, 90, 'Nginx', t('入口', 'entry'), 'blue', { hot: 1 });
      [0, 1, 2].forEach(j => k.ln([450, 300, 620, 153 + j * 130]));
      k.ln([60, 300, 300, 300]);
      for (let j = 0; j < 6; j++) k.go([60, 300, 300, 300, 450, 300, 620, 153 + (j % 3) * 130], 10.7 + j * .5, 12.2 + j * .5, 'blue');
    }
  }
});

// ---------- 入口 ----------
sc('sproxy', 12, [0, 6], k => {
  k.al(k.i ? .3 : 1, () => {
    k.rect(40, 100, 450, 150, 'blue', { dash: 1, fill: 0 }); k.txt(265, 272, t('客户端这一侧', 'client side'), 15, 'soft');
    k.ln([210, 175, 290, 175]); k.ln([460, 175, 760, 175]);
    k.box(60, 135, 150, 80, t('客户端', 'Client'), '', 'blue'); k.box(290, 135, 170, 80, t('正向代理', 'Forward proxy'), '', 'purple', { hot: !k.i });
    k.box(760, 135, 190, 80, t('服务器', 'Server'), t('只看到代理', 'sees only the proxy'), 'teal');
    k.go([210, 175, 290, 175], .5, 1.6, 'blue'); k.go([460, 175, 760, 175], 1.8, 3.2, 'purple', 'from: proxy');
    k.go([760, 175, 460, 175], 3.4, 4.6, 'green'); k.go([290, 175, 210, 175], 4.7, 5.6, 'green');
  });
  k.al(k.i ? 1 : .3, () => {
    k.rect(460, 315, 500, 205, 'teal', { dash: 1, fill: 0 }); k.txt(580, 500, t('服务器这一侧', 'server side'), 15, 'soft');
    k.ln([210, 415, 480, 415]); k.ln([670, 415, 780, 370]); k.ln([670, 415, 780, 460]);
    k.box(60, 375, 150, 80, t('客户端', 'Client'), t('只知道域名', 'knows only the domain'), 'blue');
    k.box(480, 375, 190, 80, t('反向代理', 'Reverse proxy'), 'Nginx', 'purple', { hot: k.i });
    k.box(780, 335, 160, 70, t('实例 A', 'Instance A'), '', 'teal'); k.box(780, 425, 160, 70, t('实例 B', 'Instance B'), '', 'teal');
    k.go([210, 415, 480, 415], 6.5, 7.8, 'blue', 'lib.example.edu.cn'); k.go([670, 415, 780, 370], 8, 9, 'blue');
    k.go([780, 370, 670, 415], 9.2, 10.2, 'green'); k.go([480, 415, 210, 415], 10.3, 11.4, 'green');
  });
});
sc('s23', 16, [0, 4, 8, 12], k => {
  const i = k.i, seq = [[0, 1, 2, 0], [0, 0, 1, 2], [1, 1, 1, 2], [0, 2, 0, 2]][i], yc = [155, 285, 415], n = [0, 0, 0], t0 = i * 4;
  k.ln([80, 285, 300, 285]); yc.forEach((y, j) => k.ln([460, 285, 680, y], 'line', { a: i === 3 && j === 1 ? .3 : 1 }));
  seq.forEach((tg, j) => { const a = t0 + .1 + j * .95; k.go([80, 285, 300, 285, 460, 285, 680, yc[tg]], a, a + 1.25, 'blue'); if (k.t >= a + 1.25) n[tg]++; });
  k.box(300, 240, 160, 90, 'Nginx', '', 'blue', { hot: 1 });
  k.pill(380, 190, [t('轮询', 'Round robin'), t('加权', 'Weighted'), t('最少连接', 'Least connections'), t('健康检查', 'Health check')][i], 'orange');
  'ABC'.split('').forEach((c, j) => {
    const dead = i === 3 && j === 1, base = [5, 2, 4][j];
    k.box(680, yc[j] - 45, 200, 90, t('实例 ', 'Instance ') + c + (i === 1 && !j ? ' · weight 2' : ''), dead ? t('已失效', 'down') : i === 2 ? t('连接数 ', 'connections ') + (base + n[j]) : '× ' + n[j], dead ? 'red' : 'teal', { dim: dead, st: dead ? 'red' : 'soft' });
  });
  k.txt(80, 250, t('请求', 'requests'), 15, 'soft');
});
sc('s24', 14, [0, 7], k => {
  const T = k.t, i = k.i, dead = !i && T > 2.2;
  k.who(90, 245, 'blue', t('学生', 'student'));
  k.ln([130, 255, 300, 255]); k.ln([470, 255, 690, 255]);
  k.box(300, 205, 170, 100, 'Nginx', '', 'blue');
  k.box(690, 205, 210, 100, t('借阅实例', 'Borrow instance'), i ? (T > 9.6 ? t('处理中…', 'working…') : t('运行中', 'running')) : dead ? t('进程已退出', 'process exited') : t('运行中', 'running'), dead ? 'red' : i && T > 9.6 ? 'orange' : 'teal', { dim: dead, st: dead ? 'red' : 'soft' });
  if (!i) {
    k.go([130, 255, 300, 255], .4, 1.6, 'blue'); const p = k.p(1.8, 3);
    if (p > 0 && T < 3.6) { const [x, y] = k.pkt([470, 255, 690, 255], Math.min(p, .86), 'blue'); if (p > .86) k.no(x + 26, y, 10); }
    k.go([300, 255, 130, 255], 3.6, 5.2, 'red', '502');
    if (T > 3.4) { k.mono(500, 400, '502 Bad Gateway', 34, 'red', 'center', 700); k.txt(500, 445, t('上游没有给出有效的响应', 'the upstream gave no valid response'), 17, 'soft'); }
  } else {
    k.go([130, 255, 300, 255], 7.4, 8.4, 'blue'); k.go([470, 255, 690, 255], 8.6, 9.6, 'blue');
    if (T > 9.6) { k.ring(795, 345, 16, 'orange', 4, (T * .8) % 1); k.bar(300, 330, 170, 12, k.p(9.6, 12), 'orange'); k.mono(385, 362, Math.round(k.p(9.6, 12) * 60) + ' s / 60 s', 15, 'soft'); }
    k.go([300, 255, 130, 255], 12.2, 13.5, 'red', '504');
    if (T > 12) { k.mono(500, 430, '504 Gateway Timeout', 34, 'red', 'center', 700); k.txt(500, 475, t('上游在时限内没有答复', 'the upstream did not answer in time'), 17, 'soft'); }
  }
});
sc('s81', 14, [0, 4, 8, 11], k => {
  const i = k.i, cy = [162, 282, 402], sy = j => 118 + j * 72, g = i ? k.e(4, 5) : 0;
  const names = [t('借阅', 'Borrow'), t('用户', 'Users'), t('馆藏', 'Catalog'), t('座位', 'Seat'), t('通知', 'Notify'), t('搜索', 'Search')];
  k.al(1 - g, () => cy.forEach((y, a) => names.forEach((_, b) => { if (k.p(.2, 3.4) * 18 > a * 6 + b) k.ln([200, y, 800, sy(b)], 'red', { a: .45, w: 1.6 }); })));
  k.al(g, () => {
    cy.forEach(y => k.ln([200, y, 430, 285])); names.forEach((_, b) => k.ln([600, 285, 800, sy(b)]));
    k.box(430, 230, 170, 110, t('API 网关', 'API gateway'), i === 2 ? t('按路径路由', 'route by path') : i === 3 ? t('再挑一台实例', 'then pick an instance') : '', 'teal', { hot: 1 });
  });
  [t('网页', 'Web'), 'App', t('小程序', 'Mini program')].forEach((s, j) => k.box(60, cy[j] - 32, 140, 64, s, '', 'blue'));
  names.forEach((s, j) => {
    if (i === 3 && j < 3) k.box(800, sy(j) - 26, 150, 52, names[0] + ' #' + (j + 1), '', 'orange', { hot: j > 0 && k.t > (j === 1 ? 12.9 : 13.8), size: 18 });
    else k.box(800, sy(j) - 26, 150, 52, s, '', 'orange', { dim: i === 3, hot: i === 2 && ((j === 0 && k.on(10.1, 11)) || (j === 3 && k.t > 10.9)), size: 18 });
  });
  if (!i && k.t > 2.6) k.pill(500, 500, t('3 × 6 = 18 条连线', '3 × 6 = 18 connections'), 'red');
  if (i === 2) {
    k.go([200, 162, 430, 285], 8.2, 9.2, 'blue', '/api/borrow'); k.go([600, 285, 800, sy(0)], 9.2, 10.1, 'blue');
    k.go([200, 282, 430, 285], 9.3, 10.1, 'purple', '/api/seat'); k.go([600, 285, 800, sy(3)], 10.1, 10.9, 'purple');
  }
  if (i === 3) { k.go([200, 162, 430, 285, 600, 285, 800, sy(1)], 11.3, 12.9, 'blue'); k.go([200, 402, 430, 285, 600, 285, 800, sy(2)], 12.2, 13.8, 'blue'); }
});
sc('s82', 15, [0, 5, 10], k => {
  const T = k.t, i = k.i, Y = 335; // 请求沿下方的通道走，每到一关向上“过检”
  k.rect(190, 140, 560, 265, 'teal', { dash: 1 }); k.txt(212, 166, t('API 网关', 'API gateway'), 17, 'teal', 'left', 700);
  k.who(70, Y - 12, 'blue'); k.ln([100, Y, 820, Y]);
  const [pts, a, b, label] = [[[100, Y, 820, Y], .3, 4.2], [[100, Y, 290, Y], 5.3, 6.6, 'Cookie'], [[100, Y, 470, Y], 10.3, 12, 'X-User-Id']][i];
  const p = k.p(a, b), px = p > 0 ? pts[0] + (pts[2] - pts[0]) * p * p * (3 - 2 * p) : 0; // 包走到哪，哪一关就亮
  const bad = [-1, i === 1 && T > 6.6 ? 0 : -1, i === 2 && T > 12 ? 1 : -1][i];
  [t('认证', 'Auth'), t('限流', 'Rate limit'), t('路由', 'Route')].forEach((s, j) => {
    const x = 220 + j * 180, pass = px > x + 70 && bad !== j;
    k.ln([x + 70, 280, x + 70, Y], bad === j ? 'red' : pass ? 'green' : 'line', { w: 3 }); k.dot(x + 70, Y, 6, bad === j ? 'red' : pass ? 'green' : 'line');
    k.box(x, 195, 140, 85, s, bad === j ? ['401', '429'][j] : pass ? '✓' : '', bad === j ? 'red' : pass ? 'green' : 'teal', { hot: bad === j || pass, st: bad === j ? 'red' : 'green' });
  });
  k.bar(400, 362, 140, 10, i === 2 ? (T > 12 ? 0 : .12) : .6, i === 2 ? 'red' : 'teal'); k.txt(470, 387, i === 2 ? t('令牌用完了', 'no tokens left') : t('令牌桶', 'token bucket'), 13, 'soft');
  if (i === 1 && T > 6.6) k.txt(290, 372, t('会话已过期', 'session expired'), 14, 'red');
  k.box(820, Y - 45, 150, 90, t('借阅服务', 'Borrow'), !i && T > 4.2 ? 'user 2023…' : '', 'orange', { hot: !i && T > 4.2, dim: i > 0 });
  if (p > 0 && p < 1) k.pkt(pts, p, 'blue', label || (px < 300 ? 'Cookie' : 'X-User-Id'));
  k.go([290, Y, 100, Y], 7, 8.2, 'red', '401'); k.go([470, Y, 100, Y], 12.4, 13.8, 'red', '429');
  if (i === 2) { k.mono(30, 432, 'while true; do curl … & done', 13, 'red', 'left'); k.txt(30, 456, t('抢座脚本 · 上限每人 10 次/秒', 'seat-grabbing script · limit 10/s per user'), 13, 'soft', 'left'); }
});

// ---------- 微服务 ----------
sc('s51', 15, [0, 4, 8, 11.5], k => {
  const i = k.i, g = i ? k.e(4, 5.6) : 0;
  const cells = [[t('借阅', 'Borrow'), 'orange'], [t('用户', 'Users'), 'blue'], [t('馆藏', 'Catalog'), 'teal'], [t('座位', 'Seat'), 'purple'], [t('通知', 'Notify'), 'yellow'], [t('搜索', 'Search'), 'pink']];
  k.al(1 - g, () => { k.rect(322, 130, 356, 290, 'ink', { fill: '#fdfbf6', lw: 3, r: 14 }); k.mono(500, 160, 'library.jar', 20, 'ink', 'center', 700); });
  cells.forEach(([s, tone], j) => {
    const c = j % 3, r = (j / 3) | 0, x = k.lerp(346 + c * 106, 100 + c * 300, g), y = k.lerp(190 + r * 106, 130 + r * 200, g), w = k.lerp(96, 200, g), h = k.lerp(92, 110, g);
    const oom = i === 3 && j === 3;
    if (!j && i >= 2) [2, 1].forEach(d => k.al(k.e(8.2 + (2 - d) * .7, 8.9 + (2 - d) * .7), () => k.box(x + d * 12, y + d * 12, w, h, '', '', tone)));
    k.box(x, y, w, h, s, oom ? 'OutOfMemory' : !j && i >= 2 && k.t > 9.6 ? '× 3' : '', oom ? 'red' : tone, { hot: oom, dim: oom && k.blink(1.5) > .6, st: oom ? 'red' : 'soft' });
    if (g > .95) k.ic('db', x + w - 24, y + h - 22, 26, oom ? 'red' : tone); // 每个服务有自己的库
  });
  if (i === 1 && k.t > 6) k.pill(500, 490, t('各有各的代码仓库和数据库', 'each with its own repository and database'), 'teal', 16);
  if (!i) k.pill(500, 478, t('一起发布 · 一起扩容 · 一起挂', 'shipped together · scaled together · down together'), 'orange');
  if (i === 3) { k.go([20, 185, 100, 185], 11.8, 12.6, 'blue'); k.go([20, 185, 100, 185], 13, 13.8, 'blue'); k.pill(200, 296, t('借书照常', 'borrowing still works'), 'green'); }
});
sc('s52', 15, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i;
  if (!i) {
    k.rect(240, 130, 520, 290, 'ink', { dash: 1, fill: '#fdfbf6' }); k.txt(262, 158, t('一个进程 · library.jar', 'one process · library.jar'), 16, 'soft', 'left');
    k.ln([470, 285, 530, 285]); k.box(280, 240, 190, 90, 'borrow()', '', 'orange', { mono: 1 }); k.box(530, 240, 190, 90, 'deductStock()', '', 'teal');
    k.pkt([470, 285, 530, 285], (T % .8) / .8, 'blue'); k.mono(500, 372, '≈ 5 ns', 20, 'green', 'center', 700);
    return;
  }
  k.rect(40, 120, 380, 340, 'orange', { dash: 1 }); k.txt(60, 147, t('借阅服务 · 机器 A', 'Borrow service · machine A'), 16, 'orange', 'left', 700);
  k.rect(580, 120, 380, 340, 'teal', { dash: 1 }); k.txt(600, 147, t('馆藏服务 · 机器 B', 'Catalog service · machine B'), 16, 'teal', 'left', 700);
  k.txt(500, 150, t('网络', 'network'), 15, 'muted'); k.ln([420, 300, 580, 300], 'line', { dash: 1 }); k.ln([580, 345, 420, 345], 'line', { dash: 1 });
  k.mono(230, 200, 'deductStock(isbn, 1)', 18, 'ink');
  k.ln([230, 222, 230, 262], 'muted', { arrow: 1 }); k.txt(250, 242, t('编码', 'encode'), 14, 'soft', 'left');
  const bytes = '0A 0D 39 37 38 37 31 31 …'; k.mono(230, 290, i > 1 ? bytes : bytes.slice(0, Math.ceil(bytes.length * k.p(4.4, 6.6))), 17, 'blue');
  if (i === 2) {
    k.go([420, 300, 580, 300], 8.2, 9.4, 'blue', 'bytes');
    if (T > 9.4) { k.txt(600, 242, t('解码', 'decode'), 14, 'soft', 'left'); k.mono(770, 210, 'isbn="978…937", n=1', 17, 'ink'); }
    if (T > 10) k.mono(770, 290, 'stock 3 → 2', 20, 'teal', 'center', 700);
    k.go([580, 345, 420, 345], 10.4, 11.6, 'green', 'OK'); if (T > 11.6) k.pill(230, 370, 'OK', 'green');
  }
  if (i === 3) {
    const p = k.p(12.2, 13.2); if (p > 0) k.al(1 - k.p(13, 13.6), () => k.pkt([420, 300, 500, 300], p, 'blue'));
    if (T > 13) k.no(500, 300, 11);
    k.bar(130, 360, 200, 12, k.p(12.2, 14.2), 'orange'); k.mono(230, 392, 'timeout 500 ms', 15, 'soft');
    if (T > 14.2) k.mono(230, 430, 'TimeoutException', 18, 'red', 'center', 700);
    k.txt(770, 290, t('没收到，或者还在忙', 'never got it, or still busy'), 16, 'muted');
  }
});
sc('s53', 15, [0, 4, 8, 11.5], k => {
  const T = k.t, i = k.i, L = (y, s, tone = 'ink') => k.mono(326, y, s, 18, tone, 'left');
  k.rect(300, 88, 400, 196, 'line', { fill: '#fbf8f0' });
  L(116, 'message BorrowReq {'); L(148, '  string isbn   = 1;');
  if (i === 3) L(180, '  string campus = 2;', 'red'); else L(180, '  int32  days   = 2;');
  if (i === 2) L(212, '  string campus = 3;', 'teal'); L(244, '}');
  k.ln([400, 284, 240, 380], 'purple', { arrow: 1, a: i ? 1 : .35 }); k.ln([600, 284, 760, 380], 'purple', { arrow: 1, a: i ? 1 : .35 });
  if (i) k.mono(500, 330, 'protoc', 16, 'purple');
  k.go([400, 284, 240, 380], 4.3, 5.8, 'purple'); k.go([600, 284, 760, 380], 4.3, 5.8, 'purple');
  k.box(90, 380, 270, 96, t('Java · 借阅端', 'Java · borrow side'), i >= 2 ? t('新版本', 'new version') : i ? 'BorrowReq.java' : '', 'orange', { hot: i === 1 && T > 5.8 });
  k.box(640, 380, 270, 96, t('Go · 馆藏端', 'Go · catalog side'), i >= 2 ? t('旧版本', 'old version') : i ? 'borrow_req.go' : '', 'teal', { hot: i === 1 && T > 5.8 });
  if (i >= 2) k.ln([360, 428, 640, 428]);
  k.go([360, 428, 640, 428], 9, 10.6, 'blue', '1 · 2 · 3'); k.go([360, 428, 640, 428], 12.2, 13.6, 'red', '2 = "east"');
  if (i === 2 && T > 10.6) k.txt(775, 508, t('读 1 ✓　读 2 ✓　3 不认识：跳过', 'read 1 ✓  read 2 ✓  tag 3 unknown: skip'), 17, 'green', 'center', 600, 420);
  if (i === 3 && T > 13.6) k.txt(775, 508, t('把校区当成“天数”来读：数据错乱', 'reads the campus as “days”: garbage'), 17, 'red', 'center', 600, 420);
});
sc('s54', 14, [0, 5, 9], k => {
  const T = k.t, i = k.i, js = '{"isbn":"9787111544937","days":14}', pb = ['0A', '0D', ...'9787111544937', '10', '0E'];
  const nj = i ? 34 : Math.floor(k.p(.3, 4) * 34), np = !i ? 0 : i === 1 ? Math.floor(k.p(5.2, 8) * 17) : 17;
  k.mono(500, 96, 'isbn = "9787111544937"    days = 14', 18, 'soft');
  k.txt(42, 138, 'JSON', 18, 'orange', 'left', 700); k.mono(958, 138, nj + ' bytes', 18, 'orange', 'right', 700);
  for (let j = 0; j < nj; j++) { k.rect(42 + j * 27, 158, 25, 38, 'orange', { r: 5, lw: 1.2 }); k.mono(54.5 + j * 27, 178, js[j], 16, 'ink'); }
  k.txt(42, 246, 'Protobuf', 18, 'teal', 'left', 700); if (i) k.mono(958, 246, np + ' bytes', 18, 'teal', 'right', 700);
  for (let j = 0; j < np; j++) {
    const tg = j === 0 || j === 15, tone = tg ? 'purple' : j === 1 ? 'yellow' : 'teal';
    k.rect(42 + j * 46, 266, 43, 38, tone, { r: 5, lw: 1.2 }); k.mono(63.5 + j * 46, 286, pb[j], 16, 'ink');
  }
  if (np > 0) k.txt(63, 322, t('1 号', 'tag 1'), 13, 'purple'); if (np > 1) k.txt(110, 322, t('长度', 'length'), 13, 'yellow'); if (np > 15) k.txt(753, 322, t('2 号', 'tag 2'), 13, 'purple');
  k.al(i === 2 ? 1 : .3, () => {
    k.ln([350, 445, 650, 445]);
    k.box(130, 400, 220, 90, t('借阅 · 桩', 'Borrow · stub'), 'DeductStock()', 'orange', { mono: 1 });
    k.box(650, 400, 220, 90, t('馆藏 · 服务端', 'Catalog · server'), i === 2 && T > 11 ? t('解码 → 执行', 'decode → run') : '', 'teal', { hot: i === 2 && T > 11 && T < 11.6 });
  });
  k.go([350, 445, 650, 445], 9.4, 11, 'blue', '17 bytes · HTTP/2'); k.go([650, 445, 350, 445], 11.6, 13, 'green', 'reply');
});
sc('s71', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, f = Math.floor;
  const nu = !i ? f(k.p(.3, 3.5) * 8) : i < 3 ? 8 : 8 - f(k.p(12.5, 15) * 7), nb = !i ? 0 : i === 1 ? f(k.p(4.2, 7.5) * 8) : i === 2 ? 8 : 8 - f(k.p(12.3, 14.5) * 7);
  const pool = (x, title, n, tone) => {
    k.rect(x, 120, 220, 230, tone, { dash: 1 }); k.txt(x + 110, 148, title, 17, tone, 'center', 700);
    for (let j = 0; j < 8; j++) k.rect(x + 20 + (j % 4) * 46, 178 + f(j / 4) * 46, 38, 38, j < n ? 'red' : 'green', { r: 7, fill: j < n ? k.col('red') : undefined, lw: j < n ? 0 : 1.5, a: j < n ? .85 : 1 });
    k.mono(x + 110, 300, n + ' / 8', 20, n > 6 ? 'red' : 'soft', 'center', 700); k.txt(x + 110, 326, t('线程在等', 'threads waiting'), 14, 'soft');
  };
  k.ln([180, 235, 230, 235]); k.ln([450, 235, 520, 235]); k.ln([740, 235, 820, 235]);
  k.box(50, 180, 130, 110, t('网关', 'Gateway'), i === 2 && T > 9 ? '504' : i === 3 && T > 14.5 ? '200' : '', i === 2 && T > 9 ? 'red' : 'blue', { hot: i === 2 && T > 9, st: i === 3 ? 'green' : 'red' });
  pool(230, t('借阅服务', 'Borrow service'), nb, 'orange'); pool(520, t('用户服务', 'User service'), nu, 'blue');
  k.cyl(820, 165, 140, 150, 'MySQL', i === 3 && T > 14 ? '' : t('慢 SQL', 'slow SQL'), 'indigo', { st: 'red' });
  if (i < 3 || T < 14) k.ring(890, 345, 14, 'red', 4, (T * .6) % 1);
  k.pkt([740, 235, 820, 235], (T % 1.1) / 1.1, 'blue');
  if (i >= 1) k.pkt([450, 235, 520, 235], ((T + .4) % 1.3) / 1.3, 'blue');
  if (i >= 2) k.pkt([180, 235, 230, 235], ((T + .2) % 1.2) / 1.2, 'blue');
  if (i === 2 && T > 9) { k.who(115, 400, 'blue'); k.txt(115, 458, t('学生看到 504', 'the student sees 504'), 15, 'red'); }
  if (i === 3) k.pill(485, 420, t('超时 500 ms · 最多重试 1 次', 'timeout 500 ms · retry at most once'), 'teal', 19);
  if (i === 3 && T > 13) k.txt(485, 470, t('等待有了尽头，线程按时释放', 'waiting now ends, and threads are released on time'), 16, 'soft');
});
// ---- 通信框架：按一次调用的先后 ----
sc('s7a', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, iy = [120, 255, 390], ips = ['10.0.1.5', '10.0.1.6', '10.0.1.7'], have = i > 0 || T > 2.6;
  const pick = i === 1 ? Math.min(2, Math.floor((T - 4.2) / 1.2)) : -1, slow = i === 3, kept = i === 2 && T > 9.4;
  const busy = slow ? Math.min(4, Math.floor(k.p(12.3, 15) * 4) + 1) : 0;
  k.ln([160, 160, 160, 215], 'line', { dash: 1 });
  ips.forEach((_, j) => { const hot = (kept && !j) || (slow && j === 1); k.ln([390, 360, 700, iy[j] + 40], slow && j === 1 ? 'red' : kept && !j ? 'teal' : 'line', { w: hot ? 4 : 2 }); });
  k.box(60, 92, 200, 68, t('注册中心', 'Registry'), 'users → 3', 'teal', { mono: 1 });
  k.rect(60, 215, 330, 290, 'orange', { fill: WHITE }); k.txt(80, 243, t('借阅服务里的框架', 'framework inside Borrow'), 16, 'orange', 'left', 700);
  k.txt(80, 280, t('本地地址表', 'local address list'), 13, 'soft', 'left'); k.txt(248, 280, t('连接池', 'connection pool'), 13, 'soft', 'left');
  ips.forEach((ip, j) => { if (pick === j) k.rect(74, 296 + j * 34, 150, 28, 'orange', { r: 6, lw: 0 }); k.mono(84, 310 + j * 34, have ? ip : '—', 16, have ? 'ink' : 'muted', 'left', 700); });
  for (let m = 0; m < 4; m++) {
    const on = (kept && !m) || slow, red = slow && m < busy;
    k.rect(248 + (m % 2) * 64, 296 + ((m / 2) | 0) * 38, 56, 30, red ? 'red' : on ? 'teal' : 'line', { r: 6, dash: !on, fill: red ? k.col('red') : on ? k.col('teal', 1) : 0, lw: red ? 0 : 1.5 });
  }
  ips.forEach((ip, j) => k.box(700, iy[j], 230, 80, t('用户服务', 'users'), ip, slow && j === 1 ? 'red' : 'blue', { mono: 1, hot: pick === j || (slow && j === 1) }));
  if (slow) k.ring(958, iy[1] + 40, 11, 'red', 4, (T * .6) % 1);
  if (!i) { k.go([160, 215, 160, 160], .5, 1.4, 'blue', 'lookup'); k.go([160, 160, 160, 215], 1.6, 2.6, 'green'); }
  if (i === 1 && pick >= 0) { const a = 4.2 + pick * 1.2; k.go([390, 360, 700, iy[pick] + 40], a + .1, a + 1, 'blue'); k.txt(545, 100, t('在本地挑：不用多绕一层代理', 'picked locally: no extra proxy hop'), 15, 'soft'); }
  if (i === 2) {
    k.go([390, 360, 700, iy[0] + 40], 8.2, 9.4, 'yellow', t('握手', 'handshake'));
    let n = 0; [9.6, 10.3, 11].forEach(a => { k.go([390, 360, 700, iy[0] + 40], a, a + .45, 'blue'); if (T > a + .45) n++; });
    k.mono(225, 470, t('握手 1 次 · 请求 ', 'handshakes 1 · requests ') + n, 15, 'teal', 'center', 700);
  }
  if (slow) { k.mono(225, 470, t('空闲连接 ', 'idle connections ') + (4 - busy), 15, busy > 3 ? 'red' : 'soft', 'center', 700); if (busy > 3) k.txt(545, 505, t('连接全被慢实例占着', 'every connection is stuck on the slow instance'), 15, 'red'); }
});
sc('s7b', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, A = [280, 240, 700, 165], B = [280, 270, 700, 345];
  k.box(60, 200, 220, 110, t('借阅服务', 'Borrow service'), !i || (i === 1 && T < 6.5) ? t('1 个线程在等', '1 thread waiting') : '', 'orange', { st: 'red' });
  k.bar(60, 335, 220, 12, i === 1 ? k.p(4, 6.5) : 0, 'orange'); k.mono(170, 366, 'timeout 500 ms', 14, 'soft');
  if (i < 3) {
    k.ln(A); k.ln(B);
    k.box(700, 120, 230, 90, t('用户服务 A', 'Users A'), i === 2 ? '' : T > 1.8 ? t('很慢…', 'slow…') : '', i < 2 && T > 1.8 ? 'red' : 'blue', { dim: i === 2, st: 'red' });
    k.box(700, 300, 230, 90, t('用户服务 B', 'Users B'), i === 2 && T > 9.6 ? t('健康', 'healthy') : '', 'blue', { hot: i === 2 && k.on(9.6, 9.9), st: 'green' });
    k.go(A, .4, 1.8, 'blue', 'checkEligible'); if ((!i && T > 1.8) || (i === 1 && T < 6.5)) k.ring(958, 165, 11, 'red', 4, (T * .6) % 1);
    if (i === 1 && T > 6.5) { k.no(490, 202, 11); k.pill(200, 420, t('不等了：线程和连接归还', 'stop waiting: thread and connection released'), 'teal', 15); }
    k.go(B, 8.3, 9.6, 'blue', t('重试 1/1', 'retry 1/1')); k.go([700, 345, 280, 270], 9.8, 11, 'green', 'ok');
    if (i === 2 && T > 11) k.pill(200, 420, t('只读查询：可以安全重复', 'read-only: safe to repeat'), 'green', 15);
  } else {
    const P = [280, 255, 700, 255]; k.ln(P);
    k.box(700, 200, 240, 110, t('馆藏服务', 'Catalog service'), 'stock ' + (T > 13.3 ? 2 : 3), 'teal', { mono: 1, hot: k.on(13.3, 13.8) });
    k.go(P, 12.3, 13.3, 'orange', 'deductStock #7f3a');
    const p = k.p(13.5, 14.2); if (p > 0 && T < 14.6) { const [x, y] = k.pkt([700, 285, 480, 285], Math.min(p, .9), 'green'); if (p > .9) k.no(x - 28, y, 9); }
    k.go(P, 14.6, 15.4, 'orange', t('重试 #7f3a', 'retry #7f3a'));
    if (T > 14.2) k.txt(500, 125, t('超时 ≠ 没执行', 'a timeout does not mean it did not happen'), 20, 'red', 'center', 700);
    if (T > 15.4) k.pill(780, 360, t('#7f3a 做过了：不再扣', '#7f3a already done: not deducted twice'), 'teal', 15);
  }
});
sc('s72', 20, [0, 4, 8, 12, 16], k => {
  const T = k.t, i = k.i, state = T < 4 ? 'CLOSED' : T < 8 ? 'OPEN' : T < 10.6 ? 'HALF-OPEN' : T < 13 ? 'OPEN' : T < 15.2 ? 'HALF-OPEN' : 'CLOSED';
  const tone = { CLOSED: 'green', OPEN: 'red', 'HALF-OPEN': 'yellow' }[state], down = T < 13, full = [250, 250, 720, 250], back = [720, 250, 250, 250];
  const ratio = T < 1.1 ? 10 : T < 2 ? 30 : T < 2.9 ? 45 : T < 15.2 ? 60 : 0;
  k.ln([250, 250, 420, 250]); k.ln([580, 250, 720, 250]); k.dot(420, 250, 7, 'ink'); k.dot(580, 250, 7, 'ink');
  k.ln([420, 250, ...(state === 'CLOSED' ? [580, 250] : state === 'OPEN' ? [560, 195] : [572, 222])], tone, { w: 6 });
  k.pill(500, 160, state, tone); k.txt(500, 118, t('熔断器', 'circuit breaker'), 14, 'soft');
  k.box(50, 200, 200, 100, t('借阅服务', 'Borrow service'), state === 'OPEN' ? t('立刻得到失败', 'fails instantly') : '', 'orange');
  k.box(720, 200, 230, 100, t('推荐服务', 'Recommendations'), down ? t('超时', 'timing out') : t('恢复正常', 'healthy again'), down ? 'red' : 'teal', { st: down ? 'red' : 'green' });
  k.txt(350, 362, t('最近调用的失败比例', 'failure ratio of recent calls'), 14, 'soft', 'left'); k.bar(350, 380, 300, 14, ratio / 100, ratio > 50 ? 'red' : 'teal');
  k.ln([500, 372, 500, 402], 'ink', { w: 2 }); k.mono(500, 420, '50%', 13, 'ink'); k.mono(668, 388, ratio + '%', 16, ratio > 50 ? 'red' : 'soft', 'left', 700);
  if (!i) for (let j = 0; j < 4; j++) { const a = .2 + j * .9; k.go(full, a, a + .4, 'blue'); k.go(back, a + .4, a + .8, j ? 'red' : 'green'); }
  if (state === 'OPEN') {
    const t0 = T < 8 ? 4 : 10.6, len = T < 8 ? 4 : 2.4, left = 1 - k.p(t0, t0 + len);
    k.ring(628, 160, 12, 'red', 4, left); k.mono(650, 161, Math.ceil(20 * left) + ' s', 15, 'red', 'left');
    const p = ((T - t0) % 1.4) / 1.4; p < .5 ? k.pkt([250, 250, 420, 250], p * 2, 'blue') : k.pkt([420, 250, 250, 250], p * 2 - 1, 'muted');
  }
  k.go(full, 8.4, 9.6, 'yellow', t('试探', 'probe')); k.go(back, 9.6, 10.6, 'red');
  k.go(full, 13.2, 14.2, 'yellow', t('试探', 'probe')); k.go(back, 14.2, 15.2, 'green');
  if (i === 2 && T > 10.6) k.txt(500, 475, t('试探失败：重新断开，再等 20 秒', 'probe failed: open again for another 20 s'), 16, 'red');
  if (i === 3 && T > 15.2) k.txt(500, 475, t('试探成功：合闸', 'probe succeeded: close'), 16, 'green');
  if (i === 4) { const p = ((T - 16) % 2) / 2; p < .5 ? k.pkt(full, p * 2, 'blue') : k.pkt(back, p * 2 - 1, 'green'); }
});
sc('s7c', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, down = T >= 3.5 && T < 10.5, hide = i === 2 || (i === 3 && T < 12.9), C = [470, 175, 680, 175], R = [470, 365, 680, 375];
  k.ln(C); k.ln(R, down ? 'red' : 'line', { dash: down });
  k.rect(60, 95, 410, 430, 'line', { fill: '#fff' });
  k.txt(85, 130, t('《深入理解计算机系统》', 'Computer Systems: A Programmer’s Perspective'), 18, 'ink', 'left', 700, 360);
  k.txt(85, 162, t('可借 3 本', '3 copies available'), 14, 'soft', 'left');
  k.rect(85, 185, 120, 40, 'orange', { r: 8 }); k.txt(145, 206, t('借阅', 'Borrow'), 16, 'orange', 'center', 700);
  if (i === 2 && T > 9.6) k.pill(290, 205, t('借阅成功', 'Borrowed'), 'green', 15);
  k.ln([85, 255, 445, 255], 'line', { w: 1.5 }); k.txt(85, 282, t('猜你喜欢', 'You may also like'), 14, 'soft', 'left');
  if (hide) { k.rect(85, 300, 360, 130, 'muted', { dash: 1, fill: 0, lw: 1.5 }); k.txt(265, 365, t('暂时隐藏', 'hidden for now'), 16, 'muted'); }
  else if (i === 1) { k.rect(85, 300, 360, 130, 'red', { dash: 1, fill: 0, lw: 1.5 }); T > 5.9 ? k.txt(265, 365, t('要让整页都报错吗？', 'fail the whole page?'), 16, 'red') : k.ring(265, 365, 14, 'muted', 4, (T * .8) % 1); }
  else k.al(i === 3 ? k.e(12.9, 13.5) : 1, () => ['purple', 'teal', 'orange', 'blue'].forEach((c, j) => k.rect(85 + j * 92, 300, 78, 130, c, { r: 8, fill: k.col(c), lw: 0, a: .8 })));
  k.txt(265, 478, t('核心：书的信息、借阅　可选：推荐', 'core: book info, borrowing   optional: recommendations'), 14, 'soft', 'center', 500, 380);
  k.box(680, 130, 250, 90, t('馆藏 / 借阅', 'Catalog / Borrow'), t('核心', 'core'), 'teal');
  k.box(680, 330, 250, 90, t('推荐服务', 'Recommendations'), down ? t('不可用', 'unavailable') : t('可选', 'optional'), down ? 'red' : 'purple', { st: down ? 'red' : 'soft', dim: i === 2 });
  if (i === 2) k.pill(575, 335, 'OPEN', 'red', 13);
  k.go(C, .3, 1.3, 'blue'); k.go([680, 175, 470, 175], 1.4, 2.4, 'green'); k.go(R, .6, 1.6, 'blue'); k.go([680, 375, 470, 365], 1.7, 2.7, 'green');
  k.go(R, 3.8, 4.8, 'blue'); k.go([680, 375, 470, 365], 4.9, 5.9, 'red');
  k.go(C, 7.5, 8.5, 'orange', t('借阅', 'borrow')); k.go([680, 175, 470, 175], 8.6, 9.6, 'green');
  k.go(R, 10.8, 11.8, 'blue'); k.go([680, 375, 470, 365], 11.9, 12.9, 'green');
});
sc('s7d', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, cell = (x, y, w, h, tone) => k.rect(x, y, w, h, tone || 'line', { r: 7, fill: tone ? k.col(tone) : 0, lw: tone ? 0 : 1.5, dash: !tone, a: tone ? .85 : 1 });
  const U = t('用户', 'Users'), C = t('馆藏', 'Catalog'), R = t('推荐（慢）', 'Recommend (slow)');
  if (i < 2) {
    const red = !i ? Math.floor(k.p(.4, 3.3) * 12) : 12 + Math.floor(k.p(3.6, 6) * 8);
    k.rect(240, 115, 520, 305, 'orange', { dash: 1 }); k.txt(262, 144, t('借阅服务：所有下游调用共用一个线程池', 'Borrow service: one thread pool for every downstream call'), 15, 'orange', 'left', 700, 470);
    for (let j = 0; j < 20; j++) cell(270 + (j % 5) * 94, 170 + ((j / 5) | 0) * 58, 82, 46, j >= 20 - red ? 'red' : j < 3 ? 'blue' : j < 5 ? 'teal' : null);
    [[U, 'blue'], [C, 'teal'], [R, 'red']].forEach(([s, c], j) => { k.dot(290 + j * 150, 452, 8, c); k.txt(306 + j * 150, 453, s, 15, 'ink', 'left'); });
    if (i && T > 6) k.pill(500, 505, t('没有线程去调用户和馆藏了：借书也失败', 'no threads left for users or catalog: borrowing fails too'), 'red', 16);
    return;
  }
  const full = i === 3 ? 4 : Math.floor(k.p(7.3, 9.6) * 4);
  [[U, 'blue', 8, 3], [C, 'teal', 8, 2], [R, 'red', 4, full]].forEach(([s, c, n, busy], j) => {
    const x = 70 + j * 295; k.rect(x, 130, 270, 300, 'ink', { fill: WHITE, lw: 4, r: 6 }); k.txt(x + 135, 160, s + ' · ' + n, 17, 'ink', 'center', 700);
    for (let m = 0; m < n; m++) cell(x + 24 + (m % 2) * 116, 188 + ((m / 2) | 0) * 58, 106, 46, m < busy ? c : null);
    if (i === 3) k.pill(x + 135, 468, j < 2 ? t('额度还在：照常', 'quota intact: fine') : t('满了：只影响自己', 'full: hurts only itself'), j < 2 ? 'green' : 'red', 15);
  });
  if (i === 3) for (let m = 0; m < 3; m++) k.dot(730 + m * 28 + ((T * 20) % 28), 108, 7, 'red', .7);
});
sc('s73', 12, [0, 4, 8], k => {
  const i = k.i, g = i ? k.e(4, 6) : 0;
  const cols = [[t('借阅、用户、馆藏 · Java', 'Borrow, Users, Catalog · Java'), 'orange', 'Dubbo · Spring Cloud'], [t('座位、通知 · Go', 'Seat, Notify · Go'), 'teal', 'Kitex · Kratos'], [t('搜索、推荐 · Python', 'Search, Recommend · Python'), 'pink', 'gRPC']];
  const chips = [t('挑实例', 'picking'), t('连接池', 'pooling'), t('超时重试', 'retries'), t('熔断隔离', 'breaker')];
  cols.forEach(([name, tone, fw], j) => {
    const x = 70 + j * 310;
    k.rect(x, 105, 240, 220, tone, { fill: WHITE }); k.txt(x + 120, 135, name, 18, 'ink', 'center', 700, 220);
    k.txt(x + 120, k.lerp(165, 225, g), t('业务代码', 'business code'), 15, 'soft');
    if (g < 1) k.al(1 - k.e(5.4, 6), () => chips.forEach((c, m) => { k.rect(x + 16 + (m % 2) * 108, k.lerp(196 + ((m / 2) | 0) * 52, 400, g), 100, 42, 'purple', { r: 8 }); k.txt(x + 66 + (m % 2) * 108, k.lerp(217 + ((m / 2) | 0) * 52, 421, g), c, 15, 'purple', 'center', 500, 92); }));
    if (i === 2) { k.rect(x, 385, 240, 90, tone); k.txt(x + 120, 415, t('通信框架', 'framework'), 14, 'soft'); k.txt(x + 120, 445, fw, 18, 'ink', 'center', 700, 220); k.ln([x + 120, 325, x + 120, 385], tone, { w: 2 }); }
  });
  if (i === 1) k.al(k.e(4.6, 5.8), () => { k.rect(70, 385, 860, 90, 'purple'); k.txt(500, 418, t('通信框架', 'Communication framework'), 20, 'purple', 'center', 700); k.txt(500, 450, chips.join(' · '), 16, 'soft'); });
  if (!i) k.txt(500, 400, t('同样的几件事，每个服务都写了一遍', 'the same few jobs, rewritten in every service'), 17, 'soft');
});
sc('s61', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, actual = T >= 4.3 && T < 10.2 ? 49 : 50;
  k.rect(40, 100, 250, 170, 'teal', { fill: WHITE }); k.txt(60, 128, t('控制平面', 'Control plane'), 17, 'teal', 'left', 700);
  k.mono(165, 192, actual + ' / 50', 46, actual < 50 ? 'red' : 'ink', 'center', 700); k.txt(165, 243, t('实际 / 期望', 'actual / desired'), 15, 'soft');
  k.mono(165, 340, '03:07', 32, 'soft', 'center', 700); k.txt(165, 378, t('所有人都在睡觉', 'everyone is asleep'), 16, 'soft');
  const pod = (n, m) => { const x = 330 + (n % 5) * 128, y = 110 + ((n / 5) | 0) * 200; return [x + 14 + (m % 2) * 46, y + 36 + ((m / 2) | 0) * 42]; };
  for (let n = 0; n < 10; n++) {
    const x = 330 + (n % 5) * 128, y = 110 + ((n / 5) | 0) * 200;
    k.rect(x, y, 116, 170, 'teal', { dash: 1, lw: 1.5 }); k.mono(x + 58, y + 18, 'node-' + (n + 1), 13, 'soft');
    for (let m = 0; m < 5; m++) {
      const [px, py] = pod(n, m), dying = n === 3 && m === 2;
      if (dying && T >= 3.5 && T < 5) k.al(1 - k.e(4.3, 5), () => k.rect(px, py, 38, 34, 'red', { r: 6, fill: k.col('red'), lw: 0, a: .5 + .5 * k.blink(3) }));
      else if (!dying || T < 3.5) k.rect(px, py, 38, 34, 'teal', { r: 6, fill: WHITE });
    }
  }
  if (T >= 7) {
    const [px, py] = pod(7, 5); k.go([290, 185, px + 19, py + 17], 7.3, 8.8, 'purple', 'create');
    k.al(k.e(8.6, 9.4), () => k.rect(px, py, 38, 34, T < 10.2 ? 'purple' : 'teal', { r: 6, dash: T < 10.2, fill: T < 10.2 ? undefined : WHITE }));
  }
  if (k.i === 3) k.pill(165, 440, t('没有人被叫醒', 'nobody was paged'), 'green');
});
sc('s62', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, f = Math.floor, want = i || T > 2 ? 200 : 50, v2 = i >= 2;
  k.rect(40, 110, 330, 200, 'line', { fill: '#fbf8f0' });
  k.mono(62, 142, 'kind: Deployment', 17, 'soft', 'left'); k.mono(62, 177, 'spec:', 17, 'soft', 'left');
  k.mono(62, 212, '  replicas: ' + want, 18, !i && T > 2 ? 'orange' : 'ink', 'left', 700);
  k.mono(62, 247, '  image: borrow:' + (v2 ? '1.4.4' : '1.4.3'), 18, i === 2 ? 'orange' : 'ink', 'left', 700);
  k.txt(62, 345, t('你只改这份清单', 'you only edit this manifest'), 15, 'soft', 'left');
  const filled = !i ? 10 : i === 1 ? 10 + f(k.p(4.3, 7.6) * 30) : 40, nv = i === 2 ? f(k.p(8.3, 12) * 5) * 4 : i === 3 ? 20 + f(k.p(12, 15.3) * 5) * 4 : 0;
  for (let j = 0; j < 40; j++) {
    const x = 420 + (j % 10) * 54, y = 115 + f(j / 10) * 54;
    if (j >= filled) k.rect(x, y, 46, 46, 'line', { r: 7, dash: 1, fill: 0, lw: 1.3 });
    else { const tone = v2 && j < nv ? 'purple' : 'blue'; k.rect(x, y, 46, 46, tone, { r: 7, lw: 1.6 }); if (v2 && j >= nv && j < nv + 4 && nv < 40) k.rect(x + 6, y + 6, 34, 34, 'purple', { r: 5, dash: 1, fill: 0, lw: 1.5 }); }
  }
  k.txt(690, 350, t('每格 = 5 个副本', 'one cell = 5 replicas'), 14, 'muted');
  if (v2) { k.mono(560, 400, 'v1.4.3: ' + (40 - nv) * 5, 22, 'blue', 'center', 700); k.mono(820, 400, 'v1.4.4: ' + nv * 5, 22, 'purple', 'center', 700); }
  else k.mono(690, 400, filled * 5 + ' / ' + want, 28, filled * 5 < want ? 'orange' : 'ink', 'center', 700);
  if (v2) k.txt(690, 450, t('先起新的，就绪后再停旧的', 'start new pods first; stop old ones once they are ready'), 16, 'soft');
});
sc('s63', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, lost = i === 2 && T < 9.5, moved = (i === 2 && T >= 9.5) || i === 3, iy = [100, 210, 320, 430];
  k.rect(360, 100, 280, 260, 'teal', { fill: WHITE }); k.txt(500, 130, t('注册中心', 'Registry'), 18, 'teal', 'center', 700); k.mono(500, 158, 'catalog', 15, 'soft');
  ['10.0.1.5', '10.0.1.6', moved ? '10.0.2.9' : '10.0.1.7'].forEach((ip, j) => {
    const dead = j === 2 && lost;
    k.mono(390, 205 + j * 48, ip, 18, dead ? 'muted' : j === 2 && moved ? 'teal' : 'ink', 'left', 700);
    if (dead) k.txt(610, 205 + j * 48, t('心跳超时', 'no heartbeat'), 13, 'red', 'right'); else k.dot(600, 205 + j * 48, 6, 'green', .4 + .6 * k.blink(.5));
  });
  [0, 1, 2, 3].forEach(j => {
    if (j === 3 && !moved) return; const ghost = j === 2 && (lost || moved);
    if (ghost) { k.rect(760, iy[j], 190, 80, 'red', { dash: 1, fill: 0, a: .6 }); k.mono(855, iy[j] + 40, '10.0.1.7 ✕', 16, 'red'); return; }
    k.al(j === 3 ? k.e(9.5, 10.2) : 1, () => k.box(760, iy[j], 190, 80, 'catalog', ['10.0.1.5', '10.0.1.6', '10.0.1.7', '10.0.2.9'][j], 'teal', { mono: 1 }));
    const p = ((T + j * .35) % 2) / .8, ry = 205 + Math.min(j, 2) * 48; if (p < 1) k.dot(k.lerp(760, 640, p), k.lerp(iy[j] + 40, ry, p), 5, 'teal');
  });
  k.box(50, 150, 220, 90, t('借阅服务', 'Borrow service'), i >= 1 && T > 6.5 ? t('拿到 3 个地址', 'got 3 addresses') : '', 'orange', { hot: i === 1 && T > 6.5 });
  k.go([270, 195, 360, 230], 4.3, 5.3, 'blue', 'lookup'); k.go([360, 230, 270, 195], 5.5, 6.5, 'green');
  k.al(i === 3 ? 1 : .25, () => k.box(50, 400, 220, 90, t('旧客户端', 'Old client'), 'IP = 10.0.1.7', 'muted', { mono: 1 }));
  if (i === 3) {
    [140, 250, 470].forEach((y, j) => k.go([270, 180, 320, 80, 700, 80, 760, y], 12.2 + j * .9, 13.6 + j * .9, 'blue'));
    const p = k.p(12.4, 13.8); if (p > 0) { const [x, y] = k.pkt([270, 445, 700, 360, 745, 360], Math.min(p, .93), p > .93 ? 'red' : 'muted'); if (p > .93) k.no(x - 28, y, 9); }
  }
});
sc('s111', 14, [0, 4, 8], k => {
  const T = k.t, i = k.i, g = i ? k.e(4, 6) : 0;
  [[70, t('Pod · 借阅（Java）', 'Pod · borrow (Java)'), t('借阅业务', 'Borrow logic'), 'orange'], [570, t('Pod · 馆藏（Go）', 'Pod · catalog (Go)'), t('馆藏业务', 'Catalog logic'), 'teal']].forEach(([x, pod, app, tone]) => {
    k.rect(x, 105, 360, 380, 'muted', { dash: 1, fill: '#fbf9f3' }); k.txt(x + 20, 132, pod, 15, 'soft', 'left');
    k.box(x + 40, 160, 280, 140, '', '', tone); k.txt(x + 180, 200, app, 21, 'ink', 'center', 700);
    const cx = k.lerp(x + 60, x + 40, g), cy = k.lerp(240, 370, g), cw = k.lerp(240, 280, g), ch = k.lerp(40, 84, g);
    k.rect(cx, cy, cw, ch, 'pink', { r: 9 });
    k.txt(cx + cw / 2, cy + ch / 2 - (g > .9 ? 12 : 0), g > .9 ? t('Sidecar 代理', 'Sidecar proxy') : t('通信库', 'comm library'), g > .9 ? 19 : 15, 'pink', 'center', 700);
    if (g > .9) k.txt(cx + cw / 2, cy + ch / 2 + 16, t('超时 · 重试 · 熔断', 'timeout · retry · breaker'), 14, 'soft');
  });
  if (!i) { k.ln([390, 260, 610, 260]); const p = (T % 2) / 2; p < .5 ? k.pkt([390, 260, 610, 260], p * 2, 'blue') : k.pkt([610, 260, 390, 260], p * 2 - 1, 'green'); k.mono(500, 232, '1.2 ms', 17, 'soft'); }
  if (i === 2) {
    const path = [250, 300, 250, 412, 750, 412, 750, 300]; k.ln([390, 412, 610, 412]); k.ln([250, 300, 250, 370]); k.ln([750, 300, 750, 370]);
    k.go(path, 8.3, 10.3, 'blue'); k.go([750, 300, 750, 412, 250, 412, 250, 300], 10.6, 12.6, 'green');
    k.txt(500, 388, t('代理 ↔ 代理', 'proxy ↔ proxy'), 14, 'soft'); if (T > 12.6) k.mono(500, 512, t('多一跳：', 'one more hop: ') + '1.2 ms → 1.6 ms', 17, 'orange', 'center', 700);
  }
});
sc('s112', 14, [0, 5, 9], k => {
  const T = k.t, i = k.i, names = [t('借阅', 'Borrow'), t('用户', 'Users'), t('馆藏', 'Catalog'), t('通知', 'Notify')];
  k.al(i === 2 ? .4 : 1, () => {
    k.box(350, 92, 300, 84, t('控制面', 'Control plane'), 'timeout: 0.5s', 'purple', { mono: 1, hot: !i });
    names.forEach((s, j) => {
      const x = 62 + j * 230, on = i > 0 || T > 1.9 + j * .6;
      k.ln([500, 176, x + 92, 270], 'purple', { dash: 1, a: .5 });
      k.box(x, 270, 185, 62, 'proxy', on ? '0.5s ✓' : '—', 'pink', { hot: on, mono: 1, st: on ? 'green' : 'muted', size: 17 });
      k.box(x, 345, 185, 66, s, '', 'orange', { size: 19 });
      if (!i) k.go([500, 176, x + 92, 270], .5 + j * .6, 1.9 + j * .6, 'purple');
    });
    if (!i) k.txt(500, 222, t('只发规则，不碰业务流量', 'rules only: it never touches business traffic'), 15, 'soft');
    if (i === 1) {
      k.go([247, 301, 292, 301], 5.3, 6.2, 'blue'); k.go([292, 301, 247, 301], 6.3, 7.1, 'green');
      const far = [154, 270, 154, 246, 614, 246, 614, 270]; k.ln(far, 'line'); k.go(far, 7.1, 8.1, 'blue'); k.go([614, 270, 614, 246, 154, 246, 154, 270], 8.2, 9, 'green');
      k.pill(500, 462, t('数据面：请求只在代理之间流动', 'Data plane: requests flow only between proxies'), 'blue');
    }
  });
  if (i === 2) {
    k.ln([150, 478, 850, 478], 'ink', { w: 3 }); k.txt(150, 508, t('几十个服务', 'dozens of services'), 15, 'soft'); k.txt(850, 508, t('上万个服务', '10,000+ services'), 15, 'soft');
    k.dot(200, 478, 10, 'orange'); k.pill(230, 440, t('图书平台在这里：暂不引入', 'the library platform is here: not yet'), 'orange', 15);
    k.rect(560, 468, 290, 20, 'teal', { r: 10, lw: 0 }); k.txt(705, 440, t('到这里才划算', 'worth it only out here'), 15, 'teal', 'center', 700);
  }
});

// ---------- 数据 ----------
sc('s31', 18, [0, 4.5, 9, 13.5], k => {
  const T = k.t, i = k.i, p0 = !i ? k.p(.3, 4) : 1, px = 20 + p0 * 580;
  k.ln([20, 140, 600, 140]);
  [[40, t('连接', 'Connect'), ''], [220, t('解析', 'Parse'), ''], [400, t('优化器', 'Optimizer'), px > 500 ? 'idx_book_isbn' : '']].forEach(([x, s, sub]) => k.box(x, 105, 150, 70, s, sub, 'indigo', { hot: !i && px > x && px < x + 190, mono: 1 }));
  k.rect(600, 95, 365, 440, 'indigo', { dash: 1 }); k.txt(620, 119, 'InnoDB', 17, 'indigo', 'left', 700);
  k.rect(622, 138, 322, 122, 'teal', { fill: WHITE, lw: 1.5 }); k.txt(636, 158, t('缓冲池（内存）', 'Buffer pool (memory)'), 14, 'soft', 'left');
  for (let j = 0; j < 5; j++) k.rect(638 + j * 60, 180, 50, 62, j === 2 && i === 1 && T > 7.8 ? 'green' : 'teal', { r: 6, lw: 1.5, fill: j === 2 && i === 1 && T > 7.8 ? k.col('green', 1) : '#f4faf8' });
  if (i === 1 && T > 7.8) k.txt(930, 158, t('命中：不读磁盘', 'hit: no disk read'), 14, 'green', 'right', 700);
  const stock = i === 3 && T > 14.7 ? 0 : 1, locked = (i === 2 && T > 10) || (i === 3 && T < 14.7);
  k.rect(622, 285, 322, 56, locked ? 'orange' : 'indigo', { fill: WHITE }); k.mono(640, 313, 'isbn …4937 │ stock ' + stock, 17, 'ink', 'left', 700);
  if (locked) k.ic('lock', 918, 312, 24, 'orange');
  if (i >= 2) {
    k.txt(636, 372, 'T1', 17, 'orange', 'left', 700); k.txt(672, 372, T > 14.7 ? t('已提交 ✓', 'committed ✓') : T > 10 ? t('持有行锁', 'holds the row lock') : '…', 16, T > 14.7 ? 'green' : 'ink', 'left');
    k.txt(636, 404, 'T2', 17, 'purple', 'left', 700);
    k.al(i === 2 && T > 10.6 ? .5 + .5 * k.blink(1) : 1, () => k.txt(672, 404, T > 15.5 ? t('拿到锁：影响 0 行，库存不足', 'gets the lock: 0 rows, sold out') : T > 10.6 ? t('等待锁…', 'waiting for the lock…') : '…', 16, T > 15.5 ? 'red' : 'ink', 'left', 500, 270));
    k.go([540, 300, 622, 306], 9.2, 10, 'orange', 'T1'); k.go([540, 326, 622, 320], 9.8, 10.6, 'purple', 'T2');
  }
  k.rect(622, 450, 322, 60, 'indigo', { fill: i === 3 && k.on(14.2, 15.2) ? k.col('indigo', 1) : WHITE, lw: 1.5 }); k.txt(783, 480, t('redo log（磁盘）', 'redo log (disk)'), 16, 'soft');
  k.go([783, 341, 783, 450], 13.7, 14.7, 'orange');
  // 索引树
  k.txt(50, 222, t('索引 idx_book_isbn', 'index idx_book_isbn'), 15, 'soft', 'left');
  const mid = [170, 290, 410], on1 = i === 1 && T > 4.8, on2 = i === 1 && T > 5.8;
  mid.forEach((x, j) => { k.ln([290, 280, x, 370], j === 2 && on1 ? 'indigo' : 'line', { w: j === 2 && on1 ? 3.5 : 2 }); [-40, 0, 40].forEach((dx, m) => { const hot = j === 2 && m === 0 && on2; k.ln([x, 370, x + dx, 460], hot ? 'indigo' : 'line', { w: hot ? 3.5 : 2 }); k.dot(x + dx, 460, 10, hot && T > 6.8 ? 'indigo' : 'line'); }); k.dot(x, 370, 13, j === 2 && on2 ? 'indigo' : 'line'); });
  k.dot(290, 280, 15, on1 ? 'indigo' : 'line');
  k.go([290, 280, 410, 370], 4.8, 5.8, 'blue'); k.go([410, 370, 370, 460], 5.8, 6.8, 'blue'); k.go([370, 460, 560, 400, 783, 242], 6.8, 7.8, 'blue');
  if (i === 1 && T > 6.8) k.mono(370, 492, '…544937', 14, 'indigo');
  if (!i && p0 > 0 && p0 < 1) { k.pkt([20, 140, 600, 140], p0, 'blue'); k.mono(Math.max(150, px), 196, 'SELECT … WHERE isbn = ?', 15, 'blue', 'center', 700); }
});
sc('s32', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, a1 = [290, 245, 640, 175], a2 = [290, 295, 640, 405];
  k.ln(a1, 'line', { dash: 1 }); k.ln(a2, 'line', { dash: 1 }); k.ln([40, 265, 120, 265]); k.ln([870, 405, 800, 405]);
  k.cyl(120, 170, 170, 190, t('主库', 'Primary'), 'stock ' + (T >= 1.6 ? 1 : 0), 'indigo', { hot: k.on(1.6, 2.4), mono: 1 });
  k.cyl(640, 100, 160, 150, t('从库 1', 'Replica 1'), 'stock ' + (T >= 5.5 ? 1 : 0), 'indigo', { hot: k.on(5.5, 6.2), mono: 1 });
  k.cyl(640, 330, 160, 150, t('从库 2', 'Replica 2'), 'stock ' + (T >= 10.3 ? 1 : 0), 'indigo', { hot: k.on(10.3, 11), mono: 1 });
  k.go([40, 265, 120, 265], .4, 1.6, 'orange', t('还书', 'return'));
  k.go(a1, 3.7, 5.5, 'purple', 'binlog'); k.go(a2, 3.7, 10.3, 'purple', 'binlog');
  k.mono(470, 178, t('延迟 50 ms', 'lag 50 ms'), 15, 'soft'); k.mono(470, 388, t('延迟 3 s', 'lag 3 s'), 15, i === 2 ? 'red' : 'soft');
  k.who(905, 395, 'blue', t('刷新页面', 'refresh'));
  k.go([870, 405, 800, 405], 7.3, 8.1, 'blue'); k.go([800, 405, 870, 405], 8.3, 9.1, 'orange', 'stock 0');
  k.go([870, 405, 800, 405], 11.2, 12, 'blue'); k.go([800, 405, 870, 405], 12.2, 13, 'green', 'stock 1');
  if (i === 2 && T > 9.1) k.pill(880, 300, t('明明还了，还是 0', 'returned, yet still 0'), 'orange', 15);
  if (i === 3 && T > 11) k.pill(470, 500, t('最终一致', 'eventually consistent'), 'green');
});
sc('s35', 22, [0, 5.5, 11, 16.5], k => {
  if (k.i === 3) { // 网络断开：书目可查，借书拒绝
    const T = k.t;
    k.who(90, 170, 'orange', t('查书', 'browse')); k.who(90, 380, 'purple', t('借书', 'borrow'));
    k.ln([130, 180, 330, 185]); k.ln([130, 390, 730, 345], 'red', { dash: 1 }); k.ln([500, 200, 730, 310], 'red', { dash: 1 });
    k.cyl(330, 110, 180, 160, t('本地从库', 'Local replica'), t('stock 1（可能旧）', 'stock 1 (maybe stale)'), 'indigo');
    k.cyl(730, 250, 190, 200, t('主库', 'Primary'), 'stock ?', 'indigo', { dim: 1 });
    k.no(615, 300, 13); k.txt(615, 262, t('网络断开', 'network partition'), 16, 'red', 'center', 700);
    k.go([130, 180, 330, 185], 16.9, 17.9, 'blue'); k.go([330, 185, 130, 180], 18.1, 19.1, 'green', 'stock 1');
    const p = k.p(17.4, 18.9); if (p > 0 && T < 19.2) k.pkt([130, 390, 560, 358], p, 'orange'); k.go([560, 358, 130, 390], 19.2, 20.4, 'red');
    if (T > 19.1) k.pill(250, 96, t('能查：旧一点也可用', 'works: stale but available'), 'green', 15);
    if (T > 20.4) k.pill(300, 480, t('暂时不能借：宁可拒绝，也不能借错', 'refused for now: better unavailable than wrong'), 'orange', 15);
    return;
  }
  const T = k.t, i = k.i, A = [130, 185, 700, 265], B = [130, 395, 700, 305], rA = [700, 265, 130, 185], rB = [700, 305, 130, 395];
  const stock = !i ? 1 : i === 1 ? (T < 7.2 ? 1 : 0) : (T < 12.8 ? 1 : 0);
  k.ln(A); k.ln(B); k.who(90, 170, 'orange', 'A'); k.who(90, 380, 'purple', 'B');
  k.cyl(700, 180, 200, 210, 'book', 'stock ' + stock, 'indigo', { mono: 1, hot: k.on(7.2, 8) || k.on(12.8, 13.6) });
  if (!i) {
    k.go(A, .4, 1.8, 'blue', 'SELECT'); k.go(B, .7, 2.1, 'blue', 'SELECT'); k.go(rA, 2, 3.4, 'green', 'stock 1'); k.go(rB, 2.3, 3.7, 'green', 'stock 1');
    if (T > 3.4) k.txt(205, 130, t('读到 1：还有书', 'reads 1: available'), 15, 'orange'); if (T > 3.7) k.txt(205, 462, t('读到 1：还有书', 'reads 1: available'), 15, 'purple');
  }
  if (i === 1) {
    k.go(A, 5.8, 7.2, 'orange', 'SET stock=0'); k.go(B, 6.1, 7.5, 'purple', 'SET stock=0');
    if (T > 7.6) { k.pill(215, 130, t('借阅成功', 'success'), 'green', 15); k.pill(215, 462, t('借阅成功', 'success'), 'green', 15); }
    if (T > 8.4) k.pill(430, 285, t('借出 2 本，实际只有 1 本', '2 lent out, only 1 existed'), 'red', 19);
  }
  if (i === 2) {
    k.mono(450, 105, 'UPDATE … SET stock = stock - 1 WHERE stock > 0', 17, 'teal', 'center', 700);
    k.go(A, 11.4, 12.8, 'orange', 'UPDATE'); k.go(B, 11.9, 13.3, 'purple', 'UPDATE'); k.go(rA, 13, 14.2, 'green', '1 row'); k.go(rB, 13.5, 14.7, 'red', '0 rows');
    if (T > 14.2) k.pill(215, 130, t('借到了', 'got it'), 'green', 15); if (T > 14.7) k.pill(215, 462, t('已借完', 'sold out'), 'orange', 15);
  }
});
sc('s33', 18, [0, 3.5, 7, 10.5, 14], k => {
  const T = k.t, i = k.i, R = [260, 255, 560, 185], M = [260, 295, 650, 405], rev = p => [p[2], p[3], p[0], p[1]];
  const cached = (i === 2 && T > 8.8) || i === 3 || (i === 4 && T < 16.5);
  k.ln(R); k.ln(M);
  k.box(70, 220, 190, 110, t('馆藏服务', 'Catalog service'), '', 'orange');
  k.rect(560, 100, 390, 160, 'pink'); k.txt(580, 126, 'Redis', 18, 'pink', 'left', 700);
  k.rect(580, 150, 350, 86, 'pink', { fill: WHITE, lw: k.on(8.8, 9.6) ? 3 : 1.5 }); k.mono(596, 176, 'book:9787111544937', 15, 'soft', 'left');
  k.mono(596, 210, cached ? '{stock: 2}   TTL 300' : t('（空）', '(empty)'), 17, cached ? 'ink' : 'muted', 'left', 700);
  k.cyl(650, 330, 200, 180, 'MySQL', 'stock ' + (i === 4 && T >= 15.2 ? 3 : 2), 'indigo', { mono: 1, hot: k.on(15.2, 16) });
  k.go(R, .4, 1.6, 'blue', 'GET'); k.go(rev(R), 1.8, 3, 'muted', 'nil');
  if (k.on(1.6, 3.5)) k.pill(905, 126, t('未命中', 'miss'), 'red', 14);
  k.go(M, 3.8, 5.2, 'blue', 'SELECT'); k.go(rev(M), 5.4, 6.8, 'green', 'stock 2'); if (i === 1) k.mono(420, 395, '≈ 20 ms', 15, 'soft');
  k.go(R, 7.3, 8.8, 'pink', 'SET … EX 300');
  k.go(R, 10.8, 12, 'blue', 'GET'); k.go(rev(R), 12.2, 13.4, 'green', 'stock 2'); if (k.on(12, 14)) k.pill(895, 126, t('命中 ≈ 1 ms', 'hit ≈ 1 ms'), 'green', 14);
  k.go(M, 14.2, 15.2, 'orange', 'UPDATE stock=3'); k.go(R, 15.5, 16.5, 'red', 'DEL'); if (i === 4 && T > 16.5) k.pill(885, 126, t('旧值已删', 'stale value gone'), 'muted', 14);
});
sc('s34', 24, [0, 6, 12, 18], k => {
  const T = k.t, i = k.i, fix = T - i * 6 >= 3, ly = j => 205 + j * 40, lane = j => [60, ly(j), 380, ly(j), 620, ly(j), 770, 285];
  k.pill(500, 104, [t('击穿', 'Breakdown'), t('穿透', 'Penetration'), t('雪崩', 'Avalanche'), t('整个 Redis 不可用', 'Redis itself is down')][i] + (fix ? ' → ' + [t('互斥锁', 'mutex'), t('缓存空值', 'cache the miss'), t('过期时间加随机抖动', 'jitter the TTLs'), t('限流保住数据库', 'rate-limit to protect the database')][i] : ''), fix ? 'teal' : 'red', 18);
  for (let j = 0; j < 5; j++) k.ln([60, ly(j), 380, ly(j)], 'line', { a: .7 });
  k.rect(380, 150, 240, 280, i === 3 ? 'muted' : 'pink', { dash: i === 3 }); k.txt(400, 176, 'Redis', 18, i === 3 ? 'muted' : 'pink', 'left', 700);
  let sub = '', bad = false;
  if (i === 0) {
    k.mono(500, 410, 'hot-book', 15, 'ink'); k.txt(585, 176, fix ? t('互斥锁', 'mutex') : t('刚过期', 'just expired'), 14, fix ? 'teal' : 'red', 'right');
    if (!fix) { for (let j = 0; j < 5; j++) k.go(lane(j), .3 + j * .12, 2.2 + j * .12, 'red'); bad = T > 1.6; sub = t('5 个同时查库', '5 queries at once'); }
    else { k.go(lane(0), 3.3, 5.1, 'blue'); for (let j = 1; j < 5; j++) { const p = k.p(3.3, 4.1); if (T < 5.2) k.pkt([60, ly(j), 450, ly(j)], p, 'yellow'); k.go([450, ly(j), 60, ly(j)], 5.2, 5.9, 'green'); } sub = t('只来 1 个', 'only 1 query'); k.ic('lock', 560, 285, 28, 'teal'); }
  }
  if (i === 1) {
    k.mono(500, 410, fix ? 'isbn=000 → NULL' : 'isbn=000 → ?', 15, fix ? 'teal' : 'red');
    if (!fix) { for (let j = 1; j < 4; j++) k.go(lane(j), 6.3 + (j - 1) * .5, 8 + (j - 1) * .5, 'red'); bad = T > 7.6; sub = t('每次都被查，每次都没有', 'queried every time, never found'); }
    else { for (let j = 1; j < 4; j++) { const a = 9.3 + (j - 1) * .5; k.go([60, ly(j), 500, ly(j)], a, a + .9, 'blue'); k.go([500, ly(j), 60, ly(j)], a + .9, a + 1.7, 'muted', 'NULL'); } sub = t('不再被打扰', 'left alone'); }
  }
  if (i === 2) {
    for (let j = 0; j < 6; j++) k.bar(410, 200 + j * 34, 180, 12, fix ? 1 - k.p(15, 15.7 + j * .42) * .9 : 1 - k.p(12, 13.4), fix ? 'teal' : 'red');
    k.txt(500, 410, 'TTL', 14, 'soft');
    if (!fix) { for (let j = 0; j < 5; j++) k.go(lane(j), 13.4 + j * .08, 14.8 + j * .08, 'red'); bad = T > 14.3; sub = 'Too many connections'; }
    else { for (let j = 0; j < 5; j++) k.go(lane(j), 15.6 + j * .42, 16.6 + j * .42, 'blue'); sub = t('一个一个来', 'one at a time'); }
  }
  if (i === 3) {
    k.txt(500, 290, t('离线', 'offline'), 22, 'muted', 'center', 700); k.txt(500, 410, fix ? t('同时切换到备用节点', 'meanwhile fail over to a standby') : t('缓存一条也查不到', 'nothing can be served from cache'), 14, fix ? 'teal' : 'red');
    if (!fix) { for (let j = 0; j < 5; j++) k.go(lane(j), 18.3 + j * .1, 20 + j * .1, 'red'); bad = T > 19.6; sub = 'Too many connections'; }
    else {
      k.ln([330, 185, 330, 385], 'teal', { w: 5 }); k.txt(330, 168, t('限流', 'limit'), 14, 'teal', 'center', 700);
      for (let j = 0; j < 5; j++) { const a = 21.2 + j * .25; if (j < 2) k.go(lane(j), a, a + 1.5, 'blue'); else { k.go([60, ly(j), 318, ly(j)], a, a + .6, 'blue'); k.go([318, ly(j), 60, ly(j)], a + .6, a + 1.2, 'muted', '429'); } }
      sub = t('压力在承受范围内', 'load stays bearable');
    }
  }
  k.cyl(770, 190, 180, 200, 'MySQL', sub, bad ? 'red' : 'indigo', { hot: bad, st: bad ? 'red' : 'soft' });
  k.txt(60, 172, t('请求', 'requests'), 15, 'soft', 'left');
});
sc('s36', 14, [0, 4.5, 9], k => {
  const T = k.t, i = k.i;
  k.ln([110, 255, 200, 255]); k.ln([330, 255, 480, 165]); k.ln([330, 255, 480, 365]);
  k.who(70, 240, 'blue'); k.mono(75, 300, 'SESSIONID=abc', 13, 'soft');
  k.box(200, 215, 130, 80, 'Nginx', '', 'blue');
  k.box(480, 110, 230, 110, t('实例 A', 'Instance A'), i === 2 ? t('无状态', 'stateless') : T > 2 ? 'abc → 2023010123' : t('内存：空', 'memory: empty'), 'teal', { mono: 1, hot: !i && T > 2 });
  k.box(480, 310, 230, 110, t('实例 B', 'Instance B'), i === 2 ? t('无状态', 'stateless') : i === 1 && T > 6.5 ? 'abc → ?' : t('内存：空', 'memory: empty'), i === 1 && T > 6.5 ? 'red' : 'teal', { mono: 1, st: i === 1 && T > 6.5 ? 'red' : 'soft' });
  k.al(i === 2 ? 1 : .3, () => { k.ln([710, 365, 780, 300]); k.ln([710, 165, 780, 230]); k.rect(780, 190, 195, 150, 'pink'); k.txt(798, 216, 'Redis', 17, 'pink', 'left', 700); k.mono(877, 280, i === 2 ? 'sess:abc → 2023…' : t('（未使用）', '(unused)'), 15, i === 2 ? 'ink' : 'muted', 'center', 700, 180); });
  k.go([110, 255, 200, 255], .3, 1, 'blue'); k.go([330, 255, 480, 165], 1, 2, 'blue', 'login'); k.go([480, 165, 330, 255, 110, 255], 2.4, 4, 'green', 'Set-Cookie');
  k.go([110, 255, 200, 255], 4.8, 5.5, 'blue'); k.go([330, 255, 480, 365], 5.5, 6.5, 'blue', 'abc'); k.go([480, 365, 330, 255, 110, 255], 6.9, 8.3, 'red', '401');
  if (i === 1 && T > 8.2) k.pill(140, 160, t('请重新登录', 'please log in again'), 'red', 15);
  k.go([110, 255, 200, 255], 9.3, 10, 'blue'); k.go([330, 255, 480, 365], 10, 10.9, 'blue', 'abc'); k.go([710, 365, 780, 300], 10.9, 11.7, 'pink', 'GET'); k.go([780, 300, 710, 365], 11.7, 12.4, 'green');
  k.go([480, 365, 330, 255, 110, 255], 12.5, 13.6, 'green', '200'); if (i === 2 && T > 13.5) k.pill(140, 160, t('已登录 ✓', 'logged in ✓'), 'green', 15);
});

// ---------- 消息队列 ----------
sc('s91', 18, [0, 5, 10, 14], k => {
  const T = k.t, i = k.i, cy = [140, 270, 400], q = i >= 2;
  const names = [t('通知', 'Notify'), t('统计', 'Stats'), t('推荐', 'Recommend')];
  k.who(70, 235, 'blue'); k.ln([110, 245, 190, 245]);
  const ms = !i ? Math.round(k.p(.8, 4.5) * 1280) : i === 1 ? (T > 6.3 ? 80 : 0) : i === 2 ? (T > 12.2 ? 85 : 0) : 85;
  k.mono(285, 150, ms + ' ms', 24, ms > 600 ? 'red' : ms ? 'green' : 'muted', 'center', 700); k.txt(285, 120, t('学生等了', 'the student waited'), 14, 'soft');
  const reboot = i === 1 && k.on(8, 8.7);
  k.box(190, 190, 190, 110, t('借阅服务', 'Borrow service'), reboot || (i === 1 && T > 8) ? t('进程重启了', 'process restarted') : '', reboot ? 'red' : 'orange', { hot: reboot, st: 'red' });
  k.al(q ? .25 : 1, () => cy.forEach(y => k.ln([380, 245, 760, y])));
  k.al(q ? 1 : .22, () => {
    k.ln([380, 245, 520, 300]); cy.forEach(y => k.ln([630, 300, 760, y], 'line', { dash: 1 }));
    k.rect(520, 160, 110, 290, 'yellow'); k.txt(575, 184, t('队列', 'Queue'), 16, 'yellow', 'center', 700);
    if (q && T > 11.6) { k.rect(532, 408, 86, 30, 'yellow', { r: 6, fill: k.col('yellow'), lw: 0 }); k.mono(575, 424, 'loan #42', 13, '#fff', 'center', 700); k.txt(575, 474, t('已落盘', 'on disk'), 14, 'soft'); }
  });
  names.forEach((s, j) => k.box(760, cy[j] - 40, 190, 80, s, i === 3 && T > 15.5 + j * .5 ? '✓' : '', 'teal', { st: 'green', hot: (i === 3 && T > 15.5 + j * .5) || (!i && k.on(1.4 + j * 1.2, 1.9 + j * 1.2)) }));
  if (!i) { k.go([110, 245, 190, 245], .2, .8, 'blue'); cy.forEach((y, j) => { const a = .9 + j * 1.2; k.go([380, 245, 760, y], a, a + .55, 'blue'); k.go([760, y, 380, 245], a + .6, a + 1.15, 'green'); }); k.go([190, 245, 110, 245], 4.5, 5, 'green'); }
  if (i === 1) {
    k.go([110, 245, 190, 245], 5.2, 5.7, 'blue'); k.go([190, 245, 110, 245], 5.8, 6.3, 'green'); k.go([380, 245, 760, 140], 6.4, 7, 'blue');
    [0, 1, 2].forEach(j => { if (j && T > 8) return; k.rect(205 + j * 56, 314, 48, 22, !j && T > 7 ? 'green' : 'yellow', { r: 6, lw: 1.5 }); });
    k.txt(285, 356, t('后台任务', 'background tasks'), 13, 'soft');
    if (T > 8.2) k.pill(285, 396, t('2 个任务丢了', '2 tasks lost'), 'red', 16);
  }
  if (i === 2) { k.go([110, 245, 190, 245], 10.2, 10.7, 'blue'); k.go([380, 245, 520, 300], 10.8, 11.6, 'yellow'); k.go([190, 245, 110, 245], 11.7, 12.2, 'green'); }
  if (i === 3) cy.forEach((y, j) => k.go([630, 300, 760, y], 14.3 + j * .5, 15.5 + j * .5, 'yellow'));
});
sc('s92', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i;
  if (i < 3) {
    const u = T / 12, fn = v => .08 + .85 * Math.exp(-Math.pow((v - .3) / .09, 2));
    const b = u < .2 ? 0 : u < .42 ? k.e(2.4, 5.04) : Math.max(0, 1 - (u - .42) / .5), n = Math.round(b * 9);
    k.rect(40, 105, 340, 330, 'line', { fill: '#fff' }); k.txt(58, 131, t('每秒到达的事件', 'events arriving per second'), 15, 'soft', 'left');
    k.ln([62, 345, 360, 345], 'teal', { dash: 1 }); k.txt(356, 328, t('处理能力', 'capacity'), 13, 'teal', 'right');
    k.plot(62, 170, 298, 230, fn, 'orange', u); k.ln([62 + u * 298, 165, 62 + u * 298, 405], 'muted', { w: 1.2 });
    k.ln([380, 285, 470, 285]); k.ln([590, 285, 720, 285]);
    const dens = fn(u) > .5 ? 3 : 1; for (let j = 0; j < dens; j++) k.pkt([380, 285, 470, 285], ((T + j * .17) % .5) / .5, 'yellow');
    k.rect(470, 105, 120, 340, 'yellow'); k.txt(530, 128, t('队列', 'Queue'), 15, 'yellow', 'center', 700);
    for (let m = 0; m < n; m++) k.rect(480, 405 - m * 30, 100, 25, 'yellow', { r: 5, fill: k.col('yellow'), lw: 0, a: .85 });
    k.mono(530, 478, Math.round(b * 331) + 'k', 20, n > 5 ? 'red' : 'ink', 'center', 700); k.txt(530, 505, t('积压', 'backlog'), 13, 'soft');
    k.box(720, 230, 220, 110, t('消费者', 'Consumer'), '200 / s', 'teal', { mono: 1 });
    if (n || fn(u) > .1) k.pkt([590, 285, 720, 285], (T % .6) / .6, 'yellow');
    k.txt(830, 370, t('始终按自己的速度', 'always at its own pace'), 14, 'soft');
  } else {
    const X = o => 102 + o * 72, g = k.p(12, 16);
    k.txt(500, 120, t('同一份事件日志，各读各的', 'One event log, three independent readers'), 21, 'ink', 'center', 700);
    for (let m = 0; m < 12; m++) { k.rect(70 + m * 72, 240, 64, 60, 'yellow', { r: 8 }); k.mono(102 + m * 72, 270, m, 18, 'ink'); }
    [[t('通知', 'Notify'), 6 + g * 5, 185, 'teal'], [t('统计', 'Stats'), 3 + g * 4, 355, 'blue'], [t('推荐', 'Recommend'), g * 2.5, 420, 'purple']].forEach(([s, o, y, tone]) => {
      k.ln([X(o), y, X(o), y < 240 ? 238 : 302], tone, { arrow: 1, w: 2.5 }); k.pill(X(o), y + (y < 240 ? -14 : 16), s + ' @' + Math.floor(o), tone, 15);
    });
    k.txt(500, 500, t('新增一个订阅者，不用改生产者', 'Add another subscriber without touching the producer'), 16, 'soft');
  }
});
sc('s93', 15, [0, 4, 8, 11.5], k => {
  const T = k.t, i = k.i;
  k.ln([220, 225, 400, 225]); k.ln([400, 275, 220, 275], 'line', { dash: 1 }); k.ln([620, 225, 800, 225]);
  k.rect(50, 170, 170, 160, 'yellow'); k.txt(135, 196, t('队列', 'Queue'), 16, 'yellow', 'center', 700); k.pill(135, 260, '#42', 'yellow', 18);
  k.box(400, 170, 220, 110, t('通知服务', 'Notification service'), '', 'teal', { hot: k.on(1.5, 2.1) });
  k.rect(400, 320, 220, 130, i === 3 && T > 11.7 ? 'teal' : 'line', { fill: WHITE }); k.txt(416, 344, t('去重记录', 'Dedup record'), 14, 'soft', 'left');
  k.mono(416, 378, '#41 ✓', 17, 'ink', 'left');
  if (i || T > 2) { if (i === 3 && T > 11.7) k.rect(408, 394, 204, 30, 'teal', { r: 6, lw: 0 }); k.mono(416, 410, '#42 ✓', 17, 'ink', 'left', 700); }
  k.rect(800, 120, 140, 280, 'ink', { fill: WHITE, lw: 3, r: 20 });
  if (i || T > 3) { k.rect(812, 160, 116, 50, 'green', { r: 10 }); k.txt(870, 185, t('借阅成功', 'Book borrowed'), 14, 'green', 'center', 700, 104); }
  k.go([220, 225, 400, 225], .3, 1.5, 'yellow', '#42'); k.go([620, 225, 800, 225], 2, 3, 'green');
  if (i === 1) { const p = k.p(4.4, 5.6); if (p > 0) k.al(1 - k.p(5.6, 6.6) * .7, () => k.pkt([400, 275, 300, 275], p, 'teal', 'ack')); if (T > 5.6) k.no(272, 275, 10); }
  if (i === 2) { if (T < 9.4) { k.ring(135, 300, 13, 'yellow', 4, k.p(8, 9.4)); } k.txt(135, 352, t('没等到确认', 'no ack received'), 14, 'red'); k.go([220, 225, 400, 225], 9.5, 10.9, 'yellow', t('#42 重投', '#42 again')); }
  if (i === 3) {
    if (T > 12.3) k.pill(510, 135, t('处理过了：跳过', 'already done: skip'), 'teal', 16);
    k.go([400, 275, 220, 275], 12.8, 14, 'teal', 'ack ✓'); k.txt(870, 430, t('仍然只有 1 条', 'still exactly 1'), 15, 'soft');
  }
});

// ---------- 可观测性 ----------
sc('s101', 21, [0, 5, 10, 16], k => {
  if (k.i === 3) { // 业务计数 + 值班轮换
    const T = k.t, n = Math.round(1 + 56 * k.p(16.5, 20)), days = t('周一 周二 周三 周四 周五 周六 周日', 'Mon Tue Wed Thu Fri Sat Sun').split(' '), who = t('小林 小周 小陈 小郑 小王 小赵 小吴', 'Lin Zhou Chen Zheng Wang Zhao Wu').split(' ');
    k.rect(40, 96, 540, 160, 'line', { fill: '#fbf8f0' });
    ['try { catalogClient.deductStock(isbn); }', 'catch (Exception e) {', '  metrics.counter("stock_deduct_failed").inc();', '}'].forEach((l, j) => { if (j === 2) k.rect(52, 181, 516, 30, 'orange', { r: 6, lw: 0 }); k.mono(62, 124 + j * 36, l, 15, j === 2 ? 'ink' : 'soft', 'left', j === 2 ? 700 : 500, 500); });
    k.rect(610, 96, 350, 160, 'line', { fill: '#fff' }); k.mono(628, 120, 'stock_deduct_failed', 14, 'soft', 'left'); k.mono(942, 122, n, 26, 'orange', 'right', 700);
    k.plot(628, 150, 314, 90, v => .05 + .9 * v * v, 'orange', k.p(16.5, 20));
    k.txt(40, 296, t('值班表：告警发给当天轮到的人，这叫 oncall', 'The rota: the alert goes to whoever is on duty today. This is on-call'), 16, 'ink', 'left', 600, 900);
    days.forEach((d, j) => { const me = j === 2, x = 40 + j * 132; k.rect(x, 322, 120, 170, me ? 'red' : 'line', { fill: me ? undefined : WHITE, lw: me ? 3 : 1.5 }); k.txt(x + 60, 346, d, 15, me ? 'red' : 'soft', 'center', 700); k.who(x + 60, 400, me ? 'red' : 'blue'); k.txt(x + 60, 446, who[j], 16, 'ink'); if (me) k.txt(x + 60, 472, '03:07', 14, 'red', 'center', 700); });
    return;
  }
  const T = k.t, u = T / 16, sm = (a, b, v) => { v = k.clamp((v - a) / (b - a)); return v * v * (3 - 2 * v); };
  const fn = v => .12 + .03 * Math.sin(v * 40) + .55 * Math.exp(-Math.pow((v - .12) / .022, 2)) + .58 * (sm(.36, .39, v) - sm(.62, .66, v));
  k.rect(40, 100, 610, 300, 'line', { fill: '#fff' }); k.txt(58, 127, t('借阅服务 · 错误率', 'Borrow service · error rate'), 15, 'soft', 'left');
  const ty = 150 + 220 * (1 - .45); k.ln([70, ty, 630, ty], 'red', { dash: 1, w: 1.6 }); k.mono(626, ty - 14, '1%', 14, 'red', 'right');
  k.plot(70, 150, 560, 220, fn, fn(u) > .45 ? 'red' : 'blue', u); k.ln([70 + u * 560, 145, 70 + u * 560, 375], 'muted', { w: 1.2 });
  const f = T > 1.75 && T < 2.3 ? (T - 1.75) / 3 : T > 6 && T < 10.3 ? (T - 6) / 3 : 0, firing = T >= 9;
  k.txt(58, 430, t('连续超限', 'over threshold for'), 15, 'soft', 'left'); k.bar(230, 423, 260, 14, f, f >= 1 ? 'red' : 'orange');
  k.mono(505, 431, Math.round(k.clamp(f) * 120) + ' s / 120 s', 15, 'soft', 'left');
  k.rect(730, 110, 190, 290, 'ink', { fill: WHITE, lw: 3, r: 22 }); k.txt(825, 140, t('值班手机', 'on-call phone'), 14, 'soft');
  if (firing) { k.rect(745, 170, 160, 96, 'red', { r: 12, a: .7 + .3 * k.blink(1.2) }); k.txt(825, 200, t('告警', 'ALERT'), 18, 'red', 'center', 700); k.txt(825, 232, t('错误率 > 1%', 'error rate > 1%'), 14, 'red'); }
  else k.txt(825, 250, T > 2.3 && T < 4.6 ? t('只是抖了一下', 'just a blip') : t('安静', 'quiet'), 16, 'muted');
  if (k.i === 2) k.al(k.e(10.4, 11.4), () => {
    k.ln([825, 400, 770, 448], 'green', { arrow: 1 }); k.ln([825, 400, 880, 448], 'green', { arrow: 1 });
    k.pill(760, 468, t('链路', 'Traces'), 'green', 15); k.pill(890, 468, t('日志', 'Logs'), 'green', 15); k.txt(825, 512, t('原因在那里', 'the cause is there'), 14, 'soft');
  });
});
sc('s102', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, X = ms => 220 + ms / 1200 * 680;
  const rows = [[t('API 网关', 'Gateway'), 0, 1140, 'teal'], [t('借阅', 'Borrow'), 20, 1100, 'orange'], [t('用户', 'Users'), 40, 35, 'blue'], [t('馆藏', 'Catalog'), 90, 1003, 'orange'], [t('消息队列', 'Queue'), 1100, 12, 'yellow'], [t('通知', 'Notify'), 1115, 20, 'green']];
  k.rect(40, 86, 920, 42, 'line', { fill: '#fff', lw: 1.5 }); k.mono(60, 108, 'trace_id = 4bf92f3577b34da6a3ce929d0e0e4736', 16, 'purple', 'left', 700);
  [0, 300, 600, 900, 1200].forEach(ms => { k.mono(X(ms), 148, ms + ' ms', 12, 'muted'); k.ln([X(ms), 160, X(ms), 425], 'line', { w: 1, a: .6 }); });
  const py = !i ? 178 + k.p(.3, 3.6) * 230 : 0;
  rows.forEach(([s, st, dur, tone], j) => {
    const y = 178 + j * 46, slow = j === 3 && i >= 2;
    k.txt(54, y, s, 17, !i && py >= y - 4 ? 'purple' : 'ink', 'left', !i && py >= y - 4 ? 700 : 500);
    const g = !i ? 0 : i === 1 ? k.e(4.2 + j * .55, 5 + j * .55) : 1;
    if (g > 0) k.al(i >= 2 && !slow ? .45 : 1, () => { k.rect(X(st), y - 12, Math.max(5, (X(st + dur) - X(st)) * g), 24, slow ? 'red' : tone, { r: 5, fill: k.col(slow ? 'red' : tone), lw: 0 }); });
    if (slow) k.mono(X(st + dur) - 10, y, '1003 ms', 15, '#fff', 'right', 700);
  });
  if (!i) { k.ln([190, 178, 190, 408], 'purple', { dash: 1, a: .5 }); k.pkt([190, 178, 190, 408], k.p(.3, 3.6), 'purple'); }
  if (i === 3) k.al(k.e(12.2, 13), () => {
    k.rect(40, 440, 920, 92, 'ink', { fill: '#263348', lw: 0, r: 10 });
    k.mono(60, 470, 'ERROR catalog  deductStock timeout  cost_ms=1003', 16, '#ffd9d2', 'left', 700); k.mono(60, 502, 'trace_id=4bf92f3577b34da6…  isbn=9787111544937', 15, '#c9d2e3', 'left');
  });
});

// ---------- 开发与发布 ----------
sc('s11', 16, [0, 5, 8.5, 12], k => {
  const T = k.t, i = k.i;
  if (!i) {
    k.rect(250, 92, 500, 410, 'line', { fill: '#fff' }); k.txt(272, 120, t('课设小组（3）', 'Project group (3)'), 17, 'ink', 'left', 700);
    const files = [t('图书管理-最终版.zip', 'library-final.zip'), t('图书管理-最终版2.zip', 'library-final2.zip'), t('图书管理-最终版-真的.zip', 'library-final-really.zip'), t('最终版2(1)-改.zip', 'final2(1)-fixed.zip')];
    files.forEach((s, j) => k.al(k.e(.4 + j * .9, .8 + j * .9), () => {
      k.dot(290, 180 + j * 68, 15, ['orange', 'teal', 'purple', 'orange'][j]); k.rect(322, 156 + j * 68, 330, 48, 'line', { fill: '#fbf8f0', lw: 1.5 });
      k.ic('zip', 348, 180 + j * 68, 24, 'soft'); k.txt(372, 181 + j * 68, s, 16, 'ink', 'left', 500, 270);
    }));
    if (T > 4.1) k.pill(500, 462, t('到底哪个是最新的？', 'Which one is the latest?'), 'red');
    return;
  }
  const have = [T > 5.8, T > 10.4, T > 13.9];
  [[t('我的电脑', 'My laptop'), 'orange'], [t('远程仓库', 'Remote repo'), 'purple'], [t('队友电脑', 'Teammate'), 'teal']].forEach(([s, tone], j) => {
    const cx = 180 + j * 320; k.rect(cx - 130, 130, 260, 300, tone, { fill: WHITE }); k.txt(cx, 162, s, 18, 'ink', 'center', 700);
    k.ln([cx - 50, 300, have[j] ? cx + 50 : cx - 50, 300], 'purple', { w: 3 }); commit(k, cx - 50, 300, 'A');
    if (have[j]) commit(k, cx + 50, 300, 'B', 'orange');
    tag(k, cx + (have[j] ? 50 : -50), 350, 'main', 'purple');
  });
  if (i === 1) k.mono(180, 220, '$ git commit', 17, 'orange', 'center', 700);
  k.go([230, 300, 550, 300], 8.8, 10.4, 'purple', 'push'); k.go([550, 300, 870, 300], 12.3, 13.9, 'teal', 'pull');
  if (i === 3 && T > 13.9) k.pill(500, 480, t('三个人看到的是同一段历史', 'everyone sees the same history'), 'green');
});
sc('s12', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, nb = i < 2 ? 0 : i === 2 ? [7.3, 8.3, 9.3].filter(a => T > a).length : 3, nr = i < 3 ? 0 : [10.8, 12].filter(a => T > a).length;
  k.ln([90, 300, 240, 300], 'purple', { w: 3 });
  if (i >= 1) {
    const bx = 400 + Math.max(0, nb - 1) * 140, rx = 430 + Math.max(0, nr - 1) * 160;
    k.ln(nb ? [240, 300, 320, 170, bx, 170] : [240, 300, 290, 220], 'orange', { w: 3 });
    k.ln(nr ? [240, 300, 330, 430, rx, 430] : [240, 300, 290, 380], 'teal', { w: 3 });
    for (let j = 0; j < nb; j++) commit(k, 400 + j * 140, 170, 'B' + (j + 1), 'orange');
    for (let j = 0; j < nr; j++) commit(k, 430 + j * 160, 430, 'R' + (j + 1), 'teal');
    tag(k, nb ? bx + 20 : 345, nb ? 125 : 205, 'feature/borrow', 'orange'); tag(k, nr ? rx + 20 : 345, nr ? 475 : 398, 'feature/return', 'teal');
  }
  commit(k, 110, 300, '…'); commit(k, 240, 300, 'A'); tag(k, 240, 348, 'main', 'purple');
  if (i >= 2) k.txt(760, 300, t('main 一直停在 A：始终是能运行的版本', 'main stays on A: always the version that runs'), 16, 'soft', 'center', 500, 400);
});
sc('s13', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i;
  k.ln([130, 290, 230, 175], 'purple', { w: 3 }); k.ln([130, 290, 230, 405], 'orange', { w: 3 });
  commit(k, 110, 290, 'A'); k.mono(110, 334, 'maxDays = 7', 14, 'soft');
  k.rect(230, 120, 270, 110, 'purple', { fill: WHITE }); k.mono(250, 148, 'main', 16, 'purple', 'left', 700); k.mono(250, 190, 'int maxDays = ' + (i ? 14 : 7) + ';', 18, i === 1 ? 'purple' : 'ink', 'left', 700);
  k.rect(230, 350, 270, 110, 'orange', { fill: WHITE }); k.mono(250, 378, 'feature/borrow', 16, 'orange', 'left', 700); k.mono(250, 420, 'int maxDays = ' + (i ? 30 : 7) + ';', 18, i === 1 ? 'orange' : 'ink', 'left', 700);
  k.ln([500, 175, 610, 265], i >= 2 ? 'purple' : 'line', { w: 2.5 }); k.ln([500, 405, 610, 315], i >= 2 ? 'orange' : 'line', { w: 2.5 });
  k.go([500, 175, 610, 265], 8.2, 9.2, 'purple'); k.go([500, 405, 610, 315], 8.2, 9.2, 'orange');
  if (i < 2) { k.rect(610, 220, 150, 140, 'line', { dash: 1, fill: 0 }); k.txt(685, 290, 'merge ?', 18, 'muted'); }
  if (i === 2 && T > 9.2) {
    k.rect(610, 170, 340, 240, 'red', { fill: WHITE }); k.pill(780, 140, t('冲突：需要人来选', 'Conflict: a human has to choose'), 'red', 16);
    ['<<<<<<< main', 'int maxDays = 14;', '=======', 'int maxDays = 30;', '>>>>>>> feature/borrow'].forEach((s, j) => k.mono(630, 205 + j * 42, s, 17, j % 2 ? 'ink' : 'red', 'left', j % 2 ? 700 : 500));
  }
  if (i === 3) {
    k.rect(610, 170, 340, 150, 'green', { fill: WHITE }); k.pill(780, 140, t('合并提交 M：两个父提交', 'Merge commit M: two parents'), 'green', 16);
    k.mono(630, 215, 'int maxDays = 30;', 18, 'ink', 'left', 700); k.txt(630, 262, t('熟悉借阅规则的人选了 30 天', 'someone who knows the rules chose 30'), 15, 'soft', 'left', 500, 300);
    commit(k, 780, 380, 'M', 'green'); k.ln([660, 320, 765, 368], 'purple', { w: 2.5 }); k.ln([900, 320, 795, 368], 'orange', { w: 2.5 });
  }
});
sc('s14', 15, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, lift = i === 1 ? k.e(4, 5.5) : i > 1 ? 1 : 0, nn = i < 2 ? 0 : [8.8, 9.9, 11].filter(a => T > a).length;
  if (i) k.mono(500, 108, '$ git rebase main', 18, 'ink', 'center', 700);
  k.ln([80, 340, 340 + nn * 140, 340], 'purple', { w: 3 });
  k.al(1 - lift * .75, () => {
    k.ln([160, 340, 230, 200 - lift * 22, 540, 200 - lift * 22], 'orange', { w: 3, dash: i > 1 });
    ['c41d7a2', '5e9b3f0', 'a72c8e4'].forEach((id, j) => { commit(k, 300 + j * 120, 200 - lift * 22, 'B' + (j + 1), 'orange'); k.mono(300 + j * 120, 236 - lift * 22, id, 12, 'soft'); });
  });
  if (i > 1) k.txt(420, 142, t('旧提交：没人指向它们了', 'old commits: nothing points at them now'), 14, 'muted');
  commit(k, 160, 340, 'A'); commit(k, 340, 340, 'C'); tag(k, 340, 392, 'main', 'purple');
  ['9f1e0b3', '27d4c6a', 'e03a9d1'].forEach((id, j) => {
    const a = 8.8 + j * 1.1; k.go([300 + j * 120, 178, 480 + j * 140, 340], a - .8, a, 'orange');
    if (j < nn) { commit(k, 480 + j * 140, 340, 'B' + (j + 1) + '′', 'orange'); k.mono(480 + j * 140, 376, id, 12, 'orange'); }
  });
  tag(k, nn ? 480 + (nn - 1) * 140 : 540, nn ? 295 : 155 - lift * 22, 'feature/borrow', 'orange');
  if (i === 3) k.pill(500, 478, t('已经推送的公共分支，不要这样改写', 'never rewrite a shared branch that is already pushed'), 'orange', 16);
});
sc('s41', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, fixed = i === 3 && T > 15.2;
  k.rect(60, 100, 380, 110, i ? 'green' : 'red', { fill: WHITE }); k.mono(80, 135, (i ? '+ ' : '') + 'if (stock ' + (i ? '>' : '<') + ' 0) borrow();', 18, i ? 'green' : 'red', 'left', 700);
  k.txt(80, 175, i ? t('修好的判断', 'the corrected check') : t('判断写反了', 'the check is inverted'), 15, 'soft', 'left');
  k.ln([520, 155, 940, 155], 'purple', { w: 3 }); commit(k, 560, 155, '·'); commit(k, 660, 155, i ? '·' : (T > 1.6 ? '✕' : '·'), !i && T > 1.6 ? 'red' : 'purple');
  if (fixed) commit(k, 800, 155, '✓', 'green');
  k.mono(900, 125, 'main', 16, 'purple', 'center', 700); if (i) k.ic('lock', 940, 124, 22, 'purple');
  k.ln([810, 175, 810, 300], 'line');
  const broken = !i && T > 2.4;
  k.box(700, 300, 220, 100, t('生产环境', 'Production'), broken ? t('全校借书失败', 'borrowing fails everywhere') : fixed ? t('新版本正常', 'new version healthy') : i ? t('已回退', 'reverted') : t('正常', 'healthy'), broken ? 'red' : 'teal', { hot: broken, st: broken ? 'red' : fixed ? 'green' : 'soft' });
  if (!i) { k.go([440, 155, 660, 155], .5, 1.6, 'red', 'git push'); k.go([810, 175, 810, 300], 1.6, 2.4, 'red'); }
  if (i) {
    k.rect(60, 250, 380, 250, 'purple', { fill: WHITE }); k.txt(82, 282, 'Pull Request #12', 18, 'ink', 'left', 700); k.txt(82, 312, t('修复库存判断', 'Fix the stock check'), 15, 'soft', 'left');
    const st = [i >= 2 && T > 9 ? 1 : 0, i >= 2 && T > 9.7 ? 1 : 0, i >= 2 && T > 10.4 ? 1 : 0, i === 3 ? (T > 13.2 ? 1 : 0) : i === 2 && T > 11 ? -1 : 0];
    [t('队友评审', 'Teammate review'), t('CI · 编译', 'CI · build'), t('CI · 静态检查', 'CI · static analysis'), t('CI · 自动化测试', 'CI · automated tests')].forEach((s, j) => {
      const y = 352 + j * 36; k.txt(82, y, s, 17, 'ink', 'left');
      if (st[j] > 0) k.yes(405, y, 9); else if (st[j] < 0) k.no(405, y, 8); else if (i >= 2) k.ring(405, y, 9, 'muted', 3, (T * .9 + j * .3) % 1); else k.ring(405, y, 9, 'line', 3);
    });
    if (i === 1) k.txt(620, 250, t('直接推送：被拒绝', 'direct push: rejected'), 15, 'purple', 'center', 600);
    if (i === 2 && T > 11) k.pill(590, 450, t('测试没过：不能合并', 'tests failed: merge blocked'), 'red', 16);
    if (i === 3 && T > 13.4) k.pill(590, 450, t('全部通过：可以合并', 'all green: ready to merge'), 'green', 16);
    k.go([440, 300, 800, 155], 14, 15.2, 'purple', 'merge');
  }
});
sc('s42', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i;
  if (i === 0) {
    [[t('我的电脑', 'My laptop'), 'Java 17'], [t('队友电脑', 'Teammate'), 'Java 11'], [t('服务器', 'Server'), 'Java 8']].forEach(([s, v], j) => {
      const bad = j === 2 && T > 2; k.box(70 + j * 310, 170, 240, 150, s, v, bad ? 'red' : 'teal', { mono: 1, hot: bad });
      if (T > .8 + j * .6) (j === 2 ? (bad && k.no(190 + j * 310, 360, 12)) : k.yes(190 + j * 310, 360, 12));
    });
    if (T > 2) k.mono(810, 410, 'UnsupportedClassVersionError', 14, 'red');
    k.txt(190, 420, t('“在我电脑上能跑”', '“works on my machine”'), 16, 'soft');
  }
  const layers = [['library.jar', 'orange'], ['JDK 17', 'teal'], [t('系统库', 'system libraries'), 'indigo']];
  if (i === 1) {
    ['FROM eclipse-temurin:17', 'COPY library.jar /app/', 'ENTRYPOINT java -jar …'].forEach((s, j) => k.mono(60, 200 + j * 46, s, 16, T > 4.3 + [0, 2, 3][j] * .01 && j <= Math.floor(k.p(4.3, 7) * 3) ? 'ink' : 'muted', 'left', 700));
    k.txt(60, 150, 'Dockerfile', 16, 'soft', 'left');
    layers.forEach(([s, tone], j) => { const a = [6.3, 5.3, 4.3][j]; k.al(k.e(a, a + .5), () => { const y = 190 + j * 72 - (1 - k.e(a, a + .6)) * 40; k.rect(560, y, 300, 62, tone, { r: 10 }); k.txt(710, y + 31, s, 18, 'ink', 'center', 700); }); });
    if (T > 6.9) k.pill(710, 440, t('镜像 borrow:1.4.4', 'image borrow:1.4.4'), 'purple');
  }
  if (i === 2) {
    layers.forEach(([s, tone], j) => { k.rect(70, 215 + j * 52, 210, 44, tone, { r: 8 }); k.txt(175, 237 + j * 52, s, 15, 'ink'); }); k.txt(175, 190, t('一个镜像', 'one image'), 16, 'soft');
    [0, 1, 2].forEach(j => { const a = 8.4 + j * .8; k.ln([280, 290, 470, 165 + j * 125]); k.go([280, 290, 470, 165 + j * 125], a, a + .8, 'purple'); k.al(k.e(a + .7, a + 1.1), () => { k.box(470, 120 + j * 125, 210, 90, t('容器 ', 'Container ') + (j + 1), 'Java 17 ✓', 'teal', { mono: 1, st: 'green' }); k.bar(700, 150 + j * 125, 90, 10, [.3, .55, .4][j], 'purple'); k.mono(745, 178 + j * 125, '≤ 4G', 13, 'purple'); }); });
    k.txt(885, 270, t('到哪里都一样', 'the same everywhere'), 16, 'soft', 'center', 500, 180); k.txt(885, 300, t('各有资源上限', 'each with a resource cap'), 16, 'purple', 'center', 500, 180);
  }
  if (i === 3) {
    k.txt(270, 108, t('容器', 'Containers'), 20, 'ink', 'center', 700); k.txt(730, 108, t('虚拟机', 'Virtual machines'), 20, 'ink', 'center', 700);
    k.bar(120, 138, 300, 10, k.p(12.3, 12.8), 'green'); k.bar(580, 138, 300, 10, k.p(12.3, 15.6), 'orange');
    k.mono(270, 170, t('启动 ≈ 1 秒', 'starts in ≈ 1 s'), 16, 'green', 'center', 700); k.mono(730, 170, t('启动 ≈ 40 秒', 'starts in ≈ 40 s'), 16, 'orange', 'center', 700);
    [0, 1, 2].forEach(j => k.box(80 + j * 130, 290, 120, 70, 'App', '', 'teal'));
    k.rect(80, 375, 380, 48, 'purple', { r: 8 }); k.txt(270, 399, t('容器引擎', 'Container engine'), 16, 'ink');
    k.rect(80, 435, 380, 48, 'indigo', { r: 8 }); k.txt(270, 459, t('共用宿主机内核', 'one shared host kernel'), 16, 'ink', 'center', 700);
    [0, 1].forEach(j => { k.rect(540 + j * 195, 205, 185, 218, 'orange', { r: 10, fill: WHITE }); k.box(552 + j * 195, 218, 161, 60, 'App', '', 'teal'); k.rect(552 + j * 195, 290, 161, 120, 'orange', { r: 8 }); k.txt(632 + j * 195, 350, t('整套操作系统', 'a full guest OS'), 15, 'ink', 'center', 700, 150); });
    k.rect(540, 435, 380, 48, 'indigo', { r: 8 }); k.txt(730, 459, 'Hypervisor', 16, 'ink');
  }
});
sc('s43', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, e = (a, b, x0, x1) => k.lerp(x0, x1, k.e(a, b));
  const px = !i ? e(0, 2, 60, 160) : i === 1 ? e(3.7, 5.7, 160, 410) : i === 2 ? (T < 9.5 ? e(7.2, 8.5, 410, 560) : e(9.6, 10.4, 560, 845)) : 845;
  const open = (i === 2 && T > 9.5) || i === 3, p2 = i === 3 ? e(10.7, 13.6, 60, 845) : 0;
  k.ln([50, 335, 950, 335], 'ink', { w: 5 }); for (let x = 70; x < 950; x += 55) k.dot(x - (T * 30) % 55 + 27, 352, 6, 'line');
  [[80, t('构建', 'Build')], [330, t('预发布', 'Staging')], [765, t('生产', 'Production')]].forEach(([x, s]) => k.box(x, 150, 170, 80, s, '', 'teal', { hot: Math.abs((i === 3 ? p2 : px) - x - 85) < 70 }));
  k.rect(596, 235 - (open ? 70 : 0), 10, 95, open ? 'green' : 'red', { r: 4, fill: k.col(open ? 'green' : 'red'), lw: 0 });
  if (i === 2) k.pill(600, 130, T < 9.5 ? t('等人点“发布”', 'waiting for someone to press Release') : t('已批准', 'approved'), T < 9.5 ? 'orange' : 'green', 16);
  if (i === 2 && k.on(8.9, 9.7)) k.who(600, 440, 'purple', t('审批人', 'approver'));
  if (i === 3) k.pill(600, 130, t('检查通过：自动放行', 'checks passed: released automatically'), 'green', 16);
  const pack = (x, v) => { k.rect(x - 46, 273, 92, 56, 'purple', { r: 9 }); k.mono(x, 301, v, 18, 'ink', 'center', 700); };
  k.al(i === 3 ? 1 - k.e(10.6, 11.6) : 1, () => pack(px, '1.4.4')); if (i === 3) pack(p2, '1.4.5');
  if (i >= 2) k.txt(500, 470, i === 2 ? t('持续交付：随时可以发，但由人决定何时发', 'Continuous delivery: always releasable, a person decides when') : t('持续部署：连最后这一下也自动化', 'Continuous deployment: even that last step is automated'), 18, 'ink', 'center', 700, 880);
});
sc('s44', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, u = T / 16, sm = (a, b, v) => { v = k.clamp((v - a) / (b - a)); return v * v * (3 - 2 * v); };
  const fn = v => .12 + .02 * Math.sin(v * 60) + .6 * (sm(.53, .68, v) - sm(.78, .86, v)), canary = T >= 4.5 && T < 12.8, bad = T > 9.4 && T < 12.8;
  [[40, t('错误率', 'Error rate'), v => fn(v), (.17 + fn(u) * 5).toFixed(2) + '%'], [520, t('响应时间', 'Latency'), v => .2 + (fn(v) - .12) * .7, Math.round(110 + fn(u) * 260) + ' ms']].forEach(([x, s, f, val]) => {
    k.rect(x, 92, 440, 160, bad ? 'red' : 'green', { fill: '#fff' }); k.txt(x + 16, 116, s, 14, 'soft', 'left'); k.mono(x + 424, 116, val, 16, bad ? 'red' : 'green', 'right', 700);
    k.plot(x + 16, 136, 408, 100, f, bad ? 'red' : 'blue', u, 2.6);
  });
  k.pill(500, 284, [t('全部 1.4.3', 'everything on 1.4.3'), t('2 / 12 台 · 约 10% 流量', '2 of 12 instances · about 10% of traffic'), t('新版指标变差', 'the new version looks worse'), t('只回滚这 2 台', 'roll back just those 2')][i], ['muted', 'purple', 'red', 'teal'][i], 15);
  for (let j = 0; j < 12; j++) {
    const c = j % 4, r = (j / 4) | 0, isC = (j === 0 || j === 4) && canary;
    k.box(130 + c * 190, 312 + r * 68, 170, 54, isC ? '1.4.4' : '1.4.3', '', isC ? (bad ? 'red' : 'purple') : 'blue', { hot: isC, size: 19 });
  }
});

// ---------- 原来只有文字的方框：每个都有自己的动画 ----------
sc('sclient', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i;
  const row = (y, hot) => {
    k.rect(115, y, 250, 64, 'line', { fill: WHITE, r: 8, lw: 1.5 }); k.rect(125, y + 10, 30, 44, 'purple', { r: 4, fill: k.col('purple'), lw: 0 });
    k.txt(165, y + 22, t('算法导论', 'Intro to Algorithms'), 15, 'ink', 'left', 700, 118); k.txt(165, y + 45, t('库存 2', '2 in stock'), 13, 'soft', 'left');
    k.rect(292, y + 18, 62, 28, 'orange', { r: 6, fill: hot ? k.col('orange') : undefined, lw: 1.5 }); k.txt(323, y + 33, t('借阅', 'Borrow'), 13, hot ? '#fff' : 'orange', 'center', 700);
  };
  k.rect(90, 88, 300, 446, 'ink', { fill: '#fff', lw: 4, r: 30 }); k.rect(205, 100, 70, 9, 'ink', { r: 5, fill: k.col('ink'), lw: 0 });
  k.txt(240, 138, t('图书馆', 'Library'), 18, 'ink', 'center', 700);
  if (i === 0) {
    const q = t('算法', 'algorithms'); k.rect(115, 165, 250, 40, 'blue', { fill: WHITE, r: 8, lw: 1.5 }); k.ic('search', 138, 185, 20, 'soft');
    k.txt(160, 186, q.slice(0, Math.ceil(q.length * k.p(.3, 1.4))), 17, 'ink', 'left'); k.al(k.e(1.7, 2.3), () => row(225, false));
  } else if (i === 1) {
    const id = '2023010123';
    k.txt(115, 172, t('学号', 'Student id'), 13, 'soft', 'left'); k.rect(115, 184, 250, 40, 'line', { fill: WHITE, r: 8, lw: 1.5 }); k.mono(130, 205, id.slice(0, Math.ceil(10 * k.p(3.7, 4.8))), 17, 'ink', 'left');
    k.txt(115, 244, t('密码', 'Password'), 13, 'soft', 'left'); k.rect(115, 256, 250, 40, 'line', { fill: WHITE, r: 8, lw: 1.5 }); k.mono(130, 277, '••••••••'.slice(0, Math.ceil(8 * k.p(4.9, 5.6))), 17, 'ink', 'left');
    k.rect(115, 320, 250, 42, 'ink', { r: 8, fill: k.col('ink'), lw: 0 }); k.txt(240, 342, t('登录', 'Log in'), 16, '#fff', 'center', 700);
    if (T > 6) k.pill(240, 410, t('已登录 ✓', 'logged in ✓'), 'green', 15);
  } else {
    k.mono(240, 172, '2023010123', 13, 'soft'); row(190, T > 7.6 && T < 12);
    if (T > 12) { k.rect(125, 285, 230, 130, 'ink', { r: 14, fill: '#263348', lw: 0, a: .94 }); k.yes(240, 318, 13); k.txt(240, 356, t('借阅成功', 'Borrowed'), 19, '#fff', 'center', 700); k.txt(240, 388, t('应还 2026-10-01', 'due 2026-10-01'), 14, '#c9d2e3'); }
  }
  [t('网页', 'Web'), 'App', t('小程序', 'Mini program')].forEach((s, j) => k.pill(600 + j * 130, 128, s, 'blue', 15));
  k.txt(730, 172, t('三种客户端，做的是同一件事', 'three kinds of client, the same action'), 15, 'soft');
  k.ln([390, 300, 620, 300]);
  k.al(i < 2 ? .35 : 1, () => k.box(620, 240, 300, 120, t('统一入口', 'The single entry'), 'lib.example.edu.cn', 'teal', { mono: 1, hot: i >= 2 && k.on(9.6, 10.8) }));
  k.go([390, 300, 620, 300], 8, 9.6, 'blue', 'POST /api/borrow'); k.go([620, 300, 390, 300], 10.8, 12, 'green', '200 OK');
  if (i === 3 && T > 12) k.txt(770, 420, t('这四步背后发生的事，就是整张画布', 'what happens behind these four steps is this whole canvas'), 15, 'soft', 'center', 500, 420);
});
sc('dns', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, known = (i === 1 && T > 6.4) || i > 1, name = 'lib.example.edu.cn', iy = [200, 290, 380];
  k.ln([350, 250, 440, 160], 'line', { dash: 1 }); k.ln([350, 300, 590, 320]);
  k.rect(50, 110, 300, 46, 'line', { fill: '#fff', r: 23, lw: 1.5 }); k.mono(200, 133, i ? name : name.slice(0, Math.ceil(name.length * k.p(.3, 2.2))), 16, 'ink');
  k.box(50, 215, 300, 120, t('浏览器', 'Browser'), known ? '→ 203.0.113.25' : t('它在哪台机器上？', 'which machine is that?'), 'blue', { mono: known, st: known ? 'green' : 'soft', hot: i === 1 && T > 6.4 });
  k.box(440, 95, 300, 110, 'DNS', name + ' → 203.0.113.25', 'teal', { mono: 1, hot: i === 1 && k.on(5, 5.4) });
  k.al(i < 2 ? .35 : 1, () => {
    const gone = i === 3 && T > 11.2, born = i === 3 ? k.e(11.5, 12.2) : 0;
    iy.forEach((y, j) => { if (j === 1 && gone) return; k.ln([760, 320, 840, y + 27]); k.box(840, y, 120, 54, t('实例 ', 'Instance ') + (j + 1), '', j === 1 && i === 3 && T > 10.7 ? 'red' : 'orange', { size: 16 }); });
    if (born) k.al(born, () => { k.ln([760, 320, 840, iy[1] + 27]); k.box(840, iy[1], 120, 54, t('实例 4', 'Instance 4'), '', 'orange', { size: 16, hot: 1 }); });
    k.box(590, 265, 170, 110, 'Nginx', '203.0.113.25', 'blue', { mono: 1, hot: i === 2 && k.on(8.8, 9.2) });
  });
  k.go([350, 250, 440, 160], 3.8, 5, 'teal', t('地址是？', 'address?')); k.go([440, 160, 350, 250], 5.2, 6.4, 'green', '203.0.113.25');
  k.go([350, 300, 590, 320], 7.4, 8.8, 'blue'); k.go([760, 320, 840, iy[0] + 27], 8.8, 9.5, 'blue'); k.go([840, iy[0] + 27, 760, 320, 590, 320, 350, 300], 9.6, 10.4, 'green');
  k.go([350, 300, 590, 320, 760, 320, 840, iy[2] + 27], 12.3, 13.6, 'blue');
  if (i === 3 && T > 12.2) k.pill(330, 480, t('后面怎么换，名字和入口地址都不变', 'whatever changes behind it, the name and the entry address stay'), 'teal', 16);
});
sc('logs', 16, [0, 4, 8, 12], k => {
  const T = k.t, i = k.i, m = j => [40 + (j % 2) * 150, 105 + ((j / 2) | 0) * 125];
  for (let j = 0; j < 6; j++) {
    const [x, y] = m(j); k.rect(x, y, 132, 100, 'teal', { fill: WHITE, lw: 1.5 }); k.mono(x + 12, y + 18, 'app-0' + (j + 1), 13, 'soft', 'left');
    for (let l = 0; l < 3; l++) { const bad = j === 3 && l === (Math.floor(T * 1.5) % 3); k.rect(x + 12, y + 36 + l * 19, 70 + ((j * 7 + l * 23 + Math.floor(T * 1.5) * 13) % 40), 9, bad ? 'red' : 'line', { r: 4, lw: 0, fill: k.col(bad ? 'red' : 'line') }); }
    if (i) { k.ln([x + 132, y + 50, 400, 300], 'teal', { a: .5, w: 1.5 }); const p = ((T + j * .23) % 1.2) / 1.2; k.dot(k.lerp(x + 132, 400, p), k.lerp(y + 50, 300, p), 5, 'teal'); }
  }
  if (!i) { k.mono(180, 492, '$ ssh app-0' + (1 + Math.floor(T * 1.5) % 6) + '  grep ERROR *.log', 15, 'ink'); k.txt(180, 520, t('一台一台登上去翻', 'logging in machine by machine'), 14, 'red'); }
  k.al(i ? 1 : .25, () => {
    k.cyl(400, 215, 130, 170, t('日志平台', 'Log store'), '', 'green'); if (i) k.txt(465, 410, t('采集组件实时送来', 'shipped in real time'), 13, 'soft');
    k.ln([530, 300, 570, 300], 'line');
    k.rect(570, 95, 400, 430, 'line', { fill: '#fff' });
    const q = 'service:borrow-service and level:ERROR';
    k.rect(586, 110, 368, 38, 'blue', { fill: WHITE, r: 8, lw: 1.5 }); k.mono(600, 130, i > 2 ? q : i === 2 ? q.slice(0, Math.ceil(q.length * k.p(8.2, 10))) : '', 13.5, 'ink', 'left', 500, 344);
    if (i === 2 && T > 10.3) for (let r = 0; r < 6; r++) { k.mono(600, 178 + r * 54, '03:07:0' + (2 - (r > 2)) + ' ERROR [borrow-service]', 13, 'red', 'left', 700, 344); k.txt(600, 198 + r * 54, t('扣减库存失败 isbn=9787…', 'deduct stock failed isbn=9787…'), 13, 'soft', 'left'); }
    if (i === 3) {
      k.rect(586, 162, 368, 190, 'red', { r: 8, lw: 1.5 });
      k.mono(600, 184, '03:07:02.431 ERROR [borrow-service,', 13, 'red', 'left', 700, 344); k.mono(600, 206, '4bf92f3577b34da6]', 14, 'purple', 'left', 700);
      k.txt(600, 236, t('扣减库存失败 isbn=9787111544937', 'deduct stock failed isbn=9787111544937'), 13.5, 'ink', 'left', 500, 344);
      k.mono(600, 268, 'SocketTimeoutException: Read timed out', 13, 'ink', 'left', 500, 344); k.mono(600, 292, '  at CatalogClient.deductStock(…:58)', 13, 'soft', 'left', 500, 344);
      k.txt(600, 328, t('↑ Trace ID：拿它去看整条链路', '↑ the Trace ID: use it to open the whole trace'), 13, 'purple', 'left', 600, 344);
      for (let r = 0; r < 3; r++) k.mono(600, 380 + r * 40, '03:07:0' + (1 - (r > 1)) + ' ERROR [borrow-service] …', 13, 'muted', 'left', 500, 344);
    }
  });
});
sc('bcode', 14, [0, 3.5, 7, 10.5], k => {
  const T = k.t, i = k.i, ly = [185, 230, 275, 320], ty = [140, 240, 345, 455];
  const lines = ['Receipt borrow(userId, isbn) {', '  users.checkEligible(userId);', '  catalog.deductStock(isbn, 1);', '  loans.save(new Loan(userId, isbn));', '  events.publish("loan.created");', '  return new Receipt(loan.id());', '}'];
  k.rect(40, 100, 480, 340, 'line', { fill: '#fbf8f0' });
  k.rect(52, ly[i] - 18, 456, 36, 'orange', { r: 6, lw: 0 });
  lines.forEach((s, j) => k.mono(64, 140 + j * 45, s, 16, j === i + 1 ? 'ink' : 'soft', 'left', j === i + 1 ? 700 : 500, 440));
  ly.forEach((y, j) => k.ln([520, y, 720, ty[j]], j === i ? 'orange' : 'line', { w: j === i ? 3 : 2 }));
  k.box(720, 100, 230, 80, t('用户服务', 'User service'), i > 0 || T > 2.6 ? t('可以借 ✓', 'eligible ✓') : '', 'blue', { st: 'green', hot: !i && k.on(1.6, 2) });
  k.box(720, 200, 230, 80, t('馆藏服务', 'Catalog service'), 'stock ' + (T > 5.1 ? 2 : 3), 'teal', { mono: 1, hot: k.on(5.1, 5.5) });
  k.cyl(770, 295, 130, 100, t('借阅库', 'loan DB'), '', 'indigo', { hot: k.on(8.6, 9), size: 17 });
  k.rect(720, 420, 230, 70, 'yellow'); k.txt(835, 455, t('消息队列', 'Message queue'), 18, 'ink', 'center', 700); if (i === 3 && T > 12) k.rect(740, 470, 70, 12, 'yellow', { r: 4, fill: k.col('yellow'), lw: 0 });
  k.go([520, ly[0], 720, ty[0]], .4, 1.6, 'blue', 'RPC'); k.go([720, ty[0], 520, ly[0]], 2, 3, 'green');
  k.go([520, ly[1], 720, ty[1]], 3.9, 5.1, 'blue', 'RPC'); k.go([720, ty[1], 520, ly[1]], 5.5, 6.5, 'green');
  k.go([520, ly[2], 770, ty[2]], 7.4, 8.6, 'blue', 'INSERT'); k.go([770, ty[2], 520, ly[2]], 9, 10, 'green');
  k.go([520, ly[3], 720, ty[3]], 10.9, 12, 'yellow', 'loan.created');
  if (i === 3 && T > 12) k.pill(280, 490, t('不等通知和统计，直接返回', 'replies without waiting for notify or stats'), 'green', 16);
});
sc('users', 12, [0, 4, 8], k => {
  const T = k.t, i = k.i, bad = i === 1, t0 = i * 4, f = a => T > t0 + a;
  k.ln([250, 250, 380, 250]);
  k.box(50, 200, 200, 100, t('借阅服务', 'Borrow service'), i < 2 ? t('这位同学能借吗？', 'may this student borrow?') : '', 'orange');
  k.rect(380, 95, 580, 395, 'blue', { fill: WHITE }); k.mono(402, 124, i < 2 ? 'canBorrow(' + (bad ? '2023010456' : '2023010123') + ')' : 'login()   getUser()   canBorrow()', 17, 'blue', 'left', 700);
  if (i < 2) {
    [[t('欠费', 'Unpaid fines'), bad ? t('12 元', '¥12') : t('0 元', '¥0'), !bad, 1.8], [t('已借 / 上限', 'On loan / limit'), bad ? '—' : '8 / 10', !bad, 2.5]].forEach(([s, v, ok, a], j) => {
      const on = f(a) && !(bad && j); k.rect(404, 150 + j * 92, 532, 76, on ? (ok ? 'green' : 'red') : 'line', { fill: on ? undefined : WHITE, lw: 1.5 });
      k.txt(426, 188 + j * 92, s, 18, 'ink', 'left'); if (on) { k.mono(800, 188 + j * 92, v, 19, ok ? 'green' : 'red', 'right', 700); ok ? k.yes(880, 188 + j * 92, 11) : k.no(880, 188 + j * 92, 10); }
    });
    if (f(bad ? 2.2 : 3)) k.pill(670, 372, bad ? t('false：先缴清欠费，不会去扣库存', 'false: clear the fines first; stock is never touched') : t('true：可以借', 'true: go ahead'), bad ? 'orange' : 'green', 17);
    k.go([250, 250, 380, 250], t0 + .4, t0 + 1.4, 'blue'); k.go([380, 250, 250, 250], t0 + (bad ? 2.4 : 3.1), t0 + (bad ? 3.2 : 3.9), bad ? 'orange' : 'green', bad ? 'false' : 'true');
  } else {
    [[t('登录', 'Login'), t('核对学号和密码，签发会话', 'checks id and password, issues the session')], [t('身份', 'Identity'), t('学号 → 姓名、学院', 'student id → name, school')], [t('借阅资格', 'Eligibility'), t('欠费、已借数量、是否停借', 'fines, loans, suspensions')]].forEach(([s, d], j) => {
      const on = Math.floor((T - 8) / 1.3) % 3 === j; k.rect(404, 150 + j * 92, 532, 76, on ? 'blue' : 'line', { fill: on ? undefined : WHITE, lw: 1.5 });
      k.txt(426, 188 + j * 92, s, 18, 'ink', 'left', 700); k.txt(560, 188 + j * 92, d, 15, 'soft', 'left', 500, 360);
    });
    k.txt(670, 452, t('别的服务不自己判断，都来问它', 'other services never decide themselves; they ask here'), 15, 'soft');
  }
});
sc('seat', 12, [0, 4, 8], k => {
  const T = k.t, i = k.i, held = (i === 0 && T > 1.8) || (i === 1 && T < 6), oom = i === 2 && T > 9.2;
  for (let j = 0; j < 24; j++) {
    const c = j % 6, r = (j / 6) | 0, x = 80 + c * 78, y = 105 + r * 76, mine = j === 15, taken = [1, 4, 7, 8, 12, 18, 20, 23].includes(j);
    k.rect(x, y, 62, 58, mine && held ? 'orange' : taken ? 'teal' : 'line', { r: 9, fill: mine && held ? k.col('orange') : taken ? k.col('teal', 1) : WHITE, lw: 1.5, a: oom ? .4 : 1 });
    if (mine) k.mono(x + 31, y + 30, '3F-118', 12, held ? '#fff' : 'ink', 'center', 700);
  }
  k.txt(80, 432, t('三楼自习区', '3F study area'), 15, 'soft', 'left'); k.dot(260, 432, 7, 'teal', .5); k.txt(274, 433, t('有人', 'taken'), 14, 'soft', 'left'); k.dot(340, 432, 7, 'orange'); k.txt(354, 433, t('我的预约', 'my booking'), 14, 'soft', 'left');
  k.rect(600, 100, 350, 300, oom ? 'red' : 'purple', { fill: WHITE }); k.txt(620, 128, t('座位服务', 'Seat service'), 17, oom ? 'red' : 'purple', 'left', 700);
  k.mono(625, 170, 'reserve("3F-118")', 17, i === 0 ? 'ink' : 'muted', 'left', i === 0 ? 700 : 500); k.mono(625, 205, 'release("3F-118")', 17, i === 1 ? 'ink' : 'muted', 'left', i === 1 ? 700 : 500);
  k.cyl(700, 250, 150, 120, 'seat_db', '', 'indigo', { size: 16, hot: k.on(1.8, 2.3) || k.on(6, 6.5), dim: oom });
  if (oom) k.mono(775, 232, 'OutOfMemoryError', 16, 'red', 'center', 700);
  k.ln([542, 255, 600, 255]); k.go([542, 255, 600, 255], .5, 1.8, 'blue'); k.go([542, 255, 600, 255], 4.8, 6, 'blue');
  if (i === 2) { k.txt(775, 432, t('自己的进程 · 自己的库', 'its own process · its own database'), 15, 'soft'); if (T > 9.6) k.pill(380, 468, t('只有订座受影响，借书照常', 'only seat booking is affected; borrowing carries on'), 'green', 16); }
});
sc('search', 12, [0, 4, 8], k => {
  const T = k.t, i = k.i, q = t('算法', 'algorithms'), sug = [t('算法导论', 'Introduction to Algorithms'), t('算法（第 4 版）', 'Algorithms, 4th edition'), t('算法图解', 'Grokking Algorithms')];
  k.rect(50, 100, 420, 50, 'blue', { fill: '#fff', r: 25, lw: 1.5 }); k.ic('search', 80, 125, 22, 'soft'); k.txt(106, 126, i ? q : q.slice(0, Math.ceil(q.length * k.p(.3, 1.3))), 19, 'ink', 'left');
  if (!i && T > 1.5) { k.rect(60, 160, 400, 126, 'line', { fill: WHITE, lw: 1.5 }); sug.forEach((s, j) => k.al(k.e(1.5 + j * .3, 1.9 + j * .3), () => k.txt(84, 184 + j * 38, s, 16, 'ink', 'left', 500, 360))); k.mono(265, 312, 'suggest()', 15, 'blue'); }
  k.al(i ? 1 : .3, () => {
    k.ln([470, 125, 560, 180]);
    k.rect(560, 95, 390, 220, 'pink', { fill: WHITE }); k.txt(580, 122, t('倒排索引', 'Inverted index'), 17, 'pink', 'left', 700);
    [[q, '17, 42, 108, 233 …'], [t('网络', 'network'), '9, 77, 150 …'], [t('系统', 'systems'), '3, 42, 61 …']].forEach(([w, ids], j) => {
      if (!j && i === 1 && T > 5.4) k.rect(574, 144, 362, 44, 'pink', { r: 8, lw: 0 });
      k.txt(592, 166 + j * 50, w, 17, 'ink', 'left', 700); k.mono(700, 167 + j * 50, '→ ' + ids, 15, 'soft', 'left');
    });
    if (i === 1 && T > 6.6) { k.pill(265, 200, 'hits = 12', 'green', 17); k.txt(265, 240, t('没有去扫数据库', 'the database was not scanned'), 14, 'soft'); }
    k.go([470, 125, 560, 166], 4.3, 5.4, 'blue', 'search()'); k.go([560, 166, 470, 125], 5.6, 6.6, 'green');
  });
  k.al(i === 2 ? 1 : .25, () => {
    k.ln([260, 420, 370, 420], 'yellow'); k.ln([600, 420, 755, 315], 'yellow');
    k.box(50, 380, 210, 80, t('馆藏：新书入库', 'Catalog: new title'), '', 'teal', { size: 17 }); k.box(370, 380, 230, 80, t('异步更新索引', 'Index updated async'), '', 'yellow', { size: 17 });
    k.go([260, 420, 370, 420], 8.4, 9.4, 'yellow'); k.go([600, 420, 755, 315], 9.6, 10.8, 'yellow');
    if (i === 2 && T > 10.8) k.txt(790, 400, t('晚几秒没关系', 'a few seconds late is fine'), 15, 'soft');
  });
});
sc('notice', 12, [0, 4, 8], k => {
  const T = k.t, i = k.i, P = [550, 225, 760, 225];
  k.ln([200, 225, 330, 225], 'yellow'); k.ln(P);
  k.rect(50, 150, 150, 150, 'yellow'); k.txt(125, 176, t('队列', 'Queue'), 16, 'yellow', 'center', 700); k.pill(125, 240, 'BORROWED', 'yellow', 13);
  k.box(330, 170, 220, 110, t('通知服务', 'Notification service'), ['push()', 'remind()', 'push()'][i], 'teal', { mono: 1, hot: k.on(1.6, 2) || k.on(5.2, 5.6) });
  k.rect(760, 95, 190, 395, 'ink', { fill: WHITE, lw: 3, r: 24 });
  const bubble = (y, s, tone) => { k.rect(774, y, 162, 62, tone, { r: 12 }); k.para(786, y + 21, s, 142, 13.5, 'ink', 1.5); };
  if (i || T > 2.8) bubble(125, t('借书成功，应还 10 月 1 日', 'Borrowed. Due Oct 1'), 'green');
  if (i > 1 || (i === 1 && T > 6.6)) bubble(200, t('《CSAPP》还有 3 天到期', 'CSAPP is due in 3 days'), 'orange');
  if (i === 2 && T > 11) bubble(275, t('座位 3F-118 预约成功', 'Seat 3F-118 booked'), 'green');
  k.go([200, 225, 330, 225], .4, 1.6, 'yellow'); k.go(P, 1.8, 2.8, 'green');
  if (i === 1) { k.ic('clock', 400, 345, 28, 'soft'); k.txt(425, 346, t('到期前 3 天', '3 days before the due date'), 16, 'ink', 'left'); }
  k.go(P, 5.6, 6.6, 'orange');
  if (i === 2) {
    const p = k.p(8.3, 9.2); if (p > 0 && T < 9.8) { const [x, y] = k.pkt(P, Math.min(p, .6), p > .6 ? 'red' : 'green'); if (p > .6) k.no(x + 26, y, 9); }
    if (T > 9) k.mono(440, 345, 'wechat_push_error  1', 16, 'red', 'center', 700); k.go(P, 10, 11, 'green', t('重试', 'retry'));
    if (T > 11) k.txt(440, 385, t('重试成功——所以消息要能去重', 'the retry lands, which is why messages must be deduplicated'), 14, 'soft', 'center', 500, 380);
  }
});
