'use strict';
// 画布上的全部内容：方框（位置、说明、最简代码、厂商）和连线。中英文成对写在一起：t('中文', 'English')。
// 坐标：每个方框内部都是一块宽 1000 的板面，子方框的 x/y/w/h 以父板面为单位。
const LANG = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
const t = (zh, en) => LANG === 'en' ? en : zh;

const UI = {
  brand: t('借阅架构图解', 'Library Architecture, Zoomable'), home: t('全景', 'Overview'), toc: t('目录', 'Contents'),
  tocNote: t('按原片 11 章的顺序。点一项，画布会飞到它所在的位置。', 'In the order of the original video\'s 11 chapters. Pick one and the canvas flies there.'),
  pause: t('暂停动画', 'Pause'), play: t('继续动画', 'Resume'), source: t('抖音原片 ↗', 'Original video ↗'),
  other: t('English', '中文'), otherHref: t('en.html', 'index.html'),
  hint: t('滚轮缩放 · 拖拽平移 · 点方框：飞进去，并看解释、最简代码和厂商', 'Scroll to zoom · drag to pan · click a box to fly in and see what it is, minimal code, and who offers it'),
  ask: t('从一个问题开始 · 原片 49:12', 'Start from a question · video 49:12'), old: t('对照原片复习（旧版，可边看原片边对照）→', 'Review alongside the original video (previous version, in Chinese) →'),
  filmTip: t('到旧版的这一节，点“原片对照”从这个时间看原片', 'Open this part in the previous version (Chinese) and use its video button to watch from here'),
  fw: t('通信框架', 'comm framework'), fwLong: t('通信框架：挑实例 · 连接池 · 超时重试 · 熔断 · 降级 · 隔离　▸ 点这里看展开', 'Communication framework: instance picking · pooling · timeouts & retries · breaker · fallback · bulkhead  ▸ click to open'),
  fwGo: t('看它内部的通信框架（在借阅服务里展开）→', 'See its communication framework (opened inside the borrow service) →'),
  hintTouch: t('双指缩放 · 拖动平移 · 点方框：飞进去，并看解释、最简代码和厂商', 'Pinch to zoom · drag to pan · tap a box to fly in and see what it is, minimal code, and who offers it'),
  aria: t('可缩放的系统画布。也可以用“目录”逐项浏览。', 'Zoomable system canvas. The Contents list offers the same items.'),
  steps: t('动画在演什么（点一步可跳过去）', 'What the animation shows (click a step to jump)'), inside: t('里面有什么', 'Inside'),
  note: t('补充　', 'Note  '), code: t('最简实现', 'Minimal code'), who: t('谁在提供', 'Who offers this'), film: t('原片', 'video'),
  close: t('关闭', 'Close'), prev: t('上一个', 'Prev'), next: t('下一个', 'Next'),
  zin: t('放大', 'Zoom in'), zout: t('缩小', 'Zoom out'), zhome: t('回到全景', 'Back to overview'),
};
const CH = [
  t('课设起点', 'The class project'), t('版本控制', 'Version control'), t('部署和扩容', 'Deploy & scale'), t('数据库和缓存', 'Database & cache'),
  t('代码上线', 'Shipping code'), t('微服务', 'Microservices'), t('容器编排', 'Orchestration'), t('容错', 'Fault tolerance'),
  t('网关', 'API gateway'), t('消息队列', 'Message queue'), t('可观测性', 'Observability'), t('服务网格', 'Service mesh'),
];
const ALI = t('阿里云', 'Alibaba Cloud'), TX = t('腾讯云', 'Tencent Cloud');
const OSS = t('开源 / 自建', 'Open source / self-hosted'), CLOUD = t('云服务 / 公司', 'Managed services / vendors');
const V = (oss, cloud) => [oss && [OSS, oss.split(', ')], cloud && [CLOUD, cloud.split(', ')]].filter(Boolean);

const WORLD = [], EDGES = [];
const N = (id, parent, x, y, w, h, o) => WORLD.push({ id, parent, x, y, w, h, ...o });
const E = (a, b, o) => EDGES.push({ a, b, ...o });

// ================= 第 0 层：八个区域 =================
N('dev', null, 340, 40, 320, 90, { icon: 'branch', tone: 'purple', title: t('开发与发布', 'Build & release'), sub: t('从提交到灰度', 'From commit to canary'),
  desc: t('另一条线：它讲的不是“一次借书怎样完成”，而是“团队怎样安全地改动处理借书的代码”。提交、评审、CI、镜像、预发布，最后灰度上线。进了大厂，改完代码不再是本地点一下运行就算完：要走分支、评审和 CI，发到预发布环境和上下游联调，再顺着指标、日志和链路去定位线上问题。', 'The second storyline. Not “how one borrow request completes” but “how a team safely changes the code that handles it”: commit, review, CI, image, staging, then a canary release. In a large company a change is never done by running it locally: it goes through a branch, review and CI, is deployed to staging to integrate with upstream and downstream, and then you follow metrics, logs and traces to pin down problems in production.') });
N('client', null, 40, 255, 150, 120, { icon: 'phone', tone: 'blue', ch: 8, title: t('客户端', 'Clients'), sub: t('浏览器 · App · 小程序', 'Web · app · mini program'),
  desc: t('学生在这里查书、点“借书”、收到结果。不管用哪种客户端，请求都走同一个入口。', 'Where a student searches, taps “Borrow” and sees the result. Whatever the client, every request goes through the same entry.'),
  lang: 'JavaScript', code: `const res = await fetch("https://lib.example.edu.cn/api/borrow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ isbn: "9787111544937" }),
});
console.log(res.status);   // 200`,
  vendors: [[t('前端框架', 'Frameworks'), ['React', 'Vue', 'Flutter', 'React Native', 'uni-app']], [t('平台', 'Platforms'), [t('微信小程序', 'WeChat Mini Programs'), 'iOS', 'Android', 'Chrome / Safari / Edge']]] });
N('entry', null, 235, 215, 150, 200, { icon: 'gate', tone: 'teal', title: t('入口', 'Entry'), sub: t('DNS · 负载均衡 · 网关', 'DNS · load balancer · gateway'),
  desc: t('外部请求进入系统的必经之路：域名解析找到地址，负载均衡把请求分给健康的实例，网关做认证、限流并按路径路由。', 'The only way in. DNS finds the address, the load balancer spreads requests over healthy instances, and the gateway authenticates, rate-limits and routes by path.') });
N('micro', null, 440, 195, 270, 240, { icon: 'cube', tone: 'orange', title: t('微服务', 'Microservices'), sub: t('跑在 Kubernetes 上的六个服务', 'Six services on Kubernetes'),
  desc: t('平台从一所学校长到三百多所、团队从 3 个人长到几十人以后，一个 412 MB 的 JAR 装不下了：按业务边界拆成借阅、用户、馆藏、座位、通知、搜索六个服务，各有各的代码仓库和数据库，各自发布、各自扩容、各自出故障。它们打包成容器，由 Kubernetes 调度。', 'Once the platform grows from one campus to over three hundred and the team from 3 people to dozens, one 412 MB JAR is no longer enough. It is split along business lines into borrow, users, catalog, seat, notification and search: each has its own repository and database, and ships, scales and fails on its own. They run as containers scheduled by Kubernetes.') });
N('data', null, 770, 215, 190, 200, { icon: 'db', tone: 'indigo', ch: 3, title: t('数据', 'Data'), sub: 'MySQL · Redis',
  desc: t('计算实例可以一台台加，数据却只有一份：所有请求最后都汇到这里。关系库保证借还书正确，缓存挡掉大部分重复的读。', 'You can add compute instances one by one, but there is only one copy of the truth, and every request ends up here. The relational database keeps borrowing correct; the cache absorbs most repeated reads.') });
N('origin', null, 40, 465, 190, 120, { icon: 'laptop', tone: 'orange', ch: 0, at: '00:00', title: t('课设起点', 'Where it starts'), sub: t('三个人 · 一台笔记本', 'Three students, one laptop'),
  desc: t('一切从这里开始：浏览器、一个后端进程和一台 MySQL，就能完成查书、借书、还书。画布上其余的每个方框，都是它遇到新麻烦以后长出来的。', 'Everything starts here: a browser, one backend process and one MySQL are enough to search, borrow and return. Every other box on this canvas grew out of a problem this setup ran into.') });
N('mq', null, 430, 470, 210, 110, { icon: 'queue', tone: 'yellow', ch: 9, at: '39:43', title: t('消息队列', 'Message queue'), sub: t('借书之后的事，慢慢做', 'What happens after a borrow can wait'),
  desc: t('借书成功后还要发通知、记统计、更新推荐。把“借阅成功”写成一条事件放进队列就可以先回复学生，后面的服务按各自的节奏取走处理。它的底层模型，就是操作系统课上学过的“生产者—消费者”。它的三个价值：可靠的异步、削峰填谷、彻底解耦。Kafka、RocketMQ 这类队列会把消息落盘，并在多台机器之间同步副本。', 'After a successful borrow there are still notifications, statistics and recommendations to update. Write a “loan created” event to the queue, answer the student right away, and let downstream services consume at their own pace. Underneath it is the producer-consumer model from an operating-systems course. Its three values: reliable async, peak shaving, and full decoupling. Queues such as Kafka and RocketMQ persist messages to disk and replicate them across machines.'),
  lang: 'Python · Kafka', code: `# ${t('生产者：借阅服务', 'producer: borrow service')}
producer.send("loan.created", {"loan_id": 42, "user": 2023010123})

# ${t('消费者：通知服务（自己的 group = 自己的读取位置）', 'consumer: notification service (own group = own offset)')}
for msg in KafkaConsumer("loan.created", group_id="notice"):
    send_reminder(msg.value)`,
  vendors: V('Apache Kafka, RabbitMQ, Apache RocketMQ, Apache Pulsar, NATS, Redis Streams', `Confluent Cloud, Amazon SQS / SNS / Kinesis, Google Pub/Sub, Azure Service Bus, ${ALI} RocketMQ, ${TX} CKafka`) });
N('obs', null, 770, 465, 190, 120, { icon: 'chart', tone: 'green', ch: 10, at: '44:05', title: t('可观测性', 'Observability'), sub: t('指标 · 日志 · 链路', 'Metrics · logs · traces'),
  desc: t('学生说“偶尔借书失败”，你不可能一台台机器去翻。指标告诉你出事了，链路告诉你慢在哪一跳，日志告诉你那一刻发生了什么。把系统内部的运行状态从外部“透视”出来的能力叫可观测性，靠三根支柱：聚合度量（指标）、事件日志、链路追踪。', 'A student says “borrowing sometimes fails”, and you cannot search machine by machine. Metrics tell you something is wrong, traces tell you which hop is slow, logs tell you what happened at that moment. The ability to see a system\'s internal state from outside is called observability, and it rests on three pillars: metrics, logs and traces.'),
  vendors: V('Prometheus, Grafana, OpenTelemetry, Jaeger, Elasticsearch, Grafana Loki', `Datadog, New Relic, Splunk, Dynatrace, Grafana Cloud, Amazon CloudWatch, ${ALI} ARMS`) });

// ================= 课设起点 =================
N('s00', 'origin', 40, 100, 440, 275, { icon: 'laptop', no: '0', at: '00:00', title: t('三个人的课设', 'A three-person class project'),
  desc: t('一句提示词、十分钟，就能生成一个能跑的图书网站：浏览器发请求，后端处理，MySQL 存数据。按课设的要求，这就够了。', 'One prompt and ten minutes produce a working library site: the browser sends a request, the backend handles it, MySQL stores the data. For a class project, that is all you need.'),
  steps: [t('一句提示词，十分钟后网站就能跑了——但这可能连一成的工作都算不上', 'One prompt; ten minutes later the site runs, yet that may not be a tenth of the work'), t('学生点“借书”，浏览器把请求发给后端', 'A student taps Borrow; the browser sends the request to the backend'), t('后端在 MySQL 里扣库存、写下借阅记录', 'The backend deducts stock and writes the loan in MySQL'), t('结果原路返回——三个人的课设到此就够用了', 'The result comes back the same way. For a class project this is enough')],
  lang: 'Python · Flask', code: `@app.post("/borrow")
def borrow():
    isbn = request.json["isbn"]
    n = db.execute(
        "UPDATE book SET stock = stock - 1 "
        "WHERE isbn = ? AND stock > 0", [isbn]).rowcount
    return ("ok", 200) if n else ("sold out", 409)`,
  vendors: V('Spring Boot, Django, Flask, Express, Ruby on Rails, Laravel', '') });
N('s21', 'origin', 520, 100, 440, 275, { icon: 'server', ch: 2, no: '2.1', at: '05:57', title: t('从笔记本到服务器', 'From laptop to server'),
  desc: t('服务跑在同学的笔记本上：合上盖子，全校就用不了。而且 localhost 在别人机器上指的是别人自己。把程序部署到一台一直开着、有固定地址的服务器上。', 'The service runs on a classmate\'s laptop: close the lid and the whole campus loses it. And on anyone else\'s machine, localhost means their own machine. Deploy to a server that is always on and has a stable address.'),
  steps: [t('服务跑在同学的笔记本上，全校都连着它', 'The service runs on a classmate\'s laptop; the whole campus connects to it'), t('合上笔记本：所有请求都失败。localhost 只指向自己', 'Lid closed: every request fails. localhost only ever points at yourself'), t('租一台云服务器（一直开机、有公网 IP），把程序部署上去', 'Rent a cloud server (always on, with a public IP) and deploy the program to it'), t('全校通过固定的域名访问它', 'The campus reaches it through a stable domain name')],
  note: t('localhost 是本机回环地址。部署到校园网里的服务器以后校内可达；校外访问还需要另外的网络入口。', 'localhost is the loopback address of your own machine. A server on the campus network is reachable on campus; access from outside needs a separate network entry.'),
  lang: 'Shell', code: `scp target/library.jar deploy@lib.example.edu.cn:/opt/library/
ssh deploy@lib.example.edu.cn "sudo systemctl restart library"
curl -I http://lib.example.edu.cn/     # ${t('不再是 localhost', 'no longer localhost')}`,
  vendors: V('', `AWS EC2, Google Compute Engine, Azure Virtual Machines, ${ALI} ECS, ${TX} CVM, DigitalOcean, Hetzner`) });
N('s22', 'origin', 300, 395, 360, 225, { icon: 'scale', ch: 2, no: '2.2', at: '07:15', title: t('垂直与水平扩展', 'Scale up vs scale out'),
  desc: t('开学季 CPU 打满。垂直扩展是换一台更大的机器：简单，但有上限，而且仍然是单点。水平扩展是多加几台一样的实例：没有上限，但前面需要一个入口来分配请求。', 'At the start of term the CPU is saturated. Scaling up means a bigger machine: simple, but capped and still a single point of failure. Scaling out means more identical instances: no cap, but something in front has to distribute requests.'),
  steps: [t('开学季：一台服务器的 CPU 打到 100%，请求开始排队', 'Start of term: one server hits 100% CPU and requests queue up'), t('垂直扩展：换更大的机器。有上限，还是单点', 'Scale up: a bigger machine. There is a ceiling, and it is still one machine'), t('水平扩展：再加几台一模一样的实例', 'Scale out: add more identical instances'), t('于是前面需要一个入口，把请求分给它们', 'Which means something in front must spread requests across them')],
  note: t('一个“实例”是一个运行中的程序副本，不等于一台机器：一台机器上也可以跑多个实例。', 'An “instance” is one running copy of the program, not a machine: one machine can run several instances.'),
  lang: 'text', code: `# ${t('垂直', 'scale up')}     4 vCPU / 8 GB   →   32 vCPU / 64 GB    (${t('还是一台', 'still one machine')})
# ${t('水平', 'scale out')}    1 × app         →   3 × app + load balancer` });

// ================= 客户端 =================

N('sclient', 'client', 50, 170, 900, 562, { icon: 'phone', ch: 0, at: '00:46', title: t('一次借书的四步', 'One borrow in four steps'),
  steps: [t('搜索，找到想借的书', 'Search and find the book'), t('登录：学号和密码', 'Log in with student id and password'), t('点“借阅”：请求发往统一的入口 lib.example.edu.cn', 'Tap Borrow: the request goes to the single entry, lib.example.edu.cn'), t('收到结果：借阅成功，10 月 1 日前归还', 'The result arrives: borrowed, due back by Oct 1')],
  desc: t('贯穿全片的是同一个动作：学生找到书、登录、点“借阅”、收到结果。网页、App、小程序三种客户端做的是同一件事，走的也是同一个入口。从三人课设到多校平台，变的只是这四步背后的东西。', 'One action runs through the whole video: a student finds a book, logs in, taps Borrow and gets the result. Web, app and mini program all do this same thing through the same entry. From class project to multi-campus platform, what changes is only what stands behind these four steps.') });

// ================= 入口 =================
N('dns', 'entry', 220, 80, 560, 350, { icon: 'dns', ch: 2, at: '07:50', title: t('DNS 域名解析', 'DNS'),
  steps: [t('浏览器只知道名字 lib.example.edu.cn，不知道该连哪台机器', 'The browser knows only the name lib.example.edu.cn, not which machine to connect to'), t('它去问 DNS，得到入口的公网地址 203.0.113.25', 'It asks DNS and gets the public address of the entry, 203.0.113.25'), t('拿着地址连到入口 Nginx，再由它转给后面的实例', 'With the address it connects to the Nginx entry, which forwards to an instance behind it'), t('后面的实例换了、加了，学生记住的名字和入口地址都不变', 'Instances behind come and go; the name students remember and the entry address stay the same')],
  desc: t('把 lib.example.edu.cn 这样的名字翻译成 IP 地址。后面的机器可以增减、更换，学生记住的名字不变。', 'Translates a name like lib.example.edu.cn into an IP address. Machines behind it can come and go; the name students remember stays the same.'),
  lang: 'Shell', code: `$ dig +short lib.example.edu.cn
203.0.113.10`,
  vendors: V('BIND, CoreDNS, PowerDNS, Unbound', `Cloudflare DNS, Amazon Route 53, Google Cloud DNS, DNSPod, ${ALI} DNS`) });
N('lb', 'entry', 100, 450, 800, 360, { icon: 'split', ch: 2, at: '08:00', title: t('负载均衡', 'Load balancer'), sub: t('Nginx · 反向代理', 'Nginx · reverse proxy'),
  desc: t('站在一组实例前面，把请求分给健康的那几台。实例可以随时增减，外面看到的始终是一个地址。入口自己也要有冗余。', 'Sits in front of a group of instances and hands each request to a healthy one. Instances can be added or removed at any time while the outside world sees a single address. The entry itself needs redundancy too.'),
  lang: 'Nginx', code: `upstream library {
    least_conn;
    server 10.0.0.11:8080 weight=2;
    server 10.0.0.12:8080;
    server 10.0.0.13:8080 max_fails=3 fail_timeout=10s;
}
server {
    listen 80;
    location / { proxy_pass http://library; }
}`,
  vendors: V('Nginx, HAProxy, Envoy, Traefik, LVS, Caddy', `AWS Elastic Load Balancing, Google Cloud Load Balancing, Azure Load Balancer, Cloudflare, F5, ${ALI} SLB`) });
N('sproxy', 'lb', 30, 150, 300, 187, { icon: 'swap', at: '08:10', title: t('正向与反向代理', 'Forward vs reverse proxy'),
  desc: t('两者都是“中间人”，区别在替谁出面。正向代理替客户端出面，服务器不知道真正的客户端是谁；反向代理替服务器出面，客户端不知道背后到底是哪台实例。Nginx 在这里做的是反向代理。', 'Both are middlemen; the difference is who they stand in for. A forward proxy fronts for the client, so the server never learns who the real client is. A reverse proxy fronts for the servers, so the client never learns which instance answered. Nginx here is a reverse proxy.'),
  steps: [t('正向代理：替客户端出面，服务器看不到真正的客户端', 'Forward proxy: speaks for the client; the server never sees the real client'), t('反向代理：替服务器出面，客户端不知道背后是哪台实例', 'Reverse proxy: speaks for the servers; the client never knows which instance answered')],
  lang: 'Nginx', code: `# ${t('反向代理：客户端只认识域名，不认识 10.0.0.x', 'reverse proxy: clients know the domain, never 10.0.0.x')}
server {
    listen 443 ssl;
    server_name lib.example.edu.cn;
    location / { proxy_pass http://10.0.0.11:8080; }
}`,
  vendors: [[t('反向代理', 'Reverse proxies'), ['Nginx', 'HAProxy', 'Caddy', 'Envoy', 'Cloudflare']], [t('正向代理', 'Forward proxies'), ['Squid', 'Privoxy', 'mitmproxy']]] });
N('s23', 'lb', 350, 150, 300, 187, { icon: 'split', no: '2.3', at: '08:22', title: t('请求分给谁', 'Who gets the request'),
  desc: t('最常见的几种分法：轮流来（轮询）、能者多劳（加权）、谁闲给谁（最少连接）。不管哪种，都要靠健康检查把坏掉的实例摘出去。', 'The common strategies: take turns (round robin), stronger machines get more (weighted), whoever is least busy (least connections). Whichever you choose, health checks must take broken instances out of rotation.'),
  steps: [t('轮询：A、B、C 轮流接', 'Round robin: A, B, C take turns'), t('加权：A 的配置高，多接一份', 'Weighted: A is a bigger machine, so it takes a double share'), t('最少连接：交给当前最闲的那台', 'Least connections: send it to whoever is least busy right now'), t('B 挂了：健康检查把它摘掉，请求只发给 A 和 C', 'B dies: health checks remove it and requests go only to A and C')],
  lang: 'Python', code: `servers = ["10.0.0.11", "10.0.0.12", "10.0.0.13"]
i = 0

def round_robin():
    global i
    i = (i + 1) % len(servers)
    return servers[i]

def least_conn(active):          # active = {server: open connections}
    return min(servers, key=lambda s: active[s])` });
N('s24', 'lb', 670, 150, 300, 187, { icon: 'warn', no: '2.4', at: '09:28', title: t('502 与 504', '502 vs 504'),
  desc: t('两个都是入口替后面的实例报的错。502：上游没有给出有效的响应（进程退出、拒绝连接）。504：上游在规定时间内没有答复（太慢）。看到哪个，就知道该往哪个方向查。', 'Both are errors the entry reports on behalf of what is behind it. 502: the upstream gave no valid response (process gone, connection refused). 504: the upstream did not answer in time (too slow). Which one you see tells you where to look.'),
  steps: [t('502 Bad Gateway：上游没有给出有效响应——比如进程已经退出', '502 Bad Gateway: the upstream gave no valid response, e.g. the process has exited'), t('504 Gateway Timeout：上游还活着，但在时限内没有答复', '504 Gateway Timeout: the upstream is alive but did not answer within the time limit')],
  lang: 'Nginx', code: `location /api/ {
    proxy_pass http://library;
    proxy_connect_timeout 2s;    # ${t('连不上 / 无效响应 → 502', 'cannot connect / bad reply → 502')}
    proxy_read_timeout   60s;    # ${t('到时间没答复 → 504', 'no reply in time → 504')}
}` });
N('gw', 'entry', 100, 900, 800, 360, { icon: 'gate', ch: 8, at: '36:42', title: t('API 网关', 'API gateway'),
  desc: t('“网关”本来指站在内部网络边界、负责和外界打交道的出入口，就像家里的路由器。网页、App、小程序不用、也不该直接对接几十个内部服务，统一先到 API 网关。它最基础的职责是路由：按路径把请求转给对应的服务。另一块是过滤：统一处理 HTTPS 证书的加解密、核验登录、限流，必要时把外部的 HTTP + JSON 转成内部的 RPC。重的业务逻辑不要塞进网关；它自己也要多实例，前面再由负载均衡分流。', '“Gateway” originally means the doorway at the edge of an internal network that deals with the outside, like a home router. Web, app and mini program neither need to nor should talk to dozens of internal services directly; they all go to the API gateway first. Its basic job is routing: sending each request to the right service by its path. The other is filtering: terminating HTTPS in one place, verifying login, rate limiting, and where needed translating external HTTP + JSON into internal RPC. Heavy business logic does not belong in the gateway; it runs as several instances itself, behind a load balancer.'),
  lang: 'YAML · Spring Cloud Gateway', code: `spring.cloud.gateway.routes:
  - id: borrow
    uri: lb://borrow-service
    predicates: [ "Path=/api/borrow/**" ]
    filters:
      - name: RequestRateLimiter
        args: { redis-rate-limiter.replenishRate: 100 }
  - id: seat
    uri: lb://seat-service
    predicates: [ "Path=/api/seat/**" ]`,
  vendors: V('Kong, Apache APISIX, Spring Cloud Gateway, Envoy Gateway, Traefik, Tyk, KrakenD', `Amazon API Gateway, Google Apigee, Azure API Management, Cloudflare API Gateway, ${ALI} API Gateway`) });
N('s81', 'gw', 40, 120, 440, 275, { icon: 'gate', no: '8.1', at: '36:54', title: t('路由与均衡', 'Routing & balancing'),
  desc: t('两件不同的事：路由是按请求内容（路径）决定去哪个业务；负载均衡是进了这个业务以后，在它的多个实例里挑一台。', 'Two different jobs. Routing picks which business service a request belongs to, based on its content (the path). Load balancing then picks one instance of that service.'),
  steps: [t('三种客户端 × 六个服务，各连各的：线越来越密', 'Three clients × six services, each wired to each: the lines get dense fast'), t('收束：所有请求先到统一的 API 网关', 'Converge: every request goes to one API gateway first'), t('路由：/api/borrow 去借阅服务，/api/seat 去座位服务', 'Routing: /api/borrow goes to the borrow service, /api/seat to the seat service'), t('均衡：进了借阅服务，再在它的实例里挑一台', 'Balancing: inside the borrow service, pick one of its instances')],
  lang: 'Python', code: `ROUTES = {"/api/borrow": "borrow-service",
          "/api/seat":   "seat-service",
          "/api/search": "search-service"}

def route(path):
    for prefix, service in ROUTES.items():
        if path.startswith(prefix):
            return pick_instance(service)    # ${t('再做负载均衡', 'then load-balance')}
    return 404` });
N('s82', 'gw', 520, 120, 440, 275, { icon: 'shield', no: '8.2', at: '38:57', title: t('网关过滤', 'Gateway filters'),
  desc: t('请求在网关里依次过几道关：认证确认你是谁，并把身份写进请求头传给后面的服务；限流保护后面不被冲垮。没过关的请求在入口就被挡回去，后面的服务根本看不到它。', 'A request passes several gates in order: authentication establishes who you are and writes the identity into a header for downstream services; rate limiting keeps the backend from being flooded. Requests that fail are turned away at the door and the services behind never see them.'),
  steps: [t('合法请求：认证 → 限流 → 路由，身份随请求头往后传', 'A valid request: authenticate → rate-limit → route; identity travels on in a header'), t('会话过期：在认证这一关被拦下，返回 401', 'Expired session: stopped at authentication, 401 returned'), t('抢座脚本疯狂刷请求，超过每人每秒 10 次的限额：在限流这一关被拦下，返回 429', 'A seat-grabbing script floods requests past the per-user quota of 10 a second: stopped at the rate limiter, 429 returned')],
  note: t('入口认证过了，借阅服务仍然要自己检查“这位读者能不能做这件事”，比如额度和欠费。网关自己也要部署多个实例，前面再由负载均衡分流。', 'Passing authentication at the door is not enough: the borrow service still checks whether this reader may do this, e.g. quota and fines. The gateway itself runs as several instances behind a load balancer.'),
  lang: t('Python · 令牌桶', 'Python · token bucket'), code: `def allow(user, rate=5, burst=10):
    b = buckets[user]
    b.tokens = min(burst, b.tokens + (now() - b.last) * rate)
    b.last = now()
    if b.tokens < 1:
        return False            # → 429 Too Many Requests
    b.tokens -= 1
    return True`,
  vendors: V('Kong plugins, APISIX plugins, Envoy filters, Keycloak, Sentinel', 'Auth0, Okta, Cloudflare Rate Limiting, AWS WAF') });

// ================= 微服务 =================
N('k8s', 'micro', 30, 90, 220, 150, { icon: 'grid', tone: 'teal', ch: 6, at: '29:09', title: t('容器编排', 'Orchestration'), sub: t('Kubernetes 控制平面', 'Kubernetes control plane'),
  desc: t('几十个服务各跑几十份，就是分布在几百台机器上的几千个容器，没法靠人管。Kubernetes 的核心思想是声明式管理：不用一条条命令教它先干嘛后干嘛，你只声明“想要什么”（比如借阅服务 50 个副本、每份 4G 内存），控制平面不停地对比期望与实际，负责调度、补齐、扩容和滚动换版。半夜有容器崩了，不需要人起来重启。', 'Dozens of services with dozens of copies each means thousands of containers across hundreds of machines, too many to manage by hand. The core idea of Kubernetes is declarative management: instead of commanding it step by step, you declare what you want (say 50 replicas of the borrow service, 4 GB each). The control plane keeps comparing desired with actual and handles scheduling, replacement, scaling and rolling updates. When a container dies at night nobody has to get up.'),
  lang: 'YAML · Deployment', code: `apiVersion: apps/v1
kind: Deployment
metadata: { name: borrow }
spec:
  replicas: 50
  selector: { matchLabels: { app: borrow } }
  template:
    metadata: { labels: { app: borrow } }
    spec:
      containers:
        - name: borrow
          image: registry.example.com/borrow:1.4.4
          readinessProbe: { httpGet: { path: /healthz, port: 8080 } }`,
  vendors: V('Kubernetes, K3s, OpenShift, Rancher, HashiCorp Nomad, Docker Swarm', `Amazon EKS, Google GKE, Azure AKS, ${ALI} ACK, ${TX} TKE`) });
N('s61', 'k8s', 40, 200, 440, 275, { icon: 'pulse', no: '6.1', at: '30:17', title: t('副本自愈', 'Self-healing replicas'),
  desc: t('控制平面的核心就是一个循环：看期望值，看实际值，不一样就动手补。', 'The heart of the control plane is a loop: read the desired state, read the actual state, and act when they differ.'),
  steps: [t('期望 50 个副本，实际 50 个', 'Desired 50 replicas, actual 50'), t('凌晨 3 点一个容器崩了：实际变成 49', '3 a.m., one container crashes: actual drops to 49'), t('控制平面发现期望 ≠ 实际，在健康的节点上新建一个', 'The control plane sees desired ≠ actual and starts a new one on a healthy node'), t('回到 50 / 50——没有人被叫醒', 'Back to 50 / 50. Nobody was woken up')],
  note: t('如果只是容器进程退出，节点上的 kubelet 往往会在原地把它重启；这里演示的是整个 Pod 丢失以后被替换。', 'If only the container process exits, the kubelet on the node often restarts it in place; what is shown here is a whole pod being lost and replaced.'),
  lang: 'Shell', code: `kubectl get deploy borrow
# NAME     READY   UP-TO-DATE   AVAILABLE
# borrow   49/50   50           49
kubectl get deploy borrow       # ${t('过几秒再看', 'a few seconds later')}
# borrow   50/50   50           50` });
N('s62', 'k8s', 520, 200, 440, 275, { icon: 'scale', no: '6.2', at: '30:41', title: t('扩容与滚动更新', 'Scaling & rolling update'),
  desc: t('扩容和换版本都只是“改清单”。改副本数，实际数量会追上来；改镜像版本，控制平面一批批地用新的换旧的，全程都有实例在服务。', 'Scaling and upgrading are both just edits to the manifest. Change the replica count and reality catches up; change the image tag and the control plane swaps old for new batch by batch, with instances serving the whole time.'),
  steps: [t('把清单里的 replicas 从 50 改成 200', 'Change replicas in the manifest from 50 to 200'), t('实际副本数逐步追上：50 → 200', 'Actual replicas catch up: 50 → 200'), t('换版本：先起一批新版，就绪后再停一批旧版', 'New version: start a batch of new pods, and stop a batch of old ones once they are ready'), t('一批批推进，全程都有实例在服务', 'Batch after batch, with instances serving throughout')],
  note: t('改清单不等于一定零停机：容量、就绪探针以及每批换多少（maxSurge / maxUnavailable）都会影响可用性。按指标自动扩缩容还需要另外配置 HPA。', 'Editing the manifest does not guarantee zero downtime: capacity, readiness probes and batch size (maxSurge / maxUnavailable) all matter. Scaling automatically on metrics needs an HPA configured separately.'),
  lang: 'Shell', code: `kubectl scale deploy/borrow --replicas=200
kubectl set image deploy/borrow borrow=registry.example.com/borrow:1.4.4
kubectl rollout status deploy/borrow
kubectl rollout undo deploy/borrow      # ${t('回滚', 'roll back')}` });
N('s63', 'micro', 270, 90, 220, 137, { icon: 'list', tone: 'teal', ch: 6, no: '6.3', at: '31:51', title: t('服务发现', 'Service discovery'),
  desc: t('容器一重建，IP 就变。调用方不能把地址写死，而是去问一个“通讯录”：实例启动时把自己登记进去并定时报心跳，调用方查询或订阅最新的地址列表。注册中心和 Redis 一样，不直接实现借书、抢座这类业务，而是夹在操作系统和业务程序之间、给所有服务提供通用支撑的基础软件——这类软件统称“中间件”。', 'Every time a container is recreated its IP changes. Callers cannot hard-code addresses; they ask a directory instead. Instances register themselves on start and send heartbeats, and callers query or subscribe to the current list. Like Redis, the registry implements no business feature such as borrowing or seat booking; it sits between the operating system and the business programs and supports every service. Such software is called middleware.'),
  steps: [t('实例启动后把地址登记到注册中心，并定时发心跳', 'On start, each instance registers its address and keeps sending heartbeats'), t('借阅服务向注册中心查询“馆藏服务”的地址列表', 'The borrow service asks the registry for the catalog service\'s addresses'), t('一个实例被重建，IP 变了：旧地址心跳超时被剔除，新地址登记进来', 'An instance is recreated with a new IP: the old address times out and is removed, the new one registers'), t('调用方在最新列表里轮询；写死 IP 的客户端还在连旧地址', 'Callers rotate through the fresh list; a client with a hard-coded IP still calls the dead address')],
  note: t('原片画的是通用的“注册 + 心跳”模型。在 Kubernetes 里，Service 配合集群 DNS 和 EndpointSlice 就能得到后端列表。', 'The video draws the generic register-and-heartbeat model. In Kubernetes, a Service together with cluster DNS and EndpointSlices already provides the backend list.'),
  lang: 'Python', code: `registry.register("catalog", "10.0.2.9:9090", ttl=10)    # ${t('启动时', 'on startup')}
while True:
    registry.heartbeat("catalog", "10.0.2.9:9090")       # ${t('每 5 秒', 'every 5 s')}
    time.sleep(5)

# ${t('调用方', 'caller')}
addrs = registry.lookup("catalog")       # ["10.0.1.5:9090", ...]
target = addrs[next_index() % len(addrs)]`,
  vendors: V('Nacos, Consul, etcd, Apache ZooKeeper, Eureka, CoreDNS', `Kubernetes Service, AWS Cloud Map, ${ALI} MSE`) });
N('s51', 'micro', 510, 90, 220, 137, { icon: 'box', ch: 5, no: '5.1', at: '23:43', title: t('单体拆分', 'Splitting the monolith'),
  desc: t('一个 JAR 里装着所有业务时，发布、扩容、故障都捆在一起：改一行通知代码要整体重新上线，座位功能内存泄漏会把借书一起拖垮。按业务边界拆开，每个服务可以独立发布、独立扩容、独立出故障。', 'With every feature in one JAR, releases, scaling and failures are bundled: one changed line in notifications redeploys everything, and a memory leak in seat booking takes borrowing down with it. Split along business boundaries and each service can ship, scale and fail independently.'),
  steps: [t('一个 JAR 装着全部业务：一起发布、一起扩容、一起挂', 'One JAR holds everything: released together, scaled together, down together'), t('按业务边界拆成六个独立的服务，各有各的代码仓库和数据库', 'Split along business lines into six independent services, each with its own repository and database'), t('借阅压力大：只给借阅服务加实例', 'Borrowing is under load: add instances to the borrow service only'), t('座位服务内存耗尽：只有它挂，借书照常', 'The seat service runs out of memory: only it goes down, borrowing carries on')],
  lang: 'text', code: `# ${t('之前：一个进程', 'before: one process')}
library.jar       = borrow + users + catalog + seat + notice + search

# ${t('之后：每块业务一个进程', 'after: one process per business capability')}
borrow-service    :8081   x12
users-service     :8082   x3
catalog-service   :8083   x6
seat-service      :8084   x2` });
N('mesh', 'micro', 750, 90, 220, 150, { icon: 'mesh', tone: 'pink', ch: 11, at: '46:33', title: t('服务网格', 'Service mesh'), sub: t('规模外推：上万个服务时', 'Extrapolation: at ten thousand services'),
  desc: t('服务多到上万、语言五花八门时，这些通信逻辑每种语言都要实现一遍，框架又是编译进业务代码里的：修一个安全漏洞，上万个服务都得重新编译、测试、上线，往往要好几个月，于是把服务发现、负载均衡、重试、熔断、安全加密这些能力从业务进程和语言框架里剥离出来，搬进旁边的代理。原片说得很明确：只有几十个服务的图书平台，还不值得付这份成本。', 'With tens of thousands of services in many languages, every language needs its own implementation of this logic, and because the framework is compiled into the business code, one security fix means rebuilding, testing and redeploying ten thousand services, often over months, so discovery, load balancing, retries, circuit breaking and encryption are stripped out of the business process and its language framework into a proxy beside it. The video is explicit: a library platform with a few dozen services is not worth this cost yet.'),
  note: t('代理可以统一配置超时和重试，但“这次借书到底生效了没有”仍要业务自己判断：会被重试的请求必须能按请求标识去重。', 'A proxy can configure timeouts and retries uniformly, but whether a borrow actually took effect is still the application\'s call: any request that may be retried must be deduplicated by request id.'),
  lang: 'YAML · Istio', code: `apiVersion: networking.istio.io/v1
kind: VirtualService
metadata: { name: catalog }
spec:
  hosts: [ catalog ]
  http:
    - route: [ { destination: { host: catalog } } ]
      timeout: 0.5s
      retries: { attempts: 2, perTryTimeout: 0.2s }`,
  vendors: V('Istio, Linkerd, Cilium Service Mesh, Consul Connect, Kuma, Envoy', `Google Cloud Service Mesh, AWS App Mesh, ${ALI} ASM`) });
N('s111', 'mesh', 30, 215, 450, 281, { icon: 'sidecar', no: '11.1', at: '47:23', title: t('Sidecar 伴生代理', 'The sidecar proxy'),
  desc: t('每个业务容器旁边都放一个代理，同进同出。业务只和本机的代理说话，真正的跨机通信、重试和熔断由代理之间完成——业务用什么语言写都一样。', 'Every business container gets a proxy next to it. The application only talks to its local proxy; the proxies handle the cross-machine traffic, retries and circuit breaking between themselves, whatever language the application is written in.'),
  steps: [t('之前：超时、重试、熔断写在业务进程里的通信库中，每种语言一套', 'Before: timeouts, retries and breakers live in a library inside each process, one per language'), t('网格：把这些能力搬到业务旁边的伴生代理（Sidecar）里', 'Mesh: move them into a sidecar proxy next to the application'), t('业务只和本机代理说话，代理之间完成跨机通信。多一跳：1.2 ms → 1.6 ms', 'The app talks only to its local proxy; proxies talk across machines. One more hop: 1.2 ms → 1.6 ms')],
  note: t('接口定义（IDL）和对象的序列化仍然留在应用里，代理只接手网络这一段。', 'The interface definition (IDL) and object serialization stay inside the application; the proxy takes over only the network part.'),
  lang: 'Shell · Istio', code: `kubectl label namespace library istio-injection=enabled
kubectl rollout restart deploy -n library
# ${t('重启后，每个 Pod 里都多了一个 istio-proxy 容器', 'after the restart every pod has an extra istio-proxy container')}` });
N('s112', 'mesh', 520, 215, 450, 281, { icon: 'mesh', no: '11.2', at: '48:09', title: t('控制面与数据面', 'Control plane & data plane'),
  desc: t('数据面是那一大片代理，真实的请求从它们中间穿过。控制面不碰任何业务流量，只负责把规则（超时、重试、路由）分发给每一个代理。', 'The data plane is the fleet of proxies that real requests pass through. The control plane never touches business traffic; it only distributes rules (timeouts, retries, routing) to every proxy.'),
  steps: [t('控制面：把“调用馆藏最多等 0.5 秒”这条策略下发给每一个代理', 'Control plane: push the rule “wait at most 0.5 s for catalog” to every proxy'), t('数据面：真实的借书请求在代理之间流动，按已下发的规则执行', 'Data plane: real borrow requests flow between proxies, which apply the rules they were given'), t('代价：多一跳延迟、多一套要运维的系统——几十个服务时还不划算', 'The price: an extra hop and another system to operate. With a few dozen services it does not pay off')],
  note: t('原片的结论：技术选型不是越高级越好。架构演进的每一步，都是用当前承受得起的复杂度，去换当时真正需要的稳定性、扩展性和研发效率。', 'The video\'s conclusion: more advanced is not better. Every step of this evolution trades complexity you can afford today for the stability, scalability and development speed you actually need right now.'),
  lang: 'YAML · Istio', code: `apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata: { name: catalog }
spec:
  host: catalog
  trafficPolicy:
    outlierDetection:            # ${t('相当于熔断', 'i.e. circuit breaking')}
      consecutive5xxErrors: 5
      baseEjectionTime: 30s` });
N('borrow', 'micro', 60, 330, 300, 200, { icon: 'book', live: 1, fw: 1, ch: 5, title: t('借阅服务', 'Borrow service'), sub: t('一次借书的协调者', 'Coordinates one borrow'),
  desc: t('一次借书的协调者：向用户服务核验资格，向馆藏服务申请扣库存，写下借阅记录，再发出“借阅成功”事件。和每个微服务一样，它内部分两层：上面是业务代码，下面是负责“和别的服务说话”的通信框架。它调用别人最多，所以框架在这里展开。', 'The coordinator of a borrow: it checks eligibility with the user service, asks the catalog service to deduct stock, writes the loan record, then publishes a “loan created” event. Like every microservice it has two layers inside: business code on top, and below it the communication framework that talks to other services. It calls the most other services, so the framework is opened up here.') });
N('bcode', 'borrow', 40, 85, 280, 175, { icon: 'code', title: t('业务代码', 'Business code'), sub: 'borrow()',
  steps: [t('先问用户服务：这位同学能借吗（一次 RPC）', 'First ask the user service whether this student may borrow (an RPC)'), t('再请馆藏服务扣一本库存（又一次 RPC）', 'Then ask the catalog service to deduct one copy (another RPC)'), t('在自己的库里写下借阅记录', 'Write the loan record in its own database'), t('发出“借阅成功”事件就返回：通知、统计、推荐不用学生等', 'Publish “loan created” and return: notifications, stats and recommendations do not keep the student waiting')],
  desc: t('借书这件事本身的规则：查资格、扣库存、记借阅、发事件。业务代码决定“说什么”，下面的框架负责“怎么把话送到”。', 'The rules of borrowing itself: check eligibility, deduct stock, record the loan, publish the event. Business code decides what to say; the framework below takes care of getting it delivered.'),
  lang: 'Java', code: `public Receipt borrow(String userId, String isbn) {
    users.checkEligible(userId);            // RPC
    catalog.deductStock(isbn, 1);           // RPC
    Loan loan = loans.save(new Loan(userId, isbn, 14));
    events.publish("loan.created", loan);   // ${t('异步', 'async')}
    return new Receipt(loan.id());
}` });
N('s52', 'borrow', 350, 85, 280, 175, { icon: 'plug', no: '5.2', at: '26:02', title: t('本地调用变成跨机调用', 'A local call becomes a remote call'),
  desc: t('在一个进程里，调用函数只是跳到另一段内存。拆成两个服务以后，同一行代码背后是：把参数变成字节、过网络、对方还原参数、执行、再把结果变成字节传回来——中间任何一步都可能失败或者很慢。', 'Inside one process, calling a function is a jump to another piece of memory. After the split, the same line means: turn arguments into bytes, cross the network, rebuild the arguments, execute, turn the result into bytes and send it back. Any of those steps can fail or be slow.'),
  steps: [t('同一个进程里：调用函数只是跳到另一段代码，纳秒级', 'In one process: a call is a jump to other code, nanoseconds'), t('拆开以后：对方在另一台机器上，参数必须先变成字节（序列化）', 'After the split: the callee is on another machine, so arguments are first serialized into bytes'), t('字节过网络；对端反序列化还原参数、执行，再把结果序列化传回来', 'Bytes cross the network; the other side deserializes, executes, and serializes the result back'), t('网络会丢包、对端会变慢：调用方必须设超时', 'Networks drop packets and peers get slow: the caller must set a timeout')],
  note: t('超时只说明调用方没有及时等到答复，不能据此断定对方没有执行。另外，RPC 指的是“远程调用”这种模型，它完全可以跑在 HTTP 上；HTTP + JSON 方便外部客户端阅读和调试，内部的密集调用才更在意编码成本。', 'A timeout only says the caller did not get an answer in time; it does not prove the callee did nothing. Also, RPC names the remote-call model and can perfectly well run over HTTP: HTTP + JSON is easy for external clients to read and debug, while dense internal traffic cares more about encoding cost.'),
  lang: 'Python', code: `# ${t('本地调用：进程内的一次跳转', 'local call: a jump inside one process')}
stock.deduct(isbn, 1)

# ${t('远程调用：字节过网络，而且可能永远等不到回答', 'remote call: bytes over a network, and the answer may never come')}
sock.settimeout(0.5)
sock.sendall(encode({"isbn": isbn, "n": 1}))
reply = decode(sock.recv(4096))` });
N('s71', 'borrow', 660, 85, 280, 175, { icon: 'clock', ch: 7, no: '7.1', at: '32:56', title: t('等待会向上传递', 'Waiting spreads upward'),
  desc: t('下游一慢，上游的线程就都卡在“等它回答”上。线程和连接都是有限的，等满了，上游自己也变成别人眼里的慢服务——故障就这样沿着调用链一层层放大，最后整个系统瘫痪（级联故障，也叫服务雪崩）。下面那套通信框架，做的每一件事都是为了不让这种情况发生。', 'When a downstream slows, upstream threads all sit waiting for it. Threads and connections are finite; once they are all waiting, the upstream becomes the slow service for its own callers, and the failure is amplified up the call chain until the whole system is down (a cascading failure). Everything the communication framework below does exists to stop this from happening.'),
  steps: [t('用户服务里一条慢 SQL，占住了它的工作线程', 'A slow SQL query in the user service ties up its worker threads'), t('借阅服务的线程都在等用户服务回答，线程池被占满', 'The threads of the borrow service all wait for the user service; its pool fills up'), t('再往上：网关等不到答复，学生看到 504', 'One layer up: the gateway gets no answer and the student sees a 504'), t('给调用设超时、限制重试次数：线程按时释放，故障不再蔓延', 'Add a timeout and bounded retries: threads are released on time and the failure stops spreading')],
  lang: 'Java', code: `HttpClient client = HttpClient.newBuilder()
    .connectTimeout(Duration.ofMillis(200))
    .build();
HttpRequest req = HttpRequest.newBuilder(uri)
    .timeout(Duration.ofMillis(500))      // ${t('绝不无限等待', 'never wait forever')}
    .build();` });
N('fw', 'borrow', 40, 290, 920, 355, { icon: 'layers', tone: 'purple', ch: 7, at: '33:46', title: t('通信框架', 'Communication framework'), sub: t('每个服务里都有一份 · 按一次调用的先后排列', 'Every service carries one · in the order of a single call'),
  desc: t('每个微服务内部都有这样一层，专门负责“和别的服务说话”。一次调用依次经过它：先找到对方的地址并挑一台实例，从连接池里取一条现成的连接，设好超时、必要时有限地重试；对方连续失败就熔断，非核心功能降级，不同依赖之间用舱壁隔开。六个服务里是同样的一份，这里以借阅服务为例展开。原片给的准则是：永远不要相信你的任何上下游。', 'Every microservice has this layer inside, dedicated to talking to other services. A call passes through it in order: find the addresses of the callee and pick an instance, take a ready connection from the pool, set a timeout and retry within limits; trip a breaker when the callee keeps failing, degrade non-core features, and keep dependencies apart with bulkheads. All six services carry the same layer; it is opened up here inside the borrow service. The rule the video gives: never trust anything upstream or downstream of you.'),
  vendors: [['Java', ['Spring Cloud', 'Apache Dubbo', 'gRPC-Java', 'Resilience4j', 'Sentinel']], ['Go', ['Kitex', 'Kratos', 'go-zero', 'gRPC-Go']], [t('其他语言', 'Other languages'), ['gRPC-Python', 'tonic (Rust)', 'brpc (C++)', 'NestJS (Node.js)']]] });
N('s7a', 'fw', 55, 66, 240, 150, { icon: 'split', no: '7.2', at: '33:46', title: t('挑实例与连接池', 'Picking an instance & pooling'),
  desc: t('调用的前半段。框架从注册中心拿到对方的实例列表，自己在本地挑一台（客户端负载均衡，不用再绕一层代理）。每次都新建连接太慢，所以它维护一个连接池：握手一次，反复使用。池子是有限的——这正是“慢实例会拖垮调用方”的原因。', 'The first half of a call. The framework gets the instance list of the callee from the registry and picks one locally (client-side load balancing, no extra proxy hop). Opening a connection every time is too slow, so it keeps a pool: one handshake, many uses. The pool is finite, which is exactly why a slow instance can take its caller down.'),
  steps: [t('框架向注册中心要来用户服务的实例列表，存在本地', 'The framework fetches the instance list of the user service from the registry and keeps it locally'), t('每次调用在本地挑一台：客户端负载均衡', 'Each call picks one locally: client-side load balancing'), t('建连接要握手，很慢：握手一次，放进连接池反复用', 'Opening a connection needs a handshake and is slow: do it once and reuse it from the pool'), t('池子是有限的：一台慢实例把连接都占住，池子就空了', 'The pool is finite: one slow instance holds every connection and the pool runs dry')],
  lang: 'Python', code: `pool = ConnectionPool(max_size=8)                    # ${t('握手一次，反复使用', 'one handshake, many uses')}
addr = balancer.pick(registry.lookup("users"))      # ${t('在本地挑一台', 'pick one locally')}
with pool.get(addr, timeout=0.2) as conn:           # ${t('池子空了也不能无限等', 'never wait forever for a free one')}
    reply = conn.call("checkEligible", user_id)`,
  vendors: V('Spring Cloud LoadBalancer, Ribbon, gRPC channels, HikariCP, Apache HttpClient, Netty', '') });
N('s7b', 'fw', 380, 66, 240, 150, { icon: 'clock', no: '7.3', at: '34:06', title: t('超时与有限重试', 'Timeouts & bounded retries'),
  desc: t('超时让等待有尽头：到点就不等了，把线程和连接还回去。重试只能有限次，而且只适合可以安全重复的调用，比如查询；换一台健康实例再试。写操作不能盲目重试——超时不代表对方没执行，必须带上请求号让对方去重（幂等）。如果整个下游都慢了，重试只会让请求再多发几遍、越堵越严重，这时要靠熔断。', 'A timeout puts an end to waiting: when it fires, the thread and the connection go back. Retries must be bounded and suit only calls that are safe to repeat, such as queries, tried again on another healthy instance. Writes must not be retried blindly: a timeout does not mean the callee did nothing, so the request carries an id the callee can deduplicate on (idempotency). And when the whole downstream is slow, retries only multiply the load; that is where the circuit breaker comes in.'),
  steps: [t('资格查询发给实例 A——它迟迟不回', 'The eligibility query goes to instance A, which does not answer'), t('超时到了：不再等，线程和连接立刻归还', 'The timeout fires: stop waiting, release the thread and the connection at once'), t('这是只读查询，可以重复：换健康的实例 B 重试一次，成功', 'It is a read-only query, safe to repeat: retry once on healthy instance B, and it succeeds'), t('扣库存是写操作：超时不代表没执行，重试必须带请求号，让对方去重', 'Deducting stock is a write: a timeout does not mean it did not happen, so the retry carries a request id for the callee to deduplicate')],
  lang: 'Python', code: `def call_with_retry(fn, attempts=2, timeout=0.5):
    for i in range(attempts):
        try:
            return fn(timeout=timeout, target=pick_instance(skip=i))
        except Timeout:
            continue                   # ${t('只对可以安全重复的调用这样做', 'only for calls that are safe to repeat')}
    raise Unavailable()

# ${t('写操作：带请求号，对端按它去重', 'a write: carry a request id so the callee can deduplicate')}
catalog.deduct_stock(isbn, 1, request_id="7f3a")`,
  vendors: V('Resilience4j Retry, Spring Retry, Tenacity, gRPC retry policy, Envoy', '') });
N('s72', 'fw', 705, 66, 240, 150, { icon: 'shield', no: '7.4', at: '34:27', title: t('熔断', 'Circuit breaker'),
  desc: t('像电闸。闭合时请求照常通过，熔断器在旁边统计失败比例；超过门槛就跳闸，之后的调用立刻失败，不再占着线程去等一个大概率不会回来的答复。过一段时间进入半开，只放一个请求去试探：成功就合闸，失败就再断开一轮。', 'Like an electrical breaker. Closed, requests pass normally while it tracks the failure ratio; past the threshold it trips, and later calls fail at once instead of tying up threads on an answer that probably will not come. After a while it goes half-open and lets a single probe through: success closes it, failure opens it for another round.'),
  steps: [t('闭合：请求正常通过，熔断器统计最近的失败比例', 'Closed: requests pass while the breaker tracks the recent failure ratio'), t('失败比例超过 50%：跳闸。之后的调用立刻失败，不再占着线程去等', 'Failure ratio above 50%: it trips. Later calls fail at once instead of holding threads'), t('20 秒后“半开”：只放一个请求去试探——还是失败，重新断开', 'After 20 s it goes half-open and lets one probe through. It fails again, so it re-opens'), t('再过 20 秒再试探一次：这次成功了', 'Another 20 s later it probes again: this time it succeeds'), t('合闸，请求恢复通过，失败比例重新统计', 'The breaker closes, requests flow again and the ratio starts fresh')],
  note: t('50% 和 20 秒是原片演示用的配置。实际还要选统计窗口的长度和最少样本数，否则两三次失败就会误跳闸。', '50% and 20 s are the values the video uses. In practice you also choose the window length and a minimum sample count, or two or three failures will trip it by mistake.'),
  lang: 'Python', code: `def call(dep, fn):
    if breaker.state == "open":
        if now() - breaker.opened_at < 20:
            raise FailFast(dep)              # ${t('已跳闸：试都不试', 'tripped: do not even try')}
        breaker.state = "half-open"          # ${t('放一个请求去试探', 'let one probe through')}
    try:
        result = fn(timeout=0.2)
        breaker.close()                      # ${t('成功：合闸', 'success: close')}
        return result
    except Exception:
        breaker.record_failure()             # ${t('失败比例 > 50% → 断开', 'failure ratio > 50% → open')}
        raise`,
  vendors: V('Resilience4j, Sentinel, Hystrix, Polly, gobreaker, Envoy outlier detection', '') });
N('s7c', 'fw', 55, 230, 240, 150, { icon: 'swap', no: '7.5', at: '34:52', title: t('降级', 'Fallback'),
  desc: t('熔断回答的是“还要不要去调它”，降级回答的是“调不到的时候页面怎么办”。办法是区分核心和可选：书的信息和借阅是核心，失败就报错；“猜你喜欢”是可选的，拿不到就给一个凑合的结果——直接隐藏。', 'A breaker answers “should we still call it”; a fallback answers “what does the page do when we cannot”. The trick is to separate core from optional: book details and borrowing are core, and fail loudly; “you may also like” is optional, so when it is unavailable return something acceptable, namely hide it.'),
  steps: [t('书籍详情页有两块：书的信息和借阅是核心；“猜你喜欢”来自推荐服务，是可选的', 'The book page has two parts: details and borrowing are core; “you may also like” comes from recommendations and is optional'), t('推荐服务不可用。如果整页跟着报错，学生连书都借不了', 'Recommendations are down. If the whole page failed with them, nobody could even borrow'), t('降级：这一块给个凑合的结果——直接隐藏。查书、借书照常', 'Fall back: give that part an acceptable result by hiding it. Browsing and borrowing carry on'), t('推荐恢复以后，这一块自己回来', 'When recommendations recover, the section comes back by itself')],
  lang: 'Python', code: `def book_page(isbn):
    book = catalog.get(isbn)                      # ${t('核心：失败就报错', 'core: fail loudly')}
    try:
        recs = recommend.similar(isbn, timeout=0.2)
    except Exception:
        recs = []                                 # ${t('可选：给空列表，页面隐藏这一块', 'optional: empty list, the page hides the section')}
    return render(book, recs)`,
  vendors: V('Sentinel, Resilience4j fallback, Hystrix fallback, Unleash', 'LaunchDarkly') });
N('s7d', 'fw', 380, 230, 240, 150, { icon: 'grid', no: '7.6', at: '35:18', title: t('舱壁隔离', 'Bulkhead'),
  desc: t('船舱用隔板分开，一舱进水不至于沉船。服务里也一样：如果所有下游调用共用一个线程池，最慢的那个依赖会把池子占满，连无关的调用都发不出去。给每个依赖单独的并发额度，一个耗尽只影响它自己。', 'A ship is divided by bulkheads so one flooded compartment does not sink it. Services work the same way: if every downstream call shares one thread pool, the slowest dependency fills it and unrelated calls cannot even start. Give each dependency its own concurrency quota and exhausting one hurts only that one.'),
  steps: [t('借阅服务调用用户、馆藏、推荐，用的是同一个线程池', 'The borrow service calls users, catalog and recommendations from one shared thread pool'), t('推荐一慢，池子被它占满：连调用户和馆藏的线程都没了，借书被可选功能拖垮', 'Recommendations slow down and fill the pool: no threads are left for users or catalog, and an optional feature takes borrowing down'), t('舱壁：给每个依赖单独的额度——用户 8、馆藏 8、推荐 4', 'Bulkheads: a separate quota per dependency: users 8, catalog 8, recommendations 4'), t('推荐的额度耗尽，只有它自己排队或被拒绝；用户和馆藏不受影响，借书照常', 'Recommendations exhaust their quota and only they queue or get rejected; users and catalog are untouched and borrowing carries on')],
  lang: 'Python', code: `limits = {"users": Semaphore(8), "catalog": Semaphore(8), "recommend": Semaphore(4)}

def call(dep, fn):
    if not limits[dep].acquire(blocking=False):
        raise Rejected(dep)          # ${t('这个依赖的额度用完了：只拒绝它自己', 'this dependency is out of quota: reject only it')}
    try:
        return fn()
    finally:
        limits[dep].release()`,
  vendors: V('Resilience4j Bulkhead, Sentinel, Hystrix thread pools, Envoy connection limits', '') });
N('s73', 'fw', 705, 230, 240, 150, { icon: 'cube', no: '7.7', at: '35:33', title: t('收进一个框架', 'Collected into a framework'),
  desc: t('挑实例、连接池、超时重试、熔断、降级、隔离……每个服务都要做一遍。于是这些通用能力被收进一个框架：业务代码写起来像本地调用，框架在背后把这些事都做了。不同语言各有各的实现——这也是后来服务网格想解决的麻烦。', 'Picking instances, pooling, timeouts and retries, breakers, fallbacks, bulkheads: every service needs all of it. So these shared abilities are collected into a framework. Business code reads like a local call while the framework does the rest. Each language has its own implementation, which is the pain a service mesh later tries to remove.'),
  steps: [t('同样的几件事，每个服务都自己写了一遍', 'The same handful of jobs, rewritten inside every service'), t('把这些通用能力收进一个通信框架，业务代码只管业务', 'Collect them into one communication framework and leave business code to the business'), t('每种语言各有一套：Java 的借阅、用户、馆藏，Go 的座位和通知，Python 的搜索和推荐', 'One per language: Java for borrow, users and catalog; Go for seat and notify; Python for search and recommend')],
  lang: 'Java · Dubbo', code: `@DubboReference(timeout = 500, retries = 1, loadbalance = "roundrobin")
private CatalogService catalog;   // ${t('寻址、连接池、超时、重试都在框架里', 'discovery, pooling, timeout, retry: all in the framework')}

catalog.deductStock(isbn, 1);     // ${t('写起来像本地调用', 'reads like a local call')}`,
  vendors: [[t('Go（原片点名）', 'Go (named in the video)'), [t('Kitex / Hertz（字节）', 'Kitex / Hertz (ByteDance)'), t('tRPC-Go（腾讯）', 'tRPC-Go (Tencent)'), t('Kratos（B 站）', 'Kratos (Bilibili)'), 'go-zero', 'Gin + gRPC']], ['Java', [t('Dubbo / Spring Cloud Alibaba（阿里）', 'Dubbo / Spring Cloud Alibaba (Alibaba)'), 'Spring Cloud', 'gRPC-Java']], [t('Python 与其他', 'Python & others'), ['gRPC-Python', 'tonic (Rust)', 'brpc (C++)']]] });
N('users', 'micro', 620, 285, 290, 181, { icon: 'user', live: 1, fw: 1, ch: 5, title: t('用户服务', 'User service'), sub: t('身份 · 借阅资格', 'Identity · eligibility'),
  steps: [t('借阅服务来问：这位同学能借吗？没有欠费、已借 8 本没超上限——可以', 'The borrow service asks: may this student borrow? No fines, 8 of 10 on loan: yes'), t('另一位同学有欠费：不行。借阅到此为止，不会去扣库存', 'Another student has unpaid fines: no. The borrow stops here and stock is never touched'), t('登录、身份和借阅资格都归它管，别的服务不自己判断', 'Login, identity and eligibility all live here; other services do not decide for themselves')],
  desc: t('维护学生身份、借阅资格和欠费信息。借阅服务要先得到它的答复才会去扣库存——所以它一慢，借书也跟着慢。', 'Keeps student identity, borrowing eligibility and outstanding fines. The borrow service waits for its answer before deducting stock, so when it is slow, borrowing is slow.') });
N('catalog', 'micro', 600, 480, 300, 190, { icon: 'books', live: 1, fw: 1, ch: 5, title: t('馆藏服务', 'Catalog service'), sub: t('书目与库存的主人', 'Owner of titles and stock'),
  desc: t('书目和库存只归它管，别的服务想改库存只能通过 RPC 请它来做。它对外的接口用一份 IDL 文件描述。', 'It alone owns titles and stock; any other service that wants stock changed has to ask it through an RPC. Its interface is described in one IDL file.'),
  lang: 'Java', code: `@Transactional
public void deductStock(String isbn, int n) {
    int rows = jdbc.update(
        "UPDATE book SET stock = stock - ? WHERE isbn = ? AND stock >= ?",
        n, isbn, n);
    if (rows == 0) throw new SoldOutException(isbn);
}` });
N('s53', 'catalog', 40, 200, 440, 275, { icon: 'code', no: '5.3', at: '27:39', title: t('IDL 与兼容性', 'IDL & compatibility'),
  desc: t('借阅用 Java 写，馆藏用 Go 写，它们靠一份接口描述文件（IDL）对齐：有哪些字段、各自的编号。两端的代码都由它生成。线上新旧版本总会同时存在，所以改接口时只能加字段、不能改编号。如果只靠文档或口头约定 JSON 字段，有人随手改了字段名或类型，另一边没同步，上线就直接报错。', 'Borrow is written in Java, catalog in Go, and they agree through one interface description file (IDL): which fields exist and what number each has. Both sides generate their code from it. Old and new versions always coexist in production, so you may add fields but never renumber them. With JSON fields agreed only in documents or by word of mouth, someone renames a field or changes its type, the other side has not caught up, and the release breaks.'),
  steps: [t('一份 .proto 文件写清消息有哪些字段、各自的编号', 'One .proto file spells out each field of the message and its number'), t('编译器据此生成 Java 和 Go 两端的类型', 'The compiler generates the Java and Go types from it'), t('新增字段 campus = 3：旧版本不认识 3 号，直接跳过，照常工作', 'Add campus = 3: an old reader does not know tag 3, skips it and keeps working'), t('反例：把 2 号改作他用，旧版本会把新数据当成天数读错', 'Counter-example: reuse tag 2 for something else and old readers misread the new data as days')],
  note: t('删除字段后要把它的编号保留（reserved），防止以后被误用。新增字段用 optional，不要随手加 required 这种强校验。', 'After removing a field, mark its number as reserved so nobody reuses it by accident. Add new fields as optional; do not casually add required constraints.'),
  lang: 'Protocol Buffers', code: `syntax = "proto3";

message BorrowReq {
  string isbn   = 1;
  int32  days   = 2;
  string campus = 3;    // ${t('新字段：旧版本会跳过 3 号', 'new field: old readers skip tag 3')}
  reserved 4;           // ${t('已删除的字段：编号永不复用', 'a removed field: never reuse its number')}
}

service Catalog { rpc DeductStock(BorrowReq) returns (BorrowReply); }`,
  vendors: V('Protocol Buffers, Apache Thrift, Apache Avro, FlatBuffers, OpenAPI', 'Buf Schema Registry, Confluent Schema Registry') });
N('s54', 'catalog', 520, 200, 440, 275, { icon: 'plug', no: '5.4', at: '28:24', title: t('gRPC 与字节', 'gRPC & bytes'),
  desc: t('同一组数据，JSON 要把字段名一遍遍写出来，Protobuf 只写编号和值，所以小得多、解析也快。gRPC 生成的“桩”负责把参数编码、通过 HTTP/2 发出、等对方回答——调用方只看到一个普通的方法。', 'For the same data, JSON spells out field names every time while Protobuf writes only tag numbers and values, so it is much smaller and faster to parse. The stub generated by gRPC encodes the arguments, sends them over HTTP/2 and waits for the reply; the caller sees an ordinary method.'),
  steps: [t('同一组数据写成 JSON：34 个字节', 'The same data as JSON: 34 bytes'), t('写成 Protobuf：17 个字节——字段名换成了编号', 'As Protobuf: 17 bytes, with field names replaced by tag numbers'), t('桩代码把字节发给对端；对端解码后调用真正的方法，再把结果传回', 'The stub ships the bytes; the server decodes, calls the real method, and sends the result back')],
  note: t('34 和 17 字节只是消息体，外面还有 gRPC 和传输层的封装；字段不同、开不开压缩，差距都会变。', '34 and 17 bytes are the message bodies only; gRPC and transport framing come on top, and other fields or compression change the gap.'),
  lang: 'Python · gRPC', code: `channel = grpc.insecure_channel("catalog:9090")
stub = CatalogStub(channel)
reply = stub.DeductStock(
    BorrowReq(isbn="9787111544937", days=14), timeout=0.5)`,
  vendors: V('gRPC, Apache Dubbo, Apache Thrift, Kitex, Connect RPC, Twirp', '') });
N('seat', 'micro', 470, 735, 150, 94, { icon: 'seat', live: 1, fw: 1, ch: 5, title: t('座位服务', 'Seat service'), steps: [t('reserve()：预约自习座位 3F-118', 'reserve(): book study seat 3F-118'), t('release()：离开时把座位放出来', 'release(): free the seat when leaving'), t('它是独立的进程、有自己的库：内存耗尽重启，只影响订座，借书照常', 'It is its own process with its own database: an out-of-memory restart affects seat booking only')],
  desc: t('自习座位预约。拆出来以后，它内存耗尽重启只影响订座，借书照常。', 'Study-seat booking. Once split out, an out-of-memory restart here only affects seat booking; borrowing carries on.') });
N('search', 'micro', 640, 735, 150, 94, { icon: 'search', live: 1, fw: 1, ch: 5, title: t('搜索服务', 'Search service'),
  steps: [t('suggest()：一边输入一边给出联想', 'suggest(): completions while you type'), t('search()：在倒排索引里按词查到 12 本，不去扫数据库', 'search(): finds 12 titles through the inverted index, without scanning the database'), t('新书入库后索引异步更新，晚几秒没关系——它不参与扣库存', 'After a new title is added the index updates asynchronously; a few seconds late is fine, as it takes no part in stock deduction')],
  desc: t('按关键词查书，几乎全是读请求：可以读副本、读缓存，容忍一点点延迟。它和必须精确的扣库存走的是不同的路。', 'Keyword search over titles, almost all reads: it can use replicas and caches and tolerate slight staleness. It takes a different path from stock deduction, which must be exact.'),
  vendors: V('Elasticsearch, OpenSearch, Meilisearch, Apache Solr, Typesense', 'Algolia, Elastic Cloud, Amazon OpenSearch Service') });
N('notice', 'micro', 810, 735, 150, 94, { icon: 'bell', live: 1, fw: 1, ch: 9, title: t('通知服务', 'Notification service'), steps: [t('收到“借阅成功”事件：push() 一条借书成功通知', 'A “loan created” event arrives: push() a confirmation'), t('remind()：到期前 3 天提醒还书', 'remind(): a reminder 3 days before the due date'), t('推送渠道偶尔失败：记一次计数，稍后重试——所以同一条消息要能去重', 'The push channel sometimes fails: count it and retry later, which is why the same message must be deduplicated')],
  desc: t('订阅“借阅成功”事件，给学生发提醒。同一条消息可能送达两次，所以它要自己去重。', 'Subscribes to “loan created” events and reminds the student. The same message may arrive twice, so it must deduplicate.') });

// ================= 数据 =================
N('mysql', 'data', 80, 110, 840, 420, { icon: 'db', tone: 'indigo', at: '09:47', title: t('MySQL 主从', 'MySQL primary & replicas'), sub: t('借还书的最终依据', 'The source of truth'),
  desc: t('借阅记录和库存的最终依据。主库接收写事务，从库分担查询。它保证的东西（事务、锁、落盘）正是它比缓存慢的原因。', 'The final authority on loans and stock. The primary takes write transactions and replicas share the reads. What it guarantees (transactions, locks, durability) is exactly why it is slower than a cache.'),
  lang: 'SQL', code: `BEGIN;
UPDATE book SET stock = stock - 1
 WHERE isbn = '9787111544937' AND stock > 0;
INSERT INTO loan (user_id, isbn, due)
VALUES (2023010123, '9787111544937', CURDATE() + INTERVAL 14 DAY);
COMMIT;`,
  vendors: V('MySQL, PostgreSQL, MariaDB, TiDB, CockroachDB, OceanBase', `Amazon RDS / Aurora, Google Cloud SQL, Azure SQL Database, PlanetScale, Oracle Database, ${ALI} RDS / PolarDB`) });
N('s31', 'mysql', 30, 170, 300, 187, { icon: 'db', no: '3.1', at: '10:01', title: t('一条 SQL 的旅程', 'The journey of one query'),
  desc: t('查询进来要经过：连接、解析、优化器选索引、存储引擎取数据。要读的页如果已经在内存（缓冲池）里，就不用碰磁盘。写操作还要先拿到行锁、先写日志，才能提交。', 'A query passes through: connection, parser, optimizer choosing an index, storage engine fetching rows. If the needed page is already in memory (the buffer pool) the disk is not touched. A write must also take the row lock and write the log before it can commit.'),
  steps: [t('SELECT 进来：连接 → 解析 → 优化器决定走哪个索引', 'A SELECT arrives: connection → parser → optimizer picks an index'), t('沿索引找到那一行；页已经在缓冲池里，就不用读磁盘', 'Follow the index to the row; the page is already in the buffer pool, so no disk read'), t('两笔 UPDATE 抢同一行：先到的拿到行锁，后到的等待', 'Two UPDATEs want the same row: the first takes the row lock, the second waits'), t('先写日志再提交，锁释放，第二笔才继续——发现库存已经没了', 'Write the log, commit, release the lock; only then does the second proceed and find no stock left')],
  note: t('要读的页不在缓冲池里，才需要去磁盘读。锁、日志和缓冲池里的数据页是三样东西：提交时只需要把日志落盘，不必把整页数据写回去。', 'Only when the page is not in the buffer pool does the disk get read. Locks, the log and the data pages in the buffer pool are three different things: a commit only needs the log flushed, not whole pages written back.'),
  lang: 'SQL', code: `CREATE INDEX idx_book_isbn ON book (isbn);

EXPLAIN SELECT title, stock FROM book WHERE isbn = '9787111544937';
-- type: ref   key: idx_book_isbn   rows: 1` });
N('s32', 'mysql', 350, 170, 300, 187, { icon: 'copy', no: '3.2', at: '11:29', title: t('复制延迟', 'Replication lag'),
  desc: t('读多写少，就做“读写分离”：让主库只管写，把变更复制给几台从库来分担读。但复制需要时间：刚还完书立刻刷新，如果读到还没追上的从库，库存看起来还是旧的。多几台从库还有一个好处：主库出故障时，有副本可以接替。', 'Reads far outnumber writes, so split them (read/write splitting): the primary handles writes and copies changes to replicas that share the reads. But copying takes time: refresh right after returning a book and, if you hit a replica that has not caught up, the stock still looks old. Replicas have one more benefit: when the primary fails, one of them can take over.'),
  steps: [t('还书：写请求只进主库，库存 0 → 1', 'A return: the write goes to the primary only, stock 0 → 1'), t('主库把变更发给两台从库，各有各的延迟', 'The primary ships the change to two replicas, each with its own delay'), t('这时刷新页面，读到慢的那台从库：库存还是 0', 'Refresh now and you may read the slower replica: stock still 0'), t('变更到达以后，所有副本都是 1', 'Once the change arrives, every copy says 1')],
  note: t('想让读者立刻看到自己刚写的结果，可以让“刚写完之后的那几次读”走主库。', 'To let people see their own write immediately, send the reads that come right after a write to the primary.'),
  lang: 'Python', code: `def db_for(sql, just_wrote=False):
    if sql.lstrip().upper().startswith("SELECT") and not just_wrote:
        return random.choice(replicas)    # ${t('可能稍微旧一点', 'may be slightly stale')}
    return primary                        # ${t('写，以及刚写完之后的读', 'writes, and reads right after a write')}`,
  vendors: V('MySQL Replication, ProxySQL, Vitess, Apache ShardingSphere, MaxScale', `Amazon Aurora Replicas, ${ALI} PolarDB`) });
N('s35', 'mysql', 670, 170, 300, 187, { icon: 'lock', no: '3.5', at: '15:11', title: t('最后一册与一致性', 'The last copy & consistency'),
  desc: t('书目信息旧几秒没关系，库存扣减却不能错。两个人同时借最后一本，如果都“先读到 1，再写成 0”，就会借出两本。把判断和修改放进同一条语句，让数据库来保证只有一笔成功。', 'Catalog details can be a few seconds stale; stock deduction cannot be wrong. If two people borrow the last copy and both read 1 then write 0, two copies go out. Put the check and the change into one statement and let the database guarantee only one succeeds.'),
  steps: [t('两个人同时借最后一本：都先读到“库存 1”', 'Two people borrow the last copy at once: both first read “stock 1”'), t('各自把库存写成 0：两人都“借阅成功”——借出了两本', 'Each writes stock = 0: both “succeed”, and two copies are lent out'), t('改成带条件的更新：WHERE stock > 0。只有一笔影响到 1 行', 'Use a conditional update, WHERE stock > 0: only one statement affects a row'), t('网络断开时怎么选：查书目读本地副本，旧一点也能用；借书连不上主库就拒绝，宁可暂时不可用', 'When the network partitions: browsing reads the local replica, stale but usable; borrowing cannot reach the primary and is refused, unavailable rather than wrong')],
  note: t('校正：原片约 15:08 的三角把“高并发、低时延、强一致”对应到 CAP。CAP 说的是发生网络分区时，线性一致性和可用性只能保住一个；延迟和吞吐是另一个话题。', 'Correction: around 15:08 the video maps a “high concurrency, low latency, strong consistency” triangle onto CAP. CAP says that during a network partition you can keep either linearizability or availability; latency and throughput are a separate topic.'),
  lang: 'SQL', code: `UPDATE book SET stock = stock - 1
 WHERE isbn = '9787111544937' AND stock > 0;
-- ${t('影响 1 行：借到了。影响 0 行：最后一本被别人借走了。', 'affected rows = 1: you got it.  0: someone else took the last copy.')}` });
N('redis', 'data', 80, 590, 840, 420, { icon: 'bolt', tone: 'pink', at: '12:57', title: t('Redis 缓存与会话', 'Redis cache & sessions'), sub: t('放在内存里的键值库', 'A key-value store in memory'),
  desc: t('把热门书目放在内存里，毫秒内返回；也用来存放所有实例共享的登录会话。它存的是副本：丢了可以从数据库重建，但会带来一致性和失效时的各种新问题。Redis 是开源的内存型数据结构存储：支持字符串、哈希、列表、集合等结构，也能用快照或操作日志把数据持久化到磁盘；单机每秒能处理十万次以上的请求，响应在亚毫秒级。', 'Keeps hot titles in memory and answers within a millisecond; also stores the login sessions shared by all instances. What it holds is a copy: it can be rebuilt from the database, but it brings its own consistency and expiry problems. Redis is an open-source in-memory data-structure store: strings, hashes, lists, sets and more, with snapshots or an append-only log for persistence; a single node handles over 100,000 requests a second with sub-millisecond responses.'),
  lang: 'Redis', code: `SET book:9787111544937 '{"title":"CSAPP","stock":2}' EX 300
GET book:9787111544937
DEL book:9787111544937`,
  vendors: V('Redis, Valkey, Memcached, KeyDB, Dragonfly', `Amazon ElastiCache, Google Memorystore, Azure Cache for Redis, Redis Cloud, Upstash, ${ALI} Tair`) });
N('s33', 'redis', 30, 170, 300, 187, { icon: 'bolt', no: '3.3', at: '12:57', title: t('旁路缓存', 'Cache-aside'),
  desc: t('读：先查缓存，没有再查数据库，并把结果放回缓存。写：先更新数据库，再把缓存里的旧值删掉，下一次读自然会回填新值。', 'Read: check the cache first; on a miss, query the database and put the result back. Write: update the database, then delete the stale cache entry so the next read refills it.'),
  steps: [t('先查 Redis：没有（未命中）', 'Check Redis first: nothing there (a miss)'), t('回源：去 MySQL 查', 'Fall back to MySQL'), t('把结果写回 Redis，并设一个过期时间', 'Write the result back to Redis with an expiry'), t('下一次同样的查询：直接命中，不碰数据库', 'The same query next time: a hit, the database is not touched'), t('还书后库存变了：先更新数据库，再删缓存', 'After a return the stock changes: update the database, then delete the cache entry')],
  note: t('这个策略还要考虑并发回填、删除失败和重试。', 'This strategy still has to deal with concurrent refills, failed deletes and retries.'),
  lang: 'Python', code: `def get_book(isbn):
    key = "book:" + isbn
    book = redis.get(key)
    if book is None:                        # ${t('未命中', 'miss')}
        book = db.query("SELECT * FROM book WHERE isbn = %s", isbn)
        redis.set(key, book, ex=300)        # ${t('回填，带过期时间', 'refill with a TTL')}
    return book

def update_stock(isbn, stock):
    db.execute("UPDATE book SET stock = %s WHERE isbn = %s", stock, isbn)
    redis.delete("book:" + isbn)            # ${t('再删缓存', 'then invalidate')}` });
N('s34', 'redis', 350, 170, 300, 187, { icon: 'warn', no: '3.4', at: '13:37', title: t('击穿、穿透与雪崩', 'Breakdown, penetration, avalanche'),
  desc: t('缓存失效的几种典型事故，共同点是请求越过缓存一起压到数据库上。击穿：一个热点键过期。穿透：查的东西根本不存在。雪崩：一大批键同时过期，或者缓存服务整个不可用。对策除了互斥锁、缓存空值、过期时间加抖动，还有：极热的数据由后台异步刷新、前面加布隆过滤器拦掉不存在的编号、多级缓存，以及用限流和熔断保护数据库。', 'Three classic cache failures, all ending with requests bypassing the cache and landing on the database together. Breakdown: one hot key expires. Penetration: the thing being looked up does not exist. Avalanche: many keys expire at the same moment, or the cache service itself becomes unavailable. Beyond a mutex, caching misses and jittered TTLs, the remedies include refreshing very hot keys in the background, a Bloom filter in front to reject ids that cannot exist, multi-level caches, and rate limiting plus circuit breaking to protect the database.'),
  steps: [t('击穿：热点键刚好过期，大量请求同时回源 → 加互斥锁，只放一个去查库', 'Breakdown: a hot key expires and many requests fall through together → a mutex lets only one rebuild it'), t('穿透：查一本不存在的书，缓存永远不中 → 把“不存在”也缓存起来', 'Penetration: looking up a book that does not exist always misses → cache the “not found” too'), t('雪崩：一大批键同一时刻过期 → 给过期时间加随机抖动', 'Avalanche: many keys expire at the same instant → add random jitter to expiry times'), t('整个 Redis 挂了：所有请求直达数据库 → 入口限流保住数据库，同时切换到备用缓存节点', 'Redis itself goes down: every request lands on the database → rate-limit at the door to protect it while failing over to a standby cache node')],
  lang: 'Python', code: `ttl = 300 + random.randint(0, 60)                 # ${t('雪崩：错开过期时间', 'avalanche: spread expiries')}
redis.set(key, value or "NULL", ex=ttl)           # ${t('穿透：空结果也缓存', 'penetration: cache misses too')}
if redis.set("lock:" + key, 1, nx=True, ex=5):    # ${t('击穿：只让一个人重建', 'breakdown: one rebuilder')}
    rebuild(key)`,
  vendors: V('Redisson, Caffeine, Guava BloomFilter, RedisBloom', '') });
N('s36', 'redis', 670, 170, 300, 187, { icon: 'key', no: '3.6', at: '16:34', title: t('共享会话', 'Shared sessions'),
  desc: t('登录状态如果存在某一台实例的内存里，下一次请求被分到另一台就“没登录”了。把会话放到所有实例都能访问的 Redis 里，实例本身就变成无状态的，可以随便加减。', 'If login state lives in one instance\'s memory, the next request landing on another instance is “not logged in”. Put sessions in Redis where every instance can reach them and the instances themselves become stateless, free to add or remove.'),
  steps: [t('登录请求落到实例 A：会话存在 A 自己的内存里', 'Login lands on instance A: the session is stored in A\'s own memory'), t('下一次请求被分到实例 B：B 不认识这个 SESSIONID，要求重新登录', 'The next request goes to instance B: B does not know this SESSIONID and asks you to log in again'), t('把会话放进 Redis：哪台实例收到请求都查得到', 'Put the session in Redis: whichever instance gets the request can look it up')],
  lang: 'YAML · Spring Session', code: `spring:
  session: { store-type: redis, timeout: 30m }
  data: { redis: { host: redis.internal, port: 6379 } }
# ${t('任何实例都能从 Redis 里取出 SESSIONID=abc', 'any instance can now load SESSIONID=abc from Redis')}`,
  vendors: V('Spring Session, connect-redis, django-redis, JWT', '') });

// ================= 消息队列 =================
N('s91', 'mq', 30, 190, 300, 187, { icon: 'queue', no: '9.1', at: '40:40', title: t('借书之后的异步工作', 'Async work after a borrow'),
  desc: t('通知、统计、推荐都不该让学生等。放进本进程的后台线程最省事，但进程一重启任务就丢了；写进消息队列，事件被持久保存，谁来消费、什么时候消费都可以。进程内异步其实有三个问题：任务会丢；尖峰时瞬间起几十万个协程，照样打垮下游、吃光自己的内存；要调谁写死在代码里，加一个积分服务就得改借阅服务。消息队列把这三件事一并解决。', 'The student should not wait for notifications, statistics and recommendations. A background thread in the same process is easiest, but a restart loses the tasks. Written to a message queue, the event is stored durably and can be consumed by anyone, at any time. In-process async really has three problems: tasks get lost; a spike spawns hundreds of thousands of coroutines that still flatten downstream services and exhaust memory; and the list of callees is hard-coded, so adding a points service means changing the borrow service. A message queue solves all three.'),
  steps: [t('同步：借书成功后还要等通知、统计、推荐做完，约 1280 ms 才返回', 'Synchronous: after the borrow, wait for notify, stats and recommend; about 1280 ms before replying'), t('进程内异步：先返回，后台慢慢做——进程一重启，没做完的任务就丢了', 'In-process async: reply first, work in the background; a restart loses unfinished tasks'), t('消息队列：写一条“借阅成功”事件就返回，事件落盘保存', 'Message queue: write one “loan created” event and reply; the event is stored on disk'), t('通知、统计、推荐各自取走事件处理，互不拖累', 'Notify, stats and recommend each take the event and process it, without slowing one another')],
  note: t('还有一个故障窗口在“借阅记录已提交”和“消息已发出”之间。事务发件箱把业务更新和待发事件写进同一个事务，再由独立进程转发；下游仍然要幂等。', 'One failure window remains between “loan committed” and “message sent”. A transactional outbox writes the business update and the pending event in one transaction and a separate process forwards it; consumers still need to be idempotent.'),
  lang: 'Python', code: `def borrow(user, isbn):
    loan = save_loan(user, isbn)           # ${t('学生只等这一步', 'the only thing the student waits for')}
    mq.publish("loan.created", loan)       # ${t('通知 / 统计 / 推荐稍后发生', 'notify / stats / recommend happen later')}
    return loan` });
N('s92', 'mq', 350, 190, 300, 187, { icon: 'chart', no: '9.2', at: '42:08', title: t('削峰与独立订阅', 'Peak shaving & independent subscribers'),
  desc: t('流量尖峰来的时候，队列先把事件收下来堆着，消费者按自己能承受的速度慢慢消化——这叫削峰填谷。同一份事件还可以被多个服务各读各的，新增一个订阅者不用改生产者——这叫解耦。', 'When a spike arrives, the queue takes the events in and lets them pile up while consumers work through them at a rate they can sustain: peak shaving. The same events can be read independently by several services, and adding a subscriber needs no change to the producer: decoupling.'),
  steps: [t('选课日的尖峰：每秒涌入的事件远超消费者的处理能力', 'A registration-day spike: events arrive far faster than consumers can process'), t('队列先收下来，积压越堆越高', 'The queue absorbs them and the backlog grows'), t('尖峰过后，消费者按自己的速度把积压消化掉', 'After the spike, consumers drain the backlog at their own pace'), t('同一份事件日志：通知、统计、推荐各有各的读取位置', 'One event log: notify, stats and recommend each keep their own read position')],
  note: t('积压不是无限的：受容量和保留期限制，需要监控积压了多久、消费得有多快。', 'A backlog is not unlimited: capacity and retention bound it, so monitor how old it is and how fast it drains.'),
  lang: 'Python · Kafka', code: `# ${t('三个消费组读同一份日志，各走各的进度', 'three consumer groups read the same log at their own pace')}
KafkaConsumer("loan.created", group_id="notice")
KafkaConsumer("loan.created", group_id="stats")
KafkaConsumer("loan.created", group_id="recommend")` });
N('s93', 'mq', 670, 190, 300, 187, { icon: 'copy', no: '9.3', at: '43:22', title: t('重投与去重', 'Redelivery & deduplication'),
  desc: t('队列只有收到消费者的“确认”才认为消息处理完了。确认在路上丢了，队列就会再投一次——宁可重复，不能丢（“至少投递一次”；想做到恰好一次代价极高）。所以消费者要记住处理过哪些消息，重复的直接跳过：同一个操作执行一次和执行多次结果一样，这叫幂等。', 'The queue considers a message done only when it receives the consumer\'s acknowledgement. If the ack is lost on the way, the queue delivers again: duplicates are better than loss (at-least-once; exactly-once is extremely costly). So consumers must remember what they have processed and skip repeats: doing an operation once or many times gives the same result, which is called idempotency.'),
  steps: [t('通知服务处理完消息 #42，学生收到一条提醒', 'The notification service processes message #42 and the student gets one reminder'), t('它发给队列的“确认”在路上丢了', 'Its acknowledgement to the queue is lost on the way'), t('队列没等到确认，把 #42 再投一次（至少一次投递）', 'No ack arrives, so the queue delivers #42 again (at-least-once delivery)'), t('消费者查去重记录：#42 处理过了，跳过——学生仍然只收到一条', 'The consumer checks its dedup record: #42 is done, skip. The student still has exactly one reminder')],
  note: t('如果真正的副作用发生在外部（短信、推送），只靠自己存一个去重标记仍有故障窗口：要把同一个幂等键传给通知渠道。', 'When the real side effect happens outside (SMS, push), a local dedup marker still leaves a failure window: pass the same idempotency key on to the notification channel.'),
  lang: 'Python', code: `def handle(msg):
    if not redis.set("done:" + msg.id, 1, nx=True, ex=86400):
        return                       # ${t('处理过了：跳过', 'seen before: skip')}
    send_reminder(msg.user)` });

// ================= 可观测性 =================
N('s101', 'obs', 40, 100, 440, 275, { icon: 'chart', no: '10.1', at: '44:44', title: t('指标与告警', 'Metrics & alerts'),
  desc: t('指标是随时间变化的数字：错误率、P99 时延、扣库存失败次数。告警规则除了阈值还要有“持续多久”，否则每一次抖动都会把值班的人叫醒。', 'Metrics are numbers over time: error rate, P99 latency, failed stock deductions. An alert rule needs a duration as well as a threshold, otherwise every blip wakes whoever is on call.'),
  steps: [t('错误率抖了一下超过阈值，但没持续满 2 分钟：不告警', 'The error rate blips over the threshold but not for a full 2 minutes: no alert'), t('这一次超过阈值并持续满 2 分钟：触发告警，通知值班', 'This time it stays over the threshold for 2 minutes: the alert fires and pages on-call'), t('指标只说明“出事了”。原因要到链路和日志里去找', 'Metrics only say something is wrong. The cause is in the traces and logs'), t('业务代码在关键分支自己上报计数；告警发给当天轮值的人——这套轮流值班的制度叫 oncall', 'Business code reports its own counters at key branches; the alert goes to whoever is on duty that day, a rota known as on-call')],
  note: t('除了框架自动上报的请求量、延迟、错误率，业务代码也可以自己计数，比如“扣库存失败次数”。P99 时延的意思是：99% 的请求不超过这个值。原片示意的规则是错误率高于 1% 并持续两分钟。', 'Beyond the request count, latency and error rate a framework reports by itself, business code can count its own events, such as failed stock deductions. P99 latency means 99% of requests are no slower than that value. The rule in the video is: error rate above 1% for two minutes.'),
  lang: 'YAML · Prometheus', code: `- alert: BorrowErrorRateHigh
  expr: |
    sum(rate(http_requests_total{service="borrow",code=~"5.."}[1m]))
      / sum(rate(http_requests_total{service="borrow"}[1m])) > 0.01
  for: 2m
  labels: { severity: page }`,
  vendors: V('Prometheus, Grafana, Alertmanager, VictoriaMetrics, Thanos, Zabbix', `Datadog, New Relic, Grafana Cloud, PagerDuty, Amazon CloudWatch, ${ALI} ARMS`) });
N('s102', 'obs', 520, 100, 440, 275, { icon: 'trace', no: '10.2', at: '46:08', title: t('一次请求的链路', 'Tracing one request'),
  desc: t('一次借书会经过好几个服务。网关给它生成一个 Trace ID，之后每次调用都带着它；每个服务记下自己那一段的起止时间。把这些片段排到同一条时间轴上，慢在哪一跳一目了然，再拿这个 ID 去搜日志。', 'One borrow passes through several services. The gateway gives it a Trace ID that travels with every call, and each service records the start and end of its own part. Lay those spans on one time axis and the slow hop is obvious; then search the logs with the same ID.'),
  steps: [t('网关给请求生成一个 Trace ID，之后每一次调用都带着它', 'The gateway creates a Trace ID and every later call carries it'), t('每个服务记录自己这一段的起止时间', 'Each service records the start and end of its own span'), t('排到同一条时间轴上：馆藏那一段花了 1003 ms', 'On one time axis: the catalog span took 1003 ms'), t('拿同一个 Trace ID 去搜日志：扣库存超时', 'Search the logs with the same Trace ID: stock deduction timed out')],
  note: t('异步消息也要带上同一个 Trace ID，队列和通知那两段才接得上。', 'Asynchronous messages must carry the same Trace ID too, or the queue and notification spans cannot be joined.'),
  lang: 'Python · OpenTelemetry', code: `with tracer.start_as_current_span("deductStock") as span:
    span.set_attribute("isbn", isbn)
    catalog.deduct_stock(isbn, 1)      # ${t('Trace ID 随请求头传给下游', 'the trace id travels in the request headers')}`,
  vendors: V('OpenTelemetry, Jaeger, Zipkin, Grafana Tempo, Apache SkyWalking', 'Datadog APM, Honeycomb, New Relic, AWS X-Ray, Dynatrace') });
N('logs', 'obs', 330, 400, 340, 212, { icon: 'logs', at: '45:30', title: t('集中日志', 'Centralised logs'),
  steps: [t('几十台机器各写各的日志文件：出了事要一台台登上去翻', 'Dozens of machines each write their own log files: when something breaks you log in to them one by one'), t('每台机器上的采集组件把日志实时送到同一个地方', 'A collector on every machine ships its logs to one place in real time'), t('在一个搜索框里查：service:borrow-service and level:ERROR', 'Search from one box: service:borrow-service and level:ERROR'), t('每条日志带着 Trace ID 和当时的上下文：扣减库存失败，Read timed out', 'Each line carries the Trace ID and the context of the moment: deduct stock failed, Read timed out')],
  desc: t('每台机器的日志都汇到一处，可以按时间、服务、Trace ID 搜索。日志提供的是报错那一刻的上下文。容器随时会被销毁重建，所以日志不能留在容器本地的硬盘里。', 'Logs from every machine are shipped to one place and searched by time, service or Trace ID. They give the context at the moment of the error. Containers are destroyed and recreated at any time, so logs cannot stay on a container\'s local disk.'),
  lang: 'JSON', code: `{"ts":"2026-03-02T09:14:07Z","level":"ERROR","service":"catalog",
 "trace_id":"4bf92f3577b34da6a3ce929d0e0e4736",
 "msg":"deductStock timeout","isbn":"9787111544937","cost_ms":1003}`,
  vendors: V('Elasticsearch + Logstash + Kibana, Grafana Loki, Fluent Bit, ClickHouse, Vector', `Splunk, Datadog Logs, Elastic Cloud, Amazon CloudWatch Logs, ${ALI} SLS`) });

// ================= 开发与发布 =================
N('git', 'dev', 24, 110, 176, 110, { icon: 'branch', ch: 1, at: '01:10', title: t('Git 版本控制', 'Git version control'),
  desc: t('给代码拍快照、留历史、开分支。三个人各改各的，最后还能说清每一行是谁、在什么时候、为什么改的。', 'Snapshots, history and branches for code. Three people can each change their own part and you can still say who changed every line, when, and why.'),
  lang: 'Shell', code: `git switch -c feature/borrow
git add . && git commit -m "add borrow endpoint"
git push -u origin feature/borrow
git switch main && git pull
git merge feature/borrow          # ${t('或者：git rebase main', 'or: git rebase main')}`,
  vendors: V('Git, Gitea, GitLab CE, Gerrit', 'GitHub, GitLab, Bitbucket, Gitee, Azure Repos') });
N('s11', 'git', 55, 82, 420, 262, { icon: 'zip', no: '1.1', at: '01:22', title: t('从压缩包到远程仓库', 'From zip files to a remote'),
  desc: t('在群里互传“最终版.zip”，文件名说不清谁改了什么、谁覆盖了谁。commit 给当前状态拍一张带说明的快照；push 和 pull 让三个人拥有同一段历史。', 'Passing “final.zip” around a group chat, file names cannot say who changed what or who overwrote whom. A commit is a snapshot with a message; push and pull give all three people the same history.'),
  steps: [t('群里传压缩包：“最终版”“最终版2”“最终版-真的”——谁覆盖了谁？', 'Zip files in the group chat: “final”, “final2”, “final-really”. Who overwrote whom?'), t('commit：给当前状态拍一张带说明的快照', 'commit: take a snapshot of the current state, with a message'), t('push：把快照送到远程仓库', 'push: send the snapshot to the remote repository'), t('队友 pull：两边拥有同一段历史', 'A teammate pulls: both sides now share the same history')],
  lang: 'Shell', code: `git init
git add . && git commit -m "borrow: first working version"
git remote add origin git@github.com:team/library.git
git push -u origin main
git clone git@github.com:team/library.git     # ${t('队友', 'teammate')}` });
N('s12', 'git', 525, 82, 420, 262, { icon: 'branch', no: '1.2', at: '03:17', title: t('分支', 'Branches'),
  desc: t('分支只是一个指向某次提交的指针，创建它几乎没有成本。借书功能要写好几天：在自己的分支上随便提交半成品，main 始终是那个能运行的版本。', 'A branch is just a pointer to a commit and costs almost nothing to create. The borrow feature takes days: commit half-finished work freely on your own branch while main stays the version that runs.'),
  steps: [t('main 指向大家认可的、能运行的版本', 'main points at the version everyone agrees works'), t('从同一个提交分出“借书”和“还书”两个分支', 'Two branches, borrow and return, start from the same commit'), t('借书分支提交了三次，main 没有动', 'The borrow branch gets three commits; main has not moved'), t('还书分支也各走各的：半成品互不干扰', 'The return branch moves on its own too: unfinished work never collides')],
  lang: 'Shell', code: `git switch -c feature/borrow     # ${t('从当前提交分出去', 'branch off the current commit')}
git commit -am "borrow: check stock"
git switch main                  # ${t('回到能运行的版本', 'back to the version that runs')}
git log --oneline --graph --all` });
N('s13', 'git', 55, 356, 420, 262, { icon: 'branch', no: '1.3', at: '04:14', title: t('三方合并与冲突', 'Three-way merge & conflicts'),
  desc: t('合并时 Git 对照三个版本：共同祖先和两个分支的末端。改的地方不重叠就自动合并；同一行有两种改法，就停下来让人决定——选多少天是业务问题，Git 回答不了。', 'To merge, Git compares three versions: the common ancestor and the tip of each branch. Non-overlapping changes merge automatically. When one line was changed two ways, it stops and asks a human: how many days is a business question Git cannot answer.'),
  steps: [t('两个分支都从 A 出发，都改了“最长借期”', 'Both branches start from A and both change the maximum loan period'), t('主线改成 14 天，借书分支改成 30 天', 'main sets it to 14 days, the borrow branch to 30'), t('合并时对照共同祖先：同一行两种改法 → 冲突，要人来选', 'Merging compares against the ancestor: one line, two changes → a conflict a human must resolve'), t('选定以后生成合并提交 M，它有两个父提交', 'Once resolved, merge commit M is created, with two parents')],
  note: t('这里画的是已经分叉的历史。如果目标分支没有新提交，Git 默认只做“快进”：直接把分支指针往前移，不产生合并提交。', 'This shows a history that has diverged. If the target branch has no new commits, Git fast-forwards by default: it just moves the branch pointer and creates no merge commit.'),
  lang: 'Shell', code: `$ git merge feature/borrow
CONFLICT (content): Merge conflict in LoanPolicy.java
<<<<<<< HEAD
int maxDays = 14;
=======
int maxDays = 30;
>>>>>>> feature/borrow
$ git add LoanPolicy.java && git commit` });
N('s14', 'git', 525, 356, 420, 262, { icon: 'branch', no: '1.4', at: '04:44', title: t('变基', 'Rebase'),
  desc: t('另一种整合方式：把自己分支上的提交“摘下来”，在最新的 main 后面按顺序重做一遍，历史变成一条直线。代价是这些提交都换了新的 ID——所以别对已经推送、别人在用的分支这么做。和 merge 对比：merge 保留分叉并多出一个合并提交，rebase 得到一条直线。', 'Another way to integrate: lift your branch\'s commits off and replay them in order on top of the latest main, giving a straight-line history. The price is that every one of them gets a new ID, so never do it to a branch that is pushed and used by others. Compared with merge: merge keeps the fork and adds a merge commit, while rebase yields a straight line.'),
  steps: [t('借书分支从 A 分出，之后 main 前进到了 C', 'The borrow branch started at A; main has since moved on to C'), t('rebase：先把 B1、B2、B3 “摘下来”', 'rebase: first lift B1, B2, B3 off'), t('在 C 后面按顺序重放，得到 B1′、B2′、B3′——全是新的提交 ID', 'Replay them in order after C to get B1′, B2′, B3′: all new commit IDs'), t('历史成了一条直线。已经推送的公共分支不要这样改写', 'History is now a straight line. Do not rewrite a shared branch that is already pushed')],
  note: t('实际团队里：平时在个人分支上用 rebase 保持历史整洁；遇到大型需求、两边冲突太多时，改用 merge，在最后一次性把冲突解决掉。', 'In practice: rebase on your own branch to keep history tidy; for a large feature with too many conflicts, switch to merge and resolve them once at the end.'),
  lang: 'Shell', code: `git switch feature/borrow
git rebase main
git push --force-with-lease      # ${t('只对自己的分支这么做', 'only ever on your own branch')}` });
N('s41', 'dev', 218, 110, 176, 110, { icon: 'check', ch: 4, no: '4.1', at: '18:02', title: t('评审与 CI', 'Review & CI'),
  desc: t('有人把写反的库存判断直接推上 main，全校借不了书。从此 main 受保护：改动必须走 Pull Request，由队友评审，并由 CI 自动编译、跑测试；有一项不过就合不进去。', 'Someone pushes an inverted stock check straight to main and the whole campus cannot borrow. From then on main is protected: changes go through a pull request, reviewed by a teammate and built and tested automatically by CI. One failing check blocks the merge.'),
  steps: [t('写反的库存判断被直接推到 main：全校借书失败', 'An inverted stock check is pushed straight to main: borrowing fails campus-wide'), t('保护分支：改动必须走 Pull Request', 'Protect the branch: changes must go through a pull request'), t('队友评审；CI（持续集成）自动编译、做静态检查、跑自动化测试', 'A teammate reviews; CI (continuous integration) builds, runs static analysis and the automated tests'), t('测试红了就合不进去；修好变绿，才能合并', 'Red tests block the merge; fix them, go green, then merge')],
  note: t('评审和 CI 各能发现不同的问题。测试要写出“库存为零时借阅必须失败”这样的业务断言；编译通过只说明代码能构建。Pull Request 是 GitHub 的叫法，GitLab 里叫 Merge Request。', 'Review and CI catch different problems. Tests must assert business rules such as “borrowing fails when stock is zero”; a successful build only proves the code compiles. GitHub calls it a pull request, GitLab a merge request.'),
  lang: 'YAML · GitHub Actions', code: `on: pull_request
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - run: ./mvnw -B verify`,
  vendors: V('Jenkins, GitLab CI, Drone, Tekton, Woodpecker, SonarQube', 'GitHub Actions, GitLab CI/CD, CircleCI, Buildkite, Azure Pipelines, Travis CI') });
N('s42', 'dev', 412, 110, 176, 110, { icon: 'layers', ch: 4, no: '4.2', at: '20:32', title: t('镜像与容器', 'Images & containers'),
  desc: t('“在我电脑上能跑”，是因为每台机器的 Java 版本和系统库都不一样。镜像把应用和它需要的一切打成一个包；容器是镜像跑起来的实例。和虚拟机相比，容器共用宿主机的内核，所以轻、启动快。', '“It works on my machine” happens because every machine has a different Java version and system libraries. An image packs the application with everything it needs; a container is a running instance of an image. Unlike virtual machines, containers share the host kernel, so they are light and start fast.'),
  steps: [t('“在我电脑上能跑”：每台机器的 Java 版本都不一样', '“Works on my machine”: every machine has a different Java version'), t('Dockerfile 一层层打成镜像：系统库 + JDK + 应用', 'A Dockerfile builds an image layer by layer: system libraries + JDK + app'), t('同一个镜像到处运行，每个运行中的实例就是一个容器；内核给每个容器隔离资源并设上限（--memory=4g）', 'The same image runs anywhere; each running instance is a container, isolated and capped by the kernel (--memory=4g)'), t('容器共用宿主机内核，秒级启动；虚拟机各带一套操作系统，更重更慢', 'Containers share the host kernel and start in about a second; each VM carries a whole OS, heavier and slower')],
  note: t('镜像只能固定打包进去的文件和依赖；环境变量、外部配置、宿主机内核仍然可能不同。容器和虚拟机也常常叠着用：云上通常是在虚拟机里跑容器。原片的比喻：虚拟机像独栋，容器像同一栋楼里的隔间。', 'An image pins only the files and dependencies packed into it; environment variables, external configuration and the host kernel can still differ. Containers and VMs are often stacked: in the cloud, containers usually run inside VMs. The video compares a VM to a detached house and a container to a room in a shared building.'),
  lang: 'Dockerfile', code: `FROM eclipse-temurin:17-jre
COPY target/library.jar /app/library.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/library.jar"]

# docker run -d -p 8080:8080 --memory=4g library-app:1.4.3`,
  vendors: V('Docker, Podman, containerd, BuildKit, Harbor, KVM, VMware', `Docker Hub, GitHub Container Registry, Amazon ECR, Google Artifact Registry, ${ALI} ACR`) });
N('s43', 'dev', 606, 110, 176, 110, { icon: 'belt', ch: 4, no: '4.3', at: '22:13', title: t('持续交付与持续部署', 'Delivery vs deployment'), sub: t('', 'Continuous delivery and continuous deployment'),
  desc: t('合并以后，流水线自动构建、自动部署到预发布环境验收。两个词只差最后一步：持续交付停在“随时可以发布”，等人点按钮；持续部署连这一下也自动化，检查通过就直接上生产。', 'After a merge, the pipeline builds and deploys to staging for acceptance automatically. The two terms differ only in the last step: continuous delivery stops at “ready to release” and waits for a person; continuous deployment automates that too and goes to production as soon as checks pass.'),
  steps: [t('合并以后，流水线自动构建出版本 1.4.4', 'After the merge the pipeline builds version 1.4.4 automatically'), t('先部署到预发布环境，联调验收', 'It is deployed to staging first, for integration and acceptance'), t('持续交付：停在人工审批的关口，等人点“发布”', 'Continuous delivery: it stops at a manual approval gate until someone presses Release'), t('持续部署：检查通过就自动上生产', 'Continuous deployment: once checks pass it goes to production by itself')],
  lang: 'YAML · GitLab CI', code: `deploy-prod:
  stage: deploy
  script: kubectl set image deploy/borrow borrow=registry.example.com/borrow:$TAG
  environment: production
  when: manual     # ${t('持续交付。删掉这一行就是持续部署', 'continuous delivery; remove this line for continuous deployment')}`,
  vendors: V('Argo CD, Flux, Jenkins, Spinnaker, Tekton', 'GitHub Actions, GitLab CI/CD, Harness, Octopus Deploy, AWS CodePipeline') });
N('s44', 'dev', 800, 110, 176, 110, { icon: 'flag', ch: 4, no: '4.4', at: '22:50', title: t('灰度与回滚', 'Canary & rollback'),
  desc: t('新版本先只换少数几台实例，接一小部分真实流量，盯着错误率和时延看一会儿。指标正常就一批批扩大；一旦变差，只需要把这几台换回去。', 'A new version first replaces only a few instances and takes a small share of real traffic while you watch error rate and latency. If the numbers hold, widen batch by batch; if they worsen, only those few instances need reverting.'),
  steps: [t('12 台实例都在跑 1.4.3', 'All 12 instances run 1.4.3'), t('先把 2 台换成 1.4.4，只接一小部分流量', 'Switch 2 of them to 1.4.4, taking a small share of traffic'), t('观察错误率和时延：新版出错，曲线抬头', 'Watch error rate and latency: the new version misbehaves and the curve climbs'), t('回滚这 2 台。如果指标平稳，就一批批扩大到全部', 'Roll those 2 back. Had the numbers stayed flat, you would widen batch by batch')],
  note: t('回滚镜像只是把程序换回旧版，不会撤销已经执行的数据库结构变更，也不会撤销已经写入的数据。', 'Rolling back the image only restores the old program. It does not undo schema changes that already ran or data that was already written.'),
  lang: 'YAML · Argo Rollouts', code: `strategy:
  canary:
    steps:
      - setWeight: 10
      - pause: { duration: 10m }    # ${t('观察错误率和时延', 'watch error rate and latency')}
      - setWeight: 50
      - pause: { duration: 10m }
# ${t('指标变差：', 'numbers look bad:')} kubectl argo rollouts abort borrow`,
  vendors: V('Argo Rollouts, Flagger, Istio, Nginx Ingress canary, Unleash', 'LaunchDarkly, Split, AWS CodeDeploy, Google Cloud Deploy') });

// ================= 连线 =================
const REQ = { tone: 'blue', back: 'green' };
E('client', 'entry', { ...REQ, agg: 1 });
E('entry', 'micro', { ...REQ, agg: 1 });
E('micro', 'data', { ...REQ, agg: 1 });
E('micro', 'mq', { tone: 'yellow', label: t('事件', 'events') });
E('dev', 'micro', { tone: 'purple', label: t('发布', 'release'), agg: 1 });
E('micro', 'obs', { tone: 'green', dash: 1, sa: 'b', sb: 'l', fa: .34, label: t('指标 · 日志 · 链路', 'telemetry') });
E('origin', 'client', { tone: 'orange', dash: 1, label: t('长大', 'grows into') });
// 入口内部
E('sclient', 'lb', REQ);
E('dns', 'lb', { tone: 'teal', dash: 1 });
E('lb', 'gw', REQ);
E('gw', 'borrow', { ...REQ, label: '/api/borrow' });
// 微服务内部
E('bcode', 's52', { tone: 'blue' }); E('s52', 's71', { tone: 'red' });
E('s71', 'fw', { tone: 'purple', dash: 1, sa: 'b', sb: 't', fb: .3, label: t('所以需要', 'hence') });
E('s7a', 's7b', { tone: 'purple' }); E('s7b', 's72', { tone: 'purple' }); E('s7c', 's7d', { tone: 'purple' }); E('s7d', 's73', { tone: 'purple' });
E('borrow', 'users', { ...REQ, label: 'RPC' }); E('borrow', 'catalog', { ...REQ, label: 'RPC' });
E('k8s', 'borrow', { tone: 'teal', dash: 1, label: t('调度 · 自愈', 'schedule · heal') });
E('borrow', 's63', { tone: 'teal', dash: 1, sa: 't', sb: 'b', fa: .25 });
E('users', 'mysql', REQ); E('catalog', 'mysql', REQ); E('catalog', 'redis', { tone: 'pink', back: 'green' });
E('search', 'redis', { tone: 'pink', back: 'green', sa: 'r', sb: 'l', fb: .25 });
E('borrow', 'mq', { tone: 'yellow', sa: 'b', sb: 't', label: 'loan.created' });
E('mq', 'notice', { tone: 'yellow', sa: 'r', sb: 'b' });
// 开发与发布
E('git', 's41', { tone: 'purple' }); E('s41', 's42', { tone: 'purple' }); E('s42', 's43', { tone: 'purple' }); E('s43', 's44', { tone: 'purple' });
E('s44', 'k8s', { tone: 'purple', dash: 1, sa: 'b', sb: 't', label: t('新版本', 'new version') });
// 可观测性
E('catalog', 's102', { tone: 'green', dash: 1 }); E('notice', 's101', { tone: 'green', dash: 1 });

// 原片结尾把三个日常问题指回全图上的位置
const ASK = [
  [t('新功能怎样安全地上线？', 'How do we ship a change safely?'), 's44'],
  [t('页面突然 502 了，往哪查？', 'The page says 502. Where do I look?'), 's24'],
  [t('面试官问：为什么要用消息队列？', 'Interview: why use a message queue?'), 's91'],
];
// 旧版（v1/）按“章/节”组织，可以播放原片。新版把第 7 章拆细了，这里对回旧版的节号
const V1 = { fw: '7/1', s71: '7/1', s7a: '7/1', s7b: '7/1', s72: '7/2', s7c: '7/2', s7d: '7/2', s73: '7/3' };
// 目录顺序 = 原片顺序
const TOUR = ['s00', 'sclient', 's11', 's12', 's13', 's14', 's21', 's22', 'dns', 'sproxy', 's23', 's24', 's31', 's32', 's33', 's34', 's35', 's36',
  's41', 's42', 's43', 's44', 's51', 'bcode', 's52', 's53', 's54', 'users', 'seat', 'search', 's61', 's62', 's63', 'fw', 's71', 's7a', 's7b', 's72', 's7c', 's7d', 's73', 's81', 's82', 's91', 's92', 's93', 'notice',
  's101', 'logs', 's102', 's111', 's112'];
