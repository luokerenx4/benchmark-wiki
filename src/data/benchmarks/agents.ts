import type { Benchmark } from "@/lib/types";

export const agents: Benchmark[] = [
  {
    slug: "api-bank",
    name: "API-Bank",
    shortName: "API-Bank",
    accession: "OB-2023-A01",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "agents",
    domains: ["工具调用", "对话", "API"],
    org: "Alibaba DAMO",
    authors: "Li, Zhao, Yu et al.",
    summary:
      "达摩院把“对话里用工具”写成可跑测试：几十个可执行 API、三百余段人工对话，按调用、检索、规划三档打分。它是 function calling 评测的史前标本，后面的 ToolBench 和 BFCL 都站在它后面。",
    origin: `2023 年春天，工具增强还停留在演示。模型会不会按文档调接口、会不会先检索再调用、会不会规划多步，这三件事当时几乎没人写成可复现的考卷。达摩院 ConvAI 组做了 API-Bank，把助手场景里的搜索、计算、日历一类 API 收进一个能真正执行的评测系统，对话由人工标注，而不是让模型自己编轨迹。

早期稿常被写成 53 个 API。论文修订后，评测系统是 73 个可执行接口、314 段对话、753 次调用；另外还做了更大的训练集，用来训他们的 Lynx。数字对不上时，先看你引的是哪一版摘要。

它的历史位置比分数更重要。Gorilla 同时在做“连上 ML API”，ToolBench 随后把规模拉到一万六千个 RapidAPI，BFCL 再把协议做成活榜。API-Bank 是这条线最早把对话式工具使用拆成三档能力的基准之一。

圈里现在很少单独报它的总分，但几乎所有工具评测综述都会先点它的名。它证明了一件事：工具使用不是一道生成题，是一套要和环境对打的协议。`,
    architecture: `评测是多轮对话。模型看到用户需求和可用工具说明，输出 API 调用，环境真的执行并把结果塞回对话。不是“生成一段看起来像 JSON 的文字就算过”，参数对不对、返回用不用得上，都会进下一轮。

三档任务对应三种能力。Level-1 把 API 文档直接给你，考会不会按格式调用；Level-2 要先从库里检索出该用哪几个接口；Level-3 才是规划多步，中间还得处理返回值。指标是正确调用率和最终任务成功。

对话是作者构造的助手场景，不是生产日志。API 覆盖搜索、天气、日历、记账一类日常功能，动作空间比后来的操作系统 agent 小一个数量级。

复现时要把“调用格式对了”和“任务做完了”分开报。只报一个准确率，看不出模型是卡在检索、规划，还是卡在参数填错。`,
    content: `评测集是 314 段对话，覆盖约 73 个可执行 API、七百余次调用。领域是个人助手，不是浏览器、也不是操作系统。每段对话里，用户目标相对清楚，工具返回也是结构化的。

训练集另有近两千段对话、两千多个 API、上千个领域，用来把 Alpaca 做成 Lynx。那部分是合成加构造，质量参差，不能当成评测集的放大版。

题面看起来朴素：查个天气、记笔账、改个日程。难的是多步依赖——上一步返回的 ID，下一步必须原样填进去，填错就全盘失败。

不要指望在这里看到 OAuth、分页、限流、鉴权失败重试。那些是后来 BFCL 可执行子集和真实客服基准才认真打的东西。`,
    format: "多轮工具对话",
    metrics: ["API 正确率", "任务成功"],
    size: "53 API / 314 对话",
    lineage: {
      parents: [],
      children: ["toolbench"],
      related: ["gorilla-apibench", "bfcl", "tau-bench"],
    },
    caveats: `API 数量和领域都窄。把它当成现代 function calling 的代表，是在用 2023 年春天的玩具盒衡量 2025 年的工具协议。

对话是作者写的，用户不会打岔、不会改主意、不会给出残缺信息。真实客服里最难的那截，这里基本不存在。

可执行环境是实验室实现，不是 RapidAPI 也不是公司内部网关。接口失效、鉴权、版本漂移这些生产问题，API-Bank 帮你屏蔽了。

报分时写清楚你跑的是哪一档。把 Level-1 的调用准确率和 Level-3 的任务成功加总，是最常见的偷懒。`,
    links: [
      { rel: "paper", label: "API-Bank 论文", href: "https://arxiv.org/abs/2304.08244" },
      { rel: "repo", label: "GitHub", href: "https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/api-bank" },
    ],
  },
  {
    slug: "gorilla-apibench",
    name: "Gorilla APIBench",
    shortName: "APIBench",
    accession: "OB-2023-A02",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "agents",
    domains: ["API 调用", "ML 库"],
    org: "UC Berkeley Sky Lab",
    authors: "Patil, Zhang, Wang, Gonzalez",
    summary:
      "伯克利 Gorilla 配套的 Torch / TensorFlow / Hugging Face API 调用评测，用 AST 匹配打分，并单独报幻觉率。它把“模型连工具”写成一条可发表的线，BFCL 就是同一组人把它做成活榜。",
    origin: `2023 年夏天，LLM 幻觉出一个不存在的 PyTorch 函数，是现场演示里的保留节目。伯克利 Sky Lab 的 Gorilla 论文想证明另一件事：检索增强能让模型准确调用海量 ML API，而不是靠把文档背进参数。

APIBench 从三个生态的官方文档构造调用题：Torch、TensorFlow、Hugging Face。题是“用哪条 API 完成这件事”，评测看生成的调用能不能在抽象语法树上对上，并单独统计调用了根本不存在的函数——也就是幻觉率。

它和 API-Bank 几乎同时出现，但问题不一样。API-Bank 考对话里用不用得上工具；APIBench 考你能不能在文档海里选对那一个函数。后来同一组人把单次 API 选择做成持续更新的 Berkeley Function Calling Leaderboard，APIBench 就成了那条活榜的直系祖先。

圈里现在提 Gorilla，多半已经在说 BFCL。但模型卡上如果还写着 APIBench 的 AST 准确率，你要问一句：这是 2023 年那 1600 条 ML API，还是后来的多语言多轮协议。`,
    architecture: `给定自然语言需求，模型生成对 torch / tensorflow / huggingface 的 API 调用。可以开检索，把文档片段塞进上下文，也可以闭卷硬生成。官方强调检索增强前后的对比，这才是 Gorilla 的卖点。

判分用 AST 匹配，而不是字符串全等。参数顺序、无关关键字的差异可以忽略，但等价却写法完全不同的调用仍可能被误杀。幻觉率另报：调用了文档里不存在的 API，就算幻觉。

这是单次生成，不是多轮 agent。没有环境返回、没有状态、没有“上一步的结果喂给下一步”。和 BFCL 后来的可执行子集、多轮、agentic 场景不是同一套协议。

观察空间是文档和自然语言，不是浏览器 DOM，也不是操作系统截图。把它和 WebArena 的成功率放在一张表里，是在比较两种完全不同的技能。`,
    content: `大约 1,645 条来自三家机器学习生态的 API。题面是“把这张图做成 tensor”“把这个模型从 Hub 拉下来”一类 ML 工程师日常，不是订机票，也不是改系统设置。

每条题绑定一个参考调用。领域锁死在 Python ML 库，Java、JavaScript、REST、并行调用这些后来 BFCL 才补上。

文档是当时抓的。库一升级，函数签名就会漂。离线 AST 匹配默认你还活在 2023 年的那一版文档里。

不要在这里找用户模拟器或政策文档。APIBench 问的是“选对函数”，不是“在客服约束下把订单改对”。`,
    format: "单次 API 调用生成",
    metrics: ["AST 准确率", "幻觉率"],
    size: "约 1,645 条",
    lineage: {
      parents: [],
      children: ["bfcl"],
      related: ["toolbench", "api-bank"],
    },
    caveats: `领域锁在 ML 库。一个模型在 APIBench 上很准，不代表它会调 Stripe 或内部 RPC。

AST 匹配对等价但写法不同的调用可能误杀，对“名字对了、语义错了”的调用也可能放过。它是可扩展的近似，不是形式化验证。

和 BFCL 的多语言、多轮、可执行协议不是一回事。把 APIBench 分数抄到 BFCL 栏，属于张冠李戴。

检索开或关必须写进论文。Gorilla 的主结论就是检索能压幻觉，闭卷分数不能拿来吹“原生工具能力”。`,
    links: [
      { rel: "paper", label: "Gorilla 论文", href: "https://arxiv.org/abs/2305.15334" },
      { rel: "homepage", label: "gorilla.cs.berkeley.edu", href: "https://gorilla.cs.berkeley.edu" },
      { rel: "repo", label: "GitHub", href: "https://github.com/ShishirPatil/gorilla" },
    ],
  },
  {
    slug: "mind2web",
    name: "Mind2Web",
    shortName: "Mind2Web",
    accession: "OB-2023-A03",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "agents",
    domains: ["网页操作", "真实网站"],
    org: "Ohio State University",
    authors: "Deng, Gu, Zheng et al.",
    summary:
      "两千余条在 137 个真实网站上采集的操作轨迹，是通用网页 agent 的数据层。离线快照能复现，活网站会改版；后来的 WebArena 就是因为受不了这种漂移，才改成自托管。",
    origin: `此前网页 agent 评测多半是 MiniWoB 玩具页：按钮方方正正，DOM 干干净净，跟真实网站半毛钱关系没有。OSU NLP 组跑到活网站上采集任务和专家轨迹，覆盖 31 个领域、137 个站点，要求模型在真实 DOM 上选元素、选动作。

Mind2Web 把“跨站泛化”写成一等指标：训练时见过的站、没见过的站、没见过的任务，要分开报。这在 2023 年是很少见的诚实。它是 WebArena、WebVoyager 之前的真实网页数据层，后面几乎所有网页 agent 论文都会先向它点头。

麻烦很快出现。网站改版、登录墙、反爬、A/B 测试，都会让去年录的快照对不上今年的活页面。后续的 Mind2Web-Live、Online-Mind2Web 都是在给这份快照做续命，有研究统计过：原集上线约一年后，上百条任务在对应活站上已经完全过期。

所以它的遗产是分裂的。作为离线模仿学习数据，它仍是最大的真实网站轨迹之一；作为“通用网页 agent 已经能在网上干活”的证据，它越来越需要加星号。`,
    architecture: `给定高层任务和网页快照（DOM、截图、有时还有 HAR 和完整交互轨迹），模型预测下一步动作：点谁、输入什么、选哪个下拉。评测可以离线——在录制快照上逐步对齐专家轨迹——也可以尝试在线重放。

指标含元素准确率、动作 F1、逐步成功和整任务成功。离线协议本质是模仿学习：你要跟专家点同一个元素。真实用户完全可能走另一条路到达同一结果，离线分会把这种殊途同归判成错。

观察可以是 HTML、DOM 树或截图。早期方法多用候选元素排序，后来视觉接地把点击坐标也带进来。动作空间是底层 Web 操作，不是“调用一个预订 API”。

跨站、跨任务、跨域三个拆分必须分开写。只报一个平均成功率，等于把最值钱的泛化信息扔掉。`,
    content: `2,350 条任务，137 个网站，31 个领域。动作是点击、输入、选择这类底层操作，每条任务配专家轨迹和当时的页面快照。站点从机票、房产到代码托管都有，比 MiniWoB 的玩具表单真实一个数量级。

快照是自包含的：MHTML、DOM、布局、截图、网络流量。离线评测依赖这些冻结的页面，而不是你现在打开的那个 URL。

任务是开放式的自然语言，比如“找一间下周五能住的宠物友好酒店”，不是“点击按钮 7”。专家轨迹只是一条可行路径，不是唯一正确策略。

在线子集后来被大幅裁过。日期敏感、登录墙、站已经消失的任务，会从活评测里消失，只活在离线快照里。`,
    format: "网页快照上的动作预测",
    metrics: ["Element acc.", "Action F1", "Step / Task success"],
    size: "2,350 任务 / 137 站",
    lineage: {
      parents: [],
      children: ["webarena", "webvoyager"],
      related: ["agentbench"],
    },
    caveats: `离线快照评测不等于能在活网站上跑通。模型在录制 DOM 上点对元素，到了今天的页面结构里可能根本找不到那个节点。这叫快照漂移，不是模型突然变笨。

网站改版会让在线评测失效。一年后有相当比例任务在原站上已经不可执行。写“我们在 Mind2Web 上 SOTA”时，必须声明离线还是在线、哪一年的快照。

轨迹是演示，不是唯一正确策略。逐步模仿会惩罚合理的绕路，也会奖励死记点击顺序。

不要和 WebArena 混报。Mind2Web 是真实站点的冷冻切片；WebArena 是自托管的开源替代品。一个不可复现但更像互联网，一个可复现但不是真的 Amazon。`,
    links: [
      { rel: "paper", label: "Mind2Web 论文", href: "https://arxiv.org/abs/2306.06070" },
      { rel: "homepage", label: "项目主页", href: "https://osu-nlp-group.github.io/Mind2Web/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/OSU-NLP-Group/Mind2Web" },
    ],
  },
  {
    slug: "webarena",
    name: "WebArena",
    shortName: "WebArena",
    accession: "OB-2023-A04",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["自主网页", "可复现环境"],
    org: "Carnegie Mellon University",
    authors: "Zhou, Xu et al.",
    summary:
      "CMU 把电商、论坛、GitLab、内容管理和地图做成可重置的自托管环境，812 条长程任务用最终状态判分。它是网页 agent 的事实标准沙箱；和在活互联网上跑的 WebVoyager 不是同一场考试。",
    origin: `Mind2Web 依赖活网站，复现和公平性都差：你的 agent 今天被 CAPTCHA 拦住，我的明天撞上改版，分数没法比。CMU 的做法是把真实站点的开源替代品 docker 化——购物用 Magento，论坛用 Postmill，代码用 GitLab，再配内容管理和 OpenStreetMap——做成可重置的 WebArena。

判分看最终状态，不看你有没有亦步亦趋模仿专家点击。路径可以不同，只要订单改对了、issue 建好了、帖子发出去了。这是网页 agent 从“模仿轨迹”走向“完成任务”的关键一步。

它很快成为事实标准环境。VisualWebArena 在同一套站点上改成视觉任务，BrowserGym、WorkArena 都接在这套自托管思路上。发布时 GPT-4 基线大约百分之十四，人类大约百分之七十八，这个缺口让它当了很久的进度条。

代价是：你必须把整站带回家。环境栈复杂、版本一漂分就变，而且它终究不是真的互联网——没有反爬、没有登录墙、没有运营人员半夜改布局。`,
    architecture: `Agent 看页面——文本 DOM 或截图——发点击、输入、导航等浏览器动作。任务成功看最终是否满足结构化条件：数据库里有没有那条记录、页面上有没有那个答案。允许不同路径。

主指标是成功率。环境必须自托管，评测又贵又脆。观察器选文本还是视觉、动作空间是元素 ID 还是坐标，都会让分数差出一大截。后来 BrowserGym 就是来统一这些接口的。

站点内容从真实对应物抽过，规模不是玩具：商品以万计，论坛帖子以十万计，GitLab 上有成百个仓库。任务是长程的，常常要跨站、记账、对照规则。

不要把 WebArena 理解成“上网”。它是沙箱里的上网。和 WebVoyager 那种直接开 Apple、Google Map 的活评测，协议、噪声和不可复现性都相反。`,
    content: `812 条任务，覆盖购物、GitLab 开发流、Reddit 式论坛、内容管理和地图查询。另有离线维基作为知识源。多跳、要记账、要对照规则，不是“打开首页点一下”。

任务分信息查找、站点导航、内容或配置修改。有的答案是短文本，有的要看后端状态。人类意图写成高层自然语言，故意不给逐步说明书。

四类站点加地图和维基，构成一个小而完整的网。agent 理论上可以在购物站下单，再去论坛发帖，再去 GitLab 开 issue，环境之间是通的。

题不是每年刷新的活数据。重置后世界回到同一份种子。这是复现的前提，也是它和真实互联网的根本差别。`,
    format: "自主网页 agent，状态判分",
    metrics: ["Success rate"],
    size: "812 任务",
    lineage: {
      parents: ["mind2web"],
      children: ["visualwebarena", "browsergym"],
      related: ["webvoyager", "workarena", "osworld"],
    },
    caveats: `自托管栈复杂，Docker 版本、浏览器后端、站点镜像不一致都会改分。两篇论文都报 WebArena，环境对不上就是假分差。

成功率对视觉或文本观察器极度敏感。只给 DOM 和只给截图，测的不是同一只 agent。必须把观察空间写进方法。

不要和在真实互联网上跑的 WebVoyager 混报。一个可重置、可复现、假站点；一个不可复现、真站点、明天页面改了昨天的 SOTA 就作废。

功能正确不等于体验正确。状态判分不管你点了多少次错、是不是把用户数据搞乱过又改回来。副作用要另测。`,
    links: [
      { rel: "paper", label: "WebArena 论文", href: "https://arxiv.org/abs/2307.13854" },
      { rel: "homepage", label: "webarena.dev", href: "https://webarena.dev" },
      { rel: "repo", label: "GitHub", href: "https://github.com/web-arena-x/webarena" },
    ],
  },
  {
    slug: "toolbench",
    name: "ToolBench",
    shortName: "ToolBench",
    accession: "OB-2023-A05",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["大规模 API", "工具规划"],
    org: "Tsinghua / OpenBMB",
    authors: "Qin et al.",
    summary:
      "清华从 RapidAPI 收了 16k+ 真实 REST 接口和十二万余条 ChatGPT 合成轨迹，用来训和评 ToolLLM。规模第一次上来，数据质量和接口时效性的问题也一起进场。",
    origin: `清华 OpenBMB 组认为 50 个玩具 API 不够看。他们从 RapidAPI 收了 16,464 个真实 REST 接口，用 ChatGPT 生成指令和多步解，再配检索器从工具库里选该调谁。ToolBench 和配套的 ToolLLM，把工具使用推到“先检索再规划”的规模。

这是 2023 年工具学习最响的一声。以前大家在几十个手写 API 上做 demo，这里突然有了十万级轨迹。论文的叙事是：模型可以像人一样，面对从没见过的接口文档，检索、规划、调用。

闲话也跟着来。轨迹是合成的，ChatGPT 自己的工具习惯会被写进“标准答案”；RapidAPI 会下架、会改签名、会要密钥；用 LLM 当判分器比较两条路径的 win rate，和真正执行成功根本不是一回事。

后来 BFCL、τ-bench、AppWorld 都在不同方向上修正它：有的改成真执行，有的改成带政策的多轮用户，有的改成可单元测试的仿真世界。ToolBench 的遗产是规模，也是“大规模合成工具数据”这件事的全部副作用。`,
    architecture: `流程是指令 → 检索相关 API → 多步调用。评测含单工具、多工具、类内泛化和类外泛化。类外才是硬的：工具没在训练里见过，全靠文档。

原协议常用 ChatGPT 当判分器，比较模型路径和参考路径谁更好，报 win rate；后来也有人改成执行成功与否的硬指标。两种数字不能兑。

检索器是系统的一部分。换一套嵌入、换一个 top-k，成功率会动。把 ToolBench 分数当成纯模型属性，等于把检索质量吞进模型卡。

动作是 REST 调用，不是浏览器点击。和 WebArena、OSWorld 测的技能重叠很少。它更接近 API-Bank 的放大版，加上一个必须先找工具的检索瓶颈。`,
    content: `16,464 个 REST API，约 12.6 万条指令–解决方案对。领域从天气、社交到数据查询，质量参差：有的文档完整，有的几乎是空壳。

轨迹由 ChatGPT 生成，带多步推理和工具选择。这让训练集很大，也让“标准解”带上了生成模型自己的偏见和幻觉。

评测按工具是否见过、是否需要多工具组合来拆。真正有区分度的是未见工具和多工具规划，单工具见过的题对后来的模型已经偏软。

接口是真的 RapidAPI，不是仿真。好处是真实，坏处是今天跑可能已经 404。复现实验常常要缓存响应，或者接受一部分任务直接不可执行。`,
    format: "大规模工具检索 + 多步调用",
    metrics: ["Pass rate", "Win rate（LLM 判分）"],
    size: "16k+ API / ~126k 轨迹",
    lineage: {
      parents: ["gorilla-apibench", "api-bank"],
      children: [],
      related: ["bfcl", "tau-bench", "appworld"],
    },
    caveats: `大量轨迹是合成的。模型在 ToolBench 上表现好，可能是在拟合 ChatGPT 的工具文风，而不是真的更会调接口。

RapidAPI 会失效。论文数字和你今天本地跑出来的可执行子集，对不上是常态，不是你实现错了。

LLM 判分的 win rate 与真实执行成功不是一回事。两条都能跑通的路径，裁判可能只喜欢更像参考答案的那条。

不要用它代表现代 function calling 协议。没有严格 schema、没有多轮用户、没有政策约束。那些是 BFCL 和 τ-bench 的主场。`,
    links: [
      { rel: "paper", label: "ToolLLM 论文", href: "https://arxiv.org/abs/2307.16789" },
      { rel: "repo", label: "GitHub", href: "https://github.com/OpenBMB/ToolBench" },
    ],
  },
  {
    slug: "agentbench",
    name: "AgentBench",
    shortName: "AgentBench",
    accession: "OB-2023-A06",
    year: 2023,
    status: "active",
    kind: "suite",
    family: "agents",
    domains: ["综合 agent", "多环境"],
    org: "THUDM / Tsinghua",
    authors: "Liu, Yu et al.",
    summary:
      "清华 GLM 组把操作系统、数据库、浏览器、游戏和家居等八个环境收成一张套件，用来画 LLM 作为 agent 的能力剖面。总分好看，分环境才有信息。",
    origin: `2023 年中，清华 GLM 组觉得当时的 agent 评测不是太窄就是不可复现：有人只考工具调用，有人只考网页，几乎没人把“模型当 agent”这件事摊开成一张能力剖面。AgentBench 把 OS 交互、数据库、知识图谱、网页购物、浏览、卡片游戏、横向思维谜题和家居仿真收成一套。

它是“综合 agent 榜”这一产品形态的早期样本。后来大家习惯在一张表上同时报 GAIA、WebArena、工具调用、OS 操作，这种胃口，AgentBench 先喂过一次。

八个环境的难度和质量并不齐。真正被反复引用的是操作系统和数据库那几栏；有的游戏和谜题更像是为了把套件做满。部署负担也不轻，等于同时维护八个小基准。

圈里对它的态度很实际：当套件看，不当总分看。谁要是只报一个 AgentBench 平均分，多半是在用容易的环境给难的环境打掩护。`,
    architecture: `八个独立环境，各自有动作空间和成功率定义。有的是 bash 交互，有的是 SQL，有的是网页，有的是文本游戏。总分是各环境归一化后的平均，这个平均本身信息量不大。

需要分别部署。数据库要起来，OS 环境要起来，浏览器要起来。评测负担接近同时跑八个小基准，版本和依赖很容易把分差制造出来。

交互都是多轮。模型发出动作，环境返回观察，直到成功、失败或步数用尽。这已经是 agent 循环，不是单次补全。

不要指望统一的动作接口。后来的 BrowserGym 只统一了网页这一支；AgentBench 的 OS 和 DB，和网页 agent 仍是不同的运行时。`,
    content: `从 bash 操作、SQL 查询到网页购物与 ALFWorld 式家居。知识图谱和横向思维谜题也在里面。技能跨度故意拉得很开，像一张体检表，不是一套同质题目。

规模按环境计，不是按“多少题”计。有的环境任务多，有的只有少量脚本化交互。把八栏加权平均，权重其实是人为的。

真正有区分度、后来还被人单独拿去引用的，是需要真实执行的 OS 和 DB。卡片游戏和谜题对当代模型的区分度下降得更快。

题面是英语指令加环境观察。它不测中文 agent，也不测桌面 GUI 截图——那是后来 OSWorld 的事。`,
    format: "多环境 agent 套件",
    metrics: ["各环境成功率", "平均分"],
    size: "8 个环境",
    lineage: {
      parents: [],
      children: [],
      related: ["gaia", "webarena", "toolbench", "osworld"],
    },
    caveats: `不要报一个 AgentBench 总分假装概括八种能力。平均分会把 OS 上的失败和谜题上的满分洗成一个“还行”。

部分环境已经过时。2023 年难的文本游戏，2025 年可能只是普通指令跟随。要用，就报分环境、报年份、报提交。

部署差异会制造假分差。八个环境有一个没按官方镜像起，整张表就脏了。

它不是 GAIA，也不是 OSWorld。前者是短答案助手题，后者是真桌面。AgentBench 是早期的综合体检，深度不如后来的专项。`,
    links: [
      { rel: "paper", label: "AgentBench 论文", href: "https://arxiv.org/abs/2308.03688" },
      { rel: "repo", label: "GitHub", href: "https://github.com/THUDM/AgentBench" },
      { rel: "homepage", label: "llmbench.ai/agent", href: "https://llmbench.ai/agent" },
    ],
  },
  {
    slug: "gaia",
    name: "GAIA",
    shortName: "GAIA",
    accession: "OB-2023-A07",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["通用助手", "工具", "多模态附件"],
    org: "Meta FAIR / Hugging Face",
    authors: "Mialon, Fourrier, Scialom et al.",
    summary:
      "四百余道对人类简单、对模型难的助手题，必须用搜索、代码和文件才能做。发布时人类 92%，带插件的 GPT-4 只有 15%，这组对比让它成为 agent 报告的常驻栏。",
    origin: `2023 年底，FAIR 和 Hugging Face 觉得“通用 AI 助手”这个词被用滥了。当时的基准要么是越来越难的专家考卷，要么是模型已经能刷穿的知识题。GAIA 走反路：问题对人类不费劲，但必须浏览、算一下、读附件，答案还短而唯一，方便自动判分。

发布时那组数字现在还在被反复引用：人类应答者 92%，配备插件的 GPT-4 只有 15%。Level 1 上 GPT-4 大约 30%，Level 3 是 0%。更扎心的是，论文里的插件还是研究者按题手工选的 oracle 配置，不是模型自己找工具。

哲学很明确：AGI 不该被定义成把人类也难倒，而该是人类觉得理所当然的事，系统也能稳健做完。这和“博士级 Google-proof 题”那条线正好相反，也因此成了 agent 产品评测最爱挂的牌子。

规模故意小。466 题，三档难度，测试集答案不公开，提交到 Hugging Face 榜。后来有 Gaia2，但大家口头说的 GAIA，默认还是这一版。`,
    architecture: `开放问答，允许任意工具。答案短，精确匹配或轻量规范化。分 Level 1 / 2 / 3：大致对应少步工具、多步编排、长程规划。主指标是准确率。

验证集约 166 题带答案，测试集约 300 题答案锁在榜上。你不能在本地对测试集“核对一下”。这保证了榜的控制，也让论文里的数字难以被第三方完全审计。

工具集不是基准的一部分。有人给浏览器加代码解释器加文件解析，有人只给搜索。分数强烈依赖你给的脚手架，不是纯模型属性。把 GAIA 写成“某模型 60 分”，不写 agent 框架，等于没写。

部分题带附件：表格、图像、音频。多模态不是装饰，是解题必要条件。纯文本 LLM 硬做，会在附件题上集体摔倒。`,
    content: `466 题。Level 1 约 146 题，少于五步、工具需求轻；Level 2 约 245 题，五到十步、要编排；Level 3 约 75 题，长程规划。这些数字是量级，不是每年不变的硬编码。

题面是真实世界风格的助手问题：查一个需要对照两个来源才能确定的数字、读一张表再算、听一段音频找个事实。对人类是几分钟的事，对模型是工具链。

答案设计成短而唯一，避免开放生成的裁判纠纷。代价是题型被锁在“查找并推导”，而不是开放写作或含糊的产品决策。

附件不是每题都有，但有附件的题不能当纯文本做。评测时必须把文件喂进去，否则你测的是拒答，不是助手。`,
    format: "短答案助手题，工具任意",
    metrics: ["Exact match accuracy"],
    size: "466 题，三档",
    lineage: {
      parents: [],
      children: [],
      related: ["agentbench", "webvoyager", "bfcl", "agieval", "browsecomp"],
    },
    caveats: `规模小。几百道题，随机波动和单题标错都会拉动总分。社区后来也讨论过约 5% 的题存在标准答案争议，作者承认但没有放出完整勘误集。

精确匹配对等价表述不友好。数字格式、单位、别名都可能造成假阴性。规范化规则必须和官方榜对齐。

分数强烈依赖工具集，不是纯模型属性。GPT-4 + 插件 15% 是发布时的基线，不是今天还该对标的天花板。现代 agent 框架已经把这个数字抬得很高，比较时要锁框架、锁工具、锁提交日期。

测试集不可本地核验。你看到的 SOTA 是提交到 Hugging Face 的数字。私有测试集能防刷题，也能让错误答案长期睡在标签里。`,
    links: [
      { rel: "paper", label: "GAIA 论文", href: "https://arxiv.org/abs/2311.12983" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/gaia-benchmark/GAIA" },
      { rel: "leaderboard", label: "GAIA 榜", href: "https://huggingface.co/spaces/gaia-benchmark/leaderboard" },
    ],
  },
  {
    slug: "visualwebarena",
    name: "VisualWebArena",
    shortName: "VisualWebArena",
    accession: "OB-2024-A08",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["视觉网页", "多模态 agent"],
    org: "Carnegie Mellon University",
    authors: "Koh et al.",
    summary:
      "WebArena 的视觉版：九百余条必须看图、认商品和界面的网页任务。纯文本 DOM agent 在这里会集体失败，因为它根本看不见图片里的东西。",
    origin: `WebArena 的文本 DOM 观察器有一个尴尬的盲区：图片里的商品、图标、布局，HTML 源码里往往只是一个 src。CMU 接着做 VisualWebArena，把任务改成视觉接地——在真实感站点里找相似商品、读截图、点图标。

它不是把 WebArena 的题配上截图那么简单。很多新任务在纯 HTML 文本里根本不可解：你必须看见那件红衣服、那个图标、那张缩略图。论文用这件事证明，纯文本网页 agent 的高分有一部分是因为观察器替它做了感知。

站点仍是自托管的视觉购物、分类广告和 Reddit 式社区，成功条件还是最终状态。它可以在 BrowserGym 里跑，于是“换个观察器分数翻倍”变成可测量的事实，而不只是嘴上说说。

圈里的读法很明确：你的 agent 吃 DOM 就报 WebArena，吃截图就报 VisualWebArena。把两个分数加总装成“网页能力”，是最常见的糊涂账。`,
    architecture: `观察是截图加可选 DOM，动作仍是浏览器事件：点哪里、输入什么。成功条件看最终状态，允许不同路径。主指标成功率。

视觉接地是额外的失败点。模型可能任务规划是对的，但点偏了三个像素，或者把两件相似商品认错。分辨率、是否给标注框、是否同时给 DOM，都会改分。

可在 BrowserGym 里作为插件任务跑。统一接口的好处是能控制变量：同一套动作空间，只换观察。坏处是框架版本本身也成了必须声明的超参。

不要把它理解成“更难的 WebArena”。有的题只是把信息从 DOM 挪到了像素里，难度结构变了，不是简单加难。`,
    content: `910 条任务。站点含视觉购物、分类广告和 Reddit 式社区，和 WebArena 共享自托管思路，但任务设计围绕必须看见的内容。

许多任务在纯 HTML 文本里不可解。缩略图、颜色、图标、布局关系，都不会用明文写在 DOM 里给你。这是它存在的理由。

题仍是长程网页操作，不是单张图的 VQA。你要在多个页面之间看图、比较、点击，把视觉理解嵌进动作循环。

自托管同样沉重。镜像、浏览器、视口大小，少改一个，截图就变，视觉 agent 的输入分布就变。`,
    format: "多模态网页 agent",
    metrics: ["Success rate"],
    size: "910 任务",
    lineage: {
      parents: ["webarena"],
      children: [],
      related: ["browsergym", "webvoyager"],
    },
    caveats: `分辨率、标注框、是否给 DOM 会改分。视觉 agent 的“公平对比”比文本更脆，因为输入是一张会随渲染变化的图。

自托管同样沉重。不要假设你拉起来的 VisualWebArena 和论文作者的像素级一致。

不要和 WebArena 文本分加总装成“网页能力”。一个测 DOM 规划，一个测视觉接地，技能只有部分重叠。

和 WebVoyager 也不是一回事。这里是沙箱里的视觉站，那里是活互联网上的截图浏览。不可复现性差了一个数量级。`,
    links: [
      { rel: "paper", label: "VisualWebArena 论文", href: "https://arxiv.org/abs/2401.13649" },
      { rel: "homepage", label: "项目主页", href: "https://jykoh.com/vwa" },
      { rel: "repo", label: "GitHub", href: "https://github.com/web-arena-x/visualwebarena" },
    ],
  },
  {
    slug: "webvoyager",
    name: "WebVoyager",
    shortName: "WebVoyager",
    accession: "OB-2024-A09",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["真实互联网", "多模态浏览"],
    org: "Microsoft / Westlake",
    authors: "He, Yao, Ma et al.",
    summary:
      "在十五个真实网站上的六百余条端到端浏览任务，用截图驱动多模态 agent。它更接近产品形态，也因此更不可复现：页面改了，分数就变。",
    origin: `WebArena 为了复现牺牲了真实互联网。WebVoyager 反过来：任务就跑在 Apple、GitHub、Google Map、Wikipedia 等活站点上，agent 看截图操作。微软和西湖大学想要的是“产品里那种上网”，不是沙箱里的 Magento。

643 条任务、15 个真实网站，覆盖购物、航班、学术搜索、百科。官方用 GPT-4V 当自动评委，对照参考答案或关键信息判成功。这套协议跑起来像真人在用浏览器，评起来则像一场每天都在改卷的考试。

它很快出现在各种网页 agent 发布会里，因为它好看：真网站、真截图、端到端。随后 Online-Mind2Web 等工作指出，活网上的成功率往往比沙箱叙事难看，而且有的活网任务其实能靠搜索走捷径。

和 WebArena 的关系是互补，不是替代。一个把环境冻住，一个把环境交给互联网。报哪个，取决于你想吹可复现还是想吹能上线。`,
    architecture: `多模态 agent 接收截图与任务，输出点击坐标或输入。没有稳定的元素 ID 可依赖，视觉接地是主路径。主指标任务成功。

官方自动评委是 GPT-4V，对照参考答案或页面关键信息。人工抽查用来校准。LLM 评委有偏：它可能被文风打动，也可能把部分成功判成全成功。严肃论文应当同时报自动和人工。

环境是活的。登录墙、地理、cookie、A/B 测试、ToS 反爬，全是噪声。同一条任务，今天和明天的页面可能不是同一个 DOM。

没有自托管重置。你无法保证两次实验看到同一张首页。这是协议的一部分，不是实现缺陷。`,
    content: `643 条任务，15 个真实网站。站点是常见消费级互联网：购物、旅行、地图、学术、百科、代码托管一类。任务写成用户口吻的高层目标。

每条任务有参考答案或成功要点，供评委对照。不是状态机里的数据库断言，而是“页面上是不是出现了该出现的信息”。

覆盖面比 WebArena 的四类开源站更像真上网，比 Mind2Web 的 137 站又窄。15 这个数字意味着过拟合到这 15 个站的风险真实存在。

题会过期。促销结束、导航改版、需要登录的内容墙出现，都会让原任务变得不可执行或意义改变。`,
    format: "真实网站上的多模态浏览",
    metrics: ["Success rate（LLM 评委 / 人工）"],
    size: "643 任务 / 15 站",
    lineage: {
      parents: ["mind2web", "webarena"],
      children: [],
      related: ["gaia", "visualwebarena"],
    },
    caveats: `活网站不可复现。昨天的 SOTA 今天可能因为页面改版而不可跑。任何不声明评测日期和站点状态的 WebVoyager 分数，都只能当轶事。

GPT-4V 评委有偏。自动成功率和人工成功率必须分开报，不能只把高的那个写进摘要。

对站点 ToS 与登录墙敏感。有的任务其实在踩网站的机器人条款。实验伦理和分数稳定性在这里缠在一起。

和 WebArena 的状态判分不可比。一个是沙箱最终状态，一个是活网 LLM 裁判。横比这两个成功率，没有方法论意义。`,
    links: [
      { rel: "paper", label: "WebVoyager 论文", href: "https://arxiv.org/abs/2401.13919" },
      { rel: "repo", label: "GitHub", href: "https://github.com/MinorJerry/WebVoyager" },
    ],
  },
  {
    slug: "bfcl",
    name: "Berkeley Function Calling Leaderboard",
    shortName: "BFCL",
    accession: "OB-2024-A10",
    year: 2024,
    status: "live",
    kind: "leaderboard",
    family: "agents",
    domains: ["function calling", "多轮工具", "AST 评测"],
    org: "UC Berkeley Sky Lab",
    authors: "Patil, Mao, Yan et al.",
    summary:
      "Gorilla 团队的持续 function calling 榜，从单次 AST 匹配做到多轮与 agent 场景。版本从 v1 滚到 v4，读数前必须先看版本；FC 模式和 prompt 模式也不能兑。",
    origin: `APIBench 太窄：三个 ML 库、一次调用、离线 AST。同一组人在 2024 年推出 Berkeley Function Calling Leaderboard，把评测扩成并行调用、多语言、可执行性、拒答，以及后来的多轮和 agentic 场景。它成为模型卡上工具调用栏的默认出处。

版本是第一公民。v1 是离线 AST，Python / Java / JavaScript，简单、多函数、并行、并行多函数，外加相关性检测；v2 引入企业与开源贡献的 live 函数，强调真实文档和污染；v3 加多轮、带状态的后端；v4 再加 web search、记忆管理和格式敏感性，并把总分权重改得更偏向 agent 场景。

活榜意味着数字会动。公式改过、题改过、模型下架过。看到“BFCL 90 分”而不写 v3 还是 v4、FC 还是 prompt，等于没看到分数。

它和 τ-bench 的分工大致是：BFCL 问 schema 和调用对不对，τ-bench 问对着用户和政策能不能把业务做完。两者经常被一起挂在 agent 报告里，测的不是同一块肌肉。`,
    architecture: `AST 匹配可扩展到海量函数；可执行子集真的打 API，比较返回。含 Python / Java / JavaScript、并行与多候选、相关性与无关性检测——该调用时调用，不该调用时闭嘴。

v3 的多轮带状态后端：漏参数、漏函数、长上下文，都要在对话里修。v4 的 agentic 域加入记忆后端和多跳搜索，总分权重也改了：单轮接近饱和后，整体准确率被改成更看好多步场景。

官方区分 FC 和 prompt 两种模式。原生 function calling 接口和把工具说明塞进文本再解析，分数不可比。同一模型的两个模式常常差出一大截。

榜是活的，代码和数据在 Gorilla 仓库。复现要锁 commit 或 bfcl-eval 的包版本。总体准确率是子类的未加权平均，子类定义随版本变。`,
    content: `专家编写与用户贡献的函数–提示对。规模从最初约两千条，扩到后续版本的多场景套件：离线、live、多轮、记忆、搜索。

v1 偏合成和文档构造；v2 live 用真实用户贡献的函数文档，故意打污染；v3 多轮是模拟后端上的连续调用；v4 则把工具使用放进更完整的 agent 回路。

语言不止 Python。Java 和 JavaScript 的签名习惯不同，REST 可执行子集又是另一套。只报 Python simple 的准确率，是在挑最熟的那一栏。

题会修。changelog 里经常出现某条 live 题的标准答案改了。锁版本不只是为了代码，也是为了标签。`,
    format: "function calling，AST + 可执行 + 多轮",
    metrics: ["AST acc.", "Executable acc.", "多轮成功"],
    size: "滚动；v1 约 2k 对",
    lineage: {
      parents: ["gorilla-apibench"],
      children: [],
      related: ["toolbench", "tau-bench", "gorilla-bfcl", "api-bank", "mcp-universe", "mcp-atlas"],
    },
    caveats: `FC 模式与 prompt 模式分数不可比。把原生工具调用的数字和文本拼 JSON 的数字放在同一列，是活榜上最常见的误读。

版本号是第一公民。v1 的 overall 和 v4 的 overall 权重不同、题不同、故事不同。跨版本连线画“工具能力提升”，必须先对齐子类。

AST 匹配仍会误伤等价调用。可执行子集更硬，但覆盖的函数更少，且依赖外部 API 是否还活着。

单轮已经接近饱和，v4 才把权重挪到 agentic。还在用 v1 simple Python 吹 SOTA 的人，测的是 2024 年初的题。`,
    links: [
      { rel: "leaderboard", label: "BFCL 榜", href: "https://gorilla.cs.berkeley.edu/leaderboard.html" },
      { rel: "paper", label: "BFCL 论文", href: "https://proceedings.mlr.press/v267/patil25a.html" },
      { rel: "repo", label: "GitHub", href: "https://github.com/ShishirPatil/gorilla" },
    ],
  },
  {
    slug: "workarena",
    name: "WorkArena",
    shortName: "WorkArena",
    accession: "OB-2024-A11",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["企业软件", "ServiceNow", "知识工作"],
    org: "ServiceNow Research",
    authors: "Drouin, Gasse et al.",
    summary:
      "在 ServiceNow 上做工单、目录、表单等知识工作，测网页 agent 能不能办公。它和 BrowserGym 是同一生态；++ 版再把组合规划加上去，不要和基础版混报。",
    origin: `ServiceNow 研究组指出一个很不客气的事实：公开网页任务不是企业白领的日常。买东西、刷论坛、看地图，跟在 ITSM 平台上点列表、填表、查知识库，不是同一种劳动。WorkArena 把真实的 ServiceNow 实例变成评测环境。

33 类知识工作任务，可参数化实例化出两万余条。场景是工单、目录、过滤器、表单，不是购物车。它把“网页 agent”从消费互联网拽进企业 SaaS。

同一组人随后做了 BrowserGym，把 WorkArena 和 WebArena、VisualWebArena、MiniWoB++ 收成同一套 Gym API。WorkArena++ 再把组合规划加上去，难度和基础版不是一档。

圈里把它当“办公 agent”的代表作。但绑定 ServiceNow UI 也是硬伤：换一套 Salesforce 或内部 OA，分数不会跟着走。`,
    architecture: `浏览器 agent 操作 ServiceNow 实例。任务可参数化实例化，避免死记某一张表的点击坐标。成功看最终表单或数据库状态，不是逐步模仿。

推荐经 BrowserGym / AgentLab 评测。观察可以是 DOM、截图、无障碍树。企业 UI 控件多、嵌套深，纯截图和纯 DOM 的失败模式不一样。

实例版本与权限配置会改分。管理员能看见的列表，普通角色看不见。评测账号的角色是协议的一部分。

++ 版把多个原子任务串成规划题。基础版会点过滤器，不等于 ++ 版会自己决定先筛哪一列再改哪张单。`,
    content: `33 类知识工作任务，可实例化出两万余条。场景是工单、目录、过滤器和表单，目标是让 agent 像客服或 IT 专员一样改企业系统状态。

参数化是关键设计。同一类任务每次抽不同的用户、优先级、字段值，减少“记住点第三个复选框”的作弊。

不是购物，不是 GitHub。菜单叫法、列表视图、知识库搜索，都是 ServiceNow 的交互语言。模型如果只在消费网站上训过，这里会像换了一套操作系统。

文本密度高。企业表格里的字段名、系统消息、策略提示，对 OCR 和长 DOM 都是压力。`,
    format: "企业 SaaS 上的网页 agent",
    metrics: ["Success rate"],
    size: "33 类，可实例化 20k+ 条",
    lineage: {
      parents: ["webarena"],
      children: ["browsergym"],
      related: ["the-agent-company"],
    },
    caveats: `绑定 ServiceNow UI，泛化到其他 SaaS 要另说。这是一个平台上的知识工作，不是“企业软件通用能力”。

实例版本与权限配置会改分。UI 一升级，选择器就废。复现必须钉镜像和角色。

WorkArena++ 是更难的后续，不要混报。基础版的高成功率不能平移到组合规划。

和企业里真的工单系统仍有差距：没有真正的责任事故、没有模棱两可的政策、没有会生气的同事。TheAgentCompany 后来才把 NPC 同事加进来。`,
    links: [
      { rel: "paper", label: "WorkArena 论文", href: "https://arxiv.org/abs/2403.07718" },
      { rel: "repo", label: "GitHub", href: "https://github.com/ServiceNow/WorkArena" },
    ],
  },
  {
    slug: "osworld",
    name: "OSWorld",
    shortName: "OSWorld",
    accession: "OB-2024-A12",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["计算机使用", "桌面 OS"],
    org: "HKU XLANG / Salesforce 等",
    authors: "Xie et al.",
    summary:
      "在真实桌面操作系统里完成开放任务：点 GUI、跑终端、改文件。原版 369 题；OSWorld-Verified 是修好脚本的同一套协议，OSWorld 2.0 则是另一代更长的工作流，三套分数不能兑。",
    origin: `网页 agent 进不了本地应用。HKU XLANG 用虚拟机跑 Ubuntu / Windows，任务覆盖办公套件、IDE、浏览器、文件和系统设置，用脚本检验最终状态。OSWorld 把评测对象从“一个网站”改成“一台电脑”。

原版 369 条任务（另有 Windows 分析用任务），人类大约百分之七十二，早期多模态模型大约百分之十二。它迅速成为计算机使用 agent 的默认尺子，Anthropic、OpenAI、Google 的 CUA 发布都会挂这一栏。Windows Agent Arena 与 AndroidWorld 是同一思想在不同 OS 上的展开。

名字后来裂成三个。OSWorld-Verified 是 2025 年中的原地修订：修社区报的错题、加固评测器、更新应用，协议还是那 369 题，八个 Google Drive 任务可以排除变成 361。OSWorld 2.0 是 2026 年的另一代基准：108 条长程工作流，人类中位大约 1.6 小时，和原版两三分钟的题不是同一场考试。

圈里最常见的糊涂账，就是把 Verified 上已经接近人类的分数，说成 2.0 也被打穿。没有。Verified 是短任务修干净了；2.0 是把工作流拉到小时级。`,
    architecture: `Agent 观察截图（加可选无障碍树），输出鼠标键盘或终端动作。任务带初始化快照与评测脚本。主指标成功率。跑起来又慢又贵，虚拟机噪声大。

原版 / Verified 看最终状态是否满足脚本。开放任务的脚本可能过严或过宽，这正是 Verified 要修的东西。2.0 改成大量检查点：平均每题二十多个加权检查点，另报二元完成和部分分，默认动作预算也大得多。

截图分辨率、动作空间实现、步数上限会主导结果。同样的模型，50 步和 500 步是两种 agent。论文必须写预算。

八个 Google Drive 任务常被排除。看到 361 和 369 两种 n，先问是不是这八题。`,
    content: `原版 369 条真实计算机任务，如改 PPT、整理文件、配置系统、在应用间拷数据。很多需要跨应用。另有 43 条 Windows 任务用于分析，主榜仍以 Ubuntu 环境为主。

任务短。原论文里人类中位大约两分钟，agent 大约几十步。这是“会不会用电脑”，还不是“会不会把一份下午的工作做完”。

2.0 的 108 条工作流是另一套题：专业与日常流程、真实输入文件、进行中可能插入的新消息、31 个自托管网站加更多桌面应用。不要把 2.0 的题数当成原版的子集。

评测脚本是内容的一部分。同一句“把表格按日期排序”，脚本检查的是文件内容还是界面上的显示，会改变什么叫成功。`,
    format: "桌面 OS 上的 GUI/终端 agent",
    metrics: ["Success rate"],
    size: "369 任务",
    lineage: {
      parents: [],
      children: ["windows-agent-arena", "osworld-verified", "osworld-2"],
      related: ["androidworld", "terminal-bench", "webarena", "xlang"],
    },
    caveats: `三套数字不能兑。OSWorld、OSWorld-Verified、OSWorld 2.0 是修脚本的原协议和另一代长程基准。把它们画在同一条“计算机使用进度”折线上，必须加断点。

虚拟机评测噪声大、耗时长。非官方复现和官方 AWS 评测通道的数字，差的不只是运气。

截图分辨率与动作空间实现会主导结果。开放任务的评测脚本可能过严或过宽——Verified 存在的理由就是这个。

不要和 WebArena 直接比成功率。一个是浏览器沙箱，一个是整台桌面。技能有交集，环境不是同一个。`,
    links: [
      { rel: "paper", label: "OSWorld 论文", href: "https://arxiv.org/abs/2404.07972" },
      { rel: "homepage", label: "os-world.github.io", href: "https://os-world.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/xlang-ai/OSWorld" },
    ],
  },
  {
    slug: "androidworld",
    name: "AndroidWorld",
    shortName: "AndroidWorld",
    accession: "OB-2024-A13",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["移动设备", "Android"],
    org: "Google DeepMind",
    authors: "Rawles et al.",
    summary:
      "在 Android 模拟器上动态实例化的一百余类任务，测手机 GUI agent。参数每次都不一样，减少死记点击坐标；和 OSWorld 形成桌面–移动对照。",
    origin: `DeepMind 已有 AndroidEnv、MiniWoB 的传统：在可控环境里让 agent 点 GUI。AndroidWorld 改用二十来个真实应用，任务从模板采样参数，每次实例化的闹钟时间、联系人、邮件主题都不同，减少“记住点那个像素”的作弊。

它把计算机使用评测接到手机侧。OSWorld 是桌面，AndroidWorld 是移动，Windows Agent Arena 是 Windows。三条线一起看，才能说“会用装置”，而不是“会用某一种窗口系统”。

应用是常见手机操作：系统设置、时钟、邮件、记事。不像游戏 agent 那样炫，但更接近“帮我把手机设好”这种助手场景。动态实例化是它相对早期手机 UI 基准最重要的方法论贡献。

模拟器不是真机。手势、性能、厂商皮肤、权限弹窗，实验室里都被熨平了。把它的成功率说成已经能替你玩手机，需要加很多星号。`,
    architecture: `Android 模拟器加无障碍树或截图。任务从模板采样参数。成功条件程序化检查应用状态，而不是看点击轨迹是否与演示重合。主指标成功率。

动态实例化把同一模板变成许多具体题。agent 必须读指令里的参数，而不能背模板的标准点击序列。这是对 Mind2Web 式专家轨迹模仿的显式拒绝。

观察空间可选无障碍树或像素。手机 UI 的可点击区域小、滚动多，纯视觉 grounding 的误差会被放大。动作含点击、滑动、输入、系统导航。

应用版本必须钉死。Play 商店一更新，控件层级就变。评测镜像是协议的一部分。`,
    content: `116 个任务模板，约 20 个应用，覆盖系统设置、时钟、邮件、记事等常见手机操作。每个模板可采样出不同参数，实际评测条数随采样策略变。

任务是短到中等的 GUI 操作，不是小时级工作流。把闹钟定到某个时间、把某封邮件标星、改一项设置，完成标准写在应用状态里。

真实应用意味着真实的 UI 复杂性：底部导航、权限对话框、键盘遮挡。但选中的应用仍是相对干净的官方应用，不是任意三方 APK。

没有桌面上的多窗口、文件系统和终端。手机 agent 的动作空间更窄，失败更多来自看错控件和滚不到目标。`,
    format: "Android GUI agent，动态实例化",
    metrics: ["Success rate"],
    size: "116 模板 / ~20 应用",
    lineage: {
      parents: [],
      children: [],
      related: ["osworld", "windows-agent-arena"],
    },
    caveats: `模拟器不等于真机。厂商 ROM、手势导航、刘海和折叠屏，这里都没有。实验室成功率会乐观。

应用版本必须钉死。动态实例化很好，但模板数量仍有限，模型仍可能过拟合这 20 个应用的信息架构。

不要和 OSWorld 的桌面成功率横比。触控和鼠标、单窗口和多窗口、移动应用和 LibreOffice，不是同一把尺子。

权限和登录类任务对评测账号敏感。官方镜像之外的复现，常常在这一步就分叉。`,
    links: [
      { rel: "paper", label: "AndroidWorld 论文", href: "https://arxiv.org/abs/2405.14573" },
      { rel: "repo", label: "GitHub", href: "https://github.com/google-research/android_world" },
    ],
  },
  {
    slug: "tau-bench",
    name: "τ-bench",
    shortName: "τ-bench",
    accession: "OB-2024-A14",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["用户模拟", "策略遵守", "工具"],
    org: "Sierra",
    authors: "Yao, Shinn, Razavi, Narasimhan",
    summary:
      "零售与航空客服：agent 必须对用户、遵守政策、调用工具，用 pass^k 测一致性。原仓库已声明任务过时，官方指向后续版本；还在报 2024 年那一版分数的人，要自己加星号。",
    origin: `Sierra 认为现有工具评测缺了三件事：多轮用户、领域政策、以及“再跑一次还会不会对”。τ-bench 用 LLM 模拟用户，agent 在零售或航空数据库上调用 API，成功不仅看结果还看是否违规。一次偶然做对不算数，k 次全对才算——这就是 pass^k。

pass^k 后来被广泛借用，因为它把“会做”和“稳定会做”拆开。发布时最好的 GPT-4o agent 平均成功率仍低于 50%，航空域更难看。客服这种看起来像聊天的任务，其实是在政策和数据库夹缝里走路。

原仓库现在开篇就警告：这里的航空和零售任务已经过时，请去后续版本。τ² 加了双控和电信，τ³ 又加了银行知识检索、语音和七十余处任务修复。2024 年那 165 题里，有一部分失败其实是基准自己写错了期望动作。

所以引用要分层。讲方法论、讲 pass^k、讲用户–工具–政策三角，用 τ-bench；报当代数字，跟官方走后续仓库，并锁任务修订版本。`,
    architecture: `三方：用户模拟器、策略文档、可执行工具。奖励看数据库最终状态与策略合规。主指标 pass^1 与 pass^k。用户模拟器本身是噪声源，必须固定模型与种子。

对话长。用户会改主意、信息会分多轮才给全，agent 还要在政策不允许时拒绝，而不是当好人把退款办了。成功是状态加合规，不是用户满意的主观分。

用户模拟器换模型，分数就变。用 GPT-4o 扮用户和用更弱模型扮用户，agent 面对的是不同的人。这是协议超参，必须写进论文。

没有浏览器。动作是领域 API，不是点 GUI。它测的是对话式工具 agent，不是计算机使用。`,
    content: `零售约 115 题、航空约 50 题，合计约 165。对话长，常要改订单、查政策、处理边界：超售、会员等级、时限、不能退的票。

每个域有自己的数据库、工具列表和写给 agent 的政策手册。政策不是装饰，是会让“用户想要的”和“公司允许的”冲突的地方。

用户指令是场景脚本，由 LLM 演出来。同一条任务每次说话不一样，这是特性。也因此，单次成功率的方差天然比静态题大。

原任务文件已被官方标记为过时。继续用 2024 仓库做主结果，需要在论文里显式声明你知道这件事。`,
    format: "多轮用户–工具–政策",
    metrics: ["pass^k"],
    size: "约 165 任务，两领域",
    lineage: {
      parents: ["toolbench", "gorilla-apibench"],
      children: ["tau2-bench"],
      related: ["bfcl", "api-bank", "the-agent-company"],
    },
    caveats: `原仓库任务已部分过时，官方指向后续版本。航空和零售的期望动作修过不止一次，旧分数和新分数不能直接比。

用户模拟器换模型，分数就变。不写用户模型的 τ-bench 结果，无法复现。

领域只有两个，规模小。它是客服 agent 的压力测试，不是通用工具能力榜。不要拿来替代 BFCL。

pass^k 随 k 上升掉得很快，这正是它要展示的不稳定性。只报 pass^1 等于把最有信息的那截砍掉。`,
    links: [
      { rel: "paper", label: "τ-bench 论文", href: "https://arxiv.org/abs/2406.12045" },
      { rel: "repo", label: "GitHub", href: "https://github.com/sierra-research/tau-bench" },
    ],
  },
  {
    slug: "appworld",
    name: "AppWorld",
    shortName: "AppWorld",
    accession: "OB-2024-A15",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["多应用", "交互式代码", "API"],
    org: "Stony Brook / AllenAI",
    authors: "Trivedi, Khot et al.",
    summary:
      "九个日常应用、四百余 API 的可控世界，任务要写交互式代码而不是单次调用。状态用单元测试判分，允许殊途同归，也惩罚误伤副作用。ACL 2024 Best Resource Paper。",
    origin: `作者认为 ToolBench 式“生成一串 API 调用”覆盖不了真实数字生活。你要在购物、邮件、日历、支付之间写控制流、循环和异常处理，而不是把 JSON 排成一行。AppWorld 自己实现了 9 个应用和约 100 个虚拟用户的数据，把日常数字生活收进一个可重置的世界。

任务用基于世界状态的单元测试判分：允许殊途同归，也惩罚误伤副作用——钱扣错、邮件发给错的人，都会挂。这比 LLM 裁判干净，也比逐步模仿专家轨迹宽松。

ACL 2024 Best Resource Paper 给了它名声。它证明工具评测可以既大规模仿真、又程序化打分，不必在活 API 的 404 和 LLM 裁判的偏好之间选边。

它不是浏览器 GUI agent。agent 写 Python 调本地 API，直到调用 complete_task。和 WebArena 点页面、和 OSWorld 点桌面，技能相邻但接口完全不同。`,
    architecture: `Agent 写 Python 调用本地 API，循环与环境交互，直到调用 complete_task。评测是基于世界状态的单元测试。分常规与挑战拆分。

交互式代码是一等公民。你需要循环、条件、错误处理，而不是单次 function call。这让它更接近“写一个小脚本把生活办了”，而不是填 schema。

单元测试看终态和关键副作用。路径自由，但乱扣钱、乱删数据会失败。测试覆盖本身成为评测质量的上限：没写到的副作用，模型可以悄悄做错。

环境完全本地、可重置。没有 RapidAPI 失效，没有活网站改版。这是它相对 ToolBench 和 WebVoyager 最大的工程优势。`,
    content: `9 个日常应用（购物、音乐、邮件等），457 个 API，约 100 个虚拟用户。基准含 750 条自然任务，分常规和更难的挑战集。

虚拟用户有自己的数据：订单、关系、日历。任务常常要跨应用：从邮件里读出订单号，再去购物应用退货，再发确认。单应用单次调用不够。

API 是仿真实现，语义接近真应用，但不是真 Amazon。文档完整、行为确定，这让评测公平，也让难度比生产 API 更干净。

题是自然语言目标，不是“请调用函数 f”。模型要自己决定写什么样的控制流。`,
    format: "交互式代码 + 多应用 API",
    metrics: ["Task success（状态测试）"],
    size: "750 任务 / 457 API / 9 应用",
    lineage: {
      parents: [],
      children: [],
      related: ["toolbench", "tau-bench", "the-agent-company"],
    },
    caveats: `应用是仿真不是真 Amazon。文档齐全、不 404、没有反爬，分数会偏乐观。

成功依赖测试覆盖。测试没断言到的字段，模型可以错而不被抓。挑战集和常规集必须分开报。

和浏览器 GUI agent 不是同一技能。会写 Python 调 API，不等于会在脏 DOM 上点按钮。

规模 750 看起来不少，但 9 个应用的信息架构仍可能被过拟合。类外泛化要另设计。`,
    links: [
      { rel: "paper", label: "AppWorld 论文", href: "https://arxiv.org/abs/2407.18901" },
      { rel: "homepage", label: "appworld.dev", href: "https://appworld.dev" },
      { rel: "repo", label: "GitHub", href: "https://github.com/stonybrooknlp/appworld" },
      { rel: "leaderboard", label: "榜单", href: "https://appworld.dev/leaderboard" },
    ],
  },
  {
    slug: "windows-agent-arena",
    name: "Windows Agent Arena",
    shortName: "WAA",
    accession: "OB-2024-A16",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["Windows", "桌面 GUI"],
    org: "Microsoft",
    authors: "Bonatti, Zhao et al.",
    summary:
      "在 Windows 11 上评测多模态 OS agent，一百五十余条真实桌面任务。它补上了全球主流桌面这一块，但和 OSWorld 的 Ubuntu 分数不能直接比。",
    origin: `OSWorld 以 Ubuntu 为主。微软用 Azure 上可扩展的 Windows 11 虚拟机做 Windows Agent Arena，任务覆盖 Office、系统设置、Edge、文件资源管理器等 Windows 特有工作流。理由很简单：世界上大多数人的电脑不是 Linux。

154 条任务，强调办公软件与系统配置，和 Linux 终端流不同。你在 Ubuntu 上会用 LibreOffice 和 bash 完成的事，在这里变成 Word、Excel 和设置面板。同一思想，另一套控件。

可在云上并行，是它相对本机虚拟机的工程优势。计算机使用评测最贵的是等 VM 启动和 GUI 超时，Azure 批量能把墙钟时间压下来。

许可和镜像分发比 Linux 麻烦。Office 版本绑定、Windows 评估镜像、激活，都会让复现比 OSWorld 的开源桌面更磕磕绊绊。`,
    architecture: `截图或无障碍树观察，鼠标键盘动作。任务带自动评测脚本。可在云上并行。主指标成功率。

Windows 的 UI Automation 树和 Linux 的 AT-SPI 不是同一套。依赖无障碍树的 agent，跨 OS 迁移成本很高；纯截图 agent 迁移更容易，但 grounding 更脆。

评测脚本检查最终文件或系统状态。Office 文档的内部 XML、注册表项、设置开关，都可能成为断言对象。脚本对版本敏感。

步数和分辨率同样是超参。Windows 的高 DPI、缩放、中文界面，都会改变截图分布。`,
    content: `154 条 Windows 11 任务，强调办公软件与系统配置。和 OSWorld Ubuntu 主榜的应用集合只有部分重叠，浏览器和文件管理是交集，Office 是 Windows 特有主场。

任务是真实桌面操作：改一份文档、调一项系统设置、在资源管理器里整理文件、用 Edge 完成网页侧步骤。许多仍是分钟级，不是 OSWorld 2.0 那种小时级工作流。

Office 版本绑定意味着题面依赖特定菜单和功能区。功能区一改，视觉 agent 的记忆就失效。

规模小于 OSWorld 的 369。区分度来自 Windows 特有交互，而不是题量。`,
    format: "Windows GUI agent",
    metrics: ["Success rate"],
    size: "154 任务",
    lineage: {
      parents: ["osworld"],
      children: [],
      related: ["androidworld"],
    },
    caveats: `Windows 许可与镜像分发比 Linux 麻烦。不是每篇论文都能合法地公开复现环境。看到无法复现的 WAA 分数，先问镜像怎么来的。

Office 版本绑定。不要和 OSWorld Ubuntu 分数直接比：应用集合、控件、快捷键都不一样。

云上并行带来的时间优势，也可能带来虚拟化噪声和显示驱动差异。声明 Azure 规格。

154 题按应用切更碎。某个 Office 子类上的高分，填不满整机使用能力。`,
    links: [
      { rel: "paper", label: "Windows Agent Arena 论文", href: "https://arxiv.org/abs/2409.08264" },
      { rel: "repo", label: "GitHub", href: "https://github.com/microsoft/WindowsAgentArena" },
    ],
  },
  {
    slug: "browsergym",
    name: "BrowserGym",
    shortName: "BrowserGym",
    accession: "OB-2024-A17",
    year: 2024,
    status: "active",
    kind: "harness",
    family: "agents",
    domains: ["网页 agent 框架", "统一环境"],
    org: "ServiceNow Research",
    authors: "de Chezelles, Gasse, Lacoste et al.",
    summary:
      "把 MiniWoB++、WebArena、VisualWebArena、WorkArena 收成同一套 Gym API。它不是新题，是运行时；换观察器分数翻倍，在这里变成可测量的事实。",
    origin: `网页 agent 论文各自为政，观察空间和动作空间都对不上：有人喂 DOM，有人喂截图，有人动作是元素 ID，有人是坐标。ServiceNow 做 BrowserGym，用统一接口跑多个基准，并配 AgentLab 做实验管理。

2024 年底的生态论文第一次在同一套框架里对比多模型、多基准，也让“换个观察器分数翻倍”变成可测量的事实，而不只是审稿意见里的猜测。WorkArena 和 WebArena 终于能在同一套动作原语下被并排阅读。

它是 harness，不是新考卷。题目仍是各基准自己的题，分数仍是各基准自己的成功率。框架负责公平对齐和实验记录。

Hugging Face 上有社区榜。和所有 harness 一样，框架版本、浏览器后端、动作空间实现必须写进论文，否则所谓公平对比只是换了一家公司的默认值。`,
    architecture: `Gymnasium 风格 API：观测可以是 DOM、截图、无障碍树，动作是点击、填表、代码执行等。任务作为插件接入。分数仍是各基准自己的成功率，框架负责把观察和动作对齐到同一套接口。

AgentLab 管实验：种子、轨迹、复现配置。网页 agent 最烦的不是模型，是“我上次到底开了哪个观察器”。把这些变成配置项，是工程贡献。

统一 API 不等于统一难度。MiniWoB++ 的玩具页和 WebArena 的长程任务，只是共享了 step() 的形状。平均分没有意义。

浏览器后端（Playwright 等）、视口、超时，都是隐式超参。框架升级可能默默改掉这些，分数跟着漂。`,
    content: `不是新题，是运行时。当前覆盖 MiniWoB++、WebArena、VisualWebArena、WorkArena 等网页基准，具体插件集合随版本增长。

内容来自被接入的基准。BrowserGym 自己不发明购物任务或工单任务，它发明的是怎么把这些任务的观察和动作说成同一种语言。

生态论文里最有用的表格，往往不是哪个模型第一，而是同一模型在 DOM / 截图 / axtree 之间差多少。那才是框架存在的理由。

不要在资料柜里把它和 WebArena 当成两个可加总的分数。一个是环境，一个是跑环境的插座。`,
    format: "统一网页 agent 环境",
    metrics: ["各基准自带"],
    lineage: {
      parents: ["webarena", "workarena"],
      children: [],
      related: ["visualwebarena", "inspect-ai"],
    },
    caveats: `统一 API 不等于统一难度。把多个网页基准的成功率平均成“BrowserGym 分”，是套件评测最老的错误。

框架版本、浏览器后端和动作空间实现必须写进论文。默默升级 Playwright，可能比换模型更能改分。

它不测桌面 OS，不测函数调用 schema。网页之外的 agent 能力，要去 OSWorld、BFCL、τ-bench。

社区榜的提交条件各异。引用时对齐任务子集、观察器和步数上限。`,
    links: [
      { rel: "paper", label: "BrowserGym 生态论文", href: "https://arxiv.org/abs/2412.05467" },
      { rel: "repo", label: "GitHub", href: "https://github.com/ServiceNow/BrowserGym" },
      { rel: "leaderboard", label: "HF 榜", href: "https://huggingface.co/spaces/ServiceNow/browsergym-leaderboard" },
    ],
  },
  {
    slug: "the-agent-company",
    name: "TheAgentCompany",
    shortName: "TheAgentCompany",
    accession: "OB-2024-A18",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["职场", "多应用", "同事模拟"],
    org: "Carnegie Mellon University",
    authors: "Xu, Song, Li et al.",
    summary:
      "自托管的小型软件公司：GitLab、聊天、网盘、项目管理，一百七十五项真实工种任务。同事是带私有知识的 NPC，不找人问就会卡死。",
    origin: `Neubig 组认为 WebArena 和 SWE-bench 都只切了工作的一小片：一个只会逛网站，一个只会修 GitHub issue。TheAgentCompany 用 Docker 搭出一家假公司——代码在 GitLab，消息在 RocketChat，文件在 ownCloud，项目在 Plane——再加 16 个有人设的 LLM 同事。

任务从修 bug 到发工资表，用来逼近“数字员工”而不是单点演示。它把网页、代码、文件、对话缝进同一个工作日。175 题按软件工程、项目经理、HR、数据、财务、行政切开，看起来像编制表。

检查点部分分是重要设计。全完成率很低并不等于没有部分能力：agent 可能把代码改对了但没在聊天里通知同事。只报全成功，会把这种半成品劳动抹掉。

跑一次又贵又慢。NPC 对话不可完全复现。它是目前最接近“把 agent 雇进公司”的沙箱之一，也是最不能用单次分数吹牛的基准之一。`,
    architecture: `Agent 可浏览、写代码、跑程序、找同事聊天。每题有检查点部分分和全成加分。环境一键重置。主指标全任务完成率与部分分。

同事是带私有知识的 NPC。有的信息只活在某个人的脑子里，不找人问就会卡死。这把检索从“搜网页”变成“知道该 @ 谁”。

环境是自托管的多应用内网。和 WebArena 一样可重置，但应用更多、角色更多、任务更长。失败模式包括找错人、读错文件、在 GitLab 上开错 merge request。

NPC 基于 LLM，对话有随机性。锁温度和种子能减少但消灭不了。部分分依赖检查点设计，检查点没写到的步骤，等于不存在。`,
    content: `175 题，覆盖软件工程、项目经理、HR、数据、财务、行政。不是每题都是写代码：有的是整理表格、安排会议、走流程。

同事有人设和私有知识。任务说明书故意不把全部信息写全，模仿真实公司里“你得去问人”的那截。纯工具 agent 在这里会显得礼貌而无能。

应用是开源替代品拼成的公司栈，不是真的 Slack 加 Google Drive 加 Jira。交互足够脏，但仍是实验室脏。

题按部门切更碎。工程题上的高分填不满 HR 题。综合完成率需要和分部门一起看。`,
    format: "多应用职场 agent，检查点计分",
    metrics: ["Full completion", "Partial score"],
    size: "175 任务",
    lineage: {
      parents: ["webarena", "osworld"],
      children: [],
      related: ["swe-bench", "tau-bench", "workarena", "terminal-bench"],
    },
    caveats: `跑一次又贵又慢。墙钟时间和 token 账单都是结果的一部分，只报成功率会隐瞒成本。

NPC 对话不可完全复现。同一 agent 两次找同事，可能问到不同质量的答案。方差要报。

175 题按部门切更碎。全完成率低并不等于没有部分能力，部分分必须一起报。

沙箱公司没有真正的法律、薪酬保密和人事事故。政策遵守比 τ-bench 松，社交复杂性比真公司浅。`,
    links: [
      { rel: "paper", label: "TheAgentCompany 论文", href: "https://arxiv.org/abs/2412.14161" },
      { rel: "homepage", label: "the-agent-company.com", href: "https://the-agent-company.com" },
      { rel: "repo", label: "GitHub", href: "https://github.com/TheAgentCompany/TheAgentCompany" },
    ],
  },
  {
    slug: "tau2-bench",
    name: "τ²-bench",
    shortName: "τ²-bench",
    accession: "OB-2025-A19",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["双控协作", "电信客服", "用户工具"],
    org: "Sierra",
    authors: "Barres, Dong, Ray, Si, Narasimhan",
    summary:
      "在 τ-bench 上加入共享动作空间：用户也有工具，agent 必须远程协作而不是包办。solo 和 interactive 分差会被用户模拟器放大，严禁混成一个数。",
    origin: `τ-bench 里用户只会说话。τ²-bench 加了电信排障域，并区分 solo（agent 代劳）与 interactive（用户必须自己操作系统侧工具）。论文显示，一换成协作模式，即便 GPT-4.1 级模型也可能掉二十余分。它把“会调用 API”升级成“会指导对面那个不完美的人”。

这是客服 agent 评测里一次真正的问题转换。真实排障里，用户手里才有路由器，agent 不能穿过电话线去按重启。双控把工具使用从单人游戏变成协作。

仓库随后演进到含语音与知识检索的 τ³，原 τ-bench 的零售和航空任务也在后续版本里被大批修复。引用时要对齐：你跑的是 τ² 论文协议，还是已经改名升级的后续仓库。

圈里爱引用那二十余分的掉点，因为它打脸“工具调用已经解决”。没解决。对面有一个会按错键的人时，分数会老实下来。`,
    architecture: `双控：agent 与用户模拟器都有工具。两种模式必须分开报。指标仍是任务成功与 pass^k。interactive 模式下，agent 越权代劳算违规。

电信排障是新主场：重启、检查设置、读状态，这些动作在用户侧。agent 要会写说明书，还要会根据用户回报的错误信息改策略。

用户模拟器质量会放大协作分差。一个听话的模拟用户和一个会漏步骤的模拟用户，interactive 分数可以差出一档。用户模型、温度、种子，全部是协议。

后续仓库加了语音全双工和知识检索域，评分脚本也修过。复现要锁 commit，跨小版本比较会把任务修复误读成模型进步。`,
    content: `保留零售和航空，新增电信排障。交互模式下用户要执行重启、检查设置等步骤，agent 不能越权代劳。solo 模式仍可作对照，用来量“如果让我包办能做多好”。

电信域的工具和状态与零售下单不同：设备侧状态、网络侧状态、用户报告的症状，三者要对齐。这是排障，不是改订单。

任务规模按三领域计，电信是新增主场。具体题量随仓库版本变，论文数字和最新仓库不必一致。

语音和知识检索不是 τ² 论文的主协议，是后续演进。不要把 τ³ 的语音分写进 τ² 的表格。`,
    format: "双控多轮工具协作",
    metrics: ["Success rate", "pass^k", "solo vs interactive"],
    size: "三领域；电信为新增主场",
    lineage: {
      parents: ["tau-bench"],
      children: [],
      related: ["bfcl", "the-agent-company"],
    },
    caveats: `协作分差会被用户模拟器质量放大。换一个更笨或更聪明的用户模型，interactive 的故事可以写反。

solo 与 interactive 严禁混成一个数。把包办模式的高分写进摘要，再在附录里轻描淡写协作掉点，是最不体面的报法。

仓库已继续迭代到 τ³，任务修过、域加过、评分改过。复现要锁 commit，并写明你跟的是论文还是主分支。

它仍然是模拟用户，不是真客户。真客户会生气、会撒谎、会中途挂断。双控是朝那边走了一步，不是已经到了。`,
    links: [
      { rel: "paper", label: "τ²-bench 论文", href: "https://arxiv.org/abs/2506.07982" },
      { rel: "repo", label: "GitHub", href: "https://github.com/sierra-research/tau2-bench" },
      { rel: "homepage", label: "Sierra 介绍", href: "https://sierra.ai/blog/benchmarking-agents-in-collaborative-real-world-scenarios" },
    ],
  },
  {
    slug: "browsecomp",
    name: "BrowseComp",
    shortName: "BrowseComp",
    accession: "OB-2025-A20",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["网页深搜", "浏览 agent", "短答案"],
    org: "OpenAI",
    authors: "Wei, Sun, Papay et al.",
    summary:
      "一千二百六十六道“难找、好核验”的短答案题，专门测浏览 agent 会不会在活网上死磕冷门事实。它是 2025 年 deep research 报告的默认栏：闭卷几乎零分，开了搜索也不等于会查。",
    origin: `2025 年 4 月，Jason Wei 这拨人把编程竞赛那套哲学搬到了网上：题可以很难，答案必须短、必须能对上参考。BrowseComp 的全称是 Browsing Competition。出题人被要求写出“现有模型当时做不出来”的题——GPT-4o 开不开浏览、o1、早期 deep research，都过不了关才收进来。

发布那天的表很刺眼。GPT-4o 闭卷 0.6%，开浏览也只有 1.9%；o1 闭卷 9.9%；专门训过浏览的 Deep Research 才到 51.5%。人类出题员限时两小时大约 29%。它要证明的不是“模型会不会用搜索框”，而是会不会为了一条纠缠在一起的冷门事实，连着翻几十页还不放弃。

数据放进 simple-evals，题面加密，防止模型直接把标准答案搜回来。它很快成为模型卡上 deep research 那一栏的默认尺子，也催生了中文版 BrowseComp-ZH、固定语料的 BrowseComp-Plus、以及要看图看视频的 MM-BrowseComp。

到 2026 年夏天，强浏览系统已经把原 1,266 题抬到九成附近。这不意味着网上检索被解决了，只说明这张静态卷开始变短。活网、新题、多模态证据，是后话。`,
    architecture: `短答案，对照参考做核验，另报校准误差。协议默认给浏览工具；闭卷是对照实验，不是主任务。题是“难找但好核验”：答案往往是一个实体、一个数字、一个冷门作品名，对上就算过。

它测的是持久检索加创造力，不是用户提问的真实分布。作者自己写过：它躲开了长答案、歧义消解、以及“用户其实想要一份报告”这种产品问题。类比很明确——编程竞赛也不是软件工程的充分统计，但能把核心肌肉量出来。

分数绑定搜索后端、浏览步数、是否允许多 agent。同一道题，Google 首页改了排序，轨迹就改。活网评测的可复现性天生差一截，这正是后来 Plus 要修的病。

判分看起来简单，别名和单位仍会吵。官方脚本在 simple-evals 里，引用要写清你有没有用他们的抽取和校准提示。`,
    content: `1,266 道英语短问。出题时故意把线索拆开、藏进冷门页面、让单次搜索对不上。你需要把几个不显眼的约束拼起来，才能锁定那个唯一答案。

题不是新闻热点，也不是维基第一段。更像超难版寻宝：某冷门赛事的某个统计、某本小书的某个细节、要对照两个来源才能确定的日期。看起来像 SimpleQA，但 SimpleQA 闭卷就能答，这里闭卷基本是零。

人类两小时预算都做不完很多题，不是因为不会英语，是因为要会换查询、会放弃错误线索。模型常见的失败是搜了两下就编，或者对着一条似是而非的搜索结果交差。

中文互联网、图片、视频都不在这张卷上。那些是 ZH 和 MM 变体的事。`,
    format: "短答案 + 活网浏览",
    metrics: ["Accuracy", "Calibration error"],
    size: "1,266 题",
    lineage: {
      parents: ["gaia", "simpleqa"],
      children: ["browsecomp-plus", "mm-browsecomp"],
      related: ["webvoyager", "simple-evals", "humanity-last-exam", "openai"],
    },
    caveats: `活网会变。同一套 agent 今天过、明天不过，不一定是模型退步。发布会把某一天的 90% 写成“检索已解决”，漏掉了搜索引擎、工具预算和题集日期。

静态 1,266 题正在被做满。2025 年春天 Deep Research 的 51% 和 2026 年夏天的九成，中间隔的是专门训浏览的系统，不是同一场考试的自然涨分。

它不测写长报告、不测引用来源是否诚实、不测用户含糊提问。BrowseComp 很高，不等于你的 deep research 产品能交差。开了搜索的系统和闭卷系统严禁同一列。`,
    links: [
      { rel: "paper", label: "BrowseComp 论文", href: "https://arxiv.org/abs/2504.12516" },
      { rel: "homepage", label: "OpenAI 介绍", href: "https://openai.com/index/browsecomp/" },
      { rel: "repo", label: "simple-evals", href: "https://github.com/openai/simple-evals" },
    ],
  },
  {
    slug: "browsecomp-plus",
    name: "BrowseComp-Plus",
    shortName: "BrowseComp-Plus",
    accession: "OB-2025-A21",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["深搜", "固定语料", "检索解耦"],
    org: "University of Waterloo / 等多机构",
    authors: "Chen, Ma, Zhuang et al.",
    summary:
      "从 BrowseComp 抽出八百三十道能在固定语料里答的题，配大约十万篇人工核过的文档。用来把“检索器强”和“agent 会查”拆开，活网 API 那天心情不好，分数就不会跟着漂。",
    origin: `BrowseComp 一火，复现的人立刻撞墙：黑盒网页搜索今天和明天不是同一个索引，两家 agent 的分差可能只是搜到的页面不一样。Waterloo 的 Chen、Ma 和一串合作者把题搬到固定语料上，做成 BrowseComp-Plus，2025 年 8 月挂 arXiv，后来进了 ACL 2026 正会。

题还是 BrowseComp 那类难找的短答案，但每道题配了人工核过的正例文档和挖出来的硬负例。语料大约十万篇，中位长度五千词出头。你不能再把“GPT 配了更好的搜索”和“GPT 更会推理”混成一个百分数。

论文里的对照很干净。同一个 GPT-5，配 BM25 大约 55.9%，换上更强的嵌入检索能到 70.1%，搜索次数还下降。开源 Search-R1 配 BM25 只有 3.86%。这张表让检索研究重新有了自己的栏，不必每次都跟活网 deep research 系统对打。

它不是 BrowseComp 的加难题，是实验室版。活网的脏、实时、不可复现，被有意拿掉了。`,
    architecture: `agent 对固定语料发检索，而不是调网页搜索 API。主指标仍是答案准确率，另外报证据召回、搜索次数。检索器和生成器必须分开写：换嵌入模型等于换考试的一半。

每题有人工正例和硬负例，所以可以单独看“证据找没找到”和“找到了会不会用”。这是相对原 BrowseComp 最大的方法贡献。

语料是为这八百三十道题收的，不是一张随机网页快照。后续有人把证据投影到更大的预训练语料上，难度会从推理滑向检索——那是另一份实验，不要和 Plus 原分兑。

可复现是卖点。锁语料版本、锁检索器、锁 agent 循环，分数应该能对上。活网 BrowseComp 做不到这一点。`,
    content: `830 道从 BrowseComp 改造过来的题，保证能在固定语料里找到证据。文档是新闻、博客、技术页一类网页文本，不是知识图谱三元组。

硬负例很重要。语料里混着看起来相关、其实答不上这道题的页。只会关键词匹配的检索器，会把 agent 带进沟。

题量比原 1,266 少，因为不是每道 BrowseComp 都能在封闭文档集里落地。丢掉的那些，往往更依赖活网的边角页面。

没有图像，没有中文互联网。它是受控的英文深搜实验室，不是用户浏览器。`,
    format: "短答案 + 固定语料检索",
    metrics: ["Accuracy", "Evidence recall", "Search calls"],
    size: "830 题 / 约 100k 文档",
    lineage: {
      parents: ["browsecomp"],
      children: [],
      related: ["gaia", "simpleqa", "mm-browsecomp"],
    },
    caveats: `固定语料解决复现，也删掉了活网最难的那截：页面改版、反爬、实时数据、搜索广告。Plus 上的高分，不能直接写成 BrowseComp 也被打穿。

语料是围着这 830 道题收的，检索器可能过拟合这套正负例。投影到无关的大规模网页混合集上，证据召回会掉一截，这是后续工作已经看到的现象。

必须同时报检索器和 agent。只写“GPT-5 在 BrowseComp-Plus 上 70%”，不写嵌入模型，等于把别人的检索进步算进自己的推理。`,
    links: [
      { rel: "paper", label: "BrowseComp-Plus 论文", href: "https://arxiv.org/abs/2508.06600" },
      { rel: "homepage", label: "项目主页", href: "https://texttron.github.io/BrowseComp-Plus/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/texttron/BrowseComp-Plus" },
    ],
  },
  {
    slug: "osworld-verified",
    name: "OSWorld-Verified",
    shortName: "OSWorld-Verified",
    accession: "OB-2025-A22",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["计算机使用", "桌面 OS", "原地修订"],
    org: "HKU XLANG",
    authors: "Xie, Yuan, Zhang et al.",
    summary:
      "2025 年 7 月对原版 369 题的大修：三百多条社区反馈、更硬的评测脚本、AWS 并行。协议还是短桌面任务，不是 2.0 那种小时级工作流。现在报 OSWorld，默认应对齐这一版。",
    origin: `OSWorld 2024 年一出，就成了计算机使用 agent 的默认尺子。用了一年，社区把病都报齐了：网页改版、指令含糊、评测脚本过严或过宽、Google Drive 任务初始化随 IP 抽风。XLANG 用大约两个月、十来个人，处理了三百多条反馈，2025 年 7 月 28 日发布 OSWorld-Verified。

它不是新题。还是那 369 条（去掉八个 Google Drive 可以报 361），人类基线大约 72%。变的是任务能跑、判定更认真实成功、官方 AWS 通道把原来十几个小时的评测压到一小时量级。Moonshot、OpenAI、ByteDance Seed、Anthropic 都参与过修。

圈里随后出现一种新糊涂账：Verified 上已经八成的系统和 2.0 上两成的系统，被画在同一条“会用电脑”折线上。Verified 是把短任务修干净；2.0 是另一代考试。2026 年夏天 Verified 前沿已经很高，2.0 仍然很惨，两件事可以同时为真。`,
    architecture: `和原版一样：虚拟机里看截图或无障碍树，输出鼠标键盘或终端，脚本检查最终状态。主指标成功率。步数上限必须写：15、50、100、500 是四种 agent。

官方希望上 Verified 榜的人走他们的 AWS 评测通道，公开代码和轨迹。民间 Docker 复现仍然可以，但噪声和官方通道不是同一个分布。

八个 Google Drive 任务继续是例外。看到 361 和 369，先问这八题在不在。应用版本、网站结构按修订后的镜像走，不要拿 2024 年的旧快照对 2025 年的脚本。

分数是系统分。分辨率、动作空间、是否允许终端、重试策略，全写进同一个百分数。`,
    content: `任务还是改 PPT、整理文件、配置系统、跨应用拷数据。短，人类中位大约两分钟那一档，不是下午的工作流。

修订改的是能跑和能判，不是把题变难。有的脚本从过严改成模糊匹配，有的补了备用站点，有的把含糊指令写清楚。这会让部分旧失败变成成功，也会让部分旧投机不再得分。

内容覆盖办公套件、浏览器、文件管理、系统设置。Windows 分析任务仍不是主榜。主场还是 Ubuntu 桌面。

不要在这里找 2.0 的专业工作流、进行中插入的消息、或 31 个自托管网站。那些是另一份标本。`,
    format: "桌面 OS 上的 GUI/终端 agent",
    metrics: ["Success rate"],
    size: "369 任务（常报 361，排除 Google Drive）",
    lineage: {
      parents: ["osworld"],
      children: [],
      related: ["osworld-2", "windows-agent-arena", "androidworld", "terminal-bench"],
    },
    caveats: `和原版、和 2.0 三套数字不能兑。把 2024 论文的 12% 和 2026 年 Verified 的 80% 连成一条能力曲线，必须加断点：中间修了题、换了基础设施、模型也换了代。

官方通道和本地复现会差一截。没走官方评测就写“Verified SOTA”，别人对不上。

短任务被做满，不代表计算机使用被解决。人类两分钟能做完的题，和人类一个半小时的工作流，不是同一块肌肉。`,
    links: [
      { rel: "homepage", label: "OSWorld-Verified 介绍", href: "https://xlang.ai/blog/osworld-verified" },
      { rel: "repo", label: "GitHub", href: "https://github.com/xlang-ai/OSWorld" },
      { rel: "paper", label: "原版 OSWorld", href: "https://arxiv.org/abs/2404.07972" },
    ],
  },
  {
    slug: "osworld-2",
    name: "OSWorld 2.0",
    shortName: "OSWorld 2.0",
    accession: "OB-2026-A23",
    year: 2026,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["长程计算机使用", "专业工作流"],
    org: "HKU XLANG / Snorkel 等",
    authors: "Xie, Deng, Yang et al.",
    summary:
      "一百零八条小时级真实工作流，人类中位大约 1.6 小时，强 agent 平均三百多次工具调用。2026 年 6 月发布时，最好的 Claude Opus 4.8 二元完成只有 20.6%。Verified 被做满之后，真正的计算机使用考场在这里。",
    origin: `XLANG 自己把话挑明了：两年后 OSWorld 1.0 已经有系统报到 83.5%，问题并没有解决。2026 年 6 月 26 日他们放出 2.0，题量从 369 收到 108，但每题从两分钟拉到一个半小时。论文是 arXiv:2606.29537。

设计目标是抓住旧基准里几乎不存在的真实工作现象：流式交互、环境中途会变、跨来源推理、隐式状态、视觉空间精度。任务带着真实输入文件和有状态的用户档案，执行过程中还可能插进新消息。31 个自托管网站加一堆桌面应用，七个专业领域。

发布时的数字很诚实。500 步预算下，Claude Opus 4.8 开最大思考加批量工具调用，二元完成 20.6%，部分分 54.8%；GPT-5.5 更省 token，但完成率卡在大约 13%。部分进度是真的，端到端可靠计算机使用不是。Snorkel 作为数据伙伴也公开讲了这句话。`,
    architecture: `还是真实电脑，但评测从“最终状态满不满足一条脚本”改成大量加权检查点。平均每题二十多个检查点，同时报二元完成和部分分。默认动作预算远大于 1.0 的几十步，论文主结果用 500 步。

Agent 观察和应用栈比 1.0 脏。动态环境和中途插入的消息，会把“按演示轨迹点下去”的策略打死。跨应用、跨网站的状态要对齐，才能拿满检查点。

跑一次极贵。墙钟时间和 token 账单是结果的一部分。只报 20.6% 不报步数、思考档位和是否批量调用，是在藏系统配置。

安全敏感执行另有审计报告。这不是安全基准，但长程计算机使用会碰到真的副作用，作者没有假装没有。`,
    content: `108 条端到端工作流，覆盖研究、创意生产、工程、个人事务、商务财务、行政合规、医疗等。不是“把这个文件夹按日期排序”，是“把这下午的活做完”。

输入是真实工件：文件、表格、进行中的项目、用户档案里的隐式约束。69.6% 的题，熟练人类也要一小时以上。Claude Opus 4.7 最大思考下平均大约 318 次工具调用，对照 1.0 的大约 30 次。

31 个自托管网站是为了可重置，不是为了比真互联网更干净。应用之间拷数据、对着动态页做决策、从几个来源推断当前状态，是题的主体。

不要把 108 当成 369 的子集。题是新写的，难度单位换了。`,
    format: "长程桌面工作流 agent",
    metrics: ["Binary completion", "Partial score"],
    size: "108 工作流",
    lineage: {
      parents: ["osworld"],
      children: [],
      related: ["osworld-verified", "terminal-bench", "the-agent-company", "gdpval"],
    },
    caveats: `和 Verified 高分无关。短任务卫生检查通过，不代表小时级工作流能交差。发布会把两栏平均成“计算机使用 50 分”，是最常见的障眼法。

预算和脚手架主导结果。500 步和 50 步、开不开批量工具、思考档位，分差可以大于换模型。二元完成和部分分必须一起报：只报部分分会看起来已经半成功，只报二元会看起来完全不会。

评测贵、噪声大、检查点设计本身会吵。某步没写进检查点，等于这步不存在。引用写论文版本和官方通道。`,
    links: [
      { rel: "paper", label: "OSWorld 2.0 论文", href: "https://arxiv.org/abs/2606.29537" },
      { rel: "homepage", label: "os-world.github.io", href: "https://os-world.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/xlang-ai/OSWorld" },
    ],
  },
  {
    slug: "mcp-universe",
    name: "MCP-Universe",
    shortName: "MCP-Universe",
    accession: "OB-2025-A24",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["MCP 工具", "真服务器", "长程工具"],
    org: "Salesforce AI Research",
    authors: "Luo, Shen, Yang et al.",
    summary:
      "头一份认真拿真 MCP 服务器当考场的基准：六个域、十一台服务器、二百三十一题，用程序化评测器而不是 LLM 法官。发布时 GPT-5 也只有大约 44%。工具文档不熟、上下文爆炸，是它抓到的两只新虫。",
    origin: `2025 年夏天，MCP 已经从 Anthropic 的协议变成 agent 产品的默认插头。评测还停留在模拟 API 和一次 JSON 对不对。Salesforce AI Research 的 MCP-Universe 把 Google Maps、GitHub、Yahoo Finance、Playwright 这类真服务器接进来，题按真实使用场景手写，2025 年 8 月挂出 arXiv:2508.14704。

六个域：位置导航、仓库管理、金融分析、三维设计、浏览器自动化、网页搜索。十一台服务器、大约 133 个工具、231 题。评测器分成格式、静态、动态三类——动态题会去拉实时真值，避免“昨天的股价标准答案”。作者明确拒绝 LLM 法官当主协议。

发布数字：GPT-5 43.72%，Grok-4 33.33%，Claude 4 Sonnet 29.44%。域差极大，金融能到六成，仓库管理掉到三成。工具给多了，Claude 还会更差。企业级 Cursor 并不自动强过普通 ReAct。未知工具和长对话，是这篇论文留给 2026 年 MCP 评测的两句咒语。`,
    architecture: `agent 连真实 MCP 服务器，按任务调用工具。成功由代码评测器判定：格式对不对、静态内容匹不匹配、动态内容是否等于此刻拉到的真值。主指标任务成功率，必须拆域报。

真实服务器带来真实故障：限流、鉴权、字段漂移、页面结构变化。这是优点，也是复现地狱。动态题尤其不能跨周硬比。

未知工具挑战是一等公民。模型没见过这台服务器的 schema，要现场读文档、试错、改参数。把工具列表缩成“刚好那几个”，分数会虚高，也测不到产品里那十万个 MCP 服务器的现实。

框架开源，带 UI，后头还接过 MCPMark 等其他集。引用写你跑的是原 231 题还是后来的扩展。`,
    content: `231 题手写，故意做成“不用对 MCP 就做不出来”。位置导航要对着地图工具走；仓库管理对着 GitHub；金融对着行情；三维设计对着专业软件接口；浏览器自动化对着 Playwright；搜索对着网页。

工具空间对模型是陌生的。失败经常不是推理错，是参数名写错、分页没处理、把两个服务器的 ID 混用。长轨迹上上下文被工具返回塞满，后面的调用开始胡来。

题量按域并不均匀。网页搜索 55、导航 45、金融 40、浏览器 39、仓库较少、三维设计最少。只报总分会把三维设计的惨案平均掉。

时间敏感题的答案会变。这是动态评测器存在的理由，也是“我们复现了论文表 3”这句话要加日期的理由。`,
    format: "真 MCP 服务器上的 agent 任务",
    metrics: ["Success rate（分域）"],
    size: "231 任务 / 11 服务器",
    lineage: {
      parents: ["bfcl", "toolbench"],
      children: [],
      related: ["mcp-atlas", "tau-bench", "gaia"],
    },
    caveats: `真服务器会漂。限流和页面改版能让同一 agent 换周掉分。动态题尤其不能当静态集缓存。

工具给全和工具给对，是两种协议。论文里工具变多分数变差，说明“把公司 MCP 目录一股脑塞进上下文”可能是在害模型。

程序化评测器避开了法官模型，也锁死了“什么叫成功”。等价但格式不同的正确结果，可能被判零。看评测器比看模型卡重要。`,
    links: [
      { rel: "paper", label: "MCP-Universe 论文", href: "https://arxiv.org/abs/2508.14704" },
      { rel: "homepage", label: "mcp-universe.github.io", href: "https://mcp-universe.github.io/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/SalesforceAIResearch/MCP-Universe" },
    ],
  },
  {
    slug: "mcp-atlas",
    name: "MCP-Atlas",
    shortName: "MCP-Atlas",
    accession: "OB-2026-A25",
    year: 2026,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["MCP 工具", "跨服务器编排", "工具发现"],
    org: "Scale AI",
    authors: "Scale AI",
    summary:
      "一千道专家写的自然语言任务，对着三十六台生产 MCP 服务器、二百多个工具。提示里不点名服务器，还塞进语义相近的干扰工具。Universe 问“会不会用这台真服务器”，Atlas 问“在一堆像模像样的插头里，你找不找得到该用的那几个”。",
    origin: `MCP-Universe 证明了真服务器很难。Scale 觉得规模和干扰还不够：真实产品里 agent 面对的不是十一台整理好的服务器，而是一长串名字相近、文档含糊、错误码乱七八糟的插头。MCP-Atlas 在 2026 年 2 月挂出 arXiv:2602.00933，一千题、三十六台真实 MCP、论文口径 220 个工具，98.6% 的题要跨两台及以上服务器。

提示故意不写服务器名、工具名、参数名。agent 得自己发现该用谁，还得在语义相近的干扰项里别拿错。大约三分之一的题有条件分支：主搜索没搜到，要换备用引擎。Scale 强调三件事：不用假服务器把错误模式熨平，不用轨迹匹配把合法的另一条解法杀掉，不给干净工具集让发现题变成填空。

仓库和论文的工具计数后来有过对不上：论文写 220，仓库摘要一度列到 307。锁论文版本，并看他们钉死的服务器版本。服务器都是开源或从开源 fork 的生产实现，Scale 声称自己没新写服务器，只是把真实插头钉在可复现的 Docker 里。`,
    architecture: `自然语言任务进 Docker 化环境，部分暴露工具，含系统化干扰项。多数题要 3 到 6 次调用，调用之间有数据依赖。主指标看任务完成；官方实现用 LLM 法官，这点和 Universe 的程序化评测器分道。

跨服务器是默认，不是加分项。第一步的返回值要填进第二台服务器的参数，填错就全盘失败。干扰工具长得像正确答案，专门打“看见一个搜索就调用”的反射。

真实 API 的限流、错误、空结果都会出现。钉版本是为了复现，也意味着你测的是 2026 年初那一截 MCP 生态，不是今天的注册表。

榜在 Scale 上。私有细节和法官提示要按官方走，民间换一个裁判模型，分会动。`,
    content: `一千道专家写的自然语言任务，覆盖搜索、数据分析、生产力、金融、代码五个应用域。看起来像真人会跟助手说的话，不像 API 文档练习。

几乎全部要编排两台以上服务器。题干不会说“请调用 github.search 再调用 slack.post”，你得自己想出这条链。条件逻辑题会根据中间结果改道。

三十六台服务器来自真实生态，不是实验室 mock。工具文档质量参差，有的参数描述会骗人，这是内容的一部分。

不要把它读成 BFCL 的 MCP 皮肤。BFCL 问 schema 对不对；Atlas 问在脏工具柜里能不能把一件跨应用的活做完。`,
    format: "真 MCP 上的跨服务器工具任务",
    metrics: ["Task success", "LLM-as-judge"],
    size: "1,000 任务 / 36 服务器",
    lineage: {
      parents: ["mcp-universe", "bfcl"],
      children: [],
      related: ["tau-bench", "toolbench", "gaia"],
    },
    caveats: `法官模型是分数的亲爹。Universe 用代码评测器，两套分不能兑。换裁判等于换标准。

工具计数和服务器版本会对不上。引用写 arXiv 版本和 Docker 钉死的镜像，不要口头报“三十六台 MCP”就完。

生产服务器钉版本之后，就不再是今天的 MCP 生态。测到的是“会不会用这批插头”，不是“会不会用任意新服务器”。干扰项设计会过时，新模型一旦见过这套工具柜，发现题会变容易。`,
    links: [
      { rel: "paper", label: "MCP-Atlas 论文", href: "https://arxiv.org/abs/2602.00933" },
      { rel: "repo", label: "GitHub", href: "https://github.com/scaleapi/mcp-atlas" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/ScaleAI/MCP-Atlas" },
      { rel: "leaderboard", label: "Scale 榜", href: "https://scale.com/leaderboard/mcp_atlas" },
    ],
  },
  {
    slug: "gdpval",
    name: "GDPval",
    shortName: "GDPval",
    accession: "OB-2025-A26",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["职业交付物", "知识工作", "经济价值"],
    org: "OpenAI",
    authors: "Patwardhan, Dias, Proehl et al.",
    summary:
      "按美国 GDP 最大的九个行业收了四十四个知识职业、一千三百二十项真实交付物。公开黄金集只有二百二十题。测的不是考试，是法律备忘录、护理计划、工程图这种专家要花数小时做出来的东西。",
    origin: `2025 年 9 月 25 日，OpenAI 把评测单位从考卷改成职业。GDPval 从对美国 GDP 贡献超过 5% 的九个行业里，按薪酬选出偏知识工作的职业，请平均十四年经验的专家，按真实工作产品出题：法律简报、工程蓝图、客服对话、护理计划、新闻稿。全文 1,320 题，每职业至少 30 题；公开黄金集每职业 5 题，共 220。论文 arXiv:2510.04374，后来也走了 ICLR 2026。

判分不是准确率。专家盲比模型交付物和人类金标，打更好、一样好、或更差。OpenAI 还提供自动评分服务，用带工具的模型做成对比较。他们想讲的故事是：前沿模型在这些交付物上的质量，正以大致线性的速度逼近行业专家，而且又快又便宜——前提是有人盯着。

这是 2025 年下半年最会出圈的尺子之一，也是最好被误读的。职业覆盖是美国知识工作的工资加权切片，不是全球劳动，更不是体力活。公开 220 题会进语料；全量 1,320 你基本报不到。`,
    architecture: `每题是一份请求加参考文件，模型交一份工作产品。人类专家做成对比较；公开黄金集可走 OpenAI 的自动评分器。必须声明你报的是 wins-only 还是 wins-and-ties，官方榜和民间 Inspect 复现曾经对不齐，差的就是这一刀。

任务平均专家工时大约七小时，不是一道选择题。脚手架、思考档位、给的上下文，论文里都会抬分。把它当零样本聊天来跑，是在用错协议。

Inspect Evals 收了黄金集 220 题。全量集不公开。民间数字默认只对 220，还要过官方自动评分管道，上传到指定位置。

主观因素进分：正确性之外还有风格、版式、是否切题。法律意见写对了但格式像学生作业，专家可能仍判人类更好。`,
    content: `九个行业、四十四个职业，从软件开发、律师到注册护士、机械工程师、影视剪辑。每题基于真实工作产品改写，请求往往带着一堆参考文件。

黄金集 220 题是你能本地讨论的全部。全量 1,320 用来撑“代表性”这句话：作者声称覆盖了各职业 O*NET 工作活动的大部分。没有公开题，这句话只能信论文。

内容故意保留职业里会出现的敏感主题。影视、法律、政治相关任务可能含粗口或争议材料，数据集卡写明了。这不是安全基准，是职业真实。

交付物格式五花八门：文档、表格、设计、对话记录。不会用电脑处理文件的模型，会在“先打开附件”这一步就死。`,
    format: "职业交付物，专家成对比较",
    metrics: ["Win rate vs expert", "Wins and ties"],
    size: "1,320 全量；220 公开黄金集",
    lineage: {
      parents: ["the-agent-company", "swe-lancer"],
      children: [],
      related: ["osworld-2", "gaia", "simple-evals", "inspect-ai", "openai"],
    },
    caveats: `公开 220 和全量 1,320 不是同一张卷。只跑黄金集就宣布“知识工作已被替代”，分母差了六倍，还漏了美国工资加权这个抽样框。

成对比较依赖专家品味和自动评分器。换裁判、换提示、把平局算进分子，名次会动。引用必须写 wins-only 还是含平局，以及评分器版本。

它测数字知识工作的交付物质量，不测上班开会、不测责任、不测执照。又快又便宜是在“有人审核”的前提下写的。把 GDPval 写成就业预测，是发布会语言，不是计量。`,
    links: [
      { rel: "paper", label: "GDPval 论文", href: "https://arxiv.org/abs/2510.04374" },
      { rel: "homepage", label: "OpenAI 介绍", href: "https://openai.com/index/gdpval/" },
      { rel: "dataset", label: "Hugging Face 黄金集", href: "https://huggingface.co/datasets/openai/gdpval" },
      { rel: "harness", label: "Inspect Evals", href: "https://ukgovernmentbeis.github.io/inspect_evals/evals/gdpval" },
    ],
  },
  {
    slug: "tua-bench",
    name: "TUA-Bench",
    shortName: "TUA-Bench",
    accession: "OB-2026-A27",
    year: 2026,
    status: "active",
    kind: "benchmark",
    family: "agents",
    domains: ["终端通用计算机使用", "办公与科研"],
    org: "Meta",
    authors: "Chen, Wang, Yang et al.",
    summary:
      "一百二十道终端里的一般计算机使用题：改文档、管邮件、网上查资料，外加博士一起出的科研工作流。Terminal-Bench 偏工程师值班，OSWorld 偏点 GUI，TUA 问的是：只给你一个 shell，日常数字劳动能不能做完。",
    origin: `2026 年中，终端 agent 已经能在 Terminal-Bench 上拿出能看的分数，计算机使用评测却仍分裂成两派：GUI 基准很少进终端，终端基准又几乎全是编译、排障、配服务。Meta 的 TUA-Bench 想补中间那块——Terminal-Use Agent，一般用途，不一定是程序员的活。论文 arXiv:2606.28480，站点 tuabench.ai。

120 题，五类任务族，手工设计，Harbor 编排，确定的启动脚本，执行式打分。日常数字活动占一半气质：文档、邮件、活网信息；另一半是和博士一起设计的、要用专业软件的科学工程流程。发布时最强组合是 Claude Code 配 Claude Opus 4.8 最大思考，总分 65.8%，两类赛道裂口明显。

它把“会用终端”从 SWE 技能里拆出来。能修仓库的 agent，不一定会把一封邮件的附件整理进表格再发出去。这正是 2026 年终端评测开始分叉的原因：TB 继续加难工程师任务，TUA 去测更像上班的事。`,
    architecture: `真实终端，Harbor 任务格式，执行式评分。五类任务族必须拆开报，总分会把科研工作流的失败平均进改文档的成功。对照脚手架包括 Terminus-2、Codex、OpenHands、Mini-SWE-Agent、Claude Code，分数首先是系统分。

环境可重置。活网信息寻求那一类仍然会漂，作者没有假装终端里的 curl 比浏览器更永恒。专业软件任务依赖镜像里装了什么，换版本等于换题。

确定性启动脚本是纪律：每个评测者看到同一份初始状态。成功条件写在评分协议里，不看命令漂不漂亮。

它不是 GUI 基准。不会点按钮，会敲命令、会调终端里的程序。和 OSWorld 的技能有交集，交互面不是同一个。`,
    content: `120 道手工题。日常侧是改文档、管邮箱、到网上找一个能核验的事实；科研侧是领域专家认可的专业软件流程，不是玩具脚本。

五类任务族的具体切分以论文和站点为准，引用时抄官方名字，不要自己发明“办公 / 科研”两分然后和论文对不上。

题是真实世界风格，但跑在容器里。邮件不是你的 Gmail，文档不是公司网盘。脏度够用，仍是实验室脏。

和 Terminal-Bench 的题几乎不重叠。TB 要你把一条工程工作流熬通；TUA 要你把一件不一定属于程序员的数字劳动做完。`,
    format: "终端沙箱，执行式打分",
    metrics: ["Success rate（分任务族）"],
    size: "120 任务，五类",
    lineage: {
      parents: ["terminal-bench"],
      children: [],
      related: ["osworld", "osworld-2", "harbor", "the-agent-company"],
    },
    caveats: `65.8% 是特定脚手架加特定模型加最大思考。换 Terminus 再报一个数，不是同一场考试。

活网和专业软件镜像会漂。锁 Harbor 数据集标签和镜像版本。日常任务看起来简单，并不代表科研族也能做。

终端通用计算机使用，仍然不是完整的计算机使用。没有 GUI 的邮件客户端和有 GUI 的 Outlook，失败模式不同。不要用 TUA 代替 OSWorld，也不要用 TB 代替 TUA。`,
    links: [
      { rel: "paper", label: "TUA-Bench 论文", href: "https://arxiv.org/abs/2606.28480" },
      { rel: "homepage", label: "tuabench.ai", href: "https://www.tuabench.ai" },
    ],
  },
];
