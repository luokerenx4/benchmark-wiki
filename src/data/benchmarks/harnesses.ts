import type { Benchmark } from "@/lib/types";

export const harnesses: Benchmark[] = [
  {
    slug: "lm-eval-harness",
    name: "EleutherAI lm-evaluation-harness",
    shortName: "lm-eval",
    accession: "OB-2021-H01",
    year: 2021,
    status: "active",
    kind: "harness",
    family: "harnesses",
    domains: ["学术评测运行时"],
    org: "EleutherAI",
    authors: "Gao, Tow, Biderman, Black, et al.",
    summary:
      "开源圈跑 MMLU、GSM8K、BBH 的默认厨房。论文附录里那句“我们用 lm-eval”，多半就是它。它不发明考卷，它决定考卷怎么喂、怎么判，因此同一张 MMLU 换个 YAML 就能差出好几个点。",
    origin: `GPT-3 把 few-shot 变成默认动作之后，每家论文都在自己的笔记本里写 prompt。换一个换行、换一句 “Answer:”，分数就走样。EleutherAI 这帮人——很多是从 GPT-Neo、The Pile 那条开源线上来的——把任务收成 YAML，把模型收成统一后端，让“换个脚本差五分”还能被对质。

它很快变成开源模型卡的地下标准。Hugging Face 的 Open LLM Leaderboard 后端就是它。你在排行榜上看到的 ARC、HellaSwag、MMLU，跑的不是原论文脚本，是这份 harness 的默认模板。默认模板和原论文不一致，是后来无数吵架的源头，也是它存在的意义：至少大家吵的是同一份默认。

仓库一直在长。任务从几十个涨到几百个，后端从 HF 生成到 vLLM、API。v0.4 那次重构把安装和任务格式都改过。引用必须写版本。只写“lm-eval”三个字，等于没写。`,
    architecture: `核心动作就两种。一种是 loglikelihood：把每个选项接在题干后面，看模型给哪段续写的概率高，用来打选择题。一种是 generate：让模型把答案写出来，再抽数字、抽字母、抽代码。两种分数不能兑。MMLU 用对数概率选题，和生成 “The answer is B” 再解析，经常差一截。

任务是 YAML。shot 数、分隔符、few-shot 从哪抽、要不要思维链，都写在配置里。换配置等于换考试。CLI 把模型包成 hf、vLLM 或 API。Open LLM Leaderboard 等于在这套配置上加了一层提交和归一化。

它不替你保证原论文复现。DROP 被从公开榜拿掉，就是一次公开教学：官方移植也会写错计分。用它报分，把任务名、commit、shot、是否 CoT 写全。`,
    content: `内容不是它自己的题，是它包装的题。MMLU、GSM8K、BBH、TruthfulQA、C-Eval、IFEval，以及后来 Leaderboard v2 的那一组，都以任务配置的形式住在仓库里。

每个任务有自己的文档字符串和版本号。同名任务改过 prompt 的事发生过不止一次。你去年的数字和今年的数字，可能不是同一场考试。

它不负责多模态，不负责浏览器，不负责 Docker 里修 Django。那些是 lmms-eval、BrowserGym、Inspect、SWE-bench harness 的活。lm-eval 的主场仍是文本、选择题、短生成。`,
    format: "harness",
    metrics: ["取决于任务"],
    lineage: {
      parents: [],
      children: ["open-llm-leaderboard"],
      related: ["helm", "opencompass", "simple-evals", "eleutherai"],
    },
    caveats: `默认 prompt 不一定等于原论文。把 lm-eval 的 MMLU 写成 Hendrycks 原协议，是最常见的张冠李戴。

任务版本会漂。升级仓库而不锁 commit，纵向对比会假。DROP 事件说明：连“官方移植”都会把计分写错，公开榜会先丢人再发博文。

它测不了智能体轨迹，也测不了“人更想用谁”。拿它的平均分去打 Arena，或者反过来，都是发布会魔术。`,
    links: [
      { rel: "repo", label: "lm-evaluation-harness", href: "https://github.com/EleutherAI/lm-evaluation-harness" },
      { rel: "paper", label: "Lessons from the Trenches", href: "https://arxiv.org/abs/2405.14782" },
    ],
  },
  {
    slug: "helm",
    name: "Stanford HELM",
    shortName: "HELM",
    accession: "OB-2022-H02",
    year: 2022,
    status: "foundational",
    kind: "suite",
    family: "harnesses",
    domains: ["多指标", "透明提示"],
    org: "Stanford CRFM",
    authors: "Liang, Bommasani, Lee, et al.",
    summary:
      "斯坦福 CRFM 那句老话：别只报一个准确率。HELM 把校准、鲁棒、公平、毒性、效率摊在同一张卡上，还把原始请求公开。2026 年 6 月起官方进入维护模式，旧榜还在，别指望它再给你加新科目。",
    origin: `2022 年，基础模型已经是 API 产品，论文却还在各考各的。Percy Liang、Rishi Bommasani 和一大票斯坦福人把这事写成诊断：模型之间共享的场景少得可怜，有的论文甚至完全不重叠。HELM 的野心是画一张地图——任务、领域、语言、风险——然后用同一套适配方式跑过去。

它跟 GLUE 是亲戚：都想用一个平台压住多任务。区别是 GLUE 还在微调分类器，HELM 面对的是闭源 API 和上下文学习。准确率只是七类指标之一。毒性、公平、校准被放进主表，是当时很少有人愿意付的评测税。

后来它裂成许多专项榜：Lite、Instruct、Capabilities、Safety、Long Context、VHELM、MedHELM。名字越来越多，读者越容易把 Lite 的五科 MMLU 当成 57 科。2026 年 6 月 1 日起官方进入维护模式：代码和旧榜保留，不再承诺新功能。活的 HELM 暂停了，档案还在。`,
    architecture: `原论文是大约 16 个核心场景乘 7 类指标，外加一堆定向评测。适配方式主要是上下文学习，prompt 标准化，原始请求和补全公开，这是它相对“只给一个表”的最大礼貌。

场景不是数据集的别名。同一个 MMLU，HELM 的科目子集、prompt、解码，可以和 lm-eval 不是一场考试。HELM Classic、HELM Lite、HELM MMLU 三个入口的题量都不一样。引用必须写哪张榜、哪次发布。

跑一次很贵。原报告大约一千七百万次模型调用。这不是你笔记本上周末能复现的东西。它更像国家气象站：你读它的公报，很少自己再造一座雷达。`,
    content: `核心场景覆盖问答、摘要、情感、毒性分类、检索等，早期以英语为主。定向评测再塞知识、推理、常识、版权背诵、虚假信息。后来的专项榜把多模态、医学、安全、长上下文拆出去。

它不发明多少新题，主要是把别人的题按自己的指标卡重跑。价值在对照和透明，不在“又出了一套高考”。

网页上能点开原始 prompt。这是它教过圈里最有用的一课：分数吵架，先把喂进去的字符串摊开。`,
    format: "套件 + 框架 + 榜",
    metrics: ["多指标"],
    lineage: {
      parents: ["glue", "superglue"],
      children: ["helm-lite", "helm-safety", "helm-long-context"],
      related: ["lm-eval-harness", "stanford-crfm"],
    },
    caveats: `贵，且官方维护模式意味着地图不再更新。用 2022 年的场景结构去概括 2026 年的模型，会漏掉智能体和工具。

HELM 的 MMLU 不是 57 科全文，Lite 更只有大约 5 科。把 HELM 数字写进“MMLU SOTA”而不加括号，是明确的误用。

多指标会被人偷偷折成一个“综合分”。折的权重就是立场。看原表，别看别人帮你平均过的那一列。`,
    links: [
      { rel: "paper", label: "HELM", href: "https://arxiv.org/abs/2211.09110" },
      { rel: "homepage", label: "crfm.stanford.edu/helm", href: "https://crfm.stanford.edu/helm/" },
      { rel: "repo", label: "stanford-crfm/helm", href: "https://github.com/stanford-crfm/helm" },
    ],
  },
  {
    slug: "openai-evals",
    name: "OpenAI Evals",
    shortName: "evals",
    accession: "OB-2023-H03",
    year: 2023,
    status: "superseded",
    kind: "harness",
    family: "harnesses",
    domains: ["YAML 评测注册表"],
    org: "OpenAI",
    authors: "OpenAI",
    summary:
      "2023 年初公开的 YAML 评测注册表，匹配、包含、模型打分三种老语法。GitHub 上那份和后来 API 控制台里的 Evals 产品已经不是一条河。别拿它复现 GPT 技术报告。",
    origin: `ChatGPT 刚爆的时候，OpenAI 把内部评测工具开源了一部分，让外面的人用 YAML 登记自己的小题：字符串匹配、包含检查、或者再叫一个模型来打分。它解决的是“我想赶紧写个检查脚本”，不是“我要一张可引用的学术榜”。

产品侧很快分道。平台文档里的 Evals 是仪表盘功能，GitHub 仓库是遗留注册表。两边的任务、接口、维护节奏都不一样。把仓库当官方方法论，会读到过期的内部题。

真正对齐技术报告的，是后来的 simple-evals：更少、更硬、明确写了零样本加思维链。evals 仓库更像工具箱和历史层。`,
    architecture: `YAML 描述数据集和评测器。评测器是 match、includes、model-graded 这类。模型打分会引入裁判身份、长度偏见，和后来 Arena-Hard、AlpacaEval 是同一类病。

它不是统一的 few-shot 平台，也没有 lm-eval 那么完整的任务版本纪律。很多条目是一次性内部检查，缺少稳定的测试分割。

跑起来依赖当时的 API 习惯。仓库老化之后，复制一份 YAML 不代表你能复制当年的数字。`,
    content: `大量内部和遗留项：小匹配、小分类、早期指令检查。质量不齐，有的像单元测试，有的像演示。

不要在这里找 MMLU 的标准实现。标准实现在 simple-evals 和 lm-eval。

开源的意义是语法和例子，不是一份冻结的能力地图。`,
    format: "harness",
    metrics: ["match / model-graded"],
    lineage: {
      parents: [],
      children: ["simple-evals"],
      related: ["lm-eval-harness"],
    },
    caveats: `不要把它当 OpenAI 技术报告的复现脚本。报告协议在 simple-evals。

GitHub 注册表和产品 Evals 不是同一个东西。搜到哪个用哪个，会把私有仪表盘和公开 YAML 混为一谈。

模型打分条目的裁判模型一旦下线，历史分数就无法复现。`,
    links: [
      { rel: "repo", label: "openai/evals", href: "https://github.com/openai/evals" },
    ],
  },
  {
    slug: "opencompass",
    name: "OpenCompass",
    shortName: "OpenCompass",
    accession: "OB-2023-H04",
    year: 2023,
    status: "active",
    kind: "harness",
    family: "harnesses",
    domains: ["中英评测栈"],
    org: "Shanghai AI Laboratory",
    authors: "OpenCompass contributors",
    summary:
      "上海 AI Lab 的一站式评测栈，中文题比 Eleuther 深，也是国内发模型时最常被点名的对照表。CompassRank 里混着公开题和私有题。多模态后来拆到 VLMEvalKit。",
    origin: `2023 年国内开源模型开始扎堆发，英语 MMLU 一张表没法讲完中文能力。上海人工智能实验室把评测收成 OpenCompass，中英任务、考试、代码、长上下文、安全往一个配置体系里塞。它很快成为 InternLM 系论文和国内模型卡的默认引用。

2024 年初他们把产品拆成 CompassKit、CompassHub、CompassRank：工具、题库浏览器、排行榜。多模态评测在同年交给 VLMEvalKit。名字还叫 OpenCompass 的时候，你要分清自己用的是代码库、是榜，还是已经分家的视觉工具箱。

它和 lm-eval 是平行标准，不是分叉。同一道 C-Eval，两边的默认 prompt 可以不同。国内“开源第一”如果只跑 OpenCompass，和国际表格对不上，不是谁作弊，是厨房不同。`,
    architecture: `配置驱动，Python 里写数据集、模型和评测器。支持规则匹配和 LLM 裁判，也能级联。分布式跑是卖点，适合大模型、大题量。

推荐配置文件（常见 *_gen.py）决定 few-shot、思维链、后处理。换一份推荐配置，C-Eval 就能挪点。引用要写配置文件名和 commit。

CompassRank 混公开题和私有题。能本地复现的和必须信榜的，要在论文里分开画。把私有题平均进“开源可复现 SOTA”，是这套栈最需要防的偷懒。`,
    content: `一百多个数据集的量级：C-Eval、CMMLU、MMLU、GSM8K、AlignBench、MT-Bench、Arena-Hard、RULER、NeedleBench 等都在菜单上。中文考试覆盖是它相对 Eleuther 的主食。

内容来自原基准。OpenCompass 负责包装和默认协议，不负责重新出题。默认协议本身就是一份隐性标准。

视觉任务请看 VLMEvalKit。在主栈里找 MMBench 的老入口，可能会走到过期路径。`,
    format: "harness + 榜",
    metrics: ["取决于任务"],
    lineage: {
      parents: [],
      children: ["vlmevalkit"],
      related: ["lm-eval-harness", "helm"],
    },
    caveats: `推荐配置与 Eleuther 默认不同。跨厨房对比先对 prompt。

CompassRank 含私有题。能下载的分数和榜上的分数不是同一权利。

版本和产品名会裂。写 OpenCompass 2.0、写 CompassRank、写 VLMEvalKit，不要互相替代。`,
    links: [
      { rel: "repo", label: "open-compass/opencompass", href: "https://github.com/open-compass/opencompass" },
      { rel: "leaderboard", label: "CompassRank", href: "https://rank.opencompass.org.cn/home" },
      { rel: "homepage", label: "opencompass.org.cn", href: "https://opencompass.org.cn/" },
    ],
  },
  {
    slug: "anthropic-evals",
    name: "Anthropic model-written evals",
    shortName: "Anthropic evals",
    accession: "OB-2022-H05",
    year: 2022,
    status: "foundational",
    kind: "suite",
    family: "harnesses",
    domains: ["模型写评测", "谄媚", "人格"],
    org: "Anthropic",
    authors: "Perez et al.",
    summary:
      "用语言模型给语言模型出题，专门抓谄媚、人格和一堆当时还不好意思放进主表的行为。公开数据集，不是活榜。题是生成的，所以它测的是行为倾向，不是一张干净的人类考卷。",
    origin: `对齐研究有个很烦的问题：你想测的行为，人类来写题又慢又贵，而且会漏掉你没想到的角。Perez 等人让模型自己写评测，去发现谄媚、权力寻求相关的表述、人格一致性这类东西。论文名字就叫 Discovering Language Model Behaviors with Model-Written Evaluations。

这在 2022 年底相当刺眼：评测不一定要人类出题。它不是 Chatbot Arena，也不是 MMLU。它更像一叠探针，用来问“模型会不会顺着你的偏见说话”。

公开仓库 CC-BY-4.0。后来很多安全套件都从“模型也可以出题”这条路上借过灵感，包括各种红队生成。祖宗是这份，不是 HarmBench。`,
    architecture: `题目由 LM 生成，再经筛选。评测形式随子集变：选择、同意/不同意、续写。没有统一的准确率，只有各行为的分数。

生成题的质量上限就是生成器。错题、重复、美国文化梗，都会进集。把它当心理量表可以，当标准化考试不行。

代码和数据在 anthropics/evals。没有官方每周榜。数字是论文表格和后人复现。`,
    content: `谄媚：用户错了也顺着说。人格：给模型一张人格卡，看它会不会演下去。高级风险相关：关于自我保存、权力的假设性问题。还有一堆社会行为探针。

题干读起来像问卷，不像高考。这是故意的。它想引出倾向，不是考知识。

没有中文本土化官方集。直接翻译问卷，文化目标会漂。`,
    format: "数据集套件",
    metrics: ["任务相关"],
    lineage: {
      parents: [],
      children: [],
      related: ["truthfulqa"],
    },
    caveats: `生成题。标签和题干都可能带模型味。发现的“行为”有多少是出题模型的影子，要保持怀疑。

不是排行榜。模型卡上丢一个 Anthropic evals 总分，通常是把一篮子探针平均错了。

和 TruthfulQA 相关但不是同一件事。一个抓附和谣言，一个抓附和用户。`,
    links: [
      { rel: "paper", label: "Model-Written Evaluations", href: "https://arxiv.org/abs/2212.09251" },
      { rel: "repo", label: "anthropics/evals", href: "https://github.com/anthropics/evals" },
    ],
  },
  {
    slug: "mt-bench",
    name: "MT-Bench",
    shortName: "MT-Bench",
    accession: "OB-2023-H06",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "harnesses",
    domains: ["多轮对话裁判"],
    org: "LMSYS",
    authors: "Zheng et al.",
    summary:
      "八十道题、八个类别、两轮对话，让 GPT-4 打 1 到 10 分或成对比较。它和 Chatbot Arena 是同一篇论文里的孪生兄弟：一个便宜可复现，一个贵但更像真实用户。八十道题太少，区分度很快见底。",
    origin: `Vicuna 那篇东西要证明自己聊得还行，不能只报 MMLU。LMSYS 造了两样：人类成对投票的 Arena，以及这八十道多轮题。MT-Bench 的卖点是快——用 GPT-4 当老师，一夜出分。

八类覆盖写作、角色、推理、数学、代码、知识等，两轮是为了看模型会不会接住上文。它很快变成开源聊天模型的默认“对话分”，直到大家发现 80 题加上裁判偏好，把模型分开的能力其实很差。

Arena-Hard 就是对它的不满：从真用户难查询里抽样，仍然用 LLM 裁判，但题更像战场而不是作文课。`,
    architecture: `每题两轮。第一轮给指令，第二轮追问或改要求。裁判给绝对分或成对胜负。绝对分 1–10 的尺度会被裁判模型的校准带跑，成对更稳一点，也更贵。

八十道题，统计功效极弱。零点几分的平均提升，常常小于裁判噪声。报分至少要写裁判模型版本。GPT-4-0314 和后来的裁判不是同一个老师。

实现在 FastChat 的 llm_judge 目录。中文改编很多，官方只有英文这 80 题。`,
    content: `写作、角色扮演、提取、推理、数学、代码、知识、综合。题是作者出的，不是用户日志。读起来像“请写一封信然后把语气改正式”，不是 Arena 里那种乱七八糟的真提问。

两轮很浅。真正的多轮产品对话比这长得多，也脏得多。

没有工具、没有图像、没有中文官方集。AlignBench 才是认真做的中文多维对话。`,
    format: "LLM 裁判",
    metrics: ["1–10 / win rate"],
    size: "80",
    lineage: {
      parents: [],
      children: ["lmarena", "arena-hard", "alignbench"],
      related: ["alpacaeval"],
    },
    caveats: `太小。用它宣布对话 SOTA，样本不够。

裁判版本敏感。换老师就能换状元。

风格和长度会赢分。后来 AlpacaEval 的长度控制、Arena 的真实投票，都是在补这块。`,
    links: [
      { rel: "paper", label: "MT-Bench + Arena", href: "https://arxiv.org/abs/2306.05685" },
      { rel: "repo", label: "FastChat llm_judge", href: "https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge" },
    ],
  },
  {
    slug: "lmarena",
    name: "LMArena / Chatbot Arena",
    shortName: "LMArena",
    accession: "OB-2023-H07",
    year: 2023,
    status: "live",
    kind: "leaderboard",
    family: "harnesses",
    domains: ["人类偏好"],
    org: "LMSYS / LMArena",
    authors: "Chiang, Zheng, et al.",
    summary:
      "两个匿名模型对打，人点哪个更好用，再用 Bradley-Terry 算出 Elo。它测的是“更想用”，不是“更会考试”。风格、啰嗦、拍马屁都会进分。和 MMLU 放一张幻灯片，是发布会最爱的障眼法，也是它真正有价值的地方。",
    origin: `从 Vicuna 的 demo 长出来。用户愿意为“聊得爽不爽”投票，不愿意为 57 科选择题投票。LMSYS 把这股热情收成盲测战场。域名从 chat.lmsys.org 迁到 lmarena.ai，组织也从学术 demo 长成独立产品。

它补上了静态考卷最假的那一块：真实提示、真实口味、真实厌烦。模型可以考满分却让人觉得像说明书，Arena 会把这件事投出来。

后来裂出代码、视觉、WebDev 等分榜。每一个分榜都是同一套哲学：人说了算，题不是预先印好的。`,
    architecture: `成对盲选，拟合 Bradley-Terry / Elo 类模型。没有标准答案。控制变量几乎不存在。用户自带提示、自带语言、自带耐心。

风格效应被反复写进文献：更长、更礼貌、更会列要点的模型容易赢，即使事实更差。这不是 bug，是偏好。你要的如果是事实，去 SimpleQA；你要的如果是手感，就在这里。

活。每天新对战，排行会动。引用写截止日期和对战量。新模型样本少会上下跳，那是统计，不是能力闪烁。`,
    content: `用户野外提示。什么都有：作业、角色扮演、写代码、吵架、求安慰。分布跟随谁愿意打开这个网站，偏极客、偏英语、偏有电脑的人。

不是固定数据集。你无法把“同一批题”重新喂给新模型。你只能再收集。

分榜把“聊天”切成更窄的人味：写网页、看图、写代码。仍然是偏好，不是单测。`,
    format: "成对人类投票",
    metrics: ["Arena score"],
    lineage: {
      parents: ["mt-bench"],
      children: ["arena-hard", "webdev-arena", "lmsys-vision-arena"],
      related: ["alpacaeval", "lmsys"],
    },
    caveats: `不可本地复现。实验室里没有这份用户群。

不要和静态准确率互换。Arena 第一可以 MMLU 不是第一，这不是矛盾，是两把尺。

投票人群会变。某个月的第一，下个季度用户口味换了就不是。`,
    links: [
      { rel: "leaderboard", label: "lmarena.ai", href: "https://lmarena.ai" },
      { rel: "paper", label: "Arena platform", href: "https://arxiv.org/abs/2403.04132" },
    ],
  },
  {
    slug: "alpacaeval",
    name: "AlpacaEval",
    shortName: "AlpacaEval",
    accession: "OB-2023-H08",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "harnesses",
    domains: ["指令遵循偏好"],
    org: "Stanford Tatsu Lab",
    authors: "Li, Dubois, et al.",
    summary:
      "805 条指令，让 LLM 裁判比较你的模型和一个基线，报胜率。2.0 加了长度控制，因为大家发现写得越长越容易赢。它是便宜的 Arena 代理，也被空模型和啰嗦战术钻过空子。",
    origin: `Alpaca 那波指令微调需要一张不是 MT-Bench 八十题的表。Tatsu Lab 从 AlpacaFarm 的评测指令里拿出 805 条，用 GPT-4 当裁判打对基线的胜率。一夜出分，开源模型卡上迅速多了一栏。

然后长度游戏开始了。模型把答案写成小作文，裁判就觉得更好。作者后来做长度控制的 2.0，声称和 Arena 的相关可以很高。相关高不代表同一件事，只代表代理还算像。

有论文展示过“空模型”一类作弊：让输出对裁判模型的口味，而不是对用户有用。自动偏好评测的天花板，就是裁判的口味。`,
    architecture: `单轮指令。模型生成，裁判对基线（2.0 常用 GPT-4 Turbo）做成对判断。1.0 是原始胜率，2.0 是长度控制胜率。必须写版本。

805 题比 MT-Bench 大多了，仍是单轮、仍是英文、仍是裁判。没有工具，没有多轮追问。

实现和排行榜在 tatsu-lab/alpaca_eval。基线模型一换，历史表就作废。`,
    content: `指令来自 AlpacaFarm 评测集：写作、问答、建议，偏助手日常，不偏高考。读起来像“帮我改这封邮件”，不是 GPQA。

覆盖不到代码仓库、浏览器、中文场景。用它概括“指令遵循”，范围先缩小到英文单轮助手。`,
    format: "LLM 裁判胜率",
    metrics: ["win rate", "LC win rate"],
    size: "805",
    lineage: {
      parents: ["mt-bench"],
      children: [],
      related: ["lmarena", "arena-hard"],
    },
    caveats: `必须报 1.0 还是 2.0 LC。混报是作弊级的马虎。

可被风格和长度游戏。LC 降低了这个问题，没有消灭裁判口味。

和 Arena 高相关，仍是代理。真用户投票不在这 805 条里。`,
    links: [
      { rel: "homepage", label: "AlpacaEval", href: "https://tatsu-lab.github.io/alpaca_eval/" },
      { rel: "repo", label: "tatsu-lab/alpaca_eval", href: "https://github.com/tatsu-lab/alpaca_eval" },
    ],
  },
  {
    slug: "helm-lite",
    name: "HELM Lite",
    shortName: "HELM Lite",
    accession: "OB-2023-H09",
    year: 2023,
    status: "active",
    kind: "suite",
    family: "harnesses",
    domains: ["轻量 ICL 能力"],
    org: "Stanford CRFM",
    authors: "HELM team",
    summary:
      "完整 HELM 太贵，Lite 砍成轻量、广覆盖的上下文学习能力评测。安全另表。这里的 MMLU 只有大约五科，不是 57 科全文。把 Lite 数字写成 HELM Classic，是这套产品线最常见的乌龙。",
    origin: `Classic HELM 一次跑几百万调用，实验室复现不起。2023 年 12 月 CRFM 放出 Lite：保留“多场景对照”的精神，把场景砍到能经常跑的体量，安全问题交给别的专项。

它不是认输，是承认地图要分层。能力一张卡，安全一张卡，长上下文再一张。读者如果只记住 HELM 三个字母，就会把层叠的地图叠成一张假地图。`,
    architecture: `场景子集，协议仍是 HELM 的标准化 ICL。MMLU 在 Lite 里大幅缩科。报分必须写 HELM Lite，并列出场景名单。

网页榜和 Classic 分开。点错入口就会引用错表。`,
    content: `能力向场景：知识、推理、指令一类，刻意不把安全当主菜。具体名单以当时发布页为准，版本会变。

不是 Classic 的缩略复制。有的场景在 Lite 里，有的只在 Classic 里。`,
    format: "套件 + 榜",
    metrics: ["HELM 场景分"],
    lineage: {
      parents: ["helm"],
      children: [],
      related: ["helm-safety"],
    },
    caveats: `Lite MMLU ≠ 57 科。写进总表当 MMLU，直接算错。

不是 Classic 的替代。少了的指标和场景，不是被解决了，是被挪走了。`,
    links: [
      { rel: "homepage", label: "HELM Lite 博文", href: "https://crfm.stanford.edu/2023/12/19/helm-lite.html" },
    ],
  },
  {
    slug: "open-llm-leaderboard",
    name: "Open LLM Leaderboard",
    shortName: "Open LLM LB",
    accession: "OB-2023-H10",
    year: 2023,
    status: "superseded",
    kind: "leaderboard",
    family: "harnesses",
    domains: ["开源模型公开榜"],
    org: "Hugging Face",
    authors: "Fourrier et al.",
    summary:
      "开源权重最有名的公开榜，已经退役。v1 被刷榜和污染缠死，v2 换成更难的一组任务并做归一化。两套平均分不能兑。DROP 还因为计分 bug 被公开拿掉过。当历史档案看可以，当现在的真理不行。",
    origin: `开源模型爆炸之后，大家需要一个提交了就能看见自己排第几的地方。Hugging Face 用 lm-eval 搭了这块看板。v1 是 ARC、HellaSwag、MMLU、TruthfulQA，后来加上 WinoGrande、GSM8K、短暂出现过 DROP。它火得离谱，也因此变成刷榜场：训测试集、套 prompt、挑能涨分的量化。

v2 在 2024 年 6 月换血：IFEval、BBH、MATH 第五级、GPQA、MuSR、MMLU-Pro，并做分数归一化。旧平均和新平均放在一起，是故意让人看不懂的那种不可比。

2025 年 3 月 13 日退役。官方讨论区写得很清楚。还在把“Open LLM Leaderboard 第一”写进 2026 年的幻灯片，是没有看截止日期。`,
    architecture: `提交权重，平台用固定 lm-eval 配置跑。你不能私自改 prompt 还声称同一张榜。这既是公平，也是把默认配置的所有偏见锁死。

v1 和 v2 任务集不同，平均方法不同。v2 的归一化是为了不让某一科的绝对分吞掉总分，也让“总分”更像一种立场。

DROP 从 v1 消失，是因为计分实现被发现有 bug。公开榜会错，而且错的时候已经影响了无数模型卡。`,
    content: `内容就是它选用的那几项学术任务。v1 偏常识和知识 MCQ，v2 偏指令、难题推理和抗污染姿态。都不是用户对话。

开源权重提交。闭源 API 不在这张桌上，所以它从来不是“所有模型”的榜。`,
    format: "leaderboard",
    metrics: ["归一化平均（v2）"],
    lineage: {
      parents: ["lm-eval-harness"],
      children: [],
      related: ["mmlu", "bbh", "gpqa"],
    },
    caveats: `已退役。引用当档案，不当现状。

v1 / v2 不可兑。DROP 事件说明计分也会错。

刷榜是这段历史的一部分，不是脚注。高分先问训练数据有没有靠近测试集。`,
    links: [
      { rel: "leaderboard", label: "HF Space（归档）", href: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard" },
      { rel: "index", label: "归档文档", href: "https://huggingface.co/docs/leaderboards/en/open_llm_leaderboard/archive" },
    ],
  },
  {
    slug: "simple-evals",
    name: "OpenAI simple-evals",
    shortName: "simple-evals",
    accession: "OB-2024-H11",
    year: 2024,
    status: "contested",
    kind: "harness",
    family: "harnesses",
    domains: ["技术报告协议"],
    org: "OpenAI",
    authors: "OpenAI",
    summary:
      "对照 GPT 系技术报告的精简脚本：MMLU、MATH、GPQA、HumanEval，强调零样本加思维链。仓库写明不再积极维护。用它是为了对齐报告里的喂法，不是把它当社区平台。",
    origin: `OpenAI 的模型卡数字经常和社区 lm-eval 对不上。simple-evals 把他们实际用的那套生成式协议摊开：少任务、硬任务、CoT、抽答案。2024 年 4 月公开，目的很窄——让外人少猜。

它明确不是新平台。README 后来写了不积极维护。任务列表以当时的 main 为准，SimpleQA、BrowseComp 等后来也进过这棵树。

和 openai/evals 仓库不是一回事。一个是 2023 年的 YAML 工具箱，一个是 2024 年的报告对照脚本。`,
    architecture: `生成式为主，零样本思维链，答案从文本里抽。这和 lm-eval 默认的 loglikelihood 选题不是一场考试。GPQA Diamond 在这里的数字，不能直接和 Leaderboard v2 的 GPQA 比。

脚本简单，依赖明确。换解码参数就会离报告。要对齐，就按仓库默认跑，别“优化”成自己的 SOTA。`,
    content: `公开说明过的核心：MMLU、MATH、GPQA、HumanEval。后来出现 SimpleQA 等。内容都是原基准，这里只规定怎么问、怎么收答案。`,
    format: "harness",
    metrics: ["取决于脚本"],
    lineage: {
      parents: ["openai-evals"],
      children: [],
      related: ["gpqa", "simpleqa", "browsecomp", "gdpval", "openai"],
    },
    caveats: `不维护。新模型、新任务不会自动出现。

用来对齐报告，不是用来发现新能力。把它当唯一评测栈，会漏掉中文、智能体、多模态。

生成式抽答案对格式敏感。模型爱说话，抽取器会失手。`,
    links: [
      { rel: "repo", label: "openai/simple-evals", href: "https://github.com/openai/simple-evals" },
    ],
  },
  {
    slug: "inspect-ai",
    name: "UK AISI Inspect",
    shortName: "Inspect",
    accession: "OB-2024-H12",
    year: 2024,
    status: "active",
    kind: "harness",
    family: "harnesses",
    domains: ["agent / 安全评测"],
    org: "UK AI Security Institute",
    authors: "UK AISI / Meridian Labs",
    summary:
      "英国 AISI 开源的现代评测框架。任务用 Python 写成数据集加求解器加打分器，适合智能体、工具和安全，而不是再套一层 few-shot 选择题。Docker 沙箱和 Inspect View 是它跟 lm-eval 最大的脾气差别。",
    origin: `2024 年 5 月开源。英国当时的 AI Safety Institute 需要跑前沿模型的工具使用和安全场景，发现 YAML 选择题框架不够用：你得描述环境、工具、轨迹、评分。Inspect 把评测写成代码，而不是配置。

Inspect Evals 是现成任务包：HumanEval、SWE-bench、AgentHarm、StrongREJECT、WMDP 等。它不是新考卷，是新跑道。

后来组织名称和协作关系有演进，引用以官方站点为准。软件引用，不是会议论文。`,
    architecture: `Task = Dataset + Solver + Scorer。Solver 可以是带工具的 agent 循环。沙箱用 Docker 或 K8s。Inspect View 用来看轨迹，这比只看一个成功率重要得多。

它不取代 lm-eval 的选择题主场。你要跑 57 科 MMLU，不必换厨房。你要跑有害工具链或修仓库，这间厨房才对口。`,
    content: `现成包覆盖代码、安全、部分智能体。内容来自原基准，Inspect 负责把它们嵌进可工具化的运行时。

新任务用 Python 描述，灵活性高，纪律靠作者。烂任务也能跑，框架不会替你保证题的质量。`,
    format: "harness",
    metrics: ["取决于任务"],
    lineage: {
      parents: [],
      children: [],
      related: ["lm-eval-harness", "browsergym", "gdpval", "harbor", "uk-aisi"],
    },
    caveats: `偏 agent 和安全。用它跑完不等于覆盖了知识考卷。

轨迹评测的分数含脚手架。同一模型换 Solver，分能跳。

软件在走，API 会变。锁版本。`,
    links: [
      { rel: "homepage", label: "inspect.aisi.org.uk", href: "https://inspect.aisi.org.uk/" },
      { rel: "repo", label: "inspect_ai", href: "https://github.com/UKGovernmentBEIS/inspect_ai" },
    ],
  },
  {
    slug: "vlmevalkit",
    name: "VLMEvalKit",
    shortName: "VLMEvalKit",
    accession: "OB-2024-H13",
    year: 2024,
    status: "active",
    kind: "harness",
    family: "harnesses",
    domains: ["VLM 评测"],
    org: "Shanghai AI Lab",
    authors: "Duan et al.",
    summary:
      "OpenCompass 家族的视觉语言模型工具箱。MMBench、MMMU 这些开源 VLM 论文里的复现，经常从这里出门。和 lmms-eval 是两条平行跑道，同名任务的 prompt 不一定一样。",
    origin: `2024 年，多模态评测把 OpenCompass 主栈撑爆。他们把视觉部分拆成 VLMEvalKit，并在 Hugging Face 上养 OpenVLM Leaderboard。国内开源 VLM 的横向表，很多从此出。

论文发在 ACM MM 2024。工具箱的模型数和基准数跟着 README 涨，引用要写你用的那一版清单。`,
    architecture: `生成式评测为主：模型写答案，精确匹配或 LLM 抽取选项。数据集常是 TSV。默认解码和提示以他们的模型适配器为准。

和 lmms-eval 功能重叠。同一 MMMU，两个 harness 差几个点，先对 prompt 和抽取器，再谈模型。`,
    content: `MMBench、MMMU 以及一长串 OpenCompass 视觉菜单。内容来自原基准。工具箱负责适配器、后处理和排行榜提交。`,
    format: "harness + 榜",
    metrics: ["取决于任务"],
    lineage: {
      parents: ["opencompass"],
      children: [],
      related: ["lmms-eval"],
    },
    caveats: `模型/基准计数随 README 增长。论文里的“我们评了 N 个模型”很快过期。

默认适配器偏他们熟悉的开源 VLM。新模型的接口 bug 会伪装成能力差。

和官方评测服务器（如某些 test 集）可能不一致。`,
    links: [
      { rel: "paper", label: "VLMEvalKit", href: "https://arxiv.org/abs/2407.11691" },
      { rel: "repo", label: "VLMEvalKit", href: "https://github.com/open-compass/VLMEvalKit" },
      { rel: "leaderboard", label: "OpenVLM", href: "https://huggingface.co/spaces/opencompass/open_vlm_leaderboard" },
    ],
  },
  {
    slug: "arena-hard",
    name: "Arena-Hard",
    shortName: "Arena-Hard",
    accession: "OB-2024-H14",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "harnesses",
    domains: ["Arena 代理"],
    org: "LMSYS",
    authors: "Li, Chiang, et al.",
    summary:
      "从 Chatbot Arena 挖 500 道难查询，用 LLM 裁判对 GPT-4-0314 打胜率。它是便宜的 Arena 代理：比 MT-Bench 更像真用户，仍会被文风钻空。后来还有 v2，加了更硬和创意写作子集。",
    origin: `MT-Bench 八十题分不开模型，Arena 又贵又不可复现。LMSYS 从真实对战日志里挖难查询，做成 Arena-Hard-Auto，用自动裁判快速出分。设计目标写得很直白：当 Arena 的廉价影子。

v2 继续加码。题会换，基线会换。报分锁版本。`,
    architecture: `500 题量级，LLM 裁判对固定基线成对比较。基线是 GPT-4-0314 这类老锚点，胜率被解释成“相对这座锚好多少”。锚一换，历史表作废。

自动，可复现实验，不可复现用户。`,
    content: `用户难查询：更长、更绕、更不像作文课。比 MT-Bench 脏，比真实 Arena 干净，因为已经被抽样和格式化。`,
    format: "LLM 裁判",
    metrics: ["win rate vs GPT-4-0314"],
    size: "500",
    lineage: {
      parents: ["lmarena", "mt-bench"],
      children: [],
      related: ["alpacaeval"],
    },
    caveats: `仍然可被风格游戏。代理相关高，不等于同一件事。

必须写 v1 / v2 和基线模型。

难查询的“难”是对当时模型难，不是永远难。`,
    links: [
      { rel: "homepage", label: "博文", href: "https://lmsys.org/blog/2024-04-19-arena-hard/" },
      { rel: "repo", label: "arena-hard-auto", href: "https://github.com/lmarena/arena-hard-auto" },
    ],
  },
  {
    slug: "helm-safety",
    name: "HELM Safety",
    shortName: "HELM Safety",
    accession: "OB-2024-H15",
    year: 2024,
    status: "active",
    kind: "suite",
    family: "harnesses",
    domains: ["安全复跑"],
    org: "Stanford CRFM",
    authors: "Kaiyom, Ahmed, Mai, et al.",
    summary:
      "把已有安全基准收进 HELM 的标准化跑法，覆盖暴力、欺诈、歧视等风险类别。它不是新分类学，是公开、可对照的复跑。HarmBench 等原题还在，这里管协议和一张总表。",
    origin: `能力榜把安全往后放，安全论文又各跑各的攻击。CRFM 在 2024 年 11 月放出 HELM Safety，想提供一张能并排看的公开安全卡。五个基准、六类风险，包括 HarmBench 等。

它承认：安全评测的碎片化，已经让“更安全”三个字没有操作定义。`,
    architecture: `HELM 场景包装。同一套请求记录、同一套适配。分数按原基准的指标走，再在 HELM 表里并排。

标准化会牺牲一些原作者的攻击细节。换来的是模型之间至少在同一喂法下比。`,
    content: `风险类别包括暴力、欺诈、歧视、性、骚扰、欺骗。具体题来自被收入的那些安全基准，不是 CRFM 新出的红队题。`,
    format: "套件 + 榜",
    metrics: ["HELM safety"],
    lineage: {
      parents: ["helm", "harmbench"],
      children: [],
      related: [],
    },
    caveats: `复跑不是新题。原基准的所有缺陷——分类器误差、ASR 定义——都会继承。

并排不等于可平均。六类风险折成一个安全分，会把拒答过火和真的不会攻击混在一起。`,
    links: [
      { rel: "homepage", label: "HELM Safety 博文", href: "https://crfm.stanford.edu/2024/11/08/helm-safety.html" },
      { rel: "leaderboard", label: "榜", href: "https://crfm.stanford.edu/helm/safety/latest/" },
    ],
  },
  {
    slug: "nvidia-eval-factory",
    name: "NVIDIA Eval Factory",
    shortName: "Eval Factory",
    accession: "OB-2025-H16",
    year: 2025,
    status: "active",
    kind: "harness",
    family: "harnesses",
    domains: ["企业包装"],
    org: "NVIDIA",
    authors: "NVIDIA",
    summary:
      "把社区 harness 装进 NGC 容器的工厂，不是新学术基准。lm-eval、simple-evals、VLMEvalKit 在这里变成可交付的企业流水线。分数仍然属于被包装的那个厨房，不属于 NVIDIA 发明的新尺子。",
    origin: `实验室有脚本，公司要的是镜像、权限、调度和报告。NeMo Evaluator / Eval Factory 做的是把已经存在的评测栈产品化。2025 年仓库更公开之后，它作为“包装层”的身份才容易被看清。`,
    architecture: `容器里跑社区工具。配置、密钥、GPU 调度是产品。评测语义——什么叫答对——仍由 lm-eval 或 VLMEvalKit 定义。`,
    content: `取决于你启用的后端任务。没有一份独立的 NVIDIA 考卷藏在里面冒充学术贡献。`,
    format: "harness 包装",
    metrics: ["取决于后端"],
    lineage: {
      parents: ["lm-eval-harness"],
      children: [],
      related: ["opencompass"],
    },
    caveats: `企业包装会改默认版本。容器里的 lm-eval commit 未必是你论文里锁的那份。

不要把 Eval Factory 写进“我们提出新基准”。它是交付，不是出题。`,
    links: [
      { rel: "homepage", label: "NeMo Evaluator docs", href: "https://docs.nvidia.com/nemo/evaluator/latest/" },
      { rel: "repo", label: "NVIDIA-NeMo/Evaluator", href: "https://github.com/NVIDIA-NeMo/Evaluator" },
    ],
  },
  {
    slug: "papers-with-code",
    name: "Papers with Code",
    shortName: "PwC",
    accession: "OB-2018-H17",
    year: 2018,
    status: "active",
    kind: "index",
    family: "harnesses",
    domains: ["论文–代码–SOTA 索引"],
    org: "Papers with Code",
    authors: "community",
    summary:
      "论文、代码、SOTA 表的老索引。找官方仓库很快，LLM 数字常常停在上一代。把它当图书馆目录，别当裁判。自报分数、过期页面、把不可比的协议排在一起，是这里的日常风景。",
    origin: `社区想把“这篇论文的代码在哪、目前谁最高”做成可点的表。它服务了整个深度学习年代，从 ImageNet 到 GLUE。大模型时代之后，真正的活榜是 Arena、HELM、OpenCompass，PwC 的 LLM 页面开始跟不上。`,
    architecture: `人提交或爬取论文数字，挂到数据集和任务下面。没有统一跑分。协议不同的结果会并排显示成 SOTA 竞赛。`,
    content: `论文链接、官方实现、历史表格。对找祖宗仓库极有用。对判断 2026 年的聊天模型几乎没用。`,
    format: "index",
    metrics: ["n/a"],
    lineage: {
      parents: [],
      children: [],
      related: [],
    },
    caveats: `自报、滞后、协议混排。看到 SOTA 两个字，先点进原论文看评测设置。

LLM 页面尤其容易过期。优先 HELM、Arena、原仓库 README。`,
    links: [
      { rel: "index", label: "SOTA", href: "https://paperswithcode.com/sota" },
    ],
  },
  {
    slug: "artificial-analysis",
    name: "Artificial Analysis",
    shortName: "AA",
    accession: "OB-2024-H18",
    year: 2024,
    status: "live",
    kind: "index",
    family: "harnesses",
    domains: ["质量–速度–价格"],
    org: "Artificial Analysis",
    authors: "Artificial Analysis",
    summary:
      "把质量、速度、价格拍在一张采购表上。Intelligence Index 的成分会改版，适合选型，不适合写进学术复现。第三方复跑的细节透明度，通常不如 HELM 那种把原始请求摊开的项目。",
    origin: `API 用户要的不是 MMLU 小数点，是“这个模型又贵又慢但是强，还是又便宜又够用”。Artificial Analysis 把智能指数和延迟、美元放在一起，做成采购仪表盘。`,
    architecture: `第三方复跑加合成指数。成分任务会改。引用必须打开当时的方法论页，写下版本。`,
    content: `闭源和开源 API 的对照。任务组合偏当前流行的硬题和综合指数，不是你本地那份 YAML。`,
    format: "index",
    metrics: ["composite index"],
    lineage: {
      parents: [],
      children: [],
      related: ["epoch-ai", "lmarena"],
    },
    caveats: `合成指数有立场。权重一变，排名就变。

不是学术复现。不要把 AA 指数写成“我们在官方 MMLU 上”。`,
    links: [
      { rel: "index", label: "artificialanalysis.ai", href: "https://artificialanalysis.ai" },
    ],
  },
  {
    slug: "epoch-ai",
    name: "Epoch AI Benchmarking Hub",
    shortName: "Epoch AI",
    accession: "OB-2024-H19",
    year: 2024,
    status: "live",
    kind: "index",
    family: "harnesses",
    domains: ["趋势与高难度"],
    org: "Epoch AI",
    authors: "Epoch AI",
    summary:
      "做数据、算力和评测趋势的研究机构。仪表盘聚合外部榜单，FrontierMath 这把最难的数学尺子也出自这里。题大多锁着，数字以 Epoch 自己跑的为准，厂商博客上的“我们内部测了”要打折。",
    origin: `Epoch 长期画算力曲线和数据集曲线。评测仪表盘是同一份世界观的延伸：能力到底涨得有多快，尺子本身会不会先坏掉。FrontierMath 把“公开题会被背”这件事做成了制度——大部分题不公开。`,
    architecture: `聚合外部来源，加上自己的评测运行。FrontierMath 尤其不能本地复现全集。看他们的版本标签和跑分日期。`,
    content: `趋势图、外部榜单引用、高难度数学。不是又一个 MMLU 镜像。`,
    format: "index",
    metrics: ["n/a"],
    lineage: {
      parents: [],
      children: ["frontiermath"],
      related: ["artificial-analysis", "epoch"],
    },
    caveats: `聚合器会滞后，也会选源。点进原始榜。

FrontierMath 的利益结构（部分题由实验室委托）是公开的。读数时把“谁出题、谁评分、谁被测”放在同一段里。`,
    links: [
      { rel: "index", label: "Benchmarking dashboard", href: "https://epoch.ai/data/ai-benchmarking-dashboard" },
      { rel: "homepage", label: "epoch.ai", href: "https://epoch.ai" },
    ],
  },
  {
    slug: "harbor",
    name: "Harbor",
    shortName: "Harbor",
    accession: "OB-2026-H20",
    year: 2026,
    status: "live",
    kind: "harness",
    family: "harnesses",
    domains: ["终端评测", "容器并行", "RL 轨迹"],
    org: "Harbor Framework / Laude Institute",
    authors: "Harbor Framework Team",
    summary:
      "Terminal-Bench 原班人马重写的评测框架。从 2.0 起它就是官方跑道：任意 agent 塞进容器、云上并行几千个环境、顺手把轨迹留给 RL。模型卡上的 TB 分数，2026 年默认是 Harbor 跑出来的，不是 2025 年那个 tb CLI。",
    origin: `Terminal-Bench 1.0 火了之后，作者每天听三句抱怨：容器评测太慢、想做 RL 没有统一 rollout、agent 框架太多跑不完。Harbor 把原 harness 推倒重来，和 TB 2.0 一起在 2025 年 11 月前后推出，2026 年成为独立框架：harborframework.com，GitHub 在 harbor-framework/harbor。

它不是新考卷。它是跑道。官方示例是一行命令跑 TB 2.0，指定 Claude Code 或 Terminus，指定云厂商。后来 TUA-Bench、LHTB、SWE-rebench 的一部分、SWE-bench Science 的运行器，都开始说自己 Harbor 兼容。2026 年的终端评测生态，有点像当年选择题生态里的 lm-eval——不在这上面跑，别人对不上。

软件引用。Zenodo 有 citable snapshot。版本走得很快，锁包版本和数据集标签。`,
    architecture: `任务是容器环境加说明加评测器。agent 只要能装进容器就能跑。支持本地 Docker，以及 Daytona、Modal、Blaxel 一类云沙箱，并发可以拉到几百上千。输出是轨迹，能喂给 RL / SFT，不只是一个成功率。

数据集走 Harbor Hub，名字带版本：terminal-bench/terminal-bench@4.0.0 这种。跨版本比 TB，等于没比。oracle agent 用来验证任务自己能过，这是贡献新题的卫生检查。

它不替你保证题的质量。烂任务在 Harbor 里同样跑得很快。框架解决的是规模和接口，不是计量哲学。

和 Inspect 的分工：Inspect 从安全与工具评测长出来，Python 里写 Dataset/Solver/Scorer；Harbor 从终端容器长出来，面向任意 CLI agent 和云并行。有重叠，不是同一个社区的默认厨房。`,
    content: `内容是别人的基准。TB、TUA、LHTB、部分 SWE 集，都是 Harbor 能拉下来的数据集，不是 Harbor 自己出的题。

Hub 上还能看到社区基准。发现一道新终端题，按他们的任务格式交，比再写一套 Docker 编排现实得多。

RL 轨迹是一等公民。只当排行榜跑分器，浪费了它相对 2025 年 tb CLI 最大的增量。

文档和 cookbook 比论文完整。引用框架时给 GitHub 和文档版本，不要假装有一篇 Harbor 的 ICLR。`,
    format: "harness",
    metrics: ["取决于数据集"],
    lineage: {
      parents: ["terminal-bench"],
      children: [],
      related: [
        "inspect-ai",
        "tua-bench",
        "long-horizon-terminal-bench",
        "swe-rebench",
        "frontierswe",
        "proximus",
        "laude-institute",
      ],
    },
    caveats: `官方跑道会把非官方复现变成“你自己的数字”。没写 Harbor 版本和数据集标签的 TB 4.0 分数，2026 年可以当装饰。

云并行的账单是协议的一部分。本地跑 4 并发和 Modal 上 500 并发，失败模式都不同：限流、镜像拉取、超时。

框架在走。今天的 CLI 旗标明天可能改名。锁版本，抄 Hub 上的数据集标识。`,
    links: [
      { rel: "homepage", label: "harborframework.com", href: "https://harborframework.com/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/harbor-framework/harbor" },
      { rel: "index", label: "Harbor Hub", href: "https://hub.harborframework.com/" },
    ],
  },
  {
    slug: "proximus",
    name: "Proximus",
    shortName: "Proximus",
    accession: "OB-2026-H21",
    year: 2026,
    status: "live",
    kind: "harness",
    family: "harnesses",
    domains: ["超长程 agent", "压缩上下文", "视觉"],
    org: "Proximal",
    authors: "Proximal / Mattern et al.",
    summary:
      "FrontierSWE 官方最小循环：在 mini-swe-agent 上加压缩、看图、和一只专门让你别提前交卷的 submit 工具。二十小时的评测，没有它，模型会在第三小时交一份半成品然后睡觉。",
    origin: `FrontierSWE v1 还在用 Claude Code、Codex、Grok CLI 各跑各的。系统差把模型差淹没，二十小时预算经常被提前交卷浪费掉。v2 换代时 Proximal 把评测锁进自己的 proximus：本质上是 mini-swe-agent，加了三样为超长程准备的东西——上下文压缩、工作区看图、以及一只 submit 工具，明确告诉模型现在交还是继续干。

v2 博文写得很直白。上下文要爆的时候，把整段轨迹交给同一个模型做摘要，再把轨迹换成这份摘要；细节会丢，所以他们鼓励模型在工作区维护一份 PROGRESS.md，压缩之后还在。视觉任务要看图、看渲染、看视频帧，proximus 允许从工作区读图像。submit 工具让 agent 知道自己还剩多少小时。六题对照里，Claude Opus 5 和尤其是 GPT-5.6 Sol，在 proximus 下比原生长架做得更久、分更高。

他们说会把这套收进 Harbor。在那之前，FrontierSWE 活榜上的数字默认是 proximus 数字。换 Claude Code 再报一个 56%，不是复现。`,
    architecture: `最小编码 agent 循环，不是通用评测平台。任务仍是 Harbor 格式的容器，proximus 负责在里面待满二十小时：读文件、改代码、跑测试、看图、压缩、决定要不要提交。

压缩是有损的。摘要质量等于后半场记忆。PROGRESS.md 是他们给的逃生口，实际上每个模型都把它当主日志。换一套不写进度文件的循环，后十小时会失忆。

视觉不是装饰。v2 有若干题的证据在像素里，关掉看图等于没考那几题。submit 工具改变了激励：模型被明确告知预算，提前交卷是策略，不是超时事故。

它不调度云上五千个容器，那是 Harbor 的活。proximus 解决的是“同一个容器里，人怎么熬过二十小时还不交白卷”。`,
    content: `没有自己的考卷。内容是 FrontierSWE 的 34 题，以及任何被塞进这套循环的超长程 Harbor 任务。

官方榜只用它。民间用 Codex 或 Claude Code 跑同一道 Postgres-on-SQLite，数字不能并进 frontierswe.com 的表。

进度文件、轨迹摘要、提交时机，全是分数的亲爹。只换模型不换这三样，名次仍可能翻。

仓库和 px-eval 还在收尾。引用 proximus，要写你跟的是 v2 博文里的那一版，还是后来并进 Harbor 的那一版。`,
    format: "harness",
    metrics: ["取决于任务"],
    lineage: {
      parents: ["harbor"],
      children: [],
      related: ["frontierswe", "terminal-bench", "inspect-ai", "proximal"],
    },
    caveats: `最小循环不是中立跑道。它专门让模型熬得更久，分数会高于原生长架，这是设计，不是模型变强。对照实验必须锁循环。

压缩会丢细节。后半场翻车，有时是摘要把关键约束写没了。PROGRESS.md 写得差的模型，看起来像能力差，其实是记忆被剪了。

并进 Harbor 之前，复现路径不稳定。没有公开镜像、没有冻结的 CLI 版本时，民间数字默认是自己的实验，不是官方榜。`,
    links: [
      { rel: "homepage", label: "v2 说明里的 proximus", href: "https://www.frontierswe.com/blog/v2" },
      { rel: "homepage", label: "FrontierSWE 活榜", href: "https://www.frontierswe.com/" },
      { rel: "repo", label: "FrontierSWE v2", href: "https://github.com/Proximal-Labs/frontier-swe-v2" },
    ],
  },
];
