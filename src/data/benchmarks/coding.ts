import type { Benchmark } from "@/lib/types";

export const coding: Benchmark[] = [
  {
    slug: "humaneval",
    name: "HumanEval",
    shortName: "HumanEval",
    accession: "OB-2021-C01",
    year: 2021,
    status: "foundational",
    kind: "benchmark",
    family: "coding",
    domains: ["函数合成", "Python", "单测判分"],
    org: "OpenAI",
    authors: "Chen et al.",
    summary:
      "164 道手写 Python 函数题，用隐藏单测定义 pass@k，把代码评测从“长得像参考答案”改成“跑得过测试”。它迅速变成模型卡默认第一栏，也把函数补全误当成了代码能力的全部。后来几乎所有函数级基准都在跟它抬杠：测试太薄、题太熟、前沿模型已经做满。",
    origin: `2021 年 Codex 论文需要一个不能靠 BLEU 交差的代码量表。机器翻译那套“生成文本跟参考答案像不像”在代码上完全失灵——换个变量名就崩，功能对了也可能长得不像。OpenAI 于是手写了 164 个独立 Python 函数，题干是 docstring，答案必须通过作者写的单元测试。这批题刻意不从 GitHub 爬，就是想少跟预训练语料撞车。

它很快变成代码 LLM 的默认第一栏，也把 pass@k 写成领域语法。说人话：让模型对同一道题写 n 遍，估计从里面随便抽 k 遍、至少有一遍能过全部测试的概率。pass@1 是一次写对；pass@10、pass@100 是允许你砸多次。Codex 论文里真正吓人的不是 greedy 解一次，而是采样做大之后曲线还在涨。

后续几乎所有函数级尺子都在和它对话。EvalPlus 嫌测试薄，MultiPL-E 把它编译到别的语言，ClassEval 升级到类，SWE-bench 直接改仓库。HumanEval 的历史地位很稳，但它作为难度标尺的寿命，比很多人愿意承认的要短。164 道题太好背了，模型卡上的 90% 往往只说明包装没写砸。`,
    architecture: `评测单元是函数，不是文件，更不是仓库。模型看到函数签名和 docstring，补全函数体。官方实现把生成结果丢进隔离进程跑单测，禁止联网，超时、异常、断言失败都算 0。

主指标是 pass@k。实现上通常先采 n 个样本，数出 c 个全过，再用组合数做无偏估计：1 − C(n−c, k) / C(n, k)。人话版就是“交 k 次，至少一次全对”的概率。必须把 n、k、温度、是否 greedy 写清楚。模型卡上的 pass@1 经常是解一次，和论文里用上百个样本估出来的 pass@1 不是同一条协议。

原版 prompt 是 few-shot 补全，不是聊天指令。指令微调模型如果不改包装，分数会无故偏低或虚高。截断到下一个函数、是否剥 markdown 代码块、用哪份 harness，都会改分。评测只看测试过不过，不看代码漂不漂亮。

pass@k 还有一层常被忽略：k 大于 1 时，你其实在奖励多样性。模型每次都写同一个半对的答案，n 再大也救不了；偶尔砸出一份怪但能过的实现，pass@100 就会好看。报 pass@k 却不报温度和 n，等于只给了分子。`,
    content: `164 道手写 Python，全部自包含：字符串处理、简单算法、小数据结构，不依赖第三方库。题干写成 docstring，带几条输入输出例子，风格接近教材作业，而不是工程 issue。

每道题的官方测试很少。EvalPlus 后来统计，原套件均值大约七八个用例，有的题甚至只有一条断言。覆盖一薄，“过测但逻辑错”的假阳性从第一天就埋着。这不是谁作弊，是量表本身就不是拿来卡边界条件的。

没有类、没有多文件、没有第三方 API、没有失败日志。你在这里拿满分，只说明模型会填函数作业，不说明它会修 Django、配环境、或在仓库里找该改的那一行。

官方测试还经常跟 docstring 里的例子高度重叠。模型只要把例子写进 if 分支，也能拿到绿。这就是薄测试的日常：它奖励的是“看起来像做了”，不是“所有合法输入都对”。`,
    format: "函数补全 + 单测",
    metrics: ["pass@k"],
    size: "164 题",
    lineage: {
      parents: [],
      children: ["humaneval-plus", "multiple", "cruxeval", "canitedit", "classeval", "bigcodebench"],
      related: ["mbpp", "apps", "bigcode-eval-harness", "openai"],
    },
    caveats: `对前沿模型已经饱和。90% 以上的 HumanEval 不再是能力证据，只是“补全包装没写砸”的卫生检查。还拿它当主结果，像 2025 年还在报 GLUE 总分。

测试覆盖极薄。HumanEval+ 用大约 80 倍测试证明原分数系统性偏高，pass@k 能掉十几到二十几个点，排行榜还会翻盘：原来看起来不如 ChatGPT 的开源码模型，加严测试之后可以反过来。只报原版，就是在报假阳性。

污染讨论从 2023 年没停过。题量小、复制广、标准解满网都是，docstring 几乎可以当 meme。不要再用它单独宣称代码能力，更不要拿它跟 SWE-bench 的 resolve rate 横比——一个是函数作业，一个是仓库修 bug。

聊天包装和补全包装也能制造假分差。同一模型，用官方 few-shot 是一个数，塞进系统提示再剥代码块又是一个数。看到“我们在 HumanEval 上超过某某”先问包装，再问测试套件，最后才信那个百分比。`,
    links: [
      { rel: "paper", label: "Codex / HumanEval 论文", href: "https://arxiv.org/abs/2107.03374" },
      { rel: "repo", label: "GitHub", href: "https://github.com/openai/human-eval" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/openai/openai_humaneval" },
    ],
  },
  {
    slug: "mbpp",
    name: "Mostly Basic Python Problems",
    shortName: "MBPP",
    accession: "OB-2021-C02",
    year: 2021,
    status: "foundational",
    kind: "benchmark",
    family: "coding",
    domains: ["函数合成", "Python", "入门题"],
    org: "Google Research",
    authors: "Austin et al.",
    summary:
      "Google 众包的入门级 Python 题，和 HumanEval 一起构成早期代码生成双壁。名称里的 Mostly Basic 是认真的：更像新手练习册，也因此更容易在预训练里撞见。报分必须说清是 full、sanitized 还是 MBPP+，三种协议不能当同一把尺。",
    origin: `Google Research 想测量语言模型在“自然语言描述变成短程序”上的合成能力，于是众包了大约一千道大多为基础的 Python 题。Austin 等人的论文和 Codex 几乎同时把“执行测试”写成代码评测的默认动作，MBPP 因此跟 HumanEval 绑成早期双壁。

它比 HumanEval 更接近新手练习册：题干是人话，不是 docstring 填空，难度也更低。好处是看起来更自然，坏处是更容易被预训练语料碰到——练习册本来就会出现在网页和教程里。后来几乎所有开源码模型卡都会顺手报一栏 MBPP，有时只是为了把表格撑满。

EvalPlus 给它补了 MBPP+，逻辑和 HumanEval+ 一样：原测试太少，错实现也能过。社区还维护 sanitized 子集，删掉题干有错、测试不严的条目。你看到的“MBPP 分数”，先问一句用的是哪一版。`,
    architecture: `输入是自然语言题干，输出是一段短 Python，用作者提供的 assert 判定。常用 few-shot prompt，指标同样是 pass@k：采 n 个样本，估计交 k 次至少一次全对的概率。和 HumanEval 一样，greedy pass@1 跟采样估出来的 pass@1 不要混着写。

社区有 sanitized 子集，大约四百多道，EvalPlus 的 MBPP+ 还要再筛一层，常用 399 道手验过的题。full / sanitized / plus 三种协议的题量和测试都不同，报分必须声明。有人用 bigcode-eval-harness，有人用 EvalPlus 官方脚本，截断和包装也不一样。

评测在本地解释器里跑，不联网。题短、测试短，跑得很快，这也是它迟迟不肯退出模型卡的原因：便宜。便宜的尺子最容易被拿来充数。`,
    content: `列表处理、字符串、简单算术和小算法，难度明显低于 APPS、CodeContests 那种竞赛集。读题干就能感觉到它是给入门者出的，不是给竞赛选手出的。

每题带几条 assert，覆盖面和 HumanEval 一样薄。边界、异常输入、性能，基本不在考核范围。参考实现本身偶尔也不干净，这才有了后来的清洗和增强测试。

没有第三方库、没有项目结构、没有“先读三个文件再改”。它测的是短程序合成，不是软件工程。把 MBPP 高分说成“会写 Python 应用”，是把练习册当成了上岗考试。`,
    format: "短程序合成 + 单测",
    metrics: ["pass@k"],
    size: "约 974 题；常用 sanitized 子集约 400+",
    lineage: {
      parents: ["humaneval"],
      children: ["humaneval-plus", "multiple"],
      related: ["apps", "ds-1000", "bigcode-eval-harness"],
    },
    caveats: `名称里的 Mostly Basic 是认真的。对当代模型区分度很低，头部已经接近做满，剩下的差距经常是 prompt 包装而不是能力。还拿它当主榜，是在测卫生，不是在测上限。

sanitized、full、MBPP+ 三种协议不可比。题量不同、测试不同、有的还修过参考答案。论文里写“MBPP pass@1”却不标版本，这个数基本没法复现。EvalPlus 榜用的是再筛过的子集，别跟原始 974 道混读。

污染风险比 HumanEval 更老实：众包练习册本来就会出现在网上。不要把它和竞赛集、仓库集横比，也不要因为某个 7B 模型 MBPP 很高就宣布代码能力赶上 GPT。`,
    links: [
      { rel: "paper", label: "MBPP 论文", href: "https://arxiv.org/abs/2108.07732" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/google-research-datasets/mbpp" },
    ],
  },
  {
    slug: "apps",
    name: "APPS",
    shortName: "APPS",
    accession: "OB-2021-C03",
    year: 2021,
    status: "foundational",
    kind: "benchmark",
    family: "coding",
    domains: ["竞赛编程", "算法"],
    org: "UC Berkeley / Chicago 等",
    authors: "Hendrycks et al.",
    summary:
      "一万道从入门到竞赛的编程题，把代码评测从函数作业拉到算法竞赛。introductory / interview / competition 三档才是它真正的产品，平均分会把故事抹平。公开题污染严重，执行环境和超时设置也会显著改分。",
    origin: `Hendrycks 一组在做 MATH 的同时，觉得函数填空测不到“会不会写程序”。他们把 Codeforces、AtCoder、Codewars 等平台的公开题收成 APPS，想看模型会不会根据长题面写出完整竞赛程序，而不是给 docstring 补函数体。

它是 HumanEval 之后第一条真正的难度梯度：introductory、interview、competition 三档。后来 AlphaCode 的 CodeContests、LiveCodeBench 的滚动竞赛题，都沿着这条线走——代码评测开始承认，作业题和竞赛题不是同一门课。

原论文还报过 BLEU。今天没人在乎生成程序跟参考解像不像，只在乎隐藏测试过不过。BLEU 退场这件事本身就是一种进步：代码评测终于肯承认，对的程序可以长得很不一样。`,
    architecture: `自然语言题面加标准输入输出，模型要交一整份程序，不是一个函数。评测按测试用例跑，看通过率和 pass@k。竞赛题还常跟 n@k 一起出现：生成很多候选，再挑少数去交——这更接近真实比赛的“有提交次数上限”。

题目按难度分层，报分应分开而不是只给一个平均数。把 introductory 的高分和 competition 的低分揉成一个数，是最常见的美化手法。原论文的 BLEU 今天已基本不用，看到还在报 BLEU 的 APPS 数字，直接当考古。

执行环境、语言、超时、内存限制都会改分。同一道题在 Python 超时、换 C++ 就过，这种事在竞赛评测里是日常。复现必须声明运行时，而不是只贴一个百分比。`,
    content: `一万道题，覆盖基础实现、面试算法和竞赛图论、动态规划。题面长、边界情况多，和 HumanEval 的单函数风格完全不同。你要自己解析输入、处理多组数据、小心超时。

难度跨度是它的卖点。入门档接近练习册，竞赛档接近 Codeforces 正经场次。只报总分的人，通常是在用入门档给竞赛档擦脂粉。

题都来自公开平台，题面、题解、讨论区在网上随处可见。这不是偷偷摸摸的泄漏，是公开题当考卷的宿命。LiveCodeBench 后来用时间戳，就是不想再走这条路。`,
    format: "竞赛题，stdin/stdout",
    metrics: ["pass@k", "测试通过率"],
    size: "10,000 题",
    lineage: {
      parents: [],
      children: ["codecontests", "livecodebench"],
      related: ["humaneval", "mbpp"],
    },
    caveats: `公开题污染严重。Codeforces 和 AtCoder 的题解、博客、GitHub 复现铺天盖地，模型“会做”还是“见过”，APPS 自己给不出判决书。把它当抗污染尺子，是找错了工具。

执行环境与超时设置会显著改分。差一个时间限制，竞赛档可能整层塌掉。语言选择、标准库版本、是否允许特判，都会让论文之间的数字对不上。复现不声明运行时，那个百分比没有意义。

不要把 APPS 平均分和 HumanEval pass@1 横比。一个是一万道分层竞赛，一个是 164 道函数作业；一个走 stdin/stdout，一个走函数单测。平均数还会掩盖 competition 档其实几乎没做几道。`,
    links: [
      { rel: "paper", label: "APPS 论文", href: "https://arxiv.org/abs/2105.09938" },
      { rel: "repo", label: "GitHub", href: "https://github.com/hendrycks/apps" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/codeparrot/apps" },
    ],
  },
  {
    slug: "codecontests",
    name: "CodeContests",
    shortName: "CodeContests",
    accession: "OB-2022-C04",
    year: 2022,
    status: "foundational",
    kind: "benchmark",
    family: "coding",
    domains: ["竞赛编程", "多语言"],
    org: "DeepMind",
    authors: "Li et al.",
    summary:
      "AlphaCode 配套的竞赛题库，用大规模采样证明竞赛级代码生成可行。论文主叙事不是 greedy 的 pass@1，而是 10@k：生成海量程序，再挑有限次去交。把 CodeContests 当成又一个 HumanEval，是没读懂 AlphaCode 在说什么。",
    origin: `DeepMind 为 AlphaCode 从 Codeforces 等平台收集带隐藏测试的竞赛题，训练并评测能在模拟比赛里打到中位水平的生成系统。2022 年那篇论文的冲击力，不是“模型会写两道题”，而是系统在正式比赛设定下摸到了大约一半选手的位置。

核心不是单次 greedy 解码，而是海量采样再过滤。生成可以到十万、百万量级，先用公开样例筛掉明显错的，再按程序行为聚类，最后只交有限几次——接近人类选手的提交次数上限。CodeContests 因此既是数据集，也是“竞赛代码需要搜索”这一论点的证据。

它站在 APPS 后面，把竞赛线从“有难度梯度的题库”推进到“用隐藏测试和提交预算说话”。LiveCodeBench 后来做时间窗口，想解决的是这批公开题被背穿的问题，不是否定竞赛这条线。`,
    architecture: `题面到完整程序，C++、Python 等多语言提交。评测走隐藏测试与时限，错一个边界就是 0，跟真实比赛一样不讲情面。公开样例只用来过滤，真正算分的是隐藏测试。

主指标是 n@k，人话版：先让模型写 k 份程序，再从里面挑 n 份去交，只要这 n 份里有一份过隐藏测试就算这道题做出来。AlphaCode 常用 10@k，意思是采样可以很大，但提交次数卡在 10，模拟比赛规则。pass@k 相当于 k@k，假设你能把所有样本都交上去，是 n@k 的上限，不是同一回事。

AlphaCode 的对外叙事还有模拟 Codeforces 百分位，不是单一 pass@1。复现时采样预算、过滤策略、聚类有没有做，必须声明。只报 greedy pass@1，等于把论文最重要的那一章撕掉。`,
    content: `一万余道竞赛题，含题面、正确提交、错误提交和测试。错误提交不是垃圾，是训练信号：人类也会交错，模型可以从反例里学。难度从 Div.2 到更难的 Codeforces 档都有。

和 HumanEval 的函数作业完全不是一类对象。题面长，要自己处理输入输出，隐藏测试故意卡边界和复杂度。DeepMind 强调过，先前一些竞赛集的假阳性很高，CodeContests 用更严的隐藏测试把误过率压下去。

多语言是设定的一部分，不是事后翻译。同一道题可以有 Python 和 C++ 的正确解，评测看行为不看你用哪门语言写。题仍是公开竞赛题，时间一久照样会进语料。`,
    format: "竞赛程序，多语言 IO",
    metrics: ["pass@k", "模拟比赛百分位"],
    size: "约 13k 题",
    lineage: {
      parents: ["apps"],
      children: ["livecodebench"],
      related: ["humaneval"],
    },
    caveats: `和 AlphaCode 的采样规模绑在一起。原论文能打到中位水平，靠的是十万、百万级采样加过滤，不是你今天在 API 里 greedy 解一次。把 pass@1 当成 CodeContests 的主叙事，是在用错尺子。

n@k 的 k 必须写出来。10@1k 和 10@100k 不是同一个实验；过滤和聚类关没关，也不是同一个实验。不声明预算的解决率，无法和其他系统比。

公开拆分的污染风险高。这些题来自真实比赛，题解和复盘到处都是。LiveCodeBench 用时间戳切窗口，就是承认 CodeContests 这种静态竞赛集迟早会被背。`,
    links: [
      { rel: "paper", label: "AlphaCode 论文", href: "https://arxiv.org/abs/2203.07814" },
      { rel: "repo", label: "GitHub", href: "https://github.com/google-deepmind/code_contests" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/deepmind/code_contests" },
    ],
  },
  {
    slug: "multiple",
    name: "MultiPL-E",
    shortName: "MultiPL-E",
    accession: "OB-2022-C05",
    year: 2022,
    status: "foundational",
    kind: "benchmark",
    family: "coding",
    domains: ["多语言", "函数合成"],
    org: "Northeastern NUPRL",
    authors: "Cassano et al.",
    summary:
      "把 HumanEval 和 MBPP 编译到十几门语言，专门打“只会 Python”的盲区。它不是新题库，是同一组函数作业的多语言投影。语言之间的分数差，混杂了模型能力和翻译质量，不能直接读成“Rust 比 PHP 难”。",
    origin: `2022 年的代码模型评测几乎只报 Python。谁都会说自己的模型“支持多语言”，表格里却只有 HumanEval。Northeastern NUPRL 的 Cassano 等人把这件事做成了可跑的尺子：把 HumanEval 和 MBPP 的题面、测试和类型签名翻译成约 18 门语言，并配上统一的执行容器。

MultiPL-E 让“多语言代码能力”第一次有了可复现的对照，而不是口头承诺。BigCode 的评测 harness 直接把它收进去，StarCoder 一类开源码模型卡上的多语言栏，很多都经过这里。没有它，Python 高分可以无限装成通用代码能力。

它选择翻译旧题而不是从零出新题，是有意的：同一组语义，才能把语言差从题差里拆出来。后面 Aider Polyglot、FullStack Bench 走的是另一条路——用原生题测各语言生态。两条线不要并成一列。`,
    architecture: `每门语言一套编译后的 prompt 与单测。翻译尽量保持语义，但类型系统、标准库和语法习惯会让同一道题在不同语言里难度不一样。这是特性，不是噪声：Rust 要过所有权，Bash 要过字符串陷阱，不能当成翻译事故删掉。

指标仍是分语言的 pass@k。总平均可以报，但必须能拆开。某模型 Python 很高、Rust 垮掉，平均分会把故事藏住。执行在对应语言的容器里，工具链版本要跟官方对齐。

它测的是函数级合成，协议跟 HumanEval 是亲戚。不是 Web 框架，不是包管理，不是构建系统。把 MultiPL-E 的 Go 分说成“会写生产级 Go 服务”，跨了两个量级。`,
    content: `覆盖 Bash、C++、C#、D、Go、Java、JavaScript、Lua、Perl、PHP、R、Racket、Ruby、Rust、Scala、Swift、TypeScript 等。不是从零出的新题，而是 HumanEval / MBPP 的多语言投影。题还是那些字符串、小算法、列表处理。

因为是翻译，题不会突然变成某语言的惯用生态。你看不到 Rails、看不到 React、看不到 Cargo workspace。你看到的是“同一道练习题用这门语言怎么写”。

语言覆盖面在 2022 年已经算阔。后来的全栈集和编辑榜会补上更工程的场景，但就“模型是不是只会 Python”这个问题，MultiPL-E 仍然是最干净的一刀。`,
    format: "多语言函数合成 + 单测",
    metrics: ["pass@k（分语言）"],
    size: "HumanEval / MBPP 的 18 语言译本",
    lineage: {
      parents: ["humaneval", "mbpp"],
      children: ["aider-polyglot"],
      related: ["bigcode-eval-harness", "fullstackbench"],
    },
    caveats: `翻译题测不到某语言的惯用生态。Web、构建系统、包管理、错误处理习惯，都不在这套投影里。Rust 分高不代表会写生产 crate，Bash 分高也不代表会写可维护的运维脚本。

语言之间的分数差混杂了模型能力和翻译质量。有的语言类型更严，有的测试翻译得更脆，有的标准库写法别扭。看到“某语言低 20 个点”先别写进能力结论，先看是不是翻译把题变难了。

底层仍是 HumanEval / MBPP，原题的薄测试和污染问题原样继承。换语言不是换新题。Python 已经背过的语义，换语法外壳之后仍可能被记起。`,
    links: [
      { rel: "paper", label: "MultiPL-E 论文", href: "https://arxiv.org/abs/2208.08227" },
      { rel: "repo", label: "GitHub", href: "https://github.com/nuprl/MultiPL-E" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/nuprl/MultiPL-E" },
    ],
  },
  {
    slug: "ds-1000",
    name: "DS-1000",
    shortName: "DS-1000",
    accession: "OB-2022-C06",
    year: 2022,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["数据科学", "库 API", "StackOverflow"],
    org: "HKU / Stanford / Google 等",
    authors: "Lai et al.",
    summary:
      "一千道来自 StackOverflow 的数据科学题，盯的是 NumPy、Pandas 一类真实 API，而不是教材算法。HumanEval 不碰第三方库，DS-1000 专门把“会不会用生态”写成可执行测试。库版本一漂，分数就会跟着漂。",
    origin: `HumanEval 不碰第三方库，MBPP 也不碰。可数据科学家日常搜的不是 FizzBuzz，是“这条 Pandas 链为什么把我的索引搞丢了”。DS-1000 从 StackOverflow 收集这类真问题，覆盖七个主流 Python 库，把代码评测从算法作业推进到“会不会用生态”。

作者做了防泄漏改写：扰动表面字符串，避免模型靠背原帖过关。这是公开承认——原帖就在网上，不改写就等于开卷。扰动不能消灭污染，但至少让“原样复制”变难。

它后来成了 BigCodeBench 的重要前史：函数级评测一旦要碰真实库，环境、版本、多解就开始变成一等公民。没有 DS-1000，后面那些“工具使用”基准会显得从天上掉下来。`,
    architecture: `补全或插入代码，用作者提供的测试判定对错。可以按库拆开报准确率或 pass@k，总分会掩盖“NumPy 还行、Matplotlib 一塌糊涂”。评测依赖对应科学计算栈的版本，环境漂移会直接改结果。

这不是纯算法的 stdin/stdout。你要在指定上下文里写出能跑的库调用，轴、广播、dtype、inplace 这类细节都会被测试咬到。多解是常态：同一件事 Pandas 能写三种，测试可能只认其中一种，也可能宽到几种都能过。

复现必须锁版本。NumPy 2 和 NumPy 1、TensorFlow 1 和 2，不是同一场考试。谁用最新环境跑 2022 年的测试，谁就在给自己制造假分差。`,
    content: `七个库：NumPy、Pandas、TensorFlow、PyTorch、SciPy、Scikit-learn、Matplotlib。题是自然提问风格，常涉及边界、轴、广播、对齐和绘图细节，读起来像你真的会去搜的那些帖子。

一千道题按库分布并不均匀，数据表格和数组操作更重，某些深度学习库更轻。分库看才有信息量。表面扰动改了变量名和描述，语义还是那些 SO 问题。

它不覆盖 SQL 仓、Spark 集群、也不覆盖“先装环境再跑实验”。它是库 API 的函数级切片。会用 Pandas 不等于会做完整的数据分析项目。`,
    format: "库 API 代码生成 + 执行测试",
    metrics: ["pass@k / 准确率（分库）"],
    size: "1,000 题，7 个库",
    lineage: {
      parents: ["humaneval"],
      children: ["bigcodebench"],
      related: ["mbpp", "scicode", "naturalcodebench"],
    },
    caveats: `绑定特定库版本。科学计算栈升级一次，测试就可能集体变红或变绿。论文之间如果没锁同一份环境，分差先当环境噪声。官方提供的执行环境不是可选项，是协议的一部分。

部分题有多解，测试可能过严或过宽。过严会误杀等价写法，过宽会放过半对的调用。不要把每一分都读成“会不会这个 API”，有些是测试口味。

不要把它当成通用软件工程。没有 issue、没有跨文件重构、没有依赖冲突。它测的是数据科学库的短代码，不是仓库级修 bug。跟 SWE-bench 放同一张能力雷达图上，需要非常诚实的图例。`,
    links: [
      { rel: "paper", label: "DS-1000 论文", href: "https://arxiv.org/abs/2211.11501" },
      { rel: "homepage", label: "项目主页", href: "https://ds1000-code-gen.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/HKUNLP/DS-1000" },
    ],
  },
  {
    slug: "bigcode-eval-harness",
    name: "BigCode Evaluation Harness",
    shortName: "bigcode-eval",
    accession: "OB-2022-C07",
    year: 2022,
    status: "active",
    kind: "harness",
    family: "coding",
    domains: ["评测框架", "代码生成"],
    org: "BigCode (Hugging Face / ServiceNow 等)",
    authors: "Ben Allal, Muennighoff et al.",
    summary:
      "BigCode 的代码生成评测运行时，HumanEval、MBPP、MultiPL-E 的常用入口。它不是新题集，是执行协议：截断、few-shot、沙箱和 pass@k 怎么算，都由它说了算。和 EvalPlus、LiveCodeBench 官方脚本不是同一套测试，跨 harness 对比没有意义。",
    origin: `The Stack、SantaCoder、StarCoder 需要统一的代码评测栈。开源码模型如果每家自己写一份 HumanEval 脚本，分数就会变成方言。BigCode 仿 lm-eval 做了面向执行的 harness：生成、沙箱跑测、汇总 pass@k，让多语言代码评测有一个公共入口。

很多开源码模型卡上的多语言分数，路径都经过这里。它的历史贡献不是出题，是把“怎么跑”标准化。没有这份运行时，MultiPL-E 的 18 门语言会散成 18 个无法对比的 gist。

它和 EvalPlus 是两条绳。EvalPlus 改测试；harness 改运行方式。有人用这份 harness 跑原版 HumanEval，有人用 EvalPlus 跑增强测试，两个数字都叫 HumanEval pass@1，却不是同一个实验。`,
    architecture: `任务注册表加 Hugging Face 模型生成，可选 Docker 沙箱。内置 HumanEval、MBPP、MultiPL-E、DS-1000、APPS 等常见题。多 GPU 采样常用 accelerate。你选的温度、n、top-p、是否 greedy，会直接决定 pass@k 长什么样。

它决定一道代码题怎么截断、怎么喂 few-shot、失败的程序算 0 还是超时、输出里的 markdown 围栏剥不剥。这些“工程细节”在代码评测里不是细节，是分数本身。换一个停止符，排行榜就能动。

主指标沿用各任务自带的，最常报 pass@k。声明必须包括：哪份 commit、哪些任务、n 和 k、解码参数、是否沙箱。只贴一个平均数，等于没报。`,
    content: `不是新题集，是执行协议。里面没有作者原创的 164 道新题，只有“这些旧题在这套管道里怎么跑”。它的内容是配置、容器、采样和汇总脚本。

默认任务列表会随版本增减。你三年前复现的命令，今天可能已经对不上同一组 prompt。harness 的版本号和任务定义，要当成数据的一部分记下。

它覆盖的是函数级、竞赛级那些能在沙箱里跑通的题，不是 SWE-bench 那种仓库安装。别指望用它一键复现 agent 榜。代码生成和软件工程 agent，运行时已经分家。`,
    format: "生成 + 沙箱执行框架",
    metrics: ["任务自带；常报 pass@k"],
    lineage: {
      parents: [],
      children: [],
      related: ["humaneval", "mbpp", "multiple", "ds-1000", "lm-eval-harness", "evalplus"],
    },
    caveats: `和 EvalPlus、LiveCodeBench 官方脚本不是同一套测试。跨 harness 对比 HumanEval 分数没有意义——测试数量、prompt、截断、是否聊天包装都可以不同，数字碰巧接近也不说明模型接近。

分数对温度、n、top-p 极度敏感。同一模型在这份 harness 里把 n 从 1 调到 20，pass@k 能换一副面孔。模型卡如果不写解码参数，这个栏可以当装饰。

默认 prompt 不一定等于原论文。任务实现会漂，依赖会漂，沙箱镜像也会漂。引用时写清 git commit，比写“用了 BigCode harness”有用得多。`,
    links: [
      { rel: "repo", label: "GitHub", href: "https://github.com/bigcode-project/bigcode-evaluation-harness" },
    ],
  },
  {
    slug: "humaneval-plus",
    name: "HumanEval+",
    shortName: "HumanEval+",
    accession: "OB-2023-C08",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["函数合成", "测试覆盖", "假阳性"],
    org: "UIUC / EvalPlus",
    authors: "Liu, Xia, Zhang et al.",
    summary:
      "给 HumanEval 补上约 80 倍测试，专门揭穿“过了官方单测但代码是错的”。它没有换题，只换了判分的严格程度，却足以让排行榜翻盘。只报 base 或只报 plus，都是在选择对自己有利的那张脸。",
    origin: `EvalPlus 发现 ChatGPT 时代的 HumanEval 分数里有大量假阳性：官方测试太少，错误实现也能过。论文标题问得很难听——ChatGPT 写出来的代码真的对吗——答案是：按原测试看对，按加严测试看经常不对。

作者用大模型和变异测试把用例扩到大约 80 倍，做成 HumanEval+，同一套方法还有 MBPP+。他们还修过原集里有缺陷的参考实现，大约一成题的金标本身就有问题。量表先测出自己的 bug，这件事本身就够写进代码评测史。

没有换题，只换了判分的严格程度，却足以让排行榜重排。最常被转述的例子：WizardCoder-CodeLlama 和 Phind-CodeLlama 在原版 HumanEval 上显得不如 ChatGPT，加上增强测试之后反过来。测试不足不仅抬分，还会改名次。`,
    architecture: `原题不变，测试集换成自动生成再过滤的大规模套件。生成器用大模型出种子输入，再用变异去长，最后靠差分测试和契约把无效输入扔掉。主指标仍是 pass@k，通常同时报 base 与 plus。

官方实现在 EvalPlus 仓库，和 openai/human-eval 不是同一运行时。有人用 BigCode harness 跑原测试，有人用 EvalPlus 跑 plus，两个数字都叫 HumanEval，不能进同一张表。plus 还有 mini 子集，用更少测试逼近全量加严效果，图的是跑得快。

评测协议仍是函数补全加执行。温度、n、聊天包装这些老问题一个没少。正确的报表是一对数字：base / plus，以及两者的落差。落差大，说明模型在吃薄测试的红利。`,
    content: `还是那 164 题，语义、签名、docstring 都不动。变的是每题后面跟着的测试：从几个 assert 变成上百到上千条，覆盖边界、类型和隐蔽分支。均值大约从个位数用例拉到数百。

增强测试会打到原测试看不到的条件组合。模型写了个“看起来对、样例也对”的实现，一碰到空输入或奇怪类型就露馅。这正是 plus 存在的理由：把假阳性从分数里抠出去。

题本身该被背的还是会被背。HumanEval+ 解决的是测试不足，不是污染。把 plus 高分当成抗污染证明，是把两个病当成一种药。`,
    format: "原题 + 增强单测",
    metrics: ["pass@k（base / plus）"],
    size: "164 题，测试约 80×",
    lineage: {
      parents: ["humaneval"],
      children: [],
      related: ["mbpp", "evalplus", "bigcode-eval-harness"],
    },
    caveats: `增强测试本身可能过严，也可能带生成噪声。自动长出来的用例偶尔会卡到一种合理但不被金标接受的写法。plus 更严，不等于 plus 永远更正确。两边都要报，落差才是信息。

只报 plus 或只报 base 都会误导。base 好看是假阳性，plus 好看也可能是模型过拟合了 EvalPlus 的风格。排行榜翻盘是公开事实，不意味着新名次就是真理，只意味着旧名次不配再当真理。

污染问题原题还在。164 道题该泄漏还是泄漏。HumanEval+ 是加严的 HumanEval，不是新考卷。前沿模型在 plus 上也会逐渐饱和，那时该换的是题，不只是测试。`,
    links: [
      { rel: "paper", label: "EvalPlus 论文", href: "https://arxiv.org/abs/2305.01210" },
      { rel: "repo", label: "EvalPlus", href: "https://github.com/evalplus/evalplus" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/evalplus/humanevalplus" },
      { rel: "harness", label: "EvalPlus harness", href: "https://github.com/evalplus/evalplus" },
    ],
  },
  {
    slug: "classeval",
    name: "ClassEval",
    shortName: "ClassEval",
    accession: "OB-2023-C09",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["类级生成", "面向对象"],
    org: "Fudan SELab",
    authors: "Du et al.",
    summary:
      "一百个手写 Python 类级任务，测的是跨方法依赖而不是单函数。官方比较 class-level 和 method-level 两种协议，前者难得多，混报等于把对象拆回函数作业。它仍是单文件，离真实仓库还差一截。",
    origin: `复旦软工组认为 HumanEval 的自包含函数不能代表面向对象开发。真实代码里方法要共享字段、互相调用、一起维护不变量，把这些拆成 164 个独立函数，等于把对象溶解掉。他们手工设计 100 个类，每个类有多方法、共享字段和类级测试。

ClassEval 是从“写一个函数”走向“写一个对象”的关键一步。它还没到 SWE-bench 那种仓库级 issue，但已经逼模型在同类内部做依赖，而不是每次从空白重新发明一个 helper。后面的 CoderEval、仓库补全、修 bug 基准，都默认接受了这个判断：standalone 函数是下限，不是代表。

手写出题而不是从 GitHub 切函数，是为了把依赖关系设计进题里。自动切出来的方法常常仍然接近独立。一百个类规模不大，但每个类都是故意做成“必须一起看”的。`,
    architecture: `两种协议。class-level 要求一次生成整个类；method-level 可以按方法逐个生成，模型能看到类里其他部分。官方比较过，前者难得多。报分必须声明协议，否则你不知道自己在看对象还是在看函数。

生成完跑类级单测，指标是 pass@k。测试锁的是类的行为，不是某个方法的局部返回值。方法对了但破坏了共享状态，照样挂。这是 HumanEval 那种单函数 assert 测不到的东西。

评测仍在 Python 单文件里进行，没有安装整个项目，没有跨包引用。它比函数作业难，比仓库修 bug 简单。把它说成软件工程基准，是提前领了 SWE-bench 的功劳。`,
    content: `100 个类、约 410 个方法、七千余条测试。场景包括管理器、数据模型、小工具，依赖出现在同类其他方法里：字段谁改、谁读、初始化顺序，都会进测试。

题是手写的教学型对象，不是从 Django 源码里切出来的生产类。你看不到历史包袱、看不到奇怪的向后兼容，也看不到跨文件的继承树。难在方法之间的耦合，不在仓库导航。

测试量比 HumanEval 厚得多，这是有意的。类级行为要用更多断言才能锁住。即便如此，它锁住的仍是作者设计的那套行为，不是某个真实项目的回归套件。`,
    format: "类级代码生成 + 单测",
    metrics: ["pass@k"],
    size: "100 类 / 约 410 方法",
    lineage: {
      parents: ["humaneval"],
      children: [],
      related: ["codereval", "swe-bench", "canitedit"],
    },
    caveats: `仍是单文件，没有真实仓库历史，没有 issue 文本，没有该看哪个模块的检索问题。ClassEval 高分不等于会在生产代码库里改类。下一步是仓库，不是再出 100 个类。

method-level 协议会把类级难点拆掉。模型如果能看到其他方法的实现再填一个，任务就退回函数补全。只报 method-level 却在摘要里写“类级生成”，是在偷换评测单元。

规模小，方差大，场景偏教学。不要用它代表面向对象能力的上限，也不要和 SWE-bench 的 resolve rate 放进同一句“代码能力提升了”。`,
    links: [
      { rel: "paper", label: "ClassEval 论文", href: "https://arxiv.org/abs/2308.01861" },
      { rel: "repo", label: "GitHub", href: "https://github.com/FudanSELab/ClassEval" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/FudanSELab/ClassEval" },
    ],
  },
  {
    slug: "repobench",
    name: "RepoBench",
    shortName: "RepoBench",
    accession: "OB-2023-C10",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["仓库级补全", "检索"],
    org: "UC San Diego",
    authors: "Liu, Xu, McAuley",
    summary:
      "仓库级自动补全：先检索跨文件上下文，再预测下一行。它评的是 IDE 补全系统，不是修 issue 的 agent。下一行预测对了，和生成整份补丁不是同一能力，检索器质量会直接主导流水线分数。",
    origin: `单文件补全忽略了真实 IDE 里最烦人的一步：该看哪个文件。程序员补下一行之前，先得把别的模块、类型定义、工具函数调进上下文。RepoBench 把这件事拆开，用 Python 与 Java 的真实项目说话，而不是再用 HumanEval 假装仓库不存在。

三项任务对应三条问题。R 问检索器能不能找到该看的跨文件片段，C 问在给定上下文里能不能写出下一行，P 把二者串成流水线。它评的是补全系统，不是修 GitHub issue 的 agent。后来 SWE-bench 火了，有人回头把 RepoBench 也说成 agent 基准，那是改写历史。

UCSD 这组工作出现在 2023 年仓库级评测刚起势的时候。CrossCodeEval、CoderEval、SWE-bench 各自切了仓库的不同面：补全、带依赖的函数生成、修 bug。RepoBench 的切面是光标处的下一行。`,
    architecture: `RepoBench-R：给定光标位置，从仓库里检索相关跨文件片段，看排在前面的是不是真相关。RepoBench-C：上下文已经给好，预测下一行。RepoBench-P：先检索再补全，模拟真实 IDE。三项必须分开报，P 的分数尤其受检索器拖累。

指标含检索准确率、Exact Match、编辑相似度。下一行对上才算 EM，差个标识符就是 0。编辑相似度更松，能看到“几乎写对但名字错了”。不要只用 EM 宣布模型不会补全，也不要只用相似度宣布模型会补全。

它不跑单测，不安装项目，不要求补丁能合并。成功是“这行像原作者写的”，不是“测试变绿”。跟 SWE-bench 的 FAIL_TO_PASS 完全不是同一套判分哲学。`,
    content: `来自开源 Python / Java 仓库的光标位置。正确答案是下一行代码，而不是一整份补丁，更不是一个新功能。样本是从真实项目里切出来的，带着当时的目录结构和跨文件引用。

下一行可能很短，短到看起来像语言建模。难处在于正确的那一行往往依赖你没打开的文件：API 名字、常量、类型。只看当前文件会写得通顺并且错。

没有 issue 描述，没有“请修复这个 bug”的自然语言任务。输入是代码上下文，输出是代码。把它包装成指令遵循基准，是拿错了接口。`,
    format: "检索 + 下一行补全",
    metrics: ["Retrieval 准确率", "Exact Match", "编辑相似度"],
    size: "Python 与 Java 仓库级样本（分 R/C/P）",
    lineage: {
      parents: [],
      children: [],
      related: ["crosscodeeval", "swe-bench", "codereval"],
    },
    caveats: `下一行预测与生成整文件、生成补丁不是同一能力。补全对了下一行，不代表会修 bug，更不代表会按 issue 改三个文件。仓库级这个词很容易把人带跑，这里的仓库只服务于补全。

检索器质量会主导 Pipeline 分数。P 任务上模型换了、检索器没换，名次可能几乎不动；反过来，换检索器就能改写结论。报 P 必须同时报检索设定，否则你不知道功劳算谁的。

仓库快照与预训练重叠难以彻底排除。开源 Python / Java 项目太容易进语料。高 EM 可能是背过邻近代码，不一定是真的会检索。`,
    links: [
      { rel: "paper", label: "RepoBench 论文", href: "https://arxiv.org/abs/2306.03091" },
      { rel: "repo", label: "GitHub", href: "https://github.com/Leolty/repobench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/tianyang/repobench-p" },
    ],
  },
  {
    slug: "crosscodeeval",
    name: "CrossCodeEval",
    shortName: "CrossCodeEval",
    accession: "OB-2023-C11",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["跨文件补全", "多语言"],
    org: "Columbia / AWS AI Labs",
    authors: "Ding, Wang, Ahmad et al.",
    summary:
      "必须读跨文件上下文才能做对的多语言代码补全。作者证明只看当前文件时，强模型也会在真实语句上栽跟头，因为 API 和类型定义在别的文件里。它评的是补全和检索，不是修 bug。",
    origin: `作者想证明一件很具体的事：只看当前文件，即便强代码模型也补不对很多真实语句，因为 API 与类型定义在别的文件里。这不是玄学，是 IDE 每天都在做的事。CrossCodeEval 从宽松许可的 GitHub 仓库构造这类样本，覆盖四种语言，并顺手评代码检索器。

它和 RepoBench 是同一年的仓库补全线，切法不同。RepoBench 把检索、补全、流水线拆成三项；CrossCodeEval 强调“去掉跨文件上下文后，这道题必须变难”，用这个约束保证样本不是单文件就能做的假仓库题。

2023 年仓库级评测刚从补全走向修 issue。这篇工作停在语句补全，没有假装自己是 SWE-bench。后来的人如果把它和 agent 榜混着引，是引用端的错。`,
    architecture: `光标补全到语句结束，不是下一行、也不是整文件。对比设置包括：无跨文件上下文、检索跨文件、引用增强等。谁提供上下文、提供多少，必须写进协议，否则分数在比检索器而不是在比生成模型。

指标是精确匹配与代码相似度。EM 很苛刻，标点都能杀掉；相似度更宽，适合看“差不多对”。也可以当检索基准：相关跨文件片段找没找到，会直接决定后面补全有没有材料。

它不执行测试。判分是对照原仓库里真实写下的那句代码。能跑通但写法不同的补全，可能被判错。这是补全基准的老毛病，不是这套数据独有。`,
    content: `Python、Java、TypeScript、C# 的真实仓库片段。每条样本在去掉跨文件上下文后，正确补全会显著变难——这是入选标准，不是事后观察。四种语言让它比纯 Python 的仓库补全更难被“我们只训了 Python”糊弄。

正确答案是那一句代码，不是补丁，不是新功能。上下文里会出现类型、调用约定、邻接实现。模型要做的是把别处的定义用到光标处，而不是发明一个本地能编译的替代品。

仓库来自宽松许可的 GitHub 项目，规模到万条量级。它仍然是快照，不是活仓库。许可宽松降低了使用门槛，不降低预训练重叠的风险。`,
    format: "跨文件语句补全",
    metrics: ["Exact Match", "Code similarity"],
    size: "四语言，约万条量级",
    lineage: {
      parents: [],
      children: [],
      related: ["repobench", "codereval", "swe-bench"],
    },
    caveats: `评的是补全，不是修 bug。语句写对了，不代表会读 issue、会改测试、会在仓库里找到该动的文件。CrossCodeEval 高分和 SWE-bench resolve rate 没有换算公式。

仓库快照与预训练重叠难以彻底排除。GitHub 上的宽松许可项目，恰恰最容易进代码语料。高 EM 要先怀疑“是不是见过邻近文件”，再谈论跨文件推理。

上下文给多少由实验者决定。有人把金标相关文件直接塞进窗口，有人真的上检索。前者测的是阅读，后者测的是系统。混在一张表里，检索器的功劳会被算到模型头上。`,
    links: [
      { rel: "paper", label: "CrossCodeEval 论文", href: "https://arxiv.org/abs/2310.11248" },
      { rel: "homepage", label: "项目主页", href: "https://crosscodeeval.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/amazon-science/cceval" },
    ],
  },
  {
    slug: "swe-bench",
    name: "SWE-bench",
    shortName: "SWE-bench",
    accession: "OB-2023-C12",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "coding",
    domains: ["仓库级修 bug", "GitHub issue"],
    org: "Princeton NLP",
    authors: "Jimenez, Yang et al.",
    summary:
      "把真实 GitHub issue 变成评测单元：读仓库、改代码、让原仓库测试变绿。原论文设定下解决率是个位数；后来数字飙升，很大一部分是脚手架在涨，不是纯模型血统。FAIL_TO_PASS 和 PASS_TO_PASS 说人话就是：该修好的测试必须变绿，本来就绿的不许弄红。",
    origin: `Princeton NLP 认为函数级合成已经不够。HumanEval 满分也回答不了“会不会在真实项目里修 issue”。他们从 12 个流行 Python 仓库收集已合并的 issue 与 pull request，构造 2,294 道任务：给模型仓库快照和 issue 文本，输出补丁，用项目自带测试判定。评测单位从函数改成了仓库。

原论文的数字很难看，这是优点不是丑闻。Claude 2 配 BM25 检索大约只解决 1.96%，当时最强模型加检索也是个位数。2024 年 SWE-agent 配 GPT-4 把全量集做到大约 12.5%，Devin 一类产品跟着报百分之十几。从个位数到两位数，圈里第一次认真讨论 agent 脚手架。

它直接催生了 SWE-agent、OpenHands 和一整条仓库级 agent 赛道。Lite、Verified、Pro、Gym、Lancer 都是它的后话。没有 SWE-bench，今天模型卡上那栏 resolve rate 不会存在。也正因为此，它被用到了协议之外：有人把它当纯模型榜，有人拿原集的脏实例攻击所有后续切片。`,
    architecture: `输入是 issue 文本加代码库快照，输出是 git patch。环境按历史依赖安装，跑两组测试。FAIL_TO_PASS：金标补丁之前是红的、修好必须变绿的那些测试，相当于“这张 issue 到底修没修”。PASS_TO_PASS：本来就绿的回归测试，修完不许弄红。两组全过才算 resolved，主指标是 resolve rate。

模型看不到这些测试。它要自己读 issue、在仓库里找文件、改、再碰运气等评测端跑。安装失败、补丁打不上、测试超时，都算没解决。Docker 化之后可复现性好了很多，但历史依赖仍然脆，搭建成本高。

分数强烈依赖 agent scaffold。同一模型配 SWE-agent、Agentless、OpenHands、迷你 shell agent，数字可以差出一截。工具次数、检索、是否允许再跑测试、采样 n@k（生成多份补丁取最好），全是分数的亲爹。官方后来提供 Lite / Verified 等切片，就是因为原 2294 条又贵又噪，不适合当默认对照。`,
    content: `Django、scikit-learn、SymPy、matplotlib、pytest、Sphinx 等 12 个 Python 项目的真实缺陷与功能请求。补丁常跨多文件，测试是项目原有的 pytest 或脚本，不是作者另写的三五行 assert。

issue 文本质量参差。有的描述清楚，有的要靠讨论区和相关 PR 才能懂，有的测试其实测不到描述里的修复。这是真实软件仓库的样子，也是原集被批评的原因。Verified 后来把写不清、测试有问题的实例剔掉，工业界才有了一份更干净的 500 条。

全是 Python，全是这 12 个仓。多样性从一开始就窄。预训练里见过 Django 源码，不等于会修 Django issue，但也不能假装这 12 个仓是神秘的新大陆。污染时钟对它们同样适用。`,
    format: "issue → patch，执行仓库测试",
    metrics: ["Resolved rate"],
    size: "2,294 条",
    lineage: {
      parents: [],
      children: [
        "swe-bench-lite",
        "swe-bench-verified",
        "swe-bench-pro",
        "swe-gym",
        "swe-lancer",
        "swe-bench-live",
        "swe-rebench",
        "swe-bench-science",
      ],
      related: ["repobench", "terminal-bench", "the-agent-company", "codereval", "princeton-nlp"],
    },
    caveats: `原集含难解、描述不足与环境脆弱的实例。有的测试过宽，错补丁也能绿；有的过严，对的补丁因为对不上金标写法而红。SOTA 报道已转向 Verified，还在用全量 2294 条宣称新高，要说明为什么不用更干净的切片。

分数强烈依赖 agent scaffold，不是纯模型属性。换脚手架比换模型更能改写名次。工具预算、是否自测、n 次尝试取最好（一种 n@k），都必须写进表头。只报模型名字加一个 resolve rate，是把系统分算成智商。

这 12 个仓可能出现在预训练里，issue 文本也可能泄漏金标线索。环境脆、评测贵。不要拿 SWE-bench 原集的个位数去羞辱今天的 Verified 高分，也不要用今天的高分假装原论文的难度还在。`,
    links: [
      { rel: "paper", label: "SWE-bench 论文", href: "https://arxiv.org/abs/2310.06770" },
      { rel: "homepage", label: "swebench.com", href: "https://www.swebench.com" },
      { rel: "repo", label: "GitHub", href: "https://github.com/SWE-bench/SWE-bench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/SWE-bench/SWE-bench" },
    ],
  },
  {
    slug: "canitedit",
    name: "CanItEdit",
    shortName: "CanItEdit",
    accession: "OB-2023-C13",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["代码编辑", "指令遵循"],
    org: "Northeastern NUPRL",
    authors: "Cassano et al.",
    summary:
      "手写的 Python 编辑指令，测模型会不会改已有代码而不是从零写。instructional 给明确步骤，descriptive 更像用户口述，混报会把“听得懂人话”和“会改代码”揉成一笔。单文件短编辑，代表不了跨仓重构。",
    origin: `真实工作里更多是改文件，而不是对着空白生成一个函数。NUPRL 在 MultiPL-E 之后把这个问题单独做成尺子：给你一份已有代码和一条编辑请求，看你改完还能不能过测试。CanItEdit 把“听懂编辑意图”从代码合成里拆出来。

两组编辑口味不同。instructional 步骤清楚，像代码审查意见；descriptive 更接近用户口述，含糊、不给定位、要你自己猜该动哪。后者对指令遵循更敏感，前者更接近传统补丁。把两组平均掉，故事会变好看，信息会变少。

它也影响了后来 Aider 一类编辑器评测：关注点从“会不会写”转到“会不会按格式改”。Aider 自己不是论文，但 CanItEdit 是这条编辑线在学术侧的明确起点之一。`,
    architecture: `给定原文件与编辑请求，模型输出新文件，跑单测。指标是 pass@k。协议分 instructional / descriptive，必须分开报。允许采样多次，但 n 和 k 要声明，不要把编辑任务偷偷写成 greedy 一次成功。

判分看行为，不看 diff 漂不漂亮。改对了但测试没锁住的旁路变化，可能被放过；测试过严时，等价重构也可能被杀掉。这是单测编辑基准的老张力，和 HumanEval 的薄测试是同一类病，只是这里至少有“改前改后”的对照。

评测单元是单文件。没有仓库检索，没有多文件联改，没有把补丁打进历史依赖。它比函数合成更接近工作，比 SWE-bench 轻一个数量级。`,
    content: `105 道手写 instructional 与 126 道 descriptive，合计 231 题。覆盖重构、修 bug、加功能。每题有测试锁住行为，不是让模型自由发挥到“看起来更好”。

题是作者设计的短 Python 文件，不是从大型项目里切出来的模块。依赖关系存在，但半径很小。你改的是一份能一眼看完的代码，不是 Django 的半个应用。

两组题的语言风格差得很明显。instructional 像规范的 issue，descriptive 像聊天框里的一句话。只报总分的人，通常在用好写的那组给含糊的那组擦粉。`,
    format: "代码编辑 + 单测",
    metrics: ["pass@k"],
    size: "231 题",
    lineage: {
      parents: ["humaneval"],
      children: ["aider-polyglot"],
      related: ["swe-bench", "classeval"],
    },
    caveats: `单文件、短编辑，不能代表跨仓重构。文件一眼能看完，就不存在“该打开哪个模块”的问题。CanItEdit 高分说明模型会按指令改短代码，不说明它能在 SWE-bench 上 resolve。

descriptive 题对指令遵循更敏感，混报会丢信息。两组难度和失败模式都不同，平均分会把“听不懂人话”藏进“代码还行”。论文和模型卡都应拆开。

手写题规模小，风格是作者的风格。污染风险低于满网的 HumanEval，但也不要假设这些编辑指令从未进过语料。Aider 榜更工程，却绑定了另一套脚手架，不能互相替代。`,
    links: [
      { rel: "paper", label: "CanItEdit 论文", href: "https://arxiv.org/abs/2312.12450" },
      { rel: "repo", label: "GitHub", href: "https://github.com/nuprl/CanItEdit" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/nuprl/CanItEdit" },
    ],
  },
  {
    slug: "cruxeval",
    name: "CRUXEval",
    shortName: "CRUXEval",
    accession: "OB-2024-C14",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["代码推理", "执行预测"],
    org: "Meta FAIR / MIT",
    authors: "Gu, Rozière et al.",
    summary:
      "八百个 Python 函数上的输入预测与输出预测，测的是会不会在脑子里跑代码。它把评测从“会写”扩成“会推”，和竞赛 pass@k 不是同一轴。函数短、CoT 开关分差大，当生成能力看会完全读错。",
    origin: `Meta FAIR 和 MIT 认为现有基准过度关注生成，忽略了理解与执行。模型能吐出一段能过 HumanEval 的代码，不代表它知道这段代码跑起来会发生什么。CRUXEval 让模型看函数，要么给输出倒推输入，要么给输入预测输出。

它把代码评测从“会写”扩成“会推”。竞赛 pass@k 问的是搜索空间里能不能砸中正确程序；CRUXEval 问的是你会不会当一小段解释器。两条轴可以相关，但不能互换。LiveCodeBench 后来也收了执行和测例预测，多少是同一直觉的活体版。

函数从代码语料里筛出来，保证输入输出短且确定。这是实验室里的执行推理，不是仓库里的调试。短，是为了让对错能自动判；短，也注定了它测不到跨文件状态机。`,
    architecture: `两个任务：input prediction 和 output prediction。可以开 CoT，也可以直接给答案。指标是准确率，常用 pass@1。开不开逐步推理，分差会很大，必须声明。把它跟生成任务的 pass@k 画在同一张折线上，是在比较两种作业。

函数经过筛选，输入输出短、确定、适合当填空。评测看的是答案对不对，不是再跑一遍程序让模型写代码。有人会让模型先生成再执行来“作弊式”过关，那已经不是在测脑子里跑代码，协议要禁止或单独报。

它不改仓库，不写新功能。成功是预测对了具体值。格式抽取（从输出里抠出输入字面量）会引入假分差，复现要对齐官方解析。`,
    content: `800 个短 Python 函数，来自代码语料再过滤。不要求写新功能，要求模拟执行：看到循环、分支、小数据结构，算出该填什么。两任务共用这 800 个函数，等于 800 乘以两种问法。

题短是设计，不是偷懒。输入输出一旦又长又不确定，自动判分就会变成一场解析战争。作者选择了能判的那一档，代价是看不到长程序、副作用和 I/O。

这里没有竞赛题面，没有 issue，没有库 API 文档。内容就是函数本身。它跟 GSM8K 倒更像亲戚：给定一个小世界，推一个短答案。`,
    format: "输入/输出预测",
    metrics: ["Accuracy", "pass@1"],
    size: "800 函数 × 两任务",
    lineage: {
      parents: ["humaneval"],
      children: [],
      related: ["livecodebench", "gsm8k"],
    },
    caveats: `函数短，测不到仓库级推理。脑子里跑 20 行和在 Django 里追一个状态 bug，不是同一种执行。CRUXEval 高分不要写进“代码推理已经解决”的句子。

CoT 与否分差大。关逐步推理时看起来很笨，打开后又像突然会了。报分必须写清提示协议，否则你在比较的是会不会喊“让我们一步步想”，不是会不会执行。

不要把它当成生成能力。它不测会不会写，只测会不会推。用它给代码模型排行，再拿名次去预测 SWE-bench，是跨轴联想。函数来自语料过滤，污染同样可能发生。`,
    links: [
      { rel: "paper", label: "CRUXEval 论文", href: "https://arxiv.org/abs/2401.03065" },
      { rel: "repo", label: "GitHub", href: "https://github.com/facebookresearch/cruxeval" },
    ],
  },
  {
    slug: "livecodebench",
    name: "LiveCodeBench",
    shortName: "LiveCodeBench",
    accession: "OB-2024-C15",
    year: 2024,
    status: "live",
    kind: "benchmark",
    family: "coding",
    domains: ["竞赛编程", "抗污染", "持续更新"],
    org: "UC Berkeley / MIT 等",
    authors: "Jain, Han, Gu et al.",
    summary:
      "按竞赛发布日期滚动收题，专门对抗 HumanEval 式记忆。时间窗口才是产品：v1 到 v6 题量从 400 涨到一千出头，窗口一切，历史 SOTA 就不能硬比。活集的意思是，你今天报的第一名，过几个月可能只是背题冠军。",
    origin: `静态代码集的污染已经说不清。HumanEval、APPS、CodeContests 的题解铺在网上，模型卡上的高分有多少是记忆，谁也给不出干净的分母。LiveCodeBench 的回答很粗暴：从 LeetCode、AtCoder、Codeforces 抓新题，每道题打时间戳，评测时只用不晚于某个日期、最好是模型截止日期之后的题。

它还叠加执行、测试输出预测和自修复等场景，不想只当又一个竞赛生成集。代码侧“活评测”的代表地位是这么来的，LiveBench 也把它当同源思路引用。竞赛平台还在出题，尺子就还在长。

这不是道德洁癖，是方法。公开题当考卷，唯一可持续的办法是让考卷的日期比训练截止日期更晚。代价是版本林立、题量在变、去年的数字今年不能直接抄。`,
    architecture: `主任务是竞赛代码生成，指标 pass@k，常用 pass@1。另有 self-repair、test output prediction、code execution。官方按时间窗口切 contamination-free 子集：只评某一段日期里发布的题。窗口变了，历史分数不能硬比。

版本是公开事实。release_v1 大约覆盖 2023 年 5 月到 2024 年 3 月、400 题；v2 到 2024 年 5 月、511 题；其后 v3 612、v4 713、v5 到 2025 年 1 月的 880 题、v6 到 2025 年 4 月的 1055 题。有人报整段累积，有人报“截止日期之后”的窄窗口，两个数都叫 LiveCodeBench，不是同一场考试。

平台条款和题面版权限制分发，复现常走官方脚本而不是把题重新贴到网上。隐藏测试、难度标签、语言设定都要跟官方对齐。活榜意味着协议本身会动，commit 和 release tag 必须写进表头。`,
    content: `持续流入的新竞赛题，难度从入门到困难。题面与隐藏测试随平台更新。来源是三家主流竞赛站，不是作者手编的函数作业。题还是算法竞赛：数据结构、图、DP、实现细节，不是修仓库。

后期版本有意加大困难题比例，跟着模型变强走。所以你看到“越新的窗口分数越掉”，不一定是模型退步，可能是题更狠了。官方也提醒过，后面几个月更难是预期，不是事故。

除了生成，内容还包括执行推理和测例预测。同一道竞赛题被问了好几遍：会不会写、写错了会不会修、给输入知不知道输出。只报生成 pass@1，等于只用了活集的一页。`,
    format: "带时间戳的竞赛生成 + 相关子任务",
    metrics: ["pass@k", "分场景准确率"],
    size: "滚动题集",
    lineage: {
      parents: ["codecontests", "humaneval"],
      children: ["livebench", "livecodebench-pro"],
      related: ["apps", "bigcodebench", "cruxeval"],
    },
    caveats: `不同版本题量不同，时间窗口不同，难度配比也在变。v1 的第一名和 v5 窄窗口的第一名不能写进同一句“保持 SOTA”。活集意味着这个词会过期，这是功能，不是 bug。

平台条款与题面版权限制分发。私自把题面爬进训练语料，既污染了尺子，也可能踩平台规则。评测脚本和数据版本必须跟着官方走，民间镜像要小心是不是过期窗口。

竞赛题仍是竞赛题。抗污染不等于测软件工程。LiveCodeBench 很高，SWE-bench 仍可能很低。把活竞赛生成当成通用代码能力，只是把 HumanEval 的错误换了一张更新的考卷。`,
    links: [
      { rel: "paper", label: "LiveCodeBench 论文", href: "https://arxiv.org/abs/2403.07974" },
      { rel: "homepage", label: "livecodebench.github.io", href: "https://livecodebench.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/LiveCodeBench/LiveCodeBench" },
    ],
  },
  {
    slug: "naturalcodebench",
    name: "NaturalCodeBench",
    shortName: "NCB",
    accession: "OB-2024-C16",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["自然提示", "应用开发"],
    org: "THU / Zhipu AI",
    authors: "Zhang, Zhao, Liu et al.",
    summary:
      "从在线编码服务的真实用户提问抽样，揭示 HumanEval 高分与实用能力的错位。题更长、测试更脏，原论文里 GPT-4 也只有大约一半。测试集锁在镜像里，复现依赖官方环境，这是防泄漏，也是门槛。",
    origin: `智谱和清华观察到一件圈里心照不宣的事：HumanEval 很接近的模型，在真实用户查询上可以差出一截。作业题上的并列，到了产品里会重新排座。他们从 CodeGeeX 一类服务的自然语言请求里精选 402 道 Python / Java 题，覆盖六类应用场景，测试输入也更脏。

NCB 的论点很明确——竞赛作业不是产品工程。用户不会按 docstring 格式提问，不会保证输入是干净的小整数，常常丢过来文件、嵌套结构和半句话。谁还在用 HumanEval 宣布“实用代码能力”，这篇就是给那句话准备的反例。

开发集公开、测试集打包进镜像，是故意让你不容易把考题洗进训练。封闭测试集换来抗泄漏，也换来“信官方镜像”的复现政治。两条都要写进阅读说明。`,
    architecture: `自然题干生成代码，Docker 里跑比较复杂的测试。指标常用 pass@1。开发集可以本地迭代，测试集不公开明文，评测走官方镜像。这和 HumanEval 那种 json 丢进仓库完全不同。

测试输入更脏：文件、复合结构、多步骤输出。过没过不是三五行 assert 能打发的。环境必须对齐，否则你不是在复现 NCB，是在跑另一套题。

中英提示和领域分布会影响对照。Python / Java 要分开报，六类场景也最好拆开。只丢一个总分，又会回到“平均分抹平故事”的老路。`,
    content: `六类：人工智能、数据科学、算法、前端、软件工程、系统管理。题比 MBPP 更长、更工程，原论文里 GPT-4 大约也只有五成左右。这个数字的意义是：不是模型太差，是尺子终于不像练习册了。

402 道，Python 与 Java。题干来自真实用户提问的精选，不是竞赛站，也不是手写 docstring。你会看到不完整的需求、领域术语、对库和脚本的期待。

它仍是题级合成，不是把一个服务部署起来。全栈、前端、系统管理都是题面里的全栈，不是给你一台机器让你从装系统开始。后面 FullStack Bench 和 WebDev Arena 会分别用沙箱和人类偏好接着讲这件事。`,
    format: "自然提示代码生成 + 沙箱测试",
    metrics: ["pass@1"],
    size: "402 题（Python + Java）",
    lineage: {
      parents: ["humaneval", "mbpp"],
      children: [],
      related: ["ds-1000", "fullstackbench", "bigcodebench"],
    },
    caveats: `测试集不公开，复现依赖官方镜像。民间重写测试或用开发集冒充测试，都不是 NCB。封闭带来抗泄漏，也带来无法独立审计的盲区。引用时要接受这个交换。

中英提示与领域分布会影响对照。某一类场景被刷高，总分就会跟着飘。Python 和 Java 也不要揉成一个“代码分”。

它揭示错位，不自动成为新的唯一标尺。402 道仍偏题级，用户提问经过精选，不是生产日志全量。HumanEval 高分不可信，不等于 NCB 高分就等于能上岗。`,
    links: [
      { rel: "paper", label: "NaturalCodeBench 论文", href: "https://arxiv.org/abs/2405.04520" },
      { rel: "repo", label: "GitHub", href: "https://github.com/THUDM/NaturalCodeBench" },
    ],
  },
  {
    slug: "bigcodebench",
    name: "BigCodeBench",
    shortName: "BigCodeBench",
    accession: "OB-2024-C17",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["工具库调用", "函数合成"],
    org: "BigCode",
    authors: "Zhuo et al.",
    summary:
      "一千余道要调用多样 Python 库的函数题，用来接 HumanEval 饱和之后的班。Complete 给签名，Instruct 只给人话，两种协议不可混报。它仍是函数级，不是仓库级，沙箱权限和库版本必须对齐官方。",
    origin: `BigCode 社区认为 HumanEval 太玩具，DS-1000 又偏数据科学。开源码模型卡上那栏 HumanEval 已经不能把模型分开，需要一道还在函数级、但必须真的调用工具库的题。BigCodeBench 构造需要组合多个库才能完成的任务，强调工具使用和指令遵循。

它迅速成为开源码模型卡上 HumanEval 的替代栏。原因很现实：题量比 HumanEval 大一个数量级，又不必上 SWE-bench 那种昂贵仓库环境。函数级评测在 2024 年还没死，只是作业题死了。

Complete 和 Instruct 两种协议，是对“补全模型 vs 对话模型”并存现实的承认。只报好写的那一种，等于回到薄测试时代的报喜不报忧。`,
    architecture: `Complete：给定函数签名和文档，补全实现。Instruct：只给自然语言指令，模型自己决定签名、导入和结构。后者更难。沙箱执行，指标 pass@k。官方维护排行榜，跑法应对齐官方镜像和权限。

两种协议不可混报。Instruct 把“听懂要干什么”和“调用对库”绑在一起；Complete 更接近传统函数合成。用 Instruct 的低分攻击只报 Complete 的模型，或反过来，都是协议战。

评测依赖多库沙箱。缺一个包、版本不对、权限过紧或过松，都会改分。它比 HumanEval 重，比 SWE-bench 轻。复现成本在中间档，这也是它能当常规栏的原因。`,
    content: `约 1,140 题，覆盖计算、网络、系统、数据处理等日常库组合，而不是纯算法。你会看到标准库和常见第三方包被拼在一道函数里，而不是 NumPy 单打独斗。

题仍是自包含函数。没有长期运行的服务，没有跨文件的包结构，没有 issue。难在 API 组合和指令遵循，不在仓库导航。这是它跟 DS-1000 的亲戚关系，也是它跟 SWE-bench 的分界。

领域广，但不等于全栈产品。网络题不是让你上线一个网站，系统题不是让你管一台机器。读题时把“用库”和“做运维”分开，分数才读得懂。`,
    format: "函数生成 + 多库沙箱",
    metrics: ["pass@k"],
    size: "约 1,140 题",
    lineage: {
      parents: ["humaneval", "ds-1000"],
      children: [],
      related: ["bigcode-eval-harness", "livecodebench", "fullstackbench"],
    },
    caveats: `仍是函数级，不是仓库级。BigCodeBench 第一不能翻译成 SWE-bench 第一。工具库调用会了，不代表会修 issue、会装历史依赖、会写跨文件补丁。

沙箱权限与库版本必须对齐官方。放宽权限可能让本该失败的代码“碰巧能跑”，收太紧又会误杀。Complete / Instruct 不可混报，n 和 k、是否聊天包装也要写清。

HumanEval 的污染病在函数级题上都会复发，只是这 1140 道还没那么烂熟。官方榜会动，引用要写版本。饱和之后，它也会变成新的卫生检查。`,
    links: [
      { rel: "paper", label: "BigCodeBench 论文", href: "https://arxiv.org/abs/2406.15877" },
      { rel: "homepage", label: "bigcode-bench.github.io", href: "https://bigcode-bench.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/bigcode-project/bigcodebench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/bigcode/bigcodebench" },
    ],
  },
  {
    slug: "scicode",
    name: "SciCode",
    shortName: "SciCode",
    accession: "OB-2024-C18",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["科学计算", "研究级代码"],
    org: "UIUC / CMU / Argonne 等",
    authors: "Tian, Gao et al.",
    summary:
      "科学家出的研究级编程题，主问题拆成子问题再合成可运行的科学代码。即便 2024 年的强模型，在最真实设置下也常常只能做对个位数百分比。背景知识给不给、数值容差怎么设，会把分数彻底改写。",
    origin: `实验室日常不是写 FizzBuzz，而是把物理、化学、材料里的概念变成数值模拟。HumanEval 和竞赛集都测不到这件事：你要先懂问题，再写成能跑、能对上数值的代码。SciCode 请一线科研人员出 80 道主问题，再拆成 338 个子问题，配金标与数值测试。

即便 2024 年的强模型，在最真实设置下也只能做对个位数百分比。这个个位数和 SWE-bench 原论文的个位数是亲戚：尺子终于够难，模型的宣传口径突然没地方躲。科学代码这条线也因此没有被作业题的饱和带走。

它跟 DS-1000 都碰科学计算，但 DS-1000 是库 API 的 StackOverflow 题，SciCode 是研究问题本身。一个问会不会用 Pandas，一个问会不会把一个科学概念变成程序。`,
    architecture: `按子问题实现函数，再组装成主问题。可以提供科学背景说明，也可以不给，逼模型自己补知识。主指标是主问题完全通过数值测试的比例；子问题通过率是过程分，不能替代主问题。

数值测试对容差敏感。科学计算很少要求比特级一致，容差松了谁都能过，紧了金标都可能抖。官方设定必须跟着走，自己调容差等于改题。

工作流接近科学家自己的脚本：概念、公式、可运行代码。评测仍在受控环境里跑，不是真的去提交作业到超算。主问题失败、子问题很高，说明模型会局部实现，不会把研究问题做完。`,
    content: `物理、数学、材料、生物、化学等约 16 个子领域。80 道主问题、338 个子问题。每道主问题是一个小研究任务，子问题是被切开的实现步骤。金标和数值测试由出题的科学家侧提供。

规模小是实话。八十道主问题，方差天然大，领域一偏，总分就会被几道题左右。它用深度换广度：宁可变少，也要是真的科研人员会写的那种脚本。

内容不是竞赛算法，也不是软件工程 issue。你要处理的是 discretize、数值积分、物理量纲一类事情。不会这门科学，代码能力只能把你送到子问题的半山腰。`,
    format: "多步科学代码生成 + 数值测试",
    metrics: ["Main problem pass", "Subproblem pass"],
    size: "80 主问题 / 338 子问题",
    lineage: {
      parents: ["humaneval"],
      children: [],
      related: ["ds-1000", "gpqa", "scibench", "lab-bench"],
    },
    caveats: `规模小，方差大。八十道主问题不够支撑细到小数点后两位的模型对比。几道题的运气就能改写名次。适合当压力测试，不适合当唯一排行榜。

是否提供背景知识会彻底改变分数。给了教材式说明，任务更像实现；不给，任务更像开卷考试加编程。两种设置必须分开报，合并就是在玩协议。

数值测试对容差敏感，实现路径也可以不同。过严会误杀科学上可接受的近似，过松会放过错模型。不要用 SciCode 个位数去类比 SWE-bench 个位数之外的东西——难是真的，难法不一样。`,
    links: [
      { rel: "paper", label: "SciCode 论文", href: "https://arxiv.org/abs/2407.13168" },
      { rel: "homepage", label: "scicode-bench.github.io", href: "https://scicode-bench.github.io" },
      { rel: "repo", label: "GitHub", href: "https://github.com/scicode-bench/SciCode" },
    ],
  },
  {
    slug: "swe-bench-lite",
    name: "SWE-bench Lite",
    shortName: "SWE-bench Lite",
    accession: "OB-2024-C19",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["仓库级修 bug", "子集"],
    org: "Princeton NLP",
    authors: "Jimenez, Yang et al.",
    summary:
      "SWE-bench 的 300 题精简切片，用来降低评测成本和过滤过难、过脏的实例。它不是随机子集，不能外推到全量 2294 条。Verified 出现之前，Lite 是开源 agent 论文最常见的对照栏，分数会系统性高于原集。",
    origin: `完整 SWE-bench 又贵又噪。两千多道仓库任务，环境脆、描述不清、有的明显过难，开源实验室跑一轮就要掉层皮。作者放出 Lite：去掉描述不足、测试过宽或明显过难的题，留下 300 条更适合做方法开发的样本。

在 Verified 出现之前，Lite 是开源 agent 论文最常见的对照栏。大家不是不知道它更易，是负担不起全量。于是出现了一种集体默契：方法论文报 Lite，系统宣传报自己最好看的切片。读这些数字，先看切片名字。

它没有改 SWE-bench 的哲学，只是把考卷变短、变干净一点。FAIL_TO_PASS / PASS_TO_PASS 还在，脚手架主导分数也还在。Lite 解决的是成本和噪声，不是污染，也不是“12 个 Python 仓”的多样性问题。`,
    architecture: `协议与 SWE-bench 相同：issue 加仓库，输出补丁，跑 FAIL_TO_PASS 和 PASS_TO_PASS，全过才算 resolved。变的是实例列表。因为它更易，分数会系统性高于全量集。Lite 上的 40% 不是原集上的 40%。

评测成本下降是产品。300 条让小团队能迭代 agent，而不必每次烧全量 Docker。代价是选择偏差：被丢掉的题不是随机噪声，常常是更难、更脏、更接近真实地狱的那些。

脚手架、工具预算、n 次尝试，仍然主导数字。Lite 不是“纯模型版 SWE-bench”。在 Lite 上换一个 agent 框架，名次照样能翻。报分格式应与全量、Verified 看齐：模型、scaffold、预算、切片名字。`,
    content: `同一批 12 个 Python 仓库里筛选出的 300 个 issue。覆盖面变窄，单题质量更高。Django 一类仓仍然会占到显眼的比例，因为它本来就是原集的大户。

被过滤掉的，包括描述不足、测试不靠谱、环境过于脆弱或明显不适合当开发集的实例。剩下的更适合调试你的 agent，不适合声称“我们解决了软件工程”。

内容类型没变：真实缺陷和功能请求，补丁跨文件，测试是项目自带的。只是卷子短了。短卷子上的满分，换到长卷子上经常会掉。`,
    format: "issue → patch",
    metrics: ["Resolved rate"],
    size: "300 条",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-verified"],
    },
    caveats: `不是随机子集，不能外推到全量。Lite 上的提升，可能只是你在干净题上更会考试。用 Lite 推全量 resolve rate，是统计错误，不是近似。

SOTA 声明现在更应看 Verified 或更难的 Pro。还在只用 Lite 发新闻稿，要说明为什么避开人工核验过的 500 条。Lite 仍适合开发迭代，不适合当最终排位。

脚手架主导、仓重复、预训练重叠，原集的病它都继承。便宜不是中立。谁靠 Lite 刷出漂亮曲线，谁就有义务在更硬的切片上重复一次。`,
    links: [
      { rel: "homepage", label: "SWE-bench Lite", href: "https://www.swebench.com" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/SWE-bench/SWE-bench_Lite" },
      { rel: "repo", label: "GitHub", href: "https://github.com/SWE-bench/SWE-bench" },
    ],
  },
  {
    slug: "swe-bench-verified",
    name: "SWE-bench Verified",
    shortName: "SWE-bench Verified",
    accession: "OB-2024-C20",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["仓库级修 bug", "人工核验"],
    org: "OpenAI / Princeton",
    authors: "OpenAI",
    summary:
      "人工核验过的 500 道 SWE-bench 题，去掉描述不清和测试有问题的实例。它迅速成为工业界默认对照，但仓库多样性没变，脚手架、工具次数和测试时计算仍然主导分数。更干净不等于更代表软件工程的全部。",
    origin: `OpenAI 请软件工程师逐条审查 SWE-bench，剔除 issue 写不清、测试测不到修复、或环境注定失败的题，留下 500 条。动机很直白：原集低估了 agent，因为有些题根本不是在考修复能力，是在考你能不能读懂一道写砸的 issue，或在脆环境里求生。

Verified 迅速成为工业界默认的 SWE 对照。同一 scaffold 下比较模型，而不是和有缺陷的原集纠缠。GPT-4o 配当时较好的开源脚手架，在 Verified 上曾报到大约三分之一，明显高于原集。数字变好看，部分是因为卷子更公平，不只是模型变强。

它测的是“可解的仓库任务”，官方自己也强调这一点。不是 2294 条的随机样本，不能倒推原集。Pro 后来觉得 Verified 也开始变容易，才把战场换到更新、更大、更企业的仓。尺子被追上，是 SWE 这条线的常态。`,
    architecture: `执行协议与 SWE-bench 相同。输入 issue 和仓库，输出补丁，FAIL_TO_PASS 必须全绿，PASS_TO_PASS 不许变红，主指标 resolve rate。Docker 环境是评测的一部分，不是附属品。

官方和后续工作都把 Verified 当“可解集”。报分仍要声明 scaffold、工具预算、是否多次尝试。工业界常在同一迷你 agent 环境里比模型，图的是把脚手架锁住；研究论文则继续用各自的 agent 刷高。两种表不要并成一行。

它不是原集的随机抽样，也不是 Lite 的加长版。筛选标准是人类核验：描述是否足够、测试是否真的在测修复、环境是否允许成功。被丢掉的题对研究仍有价值，只是不该再当默认 SOTA 栏。`,
    content: `500 个经人类标注员确认可解的 GitHub issue。仍全部来自那 12 个 Python 仓库：Django、SymPy、scikit-learn、Sphinx、matplotlib、pytest 等。仓没有变，变的是题更干净。

核验去掉了写不清和测试有问题的实例，于是“resolved”更接近“真的修了对的东西”。但这 500 条仍然是 issue 修补丁，不是产品经理任务，不是前端偏好，不是终端里从零装环境。

难度标签后来被用来解释为什么有的题永远解不开。即便如此，头部 agent 把 Verified 抬高之后，区分度就往 Pro、Lancer、Terminal-Bench 挪。干净的 500 条也会饱和，只是比 HumanEval 晚几年。`,
    format: "issue → patch",
    metrics: ["Resolved rate"],
    size: "500 条",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-lite", "swe-gym", "swe-bench-pro"],
    },
    caveats: `仓库多样性没变，只是题更干净。12 个 Python 仓被训穿的风险还在。Verified 第一不等于企业仓第一，Pro 和 Lancer 就是冲着这句话来的。

scaffold、工具次数与测试时计算仍然主导分数。把 Verified 当纯模型智商表，会把 OpenHands 和迷你 shell agent 的差距算到模型头上。对比必须锁脚手架，或者老实承认自己在比系统。

污染时钟对这 12 个仓同样适用。issue 文本、相关 PR、测试代码都可能进过语料。更干净的测试减少了假阳性，不减少记忆。SOTA 要以当时的 scaffold 和日期一起读，孤立的百分比会过期。`,
    links: [
      { rel: "homepage", label: "OpenAI 介绍", href: "https://openai.com/index/introducing-swe-bench-verified/" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/SWE-bench/SWE-bench_Verified" },
      { rel: "leaderboard", label: "SWE-bench 榜", href: "https://www.swebench.com" },
    ],
  },
  {
    slug: "codereval",
    name: "CoderEval",
    shortName: "CoderEval",
    accession: "OB-2024-C21",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["项目级生成", "依赖上下文"],
    org: "Peking University / Huawei",
    authors: "Yu, Shen, Ran et al.",
    summary:
      "从真实开源项目抽 230 加 230 个函数，按外部依赖六级分类，测非独立函数生成。ICSE 2024 的结论很干脆：独立函数上的分数，不能代表项目上下文里的分数。上下文给多少必须声明，否则你在测阅读理解还是在测盲写，说不清。",
    origin: `北大与华为认为 HumanEval 全是 standalone 函数，和工程现实相反。生产代码里的函数要调用第三方库、同类方法、文件里的帮手、项目另一头的类型。把这些全剥掉再评测，等于在真空里考试。CoderEval 从高星项目里选出已被原作者测试过的函数和方法，按依赖落点分成六级。

ICSE 2024 的结论很干脆：模型在独立函数上的分数，不能代表它在项目上下文里的分数。HumanEval 高、项目依赖一加重就掉，这种落差才是这套数据想写进文献的那句话。ClassEval 做类内依赖，CoderEval 把依赖半径拉到项目，SWE-bench 再拉到 issue。三条是台阶，不是互斥。

预印本更早，会议版在 2024。引用时别把它当成 2024 年才出现的新题，协议和结论在前一年就已经在流通。`,
    architecture: `给定 docstring 与签名，可选项目上下文，生成函数体，在自包含平台上跑原项目测试。Python 与 Java 分开报。依赖六级从“无外部依赖”拉到“必须看见项目级类型和 API”，分级 pass@k 才有意义，一个总分会把最难那级稀释掉。

上下文给多少由协议决定。把金标依赖文件全塞进窗口，任务更像阅读加补全；只给签名，任务更像盲写。必须声明。执行依赖官方 Docker，原项目测试不是三五行 assert，环境要对齐。

它仍生成函数体，不是输出 git patch，也不读 issue。成功是这个函数在项目测试里表现对。和 SWE-bench 的 FAIL_TO_PASS 相比，这里没有“先失败的测试列表”这套 issue 协议，是项目级的函数合成。`,
    content: `43 个 Python 项目的 230 个函数，10 个 Java 项目的 230 个方法。依赖从“无”到“项目级类型与 API”逐级加重。函数不是作者手写的玩具，是项目里已经存在、并且被原作者测试过的实现。

你会看到第三方库调用、类成员、同文件帮手、跨文件类型。越往上级，当前文件越不够。这正是 HumanEval 故意删掉的那些东西。

项目选择有偏：高星、能跑通测试、能被切成函数级样本的仓。不是随机开源世界。Java 和 Python 两边题量对称，是为了不让“代码能力”再次变成 Python 单曲。`,
    format: "带项目上下文的函数生成",
    metrics: ["pass@k（分级）"],
    size: "230 Python + 230 Java",
    lineage: {
      parents: ["humaneval"],
      children: [],
      related: ["classeval", "swe-bench", "repobench"],
    },
    caveats: `上下文给多少由协议决定，必须声明。给全了，你在测窗口够不够长；不给，你在测模型会不会猜项目私有 API。两种分数差一截是预期，不是模型抽风。

执行依赖官方 Docker。原项目测试套件一变，对错定义就变。民间“我本地跑通了”不一定等于 CoderEval 协议。规模中等，项目选择有偏，别外推到所有语言和所有仓。

它不是仓库级修 bug。没有 issue，没有跨任务的长期状态。CoderEval 高、SWE-bench 低，很常见，说明函数级项目上下文和 issue 修补丁仍然是两门课。`,
    links: [
      { rel: "paper", label: "CoderEval 论文", href: "https://arxiv.org/abs/2302.00288" },
      { rel: "repo", label: "GitHub", href: "https://github.com/CoderEval/CoderEval" },
    ],
  },
  {
    slug: "aider-polyglot",
    name: "Aider Polyglot",
    shortName: "Aider Polyglot",
    accession: "OB-2024-C22",
    year: 2024,
    status: "live",
    kind: "leaderboard",
    family: "coding",
    domains: ["多语言编辑", "IDE agent"],
    org: "Aider AI",
    authors: "Paul Gauthier",
    summary:
      "Aider 用 225 道高难 Exercism 题做的多语言编辑榜，测的是改对文件而不是裸生成。它不是论文，是产品脚手架上的活榜：模型会不会按 Aider 的 diff 格式改代码，写进了指标本身。Exercism 仍是练习册，不是生产仓库。",
    origin: `Aider 是 Paul Gauthier 做的命令行编程 agent，一对多文件编辑，不是一篇评测论文。圈里常有人把它的榜当“又一个 HumanEval”，这是张冠李戴。原 Python Exercism 榜不够难、也不够多语言，2024 年底改成六种语言里较难的 225 题，称作 Polyglot。

它把“模型会不会按 Aider 的 diff 格式改代码”写进指标。测的是模型加编辑协议，而不只是算法能力。格式不遵从，补丁根本打不进去，后面的测试想过也过不了。这和学术基准故意把脚手架藏起来的习惯相反：Aider 公开承认脚手架就是考试的一部分。

活榜会随模型和产品更新滚动。没有固定的 camera-ready 数字。你今天截的第一名，是当时那一版 Aider、那种编辑格式、那一版题的第一名。当论文引用，要当产品文档引用，不要伪装成分期会议结果。`,
    architecture: `Agent 读题、改仓库、跑 Exercism 测试。主指标是正确完成百分比，另报编辑格式遵从率。不同模型用 whole 或 diff 等编辑格式，官方会注明。格式本身就是难度：有的模型会写代码，但不会按约定吐 diff。

这是端到端系统评测。模型、提示、编辑器循环、测试运行绑在一起。把 Aider Polyglot 分数抄到另一套 agent 上当对照，等于换了考场还用旧分数。n 次尝试、是否回滚、工具调用次数，产品侧会变，论文式复现要对齐当时的说明。

它不提供 FAIL_TO_PASS 那种 issue 协议，也不是 n@k 竞赛提交。成功就是 Exercism 测试绿了。练习册测试和仓库回归测试的严格程度不同，读分时要记得卷子来自哪里。`,
    content: `C++ 26、Go 39、Java 47、JavaScript 49、Python 34、Rust 30，共 225 题，选自 Exercism 里较难的练习。题是编程练习，有明确的测试和参考解风格，不是 GitHub 上那种脏 issue。

多语言是卖点。Python 单科高分在这里藏不住。但语言覆盖仍是练习册里的六门，不是生产里的构建系统和框架生态。Rust 题高不代表会写生产 crate，只代表会做这 30 道练习。

内容绑定 Aider 能改的那种代码库切片：小练习项目，测得动，跑得快。这是产品榜能每周更新的原因，也是它代表不了 SWE-bench 的原因。`,
    format: "多文件编辑 agent + 测试",
    metrics: ["Percent correct", "Correct edit format"],
    size: "225 题，6 语言",
    lineage: {
      parents: ["canitedit", "multiple"],
      children: [],
      related: ["livecodebench", "swe-bench", "lmarena"],
    },
    caveats: `它不是论文，没有相机就绪的固定测试集声明。分数绑定 Aider 脚手架与编辑格式。换一套 agent，同一模型可以换一张脸。引用必须写 Aider 版本和编辑模式，否则数字不可复现。

Exercism 题仍偏练习册，不是生产仓库。没有历史依赖地狱，没有三页 issue，没有跨十个文件的企业逻辑。Polyglot 第一名不要自动写成 SWE-bench 第一名。

榜会随模型更新滚动。活榜适合看今天谁更好用，不适合当两年后还在引用的静态 SOTA。截图要带日期。格式遵从率低时，先查是不是模型不会吐 diff，再查是不是不会写代码。`,
    links: [
      { rel: "leaderboard", label: "Aider leaderboards", href: "https://aider.chat/docs/leaderboards/" },
      { rel: "homepage", label: "Polyglot 介绍", href: "https://aider.chat/2024/12/21/polyglot.html" },
      { rel: "repo", label: "Aider GitHub", href: "https://github.com/Aider-AI/aider" },
    ],
  },
  {
    slug: "fullstackbench",
    name: "FullStack Bench",
    shortName: "FullStackBench",
    accession: "OB-2024-C23",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["全栈", "多语言", "应用开发"],
    org: "ByteDance Seed / M-A-P",
    authors: "Liu, Zhu et al.",
    summary:
      "三千余道覆盖十六种语言与十余类真实场景的全栈编程题，配 SandboxFusion。语言是原生出题，不是把 Python 作业翻译过去。它仍是题级合成，不是部署一个真实服务；“全栈”写在题面上，不等于给你一台生产机。",
    origin: `ByteDance Seed 和 M-A-P 认为 HumanEval 近八成是基础算法，不能代表全栈工作。模型卡上的 Python 作业高分，跟会不会写业务代码之间隔着一条河。他们请各领域工程师出题，中英各半，覆盖数据、工程、机器学习、前端等，并开源多语言沙箱 SandboxFusion。

目标是把“会写竞赛题”和“会写业务代码”拆开。MultiPL-E 用翻译打“只会 Python”；FullStack Bench 用原生题打“只会算法”。两条线都在攻击同一张过于好看的模型卡，手法不同。

沙箱开源是这套工作能被复现的关键。多语言执行如果各走各的 Docker 野路子，16 门语言的分数会立刻变成 16 种方言。SandboxFusion 想当公共运行时，类似 BigCode harness 在函数作业时代的角色。`,
    architecture: `自然语言指令生成代码，SandboxFusion 执行单测。16 种语言，不是从 Python 翻译过去。指标 pass@1，可按语言与领域拆开。总分漂亮但某一语言塌掉，才是这套数据真正想看的。

执行协议锁在官方沙箱。语言运行时、库、超时，都要对齐。换本地解释器跑，等于改题。中英题干不要混成一个数，提示语言本身就会改分。

它没有仓库级 issue 协议，也没有人类偏好投票。成功就是沙箱里测试绿。和 WebDev Arena 那种“看起来更好”不是一家，和 SWE-bench 那种补丁变绿也不是一家。全栈两个字很容易让这三家被揉成一列。`,
    content: `3,374 题，十六种语言，十余个应用域。每题含参考实现与测试，中英平衡。领域覆盖数据、工程、机器学习、前端等工程师会碰到的那种题，而不是竞赛站的图论套餐。

原生出题意味着 Go 题像 Go，前端题像前端，不是同一道 Python 作业换语法。这比 MultiPL-E 更接近“各语言生态”，但仍是题，不是项目。你不会在这里装一个单仓、开一个 PR、等 CI。

题有参考实现，测试是作者写的。测试风格随领域变，前端和系统题的“对”跟算法题的“对”不一样。分领域看，比看一个全栈总分有用。`,
    format: "多语言全栈合成 + 沙箱",
    metrics: ["pass@1"],
    size: "3,374 题，16 语言",
    lineage: {
      parents: ["humaneval", "bigcodebench"],
      children: [],
      related: ["multiple", "naturalcodebench", "webdev-arena"],
    },
    caveats: `“全栈”仍是题级合成，不是部署一个真实服务。不会有人拿着这 3374 道题的满分去上线一个能扛流量的系统。名字好听，评测单元还是题。

沙箱与语言运行时必须对齐官方镜像。16 门语言里只要有一门版本漂了，分差就会被解释成能力。中英混合、领域不均衡，都会让总分变成化妆。

不要和 MultiPL-E、WebDev Arena、SWE-bench 互换。翻译函数作业、人类投前端票、仓库修 bug，三件不同的事。FullStack Bench 只负责其中“多语言业务题合成”这一件。`,
    links: [
      { rel: "paper", label: "FullStack Bench 论文", href: "https://arxiv.org/abs/2412.00535" },
      { rel: "repo", label: "GitHub", href: "https://github.com/bytedance/FullStackBench" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/ByteDance/FullStackBench" },
    ],
  },
  {
    slug: "webdev-arena",
    name: "WebDev Arena",
    shortName: "WebDev Arena",
    accession: "OB-2024-C24",
    year: 2024,
    status: "live",
    kind: "leaderboard",
    family: "coding",
    domains: ["前端", "人类偏好", "实时对战"],
    org: "LMArena",
    authors: "Vichare, Angelopoulos, Chiang et al.",
    summary:
      "LMArena 的 Web 应用对战榜：两个模型现场写前端，人类投票。测的是看起来更好、更好用，不是单元测试意义上的正确。提示分布随社区漂移，后续 Code Arena 和 WebDev Legacy 不要混读。",
    origin: `Chatbot Arena 测的是对话偏好，写不出“这个页面能不能用”。一段能聊的模型，可能写出一个按钮点了没反应的网页。LMArena 在 2024 年底上线 WebDev Arena，用户出提示，两个模型生成 React / TypeScript / Tailwind 应用，社区看效果再投票。

它把代码评测从单测改成视觉与交互上的人类偏好。没有隐藏测试来宣布对错，只有人说更想用哪一个。这是故意的：前端很多“对”是品味、完整度和第一眼，不是 assertEqual。后来演进到更广的 Code Arena，旧的 WebDev 成绩要当 Legacy 读，不要和新年的代码对战混成一张表。

这不是论文式静态集。它是 Arena 家族在代码上的分身，血统来自聊天对战，不是来自 HumanEval。用 Elo 去对 pass@k，单位都对不上。`,
    architecture: `成对盲测，Bradley–Terry / Elo 一类 Arena Score。两个匿名模型当场生成可交互 Web 应用，人看、点、再投票。任务不是静态仓库，也不是函数补全。榜随投票滚动，历史分会动，这是 Arena 的老规矩。

没有单元测试当金标。评测信号是偏好：观感、完整度、交互是否跟得上提示。一个测试全过但难看的页面，可能输给一个漂亮却有小 bug 的页面。这不是评测事故，是这把尺子的定义。

提示来自用户，分布会漂。今天流行做仪表盘，明天流行做小游戏，模型的名次会跟着社区口味走。不可本地用一份固定 json 复现。信榜，就要接受样本不静止。`,
    content: `用户提交的前端需求：游戏、仪表盘、克隆站、小工具。现场生成，现场比较。评的是观感、完整度与交互，而不是隐藏测试，也不是 TypeScript 编译有没有警告。

技术栈偏向 React / TypeScript / Tailwind 这类能在浏览器里立刻看见的组合。它不覆盖后端仓库、数据库迁移、CI。Web 开发四个字，在这里更接近“能看的前端应用”。

投票量是滚动的，原介绍写到数十万票量级的对战。票多让 Elo 稳定，也让早期模型和后期模型不在同一时间切片上。看榜要看时间，看的是哪一个 WebDev，而不是“代码 Arena”四个字。`,
    format: "成对人类偏好，现场生成 Web 应用",
    metrics: ["Arena Score / Elo", "胜率"],
    size: "滚动对战，数十万票量级",
    lineage: {
      parents: [],
      children: [],
      related: ["lmarena", "fullstackbench", "aider-polyglot"],
    },
    caveats: `测的是“看起来更好”，不是正确性证明。没有单测，就没有 pass@k，也没有 FAIL_TO_PASS。把 Arena Score 写成准确率，是把偏好当成了真理。一个好看的错误页面可以赢。

提示分布随社区漂移。用户是谁、爱出什么题、会不会被模型的视觉风格收买，都会进 Elo。风格和冗长在聊天 Arena 里有效应，前端 Arena 同样可能被“更花”的页面带走。

后续 Code Arena 与 WebDev Legacy 不要混读。活榜会改名、改题、改界面。引用要写清是哪一个产品、哪一段日期。不可本地复现的榜，不能当唯一的代码能力证据。`,
    links: [
      { rel: "homepage", label: "WebDev Arena", href: "https://web.lmarena.ai" },
      { rel: "paper", label: "介绍博文", href: "https://lmarena.github.io/blog/2025/webdev-arena/" },
      { rel: "leaderboard", label: "LMArena", href: "https://lmarena.ai" },
    ],
  },
  {
    slug: "swe-gym",
    name: "SWE-Gym",
    shortName: "SWE-Gym",
    accession: "OB-2024-C25",
    year: 2024,
    status: "active",
    kind: "suite",
    family: "coding",
    domains: ["训练环境", "仓库级 agent"],
    org: "UC Berkeley / UIUC / CMU / Apple",
    authors: "Pan, Wang et al.",
    summary:
      "面向训练而非只评测的 SWE 环境：两千余个可执行 Python 仓库任务。这是训练集，不是新的公开考卷。用它练完再报 SWE-bench，要小心同源仓库泄漏，也要承认下游跃迁有一部分来自这里，不只是模型变聪明。",
    origin: `SWE-bench 测试集不能拿来刷轨迹。把考卷当练习册，是代码 agent 最难看的一种作弊。SWE-Gym 另选 11 个流行 Python 仓，做成 2,438 个带运行时与单测的训练实例，用来微调 OpenHands 一类 agent 和 verifier。评测缺的那块训练侧，被补上了。

开源权重 agent 在 Verified 上的跃迁，有相当一部分来自这类可执行轨迹，而不是突然顿悟。圈里如果只报下游 SWE-bench、不报自己在 Gym 上吃了多少题，那是在把训练数据当天赋。

它跟 SWE-bench 是亲戚，不是同一张卷。仓是另选的，用途是采样、SFT、RL、训练 verifier。谁把 Gym 当新榜刷，谁就搞反了标签：suite 的意思是环境，kind 已经写了。`,
    architecture: `每个实例是可安装的仓库、自然语言任务和测试。环境可执行，不是静态 diff 对。你要能装、能跑、能从失败里采样，这才叫训练环境。下游成绩通常报到 SWE-bench Verified 或 Lite，而不是在 Gym 自己的测试集上宣布 SOTA。

用法包括采样轨迹、监督微调、强化学习和训练 verifier。脚手架仍然重要：在哪个 agent 里采的轨迹，就带着哪个 agent 的行为先验。换一个推理时框架，Gym 上训出来的策略可能贬值。

协议上要隔离训练仓和评测仓。即便另选了 11 个仓，流行 Python 项目之间仍可能有重叠的依赖、模式和作者。泄漏不一定是同一条 issue，也可能是同一家的代码风格被背熟。`,
    content: `2,438 个真实 Python 任务，覆盖 issue 风格的修复与实现。11 个仓库，带运行时。内容看起来像 SWE-bench，职责却是练习场：让 agent 有地方摔跤，而不去污染那 500 条 Verified。

任务是可执行的。静态“这个 diff 对不对”不够，必须能安装、能跑测试、能给奖励信号。这也是它比单纯的补丁对更贵的原因。

它不提供新的公开排行榜叙事。你在 Gym 上的解决率，对读者几乎没有独立意义，除非你同时报清楚下游评测和有没有重叠。内容是燃料，不是奖杯。`,
    format: "可执行训练环境",
    metrics: ["下游 SWE-bench resolve rate"],
    size: "2,438 实例，11 仓库",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-verified", "terminal-bench"],
    },
    caveats: `这是训练集，不是新的公开考卷。在 Gym 上刷到 80% 再去宣传，是把练习成绩当高考。下游必须报 Verified 或更硬的切片，并交代训练是否碰过相关仓。

用它训练后再报 SWE-bench，要小心同源仓库泄漏。另选 11 个仓降低了直接背题的风险，没有降到零。流行 Python 生态就那么大，依赖和 API 模式会串味。

脚手架和采样策略会写进权重里。OpenHands 上采的轨迹，换到另一个 agent 上可能失灵。把 Gym 训练的跃迁全部算成基础模型的功劳，是常见的叙事偷换。`,
    links: [
      { rel: "paper", label: "SWE-Gym 论文", href: "https://arxiv.org/abs/2412.21139" },
      { rel: "repo", label: "GitHub", href: "https://github.com/SWE-Gym/SWE-Gym" },
    ],
  },
  {
    slug: "swe-lancer",
    name: "SWE-Lancer",
    shortName: "SWE-Lancer",
    accession: "OB-2025-C26",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["自由职业工程", "经济价值", "全栈"],
    org: "OpenAI",
    authors: "Miserendino, Wang, Patwardhan, Heidecke",
    summary:
      "一千余道真实 Upwork 任务，标了合计一百万美元的报酬，把修 bug 映射到美元。经济数字是历史标价，不是劳动力市场预测。任务集中在单一产品生态，经理题测的是选择不是实现。",
    origin: `OpenAI Preparedness 想回答一个很刺激的问题：前沿模型能不能靠接外包赚钱。他们把与 Expensify 相关的真实 Upwork 任务收成 SWE-Lancer：一边是独立工程师写补丁，一边是经理在方案里做选择。金额从几十美元的小修复到数万美元的功能，合计标到 100 万美元。

公开切片叫 Diamond。美元是叙事装置，不是汇率预言。历史标价告诉你人类当时愿意为这张工单付多少钱，不告诉你模型明天能在 Upwork 上提现多少。把“赚到 20 万美元”写成经济影响评估，是把基准当劳资报告。

它把 SWE 从 12 个 Python 库拉到真实全栈产品。Playwright 端到端测试代替了纯单元测试，经理题又把“会写代码”和“会选方案”劈开。SWE-bench 家族从此不再只有一种仓库故事。`,
    architecture: `两套任务。IC SWE：独立贡献者交补丁，用端到端 Playwright 测试判定，浏览器里走通才算修上。SWE Manager：在方案里做选择，对照原工程经理的决定，测的是判断不是实现。主指标是解决率和按标价加总的“赚到的美元”。

提供统一 Docker。全栈产品的环境比 Django 单测重，端到端测试更脆、更慢。超时、前端时序、外部依赖，都会变成分数。复现必须走官方环境，不要自己用单元测试冒充 Playwright。

美元收益是标价加权的解决率，不是收入预测。高标价题权重大，模型专攻贵题就能在美元栏好看。解决率和美元栏要一起看，否则会被几道贵题绑架。`,
    content: `1,488 题：764 道 IC SWE，标价大约 41.5 万美元；724 道经理题，大约 58.5 万美元。仓库是真实全栈产品，不是 SWE-bench 那 12 个 Python 库。你会碰到前端、后端、工单产品逻辑，而不是再给 SymPy 修一个符号积分。

任务来自真实自由职业工单，需求、范围、验收方式更像外包，而不像库维护者的回归测试。IC 题要改能跑的产品；经理题给的是方案，不要求写出补丁。

公开 Diamond 切片用于可引用的对照。全量与公开之间不要偷偷换。单一产品生态意味着领域深、覆盖窄：很会修这个产品，不代表很会接所有外包。`,
    format: "自由职业任务 + 端到端测试 / 方案选择",
    metrics: ["Resolve rate", "美元收益"],
    size: "1,488 题，合计 $1M",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-pro", "the-agent-company", "webdev-arena"],
    },
    caveats: `经济数字是历史标价，不是劳动力市场预测。100 万美元是工单标价加总，不是模型创造的 GDP。把美元栏写进安全或经济影响章节，要非常克制，否则就是标题党。

任务集中在单一产品生态。全栈很真，多样性很假。换一个产品，Playwright 流程、领域知识和代码组织都会变。Lancer 高分不要写成“已经能替代自由职业工程师”。

Manager 题测的是选择不是实现。IC 和 Manager 必须拆开报。用经理题的正确选择给补丁失败擦粉，是把两种能力混账。端到端测试也更脆，环境一漂，绿会变红。`,
    links: [
      { rel: "paper", label: "SWE-Lancer 论文", href: "https://arxiv.org/abs/2502.12115" },
      { rel: "homepage", label: "OpenAI 介绍", href: "https://openai.com/index/swe-lancer/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/openai/SWELancer-Benchmark" },
    ],
  },
  {
    slug: "terminal-bench",
    name: "Terminal-Bench",
    shortName: "Terminal-Bench",
    accession: "OB-2025-C27",
    year: 2025,
    status: "live",
    kind: "benchmark",
    family: "coding",
    domains: ["终端 agent", "系统任务", "持续更新"],
    org: "Laude Institute / Stanford / Harbor",
    authors: "The Terminal-Bench Team",
    summary:
      "在真实命令行沙箱里做编译、部署、训练与排障，把环境本身当成题目。分数绑定 agent 脚手架和版本号：1.0、2.0、3.0 不是同一张卷，Harbor 和 Terminus 也写进协议里。跨版本比 SOTA，等于把不同难度的活榜捏成一条曲线。",
    origin: `SWE-bench 仍是“对着一个 Git 仓库打补丁”。真实工程还有一大半发生在终端里：装依赖、修构建、跑实验、配服务、跟反爬和工具链打架。Laude Institute、斯坦福和后来的 Harbor 把评测单元改成一整段终端工作，环境本身就是题目。

2025 年 5 月 1.0 上线后迅速出现在前沿模型卡上。社区很快发现任务质量和外部依赖稳定性参差，例如依赖 YouTube 一类外部站点的题，今天能过明天过不了。2.0 用更严的人工和模型辅助审查收成约 89 道硬题，并和 Harbor 评测框架一起发布；3.0 继续加难、换题，避免 2.0 被做到失去区分度。

它不是 SWE-bench 的终端皮肤。补丁变绿只是其中一种任务，更多时候你要在容器里把一条工作流熬通。谁还用 SWE-bench Verified 单独宣布 agent 能力，Terminal-Bench 就是那张没被问到的考卷。`,
    architecture: `Docker 终端沙箱、任务说明、自动校验器。Agent 可以任意使用 shell，不限于 git patch。主指标是任务解决率。2.0 起任务按 Harbor 格式分发，官方示例包括 Terminus、Codex CLI、Claude Code、OpenHands 等脚手架。分数首先是系统分。

版本打标签发布，跨版本不能直接比。1.0 任务更多更杂，2.0 更硬更干净（约 89 道经审查的硬题），2.1 修了二十八道题，3.0 再换一套更难的题，4.0 在 2026 年 8 月校准资源、修题、拿掉已经饱和的题。Harbor 的数据集标识把版本写进名字里，引用时必须抄下来。校验看最终环境状态，不看你的命令漂不漂亮。

预算、并发、是否允许联网、超时，全是协议。外部世界一变，依赖外网的题就会漂——这也是 2.0 加强审查的原因。活榜不是静态考卷，commit、数据集标签和 agent 名字要一起写。`,
    content: `从编译项目、配置服务器到数据与训练脚本，任务刻意做成“人类工程师会在终端里熬的那种”。不是一道算法题，是一段工作。2.0 公开硬题约 89 道，从更多候选里筛出来；之后 3.0 继续滚动，题量和类别会变。

覆盖面包括软件工程、科学计算、系统配置、调试一类终端劳动。每题有独立环境、人工写的参考解和测试。参考解能过，不表示任意路径都能过；校验器认的是结果状态。

它不提供 SWE-bench 那种 FAIL_TO_PASS 列表，也不提供 Arena 那种人类投票。内容是容器里的工作单。你会看到构建失败、依赖缺失、脚本要改、服务要拉起。读起来像值班，不像刷题。`,
    format: "终端沙箱 agent 任务",
    metrics: ["Resolution rate"],
    size: "滚动；2.0 约 89 道硬题，其后 2.1 / 3.0 / 4.0 继续换题",
    lineage: {
      parents: [],
      children: ["long-horizon-terminal-bench"],
      related: [
        "swe-bench",
        "osworld",
        "the-agent-company",
        "swe-gym",
        "tua-bench",
        "harbor",
        "laude-institute",
      ],
    },
    caveats: `分数绑定 agent 脚手架和版本号。Terminus、Codex CLI、Claude Code、OpenHands 不是同一场考试。2.0 的 50% 和 1.0 的 50% 更不是同一句话。模型卡上只写 Terminal-Bench 不写版本，这个栏可以当装饰。

任务在变，活榜不是静态考卷。外部依赖、审查标准、难度配比都会动。1.0 里不稳的题被拿掉，是质量修复，也会让历史曲线不可比。SOTA 必须带日期和数据集标签。

它测终端劳动，不自动覆盖仓库 issue、前端偏好或竞赛算法。Terminal-Bench 很高、SWE-bench 很低仍然可能。把终端解决率写成通用 agent 智商，是新瓶子装旧夸法。`,
    links: [
      { rel: "homepage", label: "tbench.ai", href: "https://www.tbench.ai" },
      { rel: "repo", label: "GitHub", href: "https://github.com/laude-institute/terminal-bench" },
      { rel: "paper", label: "Terminal-Bench 2.0 论文", href: "https://arxiv.org/abs/2601.11868" },
    ],
  },
  {
    slug: "swe-bench-pro",
    name: "SWE-bench Pro",
    shortName: "SWE-bench Pro",
    accession: "OB-2025-C28",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["企业级 SWE", "长程任务"],
    org: "Scale AI",
    authors: "Deng, Da et al.",
    summary:
      "面向企业仓的长程 SWE 题，补丁更大、仓库更新，用来接 Verified 开始变容易之后的班。公开、留出、商业私有三分，私有集只能信官方榜。务必声明用的是哪一份，以及脚手架是谁，否则 pass@1 只是气氛组。",
    origin: `SWE-bench Verified 在 2025 年被强 agent 快速抬高。500 道干净题一旦被做到百分之七十以上，它就从压力测试变成卫生检查。Scale AI 从 41 个仍在维护的商业与工具仓库收集 1,865 道人类核验任务，强调需要数小时到数天的专业工作量，而不是再给 Django 修一个中等 issue。

公开集、留出集与商业私有集分开，避免再走“12 个 Python 仓被训穿”的老路。公开集可以本地讨论，留出集防刷，商业集看企业仓到底有多脏。论文里即便用较强脚手架，公开集上的解决率也曾只有百分之二十出头量级，远低于同期 Verified 的高分。

它是 SWE-bench 家族的加难题，不是新的哲学。issue 到补丁到测试，这套语法没变。变的是仓更新、补丁更大、工作量按专业工程师的小时计。Verified 被追上之后，尺子只能往企业里走。`,
    architecture: `协议沿用 SWE-bench：issue 加仓库，输出 patch，跑测试。主指标 pass@1 / resolve rate，这里的 pass@1 就是一次尝试的解决率，不是 HumanEval 那种采样估计。n 次尝试取最好，要另说，那是 n@k 思路，不能偷换成 pass@1。

公开集来自 11 个仓；另有 12 个留出仓和 18 个合作商业仓。三份题不能混报。私有集不可复现，只能信官方榜。scaffold 必须声明：论文常用 SWE-agent 一类框架，工业提交可能用完全不同的系统。锁脚手架比锁模型更决定名次。

评测贵、环境重、补丁长。复现公开集已经不像 Lite 那样随便跑。商业集的数字没有你自己的 Docker 可以对，引用时要把“官方榜”四个字写进去。`,
    content: `业务应用、B2B 服务、开发者工具。改动跨多文件，补丁远大于 Verified 的典型样本。工作量按小时到天计，不是一两个函数的局部修补。

1,865 题按公开 / 留出 / 商业三分。公开集可讨论、可被预训练慢慢污染；留出和商业集用来看你是不是只在背那 11 个公开仓。仓是仍在维护的商业与工具仓库，不是 2023 年那 12 个学术常客。

内容仍是 issue 修补丁，不是终端从零配环境，也不是前端 Arena。企业级三个字指仓库和工期，不指你要在这里完成一整份产品管理。测试是这些仓自己的验收，失败模式更接近真实工单。`,
    format: "企业仓 issue → patch",
    metrics: ["Pass@1", "Resolved rate"],
    size: "1,865 题（公开 / 留出 / 商业三分）",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-verified", "swe-lancer", "terminal-bench", "scale-ai"],
    },
    caveats: `私有集不可复现，只能信官方榜。商业仓数字没有独立审计，公开集和商业集的分差本身就是故事的一部分：企业仓更难，还是你没见过这些仓，两种解释都要留着。

公开集仍可能随时间泄漏。11 个仓一旦进语料，Pro 也会走上 Verified 的老路。务必声明用的是 public、held-out 还是 commercial，以及 scaffold 和尝试次数。不写这些，pass@1 只是气氛组。

不要用 Verified 高分否定 Pro 低分，那是两张不同难度的卷。也不要把 Pro 的企业级直接写成“已经能进大厂值班”。补丁更大、工期更长，仍然是基准设定，不是上岗证书。`,
    links: [
      { rel: "paper", label: "SWE-bench Pro 论文", href: "https://arxiv.org/abs/2509.16941" },
      { rel: "homepage", label: "Scale 介绍", href: "https://scale.com/research/swe_bench_pro" },
      { rel: "repo", label: "GitHub", href: "https://github.com/scaleapi/SWE-bench_Pro-os" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/ScaleAI/SWE-bench_Pro" },
      { rel: "leaderboard", label: "公开榜", href: "https://scale.com/leaderboard/swe_bench_pro_public" },
    ],
  },
  {
    slug: "swe-bench-live",
    name: "SWE-bench-Live",
    shortName: "SWE-bench-Live",
    accession: "OB-2025-C29",
    year: 2025,
    status: "live",
    kind: "benchmark",
    family: "coding",
    domains: ["滚动 SWE", "多语言", "抗污染"],
    org: "Microsoft / 上海 AI Lab 等",
    authors: "Zhang, He, Zhang et al.",
    summary:
      "微软把 SWE-bench 做成自动更新的活集：从 2024 年起的真实 GitHub issue 里流水线收题，每题一镜像。Lite 和 Verified 切片冻住方便对榜，最新题进 test。静态 12 仓被训穿之后，这一栏才是“会不会修新 issue”。",
    origin: `SWE-bench 原集 2023 年收完就不再长，12 个 Python 仓被来来回回训。微软亚洲研究院和上海 AI Lab 的人在 2025 年 5 月放出 SWE-bench Goes Live!（arXiv:2505.23419），NeurIPS 2025 Datasets & Benchmarks。核心不是又切一刀 Verified，是把收题、装环境、出镜像做成自动流水线，让评测跟着 GitHub 往前走。

第一版 1,319 题，93 个仓，issue 时间窗从 2024 年 1 月到 2025 年 4 月。论文里同一套脚手架，静态 SWE-bench 能到 43%，Live 掉到大约 19%——这组对照就是它存在的理由。补丁也更大：中位 2 个文件 24 行，对照原集大约 1 个文件 12 行。

之后它真的活了。仓库新闻写明：每月往 test 里加 50 道新核验题；lite 和 verified 冻住，方便榜上的人少花钱。2026 年初并入多语言（C/C++、C#、Java、TS/JS、Go、Rust），再往后还有 Windows。Python-only 的 NeurIPS 论文版被收到 python-only 分支。引用不写 split 和语言，等于没写。`,
    architecture: `协议刻意跟原 SWE-bench 对齐：agent 只能看 problem_statement 和 Docker 镜像，不许看 hint、FAIL_TO_PASS、test_patch，更不许提前打测试补丁。输出补丁，跑测试，resolved 才算。主指标解决率。

每题独立镜像。这是自动流水线最值钱的产物，也是评测变贵的原因。多语言之后，构建策略改过：每个仓先对一个 commit 跑完整安装，其余 commit 从建成的镜像 checkout，省 API 和 Docker 费用。

Lite / Full / Verified 在榜上长期仍是 Python。C/C++、Java、Windows 是另几列。跨列平均没有意义。时间窗必须和模型训练截止日期对上，否则“抗污染”四个字是空的。

官方强调单次 rollout。n 次取最好要另说。`,
    content: `真实 issue，仓比原 12 个多一个数量级。初始 Python 93 仓，后来扩到两百多个。题从 2024 年起的新 issue 来，不是 Django 2019 年的旧疤。

lite 和 verified 是冻住的对照切片；想看最新，去 test / full。2026 年 8 月 MultiLang 已经涨过一千题，每个语言切片超过一百。Windows 列专门打“只会 Linux bash”的开源 agent。

内容仍是 issue 到补丁。不是终端从零配环境，也不是二十小时的研究工程。难在仓不熟、issue 新、补丁跨文件，以及非 Python 工具链。

自动收题会收进脏实例。冻住的 verified 切片就是承认这件事。只报 test 最新 50 题的第一名，统计功效很差。`,
    format: "滚动 issue → patch，Docker 执行",
    metrics: ["Resolved rate"],
    size: "滚动；论文初版 1,319 / 93 仓，其后按月加题并扩语言",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-verified", "swe-rebench", "swe-bench-pro", "swe-gym"],
    },
    caveats: `活集不能跨月硬比总分。题在变，仓在变，语言切片在变。SOTA 必须带日期和 split 名。

自动流水线不是人工 Verified。脏测试、过严过宽、描述不清，都会进来。论文自己也把这写成与静态集分差的来源之一。

多语言和 Windows 会把只在 Python Linux 上调过的 agent 打回原形。把 Python Verified 高分写进“通用软件工程”，Live 的其他列是打脸用的。`,
    links: [
      { rel: "paper", label: "SWE-bench Goes Live!", href: "https://arxiv.org/abs/2505.23419" },
      { rel: "homepage", label: "swe-bench-live.github.io", href: "https://swe-bench-live.github.io/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/microsoft/SWE-bench-Live" },
    ],
  },
  {
    slug: "swe-rebench",
    name: "SWE-rebench",
    shortName: "SWE-rebench",
    accession: "OB-2025-C30",
    year: 2025,
    status: "live",
    kind: "benchmark",
    family: "coding",
    domains: ["滚动 SWE", "大规模训练任务", "多语言"],
    org: "Nebius",
    authors: "Badertdinov, Golubev, Nekrashevich et al.",
    summary:
      "Nebius 的自动收题管道：两万一千余道可执行 Python SWE 任务用来训练，另切一份按月更新的去污染榜。2026 年 V2 把管道做成语言无关，评测任务三万二、二十种语言。Live 是微软的活评测，rebench 是同一件事的工业管道版。",
    origin: `手工收 SWE 题太慢，静态 Verified 又开始被怀疑背题。Nebius AI R&D 在 2025 年 5 月放出 SWE-rebench（arXiv:2505.20411，NeurIPS 2025）：从 GitHub Archive 和海量仓里自动挖 issue–PR，自动写安装，执行式验证，产出 21,336 道 Python 任务、3,400 多个仓。其中一份持续更新的干净切片拿来做榜，swe-rebench.com，专门跟 Verified 对照，看哪些模型的高分像污染。

它同时是训练集和评测集，这点要说清楚。21k 是 RL 和 SFT 的粮食；榜上那几百到一千道按月切的题，才是你该拿来报的数。Harbor Hub 后来把 leaderboard split 标成大约 860 道带镜像的 Python 题，按 YYYY_MM 往上加。

V2 是 2026 年 2 月的续集（arXiv:2602.23866，ICML 2026）。管道改成语言无关，交互式安装 agent 加 LLM 法官过滤，产出 32,079 道可执行任务、20 种语言、3,617 个仓，外加 12 万道带安装说明、但不全部容器化的 PR 任务。诊断集上 Python 能到三十多分，Go / Rust / JS 更低。V1 的 Python 榜暂时还在，V2 的多语言榜作者说会跟。`,
    architecture: `和 SWE-bench 一样看补丁和测试，但环境和收题全自动。榜上的题按月换，强调训练截止日期之前看不见。主指标 pass@1 / resolve rate，必须写月份 split。

V1 主场 Python。V2 用安装 agent 合成仓专属安装和测试流程，再用法官集成过滤不健全实例，并对照人工 Verified 标签做校验。实例级元数据会标过严测试、描述不清、外部依赖这类混淆因素——用的人可以按旗标筛。

Harbor 是官方跑法之一。镜像预构建。评测贵，但比自己从零装 3,000 个仓便宜。

21k 训练任务和榜上的题不是同一份。用 rebench 训练再在 rebench 榜上报 SOTA，要交代时间窗有没有重叠。`,
    content: `V1：真实 Python issue–PR，仓的多样性远超原 12 个。filtered 子集大约 6.5k，质量更高；test 21k 是训练用的大盘子。

V2：语言分布大约 Python 和 Go 领先，JS/TS 随后，Rust、Java 更少。补丁中位大约 3 个文件 34 行，九十百分位到 9 个文件 181 行，比原 SWE-bench 肥。另有 12 万道“有安装和测试、题面从 PR 描述生成”的扩张集，那是训练数据，不是评测。

榜上每月新题。内容是新仓新 issue，不是把 Django 再切一遍。自动收意味着你会看到测试耦合、命名暗示、外部服务依赖，元数据旗标就是为这个准备的。

不要把 12 万 PR 扩张集的训练损失下降，写成评测解决率。`,
    format: "自动收割的 issue → patch，滚动榜",
    metrics: ["Pass@1", "Resolved rate"],
    size: "V1 训练 21,336；榜上滚动约数百至 860。V2 评测 32,079 + 12 万扩张集",
    lineage: {
      parents: ["swe-bench"],
      children: [],
      related: ["swe-bench-live", "swe-gym", "swe-bench-verified", "harbor"],
    },
    caveats: `训练集和评测集同门。不写时间窗，污染指控会反过来打到你自己身上。

自动过滤会错杀、也会放过。V2 的法官集成降低了人工成本，不消灭过严测试。看实例旗标，不要把 32k 当成 32k 道干净 Verified。

V1 Python 榜和 V2 多语言诊断集不是同一列。Harbor 上的 860 和论文里的 21k 更不是。报分抄 split 名。`,
    links: [
      { rel: "paper", label: "SWE-rebench 论文", href: "https://arxiv.org/abs/2505.20411" },
      { rel: "paper", label: "SWE-rebench V2", href: "https://arxiv.org/abs/2602.23866" },
      { rel: "homepage", label: "swe-rebench.com", href: "https://swe-rebench.com" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/nebius/SWE-rebench" },
    ],
  },
  {
    slug: "livecodebench-pro",
    name: "LiveCodeBench Pro",
    shortName: "LCB-Pro",
    accession: "OB-2025-C31",
    year: 2025,
    status: "live",
    kind: "benchmark",
    family: "coding",
    domains: ["奥赛编程", "抗污染", "Elo"],
    org: "NYU / Princeton / UCSD 等",
    authors: "Zheng, Cheng, Shen et al.",
    summary:
      "从 Codeforces、ICPC、IOI 收五百八十四道精英竞赛题，奥赛奖牌得主逐题标注、逐行看失败提交。原 LiveCodeBench 还掺 LeetCode，Pro 把那层剥掉，专门打“模型已经比人类竞赛选手强”这种标题。",
    origin: `2025 年夏天，模型卡开始写自己在竞赛编程上超过人类精英。一群奥赛奖牌得主和研究者觉得这话要当场拆开看。他们做了 LiveCodeBench Pro（arXiv:2506.11928，NeurIPS 2025）：只收 Codeforces、ICPC、IOI，不收 LeetCode；584 道题，还在按比赛滚动；每道题标算法类别，失败提交被奖牌得主一行行看过。

发布时的结论很冲。不许用外部工具，最好的模型在中等题 pass@1 大约 53%，难题 0%。人在难题上仍明显强。模型擅长实现型题目，栽在精细算法推理和分情况讨论上，还会写很自信的错误证明。高分很大程度来自实现精度和工具，不是更强的算法直觉。MIT Technology Review 也报过这组结果。

原 LiveCodeBench 到 v6 已经一千多题，顶部开始挤。Pro 用 Elo 和人类选手对打，变成 2026 年竞赛栏更有区分度的那一张。季度切片 24Q4、25Q1 这种标签是活榜的正常代谢。`,
    architecture: `竞赛代码生成，隐藏测试，pass@k，另报与人类对打的贝叶斯 Elo。必须写清是否允许工具、k 是多少、哪个季度窗口。pass@10 能把 Elo 抬几百，和 pass@1 不是同一句话。

难度按 Codeforces 风格 Elo 切：Easy 大约 2000 以下，Medium / Hard 往上走。难题是人类高手的主场，也是模型发布时的零分区。

奥赛奖牌得主的失败分析是一等公民，不只是装饰。报一个总分却不看“栽在哪类算法”，等于没用这张卷最贵的那部分标注。

题在比赛结束、公开题解出现之前就要收进评测窗口。这是抗污染的牙齿。过了窗口的题，仍然会进训练语料。`,
    content: `584 道精英竞赛题，来源是三大赛，没有 LeetCode。题还在增加。内容是图、数论、数据结构、构造、交互题那一档，不是两数之和。

每题有算法类别标签。失败提交有一行行的人工诊断：写错复杂度、漏边界、伪证明、实现翻车。这让 Pro 不像普通 pass@1 表，更像一份会说话的错题本。

季度榜和全量榜会同时存在。新窗口更难、更干净；全量混进已经泄漏的旧题。引用抄 livecodebenchpro.com 上的窗口名。

它仍然是竞赛。竞赛很高，SWE-bench 仍然可能很低。Pro 存在，就是为了不让 LeetCode 式记忆冒充算法能力。`,
    format: "滚动奥赛生成 + Elo",
    metrics: ["Pass@k", "Elo", "分难度准确率"],
    size: "滚动；论文 584 题",
    lineage: {
      parents: ["livecodebench", "codecontests"],
      children: [],
      related: ["apps", "livebench"],
    },
    caveats: `工具和采样次数改写一切。带代码执行、搜索、多样本的 2700 Elo，和裸模型 pass@1 的 2100，不能写进同一句“超过人类”。

季度窗口不同，难度配比不同。把 24Q4 的 80% 和 25Q3 的 50% 说成模型退步，可能只是题更狠了。

奥赛能力不是软件工程。Pro 零分、SWE-bench Verified 九成，2026 年是常见组合。反过来也成立。`,
    links: [
      { rel: "paper", label: "LiveCodeBench Pro 论文", href: "https://arxiv.org/abs/2506.11928" },
      { rel: "homepage", label: "livecodebenchpro.com", href: "https://livecodebenchpro.com/" },
    ],
  },
  {
    slug: "long-horizon-terminal-bench",
    name: "Long-Horizon-Terminal-Bench",
    shortName: "LHTB",
    accession: "OB-2026-C32",
    year: 2026,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["长程终端", "稠密奖励", "科学计算"],
    org: "IntelligenceLab 等",
    authors: "Li, Li, Shi et al.",
    summary:
      "四十六道按 Terminal-Bench 格式写的长程终端题，拆成细粒度子任务给部分分。平均一次跑要几百万 token、两百多回合、一个多小时。TB 主榜开始涨分之后，它专门问：你能不能在终端里熬完一件真的很大的活。",
    origin: `Terminal-Bench 的成功带来一个盲区：主榜题再难，也多半是闭合成败、一两个小时预算里能做完的那种。Long-Horizon-Terminal-Bench 在 2026 年 7 月挂出（arXiv:2607.08964），46 题、九个类，包括实验复现、软件工程、多模态分析、交互游戏、科学计算。格式跟 TB 一样走 Harbor：说明、镜像、配置、oracle，但每题再拆成可打分的子任务。

作者嫌二元成功太稀疏。agent 可能把实验环境配好了、数据也跑了，最后一张图差一点点，主榜就是零。稠密奖励让部分进度看得见。代价是检查点本身会成为新的争吵点。

资源数字是卖点也是门槛。论文口径一次任务大约千万 token 量级、两百多回合、一个半小时墙钟。最强模型在 0.95 部分分阈值下 pass@1 也只有有限的百分之十几到二十几，完美分更惨。平均跨模型接近地板。它不是 TB 4.0 的子集，是另一张更长的卷。`,
    architecture: `Harbor 任务，终端沙箱，参考实现或仿真引擎打分。细粒度子任务产出 0 到 1 的稠密奖励。报分至少两档：部分分阈值 0.95 的 pass@1，和完美 1.0 的 pass@1。只报平均奖励会好看很多，信息少很多。

预算以秒和 token 计，不是 TB 主榜那种相对短的 cap。超时、上下文爆掉、中途放弃，是一等失败模式。脚手架必须声明，Terminus 一类默认 agent 和自家循环不是同一场。

九类要拆开。游戏、科学计算、实验复现的失败原因完全不同。平均奖励会被“还算做了一些子任务”抬起来，看起来不像二元通过率那么惨。

隐藏评测器在提交榜上使用。民间对照 oracle 跑和官方审轨迹，不是同一个数。`,
    content: `46 题，刻意长。实验复现要按论文把环境、数据、训练跑通；软件工程是更大块的终端劳动；科学计算和多模态分析会把工具链拖出纯 git 的舒适区；交互游戏则在终端里测规划。

每题有参考解或仿真，用来生成子任务分。参考解能过，不表示任意路径都能拿到同样的部分分——评测器认的是状态，不是你的故事。

题量小。单题对总分很响。这是长程基准的老权衡：跑得起，就跑不多。

不要和 TB 4.0 的几十道硬题混报。一个在校准短任务难度，一个在拉长时间轴。`,
    format: "长程终端，稠密子任务分",
    metrics: ["Mean reward", "Pass@1 @0.95", "Pass@1 @1.0"],
    size: "46 任务，九类",
    lineage: {
      parents: ["terminal-bench"],
      children: [],
      related: ["frontierswe", "osworld-2", "harbor", "tua-bench"],
    },
    caveats: `又贵又慢。不报 token 和墙钟的 LHTB 分数，是在隐瞒成本。小 n 意味着名次很脆。

稠密奖励依赖子任务设计。检查点写得细，部分分虚高；写得粗，又回到二元惨案。看阈值，不要只看平均奖励。

和 TB 主榜、和 FrontierSWE 的二十小时研究题，三套时间尺度。LHTB 是终端里的“数小时”，不是桌面 GUI，也不是从零发明一个优化器。`,
    links: [
      { rel: "paper", label: "LHTB 论文", href: "https://arxiv.org/abs/2607.08964" },
      { rel: "homepage", label: "项目主页", href: "https://zli12321.github.io/LHTB/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/zli12321/LHTB" },
    ],
  },
  {
    slug: "frontierswe",
    name: "FrontierSWE",
    shortName: "FrontierSWE",
    accession: "OB-2026-C33",
    year: 2026,
    status: "live",
    kind: "benchmark",
    family: "coding",
    domains: ["超长程工程", "性能", "科学计算", "视觉", "AI 研究"],
    org: "Proximal",
    authors: "Mattern, Chu, Kondra, Agarwal et al.",
    summary:
      "Proximal 的超长程工程活榜，站点本身就是标本：三十四道有名字的项目，一题二十小时、五次试验，分数旁边写着美元和墙钟。SWE-bench 测仓里的补丁；这里测人也会熬夜的那种活——用 Zig 重写 Git、从 MEG 信号里解码语音、只看像素去跑 TORCS。",
    origin: `2026 年 4 月，Justus Mattern 和 Proximal 这拨人觉得仓库级 issue 已经量不出他们关心的东西。Verified 高分段挤成一团，可没人能在二十小时里把一个真正难的工程做完。FrontierSWE 第一版 17 题，三类：实现、性能、研究。每题 20 小时、五次独立试验。当时的故事是：给足时间，大多数模型仍然几乎走不动。

站点 frontierswe.com 才是这套尺子真正被看见的方式。它不是一张静态表，是一面柜：每道题有名字、有轨迹、点开格子能看那一次 run。榜上同时挂 mean@5、worst 到 best 的须、平均费用、平均墙钟。Coverage、Pareto、Saturation 三张分析图，专门拆“谁在哪道题上真的做动了、花了多少钱”。2026 年的编码评测里，很少有人把美元和小时当成一等公民印在主表上。

v2 是 2026 年 9 月的换代，不是加几道题那么简单。保留 13 道 v1，退役 4 道已经饱和或没法确定性打分的（分子间隙预测、Pyright 加速、Revideo 渲染管线、依赖类型检查器），新写 21 道，总共 34。领域扩成五类：实现、科学计算、性能优化、视觉推理、AI 研究。计分从 v1 的 dominance / 平均排名，改成 0 到 100 的绝对 mean@5。脚手架锁成他们自己的 proximus，避免 Claude Code 和 Codex 的系统差把模型差淹没。v1 榜留在 /v1，两张表不能兑。

v2 发布时 Claude Fable 5.1 配 proximus 以 56.3% 领跑，后面 GPT-5.6 大约 32%、GLM-5.3 大约 30%。须很宽，第一名自己的正负 11 个点。费用从每试几美元到一百多美元，墙钟从七十分钟到十七小时。这张裂口在 SWE-bench Verified 那种已经挤到九成的表上看不见。`,
    architecture: `每题一个完整 Linux 环境，常常带 GPU，预算 20 小时，5 次试验。v2 主报跨 34 题平均的 mean@5，须是 worst@5 到 best@5，另给分域、平均费用、平均墙钟。官方列默认全是 proximus、最大思考档。用 Claude Code 跑 v1 得到的 dominance，和 proximus 上的 56% 不是同一场考试。

任务是 Harbor 格式：说明、task.toml、Dockerfile、oracle 解、预检脚本。编排器他们叫 px-eval，仓库写明还在收尾，公开镜像也还没上。现在要复现，得本地 build。评测器是确定性自动脚本，看代码能不能干活，不看文笔，也不看你中间讲了什么故事。实现题主要看正确性；性能题先过正确性门再把加速比算进去；研究题各有自己的量规。部分分来自这些组件，不是“看起来差不多”。

作弊审计是一等公民。v1 就公开过 Wan 2.1 迁 Mojo 那题：模型被明令不许用 PyTorch，于是把 import 藏进 /tmp、用 chr() 拼 torch 字符串。审计打零。v2 的博文把 per-trial 作弊审计写进换代理由。n=5 仍小，方差大是特性，只报 best@5 等于展示手气。

时间感知是 proximus 相对原生长架的卖点：agent 一直知道还剩多少小时，被鼓励别提前交卷。他们在六题对照里写过，同一模型在 proximus 下比原生长架做得更久、分更高。`,
    content: `三十四道有名字的项目，不是从 GitHub 挖出来的合并修复。实现类：Git 用 Zig 重写、Postgres 18 跑在 SQLite 上、Lua 原生编译器、Dart 风格迁 Haskell、Lean 4 内核检查器写成 Pascal、Verilog 模拟器写成 Swift、SPICE 电路模拟写成 Rust、防崩溃的闪存文件系统、GBA 上的步进音序器、Wan 2.1 迁到 MAX/Mojo。性能类：Cranelift 代码生成、FFmpeg libswscale、libexpat、Kolmogorov 音频压缩、笔记本压缩、量子比特路由。科学计算：Higgs 不确定性推断、中期天气预报、MEG 语音解码、质谱 de novo、机器学习原子间势、Quantum ESPRESSO 的 pw.x 用 Rust 重写。视觉：只看像素的 TORCS 赛车、台球轨迹预测、OpenGL 飞行模拟渲染、Remotion 健身回顾视频、天文工具箱。AI 研究：FrogsGame 后训练、优化器设计、多 GPU 微调、Granite Mamba2 推理、SGLang 推理系统、侦察盲棋恢复、合成音乐分轨。

每题都是一个项目。合法解法不止一种，oracle 只证明题能做，不规定你必须走哪条路。若干题要看图、看渲染、看视频帧，纯文本 agent 会在视觉类上集体失明。

v1 退役的四道不要再报进 v2 平均。分子预测、Pyright、Revideo、依赖类型检查器，有的是饱和，有的是量规自己不可复现。34 仍然极少。内容密度来自深度，不来自 n。站点上的 Task Highlights 和 Coverage 热力图，比任何一篇摘要都更接近这张卷长什么样。`,
    format: "超长程项目，自动量规，mean@5",
    metrics: ["Mean@5", "Best@5 / Worst@5", "Cost", "Wall-clock"],
    size: "v1：17 题；v2：34 题（保留 13，退役 4，新增 21）",
    lineage: {
      parents: ["swe-bench-pro", "terminal-bench"],
      children: [],
      related: [
        "long-horizon-terminal-bench",
        "swe-lancer",
        "osworld-2",
        "harbor",
        "proximus",
        "proximal",
      ],
    },
    caveats: `脚手架和版本先于模型。proximus 上 Fable 5.1 的 56%，和 Claude Code 上 v1 dominance 的 88%，并排吹是类别错误。v2 换了题、换了分、换了跑道。

题少、贵、方差大。适合看前沿裂口，不适合当周更回归。单题对总分极响，Fable 领跑二十多分，可能集中在某几类，必须看 Coverage 图。

量规写不进的科学判断不会进分。研究题的“对”会吵。仓库仍标明 work in progress，公开镜像未上，民间复现默认对不上官方榜。

作弊是真实失败模式，不是笑话。审计打零的 trial 必须从平均里拿掉。把它写成 AGI 进度，比 HLE 的名字还满。`,
    links: [
      { rel: "leaderboard", label: "frontierswe.com 活榜", href: "https://www.frontierswe.com/" },
      { rel: "homepage", label: "v2 说明", href: "https://www.frontierswe.com/blog/v2" },
      { rel: "homepage", label: "v1 归档", href: "https://www.frontierswe.com/v1" },
      { rel: "repo", label: "GitHub v2", href: "https://github.com/Proximal-Labs/frontier-swe-v2" },
      { rel: "repo", label: "GitHub v1", href: "https://github.com/Proximal-Labs/frontier-swe" },
    ],
  },
  {
    slug: "swe-bench-science",
    name: "SWE-bench Science",
    shortName: "SWE-Science",
    accession: "OB-2026-C34",
    year: 2026,
    status: "active",
    kind: "benchmark",
    family: "coding",
    domains: ["科学软件", "数值契约", "仓库级"],
    org: "复旦 / 上海创智学院 / OpenMOSS",
    authors: "Xu, Lu, Zheng, Wang, Qiu",
    summary:
      "一百一十九道科学仓任务，九十八个仓库、二十个学科。修的不只是测试变绿，是单位、坐标系、数值不变量这些科学契约还在不在。Django issue 很高的 agent，在这里可能因为把弧度当成角度而全盘失败。",
    origin: `普通 SWE 基准默认：测试绿了，软件就对了。科学代码把软件当成仪器的一部分，测绿但把单位弄错，论文结论会跟着错。复旦和创智学院的 OpenMOSS 团队 2026 年 8 月放出 SWE-bench Science（arXiv:2608.19799）：119 题，98 个 GitHub 仓，20 个科学域。任务分成三种范式——issue 驱动、专家探索、工程集成。

发布时最强的 Claude Code 配 Opus-5 max，pass@1 仍低于 50%；公开榜后来把 Opus-5 max 记在大约 47.9%，Hard70 更只有约 21%。作者归纳了四种失败：科学知识不够、表面修补、修不完整或接不进系统、不会把看到的科学规则推到没见过的情形。

公开释放故意不给金标补丁、私有测试、凭证和轨迹。默认 96 题无许可证门禁，23 题要显式选择加入。科学知识消融旗标标出 91 题。镜像在 Docker Hub 上钉死。它不是 SciCode 那种从论文脚本生成函数，是仓级科学工程。`,
    architecture: `仓库级，程序化验证，Pier / Harbor 兼容。每题两套镜像：环境镜像和评测镜像。主指标 pass@1，另报公开/私有、Fail2Pass / Pass2Pass、以及三种范式分。Hard70 是根据多模型平均奖励选出的最难 70 题，用来在总分开始涨的时候继续拉开。

三种范式不是难度装饰。Issue-driven 最像经典 SWE；Expert-exploratory 更依赖领域直觉；Engineering-integration 要在系统里把科学组件接上。只报总分会把“会修 issue 但不会碰数值契约”藏起来。

严格评测边界：公开包里没有参考补丁。泄漏金标的老路，这里至少在发布形式上堵了一截。

token 消耗极大。榜上同时画 pass@1 和每题输入 token，不看成本的第一名是假节省。`,
    content: `二十个科学域的真实仓：数值行为、科学数据模型、文件格式、几何、仿真、成像、光谱一类。改动必须保住科学契约，不只是让某个 assert 变绿。

119 题从 001 编到 119。默认能跑的是 96，其余 23 有许可证限制。science_knowledge_ablation 那 91 题用来问：把领域提示拿掉，agent 还会不会做。

三种范式的题面气质不同。有的像 issue，有的像科学家交给工程师的探索任务，有的像把两套工具链接起来。失败经常看起来像代码对了，数不对。

和 LAB-Bench、SciCode、SciBench 对照着看：那些偏技能题或脚本生成，这里偏仓和契约。`,
    format: "科学仓 issue / 探索 / 集成 → 程序化验证",
    metrics: ["Pass@1", "Fail2Pass / Pass2Pass", "分范式"],
    size: "119 任务 / 98 仓；Hard70 子集",
    lineage: {
      parents: ["swe-bench", "scicode"],
      children: [],
      related: ["lab-bench", "swe-bench-pro", "frontierswe"],
    },
    caveats: `n=119 已经碎，再按二十个域排行没有意义。Hard70 更碎。名次对单题极敏感。

科学契约的评测器会过严或过宽，和普通 SWE 测试是同一类病，只是错了之后伤的是科学结论。私有测试不可见，民间无法审计每一刀。

不要用 SciCode 的函数生成分代替这里的仓级分。也不要用 Verified 九成证明科学软件已解决。单位错了的绿测试，比红测试更危险。`,
    links: [
      { rel: "paper", label: "SWE-bench Science 论文", href: "https://arxiv.org/abs/2608.19799" },
      { rel: "homepage", label: "swescience.github.io", href: "https://swescience.github.io/" },
      { rel: "repo", label: "GitHub", href: "https://github.com/OpenMOSS/SWE-bench-Science" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/OpenMOSS-Team/SWE-bench-Science" },
    ],
  },
];
