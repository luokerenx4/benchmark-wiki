import type { Benchmark } from "@/lib/types";

export const multimodal: Benchmark[] = [
  {
    slug: "ai2d",
    name: "AI2D",
    shortName: "AI2D",
    accession: "OB-2016-V01",
    year: 2016,
    status: "foundational",
    kind: "benchmark",
    family: "multimodal",
    domains: ["科学示意图"],
    org: "AllenAI",
    authors: "Kembhavi et al.",
    summary:
      "小学科学教科书示意图上的选择题，用来说明图理解不是自然照片识别。CVPR 2016 的老标本，今天仍在 OpenCompass 和 VLMEvalKit 里被当作诊断项。",
    origin: `2016 年的计算机视觉还在刷自然照片。AllenAI 指出另一件事：教科书里的示意图——箭头、标注、剖面、生命周期——跟 ImageNet 上的猫不是一种视觉。AI2D 把小学科学图做成选择题，强迫模型读图例、跟箭头、把文字和图形对齐。

它比后来的 ScienceQA、MMMU 早了整整一代。当时的方法还在做图结构解析和布局图，不是今天这种“把图塞进 ViT 再接 LLM”。但它提出的问题没有过期：示意图是一种人工视觉语言，OCR 和图关系缺一不可。

今天你仍会在综合 VLM 套件里撞见它，不是因为它难，而是因为它便宜、干净、能把“只会看照片”的模型当场揭穿。OpenCompass、VLMEvalKit 把它当基础感知栏，和 DocVQA、ChartQA 排在一起。

圈里的态度是：报可以，吹不行。对 2025 年的模型，AI2D 更像视力表上的第一行。`,
    architecture: `输入一张教科书示意图加一道选择题，输出选项。图内通常有标签、箭头、编号，题干会引用这些标注。主指标准确率。

规模大约四千五到五千张图，题量更大，因为一图多问。和自然图像 VQA 不同，这里的“物体”是图示符号，不是实例分割意义上的物体。

早期论文走的是图解析流水线：检测文本框、识别箭头、建图再推理。今天的 VLM 把它当成普通图文题一口吃掉，中间的结构监督消失了，失败时也更难看清是 OCR 错了还是关系错了。

不要和 SciBench 那种大学作业混为一谈。这是小学科学示意图，知识深度浅，视觉惯例才是考点。`,
    content: `图来自小学科学教科书：食物链、水循环、细胞剖面、电路。风格是手绘或教材插画，不是实验照片，也不是论文里的复杂图。

图内文字是一等公民。很多题其实是在考你能不能读标签、把编号和图例对上。纯视觉特征和纯 OCR 各能做掉一部分，真正要的是两者对齐。

选项是封闭的。猜测基线不低，小规模上的分差要小心解读。一图多问意味着图像泄漏会沿着题面扩散。

没有视频、没有文档页、没有图表坐标轴。它只覆盖“示意图”这一种视觉体裁。`,
    format: "示意图 MCQ",
    metrics: ["Accuracy"],
    lineage: { parents: [], children: ["scienceqa"], related: ["docvqa"] },
    caveats: `老。2016 年的图和题在网上躺了十年，进预训练语料的概率不低。高分可能是记忆，不是读图。

图内文字是 OCR。VLM 的 AI2D 分高，常常是 OCR 变好了，不一定是更懂科学图。

规模小、选择题、小学知识，三重偏易。对前沿模型区分度有限，更适合当诊断子项。

不要把它的准确率和 MMMU 大学试卷放在同一句“多模态理解”里。年级差了十年，体裁也不一样。`,
    links: [
      { rel: "paper", label: "AI2D", href: "https://arxiv.org/abs/1603.07396" },
      { rel: "homepage", label: "AllenAI", href: "https://allenai.org/data/diagrams" },
    ],
  },
  {
    slug: "textvqa",
    name: "TextVQA",
    shortName: "TextVQA",
    accession: "OB-2019-V02",
    year: 2019,
    status: "foundational",
    kind: "benchmark",
    family: "multimodal",
    domains: ["场景文字"],
    org: "Facebook AI / Georgia Tech",
    authors: "Singh et al.",
    summary:
      "必须读图中文字才能答的开放 VQA，专门打普通 VQA 靠物体识别蒙混的那一招。路牌、标签、T 恤上的字，是后来文档和图表理解的前史。",
    origin: `普通 VQA 可以靠物体识别蒙混：看见香蕉就答黄色，看见厕所就答洗手。Facebook AI 和 Georgia Tech 做 TextVQA，把必须读场景文字才能答的题单独拉出来——路牌写了什么、T 恤上的数字、包装上的品牌。

这是 OCR-VQA 这条线的关键标本。它告诉视觉问答社区：图里的字不是噪声，是答案。后来的 DocVQA、OCRBench、各种文档 VLM，都在把这件事从自然场景搬到扫描件和屏幕截图。

指标沿用 VQA 准确率：十个标注，按匹配比例给分。开放词汇答案，不是选择题。这对早期模型很不友好，对今天的 OCR 增强 VLM 则已经偏软。

圈里都知道许多 VLM 训练见过它。LLaVA 系列甚至专门讨论过 TextCaps 和 TextVQA 共用图像的污染。看到接近饱和的 TextVQA 分，先问训练配方。`,
    architecture: `输入自然图像和问题，输出简短答案。答案多为图中读到的词或数字，偶尔需要轻微推理。主指标是 VQA accuracy：与十个众包答案做软匹配。

开放生成，不是 MCQ。抽取和规范化规则会影响分。大小写、冠词、数字格式，老评测脚本和新 harness 可能不一致。

图像来自 Open Images 一类自然场景，文字是场景文字，不是平整扫描件。透视、模糊、艺术字体，是 OCR 的老敌人。

常和 OCR 流水线级联：先检测文本，再把识别结果喂给 QA 模块。端到端 VLM 把这两步吃进同一个解码器，错误类型就不再可分。`,
    content: `约 45k 题，图像是含文字的自然场景：路牌、商店招牌、产品标签、衣服印字。问题针对这些文字，而不是物体类别。

答案短，词汇表相对集中。很多题是读出一个词或一个数字，复杂推理不是主菜。这让它更像 OCR 探针，而不是通用视觉推理。

十个标注带来软匹配的好处，也带来噪声：众包答案不完全一致时，模型说对了也可能拿不到 1.0。

没有文档级布局，没有表格结构。要测那些，去 DocVQA 和 ChartQA。TextVQA 只负责“场景里那几个字你看见了没”。`,
    format: "开放 VQA",
    metrics: ["VQA accuracy"],
    lineage: { parents: [], children: ["docvqa"], related: ["chartqa"] },
    caveats: `许多 VLM 训练见过。高分首先要排除污染，尤其是和 TextCaps 共享图像的配方。

词汇答案。开放生成的抽取规则一变，排行榜就会抖。和选择题套件的准确率不能直接兑。

对当代模型偏易。它还适合当 OCR 回归测试，不适合当“多模态推理”的代表作。

场景文字不等于文档理解。能读 T 恤，不代表能读发票。`,
    links: [
      { rel: "paper", label: "TextVQA", href: "https://arxiv.org/abs/1904.08920" },
      { rel: "homepage", label: "textvqa.org", href: "https://textvqa.org/" },
    ],
  },
  {
    slug: "docvqa",
    name: "DocVQA",
    shortName: "DocVQA",
    accession: "OB-2021-V03",
    year: 2021,
    status: "foundational",
    kind: "benchmark",
    family: "multimodal",
    domains: ["文档 VQA"],
    org: "CVC / IIIT",
    authors: "Mathew, Karatzas, Jawahar",
    summary:
      "工业文档图像上的问答，指标是 ANLS 而不是普通 VQA 准确率。它把 VQA 从自然照片搬到表单、信件、报告，也把训练泄漏变成后来每篇 VLM 论文都要交代的事。",
    origin: `自然场景文字还不够。CVC 和 IIIT 把 VQA 搬到扫描件：表单、信件、报告、发票风格的工业文档。DocVQA 问的是“这一栏填了什么”“日期是哪天”，布局和印刷体 OCR 成为主场。

它是文档智能从检测、识别走向问答的关键一步。ICDAR 时期的文档社区和后来的 VLM 社区，在这套题上第一次大规模碰头。指标没用 VQA accuracy，而用 ANLS——平均归一化 Levenshtein 相似度——因为文档答案对轻微拼写和格式差更敏感。

训练泄漏几乎立刻成为问题。文档图清晰、答案短、网上能下，很多 VLM 的训练配方里明目张胆地含 DocVQA。LLaVA-NeXT 一类工作甚至公开写过加入 DocVQA 以提升 OCR。

所以它现在有双重身份：对文档模型仍是必报栏，对“通用 VLM 零样本”已经很难当干净探针。读分先看你有没有把它当训练集。`,
    architecture: `输入整页文档图像和问题，输出抽取式短答案。主指标 ANLS，对编辑距离做归一化，比精确匹配宽容，比 token F1 更适合长短不一的文档字段。

答案通常是页面上能找到的跨度：金额、日期、姓名、标题。布局理解——双栏、表格、页眉页脚——和 OCR 同样重要。

官方有 val / test 划分，测试标签走评测服务器。很多论文只报 val，把头伸进训练过的那一截。划分必须写明。

今天的 VLM 评测常走 lmms-eval 或 VLMEvalKit 的封装，prompt 和抽答案规则与当年 ICDAR 脚本未必一致。同叫 DocVQA，差几个点先对协议。`,
    content: `约五万题，文档是扫描件和拍照件，来源偏工业与历史文件，不是漂亮的数字 PDF。噪声、倾斜、印章、手写批注都有。

问题针对字段和局部内容，多数能在页上找到原文。需要跨页推理或计算的题不是主体，那是后来 InfographicVQA、MPDocVQA 才加重的。

一页可以有多问。图像泄漏会沿着同一文档的多道题扩散，污染分析应按图而不是按题去重。

体裁是文档，不是图表，不是自然场景。ChartQA 的坐标轴和 TextVQA 的路牌，都不在这套视觉习惯里。`,
    format: "文档 VQA",
    metrics: ["ANLS"],
    lineage: { parents: ["textvqa"], children: [], related: ["chartqa"] },
    caveats: `偏 OCR。很多题读对字段就结束，布局推理的比重没有宣传的那么大。

训练泄漏进许多 VLM。把它当零样本多模态能力，需要先证明训练数据没见过这些页。注意 val / test，不要用 val 冒充测试。

ANLS 对近义改写不友好。模型用自己的话复述字段，可能被罚；照抄 OCR 噪声，反而更接近标签。

扫描件分布老。现代数字 PDF、幻灯片、网页打印页，要另找基准。`,
    links: [
      { rel: "paper", label: "DocVQA", href: "https://arxiv.org/abs/2007.00398" },
      { rel: "homepage", label: "docvqa.org", href: "https://www.docvqa.org/" },
    ],
  },
  {
    slug: "chartqa",
    name: "ChartQA",
    shortName: "ChartQA",
    accession: "OB-2022-V04",
    year: 2022,
    status: "contested",
    kind: "benchmark",
    family: "multimodal",
    domains: ["图表"],
    org: "York / NTU",
    authors: "Masry et al.",
    summary:
      "对真实和生成图表做推理，不只是模板 FigureQA。人类题更难，生成题更易；后来 lmms-eval 还抓到它和 LLaVA 训练数据的图像重叠，读分要当污染，不当神迹。",
    origin: `图表理解需要读数和比较，不是看见图里有柱子就说“条形图”。York 和 NTU 的 ChartQA 同时收真实图表和生成图表，配上需要算术和比较的问题，用来替代更早的模板化 FigureQA。

它很快成为 VLM 报告的常驻栏。GPT-4V、Gemini、各种开源 VLM 都报 ChartQA，因为它看起来既视觉又推理：读柱高、比大小、算比例。指标是宽松准确率，数值允许一定相对误差。

争议随后到来。人类写的题和模板生成的题难度差一截，只报总分会让生成题把人类题抬上去。更麻烦的是训练重叠：lmms-eval 的污染分析里，ChartQA 和 LLaVA 训练数据的图像重叠被公开点名，比例高到不能假装没看见。LLaVA-NeXT 自己的博客也写过把 ChartQA 加进训练以提升图表能力。

于是它的地位变成：还在报，但 status 该是 contested。高分先问见没见过这些图，再问报的是 human 还是 augmented。`,
    architecture: `输入图表图像和问题，输出短答案，通常是数字或简短类别。主指标 relaxed accuracy：数值答案在相对或绝对容差内算对，文本答案走匹配。容差规则必须和官方一致，否则几个点的分差毫无意义。

两套题要分开报。human 是人写的，需要更强的读数和推理；generated / augmented 更模板，更容易。只给一个平均分，等于用简单题给难题打掩护。

评测是单图问答，不是把图表还原成数据表再算——虽然中间做成 table 再推理往往更稳。端到端 VLM 把读轴、读图例、读柱高全塞进一次生成。

抽取器很关键。模型答“大约 23%”还是“23”，宽松匹配能不能吃进去，取决于脚本。harness 版本会改分。`,
    content: `9,608 道人类题加 23,111 道生成题。图表类型以柱、线、饼为主，来自真实网页图表和生成管线。真实图有设计噪声，生成图更干净、更模板。

问题覆盖读值、比较、简单计算。复杂的跨图推理和统计假设检验不是主体。它测的是“看得懂这张图”，不是“会做数据分析”。

图像风格多样，但远不是所有统计图形。三维爆炸饼图、双轴、对数坐标、学术论文里的复杂 panel，覆盖有限。

训练重叠发生在图像层。即使问题改写过，见过同一张图仍然是泄漏。去污染要按图哈希，不能只看题面字符串。`,
    format: "图表 QA",
    metrics: ["relaxed accuracy"],
    lineage: { parents: ["docvqa"], children: [], related: ["mathvista"] },
    caveats: `lmms-eval 发现与 LLaVA 训练数据存在高比例图像重叠；LLaVA-NeXT 也公开把 ChartQA 写进配方。看到开源 VLM 在这栏暴涨，先当污染，后当能力。

生成题更易。总分被 2 万道模板题主导时，human 子集才是更诚实的栏。

宽松准确率的容差是超参。换一套脚本，排行榜会重新洗牌。

它不能代表“视觉数学”。MathVista、MathVision 里的几何和竞赛图，比读柱状图难一个数量级。`,
    links: [
      { rel: "paper", label: "ChartQA", href: "https://arxiv.org/abs/2203.10244" },
      { rel: "repo", label: "vis-nlp/ChartQA", href: "https://github.com/vis-nlp/ChartQA" },
    ],
  },
  {
    slug: "scienceqa",
    name: "ScienceQA",
    shortName: "ScienceQA",
    accession: "OB-2022-V05",
    year: 2022,
    status: "foundational",
    kind: "benchmark",
    family: "multimodal",
    domains: ["K-12 科学"],
    org: "UCLA / AI2",
    authors: "Lu et al.",
    summary:
      "带可选图像、讲义和解释的 K-12 科学选择题。很多题其实不需要图；报分务必单报图像子集，否则你测到的是科学知识，不是视觉。",
    origin: `UCLA 和 AI2 想给多模态模型一张带讲解的科学考卷：小学到高中，题可以有图也可以没图，每题还配 lecture 和 explanation。ScienceQA 是知识加图像的早期形态，后来的 MathVista、MMMU 都沿着“学科 + 视觉”往上加年级。

它有一个公开的设计选择，后来变成公开的漏洞：并不是每题都有图，有图的题也不一定必须看图。纯文本模型靠学科知识就能做对相当一部分。于是“ScienceQA 上我们多模态很强”这种句子，经常是在吹语言模型的小学科学。

CoT 和讲义让它同时像教学数据集。训练时把 explanation 喂进去，模型会走捷径背讲解，而不是看图。作为基准和作为训练语料，身份要分开。

今天它更多是历史节点和诊断项。真正要测视觉科学推理，人们会转向必须看图的子集，或者直接去 MMMU 的学科页。`,
    architecture: `选择题，部分题带图。官方有 lecture 和 explanation 字段，评测时通常不把讲解喂给模型，否则变成阅读理解。主指标准确率。

务必单报 img 子集。全量准确率混合了纯文本科学题和真视觉题，前者会抬分。很多论文的细表里其实已经拆开，摘要里却只写一个数。

21,208 题，规模对 K-12 来说够用。科目覆盖自然、社会、语言等，不限于理综。把名字理解成“理科视觉题”会误读覆盖面。

生成解释是原论文的卖点之一。作为评测，解释质量很少被认真打分；作为训练，解释是泄漏讲解的通道。`,
    content: `小学到高中科学为主，也有其他学科题。图像是教材插图、示意图、地图、实验照片，风格接近 AI2D 而不是自然照片 VQA。

无图题占了不可忽视的比例。这些题测的是学科知识和阅读，把它们算进多模态总分，是协议错误。

讲义和逐步解释写得很完整，像教辅。这对做教学模型有用，对做干净评测是诱惑：模型背 explanation 就能装会推理。

选项数不多，猜测基线不低。和 MMMU 的大学四选一相比，知识深度和干扰项质量都更浅。`,
    format: "MCQ ± 图像",
    metrics: ["Accuracy"],
    size: "21,208",
    lineage: { parents: ["ai2d"], children: ["mmmu", "mathvista"], related: ["arc"] },
    caveats: `很多题不需要图。不拆 img 子集的 ScienceQA 分数，不能当多模态证据。

训练集解释会走捷径。用 ScienceQA 训练再在 ScienceQA 上测试，是标准的自己考自己。

K-12 对前沿模型偏易。它解释不了大学学科或多图推理上的失败。

和 ARC 那种纯文本科学推理有重叠。文本强、视觉弱的模型，会在全量上显得比真实视觉能力更好。`,
    links: [
      { rel: "paper", label: "ScienceQA", href: "https://arxiv.org/abs/2209.09513" },
      { rel: "homepage", label: "scienceqa.github.io", href: "https://scienceqa.github.io/" },
    ],
  },
  {
    slug: "mmbench",
    name: "MMBench",
    shortName: "MMBench",
    accession: "OB-2023-V06",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["综合 VLM"],
    org: "Shanghai AI Lab",
    authors: "Liu et al.",
    summary:
      "约三千道多选题、二十个能力维，用循环评测降低选项位置作弊。它是中文圈 VLM 最常报的综合栏之一；GPT 抽取器和 v1 / v1.1 都会改分。",
    origin: `2023 年，主观的指令评测无法扩展，早期 LLaVA 演示很好看，却没法横向比。上海 AI Lab 做 MMBench：大约三千道多选题，切成二十个能力维，用 GPT 从开放输出里抽选项，再用循环评测——把选项轮转，全对才算对——来打位置偏见。

它迅速成为 OpenCompass 体系里的 VLM 主栏，中英都有。国内发模型几乎必报，海外论文也常把它和 SEED-Bench、MME 放在一起当“综合感知”。能力维包括物体、OCR、关系、社会常识等，像一张视觉体检表。

循环评测是它最被记住的方法贡献。很多模型在普通 MCQ 上靠猜第一项或最长项，轮转之后分数会掉。这个掉点本身就是结果。

版本要写。v1 和 v1.1 题有替换，dev / test、中 / 英，四个组合能变出四种不可比的数字。只写 MMBench 不写版本，等于没写。`,
    architecture: `多选题，模型自由生成，再用 GPT 抽取器映射到选项。循环评测要求对选项的所有轮转都选对。主指标准确率，常按能力维拆开。

GPT 抽取器有偏差。生成文风、语言、是否输出思维链，都会影响抽取成功率。换抽取模型或改成规则匹配，排行会动。这是所有“开放输出 + 选择对齐”基准的通病，MMBench 因为用得太广，病得更显眼。

中英两套不是翻译副本那么简单，表现可以不对齐。用英文模型报中文 MMBench，或反过来，要当跨语言结果，不当同一把尺子。

dev 可本地打，test 走服务器或官方工具。泄漏和过拟合优先发生在 dev。`,
    content: `约 3k 题，20 个能力维：物体识别、OCR、空间关系、属性、社会与常识等。题从已有数据和人工构造来，覆盖面宽，单维样本并不多。

图像以自然图和简单设计图为主，不是大学试卷，也不是长视频。它测的是综合感知加轻度推理，不是专家知识。

选项质量参差。有的干扰项很弱，循环评测能挡住位置作弊，挡不住“明显更长的那项就是答案”。

中文题让它在国内套件里不可替代。英文 MMBench 和国际上的 SEED-Bench 有功能重叠，但协议不同，不能互相替代。`,
    format: "MCQ + circular eval",
    metrics: ["Accuracy"],
    lineage: { parents: [], children: ["mmstar", "vlmevalkit"], related: ["seed-bench"] },
    caveats: `GPT 抽取器有偏差。同一模型换抽取提示，分能差出“发表级别”的点。

循环评测会改分数。只报非循环准确率，等于关掉它最有价值的防作弊开关。

v1 vs v1.1、中 vs 英、dev vs test，必须写全。MMStar 后来还指出：这类综合 MCQ 里，有的题不看图也能做，有的已进训练。

三千题摊到二十维，每维很浅。细维第一名常常是噪声。看总分和少数硬维即可，不要过分解读雷达图。`,
    links: [
      { rel: "paper", label: "MMBench", href: "https://arxiv.org/abs/2307.06281" },
      { rel: "homepage", label: "OpenCompass MMBench", href: "https://opencompass.org.cn/mmbench" },
    ],
  },
  {
    slug: "seed-bench",
    name: "SEED-Bench",
    shortName: "SEED-Bench",
    accession: "OB-2023-V07",
    year: 2023,
    status: "active",
    kind: "suite",
    family: "multimodal",
    domains: ["图+视频理解"],
    org: "Tencent ARC",
    authors: "Li et al.",
    summary:
      "腾讯 ARC 的大规模自动生成 MCQ，v1 约 19k，覆盖图像和视频理解维度。可扩展是优点，自动出题伪影和版本分裂是缺点。",
    origin: `腾讯 ARC 想给 LMM 一个可扩展的理解量表，而不是三千题的手工集。SEED-Bench 用自动生成加人类和 GPT 过滤，做出上万道多选题，维度覆盖空间、动作、身份，以及视频时间。v1 大约 19k，后面的 v2 / v2+ 继续加维。

规模是它的卖点。手工标注的 MM-Vet 只有两百来题，MMBench 三千，SEED 直接上万。自动出题让它能铺开维度，也把生成器的审美写进了“标准答案”：有的题看着眼熟，有的干扰项是生成腔。

图像和视频放在同一套件里，这在 2023 年还比较少见。视频维让它和后来的 MVBench、Video-MME 有部分重叠，但 SEED 的视频题仍然偏短、偏生成。

必须写版本。v1 的 19k 和 v2 的维度扩展不是同一张卷。只写 SEED-Bench 分数，读者没法知道你考的是哪一代。`,
    architecture: `多选题，自动生成候选，再经人类和 GPT 过滤。评测是准确率，按维度拆开。视频题通常抽帧，抽几帧是未写明就会吵架的超参。

过滤降低了最离谱的生成事故，消灭不了系统性伪影。生成器和过滤模型来自同一技术世代，会共享盲区：某些视觉关系永远出不来，某些捷径永远删不干净。

套件同时含图和视频。总分把两种模态平均掉的话，视频上的失败会被图像上的满分盖住。至少按模态拆。

和 MMBench 一样面临选项位置和文本捷径。它没有同等强调循环评测，位置偏见要自己小心。`,
    content: `v1 约 19k 题。维度包括空间关系、动作理解、身份、实例计数，以及视频中的时间定位与动作。图像来源广，视频片段短。

自动出题意味着题面模式可被统计。模型如果在相似生成分布上训过，分数会偏乐观。这和人类从教材抠题的 MMMU 不是一种内容生成过程。

视频部分不是长视频理解。三分钟 EgoSchema、一小时 Video-MME 长视频，SEED 覆盖不到。

v2 加维后更像能力地图。维度越多，单维样本和标注一致性越难保证。雷达图好看，误差条往往缺席。`,
    format: "MCQ",
    metrics: ["Accuracy"],
    size: "19k（v1）",
    lineage: { parents: [], children: [], related: ["mmbench"] },
    caveats: `自动出题有伪影。规模大不等于标注精。把 SEED 总分当成精细能力剖面，会高估生成器碰巧擅长的维、低估它不会出的题。

必须写版本。v1 / v2 / v2+ 的题量和维度都在变。

图+视频总分不可解释。视频抽帧设置不写，等于结果不能复现。

和 MMBench 功能重叠。两家都报综合 MCQ，协议和题源不同，差几分不要解读成本质差距。`,
    links: [
      { rel: "paper", label: "SEED-Bench", href: "https://arxiv.org/abs/2307.16125" },
      { rel: "repo", label: "SEED-Bench", href: "https://github.com/AILab-CVC/SEED-Bench" },
    ],
  },
  {
    slug: "mm-vet",
    name: "MM-Vet",
    shortName: "MM-Vet",
    accession: "OB-2023-V08",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["综合能力"],
    org: "NUS / Microsoft",
    authors: "Yu et al.",
    summary:
      "218 道题看六种核心能力的组合，用 LLM 打 0–1 分。孤立 VQA 测不到的技能组合在这里是一等公民；n 小、裁判会改分，是它永远的但书。",
    origin: `NUS 和微软的作者认为，当时的 VQA 把能力切得太碎：OCR 一套、识别一套、知识一套，真实使用却是组合拳——看黑板上的式子、读新闻截图里的梗、识图再算。MM-Vet 只用 218 题，覆盖六种核心能力的 16 种组合，开放生成，LLM 裁判打 0–1。

小而硬，是它的美学。它不追求统计功效，追求“这种题才像人会问的”。笑话、黑板数学、新闻图，题面比 MMBench 的标准 MCQ 更像产品里的用户问题。

代价立刻显现：n=218，方差大；裁判模型一换，排行就抖。后来的 MM-Vet v2 把样本做大一点，并加入图文交错序列，但裁判依赖没变。

圈里把它当定性压力测试，不当主榜。模型卡上只挂 MM-Vet 第一，通常意味着综合 MCQ 上未必赢，只能在这 218 题的组合拳上好看。`,
    architecture: `开放生成，不是选择题。六种能力——识别、OCR、知识、语言生成、空间、数学——组合成 16 种题型。LLM 裁判对照参考答案打 0–1，可含部分分。

裁判是协议的核心超参。GPT-4 当裁判和更弱模型当裁判，分数不能兑。提示词、是否给评分细则，都要锁。

没有选项可猜。这是优点，也让自动化变贵、变脆。精确匹配做不到，因为答案是句子。

样本小意味着错误条大。差两分宣布 SOTA，在这里没有统计意义。最好报多次裁判或人工抽查。`,
    content: `218 题。内容故意杂：幽默图、手写板书、需要外部知识的新闻图、空间关系、简单视觉数学。每题都想触发一种以上能力。

图像不是单一来源数据集，而是作者挑选的“像真实需求”的样本。代表性强不强，取决于你相不相信这 218 个场景。

参考答案是给裁判用的要点，不是唯一措辞。模型用不同的正确说法，应当得分；裁判犯糊涂时，也会把对的判成半对。

不要指望学科覆盖。大学化学、医学影像、长视频，都不在这本小册子里。`,
    format: "开放 + LLM 裁判",
    metrics: ["0–1 score"],
    size: "218",
    lineage: { parents: [], children: ["mm-vet-v2"], related: ["mmmu"] },
    caveats: `n 小、方差大。它是显微镜，不是人口普查。用它做唯一多模态证据，样本不够。

裁判模型会改分。换一代 GPT，历史分数就要重跑。不要把不同裁判下的数字连成趋势。

开放题对提示敏感。同一模型，简答和长篇推理拿回的裁判分可能不同。

组合能力的标注是作者定义的 16 种。现实中的失败模式不会按这 16 格整齐倒下。`,
    links: [
      { rel: "paper", label: "MM-Vet", href: "https://arxiv.org/abs/2308.02490" },
      { rel: "repo", label: "yuweihao/MM-Vet", href: "https://github.com/yuweihao/MM-Vet" },
    ],
  },
  {
    slug: "egoschema",
    name: "EgoSchema",
    shortName: "EgoSchema",
    accession: "OB-2023-V09",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["长第一人称视频"],
    org: "Berkeley",
    authors: "Mangalam, Akshulakov, Malik",
    summary:
      "三分钟 Ego4D 片段上的五千余道五选一，专门考分钟级而不是秒级的第一人称理解。公开子集有答案，全集曾走评测服务器；它和 Video-MME 的第三人称长视频不是一回事。",
    origin: `短视频理解可以靠几帧蒙对。伯克利的 EgoSchema 把证书长度拉到三分钟：片段来自 Ego4D 的第一人称日常活动，问题是五选一，很多必须看完整段而不是看高潮帧。作者称之为证书长度——你到底需要看多长，才能保证答对。

第一人称是关键。头戴相机的视角、手、物体被拿起放下、厨房和客厅的连续操作，和 YouTube 上第三人称剪辑的电影感完全不同。后来的 Video-MME 再长，也大多不是这种自我中心的生活流。

5,063 道题。公开子集带答案，便于本地开发；全集一度走评测服务器，防刷标签。这个双层设计后来被不少视频基准模仿。

它把“长视频”从营销词变成可测的时间尺度。但三分钟仍不是一小时，第一人称也不是所有视频理解。报 EgoSchema 高分，不等于能看完一部电影或一场比赛。`,
    architecture: `输入约三分钟的第一人称视频和一道五选一。评测准确率。公开子集可本地打，隐藏测试需提交。抽帧策略——每秒几帧、均匀还是自适应——会显著改分，必须声明。

证书长度分析是论文方法的一部分：把视频截短，看准确率何时崩溃。这比单独一个总分更能说明模型是在看时间，还是在看封面。

第一人称带来特殊的视觉统计：运动模糊、手遮挡、镜头随走。在第三人称数据上训的视频模型，迁移过来会掉。

五选一猜测基线 20%。长视频题如果信息不足，模型会退回语言先验。文本捷径在视频 MCQ 里同样存在。`,
    content: `日常第一人称活动：做饭、整理、手工、走动。没有精剪，没有配音讲解当捷径，问题针对这段时间里发生了什么、物体去了哪、动作顺序。

视频来自 Ego4D，许可和下载是实际门槛。不能把片段当普通 YouTube 随便转载。评测代码和数据获取要走官方路径。

5,063 这个规模对视频 MCQ 已经算大，但场景仍偏家庭与日常，不是体育、监控、影视。

隐藏测试的存在，意味着你在论文里看到的 SOTA 可能来自服务器提交。本地公开子集上的过拟合，不一定能打过全集。`,
    format: "长视频 MCQ",
    metrics: ["Accuracy"],
    size: "5,063",
    lineage: { parents: [], children: [], related: ["video-mme", "mvbench"] },
    caveats: `隐藏测试。只在公开子集上刷到的数字，不能直接写成 EgoSchema SOTA。

第一人称不等于 Video-MME 的第三人称长视频。两个“长”字，视角、剪辑、时长分布都不同。

抽帧就是评测。8 帧和 64 帧是两种难度。不写帧数的视频分数没有信息。

三分钟证书仍可能被稀疏关键帧打穿。真要分钟级推理，需要看证书长度曲线，不只看总分。`,
    links: [
      { rel: "paper", label: "EgoSchema", href: "https://arxiv.org/abs/2308.09126" },
      { rel: "homepage", label: "egoschema.github.io", href: "https://egoschema.github.io" },
    ],
  },
  {
    slug: "mathvista",
    name: "MathVista",
    shortName: "MathVista",
    accession: "OB-2023-V10",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["视觉数学"],
    org: "UCLA / UW / Microsoft",
    authors: "Lu et al.",
    summary:
      "六千余例视觉数学，来自 28 个旧集加 3 个新集，把几何、图表、函数图收成一张卷。常用 testmini 1000 报分；来源杂、有文本捷径，test 和 mini 不能混。",
    origin: `视觉数学以前散落在几何题、图表 QA、函数图识别里。UCLA 团队把 28 个旧集和 3 个新集收成 MathVista，6,141 例，用来统一量“看见图会不会算”。它是 ScienceQA 往上走、MathVision 往下铺的中间层。

立刻成为 VLM 数学栏的默认出处。模型卡上的 MathVista，多半其实是 testmini 那 1000 题，因为全测试集更大、部分答案不那么方便本地刷。GPT 抽取答案是常用协议，抽取器又一次成为隐式超参。

来源杂是优点也是病。有的子集偏易，有的是老数据集搬家，文本捷径和泄漏风险随源而变。后来 MathVision 明确说自己要补“更真的竞赛图”，就是在嫌 MathVista 还不够硬。

读它要像读套件：总分只是入口，子集和 testmini / test 才是句子里该出现的主语。`,
    architecture: `题型含选择题和自由作答。自由作答常用 GPT 抽取最终数字或选项。主指标准确率。testmini 1000 是社区默认比较集，全测试集 6,141 要另说。

抽取器和答案规范化决定分数。单位、分数形式、对“约等于”的处理，换脚本就换排行。锁 harness 版本。

视觉输入种类多：几何图、统计图、函数图像、表格、科学示意图。模型可能在图表上强、几何上弱，平均分会把这件事洗掉。

文本捷径存在。有的题干已经包含足够数字，不看图也能蒙。这是后来 MMStar、MathVision 要清理的那类脏。`,
    content: `6,141 例，学校几何到论文图都有。三个新集用来补旧集覆盖不到的视觉数学场景，28 个旧集则把 ChartQA、几何题等已有资源重新包装进统一接口。

testmini 是分层抽样的 1000 题，方便快速迭代。它不是随机 1000，也不能外推成“全测试集也会是这个分”。

知识深度从小学图表到大学入门都有，但不是奥赛主场。真竞赛图和更难的证明式视觉题，在 MathVision、OlympiadBench 那边。

语言是英语题干加图。中文视觉数学要另找。OCR 质量对带标注的几何图影响很大。`,
    format: "视觉数学",
    metrics: ["Accuracy"],
    size: "6,141",
    lineage: { parents: ["scienceqa", "chartqa"], children: ["mathvision"], related: ["olympiadbench"] },
    caveats: `来源杂，有的偏易。总分被简单子集拉高时，几何难题上的失败会被掩盖。

test 与 testmini 不同。把 mini 上的 SOTA 写成 MathVista 全量，是常见夸大。

存在文本捷径。不看图的消融应当报，不报就默认你可能在用语言模型做数学。

GPT 抽取会改分。同一批输出，换抽取提示就能制造“进步”。`,
    links: [
      { rel: "paper", label: "MathVista", href: "https://arxiv.org/abs/2310.02255" },
      { rel: "homepage", label: "mathvista.github.io", href: "https://mathvista.github.io/" },
    ],
  },
  {
    slug: "mmmu",
    name: "MMMU",
    shortName: "MMMU",
    accession: "OB-2023-V11",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["大学多学科"],
    org: "OSU / Waterloo",
    authors: "Yue et al.",
    summary:
      "11.5k 大学试卷级多模态题，30 科目，冲着专家级 AGI 风的学科推理，而不是感知 VQA。Val 公开约 900 题，纯文本模型也能靠选项漏做一部分，这正是 MMMU-Pro 要踢掉的东西。",
    origin: `OSU 和 Waterloo 的团队看够了物体识别式 VQA，想要一张大学试卷：艺术、商科、科学、医学、人文、工程，30 个科目，11.5k 题，图是图表、乐谱、化学结构、医学影像、地图。MMMU 把多模态评测的叙事从“看得见”改成“看得懂专业材料”。

它很快成为 VLM 的 MMLU。几乎每张模型卡都有这一栏。验证集约 900 题公开，测试集更大、答案长期不公开，防刷的同时让 val 过拟合变成流行病——谁都在这 900 题上调提示。

文本捷径是从一开始就写在附录里的。纯文本 LLM 基线能靠选项和学科先验做对一部分，说明有的题图像不是必要的。MMMU-Pro 后来系统地把这些题踢掉，并加到十选项、再加视觉截图设定。

专家级这个词要打折。它是大学考试风，不是执业医师或论文审稿。但作为“把学科知识接到视觉输入”的量表，它仍然是这一代的中轴。`,
    architecture: `多为四选一，也有开放填空。输入是题干加一张或多张图。主指标准确率，按学科和科目拆开才有信息。CoT 与否必须声明。

Val 公开，测试答案按官方时间表释放。在答案释放之前，测试分来自提交；释放之后，测试也会开始被训练语料吞。写论文要写你用的是哪一截、哪一天的协议。

图像类型有三十种标注，从乐谱到病理切片。处理医学影像的能力和处理柱状图的能力几乎不该被一个总分概括。

选择题猜测基线 25%。十选项的 Pro 版本把猜测压到 10%。比较 MMMU 和 MMMU-Pro 的掉点，本身就是在量捷径有多大。`,
    content: `11.5k 题，六大学科方向、30 科目。材料来自大学考试、习题和教材，不是网上随便截的梗图。视觉体裁非常杂，这是它比 MMBench 更“像上学”的原因。

验证集约 900，易过拟合。很多“我们在 MMMU 上涨了 3 分”其实是 val 上的提示工程。测试集才是该打的那一栏。

有的题图像只是插图，题干已经能做；有的题图像是唯一信息源。混在一起时，语言模型的学科记忆会冒充视觉理解。

开放题和 MCQ 的评分协议不同。把填空当选择做、或反过来，都会制造假分差。`,
    format: "大学试卷 ± 图",
    metrics: ["Accuracy"],
    size: "11.5k",
    lineage: { parents: ["scienceqa", "mmlu"], children: ["mmmu-pro", "cmmmu"], related: ["mm-vet"] },
    caveats: `纯文本模型也能靠选项漏做一部分。不报 text-only 消融的 MMMU 分数，不知道视觉到底贡献了什么。

Val 约 900，易过拟合。主结果应落在测试集，并写明是否已经答案公开。

学科不均衡。医学和艺术的失败模式完全不同，总分是政治，细表才是诊断。

它仍是考试。真实科研看图、读论文图注、做实验记录，比这更脏、更长、更没有选项。`,
    links: [
      { rel: "paper", label: "MMMU", href: "https://arxiv.org/abs/2311.16502" },
      { rel: "homepage", label: "mmmu-benchmark.github.io", href: "https://mmmu-benchmark.github.io/" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/MMMU/MMMU" },
    ],
  },
  {
    slug: "mvbench",
    name: "MVBench",
    shortName: "MVBench",
    accession: "OB-2024-V12",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["短视频时间"],
    org: "OpenGVLab",
    authors: "Li et al.",
    summary:
      "二十个时间任务、四千题，设计目标是单帧应当失败。图像 MLLM 靠静态捷径在视频上看起来很强，MVBench 就是来拆穿这件事的。",
    origin: `OpenGVLab 在做 VideoChat2 的时候，发现一个让人火大的现象：图像 MLLM 在不少视频基准上看起来还行，因为题其实看一张封面就能做。MVBench 把任务从静态改成动态——动作顺序、移动计数、物体洗牌——并明确要求：单帧基线应当失败。

20 个时间任务、4,000 题，短片段。它不是长视频，是时间敏感性探针。和 EgoSchema 的三分钟第一人称、Video-MME 的短中长分层，构成视频评测的三种尺子。

公开视频源可能泄漏。很多短视频来自已有数据集，训练时见过源视频、评测时只是换了问法，分数会虚高。这是所有“从旧视频集改任务”的基准的共同风险。

圈里把它当“你到底有没有在看帧之间的东西”的体检。高分而单帧消融也高，说明任务被静态捷径打穿了，该回到设计目标上看一看。`,
    architecture: `短视频 MCQ。每个任务类型对应一种时间能力：顺序、计数、方向、物体持续与消失等。主指标准确率，应按 20 个任务拆开。

单帧基线是必做消融。如果只喂中间帧或封面就能得高分，这个任务对视频模型没有区分度。论文不报单帧，等于没证明自己在测视频。

抽帧数、帧率和是否用音频，都是超参。短片段对抽帧更敏感：抽少了看不到变化，抽多了变成图像袋。

任务由静态题改造而来，改造质量决定时间依赖性。有的改造很硬，有的还残留“看物体类别就能答”的口子。`,
    content: `4,000 题，20 种时间任务。视频是短片段，动作明确，不像长视频那样需要检索和摘要。内容包括动作序列、移动计数、物体洗牌这类实验室风格的时间题。

来源是公开视频集的再标注或转换，不是全新拍摄。这让规模上得去，也让泄漏路径清晰：源集在不在你的预训练里。

题是 MCQ，猜测基线视选项数而定。语言先验——“洗牌后面通常是……”——仍可能在没看清的时候救人。

没有一小时长视频，没有第一人称生活流，没有字幕设定。MVBench 只管短时间动态。`,
    format: "短视频 MCQ",
    metrics: ["Accuracy"],
    size: "4,000",
    lineage: { parents: [], children: [], related: ["video-mme", "egoschema"] },
    caveats: `只有短片段。把它的高分说成“视频理解 SOTA”，时长上不成立。

公开视频源可能泄漏。源数据集进了训练，MVBench 就变成记忆加改写。

不报单帧消融，就没有资格说自己测了时间。这是该基准自己立下的规矩。

20 个任务平均分会掩盖某几类时间能力的崩盘。至少看最依赖顺序的那几栏。`,
    links: [
      { rel: "paper", label: "MVBench / VideoChat2", href: "https://arxiv.org/abs/2311.17005" },
      { rel: "repo", label: "Ask-Anything", href: "https://github.com/OpenGVLab/Ask-Anything" },
    ],
  },
  {
    slug: "mathvision",
    name: "MATH-Vision",
    shortName: "MathVision",
    accession: "OB-2024-V13",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["带图竞赛数学"],
    org: "CUHK / Shanghai AI Lab",
    authors: "Wang et al.",
    summary:
      "三千余道真实竞赛题配图，针对 MathVista 偏易、偏合成的那一面。几何向奥赛图是主菜；图质量和 OCR 仍是隐藏分差来源。",
    origin: `MathVista 把视觉数学做成人人必报之后，CUHK 和上海 AI Lab 觉得它还是偏易、偏合成：旧集搬家、图表读数、学校几何，和真的带图竞赛题不是一回事。MATH-Vision 从真实竞赛收了 3,040 道配图题，16 个科目、5 档难度。

它把“视觉数学”重新接到竞赛数学那条线上，和文本 MATH、OlympiadBench 形成对照：同样是竞赛，这里必须看图。几何图、立体图、函数草图，印刷质量和标注习惯都来自真实试卷，不是生成器画出来的干净示意图。

规模小于文本 MATH 的一万二千题，但单题更贵：图要排版、要 OCR、要核对。社区把它当 MathVista 之上的下一档，而不是替代。

闲话是：有的模型在 MathVista 上好看，到了 MathVision 就露出只会读柱状图、不会读竞赛几何的原型。这种掉点比总分更有信息。`,
    architecture: `图加竞赛题，答案是数字、选项或简短表达式。主指标准确率，应按难度和科目拆。OCR 预处理有人做有人不做，必须声明——你测的是端到端看图，还是 OCR 加语言模型。

16 科 5 难度提供分层。只报一个平均分，会把初中几何和高难度竞赛题洗在一起。和文本竞赛集一样，难题上的差异才是前沿。

评测对答案抽取同样敏感。竞赛答案的格式比 ChartQA 的宽松百分数更野，抽取规则要跟官方。

图像分辨率和裁切会影响细线、角标、阴影。扫描件质量是隐式难度。`,
    content: `3,040 道真实竞赛题配图，几何向为主，也有需要读图的代数、组合。图是试卷上的原图，含辅助线、手绘风格印刷、不规则标注。

难度 1 到 5。低难度可能接近常规教材，高难度接近奥赛入门。把所有难度平均，会得到一个对任何模型都不公平的数：对弱模型太难，对强模型被简单题稀释。

没有生成图表那种完美网格。轴可能手标，角度可能靠目测。这正是真实试卷的视觉。

语言以英文整理版为主，原语种竞赛的翻译伪影可能存在。题意含糊时，责任在整理，不在模型——但分数不会自动把这分开。`,
    format: "视觉竞赛数学",
    metrics: ["Accuracy"],
    size: "3,040",
    lineage: { parents: ["mathvista", "math"], children: [], related: ["olympiadbench"] },
    caveats: `图质量和 OCR 会制造假分差。同一模型，高清原图和压缩缩略图可以差出一档。

规模小于文本 MATH。细科目上的排名噪声大，不要过分解读单科第一。

它更难，但仍是短答案竞赛题，不是形式化证明。会填数字不等于会在 Lean 里写证明。

和 MathVista 的重叠题或相似题可能存在。两套都报时，不要把同一技能数两遍。`,
    links: [
      { rel: "paper", label: "MATH-Vision", href: "https://arxiv.org/abs/2402.14804" },
      { rel: "homepage", label: "mathvision-cuhk.github.io", href: "https://mathvision-cuhk.github.io/" },
    ],
  },
  {
    slug: "mmstar",
    name: "MMStar",
    shortName: "MMStar",
    accession: "OB-2024-V14",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["视觉必需"],
    org: "多机构",
    authors: "Chen et al.",
    summary:
      "一千五百道人类筛选题，专门踢掉能不看图做的和已经泄漏进训练的样本。MMBench、MMMU 上那些纯文本可解的题，是它存在的理由。",
    origin: `多模态评测最大的丑闻不是模型差，是题可以不看图。MMStar 的作者用自动过滤加严格人工审查，从两万多候选里筛出 1,500 道：视觉必需、尽量少泄漏、还要有点难度。6 个核心能力、18 个细轴，每维 250 题，平衡得像刻意做给雷达图看的。

他们展示的现象很损：有的 LVLM 不给图像也能在 MMBench / MMMU 上拿到体面分数；有的图像必要题，模型没看图却对了，更像是训练里见过这道题。两种污染——文本可解和题面泄漏——会让“多模态增益”变成假账。

1,500 这个规模很小，这是精英集的代价。它不替代 MMMU 的学科覆盖，只替代“你真的在用眼睛吗”这一问。后来 MMMU-Pro 在大学试卷上做了类似的文本可解过滤，两条线一起把捷径往外踢。

圈里现在的礼貌用法是：综合能力报 MMMU / MMBench，视觉诚实报 MMStar。只报前者，越来越像在回避问题。`,
    architecture: `高质量 MCQ，人工保证每题依赖图像。主指标准确率。6×18 的轴用于诊断，不是让你发 18 个 SOTA 奖杯。

构造过程是先自动粗筛再人工精筛。粗筛用多个 LLM / LVLM 当检查员：纯文本就能稳定做对的剔除，疑似泄漏的剔除。人工再盯视觉依赖和题面质量。

因为刻意留下视觉陷阱，分布和自然用户问题并不相同。它测的是“有没有在看”，不是“好不好用”。

n=1500，比 MM-Vet 大，比 MMMU 小一个数量级。分差的置信区间要当回事，尤其是细轴上每格只有几十题。`,
    content: `1,500 道人类筛选 MCQ。来源是既有基准的净化，而不是全新拍摄。内容覆盖感知、推理、OCR 相关视觉、定位等核心能力，但每道都过了“盖住图你还能不能做”这关。

平衡是设计：每个核心能力 250 题。这让雷达图好看，也意味着它不是自然难度分布——真实世界不会按 18 轴均匀出题。

题更偏视觉陷阱：计数、细差别、必须读图上的关系。语言知识帮不上忙时，模型会显得突然变笨，这是特性。

没有大学专家图的广度，也没有视频。它是图像 MCQ 的净化标本。`,
    format: "MCQ",
    metrics: ["Accuracy"],
    size: "1,500",
    lineage: { parents: ["mmbench", "mmmu"], children: [], related: ["mmmu-pro"] },
    caveats: `很小。18 个细轴上的排名很容易是噪声。看六大能力，别把每一根雷达刺都写成论文贡献。

选择偏向视觉陷阱。真实用户问题里，有的就是靠文本知识，MMStar 会系统性低估“合理使用世界知识”的模型。

净化过的题仍可能随时间泄漏。精英集一旦公开，就会开始进入下一轮训练数据。

它不测量学科专家能力。别用 MMStar 替代 MMMU，也别用 MMMU 替代 MMStar。`,
    links: [
      { rel: "paper", label: "MMStar", href: "https://arxiv.org/abs/2403.20330" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/Lin-Chen/MMStar" },
    ],
  },
  {
    slug: "mmt-bench",
    name: "MMT-Bench",
    shortName: "MMT-Bench",
    accession: "OB-2024-V15",
    year: 2024,
    status: "active",
    kind: "suite",
    family: "multimodal",
    domains: ["大规模多任务"],
    org: "OpenGVLab 等",
    authors: "Ying et al.",
    summary:
      "约三万一千题、约三十个元任务，从驾驶到 GUI，一个箱子装尽量多的模态任务。广度是卖点，质量不均和名字撞车是使用时要注意的。",
    origin: `OpenGVLab 想做一个箱子，把尽量多的多模态任务装进去：不只是 VQA，还有驾驶、GUI、遥感、时间，各种元任务。MMT-Bench 大约 31k 题，GPT 辅助出成 MCQ，带 val / test。它是“大规模多任务”美学，和 MMStar 的精英小集正好相反。

广度让它适合当体检套件：模型在 GUI 上翻车、在驾驶上翻车，雷达图会说话。坏处是质量不均——有的元任务标注精，有的像是为了把维度凑满。名字里的 MMT 还和别的 MMT 撞车，检索论文时会搜到不相关的东西。

GPT 辅助 MCQ 再次引入生成器偏见。自动选项、自动改写，能上规模，也会留下生成腔和弱干扰项。

它很少单独成为模型卡唯一多模态栏，更常作为 OpenGVLab 系论文里的宽表。读的时候按元任务看，不要只看一个超平均。`,
    architecture: `多任务 MCQ，val / test 划分。主指标准确率，应按元任务拆。GPT 辅助构造意味着抽取和选项生成都可能经过 LLM。

三十来个元任务的动作空间并不统一：有的是识别，有的是计数，有的接近 GUI 选择。统一成 MCQ 是为了好评测，代价是把生成、定位、回归类任务压成选择。

规模 31k 对评测友好，对泄漏不友好。题越多，和预训练重叠的期望值越高。去污染几乎不可少，却很少有人认真做。

不要把它当成单一能力的压力测试。它是面板，不是探针。`,
    content: `约 31k 题，元任务从驾驶场景、GUI 截图到更传统的视觉问答都有。覆盖极宽，单任务深度取决于该元任务的来源集。

视觉域跨度大：户外驾驶和软件界面的统计特性几乎不相交。一个模型在自然图上强、在 GUI 上弱，是预期，不是异常。

MCQ 包装会丢掉原任务的评分细节。比如 GUI 任务原本可能看点击坐标，现在变成选描述。技能被翻译过。

测试集应当锁住。只在 val 上调到的“全面领先”，多半是过拟合面板。`,
    format: "多任务 MCQ",
    metrics: ["Accuracy"],
    size: "~31k",
    lineage: { parents: ["mmbench", "seed-bench"], children: [], related: [] },
    caveats: `质量不均。宽表里的第一名，可能赢在几个容易的元任务上。

名字与其他 MMT 冲突。引用时写全名 MMT-Bench 和论文链接，避免文献混乱。

GPT 辅助选项会偏。弱干扰项让猜测变容易，尤其在模型已经很会考 MCQ 之后。

广度替代不了专项。驾驶去驾驶基准，GUI 去 GUI agent，文档去 DocVQA。MMT 总分不能当这些领域的代表。`,
    links: [
      { rel: "paper", label: "MMT-Bench", href: "https://arxiv.org/abs/2404.16006" },
      { rel: "repo", label: "OpenGVLab/MMT-Bench", href: "https://github.com/OpenGVLab/MMT-Bench" },
    ],
  },
  {
    slug: "video-mme",
    name: "Video-MME",
    shortName: "Video-MME",
    accession: "OB-2024-V16",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["长短视频"],
    org: "多机构",
    authors: "Fu et al.",
    summary:
      "900 视频 / 2700 题 / 约 254 小时，短中长都有。综合视频评测的默认出处之一；有没有字幕必须写清，否则你可能在测阅读理解而不是看视频。",
    origin: `视频评测以前要么短、要么第一人称、要么单一来源。Video-MME 想做综合量表：900 个 YouTube 风视频，2,700 道人工题，时长从十几秒到一小时，短、中、长三档，还带字幕和音频轨道，用来看外挂模态到底帮了多少。

它很快成为视频 MLLM 的默认栏。Gemini、GPT、开源视频模型都报它。论文里一个关键观察是：加字幕、加音频，长视频上的增益更明显——翻译成人话，很多“长视频理解”其实是在读字幕。

所以协议有两套：with subtitles 和 without subtitles。官方还要求，有字幕时只使用与抽帧时间对齐的字幕片段，而不是把全片 SRT 一次性贴进上下文。不写设定的 Video-MME 分数，等于没说你考的是哪一科。

YouTube 可用性是实际问题。视频会下架，镜像要自己维护。长视频还会被抽成稀疏帧，于是“看了一小时”常常是“看了几十张幻灯片”。`,
    architecture: `每视频 3 道 MCQ。按时长分层报短 / 中 / 长，再报总体。主指标准确率。务必声明是否给字幕、是否给音频、抽了多少帧。

字幕设定是第一公民。无字幕才接近纯视觉；有字幕会把任务变成多模态阅读。长视频上两者可以差出一大截，把有字幕的数字写进无字幕的比较表，是最常见的作弊式马虎。

抽帧策略决定有效上下文。1 fps 和每段均匀 8 帧，对一小时视频是完全不同的题。音频若被转录成文本再喂进去，又变成第三条捷径。

评测封装在 VLMEvalKit、lmms-eval 里。不同封装的默认字幕开关可能不同，对一下 YAML。`,
    content: `900 视频，约 254 小时，2,700 题。短视频少于约 2 分钟，中等 4–15 分钟，长视频 30–60 分钟，三档各约 300 个视频。内容是 YouTube 风多样：知识、生活、体育、纪录等，第三人称为主。

人工标注，每视频三问，覆盖识别到时间推理。质量比全自动生成的视频 MCQ 稳，但三问无法穷尽一小时内容。

字幕文件不是每条都有，长视频更齐。音频轨道另计。缺字幕的视频在“有字幕设定”里怎么处理，要跟官方。

来源是 YouTube，版权和消失风险是内容的一部分。离线镜像的版本就是你实际评的版本。`,
    format: "视频 MCQ",
    metrics: ["Accuracy"],
    size: "2,700",
    lineage: { parents: [], children: [], related: ["mvbench", "egoschema"] },
    caveats: `字幕设置必须写清。有字幕的高分，经常是阅读理解。无字幕才比较接近“看了视频”。

长视频会被抽帧。声明帧数、采样方式和最大 token。否则一小时只是广告。

YouTube 可用性。下架、地区限制、镜像不同步，都会让复现对不上论文。

第三人称剪辑不等于 EgoSchema 的第一人称生活流，短档也不等于 MVBench 的时间探针。三个视频数字说的不是一件事。`,
    links: [
      { rel: "paper", label: "Video-MME", href: "https://arxiv.org/abs/2405.21075" },
    ],
  },
  {
    slug: "lmms-eval",
    name: "lmms-eval",
    shortName: "lmms-eval",
    accession: "OB-2024-V17",
    year: 2024,
    status: "active",
    kind: "harness",
    family: "multimodal",
    domains: ["LMM 评测运行时"],
    org: "EvolvingLMMs-Lab",
    authors: "Li, Zhang, et al.",
    summary:
      "多模态版 lm-eval：YAML 任务、统一 generate_until，一键跑 MMMU、MMBench、MathVista、Video-MME。它还公开做过训练/测试图像重叠分析，ChartQA 那桩污染就是从这边被翻出来的。",
    origin: `文本侧有 lm-eval-harness，多模态侧曾经是每人一套脚本。EvolvingLMMs-Lab 做 lmms-eval，把 MMMU、MMBench、MathVista、Video-MME 等收成 YAML 任务，接口模仿 lm-eval，让 VLM 评测从“能跑”变成“能对齐”。

它的技术报告还有一刀：用图像 token 的 n-gram 去查训练和评测的重叠。ChartQA、VQAv2、GQA 等和 LLaVA 训练数据的图像重叠被写进论文，社区从此不能再假装没看见。工具型仓库里夹带污染研究，这是它比普通 runner 更值钱的地方。

任务注册超过一百个，版本还在涨，后来加上视频、音频。默认配置会改分：max tokens、解码、是否 CoT、字幕开关，全在 YAML 里。引用分数必须写 commit 和任务名。

它和 VLMEvalKit 是同一生态位的两个运行时。同一基准在两个 harness 上差几个点，先别急着解释模型，先对 prompt。`,
    architecture: `YAML 定义数据集、prompt、生成直到停止、后处理和指标。模型侧实现统一的生成接口。评测对象是任务配置，不只是数据集名字。

generate_until 和温度、beam 这些解码选择会影响开放题。MCQ 看起来确定，抽取规则一变仍会抖。把 YAML 当协议正文。

污染分析是附加模块，不是每次评测默认跑。要复现 ChartQA 重叠那种结论，要走报告里的去污染方法，而不是只跑准确率。

分布式、视频解码、帧采样都在框架里。视频任务的默认 fps 如果和论文不同，Video-MME 就会变成另一题。`,
    content: `100+ 注册任务，覆盖图像、文档、图表、大学试卷、视频等常见 VLM 基准。内容来自原基准，lmms-eval 负责包装，不负责重新出题。

包装会改题面。prompt 模板、选项格式、是否附加“请只输出字母”，都是内容的一部分。两个都叫 mmmu_val 的任务，模板不同就是不同的题。

LiveBench 一类后续也从这套工具长出来，用来对抗静态集污染。harness 和活评测的边界在这里有点模糊，引用时写清楚你跑的是静态任务还是活任务。

文档和默认脚本以 LLaVA 家族为第一公民。其他模型的接口适配质量参差，适配器本身能引入 bug 型分差。`,
    format: "harness",
    metrics: ["取决于任务"],
    lineage: { parents: ["lm-eval-harness"], children: [], related: ["vlmevalkit"] },
    caveats: `YAML 版本会改分。引用时写 commit 和任务名，不要只写“用 lmms-eval 跑的 MMMU”。

默认配置偏某个模型家族时，对别家不公平。核对解码参数和图像预处理。

污染表是抽样方法下的重叠估计，不是法律鉴定。但 ChartQA 这类高重叠，已经足够让人把该栏标成 contested。

harness 分数和官方评测服务器分数可能不一致。DocVQA test、MMBench test 这类，仍以官方协议为准。`,
    links: [
      { rel: "paper", label: "LMMs-Eval", href: "https://arxiv.org/abs/2407.12772" },
      { rel: "repo", label: "lmms-eval", href: "https://github.com/EvolvingLMMs-Lab/lmms-eval" },
    ],
  },
  {
    slug: "mm-vet-v2",
    name: "MM-Vet v2",
    shortName: "MM-Vet v2",
    accession: "OB-2024-V18",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["图文序列"],
    org: "NUS / Microsoft",
    authors: "Yu et al.",
    summary:
      "在 MM-Vet 的组合能力上加入图文交错序列理解，样本更大，裁判还是 LLM 打 0–1。v1 只有单对图文，v2 才开始像真实聊天里连着丢图。",
    origin: `v1 的 218 题全是单图单问。真实多模态聊天却常是：先丢一张图，再丢一张，中间夹着句子，问“这两张有什么关系”。MM-Vet v2 把图文交错序列理解加进去，样本也更大，继续用同一套 LLM 裁判。

这是产品形态上的一次对齐。用户不会每次都开新会话只传一张图。交错序列测的是指代、记忆、跨图比较，而不只是单图组合技能。

它仍然远小于 MMMU。定位还是高质量开放题加裁判，不是学科试卷。v1 的小 n 问题缓解了一点，没有消失；裁判依赖则完全继承。

报 v2 不要吞掉 v1。有的论文只报新序列子集，有的报合计。读表先看 n 和是否包含旧 218。`,
    architecture: `开放生成加 LLM 裁判，分数 0–1。输入可以是交错的图像和文本轮次。裁判看到对话上下文和参考要点。

序列长度、插图数量、分辨率，都比单图设定更吃上下文窗口。窗口不够时，模型不是不会做，是后面的图被截掉了。声明最大图数和 token。

裁判提示要针对多图改：指代“第一张”“左边那张”是否算对，需要细则。沿用 v1 的单图裁判词，会误判序列题。

与 v1 比较时锁裁判模型。换一代裁判造成的涨点，不是 v2 任务被解决。`,
    content: `在 v1 的组合能力题之外，加入交错图文样本：多图比较、序列指令、对话中途插入新图。内容仍偏“像用户会问的”，不偏大学科目。

样本比 218 大，但仍是精选，不是十万级 VQA。每一题的信息密度高，统计功效中等。

图像来源多样，序列结构是新信息。单图很强、多图指代很弱的模型，会在 v2 上露出另一种失败。

没有视频时间轴。交错是多张静图加文本，不是 Video-MME。`,
    format: "开放 + 裁判",
    metrics: ["0–1 score"],
    lineage: { parents: ["mm-vet"], children: [], related: ["mmmu"] },
    caveats: `仍小于 MMMU。学科覆盖和统计功效都不够当主榜。

依赖裁判。多图题的部分分更主观，人工抽查比例应当提高，而不是降低。

上下文截断会伪装成能力失败。先确认图是否都进了模型，再讨论交错理解。

与 v1 分数不可直接纵向比较，除非明确同一裁判、同一子集。`,
    links: [
      { rel: "paper", label: "MM-Vet v2", href: "https://arxiv.org/abs/2408.00765" },
      { rel: "repo", label: "yuweihao/MM-Vet", href: "https://github.com/yuweihao/MM-Vet" },
    ],
  },
  {
    slug: "mmmu-pro",
    name: "MMMU-Pro",
    shortName: "MMMU-Pro",
    accession: "OB-2024-V19",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["更硬大学多模态"],
    org: "OSU / Waterloo",
    authors: "Yue et al.",
    summary:
      "从 MMMU 里过滤纯文本可解的题，选项加到十个，并提供把整页卷子截成图的 vision 设定。对应 MMLU-Pro 的硬化思路：逼模型真的去看。",
    origin: `MMMU 成了默认栏之后，作者自己也知道捷径在哪：纯文本 LLM 能做对一部分，四选一太好猜，用户真实场景里还常常直接截一张题图丢进来。MMMU-Pro 分三步硬化——用多个强 LLM 做 text-only 过滤，专家加 GPT-4o 把选项扩到十个，再让人在不同屏幕环境下把题截成图或拍照，做成 vision-only 输入。

这是和 MMStar 平行的打假。MMStar 在综合感知题上踢文本可解；Pro 在大学试卷上做同样的事，并且额外考“图文已经印在同一张截图里”的整合能力。模型在标准设定掉一截、在 vision 设定再掉一截，是论文里反复出现的故事。

总体常报标准十选项和 vision 的平均。人类专家仍远高于早期模型，随机猜测大约 12.6%。和 MMLU-Pro 一样，名字里的 Pro 不是营销，是把捷径关小。

后续还有选项错位、增广错误的勘误。用 Pro 必须锁数据集版本，不能假设 2024 年 9 月的那份永远干净。`,
    architecture: `三种常用设定：standard 4 选项（对照）、standard 10 选项、vision 截图。主结果一般是 10 选项加 vision。准确率。CoT 与否要声明。

Text-only 过滤协议是：四个开源强 LLM 各试多次，稳定能做对的题剔除。剩下的题被认为视觉必要。过滤得越狠，留下的题越偏视觉陷阱和真看图，分布也越不自然。

Vision 设定不把题干预先喂进文本框，模型必须在像素里完成阅读加看图。这同时测 OCR、排版、多栏和学科。截图字体、背景、拍照透视，都是难度的一部分。

10 选项经过人工和模型增广，干扰项更像真的。增广质量问题会直接变成错题，官方后来修过若干。`,
    content: `同学科目，更硬协议。题仍是大学材料：图表、结构式、乐谱、医学影像，但文本可解的被踢掉，选项更长更绕。

Vision 子集是把题面嵌进屏幕截图或照片，字体、壁纸、边框各异，模仿“我拍了屏幕问你”。对 OCR 强的模型友好，对只会吃干净数字题干的模型不友好。

标准十选项里，选项顺序打乱，image 占位符和图像槽的对应必须按官方脚本对齐。自己写 dataloader 很容易把图配错，造成离奇低分。

它不是新科目。不会突然出现 MMMU 没有的法学或体育。难在协议，不在换专业。`,
    format: "MCQ / 视觉截图",
    metrics: ["Accuracy"],
    lineage: { parents: ["mmmu"], children: [], related: ["mmstar", "mmlu-pro"] },
    caveats: `截图 OCR 会干扰“纯视觉”。Vision 设定测的是读屏加看图，不是无文字的纯感知。OCR 很强的模型会在这一栏显得更“多模态”。

与原版 MMMU 分数不能直接比。掉点里有过滤、有十选项、有 vision，三项要拆开归因。

数据集修过选项错位。锁 Hugging Face 版本和官方脚本。

过滤后的题更偏视觉必要，可能低估擅长学科语言推理的模型。这是打假的代价，不是意外。`,
    links: [
      { rel: "paper", label: "MMMU-Pro", href: "https://arxiv.org/abs/2409.02813" },
      { rel: "homepage", label: "MMMU 主页 Pro 页", href: "https://mmmu-benchmark.github.io/" },
    ],
  },
  {
    slug: "lmsys-vision-arena",
    name: "Vision Arena",
    shortName: "Vision Arena",
    accession: "OB-2024-V20",
    year: 2024,
    status: "live",
    kind: "leaderboard",
    family: "multimodal",
    domains: ["视觉对话偏好"],
    org: "LMArena",
    authors: "Chiang, Zheng, et al.",
    summary:
      "带图上传的成对人类投票，Bradley-Terry / Elo 出分。它是偏好活榜，不是固定 n 的感知测试集；风格好看的模型会占便宜，复现只能复现统计，不能复现那一批图。",
    origin: `静态 VQA 饱和之后，LMSYS 把 Chatbot Arena 的那套成对投票搬到带图对话：用户上传图，两个匿名模型作答，人点哪个更好。Vision Arena 测的是野外偏好，不是 MMMU 那种试卷正确性。

提示分布会变。今天用户爱拿截图问作业，明天爱拿梗图问笑话，后天爱拿菜单问翻译。活榜的对象是移动的用户群，不是冻结的 11.5k 题。这是它相对静态集的诚实，也是不可复现的根源。

论文血统写在 Chatbot Arena 那篇上。方法是 Bradley-Terry，分数是 Arena score，置信区间和对战次数绑定。样本少的新模型会上下跳，这不是能力忽闪，是统计。

圈里爱把它和 WebDev Arena 一类并列：人说好用的，和考卷第一的，经常不是同一个。产品要看 Arena，论文要看 MMMU，两栏都报才完整，用一栏打另一栏是打派仗。`,
    architecture: `成对盲选，拟合 Bradley-Terry / Elo 类模型，得到相对强度。没有准确率，没有标准答案。提示、图像、投票都来自自愿用户。

控制变量几乎不存在。用户自带图、自带口味、自带语言。风格讨好——更长、更礼貌、更会画重点——会赢投票，即使事实更错。这是偏好评测的老问题，图像对话里同样发生。

活。每天都有新对战，排行会动。引用必须写截止日期和对战量。把某天的第一写成“视觉能力 SOTA”，缺了时间和样本这两个坐标。

它不能当固定 n 复现。你无法把同一批图重新喂给新模型得到同一张表，只能近似地再收集。`,
    content: `用户野外图像和提示：截图、照片、作业、梗图、设计稿，什么都有。分布跟随哪一类用户愿意打开 arena 上传图，偏极客、偏英语、偏有趣，是预期偏差。

不是感知压力测试。难的计数、细小 OCR、对抗性视觉，用户不一定会出。他们会出“帮我看看这道题”“把这张图讲笑话”。

没有标签。对，是偏好的对，不是事实的对。幻觉得自信的回答可能赢过谨慎但正确的回答。

和文本 Arena 共享同一套产品哲学。图像只是把模态打开，没有把评测变成基准数据集。`,
    format: "成对投票",
    metrics: ["Arena score"],
    lineage: { parents: ["lmarena"], children: [], related: ["webdev-arena"] },
    caveats: `风格偏差。好看、会捧、会长篇，容易赢。事实性要另测 SimpleVQA、MMMU。

不可当固定 n 复现。不是一套题，是一条流。昨天的榜和今天的榜，用户群已经变了。

不是感知压力测试。MMStar 那种视觉必需陷阱，这里不一定会出现。别用 Arena 第一证明“真的在看图”。

投票量不足的模型分数会抖。看区间，看对战数，不要看点估计的小数点。`,
    links: [
      { rel: "leaderboard", label: "lmarena.ai", href: "https://lmarena.ai" },
      { rel: "paper", label: "Chatbot Arena", href: "https://arxiv.org/abs/2403.04132" },
    ],
  },
  {
    slug: "simplevqa",
    name: "SimpleVQA",
    shortName: "SimpleVQA",
    accession: "OB-2025-V21",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["多模态事实"],
    org: "M-A-P / 北航",
    authors: "Cheng et al.",
    summary:
      "双语短答案事实题，对应文本 SimpleQA：图里锚定的客观常识，不靠谜题也不靠选项。名字叫 Simple，对模型并不简单；F 分依赖 LLM 裁判。",
    origin: `文本世界被 SimpleQA 打过一枪：短事实、难幻觉、不能靠选择题蒙。M-A-P 和北航把这件事搬到多模态——图上能看见的、或必须结合图才能确定的客观事实，中英大约各半，2025 题，LLM 裁判打 F 分。

它针对的是 VLM 的另一张脸：综合 MCQ 很高，一问图里这个牌子、这座楼、这个物种，就开始编。SimpleVQA 不考奥赛几何，考你看见图之后会不会老老实实说对、会不会承认不知道。

双语是明确设计。中文事实和英文事实的来源、实体分布不同，只报英文等于没测中文用户会碰到的幻觉。这对国内模型卡是少见的、该有的一栏。

“Simple”对模型并不简单。人类觉得一眼能答的，模型会在实体、年份、数量上滑倒。这和 GAIA 的哲学相似，只不过这里工具不是必须，眼睛和世界知识才是。`,
    architecture: `短答案，不是 MCQ。LLM 裁判对照参考要点给分，再汇总成 F 分一类的综合指标——既罚胡编，也考虑是否答到点上。裁判模型和提示必须锁。

2025 题，中英约各半。语言拆开报。翻译题干但不换实体，会把跨语言事实记忆测歪。

图像锚定意味着答案应当能在图中找到依据，或由图中实体索引到唯一事实。纯文本就能答的题如果混进来，就退化成 SimpleQA 的插图版。构造时作者强调图是必要的。

没有选项，猜测通道被关掉。拒答和胡编会走不同的惩罚，细则看官方。把拒答全算错，会惩罚诚实的模型。`,
    content: `图中锚定的客观常识：识别实体再问一个可核验的事实，或直接读图中的事实性信息。不是脑筋急转弯，不是视觉谜题。

中英各半，实体和题源跟着语言走。中文题会碰到中国地理、文化、产品，英文题则是另一套实体长尾。这是内容，不是同一套题的翻译。

规模 2,025，和 SimpleQA 一样走小而干净。单题错误对总分可见，标注质量必须高。

会过时。事实会变，实体会改名。活的事实基准需要维护，静态 2025 题会慢慢变成历史常识。`,
    format: "短答案",
    metrics: ["F-score"],
    size: "2,025",
    lineage: { parents: ["simpleqa"], children: [], related: ["mmmu"] },
    caveats: `依赖裁判。换裁判模型，F 分会动。和 MM-Vet 同一类脆弱，只不过题是事实不是组合技能。

“Simple”对模型并不简单，对人类也不应再做成很难的谜。如果未来修订把题变难，名字和构造目标就会分叉。

事实会过期。引用要写数据集版本。被训练数据背下来的实体，会让后来的模型看起来更诚实，其实是更熟。

它测事实性，不测推理、不测 OCR 极限、不测长视频。别用这一栏概括多模态。`,
    links: [
      { rel: "paper", label: "SimpleVQA", href: "https://arxiv.org/abs/2502.13059" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/m-a-p/SimpleVQA" },
    ],
  },
  {
    slug: "mm-browsecomp",
    name: "MM-BrowseComp",
    shortName: "MM-BrowseComp",
    accession: "OB-2025-V22",
    year: 2025,
    status: "active",
    kind: "benchmark",
    family: "multimodal",
    domains: ["多模态深搜", "图像", "视频"],
    org: "MMBrowseComp 团队",
    authors: "Li et al.",
    summary:
      "BrowseComp 的看图看视频版：题干或解题路径里必须碰到图像或视频，纯文本搜索不够。初版二百二十四道手写难题，2026 年 1 月扩到四百。发布时带工具的 o3 也没超过大约 30%。",
    origin: `BrowseComp 把深搜做成了 2025 年的时尚，但证据全是文字。网页上的关键信息经常写在图里、嵌在视频某一帧。MM-BrowseComp 2025 年 8 月放出初版 224 道手写多跳题，明确要求解题依赖图像或视频模态；题干本身也常常带着图。arXiv 同期挂出，后来有过 ICLR 投稿记录。

发布评测很惨。带工具的 OpenAI o3 大约 29%，其他流行 agent 很多过不了 10%。作者还给每题准备了核验清单，用来拆“卡在找图、卡在看懂、还是卡在把视觉证据接回文本事实”。

2026 年 1 月 2 日数据集扩到 400 题。和原 BrowseComp 一样有金丝雀字符串，题面加密，防止模型直接把答案搜出来。它不是把 BrowseComp 配上插图，是把“眼睛”变成深搜的必要工具。`,
    architecture: `短答案，路径上必须出现视觉证据。纯文本浏览基线被预期失败，这是题的筛选条件。主指标准确率；清单让你可以做过程诊断，不只有对错。

agent 需要浏览器加视觉能力，有的还要视频关键帧。把页面 HTML 转成纯文本再搜，是在用错误的受试者。多模态模型和工具浏览器的组合必须写清。

加密和金丝雀是为了降低“答案被爬进语料”和“评测时直接检索标准答案”。不能消灭截图传播。

224 和 400 是两版题量。引用写你跑的是哪一份 JSONL。`,
    content: `题是多跳深搜，中间至少有一跳在图或视频里。可能是识别某段视频里的物体再追查来源，可能是读一张页面截图上的关键数字，可能是题干里直接给一张必须看懂的图。

初版 224，后来 400。增量不是简单复制文本题，是继续按“视觉必要”筛。清单列出关键步骤，方便分析是检索失败还是视觉失败。

没有固定语料。活网加视觉，比 BrowseComp 更不可复现：视频下架、图床失效、页面改版，轨迹全改。

语言以英语网页为主。不要当成中文多模态检索榜。`,
    format: "短答案 + 多模态浏览",
    metrics: ["Accuracy", "清单过程分"],
    size: "初版 224；2026 年 1 月 400",
    lineage: {
      parents: ["browsecomp"],
      children: [],
      related: ["browsecomp-plus", "simplevqa", "webvoyager"],
    },
    caveats: `活网加视频，复现性比文本 BrowseComp 更差。某一天的 30% 不能当永恒 SOTA。

视觉必要是设计，如果未来扩题时混进纯文本可解的题，名字和构造就会分叉。看你用的那一版筛选说明。

带工具的 o3 的 29% 是初版 224 的快照。扩到 400 之后要用新表。加密防的是直接搜答案，防不了训练期见过同款截图。`,
    links: [
      { rel: "repo", label: "GitHub", href: "https://github.com/MMBrowseComp/MM-BrowseComp" },
    ],
  },
];
