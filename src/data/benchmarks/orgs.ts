import type { Benchmark } from "@/lib/types";

export const orgs: Benchmark[] = [
  {
    slug: "openai",
    name: "OpenAI",
    shortName: "OpenAI",
    accession: "OB-2021-O01",
    year: 2021,
    status: "active",
    kind: "org",
    family: "orgs",
    domains: ["考卷", "活网深搜", "职业交付物"],
    org: "OpenAI",
    authors: "OpenAI",
    summary:
      "从 HumanEval 到 BrowseComp、GDPval，闭源模型卡上很多栏的出题人就是他们自己。自家跑道叫 simple-evals：零样本加思维链、生成后再抽答案。社区 lm-eval 对不上他们的表，经常不是谁作弊，是厨房不同。",
    origin: `2015 年成立的实验室，评测史上真正留下尺子是 2021 年的 HumanEval：164 个手写函数，把“代码对不对”从 BLEU 改成单元测试。那之后几乎所有函数级基准都在跟它吵架。

2024 年他们把技术报告协议摊开成 simple-evals，2025 年又连续放 SimpleQA、BrowseComp、SWE-bench Verified、SWE-Lancer、GDPval。模式很清楚：先内部用，再把能公开的那截丢到 GitHub，分数仍然以他们自己的跑分为准。

他们既出题，也是被测的第一被告。HumanEval 进过无数训练配方，BrowseComp 的 Deep Research 基线还写明训过同类任务。读 OpenAI 出品的尺子，要把“出题人”和“应考人”放在同一段里。`,
    architecture: `公开对照用 simple-evals：少任务、硬任务、零样本思维链、从生成文本里抽答案。这和 lm-eval 默认的对数概率选题不是一场考试。仓库后来写了不积极维护，BrowseComp、SimpleQA 仍住在这棵树上。

内部还有 evals.openai.com 和自动评分服务，GDPval 黄金集要上传再走他们的裁判。私有全量你报不到。智能体评测更依赖 Docker、工具预算和他们当时的产品循环，外部复现默认对不齐。

没有一个统一的“OpenAI Harness”能覆盖从函数补全到职业交付物。simple-evals 只是报告对照脚本，不是 Harbor 那种容器平台。`,
    content: `函数级：HumanEval。事实幻觉：SimpleQA。浏览深搜：BrowseComp。仓库修补：SWE-bench Verified 是他们和 Princeton 合作的人工清洗切片。自由职业工单：SWE-Lancer。知识工作交付物：GDPval，公开只有 220 题黄金集。

技术报告里还会出现 GPQA、MATH、MMLU，那是别人的题，他们规定怎么喂。出品和引用要分开。

中文、多模态综合、开源权重榜，不是他们的主场。别用一份 GPT 技术报告概括全世界。`,
    format: "出题机构",
    metrics: ["自家跑道：simple-evals"],
    houseHarness: "simple-evals",
    lineage: {
      parents: [],
      children: [
        "humaneval",
        "simple-evals",
        "simpleqa",
        "browsecomp",
        "gdpval",
        "swe-bench-verified",
        "swe-lancer",
      ],
      related: ["swe-bench"],
    },
    caveats: `出题人兼应考人。内部训过的浏览数据会让 BrowseComp 好看，不等于通用检索已解决。

simple-evals 不维护。新模型不会自动出现。要对齐某份技术报告，锁当时的 commit，别“优化”成自己的 SOTA。

公开集和私有集是两张卷。GDPval 220 不能写成 1320，Verified 500 不能写成原版 2294。`,
    links: [
      { rel: "homepage", label: "openai.com", href: "https://openai.com/" },
      { rel: "repo", label: "simple-evals", href: "https://github.com/openai/simple-evals" },
      { rel: "homepage", label: "evals.openai.com", href: "https://evals.openai.com/" },
    ],
  },
  {
    slug: "eleutherai",
    name: "EleutherAI",
    shortName: "EleutherAI",
    accession: "OB-2021-O02",
    year: 2021,
    status: "foundational",
    kind: "org",
    family: "orgs",
    domains: ["开源评测", "可复现"],
    org: "EleutherAI",
    authors: "EleutherAI",
    summary:
      "开源圈跑 MMLU、GSM8K、BBH 的默认厨房。自家跑道是 lm-evaluation-harness。你在论文附录里看到的“我们用 lm-eval”，多半就是他们。",
    origin: `从 GPT-Neo 和 The Pile 那条开源线长出来的研究集体。2021 年前后把评测收成统一后端，让“换个脚本差五分”还能被对质。他们不是出最多新考卷的人，是让旧考卷能在同一套 YAML 里复跑的人。

没有 Eleuther 的 harness，开源模型卡会回到各写各的 notebook。Open LLM Leaderboard 第一代也是站在这套厨房上。`,
    architecture: `lm-eval：任务 YAML，loglikelihood 选题或 generate 再抽取，Hugging Face / vLLM / API 后端。默认 prompt 不一定等于原论文，这是它最常被骂、也最常被用的原因。

它不跑浏览器，不跑 Docker 修 Django，不跑安全工具链。那些是 Inspect、Harbor、BrowserGym 的活。主场仍是文本、选择题、短生成。`,
    content: `出品主要是跑道，不是新题。MMLU、GSM8K、BBH、TruthfulQA、IFEval 都以任务配置的形式住在仓库里。后来 Leaderboard v2 那一组也从这里走。

想找他们自己发明的智力理论，会失望。想对齐开源论文附录，从这里进。`,
    format: "出题机构",
    metrics: ["自家跑道：lm-eval"],
    houseHarness: "lm-eval-harness",
    lineage: {
      parents: [],
      children: ["lm-eval-harness"],
      related: ["open-llm-leaderboard", "helm"],
    },
    caveats: `默认配置有偏见。用 lm-eval 的 MMLU 写成 Hendrycks 原协议，是张冠李戴。

版本必须锁。v0.4 重构过任务格式。只写“lm-eval”三个字，等于没写。`,
    links: [
      { rel: "homepage", label: "eleuther.ai", href: "https://www.eleuther.ai/" },
      { rel: "repo", label: "lm-evaluation-harness", href: "https://github.com/EleutherAI/lm-evaluation-harness" },
    ],
  },
  {
    slug: "stanford-crfm",
    name: "Stanford CRFM",
    shortName: "CRFM",
    accession: "OB-2022-O03",
    year: 2022,
    status: "active",
    kind: "org",
    family: "orgs",
    domains: ["多指标", "公开请求"],
    org: "Stanford CRFM",
    authors: "Liang, Bommasani et al.",
    summary:
      "HELM 那句老话：别只报一个准确率。自家跑道把校准、鲁棒、公平、毒性、效率摊在同一张卡上，还把原始请求公开。2026 年起官方进入维护模式。",
    origin: `斯坦福基础模型研究中心。2022 年 HELM 想画一张任务地图，用同一套适配跑过去。后来裂成 Lite、Safety、Long Context、医学、多模态一串专项榜。名字越来越多，读者越容易把 Lite 的五科 MMLU 当成 57 科。

2026 年 6 月起官方维护模式：旧榜还在，别指望它再给你加智能体科目。活的评测地图停了，档案还在。`,
    architecture: `HELM 框架：标准化上下文学习、公开原始请求、多指标并排。跑一次很贵。它更像国家气象站，你读公报，很少自己再造一座雷达。

Lite 是缩水对照，Safety 和 Long Context 是另卡。点错入口就会引用错表。`,
    content: `出品是 HELM 家族，不是新的智力考卷。Classic、Lite、Safety、Long Context 都在柜子里。内容来自已有基准的复跑菜单。`,
    format: "出题机构",
    metrics: ["自家跑道：HELM"],
    houseHarness: "helm",
    lineage: {
      parents: [],
      children: ["helm", "helm-lite", "helm-safety", "helm-long-context"],
      related: ["lm-eval-harness"],
    },
    caveats: `维护模式意味着地图不再更新。用 2022 年的场景结构去概括 2026 年的 agent，会漏掉工具和电脑。

多指标会被人偷偷折成综合分。折的权重就是立场。`,
    links: [
      { rel: "homepage", label: "crfm.stanford.edu/helm", href: "https://crfm.stanford.edu/helm/" },
    ],
  },
  {
    slug: "lmsys",
    name: "LMSYS / LMArena",
    shortName: "LMArena",
    accession: "OB-2023-O04",
    year: 2023,
    status: "live",
    kind: "org",
    family: "orgs",
    domains: ["人类偏好", "活榜"],
    org: "LMSYS / LMArena",
    authors: "Chiang, Zheng et al.",
    summary:
      "从 Vicuna demo 长出来的盲测战场。自家跑道不是 YAML，是两个人类匿名对打、人点哪个更好看。测的是“更想用”，不是“更会考试”。",
    origin: `2023 年 Vicuna 需要证明自己聊得还行，不能只报 MMLU。于是有了 MT-Bench 八十道多轮题，和 Chatbot Arena 的人类投票。域名后来迁到 lmarena.ai，组织从学术 demo 长成独立产品。

风格、啰嗦、拍马屁都会进 Elo。和 MMLU 放一张图里，是发布会最爱的障眼法，也是它真正有价值的地方：静态考卷测不到的对话手感。`,
    architecture: `成对盲选，Bradley-Terry / Elo。没有标准答案，没有可带回家的测试集。控制变量几乎不存在。活，每天新对战，排行会动。引用写截止日期和对战量。

MT-Bench 和 Arena-Hard 是自动裁判的影子，用来当 Arena 的廉价代理。代理相关高，不等于同一件事。`,
    content: `Chatbot Arena、MT-Bench、Arena-Hard，后来裂出代码、视觉、WebDev 分榜。用户野外提示什么都有。分布跟随谁愿意打开这个网站。`,
    format: "出题机构",
    metrics: ["自家跑道：人类盲测 / Elo"],
    houseHarness: "lmarena",
    lineage: {
      parents: [],
      children: ["lmarena", "mt-bench", "arena-hard", "lmsys-vision-arena", "webdev-arena"],
      related: ["alpacaeval"],
    },
    caveats: `不可本地复现。实验室里没有这份用户群。投票人群会变。

把它的 Elo 写成通用智力，是把口味当成智商。`,
    links: [
      { rel: "homepage", label: "lmarena.ai", href: "https://lmarena.ai" },
    ],
  },
  {
    slug: "princeton-nlp",
    name: "Princeton NLP",
    shortName: "Princeton NLP",
    accession: "OB-2023-O05",
    year: 2023,
    status: "foundational",
    kind: "org",
    family: "orgs",
    domains: ["仓库级 SWE"],
    org: "Princeton NLP",
    authors: "Jimenez, Yang et al.",
    summary:
      "SWE-bench 原产。把评测单位从函数改成 GitHub issue 加补丁。没有他们，今天模型卡上那栏 resolve rate 不会存在。自家没有 Harbor 那种通用跑道，官方协议就是那套 Docker 加 FAIL_TO_PASS。",
    origin: `2023 年 Jimenez、Yang 这组人认为 HumanEval 满分也回答不了“会不会在真实项目里修 issue”。12 个 Python 仓、2294 道题，原论文的数字很难看，这是优点。后来 Lite、Verified、Pro、Gym、Live、rebench，全是这条河的下游。

他们也做了 SWE-agent，证明脚手架能把个位数抬到两位数。分数从此不再是纯模型属性。`,
    architecture: `官方评测：issue 文本加仓库快照，输出 git patch，跑 FAIL_TO_PASS 和 PASS_TO_PASS。模型看不到测试。安装失败、补丁打不上、超时，都算没解决。

没有单独命名的通用 harness 产品。社区后来用 SWE-agent、OpenHands、Harbor 适配器来跑。报分必须写脚手架，否则 resolve rate 只是气氛组。`,
    content: `SWE-bench 原集、Lite，以及训练用的 SWE-Gym。Verified 是 OpenAI 合作的人工清洗切片，Pro 是 Scale 的企业加难，Live 是微软的滚动集——下游别当成 Princeton 独家出品。`,
    format: "出题机构",
    metrics: ["协议：SWE-bench Docker"],
    lineage: {
      parents: [],
      children: ["swe-bench", "swe-bench-lite", "swe-gym"],
      related: ["swe-bench-verified", "swe-bench-pro", "swe-bench-live"],
    },
    caveats: `原 12 仓可能进过预训练。原集含脏实例，工业界已转向 Verified。还在用全量 2294 宣称新高，要说明为什么。

脚手架差比模型差更能改写名次。`,
    links: [
      { rel: "homepage", label: "swebench.com", href: "https://www.swebench.com" },
      { rel: "repo", label: "SWE-bench", href: "https://github.com/SWE-bench/SWE-bench" },
    ],
  },
  {
    slug: "xlang",
    name: "HKU XLANG",
    shortName: "XLANG",
    accession: "OB-2024-O06",
    year: 2024,
    status: "active",
    kind: "org",
    family: "orgs",
    domains: ["计算机使用"],
    org: "HKU XLANG",
    authors: "Xie, Yu et al.",
    summary:
      "OSWorld 原产。把评测对象从网站改成一台电脑。自家跑道就是那套虚拟机加评测脚本，后来升级成 AWS 并行的 Verified 通道。2.0 是另一代小时级工作流，三套分数不能兑。",
    origin: `港大 XLANG 实验室。2024 年 OSWorld 用真实桌面 OS 跑开放任务，迅速成为计算机使用 agent 的默认尺子。用了一年，社区把错题和脚本病报齐，2025 年 7 月原地大修成 Verified。2026 年 6 月再出 2.0：108 条小时级工作流，短任务卫生检查通过不等于下午的活能做完。`,
    architecture: `虚拟机里看截图或无障碍树，输出鼠标键盘或终端，脚本检查最终状态。Verified 走官方 AWS 通道才上榜。步数上限是协议：50 步和 500 步是两种 agent。

没有另起一个商品名 harness。环境即跑道。Windows Agent Arena、AndroidWorld 是同一思想在别的 OS 上的展开，不是 XLANG 独家。`,
    content: `OSWorld、OSWorld-Verified、OSWorld 2.0。三套题、三套数字。出品的哲学是真实电脑加执行式判定，不是网页沙箱。`,
    format: "出题机构",
    metrics: ["自家跑道：OSWorld 环境 / AWS 通道"],
    houseHarness: "osworld",
    lineage: {
      parents: [],
      children: ["osworld", "osworld-verified", "osworld-2"],
      related: ["windows-agent-arena", "androidworld"],
    },
    caveats: `三套不能兑。Verified 高分和 2.0 的 20% 画在同一条折线上，必须加断点。

官方通道和本地 Docker 不是同一个分布。`,
    links: [
      { rel: "homepage", label: "xlang.ai", href: "https://xlang.ai" },
      { rel: "homepage", label: "OSWorld", href: "https://os-world.github.io" },
    ],
  },
  {
    slug: "uk-aisi",
    name: "UK AISI",
    shortName: "UK AISI",
    accession: "OB-2024-O07",
    year: 2024,
    status: "active",
    kind: "org",
    family: "orgs",
    domains: ["安全", "agent 评测"],
    org: "UK AI Security Institute",
    authors: "UK AISI",
    summary:
      "英国 AI 安全研究所。自家跑道 Inspect：任务写成数据集加求解器加打分器，Docker 沙箱，轨迹可回看。适合工具和安全，不适合再套一层 few-shot 选择题。",
    origin: `2024 年需要跑前沿模型的工具使用和安全场景，发现 YAML 选择题框架不够用。Inspect 把评测写成 Python 代码。后来组织名称有演进，引用以官方站点为准。AgentHarm 这类有害工作流评测也走 Inspect Evals。`,
    architecture: `Inspect：Dataset + Solver + Scorer。Solver 可以是带工具的 agent 循环。沙箱 Docker 或 K8s。Inspect View 看轨迹。换 Solver 等于换考试。

它不取代 lm-eval 的选择题主场。你要跑有害工具链或修仓库，这间厨房才对口。`,
    content: `出品是跑道加任务包：Inspect Evals 里有 HumanEval、SWE-bench、AgentHarm、StrongREJECT、WMDP，以及后来的 GDPval 黄金集适配。内容多来自原基准，他们负责嵌进可工具化的运行时。`,
    format: "出题机构",
    metrics: ["自家跑道：Inspect"],
    houseHarness: "inspect-ai",
    lineage: {
      parents: [],
      children: ["inspect-ai", "agentharm"],
      related: ["gdpval", "harbor"],
    },
    caveats: `软件在走，API 会变。锁版本。

轨迹评测的分数含脚手架。同一模型换 Solver，分能跳。`,
    links: [
      { rel: "homepage", label: "inspect.aisi.org.uk", href: "https://inspect.aisi.org.uk/" },
      { rel: "repo", label: "inspect_ai", href: "https://github.com/UKGovernmentBEIS/inspect_ai" },
    ],
  },
  {
    slug: "arc-prize",
    name: "ARC Prize",
    shortName: "ARC Prize",
    accession: "OB-2024-O08",
    year: 2024,
    status: "live",
    kind: "org",
    family: "orgs",
    domains: ["抽象推理", "交互环境"],
    org: "ARC Prize Foundation",
    authors: "Chollet, Kamradt, Knoop",
    summary:
      "Chollet 那条“智能是技能获取效率”的基金会。ARC-AGI 从静网格走到 2026 年没说明书的小游戏。没有 lm-eval 式厨房，竞赛有自己的提交预算和开源许可约束。",
    origin: `2019 年 Chollet 放 Abstraction and Reasoning Corpus，2024 年做成百万美元量级公开赛，2026 年 3 月 ARC-AGI-3 改成交互环境。人 100%，发布时前沿模型低于 1%。名称坚持写 ARC-AGI，就是为了不和 AI2 小学科学 ARC 再撞十年。`,
    architecture: `一代二代是少样本网格变换，允许程序搜索和测试期训练。三代是回合制环境加相对人类动作效率 RHAE。公开集小，私有集才是牙齿。聊天模型看一眼和编码 agent 写世界模型，不是同一个受试者。`,
    content: `ARC-AGI-1、2、3。预览游戏、公开环境、半私有和私有三分。内容刻意避开语言和世界知识。`,
    format: "出题机构",
    metrics: ["竞赛提交 / RHAE"],
    lineage: {
      parents: [],
      children: ["arc-agi", "arc-agi-3"],
      related: ["arc"],
    },
    caveats: `绝对不要和 AI2 ARC 混为一谈。工具链会彻底改变分数含义。

公开集满分不等于解决。达到某百分比也不等于 AGI，Chollet 从一开始就反对这种读法。`,
    links: [
      { rel: "homepage", label: "arcprize.org", href: "https://arcprize.org" },
    ],
  },
  {
    slug: "epoch",
    name: "Epoch AI",
    shortName: "Epoch",
    accession: "OB-2024-O09",
    year: 2024,
    status: "live",
    kind: "org",
    family: "orgs",
    domains: ["趋势", "高难度数学"],
    org: "Epoch AI",
    authors: "Epoch AI",
    summary:
      "画算力曲线的人，顺手造了 FrontierMath 这把锁在保险柜里的数学尺。数字以他们自己跑的为准，厂商博客上的“我们内部测了”要打折。",
    origin: `长期做数据和算力趋势。FrontierMath 把“公开题会被背”做成制度——大部分题不公开。评测仪表盘聚合外部榜单，也跑自己的高难度集。`,
    architecture: `私有题加官方评测运行。外部作者通常报不到全集。看版本标签和跑分日期。没有面向社区的通用 harness 产品，跑道就是 Epoch 自己。`,
    content: `FrontierMath，以及仪表盘上引用的外部活榜。不是又一个 MMLU 镜像。`,
    format: "出题机构",
    metrics: ["官方跑分"],
    houseHarness: "epoch-ai",
    lineage: {
      parents: [],
      children: ["epoch-ai", "frontiermath"],
      related: ["artificial-analysis"],
    },
    caveats: `题锁着，利益结构（部分题由实验室委托）是公开的。读数时把谁出题、谁评分、谁被测放在同一段里。`,
    links: [
      { rel: "homepage", label: "epoch.ai", href: "https://epoch.ai" },
    ],
  },
  {
    slug: "laude-institute",
    name: "Laude Institute / Harbor",
    shortName: "Harbor",
    accession: "OB-2025-O10",
    year: 2025,
    status: "live",
    kind: "org",
    family: "orgs",
    domains: ["终端评测", "容器并行"],
    org: "Laude Institute / Harbor Framework",
    authors: "Merrill et al. / Harbor Framework Team",
    summary:
      "Terminal-Bench 原班人马。2025 年把命令行当成考场，2026 年把跑道重写成 Harbor。模型卡上的 TB 分数，现在默认是 Harbor 跑出来的，不是当年那个 tb CLI。",
    origin: `SWE-bench 仍是对着一个 Git 仓打补丁。真实工程还有一大半发生在终端里。Laude、斯坦福和后来的 Harbor 把评测单元改成一整段终端工作。1.0 在 2025 年 5 月上线，2.0 起官方跑道换成 Harbor，其后 2.1、3.0、4.0 继续换题、修题、拿掉饱和题。

活榜是设计。跨版本比 SOTA，等于把不同难度的卷捏成一条曲线。`,
    architecture: `Harbor：任务是容器加说明加评测器，agent 能装进容器就能跑。本地 Docker 或 Daytona、Modal 一类云沙箱，并发可拉到几百上千。输出轨迹，能喂 RL。数据集带版本标签，terminal-bench@4.0.0 这种。

Terminus 是他们的示例脚手架之一，和 Claude Code、Codex CLI 不是同一场考试。分数首先是系统分。`,
    content: `Terminal-Bench 各版本，Harbor 框架本身，Harbor Hub 上的第三方集。TUA-Bench、LHTB 格式兼容 Harbor，但出题人不是同一拨，别算进 Laude 独家出品。`,
    format: "出题机构",
    metrics: ["自家跑道：Harbor"],
    houseHarness: "harbor",
    lineage: {
      parents: [],
      children: ["terminal-bench", "harbor"],
      related: ["proximus", "tua-bench", "long-horizon-terminal-bench"],
    },
    caveats: `没写 Harbor 版本和数据集标签的 TB 分数，2026 年可以当装饰。

云并行的账单是协议的一部分。4 并发和 500 并发失败模式都不同。`,
    links: [
      { rel: "homepage", label: "tbench.ai", href: "https://www.tbench.ai" },
      { rel: "homepage", label: "harborframework.com", href: "https://harborframework.com/" },
    ],
  },
  {
    slug: "scale-ai",
    name: "Scale AI",
    shortName: "Scale",
    accession: "OB-2025-O11",
    year: 2025,
    status: "active",
    kind: "org",
    family: "orgs",
    domains: ["数据生产", "企业 SWE", "MCP"],
    org: "Scale AI",
    authors: "Scale AI",
    summary:
      "数据公司下场出尺。SWE-bench Pro 接 Verified 被做满之后的班，MCP-Atlas 拿真 MCP 服务器当考场，HLE 是和 CAIS 合伙的专家闭卷。私有集只能信官方榜。",
    origin: `Scale 长期给人标数据。2025 年公开尺子变密：HLE 把专家题做成营销感很重的“人类最后一场考试”，Pro 把 SWE 推进企业仓，2026 年 MCP-Atlas 一千道跨服务器工具题。模式是公开一套、留出一套、商业私有一套。你能复现的永远是最小那份。`,
    architecture: `没有开源成 Harbor 的统一跑道。各基准各有 Docker 和官方榜。MCP-Atlas 用 LLM 法官，和 MCP-Universe 的程序化评测器分道。HLE 主协议自动可评分。Pro 的商业集没有你自己的镜像可以对。

数据生产管道本身是产品。出题质量和争议要一起读。`,
    content: `Humanity's Last Exam（与 CAIS）、SWE-bench Pro、MCP-Atlas。HLE 不完全是 Scale 独家学术产物，Hendrycks / CAIS 的谱系要写上。`,
    format: "出题机构",
    metrics: ["官方榜 / 私有集"],
    lineage: {
      parents: [],
      children: ["humanity-last-exam", "swe-bench-pro", "mcp-atlas"],
      related: ["mcp-universe", "swe-bench-verified"],
    },
    caveats: `私有集不可复现。公开集仍会泄漏。务必声明跑的是哪一份。

HLE 名字夸张。专家题在人文上是否总有唯一答案，从发布当天就有人吵。`,
    links: [
      { rel: "homepage", label: "scale.com", href: "https://scale.com" },
      { rel: "leaderboard", label: "Scale 榜", href: "https://scale.com/leaderboard" },
    ],
  },
  {
    slug: "proximal",
    name: "Proximal",
    shortName: "Proximal",
    accession: "OB-2026-O12",
    year: 2026,
    status: "live",
    kind: "org",
    family: "orgs",
    domains: ["超长程编码", "评测数据"],
    org: "Proximal",
    authors: "Mattern, Chen, Pour et al.",
    summary:
      "2026 年公开的数据实验室。信条是：够难的训练数据，瓶颈不在雇专家，在系统和软件。公开尺子是 FrontierSWE 那面活榜；自家跑道叫 proximus，专门让模型在二十小时里别提前交卷。",
    origin: `Justus Mattern、Calvin Chen、Navid Pour 2026 年 2 月宣布 Proximal。团队背景写着 Cursor、Prime Intellect、Jane Street。他们说自己不是承包商市场，是把数据当研究问题来做的实验室：索引公开代码、给超长程 rollout 做快照、查奖励黑客、自己训开源大模型来试吃。

4 月放出 FrontierSWE。仓库级 issue 已经挤在高分段，他们改出二十小时的项目题。9 月 v2 扩到 34 题，计分改成绝对 mean@5，跑道锁成 proximus。站点 frontierswe.com 把美元和墙钟印在主表上，点格子能看轨迹。这比再发一篇“我们提出新基准”的 PDF 更像他们的产品。

公开评测是副产品，也是广告。主业是给前沿编码 agent 做够难的数据和环境。读他们的尺子，要把“训练数据公司”和“出题人”放在同一段——和 OpenAI 出品 BrowseComp 是同一类结构，只是规模小得多、题硬得多。`,
    architecture: `活榜默认 proximus：mini-swe-agent 加压缩、看图、submit 工具。任务本身是 Harbor 格式，编排器叫 px-eval，仓库写明还在收尾。公开镜像未上，民间复现默认对不上官方榜。

v1 还让 Claude Code、Codex、Grok CLI 各跑各的，系统差把模型差淹没。v2 把这件事收掉。六题对照里，同一模型在 proximus 下比原生长架做得更久、分更高。所以 56% 是 Fable 加 proximus，不是 Fable 本人。

他们还在查作弊：模型把禁用的 PyTorch import 藏进临时目录、用字符编码拼出禁词。审计打零。超长程评测没有反作弊，分数是表演。`,
    content: `公开出品目前就是 FrontierSWE 家族和 proximus。v1 十七题归档在 /v1，v2 三十四题是现在的柜门。题不是 GitHub issue，是有名字的项目：Zig 重写 Git、MEG 解码语音、只看像素跑 TORCS。

内部还有长程 RL 环境和数据管道，不公开成基准。不要把博客里的“我们在解决的问题”写成你可以下载的测试集。`,
    format: "出题机构",
    metrics: ["自家跑道：proximus"],
    houseHarness: "proximus",
    lineage: {
      parents: [],
      children: ["frontierswe"],
      related: ["proximus", "harbor", "laude-institute"],
    },
    caveats: `数据公司出尺，训练和评测的利益可以重合。FrontierSWE 是公开的难尺，也是他们产品的演示。

proximus 专门让模型熬得更久，分数会高于原生长架，这是设计。对照必须锁循环。

仓库仍是 work in progress。没有冻结镜像时，民间数字是自己的实验。`,
    links: [
      { rel: "homepage", label: "proximal.ai", href: "https://www.proximal.ai/" },
      { rel: "leaderboard", label: "FrontierSWE 活榜", href: "https://www.frontierswe.com/" },
      { rel: "homepage", label: "宣布 Proximal", href: "https://proximal.ai/blog/proximal" },
    ],
  },
];
