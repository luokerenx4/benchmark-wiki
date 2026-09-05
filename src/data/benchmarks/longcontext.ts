import type { Benchmark } from "@/lib/types";

export const longcontext: Benchmark[] = [
  {
    slug: "niah",
    name: "Needle-in-a-Haystack",
    shortName: "NIAH",
    accession: "OB-2023-L01",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "longcontext",
    domains: ["检索探针"],
    org: "Greg Kamradt",
    authors: "Greg Kamradt",
    summary:
      "把一句话事实插入长填充，按深度×长度画召回热力图。它是探针，不是考试，没有论文，却定义了后来所有长上下文宣传必须过的第一关。",
    origin: `2023 年秋天，模型卡开始写 128k、200k。Greg Kamradt 想要一个简单得能在周末跑完的压力测试：把一句保罗·格雷厄姆绝不会写的话，塞进他的随笔堆里，看模型还记不记得。针是“在旧金山最好的事是去 Dolores Park 吃三明治”，草堆是 Paul Graham 随笔。

结果变成了长上下文评测的视觉符号：一张深度乘长度的热力图。GPT-4 128k 和 Claude 2.1 的那两张图在社交媒体上的传播，远超过大多数会议论文。Lost in the Middle 那篇更早的工作提供了学术语言，NIAH 提供了人人能看懂的产品探针。

它不是正式会议基准，没有论文，仓库就是规范。RULER、MRCR、无数厂商演示，都从这根针出发。谁要是把 NIAH 满分写成“读懂了长文档”，就是把探针当成了期末考。`,
    architecture: `合成检索。选定针、草堆、一组上下文长度和一组插入深度，逐格询问“根据上下文，旧金山最好做什么”，再用模型或字符串规则打召回。输出是热力图，不是单一准确率。把热力图平均成一个数，会丢掉它最有用的那两轴。

长度和深度是两个轴。针在开头几乎总能被找回，中间和更长窗口才开始花。这和 Lost in the Middle 的观察一致，但 NIAH 把它做成了可复跑的网格。产品演示爱用全绿的图，评测该看花在哪一格。

变体很快出现：多针、UUID 链、换草堆、换评分器。原版是单针加保罗随笔。报分必须写针是什么、草堆是什么、格子有多密。没有这些，热力图只是一张好看的图，也不能和 RULER 的任务平均兑。`,
    content: `一针加草堆。经典针是一句与草堆语义明显不同的事实，所以“语义上跳出来”本身会让任务变容易。草堆默认是 Paul Graham 随笔，有足够 token 铺到当时的窗口上限，但随笔并不是合同、代码仓库或多文档证据链。

它不包含推理、综合、多跳。问的就是那句话还在不在。内容几乎没有“题面多样性”可言，多样性全在长度和深度两个轴上。把它当成长上下文考试，是把探针的量程当成了学科。

后续工作批评它太好过：前沿模型很快接近饱和，于是宣传窗口的人继续用它当合格证。RULER 就是冲着“过了 NIAH 不等于会用上下文”来的。单针满分，只说明三明治还找得到。`,
    format: "合成检索",
    metrics: ["recall heatmap"],
    lineage: { parents: [], children: ["ruler"], related: ["longbench"] },
    caveats: `测检索不是推理。能在 128k 处把三明治找回来，不代表能读懂合同、能汇总小说、能在仓库里修 bug。NIAH 是探针，不是考试。窗口宣传数字需要探针，不需要把它印成毕业证。

前沿模型已接近饱和。还在用单针热力图宣称长上下文 SOTA，区分度接近零。针和草堆语义差得太远时，任务会偏易；针若是草堆里本来就有的事实，又会和参数记忆搅在一起。换针、换草堆，图就会改。

没有论文，规范就是仓库和那两场公开实验。引用时不要把它写成会议基准，也不要和 RULER 的多任务平均混成一个“长上下文分”。绿图很漂亮，合同还在后头。`,
    links: [
      { rel: "repo", label: "gkamradt/needle-in-a-haystack", href: "https://github.com/gkamradt/needle-in-a-haystack" },
    ],
  },
  {
    slug: "longbench",
    name: "LongBench",
    shortName: "LongBench",
    accession: "OB-2023-L02",
    year: 2023,
    status: "active",
    kind: "suite",
    family: "longcontext",
    domains: ["中英真实长文"],
    org: "THUDM",
    authors: "Bai et al.",
    summary:
      "二十一任务的双语长上下文套件，平均约八千词，六类真实和合成任务。它把探针扩成了能报总分的考卷，v1 部分抽取式任务正在饱和。",
    origin: `NIAH 只能告诉你针还在不在。清华 THUDM 想要一份更像应用的卷子：单文档问答、多文档问答、摘要、代码、合成检索，中英都有。LongBench 于 2023 年把“长上下文”从演示变成套件。

平均长度大约八千词，在当时已经算长，在百万 token 广告出来之后显得短。它仍然是开源世界里被复跑最多的真实长文基准之一，OpenCompass 一类 harness 也常带着它。

v1 的问题很快暴露：不少任务偏抽取，模型会找原句。于是同一组人做了 LongBench v2，改成更难的选择题，人类限时也只能做对一半左右。读 LongBench 先问版本。`,
    architecture: `二十一任务，六类：单文档 QA、多文档 QA、摘要、少样本学习、合成、代码。指标按任务而定，总分是各任务主指标的某种平均。中英分开看比只看总分有用，抽取式和生成式也不该兑成一个数。

上下文长度不可配置到任意窗口，这是它相对 RULER 的弱项：你不能把同一题拉到 128k 再拉到 256k。它测的是“这些真实长文上的任务表现”，不是“有效上下文随长度怎么掉”。窗口广告该看 RULER，真实文档该看这里。

评测是生成式为主，答案抽取和 LLM 裁判都有人用。原论文协议和后来 harness 移植不必相同。报分写任务子集和是否截断，以及跑的是 v1 还是已经换到 v2。`,
    content: `中英真实文档为主，夹少量合成。来源包括新闻、论文、报告、代码仓库一类，比保罗随笔更像产品场景。题是任务，不是一根针。

平均约 8k，最长也不到后来 ∞Bench 的二十万。对 2025 年的百万窗口模型，v1 更像中等长度诊断，而不是极限压力。用它证明百万窗口，尺子不够长。

部分任务答案可在原文中直接找到。这让检索强、综合弱的模型也能拿分，正是 v2 要改掉的东西。读 v1 内容时，要把抽取式 QA 和摘要、代码分开，否则平均分会替抽取式说好话。`,
    format: "多任务长上下文",
    metrics: ["任务相关"],
    lineage: { parents: ["niah"], children: ["longbench-v2"], related: ["infinitebench"] },
    caveats: `v1 部分抽取式，正在饱和。不要用 LongBench v1 总分宣称百万窗口能力。长度不够，任务也不够“必须推理”。NIAH 绿了、v1 也高，仍然可能在 v2 上只比随机好一点。

中英混报会掩盖语言偏差。截断策略不同，分数不可比：有的实现从中间切，有的保两头。窗口不够时，截断本身就是一种评测，不是实现细节。

v1 和 v2 不能兑。v2 是 503 道难题 MCQ，人类 15 分钟约 53.7%。写 LongBench 而不写版本，等于没报。仓库后来把两者放在一起，表头更要写清楚。`,
    links: [
      { rel: "paper", label: "LongBench", href: "https://arxiv.org/abs/2308.14508" },
      { rel: "repo", label: "THUDM/LongBench", href: "https://github.com/THUDM/LongBench" },
    ],
  },
  {
    slug: "ruler",
    name: "RULER",
    shortName: "RULER",
    accession: "OB-2024-L03",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "longcontext",
    domains: ["有效上下文"],
    org: "NVIDIA",
    authors: "Hsieh et al.",
    summary:
      "十三个可配置长度的合成任务：NIAH 变体、多跳追踪、聚合、问答。核心结论是广告窗口往往远大于有效上下文。",
    origin: `厂商把窗口数字写到 32k、128k、200k，NIAH 热力图却开始变绿。NVIDIA 的 RULER 问的是另一件事：把针变多、变成追踪、变成数频繁词，你的有效上下文还剩多少。

论文标题直接叫 What's the Real Context Size。他们用 Llama-2-7B 在 4k 上的平均表现当合格线，大约 85.6%。宣称 32k 以上的模型里，当时只有少数能在 32k 仍跨过这条线，几乎所有模型都在到达广告长度之前掉到线下。

这把“窗口”和“有效上下文”拆开了。之后模型卡再只贴一张满分 NIAH，已经有点不好意思。HELM Long Context 后来也把 RULER 的真实 QA 变体收进去复跑。`,
    architecture: `合成，长度可配。十三任务分成四类：检索（单针、多针、多查询、多值）、多跳追踪（变量绑定一类）、聚合（最频繁词、常见词）、问答（把 SQuAD、HotPotQA 段落塞进干扰文档）。每档长度报平均准确率，再标有效长度。平均分会把“还会找针”和“已经不会数频繁词”混在一起。

通过 NIAH 不等于通过聚合，更不等于通过多跳追踪。这是协议里最有用的一句话。任务复杂度可以加针、加干扰、换值类型，长度从 4k 拉到 128k。广告窗口写到哪一档，就应该在哪一档看这四类是否同时站住。

它故意减少对参数知识的依赖，好让分数反映上下文利用，而不是模型本来就会这道题。合成的代价是生态效度：有效长度不等于合同审查长度，但比热力图更接近“窗口有没有水分”。`,
    content: `多针、变量追踪、频繁词计数、塞了干扰文档的 QA。草堆和针都是程序生成的，长度是独立旋钮。你可以让同一任务在 4k 和 128k 上长得一样，只是中间更厚。

SQuAD / HotPotQA 那两档把真实问答嵌进合成长上下文，是后来 HELM 子集选中的部分。纯合成档则更干净地暴露“窗口到了但不会数数”。两类内容不要兑成一个故事。

内容没有小说情节或代码仓库。想看真实长文，去 LongBench 和 ∞Bench；想看广告窗口有没有水分，留在 RULER。有效上下文远小于广告窗口，这句话首先是对这份内容说的。`,
    format: "合成长上下文",
    metrics: ["task accuracy vs length"],
    lineage: { parents: ["niah"], children: ["helm-long-context"], related: ["mrcr"] },
    caveats: `合成。通过 NIAH 不等于通过聚合，不等于通过 LongBench v2。有效上下文远小于广告窗口，是 RULER 要你记住的那句话，不是说模型在所有长任务上都废。探针过关只是入场券。

85.6% 那条线来自 Llama-2-7B @ 4k，是作者的定性门槛，不是物理定律。换基准模型，有效长度表会动。不要把“RULER 有效 32k”写成官方认证，更不要拿去和百万窗口的产品页对打。

长度档、任务子集、是否 chat 模板都会改分。HELM 只复跑其中两档 QA 的 100 条，不能和全量 RULER 横比。厂商演示若只贴单针，等于拒绝参加这场更难的合成考。`,
    links: [
      { rel: "paper", label: "RULER", href: "https://arxiv.org/abs/2404.06654" },
      { rel: "repo", label: "NVIDIA/RULER", href: "https://github.com/NVIDIA/RULER" },
    ],
  },
  {
    slug: "infinitebench",
    name: "∞Bench / InfiniteBench",
    shortName: "∞Bench",
    accession: "OB-2024-L04",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "longcontext",
    domains: ["超长上下文"],
    org: "OpenBMB / Tsinghua",
    authors: "Zhang et al.",
    summary:
      "十二任务，平均约二十万 token，中英都有。仓库叫 InfiniteBench，论文叫 ∞Bench，是同一份——不要和视频或空间推理的 InfiniBench 搞混。",
    origin: `LongBench 平均八千词，窗口广告已经写到十万以上。OpenBMB 做了一份平均约 20 万 token 的套件，把“超长”从口号变成可跑的任务。论文标题是 ∞Bench: Extending Long Context Evaluation Beyond 100K Tokens。

名字是个陷阱。仓库和组织页面写 InfiniteBench，论文写 ∞Bench，社区两种叫法混用，指的是同一份长文本基准。另一边至少还有 CV 的 InfiniBench：长视频理解、以及后来 CVPR 那份可定制空间场景生成器。字母只差几个，领域完全不是一回事。

HELM Long Context 选了其中英文多项选择和摘要两档做标准复跑。它因此同时以全量和子采样两种数字活在榜上。`,
    architecture: `十二任务，覆盖检索、代码、数学、小说、对话。设计原则是：这些任务在短上下文上模型本来就会，拉长之后掉分才应归因于长度。混合真实文档和可再拉长的合成。短上下文会做、长了就不会，才是这份基准想抓住的差。

平均长度约 200k，比 LongBench v1 高一个数量级，比 NIAH 网格更接近“真的很长”。任务指标各异：检索看召回，小说 QA 看准确率，摘要看生成质量。把十二个指标平均成一个“∞ 分”，会把找针和写摘要混在一起。

跑全量很贵。于是出现只跑 En.MC、En.Sum 或只跑 100 条的复现。报分必须写任务子集，否则 ∞Bench 四个字可以指十二任务平均，也可以指 HELM 那两栏。贵不是缺点，是超长评测的默认税。`,
    content: `超长文档：长小说、长对话、长代码、合成检索与计算。中英都有。约 3,946 条量级，按任务拆开。不是单一草堆重复粘贴，是几类真正变长的材料。

小说和对话是它相对纯合成探针的卖点：你得跟着情节走，而不只是找一句三明治。代码任务则要求在长上下文里定位或模拟执行。检索档则更接近 NIAH 亲戚，读总分时要把这些拆开。

它仍然不是百万窗口的上限测试。对 1M、10M 的新模型，∞Bench 是中长，不是无穷。名字里的无限号是愿望，不是长度。别被符号骗了，也别被仓库名 InfiniteBench 骗去别的领域。`,
    format: "超长任务",
    metrics: ["任务相关"],
    lineage: { parents: ["longbench"], children: ["helm-long-context"], related: ["lv-eval"] },
    caveats: `不要和 InfiniBench 搞混。本条是 OpenBMB 的长文本 ∞Bench / InfiniteBench。CV 社区至少有长视频 InfiniBench，以及空间推理场景生成器 InfiniBench。搜名字会搜出一堆无关仓库。论文名、仓库名、视觉同名，三套东西只有一套属于这只抽屉。

全量子集不可互换。HELM 的 100 条 En.MC / En.Sum 不是 ∞Bench 总分。合成检索档接近 NIAH 亲戚，小说档才更像真实长文。只跑好跑的那两栏，再写成 ∞Bench SOTA，是常见的偷换。

贵、长、截断策略敏感。窗口不够的模型被切掉后半段，分数会假惨，这不能反向证明短窗口模型“不会长上下文”，只说明题比窗口长。报分写最大输入和切法。`,
    links: [
      { rel: "paper", label: "∞Bench", href: "https://arxiv.org/abs/2402.13718" },
      { rel: "repo", label: "OpenBMB/InfiniteBench", href: "https://github.com/OpenBMB/InfiniteBench" },
    ],
  },
  {
    slug: "lv-eval",
    name: "LV-Eval",
    shortName: "LV-Eval",
    accession: "OB-2024-L05",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "longcontext",
    domains: ["分级长度 QA"],
    org: "Infinigence",
    authors: "Yuan, Ning, Zhou et al.",
    summary:
      "五个长度档，从 16k 到 256k 词，插入混淆事实并替换关键词，用关键词召回指标对抗捷径。社区采用少于 LongBench 和 RULER。",
    origin: `作者认为当时主流长上下文基准平均只有几千到两万词，还容易靠参数记忆和含糊的生成指标混分。LV-Eval 把同一批问答对铺到五个长度档，最长到 256k 词，好让长度成为受控变量而不是偶然属性。窗口写到 256k 的模型，至少该在这一档上被看见。

三件武器写进设计：插入混淆事实，提高干扰；关键词和短语替换，降低“我预训练见过这题”的泄漏；关键词召回指标，避免用含糊的 F1 给胡话打分。中英都有。这三招都是在打捷径，不是在把题出得更像奥赛。

它在时间上和 ∞Bench、RULER 前后脚，但被复跑得更少。不是因为想法差，是生态位置已经被 LongBench 和 RULER 占住了。读长上下文抽屉时，它是那根被少引用的受控长度轴。`,
    architecture: `十一份双语 QA 子集，单跳和多跳。每个子集在 16k、32k、64k、128k、256k 五档上复用同一批问答，只加长上下文。这样画出的掉分曲线，比把不同题拼在不同长度上更干净。长度是实验因子，不是事后统计出来的平均词数。

混淆事实插入让模型不能见着相似句就抽。关键词替换把实体改掉，逼模型读当前上下文。关键词感知的召回指标用来打短答案，而不是整句 BLEU。三件套一起，才是 LV-Eval 的协议，不是“又一份长 QA”。

它仍是 QA，不是聚合或代码。和 RULER 比，真实文档更多；和 LongBench 比，长度轴更受控。不要指望它覆盖小说摘要或仓库问答。`,
    content: `长 QA。子集来自 HotpotQA、LooGLE、MultiFieldQA、CMRC、DuReader 一类的混合与改写，中英都有。平均约十万词，最短约 12k，最长可到三十多万词。数字按词计，和按 token 计的窗口广告还要再换一次算。

五档长度是同一批问答的五套草堆。比较 16k 和 256k 时，问的是同一件事，只是干扰和填充更长。这是它最该被记住的结构：题不变，上下文在变。

事实回忆类子集更接近探针，多跳子集更接近真正的长文档推理。平均分会把这两类混在一起。关键词被替换过的实体，也已经不是预训练里那个原名。`,
    format: "分级长 QA",
    metrics: ["keyword-aware scores"],
    lineage: { parents: ["longbench"], children: [], related: ["ruler"] },
    caveats: `社区采用少于 LongBench、RULER。引用数字时要确认是哪一档长度、哪一个子集，五档平均没有神性。256k 档掉光、16k 档还行，才是这条曲线该讲的故事。

关键词替换和混淆事实会让“看起来能做”的模型掉分，这是特性。但改写本身也可能引入不自然的句子，生态效度不是零代价。抗捷径和“像真实文档”之间有张力。

不要和 ∞Bench 的小说任务或 RULER 的频繁词任务横比。LV-Eval 回答的是：同一问，上下文拉长并掺假之后还能否答。它不是 NIAH，也不是 v2 那种限时人类也只有一半的难题 MCQ。`,
    links: [
      { rel: "paper", label: "LV-Eval", href: "https://arxiv.org/abs/2402.05136" },
      { rel: "repo", label: "infinigence/LVEval", href: "https://github.com/infinigence/LVEval" },
    ],
  },
  {
    slug: "mrcr",
    name: "MRCR",
    shortName: "MRCR",
    accession: "OB-2024-L06",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "longcontext",
    domains: ["多轮指代检索"],
    org: "Google / OpenAI（两套实现）",
    authors: "Gemini 报告；OpenAI 开放数据",
    summary:
      "在长对话里插入多根针，做多轮共指检索：把第 i 次“写一首关于貘的诗”原样找回来。Google 与 OpenAI 的实现不可互换。",
    origin: `MRCR 全称 Multi-Round Co-reference Resolution，先出现在 Gemini 1.5 的技术报告和后来的 Michelangelo 长上下文论文里。设定很损：用户反复要求“写一首关于貘的诗”“写一篇关于石头的博客”，助手每次写的都不一样，最后问你要回第 2 首貘诗。

OpenAI 后来说：这个任务好，但我们把它做难，并开放数据。Hugging Face 上的 openai/mrcr 写明 inspired by Gemini，用 2/4/8 针，指标是 Python SequenceMatcher 相似度。GPT-4.1 一类发布会拿它当长上下文主菜。

于是市场上同时活着两套、后来甚至更多套 MRCR。Google 内部版、OpenAI 开放版、再后来的 MRCRv2，对话格式、针数、长度箱、是否要求先输出随机校验串，都不一样。把 Gemini 表上的 MRCR 和 OpenAI 表上的 MRCR 画在同一张图，是常见错误。`,
    architecture: `合成长对话。隐藏 2、4 或 8 次相同类型的请求，模型必须按序号取回那一次的助手输出。针越多越难，上下文越长越难。它比单针 NIAH 多了顺序和共指：你得数“第几次”，不能只做语义匹配。

OpenAI 版用 difflib 的 SequenceMatcher ratio 打分，原文对不上就扣分，摘要或改写拿不到满分。Google 原版和后续 v2 在长度箱、采样次数、是否 prefix-cache 友好、是否先输出特殊校验串上另有规定。

有工具的模型可以把对话当文本搜，任务会变简单。协议通常默认纯上下文，不给代码解释器。报分写针数、长度、哪家实现。`,
    content: `合成多轮写作对话，主题是诗、博客、社交媒体帖一类可重复请求。内容本身没有知识难度，难度全在“长、像、要按序号取”。没有世界知识，没有公式，只有共指和顺序。

OpenAI 开放集把对话铺到很长，并按针数分档。Google 后来开源的生成管道还可以自己造私有版，长度可到数百万 token 量级，那已经不是 HF 上那份 openai/mrcr。两套数据里的诗，不是同一首诗。

草堆不是保罗随笔，是模型自己（合成出来）的历史回复。针和草堆同分布，这比 NIAH 那句三明治更阴：语义上并不跳出来。你要找的是第 i 次，不是“关于貘的那类文本”。`,
    format: "合成多针检索",
    metrics: ["sequence similarity / recall"],
    lineage: { parents: ["niah"], children: ["helm-long-context"], related: ["ruler"] },
    caveats: `Google 与 OpenAI 实现不可互换。同一缩写，两套数据、两套长度箱、两套计分细节。再往后 Google 的 MRCRv2 又和 OpenAI 的 MRCRv2 不是同一测试。模型卡上只写 MRCR 百分之几，等于没写。Gemini 表和 GPT 表画在一起，是长上下文评测里最常见的张冠李戴。

它仍是检索加计数，不是读懂长合同。8 针满分不代表 LongBench v2 能过。HELM 复跑的是 OpenAI MRCR 的 100 条，不要和全量或 Google 曲线比。针数没写，分数就没有意义。

SequenceMatcher 对改写很苛刻。模型“意思找对了但重写了”会低分，这是设计。换 LLM 裁判会得到另一张榜。引用时写哪家、几针、多长、什么相似度。`,
    links: [
      { rel: "dataset", label: "openai/mrcr", href: "https://huggingface.co/datasets/openai/mrcr" },
    ],
  },
  {
    slug: "longbench-v2",
    name: "LongBench v2",
    shortName: "LongBench v2",
    accession: "OB-2024-L07",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "longcontext",
    domains: ["更难真实长文"],
    org: "THUDM",
    authors: "Bai et al.",
    summary:
      "五百零三道难题选择题，上下文从八千到两百万词。人类专家限时十五分钟约 53.7%，直接回答的最强模型当时只有约一半。",
    origin: `LongBench v1 偏抽取，分数开始好看但说不清模型是否真读懂。同一组人改做 v2：真实文档，四选一，题要难到专家拿着检索工具在十五分钟里也只能做对一半左右。太容易三分钟内搞定的题会被改掉。

503 道题来自近百名高学历标注者，覆盖六类现实任务。发布时直接回答最好大约 50.1%，o1-preview 靠更长推理到 57.7%，略高于人类限时基线。作者把这读成：长上下文的下一课是推理和测试时计算，不是再加长窗口。

它把长上下文评测从“找得到针”拉回“题很难”。热力图绿了不表示 v2 能过。这是 2025 年还值得看的少数真实长文硬卷。`,
    architecture: `长上下文 MCQ。六类：单文档 QA、多文档 QA、长上下文学习、长对话、代码仓库、结构化数据。长度从 8k 到 2M 词，中位数约 54k，平均约 104k，多数仍在 128k 以下。宣传里的两百万是上界，不是每道题的长度。

难度分 Easy/Hard。自动筛选会丢掉三家模型都能做对的题，人工再丢掉过易题。评测常用零样本加 CoT，正则抽选项字母。随机基线 25%。直接回答和长推理是两种协议，o1-preview 那 57.7% 属于后者。

选择题带来可靠判分，也带来猜测。人类基线含约 8% 的“我不知道”，协议里按随机猜给分。模型若乱选，表面上也能混过随机，但 50% 才刚到限时人类。硬度是设计出来的，不是窗口数字变大自动出现的。`,
    content: `真实长文档：论文、小说、报告、仓库、表格与结构化记录。题是人出的，要求深挖和推理，而不是抄原句。近百名高学历标注者出题，二十四名专家限时作答，这是 v2 相对 v1 抽取式任务的质变。

长度跨度极大，少数题到百万词以上，多数没有那么夸张。报一个“2M”当全体长度，会误导采购。应同时看中位数和“多数在 128k 以下”这句。

覆盖面是六类二十个子任务量级。代码仓库和多文档论文是人类也容易做砸的部分。内容仍可能与预训练重叠，真实文档没有私有魔法。硬度来自必须推理，不来自把草堆加密。`,
    format: "长上下文 MCQ",
    metrics: ["Accuracy"],
    size: "503",
    lineage: { parents: ["longbench"], children: [], related: ["ruler"] },
    caveats: `真实文档仍有污染风险。MCQ 可猜。人类 53.7% 是 15 分钟限时加检索工具，不是无限时间的专家上限，拿来当 AGI 标尺会过头，但用来说明“题很难”是成立的。限时人类基线被模型用更长推理超过，也只说明测试时计算在这份卷上有用。

不要和 v1 总分兑，也不要和 NIAH 热力图兑。v2 的点是深度理解，不是窗口广告。截断到 128k 再评，和在原生百万窗口上评，不是同一实验。绿热力图加低 v2，是现在更常见的组合。

503 题不算大。分任务看方差不小。只报一个准确率，会把代码仓库的失败平均进结构化数据的成功。六类要拆开读。`,
    links: [
      { rel: "paper", label: "LongBench v2", href: "https://arxiv.org/abs/2412.15204" },
      { rel: "homepage", label: "longbench2.github.io", href: "https://longbench2.github.io" },
    ],
  },
  {
    slug: "helm-long-context",
    name: "HELM Long Context",
    shortName: "HELM Long Context",
    accession: "OB-2025-L08",
    year: 2025,
    status: "active",
    kind: "leaderboard",
    family: "longcontext",
    domains: ["标准化复跑"],
    org: "Stanford CRFM",
    authors: "HELM team",
    summary:
      "对 RULER、∞Bench、OpenAI MRCR 做固定子采样复跑，五任务、每任务一百例。不是新题，是为了让不同模型在同一套提示下可比。",
    origin: `长上下文基准又贵又乱，每家模型卡各跑各的 NIAH 变体。斯坦福 CRFM 的 HELM 系列一直做“同一套场景、公开请求、可复现”。2025 年的 Long Context 榜把这条纪律搬到长窗口：不造新题，挑选已有任务，固定子采样，公开每条请求。

选中的五栏是 RULER 的 SQuAD 与 HotPotQA、∞Bench 的英文选择与摘要、以及 OpenAI MRCR。注意这里的 MRCR 是 OpenAI 那份，不是 Gemini 内部实现。∞Bench 也只跑两档，不是十二任务平均。

它解决的是可比性，不是难度上限。想看百万词难题，去 LongBench v2；想看广告窗口水分，去全量 RULER。HELM 给你一张能并排看的表。`,
    architecture: `每任务 100 例。场景、提示、指标由 HELM 框架固定，原始请求可查。模型之间只在 HELM 内可比，不能拿这里的 RULER SQuAD 一百条去打 NVIDIA 原论文的全表。子采样是纪律，也是限制。

五任务覆盖单跳 QA、多跳 QA、小说选择、小说摘要、多轮共指。这是有意的窄：丢掉了 RULER 的频繁词和变量追踪，也丢掉了 ∞Bench 的代码与中文。窄的代价是覆盖，收益是跑得动、看得清。MRCR 这一栏用的是 OpenAI 实现。

leaderboard 会随模型添加更新。引用要写页面版本或日期，HELM 的“latest”会动。和 HELM Classic、Lite 也不通用，Long Context 是单独一张榜。`,
    content: `RULER SQuAD、RULER HotPotQA、∞Bench En.MC、∞Bench En.Sum、OpenAI MRCR。都是从已有基准抽样，不是新标注。五栏的名字要写全，否则读者会以为这是全量 RULER 或全量 ∞Bench。

一百条的统计功效有限，但比厂商各自截一截演示集干净。内容长度随原任务，不是 HELM 另造的百万草堆。也没有 LongBench v2 那种限时人类也只有一半的难题。

中文、代码、聚合计数这些轴在这张榜上不存在。缺的轴要回到母基准补。内容是复跑菜单，不是长上下文宇宙的充分统计。`,
    format: "leaderboard",
    metrics: ["HELM 场景分"],
    lineage: { parents: ["helm", "ruler", "infinitebench", "mrcr"], children: [], related: [] },
    caveats: `子采样。不要和全量 RULER、全量 ∞Bench 或 Google MRCR 比。五任务平均更不能写成“长上下文第一”。OpenAI MRCR 一百条，也不是 Gemini 曲线上的同一个点。

HELM 的价值是透明和复现，不是发现最难的题。窗口更大的模型在这张表上的优势，可能来自没被截断，而不是更深的理解。想看硬度，去 LongBench v2；想看窗口水分，去全量 RULER。

和 HELM Classic、HELM Lite 的场景也不通用。Long Context 是单独一张榜，MMLU 不在这里。引用 latest 页面时记下日期，表会改。`,
    links: [
      { rel: "leaderboard", label: "HELM Long Context", href: "https://crfm.stanford.edu/helm/long-context/latest/" },
      { rel: "homepage", label: "博文", href: "https://crfm.stanford.edu/2025/09/29/helm-long-context.html" },
    ],
  },
];
