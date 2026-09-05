import type { Benchmark } from "@/lib/types";

export const math: Benchmark[] = [
  {
    slug: "gsm8k",
    name: "GSM8K",
    shortName: "GSM8K",
    accession: "OB-2021-M01",
    year: 2021,
    status: "contested",
    kind: "benchmark",
    family: "math",
    domains: ["小学应用题", "算术推理"],
    org: "OpenAI",
    authors: "Cobbe et al.",
    summary:
      "八千余道小学数学应用题，定义了生成式数学评测的基本语法：逐步演算，最后报一个数字。它一度难倒大模型，现在前沿模型已经做满，圈里的污染和模板记忆讨论也没停过。",
    origin: `2021 年 OpenAI 要训一个 verifier，需要一批答案短、步骤长、人能写、机器能自动对的应用题。Cobbe 等人用众包写出大约 8.5k 道小学水平题，要求逐步演算再给出最终数字。GSM8K 就这样从训练配套数据变成了公开考卷。

它和同年的 MATH 很快组成模型卡上的数学双栏。2022 到 2024 年几乎每张技术报告都得报一栏 GSM8K，分数从百分之十几一路涨到接近满分。宣传口径也跟着变：这不再是“小学题”，而被说成“多步数学推理”。

分数飞涨之后，质疑来得很快。题面公开、模板高度重复，预训练里见过原题并不稀奇。Apple 的 GSM-Symbolic 把名字和数字一换，分数就抖；GSM-Plus 加干扰条件，分数再掉一截；另有 GSM1k 一类平行卷专门盯污染。说人话：GSM8K 已经从尺子变成了病理学标本。`,
    architecture: `协议很简单：题干进去，模型写出推理过程，最后抽出一个数字答案。常用 greedy 准确率，或者 self-consistency 多数票。官方早期还训过 verifier 给候选打分，那是后来过程奖励模型的远亲。

抽取规则并不统一。lm-eval、simple-evals 各有各的正则，有的认“The answer is”，有的认最后一行。是否 CoT、几个 shot、温度多少，都会改分。报分必须把这些写清楚，否则两三个点的差距可能只是抽答案抽漏了。

它测的是短答案算术，不是证明，也不是符号推导。最终答案几乎都是整数，自动判分便宜，这是它能变成工业默认栏的真正原因。`,
    content: `题材是英语小学应用题：四则、比例、行程、简单代数，偶尔掺一点单位换算。数字不大，步骤一般三到八步。语言是自然语言故事，不是形式化命题，也几乎没有需要画图的几何。

规模写在纸面上：训练集 7,473，测试集 1,319，合计约 8,792。测试集才一千多道，对当代模型已经没有区分度，但对早期 Codex 一代曾经很难。答案以整数为主，这是自动判分能工业化的前提。

题面高度模板化。同一种“先买再找零”的故事可以换人名、换物价重复出现。这既方便众包，也给记忆和污染留了门。GSM-Symbolic 后来就是把这些模板写成符号再随机实例化。

它不覆盖竞赛、证明、大学定理。内容天花板就是小学应用题。谁把 GSM8K 的题型说成“数学推理的全部”，是在用最甜的那一段代表整条河。`,
    format: "应用题生成，最终数字",
    metrics: ["Accuracy"],
    size: "8,792 题（测试 1,319）",
    lineage: {
      parents: ["drop"],
      children: ["gsm-symbolic", "gsm-plus", "processbench"],
      related: ["mmlu", "bbh", "math"],
    },
    caveats: `前沿模型已经饱和。再用 GSM8K 宣称“数学推理能力”是在说 2022 年的话。分数接近满分，只说明模型会做这套小学卷，不说明它会竞赛，更不说明它会证明。

污染讨论从 2023 年起就没停过。公开测试集被网页、博客、GitHub 镜像转载无数次，预训练撞上原题并不需要阴谋。GSM-Symbolic 证明：数字一换，分数就变成一条分布，而不是一个点。GSM-Plus 证明：加一句废话也能把模型打懵。

报分时至少声明 CoT、shot 数和抽取器。不要把 GSM8K 和 MATH、AIME 横比，难度完全不在一个年级。若还想谈小学算术，应改看扰动集或新出的平行卷，而不是原测试集。`,
    links: [
      { rel: "paper", label: "GSM8K 论文", href: "https://arxiv.org/abs/2110.14168" },
      { rel: "repo", label: "GitHub", href: "https://github.com/openai/grade-school-math" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/openai/gsm8k" },
    ],
  },
  {
    slug: "math",
    name: "MATH",
    shortName: "MATH",
    accession: "OB-2021-M02",
    year: 2021,
    status: "contested",
    kind: "benchmark",
    family: "math",
    domains: ["竞赛数学", "高中"],
    org: "UC Berkeley",
    authors: "Hendrycks et al.",
    summary:
      "一万两千余道 AMC/AIME 风格竞赛题，按科目与难度分层，把“生成完整解题再抽 boxed 答案”写成标准协议。它不是 MATH-500，也不等于 Minerva 那套 sympy 判分。",
    origin: `Hendrycks 一组认为小学应用题测不到竞赛推理。他们从 AMC、AIME 等公开竞赛和教材收集 12,500 题，每题带逐步解法和难度 1 到 5，做成 MATH。论文全称其实是 Mathematics Aptitude Test of Heuristics，圈里直接叫 MATH。

它把“生成完整解题过程，再从 boxed 标记里抽最终答案”变成领域语法。PRM800K、MATH-500、OlympiadBench、AIME 评测、后来的奥赛集，都站在这条线上。2022 年 Minerva 又给它加了一层 sympy 等价判定，于是同一份 MATH 在不同 harness 里可以差出假分差。

2024 年之后头部模型把总分做满，区分度交给 AIME 和 FrontierMath。模型卡上仍常出现“MATH”，但仔细看，很多已经偷偷换成了 500 题切片，或者用了 Minerva 协议。三套东西名字长得像，分数不能兑。`,
    architecture: `题干生成解答，从 boxed 或等价标记抽最终答案。常报总体准确率，以及按七个科目、五个难度的分解。CoT 是默认，不是可选项。难度 5 的子集有时被单独拿出，当作“还没饱和”的最后一块。

判分是战场。原论文偏字符串匹配；Google Minerva 用 4-shot 固定提示，再用 sympy 判断 1/sqrt(3) 和 sqrt(3)/3 是否等价，整体大约能抬一个点。Eleuther lm-eval 因此拆成 hendrycks_math 和 minerva_math 两套任务。有人报 MATH，其实跑的是 Minerva 协议，有人报 MATH，其实只跑了 500 题。

完整测试集有五千题，反复跑很贵，这才催生 MATH-500。协议看起来都是“竞赛题生成”，实现差一个抽取器、一个 shot 模板、一个是否 sympy，排名就能翻。`,
    content: `七个科目：Prealgebra、Algebra、Number Theory、Counting and Probability、Geometry、Intermediate Algebra、Precalculus。难度 1 到 5，五分题接近奥赛入门。几何可用 Asymptote 语言在文本里画图。

训练集 7,500，测试集 5,000，合计 12,500。题面是 LaTeX 夹着英语。答案形态比 GSM8K 杂：分数、根式、表达式、有时是区间或集合。

来源是公开竞赛与教材，不是新出的私有题。这是它后来污染严重的结构原因：AMC/AIME 真题在网上到处都是，带逐步解答的镜像更多。`,
    format: "竞赛题生成，可自动核验答案",
    metrics: ["Accuracy"],
    size: "12,500 题",
    lineage: {
      parents: [],
      children: ["math-500", "prm800k", "olympiadbench", "aime"],
      related: ["gsm8k", "mmlu", "minif2f"],
    },
    caveats: `公开题污染严重。把 MATH 总分写成“数学能力”已经不成立：2025 年前后沿模型偏易，应改看 AIME 指定年份或 FrontierMath。

MATH、MATH-500、Minerva sympy 协议是三件事。全量测试五千题；MATH-500 是 Let's Verify Step by Step 冻住的 500 题切片；Minerva 是 4-shot 加 sympy 等价。simple-evals 默认 MATH-500，lm-eval 默认还可能是另一套。不要把这三栏的数字互相换算。

答案抽取实现不一致会导致假分差。同一模型换一个 boxed 解析器，就能进出几个点。报分至少写清：全量还是 500，是否 Minerva 提示，是否 sympy。`,
    links: [
      { rel: "paper", label: "MATH 论文", href: "https://arxiv.org/abs/2103.03874" },
      { rel: "repo", label: "GitHub", href: "https://github.com/hendrycks/math" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/hendrycks/competition_math" },
    ],
  },
  {
    slug: "minif2f",
    name: "miniF2F",
    shortName: "miniF2F",
    accession: "OB-2021-M03",
    year: 2021,
    status: "foundational",
    kind: "benchmark",
    family: "math",
    domains: ["形式化定理", "奥赛", "Lean"],
    org: "OpenAI",
    authors: "Zheng, Han, Polu",
    summary:
      "把奥赛级题目对齐到 Lean、Isabelle、Metamath、HOL Light 的跨系统小集。形式化本身有一批错题和弱化，分数要看你用的是哪个 fork。",
    origin: `形式化定理证明长期各写各的数据集，Lean 一份、Isabelle 一份，题对不上。OpenAI 把 IMO、AIME、A-Level 一类题目同时落到多个证明助手，做成 488 题的 miniF2F，让“同一道奥赛题在不同证明器里”第一次能对照。

它很快变成 Lean 浪潮里被引用最多的小集。AlphaProof、各种 tactic 模型、自动形式化流水线，技术报告里几乎都会出现 miniF2F 通过率。规模小、题源显赫，正好适合当第一栏。

麻烦也跟着来。形式化不是复印：漏掉一个假设，题就变容易；写错一个量词，题就不可证。GitHub 上很早就有人列错题。Facebook 的 fork 宣称修了很多陈述，DeepMind 的 Lean 4 叉声明“已知假命题已去掉”，后来还有人统计：相当一部分形式命题和自然语言对不上。`,
    architecture: `给定形式化命题，搜索或生成证明，由证明器核验。主指标是通过率。不同系统的库、tactic 语言和搜索预算不可直接比分数，但题面号称是对齐的。

实际对齐很脆。Lean 3 原版、Lean 4 移植、Isabelle、Metamath 各有一份，fork 还在继续分叉：facebookresearch、yangky11 的 Lean 4 港、Kimina、Harmonic、DeepMind 各修各的。报分必须写仓库、commit 和证明器版本。

它评的是“会不会写出内核接受的证明”，不是“会不会做这道奥赛填空”。自然语言做对 AIME，和在 Lean 里证过，是两件能力。`,
    content: `244 验证加 244 测试，共 488 题。来源包括 IMO、AIME、AMC 与教材习题，难度从常规高中到奥赛。每题尽量在多个证明器里都有一份陈述，这是它相对单系统 Lean 集的卖点。

题量小是设计，不是疏忽。形式化成本高，人工对齐更贵。它的价值是跨系统对照，不是覆盖所有数学分支。代数偏多，分析、几何的形式化难度完全不同，通过率不能当成“数学证明已解决”。

非正式题面和正式命题经常不是同一件事。有的形式化漏了定义域，有的把“证明并指出等号何时成立”收成一个不等式，有的直接不可证。GitHub issue 和后续论文列过一批这类洞，Facebook、DeepMind 的 fork 都在修。

读内容时要把“题源是奥赛”和“你证明的是那份 Lean 陈述”分开。后者才是模型真正面对的对象，也是误形式化会改写难度的地方。`,
    format: "形式化命题 → 可核验证明",
    metrics: ["Pass rate"],
    size: "488 题",
    lineage: {
      parents: ["math"],
      children: ["putnambench", "formalmath"],
      related: ["aime", "theoremqa"],
    },
    caveats: `规模小，部分题已被后续模型与 tactic 打穿。更麻烦的是误形式化。公开讨论和后续论文都指出：不少陈述比原题弱、比原题强，或者根本证不成。把通过率当成“奥赛证明能力”会系统性偏高或偏低，取决于你抽到的是哪一批错题。

跨证明器分数不能当同一把尺子。Lean 4 加 mathlib 的搜索空间，和 Isabelle 的 sledgehammer，不是同一场考试。fork 之间的题集也不再是同一份 miniF2F。

引用时写清版本。说“miniF2F 过了百分之多少”而不写仓库，等于没报。新工作应优先看已修正的 Lean 4 端口，而不是 2021 年那份原仓库。`,
    links: [
      { rel: "paper", label: "miniF2F 论文", href: "https://arxiv.org/abs/2109.00110" },
      { rel: "repo", label: "GitHub", href: "https://github.com/openai/miniF2F" },
    ],
  },
  {
    slug: "theoremqa",
    name: "TheoremQA",
    shortName: "TheoremQA",
    accession: "OB-2023-M04",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["定理应用", "大学 STEM"],
    org: "UC Santa Barbara / Google 等",
    authors: "Chen et al.",
    summary:
      "八百道必须调用定理才能做的大学问答，答案是数、方程或选项。它卡在竞赛技巧和实验室技能中间：先想起哪条定理，再代入。",
    origin: `作者觉得现有数学基准要么是小学应用题，要么是竞赛技巧，缺的是大学课堂上那种“先想起定理再代入”的场景。TheoremQA 覆盖数学、物理、金融、CS，明确要求模型使用给定或应知的定理，而不是靠小学算术硬推。

它处在 MATH 与 SciBench 之间：不是奥赛，也不是实验。2023 年大模型开始卷大学知识，MMLU 的理科是选择，TheoremQA 改成要给出数或公式，更接近作业而不是四选一。这把“会不会点名定理”从常识选择题里拆了出来。

后续 GPQA、SciBench、LAB-Bench 把科学能力继续拆开。TheoremQA 留下来的位置很窄，但很清楚：闭卷或开卷地用定理。它没有成为新的工业默认栏，却是大学 STEM 生成式评测里经常被漏掉的那一档。`,
    architecture: `题干生成短答案（数值、公式、列表）或选择。自动核验为主。协议可以提供定理列表当开卷，不提供则是闭卷，两者难度差一截，必须声明。同一模型开卷和闭卷差十几个点并不稀奇。

公式等价性是痛点。同一条方程可以写成不同符号、不同整理顺序。字符串匹配会误杀，符号计算也不总是稳。报分时最好说明核验器是精确匹配、数值容差，还是某种等价判定，否则表上的分差可能只是整理方式不同。

它不是证明基准。模型不必在 Lean 里复述定理，只要会用。这和 miniF2F、PutnamBench 的形式化路线是两条腿。TheoremQA 高分不代表能证明该定理，低分也不代表没见过它的名字。`,
    content: `约 800 题、350 多条定理，来自教材与课程。领域含微积分、线性代数、数论、电路、金融定价一类。答案形态混杂：一个数、一个表达式、一个选项，不能用单一的整数匹配打发。

题量中等，覆盖面比 MATH 的竞赛科目更“大学”。不少题离开那条定理就会变成瞎算。这是它相对 GSM8K 的差别：缺的不是算术，是该用哪一条，以及代入时符号有没有弄反。

语言以英语为主。定理名称、符号约定来自教材，不保证与模型预训练里的叫法一致。同一条定理在不同课本里的编号和条件也不一样，开卷列表能缓解这件事，闭卷则不能。读内容时按领域拆，别被八百道的平均数骗过去。`,
    format: "定理驱动 QA",
    metrics: ["Accuracy"],
    size: "约 800 题",
    lineage: {
      parents: ["math"],
      children: [],
      related: ["scibench", "minif2f", "gpqa"],
    },
    caveats: `自动核验公式等价性并不完美，假阴性会压低分数。开卷给定理列表和闭卷“你应该知道”是两种考试，混报没有意义。谁只给一个 TheoremQA 百分数，先问他开不开卷。

规模中等，区分度有限。头部模型在部分子集上已经偏易，但换一个需要正确展开定理的表达式，分数会掉。不要用它代表研究级数学，也不要用它代表实验技能。

和 GPQA 的研究生选择、SciBench 的计算题不是同一把尺。TheoremQA 问的是“会不会用这条定理”。会背定理名字、会做选择题、会把定理写成 Lean，是三件相邻但不相同的事。TheoremQA 只量第一件里“会不会代入”的那一层。`,
    links: [
      { rel: "paper", label: "TheoremQA 论文", href: "https://arxiv.org/abs/2305.12524" },
      { rel: "repo", label: "GitHub", href: "https://github.com/wenhuchen/TheoremQA" },
    ],
  },
  {
    slug: "scibench",
    name: "SciBench",
    shortName: "SciBench",
    accession: "OB-2023-M05",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["大学理科", "计算题"],
    org: "UCLA",
    authors: "Wang, Hu, Lu et al.",
    summary:
      "大学物理、化学、数学教材上的计算题，强调多步数值推理，并允许工具。它把“科学能力”从闭卷常识拉到大学作业难度。",
    origin: `MMLU 的理科题是选择；作者认为那测的是识记，不是演算。SciBench 改成要算出数的教材题，并允许计算器或代码。2023 年正是工具增强开始被认真对待的时候，这份基准把“能不能写出中间式子并算对”放回科学评测，而不是再刷一轮四选一。

它和 GPQA 的研究生选择、LAB-Bench 的实验技能、SciCode 的模拟代码互补。同一句“模型懂科学”，四份卷子说的不是一件事。SciBench 站在作业这一档：合上课本之后，这道计算题还能否做出来。

教材题意味着来源公开。污染风险不如 GSM8K 那么吵，但大学题解网站同样密集。读分时仍要当可能见过，不当神迹。工具协议若再叠上去，分数里混的就更不止记忆了。`,
    architecture: `开放计算题，答案多为数值或短表达式。协议可含 CoT、程序辅助或外部工具。主指标准确率，数值题通常给容差；单位和有效数字处理不当会改分。报一个 SciBench 百分数而不写容差，等于没说判分规则。

工具协议与纯文本协议不可比。允许 Python 的模型可以把积分丢给库，纯文本模型必须手推。论文里这两种设定是分开的，转述时经常被合成一个数，再拿去和 MATH 横比。

它不是多选题，蒙猜的空间比 MMLU 小，但自动判分对表达式仍然挑剔。单位写成 SI 还是 CGS、π 写成 3.14 还是符号，都会进出分数。协议要比分数先被写下来。`,
    content: `约 869 道来自教材的大学题，覆盖经典力学、电磁、物化、有机、微积分等。题面是作业风格：给条件，求一个量，中间往往要写公式、代数字、处理单位。

难度定位在本科课程，不是奥赛，也不是研究。需要的是公式记忆加多步代数，而不是新的证明想法。部分题对单位制和常数敏感，抄错 g 或者忘了弧度制就会整题报销。

规模不大，科目却杂。总分会把物理算对、化学算错平均掉。分科看比看一个准确率有用，也更能暴露模型到底是“会微积分”还是“会刷平均”。八百多道已经够用来看偏科，不够用来宣称科学通才。`,
    format: "大学计算题，开放生成",
    metrics: ["Accuracy"],
    size: "约 869 题",
    lineage: {
      parents: ["math"],
      children: [],
      related: ["gpqa", "theoremqa", "lab-bench", "scicode"],
    },
    caveats: `数值容差与单位处理会影响分数。同一个 3.14 和 π，有的核验器认，有的不认。工具协议必须声明，否则“SciBench 高分”可能只是会调库，和手推完全不是一场考试。

不要把它说成实验能力。算出课后习题，和会搭电路、会跑凝胶不是一回事。LAB-Bench 才往实验室技能上靠，GPQA 才往研究生闭卷上靠。

教材来源公开，存在泄漏可能。规模中等，适合作为科学推理的一栏，不适合单独撑起“STEM 能力”的标题。谁只用 SciBench 谈科学，请把工具开关和分科分数一并摊开。课后习题做得对，仍然只是课后习题。`,
    links: [
      { rel: "paper", label: "SciBench 论文", href: "https://arxiv.org/abs/2307.10635" },
      { rel: "repo", label: "GitHub", href: "https://github.com/mandyyyyii/scibench" },
    ],
  },
  {
    slug: "prm800k",
    name: "PRM800K",
    shortName: "PRM800K",
    accession: "OB-2023-M06",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "math",
    domains: ["过程监督", "步骤标注"],
    org: "OpenAI",
    authors: "Lightman et al.",
    summary:
      "八十万条 MATH 解题步骤对错标签，用来证明过程奖励比结果奖励更会找错。它既是训练集，也把“过程对错”变成可评测对象。",
    origin: `Let's Verify Step by Step 想回答一个当时很时髦的问题：监督每一步，是否比只看最终答案更能提升数学。OpenAI 在 MATH 解题轨迹上标了约 80 万步，训出 process reward model，并在一个 500 题切片上做 best-of-N。

这篇工作有两个副产品，都比原论文的 PRM 分数更长寿。一是 MATH-500 这个被冻住的测试切片，后来被 simple-evals 当成默认 MATH。二是“过程对错可以标、可以训、可以评”这条生产线，直接催生 ProcessBench。

它不是一张考试卷。有人把它当基准报，有人把它当训练数据吃。两种用法都成立，但不能混成一个榜。`,
    architecture: `逐步对错分类，用于训练 process reward model。评测常用两条：步骤级分类指标，以及用 PRM 做 best-of-N 时在 MATH 子集上的准确率。后者测的是“挑轨迹的能力”，不是“自己做题的能力”。N 多大、生成器是谁，都属于协议。

标注绑定特定解题风格。人工按某种步骤切分来打对错，换一种 CoT 写法，标签分布就会偏。后来的 PRM 若在别的生成器轨迹上评估，不能默认迁移。ProcessBench 后来就是在测这种迁移。

配套放出的 500 题切片，成为工业界省钱的 MATH。PRM800K 因此同时是数据卡和评测史里的一个分叉点：训练走步骤标签，测试走 MATH-500，两件事经常被写成同一栏。`,
    content: `MATH 问题上的人工逐步标注，含正确与错误中间步。规模约 80 万步。轨迹来自模型解题，不是教材标准答案的逐行翻译，所以步骤的切法和人类奥赛教练习惯的写法不必相同。

每一步被标成对或错，用来训一个给中间过程打分的模型。最终答案对但中间有错的轨迹也被留下来，这正是过程监督相对结果监督的卖点：只看 boxed 数字会放过这些轨迹。

数据许可与使用方式以仓库为准。它首先是 OpenAI 的研究发布，不是长期维护的活榜。内容会过时，因为解题风格在变；当训练数据用可以，当永恒考卷用不行。步骤标签跟着那一代解题风格走，换一代 CoT 就要重新标。`,
    format: "步骤级对错标注",
    metrics: ["Step classification", "Best-of-N accuracy"],
    size: "约 80 万步标注",
    lineage: {
      parents: ["math"],
      children: ["math-500", "processbench"],
      related: ["gsm8k"],
    },
    caveats: `PRM 分数与最终答题准确率不是一回事。一个模型可以自己做不对 MATH，但很会给别人的步骤打分，反过来也成立。Best-of-N 还依赖生成器质量和 N 的大小，把 best-of-N 写成模型本体能力会夸大。

标注绑定特定解题风格，换模型、换温度、换步骤切分，原 PRM 就会过时。ProcessBench 后来用更新的生成器和更难的题，就是在测这种泛化：在 GSM8K 上会找错，到奥赛轨迹上不一定会。

不要把 PRM800K 当成新的数学考试。它是过程监督的参考实现和训练资源。数据怎么用，先看仓库许可。在上面微调再在 MATH-500 上报 best-of-N，要写清楚生成器和 N。`,
    links: [
      { rel: "paper", label: "Let's Verify Step by Step", href: "https://arxiv.org/abs/2305.20050" },
      { rel: "repo", label: "GitHub", href: "https://github.com/openai/prm800k" },
    ],
  },
  {
    slug: "math-500",
    name: "MATH-500",
    shortName: "MATH-500",
    accession: "OB-2023-M07",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["竞赛数学", "子集"],
    org: "OpenAI",
    authors: "Lightman et al.",
    summary:
      "MATH 测试集上固定的 500 题切片，被 simple-evals 和技术报告当成省钱的 MATH。它不是新题，也不是分层抽样的官方新考卷。",
    origin: `完整 MATH 测试集有五千题，反复跑很贵。Let's Verify Step by Step 采样了 500 道作为代表切片，用来展示 PRM 的 best-of-N。OpenAI simple-evals 原样沿用，于是 MATH-500 变成 2024 年后技术报告里的默认 MATH 栏。

圈里的偷换很常见：标题写 MATH，脚注才说是 500 题；或者和 Minerva 的全量 sympy 协议横比。读者若只看表头，会以为这是 Hendrycks 那 5,000 题。

它能活下来，是因为便宜、固定、和 PRM 文献连续。它不该活成“MATH 的官方继承者”。`,
    architecture: `协议与 MATH 相同：CoT 生成，抽 boxed 答案。因为是固定 500 题，一次评测的方差比全量小，但偏差取决于当年那次抽样——不是按科目和难度严格分层的新考卷。Level-5 占比不必等于全量。

simple-evals 把它当成参考实现。很多开源复现直接拉 HuggingFaceH4/MATH-500。判分仍可能掺进 Minerva 式 sympy，于是“MATH-500 + sympy”又是第三种数字，和 Hendrycks 原协议、Minerva 全量协议都对不上。

不要用 500 题分数去反推全量 MATH。子集更容易被过拟合，也更容易被预训练撞上。技术报告里把 MATH-500 简写成 MATH，是给读者下套，不是省字。`,
    content: `MATH 测试集的 500 题，覆盖原科目与难度，但抽样过程不是一份新的公开规范。题面、解答、boxed 答案都来自原集，没有新出的竞赛题，也没有私有 holdout。

因为反复出现在技术报告里，这 500 题的暴露度远高于剩下的 4,500。污染与刷题风险因此比母集更高，尽管母集本身已经够公开。谁在这 500 题上做训练还当测试，属于公开的泄漏。

它没有新的学科覆盖，也没有新的难度带。所有关于竞赛数学的结构评论，都应该回到 MATH 条目，而不是把切片当成新物种。它存在的理由是省钱和可复现，不是更难。五百题被写进无数技术报告之后，本身已经变成一张过熟的小卷。`,
    format: "竞赛题生成",
    metrics: ["Accuracy"],
    size: "500 题",
    lineage: {
      parents: ["math", "prm800k"],
      children: [],
      related: ["openai-simple-evals", "aime"],
    },
    caveats: `和全量 MATH 分数不能换算。切片已极度暴露，污染与过拟合风险高于原集。2025 年还把 MATH-500 当主数学栏，区分度已经不够，该看 AIME 指定年份或更硬的私有集。

它也不是 Minerva 协议。Minerva 是对（通常是全量）MATH 的 4-shot 加 sympy 等价；MATH-500 只是题量变少。两者叠在一起，表头却写 MATH，是模型卡里常见的三方混淆，能把几个点的假分差做成叙事。

引用时写 MATH-500，不要写 MATH。若比较历史分数，先确认对方跑的是 5,000、500，还是 Level-5 子集，以及抽答案用不用 sympy。`,
    links: [
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/HuggingFaceH4/MATH-500" },
      { rel: "harness", label: "OpenAI simple-evals", href: "https://github.com/openai/simple-evals" },
      { rel: "paper", label: "Let's Verify Step by Step", href: "https://arxiv.org/abs/2305.20050" },
    ],
  },
  {
    slug: "gsm-plus",
    name: "GSM-Plus",
    shortName: "GSM-Plus",
    accession: "OB-2024-M08",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["鲁棒性", "小学应用题"],
    org: "HKU / Tencent",
    authors: "Li, Cui, Zhao et al.",
    summary:
      "对 GSM8K 测试题做八类扰动，专门测数学解题是不是死记模板。它不是新的能力上限，是给已经饱和的小学卷做的压力测试。",
    origin: `GSM8K 分数飞涨的同时，改一个数字或加一句废话就能把模型打懵。这种事在非正式测试里传了很久，GSM-Plus 把它写成系统实验：在原测试题上做数值替换、多余信息、难度增加等八种攻击。

它和 Apple 稍后的 GSM-Symbolic 是同一场病理学讨论的两边。GSM-Plus 偏“人手设计的八类变换”，GSM-Symbolic 偏“符号模板无限重采样”。两者都在说：点估计准确率会撒谎。

作者没有试图取代 GSM8K 成为新的主栏，而是量化鲁棒性。谁要是把 GSM-Plus 高分写成“数学更强”，就是把压力测试当成了举重比赛。`,
    architecture: `每道原题对应多道变体，指标是变体上的准确率以及相对 GSM8K 的掉分。协议仍是 CoT 加数字答案，抽取方式与 GSM8K 同类。声明 CoT 和抽取器，否则掉分里会混进解析失败。

八类扰动覆盖数字改写、增加干扰条件、改变问法与计算复杂度等。不同类的掉分不能平均成一个“鲁棒分”就交差，因为加废话和换运算不是同一种失败。前者测的是会不会被干扰，后者测的是会不会迁移。

它继承 GSM8K 的自动判分便宜，也继承小学题的天花板。模型可以在 GSM-Plus 上仍很高，但一换 AIME 就原形毕露。压力测试通过，只说明这八类变换没打垮它。`,
    content: `规模约原测试集的八倍，即以 1,319 道 GSM8K 测试题为种子生成变体。题还是小学应用题，只是表面特征和干扰项被改过。种子本身若已进语料，变体也会带着原题的骨架。

扰动由作者定义，不是从真实教学分布里抽样。这很重要：它能证明脆弱，不能证明“真实世界的小学题有多难”。八类是一张清单，不是自然分布的八个主成分。

语言仍是英语应用题。对中文模型或竞赛模型，这份压力测试的外推有限。别拿 GSM-Plus 掉分去解释 AIME 或 Lean 上的失败。它扰动的是小学应用题的表面，不是竞赛或证明的结构。`,
    format: "GSM8K 对抗变体",
    metrics: ["Accuracy", "相对掉分"],
    size: "约 1,319 × 8 变体",
    lineage: {
      parents: ["gsm8k"],
      children: [],
      related: ["gsm-symbolic"],
    },
    caveats: `扰动由作者定义，不代表所有分布偏移。不要把 GSM-Plus 当新的能力上限，它是压力测试。相对掉分才是主信息，绝对准确率很容易再被做满，然后宣传口径又变回“小学数学已解决”。

和 GSM-Symbolic 不要互相替代。一个是有限的八类人手变换，一个是模板分布。两者一起读，比单看一个掉分百分比有用：一个告诉你哪类攻击有效，一个告诉你分数是一条分布。

报分时写清扰动类型。只报总平均，会把“加了一句无关的猕猴桃重量”和“把减法改成需要额外一步”混在一起，看起来像一个鲁棒性数字，其实是两场不同的失败。八类要分表，不要合成一句“更鲁棒”。`,
    links: [
      { rel: "paper", label: "GSM-Plus 论文", href: "https://arxiv.org/abs/2402.19255" },
      { rel: "repo", label: "GitHub", href: "https://github.com/qtli/GSM-Plus" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/qintongli/GSM-Plus" },
    ],
  },
  {
    slug: "olympiadbench",
    name: "OlympiadBench",
    shortName: "OlympiadBench",
    accession: "OB-2024-M09",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["奥赛", "双语", "多模态理科"],
    org: "Shanghai AI Lab / OpenBMB",
    authors: "He et al.",
    summary:
      "中英双语的奥赛级数理题，含图，覆盖 IMO、IPhO 一类来源。MATH 不够硬之后，它把数学和物理、文本和视觉捆进同一套件。",
    origin: `MATH 对 2024 年的模型已经不够硬。上海 AI Lab 把奥赛真题做成双语、部分带图的套件，数学与物理并重。开源多模态模型正缺理科硬题，这份基准两边都卖：文本模型有奥赛填空，视觉模型有实验图。

它既给后续 Omni-MATH、ProcessBench 提供了题源，自己也成为技术报告里“奥赛”一栏的常见入口。和纯文本的 AIME 不同，这里有实验图、几何图，不会看图就做不了。和 FrontierMath 也不同：题是公开历史真题。

真题意味着泄漏风险高。奥赛题解在中文互联网尤其密集。双语混报还会掩盖模型其实只会其中一种语言。读总分前先问：中文还是英文，有图还是没图，数学还是物理。`,
    architecture: `开放生成，自动或半自动核验答案。分科目、语言、是否需要视觉。报分应拆开，总分会掩盖物理或视觉子集的失败，也会让“会中文数学填空”看起来像“会 IPhO”。

证明题几乎无法自动判分，实际常只评短答案子集。谁若把整库通过率写成“奥赛水平”，要问清楚：评的是填空，还是证明。IMO 证明题若被收成短答案，难度已经被改写过一次。

多模态协议必须声明图像怎么喂。有的 harness 把图丢掉只跑文本，分数会假高或假低，取决于题是不是真的需要图。丢图还报 OlympiadBench，等于换了一份更小的卷。语言通道和视觉通道都要写进协议。`,
    content: `约 8,476 题，来自 IMO、IPhO 等，中英都有。部分题含实验图、几何图。数学与物理并重，不是纯数学集，这也是它和 Omni-MATH 最容易被搞混的地方。

难度定位在奥赛，比 MATH 硬，比 FrontierMath 的研究入口题更“竞赛”。题面风格接近真实试卷，而不是众包应用题。物理子集还可能涉及实验装置图，纯文本模型会直接缺输入。

规模看起来大，可用的自动核验子集更小。读 size 字段时不要假设 8,476 道都能程序判分。真正进入榜的，往往是短答案、能自动对的那一截。证明题若还在库里，也不等于进了主指标。`,
    format: "奥赛开放题，文本 + 部分图像",
    metrics: ["Accuracy"],
    size: "约 8,476 题",
    lineage: {
      parents: ["math"],
      children: ["omni-math", "processbench"],
      related: ["aime", "frontiermath"],
    },
    caveats: `真题泄漏风险高。自动判分对证明题几乎无效，实际常只评短答案子集。双语混报会掩盖语言偏差：中文物理和英文几何不是同一个模型特长，平均分最擅长撒谎。

不要和 Omni-MATH 混为一谈。OlympiadBench 含物理和视觉；Omni-MATH 是纯数学、广覆盖的奥赛量表。ProcessBench 借用了两边的题，评的却是找错步，不是答题。三份名字都像奥赛，三份协议不是一家。

需要视觉的子集，必须在协议里写清。丢图评测不是同一份基准。把 OlympiadBench 写成“纯文本奥赛”之前，先确认图像通道还在。物理子集尤其不能当数学填空来读。`,
    links: [
      { rel: "paper", label: "OlympiadBench 论文", href: "https://arxiv.org/abs/2402.14008" },
      { rel: "repo", label: "GitHub", href: "https://github.com/OpenBMB/OlympiadBench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/Hothan/OlympiadBench" },
    ],
  },
  {
    slug: "lab-bench",
    name: "LAB-Bench",
    shortName: "LAB-Bench",
    accession: "OB-2024-M10",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["生物学研究", "实验技能", "工具使用"],
    org: "FutureHouse",
    authors: "Laurent et al.",
    summary:
      "两千余道生物学研究选择题，测读文献、看图、查库和分子克隆，而不是背课本。它和 GPQA、SciBench 是三条相邻的科学轴。",
    origin: `FutureHouse 要的不是 MMLU-bio，而是博士生进实验室会的那些事：读论文、读图、查数据库、改序列、排实验协议。LAB-Bench 把这些拆成八类 MCQ，并留了私有切片监控污染。公开题打满、私有题掉下去，就是警报。

它出现在 2024 年科学智能体开始被认真做的时候。模型若只能背教科书，会在 SeqQA 和 Cloning 上原形毕露。作者把“研究技能”从“生物知识”里拆出来，这是这份基准的主要贡献，也解释了它为什么会出现在数学与科学这只抽屉里，尽管题是生物。

和 GPQA 的研究生闭卷、SciCode 的写出模拟代码相比，LAB-Bench 更靠近实验室工作流。但它仍然是选择题，不是真正动手。会选对克隆策略，和在台子上做出那条胶，中间还隔着一整间实验室。`,
    architecture: `多选。部分子集允许或需要工具（文献检索、数据库）。官方报准确率、覆盖率与 precision：模型可以弃权，于是“做了多少”和“做对多少”被分开。只报 accuracy 会把乱猜奖励回去。

公开约八成，两成私有，用来观察公开题是否被训进去。报分应声明公开集还是含私有。工具协议同样必须写清，否则 DbQA 的分数没有意义：有的模型其实是在搜库，有的是在背接口。

MCQ 仍然能猜。覆盖率指标就是为了惩罚“每题都蒙一个选项”。读榜时不要只看 accuracy，也不要把八个子集合成一个“生物学能力”。工具开没开，比平均分更先被问。`,
    content: `LitQA2、SuppQA、FigQA、TableQA、DbQA、ProtocolQA、SeqQA、Cloning Scenarios，共约 2,457 题。分别对应读论文、读补充材料、读图、读表、查库、排协议、改序列、克隆场景。八类是八种技能，不是一道生物综合卷。

领域锁在生物学研究，不是泛 STEM。克隆场景样本少，方差大，不适合单独拿来排模型。FigQA 和 TableQA 还依赖图像或表格通道，纯文本协议会缺输入。

题是研究技能的代理，不是湿实验本身。会选对引物设计题，不等于会在台子上做出那条胶。LAB-Bench 高分最稳妥的读法是：书面实验室流程更熟，不是已经能进组干活。`,
    format: "研究技能 MCQ，部分需工具",
    metrics: ["Accuracy", "Precision", "Coverage"],
    size: "约 2,457 题（公开约 80%）",
    lineage: {
      parents: [],
      children: [],
      related: ["gpqa", "scibench", "scicode"],
    },
    caveats: `MCQ 测不到真正动手做实验。工具协议必须声明。克隆场景样本少，方差大，不要用单子集排名，更不要用它当“AI 科学家”的证据。

私有切片的意义是污染监控。若只报公开集高分，等于没看作者留下的警报器。公开题同样可能进语料，私有掉分才是更刺耳的那一声。

不要和 GPQA 的生物题混报。GPQA 是研究生闭卷知识；LAB-Bench 是实验室工作流的书面代理。一个问你知不知道，一个问你会不会走流程。`,
    links: [
      { rel: "paper", label: "LAB-Bench 论文", href: "https://arxiv.org/abs/2407.10362" },
      { rel: "repo", label: "GitHub", href: "https://github.com/Future-House/LAB-Bench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/futurehouse/lab-bench" },
    ],
  },
  {
    slug: "putnambench",
    name: "PutnamBench",
    shortName: "PutnamBench",
    accession: "OB-2024-M11",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["Putnam", "形式化定理", "Lean"],
    org: "Princeton / Trishul Lab",
    authors: "Tsoukalas, Lee et al.",
    summary:
      "把 Putnam 竞赛题形式化到 Lean 4、Isabelle、Coq，用来压神经定理证明器。自然语言会做 Putnam，不等于能过编译器。",
    origin: `miniF2F 对 2024 年的神经证明器开始偏易，且题源杂。PutnamBench 专攻北美本科最高水平的 Putnam，人工把数十年真题写成 Lean 4、Isabelle、Coq 命题。它把“会写自然语言解答”和“会写出可编译证明”彻底拆开，也把形式化评测从“小集过关”拉回竞赛难度。

Putnam 在人类这边已经够难，形式化之后更难：你不仅要有思路，还得把思路写成类型检查能过的证明项。这正是作者想要的压力。自然语言满分选手在 Lean 里交白卷，是这条基准最常见的剧情。

它和 FormalMATH 的大规模自动形式化不同，走的是人工精修竞赛题。两条线后来经常被一起引用，但生产方式和难度分布不一样。PutnamBench 更齐、更竞赛；FormalMATH 更宽、更依赖流水线。`,
    architecture: `给定形式化陈述，生成证明，由证明器核验。按证明助手分别报通过率。允许的 tactic 集合与搜索预算必须写进协议，否则 Pass@k 没有可比性。sledgehammer 开着和纯生成证明，是两场考试。

一题可有多个形式化版本，因为自然语言的 Putnam 题有时包含几个子问，或允许几种等价陈述。报题数和报形式化条数不是一回事：640 题，1,692 条形式化。平均通过率用哪一个分母，会改叙事。

跨系统对照和 miniF2F 是同一哲学，但题更齐、更难。不要把 Lean 4 的通过率和 Coq 的通过率加总，也不要和 AIME 的整数填空兑。`,
    content: `640 道 Putnam 题的 1,692 条形式化，覆盖代数、分析、组合、几何。来源是历年 Putnam，不是教材练习。北美本科竞赛的最高卷，搬进三个证明器里。

形式化本身可能改变原题难度：加上缺失的定义域会变难，丢掉一个子目标会变易。读通过率时，要记得模型证明的是形式化后的命题，不是 AoPS 上那道英文题。

语言是证明助手语言，不是英语解答。评测环境依赖 mathlib 等库的版本，升级库可能让旧证明坏掉，也可能让新 tactic 更强。报分不写库版本，后人无法复现。`,
    format: "形式化竞赛命题",
    metrics: ["Pass rate（分系统）"],
    size: "640 题 / 1,692 条形式化",
    lineage: {
      parents: ["minif2f"],
      children: [],
      related: ["formalmath", "aime", "olympiadbench"],
    },
    caveats: `自然语言会做 Putnam 不等于能过 Lean。形式化本身可能改变原题难度。搜索预算不同则分数不可比。把“PutnamBench 过了几道”写成人类竞赛等价分数，是范畴错误。

miniF2F 的误形式化教训在这里同样适用，尽管 PutnamBench 更强调人工。引用时写证明器和库版本，以及你用的是 640 题分母还是 1,692 条分母。

不要和 AIME 的整数填空横比。一个是 000 到 999 的自动匹配，一个是内核点头。也不要和 FormalMATH 的平均 Pass@k 兑，领域和流水线都不一样。`,
    links: [
      { rel: "paper", label: "PutnamBench 论文", href: "https://arxiv.org/abs/2407.11214" },
      { rel: "homepage", label: "项目主页", href: "https://trishullab.github.io/PutnamBench/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/trishullab/PutnamBench" },
    ],
  },
  {
    slug: "gsm-symbolic",
    name: "GSM-Symbolic",
    shortName: "GSM-Symbolic",
    accession: "OB-2024-M12",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["符号模板", "推理可靠性"],
    org: "Apple",
    authors: "Mirzadeh et al.",
    summary:
      "用符号模板生成 GSM8K 变体，证明许多高分来自模板记忆而非可靠推理。它是给 GSM8K 写的病理学报告，不是新的小学题榜。",
    origin: `Apple 把 GSM8K 写成符号模板，随机替换名字、数字和条款，结果模型分数随表面改动大幅波动，难度只需加一层嵌套就崩。原测试集上的点估计，常常落在新分布的右侧一个标准差之外——看起来像污染，也像脆弱的模式匹配。

这篇工作不是为了再刷榜。它让“数学推理”这一宣传语很难再用小学题支撑。圈里把它读成对整个 CoT 叙事的打脸，作者自己的表述更窄：在 GSM 这一分布上，推理不可靠。

GSM-Plus 更早做了人手扰动；GSM1k 一类平行卷盯污染。GSM-Symbolic 的独特处是可控的符号生成：同一道题可以变成一条准确率分布，而不是一个数。`,
    architecture: `从模板采样任意多题，指标是准确率随模板参数的分布，而不只是一个点估计。协议与 GSM8K 相同：CoT 加最终数字。报均值而不报方差，等于没读这篇论文。

可以控制条款数量与嵌套深度。P1、P2 等更难变体把“加一层无关或相关条款”做成旋钮。只报某一生成快照的准确率，会丢掉论文真正要展示的方差，也会让后来人无法复现那张抖得很厉害的图。

它是生成器，不是固定测试集。今天拉下来的样本，和论文表格里的样本，不必是同一批。比较必须写生成配置、模板版本和采样数。`,
    content: `与 GSM8K 同构的小学应用题，但实体与数值可无限重采样。人名、数量、关系都可以换，算术结构保持。表面上仍是“先买再找零”，骨子里每道都是新实例。

另有故意加干扰条款的设定，用来看模型会不会把无关的猕猴桃重量减进账单。这类失败和“换个数字就不会”是两种病：一个是抗干扰，一个是模板记忆。

规模可变。仓库提供模板和一份采样，Hugging Face 上也有带 canary 的快照，方便以后查泄漏。内容本身没有新的数学知识，新的是可控的表面变化。`,
    format: "模板生成的应用题",
    metrics: ["Accuracy 分布"],
    size: "由模板生成，规模可变",
    lineage: {
      parents: ["gsm8k"],
      children: [],
      related: ["gsm-plus", "math"],
    },
    caveats: `它是诊断工具。只报某一生成快照的准确率，会丢掉论文真正要展示的方差。把 GSM-Symbolic 当成“新 GSM8K 榜”是误用，也是最省事的误读。

它不能单独证明模型没有推理，只能证明在小学应用题模板上推理不稳定。AIME、FrontierMath 上的表现要另看。用小学题的脆弱去否定全部数学能力，和用 GSM8K 满分去宣称推理，是对称的两种过头。

比较时写模板版本和采样数。无分布、无误差条的单一百分数，等于没读这篇论文。原 GSM8K 点估计落在新分布右侧，本身就是该画出来的那张图。`,
    links: [
      { rel: "paper", label: "GSM-Symbolic 论文", href: "https://arxiv.org/abs/2410.05229" },
      { rel: "repo", label: "GitHub", href: "https://github.com/apple/ml-gsm-symbolic" },
    ],
  },
  {
    slug: "omni-math",
    name: "Omni-MATH",
    shortName: "Omni-MATH",
    accession: "OB-2024-M13",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["奥赛", "覆盖面"],
    org: "Peking University 等",
    authors: "Gao, Song et al.",
    summary:
      "四千余道奥赛题，三十三个子领域、十档难度，想当“通用奥赛数学”量表。它让模型不能靠代数一项把总分撑起来。",
    origin: `现有奥赛集要么偏某类竞赛，要么混进物理。Omni-MATH 专门做纯数学、奥赛级、广覆盖，并按子领域与难度分层，让模型不能靠代数一项把总分撑起来。作者想要的是一张能看出偏科的量表，不是又一个平均分。

ProcessBench 后来借用了它的题，当作最难那一档的过程错误来源。OlympiadBench 是兄弟而不是父集：一个双语数理加图，一个纯数学量表。名字都像奥赛，内容协议差得很远。

公开奥赛题同样有污染。它的卖点是覆盖面和分层，不是私有抗刷。谁要抗刷，得去 FrontierMath 或当年的 AIME，而不是再汇编一版历史真题。`,
    architecture: `开放生成，程序化核验短答案。按领域与难度报准确率。证明题若无法自动核验则不进入主指标。主榜默认是能自动对的那一截，不是完整奥赛卷。

分层是这份基准的协议核心。只报总分，等于允许代数高分掩盖分析或几何的失败。十档难度也应分开看，不能合成一个“奥赛分”。三十三个子领域里，偏科比总分更有信息。

判分仍是短答案匹配一类。它不解决证明核验，那是 miniF2F 和 PutnamBench 的事。Omni-MATH 高分说明填空会做，不说明证明能过编译器。`,
    content: `4,428 道奥赛数学题，33 个子领域、10 个难度级别，来源包括各国奥赛与选拔赛。纯数学，不含物理实验，也不含必须看图才能做的实验装置。

覆盖面是卖点：代数、数论、组合、几何等被拆开，避免“会做 AMC 代数”被写成“会做奥赛”。难度十档则避免把入门选拔和压轴混成一个准确率。

题量比 AIME 的每年 30 道大得多，统计上更稳，但题是公开历史题，不是每年新卷。宽和新鲜，不能同时占有。这是它相对 AIME 的结构性取舍。`,
    format: "奥赛短答案生成",
    metrics: ["Accuracy（分领域 / 难度）"],
    size: "4,428 题",
    lineage: {
      parents: ["olympiadbench", "math"],
      children: ["processbench"],
      related: ["aime", "frontiermath"],
    },
    caveats: `公开奥赛题同样有污染。总分掩盖领域偏差。不要和 OlympiadBench 的物理、视觉部分混为一谈，也不要把 ProcessBench 里用到 Omni-MATH 轨迹当成这份基准本身的答题榜。

自动核验覆盖的是短答案，不是完整证明。高分不代表能在 Lean 里复现。形式化路线请看 miniF2F、PutnamBench、FormalMATH。

和 AIME 比，它更宽、更新鲜度更差；和 FrontierMath 比，它更公开、更竞赛而不是研究入口。选尺子时先问：要的是覆盖、新鲜，还是私有抗刷。`,
    links: [
      { rel: "paper", label: "Omni-MATH 论文", href: "https://arxiv.org/abs/2410.07985" },
      { rel: "repo", label: "GitHub", href: "https://github.com/KbsdJames/Omni-MATH" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/KbsdJames/Omni-MATH" },
    ],
  },
  {
    slug: "aime",
    name: "AIME",
    shortName: "AIME",
    accession: "OB-2024-M14",
    year: 2024,
    status: "live",
    kind: "benchmark",
    family: "math",
    domains: ["美国邀请赛", "竞赛数学"],
    org: "Mathematical Association of America",
    authors: "MAA",
    summary:
      "每年三十道整数答案的邀请赛题，2024 年起成为前沿模型数学栏的默认硬尺子。样本量极小，一题就能改排名。",
    origin: `AIME 本身是 MAA 的高中邀请赛，答案是 000 到 999 的整数，天生适合自动判分。o1 技术报告把它变成 LLM 评测的公共货币之后，AIME 2024、2025 取代了已饱和的 MATH，成为“还能不能拉开差距”的年度试卷。模型卡上的数学栏，从五千题变成了三十题。

它不是哪篇机器学习论文造的集，是竞赛本身被借用。这带来两个好处：每年全新一卷，抗污染比 MATH 强；整数答案，核验几乎无争议。也带来一个结构性缺陷：n 等于 30。统计功效差，是它当工业尺子的原罪。

LiveBench 一类活榜也爱用它。指定年份是基本礼貌。把 1983 到 2023 的旧题混进 2024 栏，是公开的作弊或至少是严重误导。过一年的卷子也会慢慢变成 MATH：公开、可爬、可背。`,
    architecture: `每场 15 题，AIME I 加 II 共 30 题。模型输出整数，精确匹配。常用整年合计。是否工具、多少测试时计算必须声明，o 系列的分差主要来自这里。同一模型开高推理预算和不开，可以差出完全不像同一个选手的分数。

因为只有 30 题，单次 greedy 的方差极大：一题是 3.3 个百分点，24 对和 21 对就是十个点，足够翻盘。社区因此改报 avg@32、cons@64 一类多次采样。采样数、温度、多数票还是 pass@1，都会改表上的数字。不报这些的百分数，信息量接近段子。

协议看起来简单，隐藏变量却多。年份、I 还是 I+II、测试时计算量、工具，四件事写不全就不能比。n=30 不是脚注，是协议的一部分。`,
    content: `代数、计数、几何、数论的中高难度高中竞赛题。每年全新一卷，这是它相对 MATH 的抗污染优势。答案限定在三位数整数，没有公式题，也没有证明题，自动判分几乎没有歧义。

题面来自 MAA 官方竞赛，解法在 AoPS 等处很快会出现。当年新鲜，过一年就变成公开题。2024 卷对 2026 年的模型，已经不是同一档“未见过”。活评测的意义就是换卷，冻住某一年当永久主栏会重复 MATH 的命运。

它不是课程覆盖量表。三十道题抽到的知识点有年际波动，这是 n 小的另一面：内容效度也在抖。某年几何偏难，模型掉分，不一定是“几何能力崩了”。`,
    format: "整数答案竞赛题",
    metrics: ["Accuracy（/30 或 /15）"],
    size: "每年 30 题（I+II）",
    lineage: {
      parents: ["math"],
      children: [],
      related: ["olympiadbench", "frontiermath", "livebench", "math-500"],
    },
    caveats: `样本量极小。一题对错改 3.3 个点，三次随机采样就能让排名对调。不报置信区间或不报多次平均的 AIME 百分数，信息量接近段子。指定年份，禁止把 AIME 1983–2023 混进 2024 栏。n=30 的方差不是可以靠把百分数写到小数点后一位来掩盖的。

测试时计算量是隐藏变量。同一模型开高推理预算和不开，可以差出完全不同的“AIME 水平”。工具计算器同样。o 系列的分差，很多时候来自这里，而不是来自又懂了一章数论。

2024 卷已经在网上待了足够久，污染讨论开始转向 2025、2026。活评测的意义就是每年换卷；冻结某一年当永久主栏，会重复 MATH 的命运。引用时写年份、I 还是 I+II、avg@k 还是 greedy。`,
    links: [
      { rel: "homepage", label: "MAA AIME", href: "https://maa.org/student-programs/amc/" },
      { rel: "index", label: "AoPS 题库", href: "https://artofproblemsolving.com/wiki/index.php/AIME_Problems_and_Solutions" },
      { rel: "harness", label: "simple-evals", href: "https://github.com/openai/simple-evals" },
    ],
  },
  {
    slug: "frontiermath",
    name: "FrontierMath",
    shortName: "FrontierMath",
    accession: "OB-2024-M15",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["研究级数学", "抗饱和"],
    org: "Epoch AI",
    authors: "Glazer et al.",
    summary:
      "职业数学家出的研究入口级新题，故意不公开，用来测量真正的前沿数学。OpenAI 资助并持有大部分题目，利益冲突已公开披露。",
    origin: `Epoch 认为公开竞赛题已经或即将被训进模型。他们请数学家写现有文献里找不到的新问题，难度从困难竞赛到研究入口，题目大部分不公开，只透露少量样例与分层结果。HLE 把它当作数学侧的近亲。

2024 年 11 月基准发布时，公众以为这是独立机构的抗污染卷。同年 12 月 20 日 o3 发布，论文脚注才感谢 OpenAI 的支持。随后承包商在 LessWrong 写出：许多出题人并不知道金主是谁。Epoch 承认沟通失败，并澄清合同一度禁止提前披露。

事实后来写进利益冲突声明：OpenAI 委托 Epoch 出约 300 道题，作为委托方持有题目并获得大部分解答，另有 holdout 不对 OpenAI 开放解答。口头约定不用于训练。外部评测以 Epoch 自己跑的私有集为准。这不是“取消基准”，但是读 o3 的 FrontierMath 数字时必须把这段放在旁边。`,
    architecture: `新题、可核验答案、私有持有。模型提交一个 Python 的 answer 函数，返回整数或 sympy 对象一类可比较的值。官方按层级报通过率，后续更难的 T4 单独成栏。这和 AIME 的三位数填空不是同一套核验，也和 Lean 内核点头不是同一套。

外部无法独立复现全量，只能引用 Epoch 评测。OpenAI 自己报的 o3 数字，和 Epoch 后来在不同切片、不同脚手架上跑的数字，不必一致。脚手架、测试时计算、题目子集都是隐藏变量。读两张表之前先对齐这些。

分层很重要。早期模型在低层还有分，高层接近零。把“FrontierMath 百分之几”写成一个数，会抹掉层级，也会把 T4 的接近零平均进比较能做的层。`,
    content: `数百道原创数学题，覆盖广泛分支。强调需要数小时到数天的专家工作，而不是套竞赛模板。样例公开，全量不公开。职业数学家出题，不是众包小学应用题，也不是把历年 Putnam 再抄一遍。

后续仍有扩容和更难层级。公开沟通里会区分 private set、holdout、以及少量可看的样本。数字默认对应私有集，除非另说。OpenAI 能看到的那部分，和 holdout，也不是同一袋题。

它不是奥赛真题汇编，也不是形式化库。答案可程序核验，但问题本身是研究入口级的新造题。内容保密是抗刷的手段，也是无法完全公开复现的原因。`,
    format: "私有研究级数学题",
    metrics: ["Accuracy（分层）"],
    size: "数百题，大部分不公开",
    lineage: {
      parents: ["math", "aime"],
      children: ["humanity-last-exam"],
      related: ["gpqa", "olympiadbench", "epoch"],
    },
    caveats: `不可完全公开复现。样本量仍有限。把“专家觉得难”等同 AGI 进度是范畴错误，但它确实暂时抗刷。私有不是万能，只是比公开竞赛题多撑一段时间。

利益冲突已经披露，读分时不能装没看见。OpenAI 资助、持有大部分题目与解答，并曾限制披露时间。Epoch 保留 holdout 和独立评测权，仍不能把“独立基准”四个字用到无修饰的程度。口头不训练约定不是审计，承包商当时不知情也不是小事。

OpenAI 自报数字与 Epoch 官方评测可能用了不同子集和脚手架。引用时写清是谁跑的、哪一版私有集、哪个层级。o3 发布会上的那个百分数，尤其要和这段放在一起读。`,
    links: [
      { rel: "paper", label: "FrontierMath 论文", href: "https://arxiv.org/abs/2411.04872" },
      { rel: "homepage", label: "epoch.ai/frontiermath", href: "https://epoch.ai/frontiermath" },
    ],
  },
  {
    slug: "processbench",
    name: "ProcessBench",
    shortName: "ProcessBench",
    accession: "OB-2024-M16",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["过程错误", "PRM 评测"],
    org: "Qwen Team / Alibaba",
    authors: "Zheng et al.",
    summary:
      "三千四百道带人工步骤标注的解题，要求找出最早出错的一步。它评的是 critic 和 PRM，不是答题准确率。",
    origin: `PRM800K 证明过程监督有用，但缺一个独立、公开、难度够的评测。Qwen 团队从 GSM8K、MATH、OlympiadBench、Omni-MATH 收集模型解题，请专家标出第一个错误步，做成 ProcessBench。

动机很具体：现成 PRM 在小学题和 MATH 上还行，一到奥赛轨迹就不会找错；而最终答案对、过程已经错的情况，在难题上越来越常见。只看 boxed 数字会系统性放过这些轨迹。

它评的是 critic 或 PRM，不是答题准确率。把 ProcessBench 高分写成“数学更强”，是把阅卷老师的能力和考生能力搞混。`,
    architecture: `输入题目与逐步解答，输出最早错误步编号，或判断全对。可评 PRM，也可把通用模型当 critic。主指标是错误定位准确率，常按四源子集分别报，并拆开“错题找错”和“对题判对”。只报平均 F1 会把 GSM8K 的好成绩平均进奥赛上的掉崖。

步骤切分经过再格式化，避免原始生成器把一步写得太碎或太长。标注是“最早错误”，灰区仍然存在：有人觉得这步已经错，有人觉得下一句才错。这不是标注失败，是过程监督本身的难度。

生成器会过时。轨迹来自当时的开源模型，过两年的模型犯错分布会变。ProcessBench 冻的是一批轨迹，不是永恒的过程能力。用它微调再在上面报分，属于刷自己。`,
    content: `约 3,400 条，四源题库：GSM8K 约 400，MATH、OlympiadBench、Omni-MATH 各约 1,000。每条含逐步解答与人工错误位置。越往后，最终答案对但过程错的比例越高，这也是只看 boxed 数字会越来越不准的原因。

内容是竞赛与奥赛为主的解题轨迹，不是教材标准答案。错误类型从算术笔误到概念用错都有。生成器来自当时的 Qwen、LLaMA 一类开源模型，风格绑定在那一代 CoT 上。

它不提供新的数学题，提供的是带标签的过程。题源版权和原基准相同，使用时要回到那四份数据的许可。把它当成新的奥赛集，是拿阅卷当考生。`,
    format: "步骤级错误定位",
    metrics: ["Error localization accuracy"],
    size: "约 3,400 条",
    lineage: {
      parents: ["gsm8k", "math", "prm800k", "olympiadbench", "omni-math"],
      children: [],
      related: [],
    },
    caveats: `“最早错误步”在标注上仍有灰区。不能用它代替最终答案准确率。生成器模型会过时，轨迹分布会变。一个会做题的模型和一个会找错的模型，不必是同一个。

现成 PRM 在 GSM8K/MATH 上的表现，外推不到 OlympiadBench/Omni-MATH。这是论文的核心观察之一。只报平均 F1 会掩盖这一掉崖，也会让 2023 年的 PRM800K 看起来还在打奥赛。

它不是训练 PRM 的大数据，是评测。用它微调再在上面报分，属于刷自己。要训过程监督，应另找轨迹和标签，把 ProcessBench 留作考场。`,
    links: [
      { rel: "paper", label: "ProcessBench 论文", href: "https://arxiv.org/abs/2412.06559" },
      { rel: "repo", label: "GitHub", href: "https://github.com/QwenLM/ProcessBench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/Qwen/ProcessBench" },
    ],
  },
  {
    slug: "formalmath",
    name: "FormalMATH",
    shortName: "FormalMATH",
    accession: "OB-2025-M17",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "math",
    domains: ["Lean 4", "形式化推理", "大规模"],
    org: "SphereLab / M-A-P / CUHK 等",
    authors: "Yu, Peng, Ding et al.",
    summary:
      "五千五百余条经核验的 Lean 4 命题，覆盖奥赛到本科，用来放大 miniF2F 的尺度。强证明模型在有限采样下仍然只有有限成功率。",
    origin: `miniF2F 只有四百余题，领域还偏。SphereLab 与 M-A-P 用“模型形式化 + 多模型语义检查 + 人工”的流水线，做出 5,560 条 Lean 4 命题，号称约是 miniF2F 的二十倍。目标是把神经定理证明的评测从玩具集拉到可分领域看的规模。

评估显示即便强证明模型在 Pass@32 下也只有有限成功率，且代数明显强于分析。这和人类直觉一致：代数不等式更容易砸 tactic，分析需要的定义和极限语言更重。

自动形式化流水线提高了产量，也把 miniF2F 的老问题带了进来：陈述是否真等于原题。作者用多模型检查加人工过滤降低成本，但不能从根上消灭弱化或写错。`,
    architecture: `Lean 4 命题，证明由编译器核验。主指标 Pass@k。提供 Full 与 Lite（约 425 题）两档，Lite 方便对标 miniF2F 量级的快速实验。允许的搜索预算、tactic 集、是否用 mathlib 必须声明。k 和预算是分数的一部分，不是脚注。

论文里 Kimina-Prover 一类模型在 Full 上 Pass@32 大约百分之十六，BFS 搜索在更大预算下也不自动变成满分。报分离开 k 和搜索策略就不可比。代数上砸 tactic 能出分，分析上同一套预算可能接近零。

领域分解是一等公民。只报平均会掩盖分析、几何的失败，让人误以为“形式化数学已经开始被打穿”。FormalMATH 的规模是为了让这种偏科看得见，不是为了刷一个好看的总通过率。`,
    content: `代数、数论、微积分、离散与应用数学等十余领域，难度从高中奥赛到本科定理。语句都经过 Lean 核验为合法命题，不代表每条都与某道人类竞赛题严格等价。自动形式化加人工过滤，产量换来的是这一层不确定性。

Lite 子集大约 425 条，给资源不够跑 5,560 的人用。比较 Full 和 Lite 的通过率没有换算公式。Lite 更像快速诊断，Full 才是作者声称的尺度。

它是 Lean 4 基准，不是跨 Isabelle/Coq 对齐。和 PutnamBench 的多系统哲学不同，这里把规模押在单一证明器上。内容覆盖比 miniF2F 宽，形式化路径也更工业化。`,
    format: "Lean 4 定理证明",
    metrics: ["Pass@k"],
    size: "5,560 命题；Lite 约 425",
    lineage: {
      parents: ["minif2f"],
      children: [],
      related: ["putnambench", "math"],
    },
    caveats: `自动形式化流水线可能引入与原题不完全等价的陈述。领域偏差大，只报平均会掩盖分析、几何的失败。Pass@k 的 k 和搜索预算是分数的一部分，不是脚注。把百分之十六的 Pass@32 写成“形式化已突破”，漏掉了预算和领域。

miniF2F 的误形式化文献应当当作阅读警告：规模变大，检查成本也变大，不代表错误率自动变零。引用时写 Full 还是 Lite，以及证明器版本。弱化的命题会让通过率虚高，写错的命题会让通过率虚低。

自然语言数学分数、竞赛填空分数、Lean 通过率，三栏不能兑。FormalMATH 只回答第三问。它放大的是 miniF2F 的尺度，不是 AIME 的填空，也不是 FrontierMath 的私有研究题。`,
    links: [
      { rel: "paper", label: "FormalMATH 论文", href: "https://arxiv.org/abs/2505.02735" },
      { rel: "homepage", label: "项目主页", href: "https://spherelab.ai/FormalMATH/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/Sphere-AI-Lab/FormalMATH-Bench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/SphereLab/FormalMATH-All" },
    ],
  },
];
