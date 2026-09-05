import type { Benchmark } from "@/lib/types";

export const chinese: Benchmark[] = [
  {
    slug: "xnli",
    name: "XNLI",
    shortName: "XNLI",
    accession: "OB-2018-Z01",
    year: 2018,
    status: "foundational",
    kind: "benchmark",
    family: "chinese",
    domains: ["跨语言 NLI"],
    org: "Facebook AI",
    authors: "Conneau et al.",
    summary: `把 MultiNLI 的开发集和测试集译成十四种语言，再配上原来的英语，做成十五语的蕴含、矛盾、中立三分类。它是编码器时代跨语言迁移的标准件，不是给指令模型出的聊天考卷。翻译伪影从第一天就写在说明书里。`,
    origin: `
2018 年以前，跨语言评测基本是各写各的小集，语言一换协议就散。Facebook AI 的 Conneau 等人把英语 MultiNLI 的开发集和测试集专业翻译成十四种语言，英语原版留下，凑成十五语的自然语言推理。论文的野心很明确：给 mBERT 这类多语编码器一张能横向比较的卡。

设计设定是英语上训、目标语上测。说人话就是：你在英语里学会判断两句话是蕴含、矛盾还是中立，然后把这套判断力迁到中文、阿拉伯语、斯瓦希里语上去。这跟后来「用中文考卷测中文模型」完全不是一条路。

XNLI 很快被 XTREME 收成句对分类的主柱，也成了 CLUE 里 OCNLI 的英语远亲。很多人后来在模型卡上写「我们测了 XNLI」，其实跑的是编码器微调，不是零样本聊天。

今天再拿它给指令模型报分，等于用 2018 年的翻译句对去衡量 2025 年的助手。它该进标本柜，不该再当中文能力的主量表。
`,
    architecture: `
任务是标准三分类：前提加假设，标签为蕴含、矛盾、中立。指标几乎一律报准确率。官方协议强调零样本跨语言迁移：英语有带标签训练数据，其他语言只有开发/测试。

十五种语言覆盖印欧、汉藏、亚非、尼日尔-刚果等语系，中文是其中一员而不是中心。每语开发集约 2490 条，测试集约 5010 条，规模在当年算大，在今天的考试套件面前算中等。

评测形态是句对分类，不是生成。编码器时代用 [CLS] 头；后来有人硬套成生成式选择题，分数和原协议对不上。跨框架对比必须写清是微调、线性探测还是 loglikelihood 选题。

它测的是「推理标签能不能随语言走」，不测写作、工具或文化知识。中文子集里仍能看到英语句式的影子，这是翻译基准的宿命，不是模型突然不会中文。
`,
    content: `
题面来自 MultiNLI 的多类型语体：虚构、电话、旅行、政府文件一类，再被译成目标语。标签跟着英语走，所以你看到的「中文 NLI」其实是「英语推理的中文外壳」。

三种关系里，中立最容易被翻译带偏。英语里模棱两可的假设，译成中文后语气变硬，模型会当成蕴含或矛盾。文献里反复提过这类伪影，不是圈内传闻。

语言名单包括法语、西班牙语、德语、希腊语、保加利亚语、俄语、土耳其语、阿拉伯语、越南语、泰语、中文、印地语、斯瓦希里语、乌尔都语，外加英语。低资源和非拉丁文字更难，中文并不是最难的那一档。

不要把它理解成中国新闻或高考阅读。里面没有公务员、中医或中国法律。要测那些，得去 C-Eval、CMMLU 或 INCLUDE 的地方试卷。
`,
    format: "NLI",
    metrics: ["Accuracy"],
    lineage: { parents: ["glue"], children: ["xtreme"], related: ["clue"] },
    caveats: `
翻译基准会把源语言的文化前提和句法习惯一起搬过去。中文分好看，可能只是模型会做英语 NLI，再碰巧读得懂译文。

它不是指令模型评测。把 XNLI 准确率写进聊天模型技术报告，等于用句对分类冒充对话能力。协议是编码器微调或零样本迁移，和 MT-Bench、AlignBench 不是一类东西。

十五语听起来全，对中文单独分析时样本量并不夸张。开发集约两千多条，调参一过就容易过拟合。报中文分请单独声明拆分和训练设定。

XTREME 把它收进去之后，很多人只报套件总分，中文 NLI 的失败被平均掉。看迁移，要看单语，不要只看宏平均。
`,
    links: [
      { rel: "paper", label: "XNLI", href: "https://arxiv.org/abs/1809.05053" },
      { rel: "repo", label: "facebookresearch/XNLI", href: "https://github.com/facebookresearch/XNLI" },
    ],
  },
  {
    slug: "clue",
    name: "CLUE",
    shortName: "CLUE",
    accession: "OB-2020-Z02",
    year: 2020,
    status: "foundational",
    kind: "suite",
    family: "chinese",
    domains: ["中文 NLU"],
    org: "CLUE",
    authors: "Xu et al.",
    summary: `中文版 GLUE：新闻分类、阅读理解、指代、NLI、成语填空等九项左右的原创中文 NLU 套件。它是预训练时代的中文总卡，BERT 系很快打穿，今天只适合当史前史和诊断子任务。`,
    origin: `
2018 年 GLUE 把英语 NLU 收成一张榜，中文这边还在各报各的情感分析和阅读理解。Xu 等人在 2020 年推出 CLUE，明确对标 GLUE：用原创中文文本，而不是把英语任务再译一遍。社区驱动、公开榜、测试集标签不公开，这套仪式都学过来了。

它解决的是预训练编码器要不要在中文上单独证明自己。RoBERTa-wwm、MacBERT、ERNIE 那些名字，早期成绩单几乎都写着 CLUE。没有这张卡，中文预训练会继续各说各话。

BERT 时代结束得很快。分类和阅读被刷到接近人类上限之后，CLUE 作为难度标尺就死了，跟 GLUE 被 BERT 打死是同一出戏。它没有因此消失：OpenCompass 里仍能见到它的子任务，当作「中文基本功还在不在」的体检。

后续谱系很清楚。FewCLUE 把它改成少样本；SuperCLUE 把它的名字借去测聊天和对战；C-Eval 则彻底换成考试选择题。CLUE 是中文评测的史前层，不是大模型时代的主量表。
`,
    architecture: `
典型成员包括 TNEWS 新闻分类、IFLYTEK 应用描述分类、AFQMC 蚂蚁金融语义相似、OCNLI 中文 NLI、CMRC 阅读抽取、CHID 成语填空、CSL 论文摘要判别、CLUEWSC 指代消解。有的版本还带 C3 等多选阅读。

多数任务是单句或句对分类，阅读理解走跨度抽取或选择。总分是各任务主指标的宏平均。官方提供评测服务器，测试标签不公开，防止直接刷测试集。

协议是微调编码器，不是零样本生成。把 ChatGLM 的对话输出去对 TNEWS 标签，和原论文数字不可比。OpenCompass 若把它当诊断子任务，通常会改成生成或 loglikelihood，必须写配置。

套件内部难度差很大。分类早就饱和，成语填空和指代还能露出一点中文特有的坑。只报总分，等于用已经做满的任务把还没做满的任务稀释掉。
`,
    content: `
文本是原创中文，不是 XNLI 那种译文。新闻标题、应用商店描述、金融句对、儿童读物阅读、学术摘要、带成语的完形填空，覆盖的是 2019 年前能公开拿到的中文标注资源。

CHID 很中文：成语必须靠上下文和文化习惯，不是翻译能造出来的。CLUEWSC 是 Winograd 风格的中文指代。OCNLI 则是中文原生的 NLI，用来对照 XNLI 的翻译路线。

题不涉及高考、法考或大学专业课。那是 C-Eval / CMMLU 的地盘。CLUE 测的是「会不会中文 NLU」，不是「会不会中国考试」。

标注来自众包和已有竞赛，质量在当年够用，今天看起来有些标签偏吵。饱和之后，噪声比难度更影响排名，这是所有老 NLU 套件的通病。
`,
    format: "NLU 套件",
    metrics: ["任务相关宏平均"],
    lineage: { parents: ["glue"], children: ["fewclue", "superclue", "c-eval"], related: ["xnli"] },
    caveats: `
对当代 LLM 完全饱和。再用 CLUE 总分宣称「中文理解 SOTA」，是把 2020 年的尺子拿来量 2026 年的模型。BERT 系就已经打穿，decoder-only 再刷一次没有信息量。

官方协议是微调，不是聊天。零样本或少样本生成式分数，不能和当年榜单上的数字兑。有人把 CLUE 子任务塞进 OpenCompass 当诊断，可以，但要声明喂法和抽取规则。

测试集长期不公开标签，这是 GLUE 式防作弊，不是 gated 考试。不要和 C-Eval 早期的测试集隐藏混为一谈。

名字后来被 SuperCLUE 继承，两套东西不是升级关系。CLUE 是 NLU 套件，SuperCLUE 是对话、对战和月报。引用时写全称，避免读者以为还在刷新闻分类。
`,
    links: [
      { rel: "paper", label: "CLUE", href: "https://arxiv.org/abs/2004.05986" },
      { rel: "repo", label: "CLUEbenchmark/CLUE", href: "https://github.com/CLUEbenchmark/CLUE" },
      { rel: "homepage", label: "CLUEbenchmarks.com", href: "http://www.CLUEbenchmarks.com" },
    ],
  },
  {
    slug: "xcopa",
    name: "XCOPA",
    shortName: "XCOPA",
    accession: "OB-2020-Z03",
    year: 2020,
    status: "foundational",
    kind: "benchmark",
    family: "chinese",
    domains: ["因果常识", "多语"],
    org: "Cambridge 等",
    authors: "Ponti et al.",
    summary: `把 SuperGLUE 里的 COPA 因果常识题译成十一种类型多样的语言，每语五百道测试。它想测跨语言常识迁移，而不只是把英语 NLI 再译一遍。题量很小，是编码器时代的探针。`,
    origin: `
COPA 在 SuperGLUE 里是那道著名的因果二选一：给前提，选更合理的原因或结果。Ponti 等人觉得跨语言评测老在翻译 NLI，常识这条线几乎没人碰，于是做成 XCOPA。语言选择故意走类型多样，而不是只拣和英语像的。

动机说人话就是：模型会不会在泰语、斯瓦希里语、中文里判断「因为下雨所以地湿」，而不只是在英语句对上做蕴含。它和 XNLI 是亲戚，但题型更窄、更依赖世界知识。

它被 XTREME 一类套件当作常识探针收进去，却从来不是主量表。五百道测试听起来整齐，统计方差很大，排行榜上的小数点没有表面那么稳。

今天的多语考试集（M3Exam、INCLUDE）走的是地方试卷，不再靠翻译 COPA。XCOPA 该当对照标本：看看早期社区如何用小而干净的因果题冒充「跨语言常识」。
`,
    architecture: `
每条样本是前提加两个候选，任务是选原因或选结果，二分类准确率。英语原版 COPA 只有四百道，XCOPA 把测试扩到每语五百，并配上翻译后的训练/开发，方便做目标语微调对照。

语言大约十一到十二种（含英语对照），覆盖孤立语、黏着语、声调语言等。中文是其中之一。官方关心的是零样本跨语言：英语微调，目标语直测。

评测对编码器是句对打分或分类头；对生成模型常被改成「输出 A 或 B」。两种协议分数不能兑。题太短，prompt 里一个标点都能把准确率拽歪。

因为每语只有五百测试，bootstrap 区间不窄。论文里的跨语言模型对比，差两三个点往往在噪声里。不要用 XCOPA 单独给中文模型排座次。
`,
    content: `
题面是短句因果：某件事发生了，两个看似通顺的后续里只有一个符合常识。内容来自 COPA 的日常情景，不是专业课，也不是中国社会特有的因果。

翻译质量是这条基准的命门。因果判断对连接词和语序敏感，「所以」和「因为」一旦译飘，标签就可能跟着错。作者用专业翻译加校验，仍避免不了少量别扭句。

中文题读起来像翻译腔短句，不像母语者会出的脑筋急转弯。它测的是「常识标签能不能随语言走」，不是「中国人觉得这件事合理不合理」。

没有图像、没有多轮、没有工具。就是一句话加两个选项。简单是优点，也是它迅速被考试套件取代的原因。
`,
    format: "因果选择",
    metrics: ["Accuracy"],
    lineage: { parents: ["superglue"], children: ["xtreme"], related: ["xnli"] },
    caveats: `
规模极小。每语五百道，再按原因/结果切开更小。用它宣布跨语言常识突破，统计上站不住。

这是编码器时代产物。原协议不是指令遵循，也不是思维链。生成式模型「选 A」的准确率，和 mBERT 微调不是同一把尺子。

翻译伪影仍然在。短句里一个连词译错，整题作废。看中文分之前，先抽几条原文对照。

不要和后来的中文常识或高考物理因果题混报。XCOPA 的「中文」是 COPA 的译文，不是中国课程。
`,
    links: [
      { rel: "repo", label: "cambridgeltl/xcopa", href: "https://github.com/cambridgeltl/xcopa" },
    ],
  },
  {
    slug: "xtreme",
    name: "XTREME",
    shortName: "XTREME",
    accession: "OB-2020-Z04",
    year: 2020,
    status: "foundational",
    kind: "suite",
    family: "chinese",
    domains: ["跨语言 NLU"],
    org: "Google Research",
    authors: "Hu, Ruder, et al.",
    summary: `九项任务乘四十种语言的跨语言套件，给 mBERT 和 XLM-R 发一张总卡。分类、结构预测、问答、检索都在里面，中文只是四十语之一。仓库后来归档，后继是 XTREME-R。`,
    origin: `
2020 年，多语编码器刚开始被当成一回事，评测却还散落在 XNLI、NER、问答各自的论文里。Google Research 的 Hu、Ruder 等人把九项任务、四十种类型多样的语言收成 XTREME，明确问：英语上微调，其他语言零样本能迁多远。

它不是中文基准，是「中文作为多语之一」的基准。把 XTREME 放进中文抽屉，是为了提醒：很多「中文分数」其实是跨语言迁移分数，模型甚至没在中文任务上训过。

套件很快推动了一波 XLM-R、mT5 的论文。作者随后发现进步集中在容易的任务上，于是 2021 年做了 XTREME-R：任务换成更难的十项，语言扩到五十。名字带 R，是 Revisited，不是中文拼音。

google-research/xtreme 仓库后来被归档，只读。这不是数据集消失，是官方不再维护那套下载脚本。数据仍散落在各子任务的原始出处。引用请指向论文和子任务，不要假设总仓库还活着。
`,
    architecture: `
九项任务分成四类。句对分类：XNLI、PAWS-X。结构预测：POS、NER。问答：XQuAD、MLQA、TyDiQA。检索：BUCC、Tatoeba。语言四十种，覆盖十二个语系，中文出现在能覆盖到的任务里，不是每项都有中文。

标准设定是英语有标签微调，目标语零样本测试。也有人做 translate-train：把英语训练数据译成目标语再微调。两种数字差一截，混报等于作弊。

指标按任务走：准确率、F1、F1/EM、检索精度。总分是任务宏平均，容易被分类项拉高、被检索项拉低。XTREME-R 后来把分析做细，就是因为总分太会骗人。

这是编码器套件，不是指令套件。没有思维链，没有裁判模型，没有对话。用 decoder-only 的生成式协议重跑，必须当新实验写，不能对标 2020 年的榜。
`,
    content: `
题不是新写的，是把已有多语数据集对齐到同一套下载和评测脚本。XNLI 的句对、WikiAnn 式 NER、XQuAD 的翻译问答、Tatoeba 的句向量检索，拼在一起才叫 XTREME。

中文内容因此也是拼盘：翻译 NLI、翻译问答、可能还有命名实体。没有高考，没有中医，没有中国法律。它不回答「模型懂不懂中国」，只回答「中文作为四十语之一，迁移掉多少点」。

语言选择强调类型多样，故意包含泰米尔语、斯瓦希里语、约鲁巴语这类当时评测很少照顾的语言。中文在这个名单里属于高资源，分数往往好看，不能代表低资源文字。

PAWS-X 那种释义对立、TyDiQA 那种原生问答题，难度比翻译 NLI 硬。只看 XNLI 中文分，会系统性高估 XTREME 意义上的跨语言能力。
`,
    format: "多任务套件",
    metrics: ["任务相关"],
    lineage: { parents: ["xnli", "xcopa"], children: [], related: ["include"] },
    caveats: `
不是指令模型评测。把它写进 2025 年的中文助手报告，是时代错乱。协议是英语微调加零样本迁移。

仓库已归档。复现要回到各子任务的原始数据卡，不要假定总脚本还能跑。XTREME-R 是后继，任务和语言都换过，分数不能兑。

中文只是四十语之一，而且高资源。用 XTREME 中文子集宣称「中文 SOTA」，样本量和任务覆盖都不够。要测中国知识，去 C-Eval、CMMLU、INCLUDE。

翻译任务和原生任务混在一套总分里。XQuAD 是翻译的 SQuAD，TyDiQA 是原生问。平均掉之后，你分不清模型是会迁移还是会中文。
`,
    links: [
      { rel: "paper", label: "XTREME", href: "https://arxiv.org/abs/2003.11080" },
      { rel: "homepage", label: "sites.research.google/xtreme", href: "https://sites.research.google/xtreme" },
    ],
  },
  {
    slug: "fewclue",
    name: "FewCLUE",
    shortName: "FewCLUE",
    accession: "OB-2021-Z05",
    year: 2021,
    status: "foundational",
    kind: "suite",
    family: "chinese",
    domains: ["中文少样本"],
    org: "CLUE",
    authors: "CLUE team",
    summary: `CLUE 团队在 PET、P-tuning 热潮里推出的九项中文少样本套件。任务从 CLUE 改过来，协议是几条样本加提示模板，不是聊天。不要把它当成大模型对话评测。`,
    origin: `
2021 年，GPT-3 的 few-shot 把英语圈吓坏了，中文这边还在微调 BERT。CLUE 团队做了 FewCLUE，把分类、NLI、成语填空一类任务改成少样本协议，对标的是 PET、P-tuning、LM-BFF 那些模板方法，不是后来的 ChatGPT。

它出现的时间点很关键：指令微调还没成为默认，大家争论的是「要不要把分类任务写成完形填空」。FewCLUE 给这波中文 prompt-tuning 论文提供了公共考场。

谱系上它是 CLUE 的少样本切片，不是 SuperCLUE 的前身。SuperCLUE 走对话和对战；FewCLUE 仍然是 NLU 标签。名字像一家人，活法不是一代人。

现在再跑 FewCLUE，多半是为了复现 2021 年的中文 prompt 论文，或者在 OpenCompass 里当一个很老的诊断项。把它写进助手模型的主表，读者会以为你还停在 P-tuning。
`,
    architecture: `
九项任务大致包括 EPRSTMT 电商情感、TNEWS、OCNLI、CHID、CLUEWSC、CSL 等，每项提供极小的训练集（常见是每类 16 或 32 条）和较大的测试。指标仍是准确率或 F1。

协议是少样本加模板：把分类改成「这是__的评论」完形，或用 verbalizer 把标签映射成词。PET 式方法会训多个模板再集成。这和现在 chat 模板里塞五条示范不是一回事。

有的实现用生成模型直接输出标签词，有的继续上分类头。2021 年的数字几乎都来自前者的 prompt-tuning 变体。用今日指令模型零样本重跑，必须当新设定。

任务之间不能平均成「中文 few-shot 总分」就交差。情感和新闻分类很快饱和，成语和指代才是当时真正的少样本难点。
`,
    content: `
题面大多从 CLUE 改格式，不是新采集的用户对话。电商评论、新闻标题、成语上下文、论文摘要是否匹配，这些还是 2020 年那批中文标注。

少样本的「少」体现在训练侧：每类只有几十条，逼你靠模板和预训练，而不是靠堆标注。测试集仍然不小，否则排不出名次。

没有多轮，没有工具，没有安全拒答。用户说「帮我写邮件」这种助手场景，FewCLUE 完全不覆盖。它测标签，不测帮忙。

中文特有的坑还在 CHID 和 WSC 里。模板若按英语习惯写，成语填空会直接崩。这倒是它比翻译套件值钱的地方：题是中文原生的。
`,
    format: "少样本套件",
    metrics: ["Accuracy / F1"],
    lineage: { parents: ["clue"], children: [], related: [] },
    caveats: `
不要当 LLM 对话评测。FewCLUE 没有裁判模型，没有多轮，没有真实用户查询。它是 PET 时代的分类套件。

少样本协议和今日的 in-context learning 容易被混为一谈。当年要训模板参数；现在是在上下文里塞示范。两种分数差的不只是模型大小。

任务来自已经饱和的 CLUE。头部指令模型会把分类项做满，只剩下模板写得漂不漂亮在扰动小数点。

公开材料以论文和 CLUEbenchmark/FewCLUE 仓库为准。私有变体和「增强版 FewCLUE」如果没有文档，不要写进对照表。
`,
    links: [
      { rel: "paper", label: "FewCLUE", href: "https://arxiv.org/abs/2107.07498" },
      { rel: "repo", label: "FewCLUE", href: "https://github.com/CLUEbenchmark/FewCLUE" },
    ],
  },
  {
    slug: "mgsm",
    name: "MGSM",
    shortName: "MGSM",
    accession: "OB-2022-Z06",
    year: 2022,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["多语小学数学"],
    org: "Google",
    authors: "Shi et al.",
    summary: `从 GSM8K 抽出二百五十道小学应用题，译成十种语言，加上英语共十一份。它问的是数学推理会不会随语言掉点，不是再出一套更难的数学。题量极小，翻译错误有文献记录。`,
    origin: `
GSM8K 把英语小学应用题变成生成式数学的基本语法之后，Google 的 Shi 等人问了下一个问题：同样的题，换成中文、日语、斯瓦希里语，思维链还能不能走通。MGSM 不是新题库，是 GSM8K 的多语投影。

论文关心的是「推理是否语言无关」。他们观察到，英语 CoT 示范有时能帮到其他语言，有时帮不上，低资源语言掉点更狠。这跟「中文数学好不好」只部分重叠：中文是十一语之一，而且相对高资源。

因为题就是 GSM8K 的子集，英语污染和模板化问题被一起继承。GSM-Symbolic 后来证明换数字就会掉分；MGSM 在翻译层上又加了一层噪声。两条病叠在一起。

它现在常作为多语推理的快速探针出现在 lm-eval 和技术报告里。当作主数学基准不够格，当作「语言一换，算术还在不在」的体检，仍然便宜有效。
`,
    architecture: `
每语二百五十道，十一语就是两千七百五十条平行题。输入题干，输出最终数字答案，常用准确率。官方故事是思维链：先逐步演算，再抽数字。

因为规模小，方差大。差四五个点可能只是某几道行程题的翻译把单位写乱了。报分最好同时给英语对照和目标语，并写明是否用英语 CoT 示范。

答案抽取规则从 GSM8K 继承，各 harness 并不统一。有的认「答案是 18」，有的要 boxed，有的对中文「等于十八」手软。跨框架对比先对齐抽取器。

没有难度分层，没有竞赛题。全是小学四则和应用。用 MGSM 中文分代表「中文数学」，会把大学和高中竞赛整层漏掉。
`,
    content: `
题面与 GSM8K 相同：买水果、行程、年龄、简单比例，答案多为整数。语言换成中文后，人名、货币、单位有的本地化、有的还留着英语世界的痕迹，并不统一。

十种目标语包括中文、法语、德语、日语、俄语、西班牙语、斯瓦希里语、泰语、孟加拉语、泰卢固语一类组合（以论文名单为准）。覆盖的是「能不能把应用题读懂」，不是各国课程大纲。

翻译错误是公开事实，不是吹毛求疵。有的条件译丢，有的数字写错，有的问句变成病句。文献和社区复现都碰到过。评测前抽查，比盲目信 250/250 更重要。

平行结构是优点：同一道题可以看英语对、中文对不对。若英语对中文错，更像是语言或翻译问题；若两种都错，才更像不会算术。
`,
    format: "应用题短答案",
    metrics: ["Accuracy"],
    size: "250 × 11",
    lineage: { parents: ["gsm8k"], children: [], related: ["global-mmlu"] },
    caveats: `
规模极小。二百五十道决定不了中文数学能力，更决定不了多语推理的上限。把它当 GSM8K 的多语附件，不要当主榜。

翻译错误有文献记录。数字、单位、条件一旦译错，标签就错。这不是模型幻觉，是数据缺陷。复现时应对照英语原文。

继承 GSM8K 的饱和与污染。前沿模型在英语小学应用题上已经做满，MGSM 中文分很高，可能只是「会做那二百五十道」，不是「会中文数学」。

和 C-Eval 的高中数学、CMMLU 的大学数学不是一回事。MGSM 是翻译应用题；中国考卷是另一套知识。
`,
    links: [
      { rel: "paper", label: "MGSM", href: "https://arxiv.org/abs/2210.03057" },
    ],
  },
  {
    slug: "c-eval",
    name: "C-Eval",
    shortName: "C-Eval",
    accession: "OB-2023-Z07",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["中文考试"],
    org: "HKUST NLP",
    authors: "Huang et al.",
    summary: `四级乘五十二科的中文考试选择题，约一万三千九百四十八道，是中文圈对标 MMLU 的那张主卡。测试集长期 gated，lm-eval 公开跑的是验证集 ceval-valid，这是有效协议。不要把高考分叫 AGI。`,
    origin: `
英文考卷不能代表中文能力。这句话是 2023 年中文大模型评测的口头禅。港科大 NLP 的 Huang 等人做了 C-Eval：从中学到大学再到职业资格，收五十二个科目的四选一，难度分四级。结构一眼能看出是在跟 MMLU 对话，题却更中国：公务员、中医、注册工程师都在里面。

它几乎立刻变成国内发模型必报的两栏之一，另一栏是稍后出现的 CMMLU。两套题都像考试，科目有重叠，别当成两次独立发现。C-Eval 更强调教育阶段和职业考试，CMMLU 更强调中国文化和法律的知识面。

测试标签长期不公开，要拿官方测试分得把预测提交到作者的服务器。社区和 Eleuther 的 lm-eval 因此默认只跑验证集，任务名就是 ceval-valid。这不是偷懒，是当时唯一可复现的公开协议。作者后来在 2025 年 7 月把完整测试集放给社区，但历史论文里的数字，大多仍是 gated 测试分。

真题泄漏从一开始就被讨论。能买到的试卷、能搜到的题库，预训练见过的概率不低。分数接近饱和之后，再涨的那几个点，要先问是更会做题还是更会背题。
`,
    architecture: `
一万三千九百四十八道四选一，覆盖五十二科、四个难度层级（中学、大学、职业等划分以论文为准）。每科有 dev（带讲解的 few-shot 示例）、val、test 三份。Hard 子集是其中八个偏难 STEM 科目，不是另发的数据集。

常用准确率，按科目宏平均，再报总体和 Hard。协议有零样本、五样本、是否思维链三种常见组合。loglikelihood 选题和生成后再抽 A/B/C/D，分数会分叉，必须写清。

lm-eval 的公开任务是 ceval-valid：只评验证集，因为测试集当时需要外站提交。OpenCompass 国内栈往往同时提供验证和可提交的测试流程。同一模型在两个 harness 上差几个点，先查是不是 val 对 test、是不是 CoT。

不要把 C-Eval 总分理解成「中文通用智能」。它是闭卷考试准确率。阅读、写作、工具、拒答，一张四选一卡都量不到。
`,
    content: `
题来自中国教育与职业考试：高中数理化、大学专业课、医师、律师、公务员一类能公开搜集到的选择题。风格是真题或真题风，不是众包工人现场编的脑筋急转弯。

Hard 八科偏向高等数学、离散数学、概率统计、大学和高中的物理化学生物。LaTeX 公式多，选项长短不一。文科科目则更吃中国制度、历史和法律表述。

和 CMMLU 的重叠是概念上的：都是中文 MCQ 考世界知识和中国知识。具体科目名单不同，不能把两套平均分互相换算，也不该在同一张表里当两个独立「发现」各报一次高潮。

泄漏风险最高的是反复出现在教辅和网页上的高考、考研题。职业资格题相对少见一点，但不等于没进过语料。读分时把 STEM Hard 和文科常识拆开，比只看总分诚实。
`,
    format: "四选一",
    metrics: ["Accuracy"],
    size: "13,948",
    lineage: { parents: ["mmlu", "clue"], children: ["c-eval-hard"], related: ["cmmlu", "agieval"] },
    caveats: `
测试集长期 gated。看到「我们在 C-Eval 上 XX%」，先问是 test 还是 val。lm-eval 的 ceval-valid 是有效公开跑法，和官方测试分不是同一列数字。

真题泄漏是公开风险，不是阴谋论。分数很高时，优先怀疑背题，再讨论能力。不要把高考或注会选择题叫 AGI。

和 CMMLU 概念重叠。两套都报可以，但不要写成两个互不相关的中文知识突破。科目切分、是否 CoT、是否五样本，比那两三个点的分差更值得写。

同一套题在 lm-eval、OpenCompass 里喂法不同。中文 MMLU 式基准已经重复了英语 MMLU 的老问题：同名不同 harness，分数对不上。
`,
    links: [
      { rel: "paper", label: "C-Eval", href: "https://arxiv.org/abs/2305.08322" },
      { rel: "homepage", label: "cevalbenchmark.com", href: "https://cevalbenchmark.com/" },
      { rel: "repo", label: "hkust-nlp/ceval", href: "https://github.com/hkust-nlp/ceval" },
    ],
  },
  {
    slug: "c-eval-hard",
    name: "C-Eval Hard",
    shortName: "C-Eval Hard",
    accession: "OB-2023-Z08",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["中文 STEM"],
    org: "HKUST NLP",
    authors: "Huang et al.",
    summary: `C-Eval 论文里切出来的八个偏难 STEM 科目，不是单独发布的数据集。高等数学、离散、概率统计、大学和高中的理化生都在里面，公式重、题量小。引用请挂回 C-Eval，不要装成新基准。`,
    origin: `
C-Eval 总分很快被文科和中学题拉高，作者需要一个更扎人的切片，证明模型不是只会背时政。Hard 就是这八个 STEM 科目的集合，和主集同一篇论文、同一套下载，没有自己的 arXiv。

它在模型卡上的待遇却像独立栏目。国内技术报告常并排写「C-Eval / C-Eval-Hard」，好像第二列是另一场考试。说人话：那只是同一张卷子里比较难的那几科，拿出来单独平均。

这个切法学的是「总体已经不够用，就报子集」的老传统，类似 MMLU 的专业科目或 MATH 的 5 分题。有用，但容易被营销放大成新发现。

因为从来不是独立数据集，版本、泄漏、gated 测试这些问题全部继承 C-Eval。Hard 没有自己的测试服务器，也没有自己的标签政策。
`,
    architecture: `
科目包括高等数学、离散数学、概率统计，以及大学/高中的物理、化学、生物一类 STEM。题型仍是四选一，指标仍是准确率。样本数远小于一万三千九百四十八的全体，方差因此更大。

评测协议与 C-Eval 相同：零样本或五样本，是否 CoT，loglikelihood 或生成抽取。lm-eval 若只跑 ceval-valid，Hard 也只在验证集上有公开数字。把 valid Hard 和官方 test Hard 混在一张图里，是常见的偷换。

公式用 LaTeX 或纯文本转写，tokenizer 对反斜杠和上下标不友好时，模型会先在读题上摔倒，而不是在积分上摔倒。报分时最好注明题目是否经过规范化。

不要为 Hard 单独发明宏平均规则。按科目平均还是按题平均，跟主集保持一致，否则那几个点的「Hard 提升」毫无意义。
`,
    content: `
题是大学和高中理科试卷风：求导、极限、电路、有机反应、遗传定律、离散结构。选项里常有符号和短公式，不是「下列哪项正确」的文科长句。

因为科目少、每科题量有限，几道竞赛风的怪题就能左右平均分。这是切片，不是新的大规模 STEM 基准。

中文理科表述有自己的术语习惯，和英语 MMLU 的 college physics 不是译文关系。Hard 的价值正在这里：它测的是中文理科，而不是翻译过来的理科。

没有实验操作，没有证明题，没有填空。全是选择。会做 Hard 不等于会做物理实验，也不等于会写证明。
`,
    format: "四选一",
    metrics: ["Accuracy"],
    lineage: { parents: ["c-eval"], children: [], related: ["cmmlu"] },
    caveats: `
很小。不要当独立数据集引用，论文、下载和许可都落在 C-Eval 上。模型卡上可以单列一栏，参考文献里应指向 Huang et al. 的 C-Eval。

方差大，排名不稳。差两三个点不够写新闻。需要的话报科目分解，不要只报 Hard 平均。

继承主集的 gated 测试、泄漏和 harness 分歧。ceval-valid 上的 Hard 和官方测试 Hard 不是同一列。

LaTeX 和中文混排会让评测脚本抽错答案。先检查抽取器，再怀疑模型不会微积分。
`,
    links: [
      { rel: "paper", label: "C-Eval", href: "https://arxiv.org/abs/2305.08322" },
      { rel: "homepage", label: "cevalbenchmark.com", href: "https://cevalbenchmark.com/" },
    ],
  },
  {
    slug: "m3exam",
    name: "M3Exam",
    shortName: "M3Exam",
    accession: "OB-2023-Z09",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["多语考试", "多模态"],
    org: "DAMO Academy",
    authors: "Zhang et al.",
    summary: `达摩院从九个国家的官方考试里收了一万二千三百一十七道题，约百分之二十三必须看图。多语、多模态、小学到高中三级，是考试路线里比翻译 MMLU 更「当地」的一套。报分要按语言和是否用图拆开。`,
    origin: `
2023 年夏天，考试风评测同时在中英文爆发。阿里达摩院新加坡的 Zhang 等人没有再译一套 MMLU，而是去九个国家找官方试卷：美国英语、中国中文、意大利、巴西葡萄牙语、越南、泰国、肯尼亚斯瓦希里语、南非阿非利卡语、印尼爪哇语。三级教育（小学、初中、高中）一起收。

三个 M 是认真的：Multilingual、Multimodal、Multilevel。作者认为人类考试天然要求语言、知识和解题，而且很多题离开图就做不了。这和当时纯文本的 C-Eval 不在一条线上。

论文里 GPT-4 仍然在低资源和非拉丁文字上掉得很难看，多模态题更差。这把「会考试」拆成了会不会当地语言、会不会看图、会不会该年级的课，而不是一张总分。

谱系上它更接近后来的 INCLUDE（地方试卷），而不是 Global-MMLU（翻译加文化标签）。中文只是九语之一，但中文子集图特别多，和纯文本 C-Eval 对照很好用。
`,
    architecture: `
共一万二千三百一十七道，约二千八百道带一张或多张图。题型以官方考试的选择为主，部分语言图占比极高（中文超过六成的报道在论文统计里出现过），有的语言几乎全是纯文本。

指标是准确率。必须声明：是否把带图题纳入、用的是纯文本模型还是 VLM、图像怎么喂。把带图题丢给纯文本模型再报「多语考试分」，等于把百分之二十三的题变成残卷。

语言和年级是两个正交切分。低资源、非拉丁文字更难，这是作者的主结论之一。中文作为高资源语，分数往往不是九语里最差的，不能拿中文子集代表 M3Exam。

没有统一的 few-shot 模板能覆盖九种试卷格式。复现要跟仓库里的语言别脚本走，不要假设和 C-Eval 的五样本 prompt 一样。
`,
    content: `
题是真试卷：语文、数学、社科、自然科学四大块，再按国家课程填内容。中国子集里图像题比例很高，几何图、函数图像、实验装置都可能出现；有的非洲语言子集则几乎是纯文字。

文化知识跟着国家走。肯尼亚试卷不会考中国科举，中国试卷也不会考巴西地理细节。这正是地方考试相对翻译 MMLU 的优点：题是当地出的。

约百分之二十三需要图像才能做对。有的图是必要信息，有的只是装饰，论文按「需要处理图像才能成功解答」来统计。评测时不要把装饰图和关键图混成同一类错误。

公开仓库按语言组织题目和图像。版权和考试机构的限制意味着你不能假设所有题都可以二次分发到任意商业评测里。用之前读许可证。
`,
    format: "考试 MCQ ± 图",
    metrics: ["Accuracy"],
    size: "12,317",
    lineage: { parents: ["c-eval"], children: [], related: ["include", "cmmmu"] },
    caveats: `
多语且多模态，报分必须拆开。只报一个总准确率，会把「不会看图」和「不会斯瓦希里语」平均成一个假故事。

中文子集不等于 C-Eval。年级是 K-12，不是大学和职业资格；还大量依赖图像。和 CMMMU 的大学多模态也不是一回事。

低资源和非拉丁文字更难，这是主结论。用英语或中文子集的高分概括 M3Exam，是挑软柿子。

图像预处理、分辨率、是否 OCR 一遍，都会改分数。VLM 和纯文本 LLM 的数字不能写进同一列。
`,
    links: [
      { rel: "paper", label: "M3Exam", href: "https://arxiv.org/abs/2306.05179" },
      { rel: "repo", label: "DAMO-NLP-SG/M3Exam", href: "https://github.com/DAMO-NLP-SG/M3Exam" },
    ],
  },
  {
    slug: "cmmlu",
    name: "CMMLU",
    shortName: "CMMLU",
    accession: "OB-2023-Z10",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["中文世界知识"],
    org: "多机构",
    authors: "Li et al.",
    summary: `六十七个科目的中文多任务知识选择题，结构学 MMLU，内容更中国：法律、文化、区域知识权重大。它和 C-Eval 几乎同时出现、概念重叠，不要当成两次独立的中文知识发现来重复报。`,
    origin: `
MMLU 把「合上书考五十七科」变成英语圈的知识量表之后，中文需要自己的那一张。Li 等人做的 CMMLU 明确走这条结构：闭卷四选一、多学科、宏平均。时间上和 C-Eval 是同期工作，不是谁抄谁的续集，但读者经常分不清两套题。

差别在科目哲学。C-Eval 更像一张按教育阶段和职业资格排的考卷；CMMLU 更强调中国语境里的世界知识，法律、文化、地区内容的权重更高。论文自己也把 CMMLU 画在 MMLU 和 CLUE 之间：比 CLUE 难、比英语 MMLU 更中国。

国内模型卡很快养成「C-Eval + CMMLU」双栏。这有信息量，也有水分：两套都是中文 MCQ，相关很高，第二栏很少带来真正的新故事。当作互证可以，当作两个独立突破不行。

英语 MMLU 后来被污染、错标、饱和缠上。CMMLU 没有免疫。公开中文试题进预训练的路径更短，不是更长。分数到了九十附近，区分度一样会崩。
`,
    architecture: `
MMLU 式四选一，科目六十七个，覆盖自然科学、社科、工程、人文以及大量中国特有科目。常用五样本准确率，按科目宏平均。零样本和思维链是常见变体，必须写进脚注。

和 C-Eval 一样，loglikelihood 选题与生成抽取会分叉。OpenCompass 和 lm-eval 若都挂了 CMMLU，prompt、选项顺序、是否把科目名写进系统提示，都可能差出好几个点。同名不同 harness，这题英语圈已经考过。

没有官方的「Hard」切片，但有人会把 STEM 或中国法律单独平均。那是后处理，不是数据集的一部分。引用时写你自己的科目子集定义。

规模比单项阅读理解大，比 INCLUDE 那种十几万地方题小。它是「一张中文 MMLU」，不是「全世界地方试卷」。
`,
    content: `
题是中文知识：中国法律条文风格、历史文化、地理区划、专业课，也有普适 STEM。中国特有科目是它相对 MMLU 的卖点，也是相对 Global-MMLU 的卖点——后者是翻译，这套是中文出题。

和 C-Eval 会在高中数理、大学专业上撞车，但名单对不齐。一边有注册工程师，一边有更多文化法律。不要假设某科在两套里是同一批题。

四选一意味着会猜。二十五的随机基线写在论文里。早期模型在平均五十分以下挣扎，那是 2023 年的故事；现在头部模型已经把总分推到很不舒服的高位。

没有图，没有生成解释分。开放式的中文助手质量请看 AlignBench；这里只问选对选错。
`,
    format: "四选一",
    metrics: ["Accuracy"],
    lineage: { parents: ["mmlu"], children: [], related: ["c-eval", "global-mmlu"] },
    caveats: `
概念上与 C-Eval 重叠。两栏都报可以，当作两次独立发现重复报，是中文评测最常见的注水。读者需要你解释两套科目到底差在哪。

污染和错标风险与英语 MMLU 同类。公开题、教辅、题库网站都是预训练的免费食堂。高分先当记忆，再当能力。

harness 分歧真实存在。OpenCompass 推荐配置和 Eleuther 默认不是同一份 prompt。引用写配置、shot 数、是否 CoT，不要只写「CMMLU 86」。

它测闭卷选择，不测中文写作、方言、文言文生成或工具使用。中文能力四个字太大，CMMLU 只盖其中一角。
`,
    links: [
      { rel: "paper", label: "CMMLU", href: "https://arxiv.org/abs/2306.09212" },
      { rel: "repo", label: "haonan-li/CMMLU", href: "https://github.com/haonan-li/CMMLU" },
    ],
  },
  {
    slug: "superclue",
    name: "SuperCLUE",
    shortName: "SuperCLUE",
    accession: "OB-2023-Z11",
    year: 2023,
    status: "active",
    kind: "suite",
    family: "chinese",
    domains: ["中文对话", "榜单"],
    org: "CLUE / SuperCLUE",
    authors: "Xu et al.",
    summary: `CLUE 团队在大模型时代把名字升级成 SuperCLUE：中文版 Arena、开放对话和同源选择题捆在一起，再按月发榜。它测的是中文助手好不好用，不是再刷一套新闻分类。私有测试会演进，商业站点和 GitHub 并存。`,
    origin: `
CLUE 被 BERT 打穿之后，中文评测缺的是聊天和对战，不是第九个分类任务。Xu 等人 2023 年的 SuperCLUE 论文把三块绑在一起：CArena 的真人/模型对战偏好，OPEN 的单轮和多轮开放生成，CLOSE 的选择题——题干还和开放题同源，方便看「会选」和「会写」是不是一回事。

它明确对标 LMSYS 的 Chatbot Arena 加 MT-Bench，再加一层中文 MMLU 式闭卷。说人话：中文用户更想用谁、中文多轮聊得顺不顺、同一题改成选择还能不能做对。翻译过来的 MT-Bench 不算数，因为用户群和语言习惯都不是同一拨人。

站点后来长成月度中文 LLM 报告，安全、Agent 等专项往外拆。SuperCLUE-Agent 是其中一条支线。名字还叫 SuperCLUE，内容已经是一个小工业，而不只是那篇 2023 年的 arXiv。

商业站点和 GitHub 仓库并存。论文里的协议、官网上的当月榜、仓库里的示例，三者不必一致。引用要写你跟的是哪一层，哪一个月。
`,
    architecture: `
三块指标三套逻辑。CArena 走对战和 Elo/Bradley-Terry 一类偏好分，测的是更想用，不是更会考试。OPEN 常用 GPT-4 当裁判打开放生成，单轮和多轮分开。CLOSE 是选择题准确率，题干与开放单轮同源，用来校准「写得好」是不是「选得对」。

裁判模型的身份决定 OPEN 的分数，这点和 MT-Bench、AlignBench 一样。换一版 GPT-4，名次会动。CArena 的投票人群若变，Elo 也会漂。把某月榜上的小数点当成可复现科学，是误会了产品形态。

后来的月报把能力切成语言、知识、Agent、安全等象限，私有题会替换。这是活榜，不是冻结的测试集。学术复现请回到论文任务定义，不要假设能在本地重跑整个官网。

CLOSE 和 C-Eval/CMMLU 不要混。同源选择是为了跟 OPEN 对照，不是又一张五十二科考卷。
`,
    content: `
开放题面向中文真实使用：写作、角色、推理、代码、知识问答，风格接近助手而不是高考。对战提示来自用户侧，比实验室里的八十道 MT-Bench 更野。

CLOSE 把同一批题干收成选择，方便自动打分。作者想说明：只看选择题会误判聊天模型，只看开放题又贵又吵，两套一起看更稳。这是方法论文点，不是说 CLOSE 可以替代 C-Eval。

月度报告会加新题、新模型、新专项。安全对抗、Agent 任务出现在后续版本里，不一定在 2307.15020 那篇主论文的表里。读某月新闻稿，不要当成 2023 年 7 月的冻结结果。

中文特有的礼貌、成语、办公套话、国内产品知识会出现在开放题里。这是它相对英文 Arena 的差异，也是翻译题覆盖不到的地方。
`,
    format: "套件 + 榜单",
    metrics: ["Elo / 裁判分 / 准确率"],
    lineage: { parents: ["clue", "lmarena", "mt-bench"], children: ["superclue-agent"], related: ["alignbench"] },
    caveats: `
商业站点加 GitHub，私有测试会演进。官网某月的第一名，不能直接写进需要冻结协议的论文，除非你把题和裁判版本存下来。

Arena 测偏好，CLOSE 测选择，OPEN 测裁判分。三套数字不能兑，更不能和 C-Eval 平均成「中文总分」。Chatbot Arena 那条教训在这里同样适用。

裁判是 GPT-4 时，风格、冗长、谄媚都会进分。换成别的裁判，排行可能翻。必须写裁判型号和日期。

不要因为名字带 CLUE 就以为还在测 TNEWS。SuperCLUE 是大模型助手评测工业，CLUE 是 2020 年的 NLU 套件。
`,
    links: [
      { rel: "paper", label: "SuperCLUE", href: "https://arxiv.org/abs/2307.15020" },
      { rel: "homepage", label: "superclueai.com", href: "https://www.superclueai.com" },
      { rel: "repo", label: "GitHub", href: "https://github.com/CLUEbenchmark/SuperCLUE" },
    ],
  },
  {
    slug: "superclue-agent",
    name: "SuperCLUE-Agent",
    shortName: "SuperCLUE-Agent",
    accession: "OB-2023-Z12",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["中文 agent"],
    org: "CLUE",
    authors: "SuperCLUE team",
    summary: `SuperCLUE 拆出的中文原生 Agent 评测：工具使用、任务规划、长短期记忆三核，再落到十个基础任务。它不是把 GAIA 译成中文，公开仓库和示例有限，分数高度依赖官方协议。`,
    origin: `
2023 年秋天，Agent 突然变成中文大模型发布会的关键词，但评测还在翻译 ToolBench 或直接报一个 Demo。SuperCLUE 团队做了 SuperCLUE-Agent，强调中文原生任务：不是把英语工具文档翻过来，而是按中文使用场景写调用、规划和记忆。

三核对应当时圈内对 Agent 的最小公约数。工具：会不会按文档调 API、会不会先检索再调、会不会规划多次调用。规划：任务能不能拆开、会不会反思、会不会走思维链。记忆：多文档问答和长对话里还能不能找回主题。

它和 GAIA、AgentBench 是旁系，不是中文译本。GAIA 追的是真实世界难题和不可公开的测试标签；SuperCLUE-Agent 追的是中文助手能不能当差。难度和可复现性都不在同一档，别把分数换算。

公开材料偏少。GitHub 上有任务说明和示例，完整题面和自动评分并不像 HumanEval 那样一克隆就能跑。很多数字只活在官榜上。这是活的产品评测，不是冻结的学术集。
`,
    architecture: `
十个基础任务贴在三核上。工具侧常见调用 API、检索 API、规划 API、通用工具（搜索、浏览、本地文件、数据库一类）。规划侧有任务分解、自我反思、思维链。记忆侧有多文档 QA、长程对话，再加示例学习这类适应能力。

指标是任务成功或官方定义的分项准确率，再聚合成三核分数和总分。环境是不是真的执行工具、还是只看模型有没有写出正确的调用格式，会极大改变分数。读榜时要问：有没有真 API，还是字符串匹配。

这不是 OSWorld 那种虚拟机，也不是 WebArena 那种自托管网站。更接近「中文任务描述 + 工具接口」的实验室 Agent。轨迹短，工具是作者准备好的，不是整个操作系统。

因为公开 harness 不完整，学术论文若只写「SuperCLUE-Agent 第一」，读者无法复现。能复现的部分请指向仓库里实际存在的脚本和示例，而不是官网截图。
`,
    content: `
任务用中文布置：订票、查资料、拆项目、在长对话里找回开头的主题。工具名单面向助手场景，不是进攻性网络安全，也不是 SWE-bench 那种修仓库。

公开仓库相对主项目更小，示例多于全量题。部分任务依赖外部服务或未开源的评测器。把「十任务」理解成可以本地跑的十个数据集，会失望。

和 SuperCLUE 主榜的开放对话不同，这里开始要求结构化调用和多步。但多步的深度有限，不要想象成 GAIA 第三级那种要上网翻半天的题。

中文文档、中文错误信息、中文用户含糊指令是它相对英语工具基准的差异点。翻译 GAIA 覆盖不到这些。
`,
    format: "agent 任务",
    metrics: ["任务成功"],
    lineage: { parents: ["superclue"], children: [], related: ["gaia", "agentbench"] },
    caveats: `
公开材料有限。很多分数无法在本地复现。写进需要审计的报告时，说明你跑的是仓库示例还是官榜提交。

不是 GAIA 中文版，也不是 AgentHarm。它测中文助手式工具使用，不测真实世界难题，更不测有害工作流。

环境是否真执行工具，会让「成功」含义翻盘。只看模型有没有说出正确 JSON，和看它有没有把票订上，是两回事。

协议会随 SuperCLUE 月报演进。引用写日期。没有日期的 SuperCLUE-Agent 第一名，没有科学意义。
`,
    links: [
      { rel: "repo", label: "SuperCLUE-Agent", href: "https://github.com/CLUEbenchmark/SuperCLUE-Agent" },
    ],
  },
  {
    slug: "alignbench",
    name: "AlignBench",
    shortName: "AlignBench",
    accession: "OB-2023-Z13",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["中文对齐 / 助手质量"],
    org: "THUDM",
    authors: "Liu et al.",
    summary: `六百八十三条来自真实中文场景的查询，配人类核对过的参考答案，用多维 LLM 裁判打分。这里的 alignment 更接近中文助手好不好用，不是纯安全拒答。原裁判是 GPT-4-0613，换裁判分数就换人。`,
    origin: `
2023 年底，中文大模型已经会考试，用户却在抱怨「聊起来不像中文助手」。清华 THUDM 的 Liu 等人做 AlignBench，把 alignment 定义成真实场景里的中文对齐：基本任务、中文理解、开放问答、写作、角色、专业、数学、逻辑，八类，共六百八十三条。

数据故事很关键：题主要来自 ChatGLM 在线服务的真实用户问题，外加少量挑战题，不是实验室闭门造车的八十道。每条有人类核对的参考答案；知识密集题还带网页证据。这比翻译 AlpacaEval 更接地气。

评测走规则校准的多维 LLM-as-Judge，带思维链解释，分数 1 到 10。原裁判 GPT-4-0613 几乎成了中文圈的默认尺子。他们后来还配了 CritiqueLLM，号称能追回 GPT-4 评测能力的一大截，给没 API 预算的人一条路。

v1.1 在 2024 年 6 月对事实性参考做了人工修正，约两成答案补了来源网页。用 v1.0 数字和 v1.1 数字比「进步」，可能只是参考答案改对了。读分看版本。
`,
    architecture: `
输入是用户查询、模型回复、参考答案，输出是多维分析和总分。维度按任务类型切换：数学看计算对不对，写作看文采和合规，角色看是否入戏。最后再聚合成推理总分、语言总分和总体。

这是开放生成加裁判，不是选择。准确率三个字在这里不适用。和 MT-Bench 的差别：题是中文真实查询，有参考答案和证据，裁判提示按中文任务定制，而不是把 Zheng et al. 的英文量规直接翻译。

六百八十三条说大不大。按八类切开后，每类只有几十到一百出头，单类排名很吵。总体分比单类分稳一点，但仍远小于 Arena 的投票量。

原论文用 GPT-4-0613。换成 GPT-4o、Claude 或自研 CritiqueLLM，绝对分和名次都会动。AlignBench 分数必须带着裁判身份一起引用，否则无法比较。
`,
    content: `
八类覆盖中文助手的日常：基本语言任务、高级中文理解、开放问答、文本写作、任务型角色扮演、专业能力、数学计算、逻辑推理。真实用户味比较重，有办公、学习、闲聊，也有故意刁难。

参考答案是人类核对过的「好回复」锚点，不是唯一正确答案。知识题带 evidence 字段，v1.1 以后更完整。裁判被要求对照参考，而不是凭感觉打印象分——至少提示是这么写的。

没有安全越狱主线。这里的 alignment 是 helpful 那一侧：中文写得好不好、算得对不对、像不像专业助手。拒答、偏见、有害工作流请去 XSTest、HarmBench、Do-Not-Answer。

规模决定它适合当中文 MT-Bench 的本地替代，不适合当唯一的中文能力声明。和 SuperCLUE 开放题、C-Eval 选择题对照着看，故事才完整。
`,
    format: "开放生成 + 多维裁判",
    metrics: ["多维分"],
    size: "683",
    lineage: { parents: ["mt-bench"], children: [], related: ["superclue"] },
    caveats: `
裁判身份决定分数。GPT-4-0613、后来的 GPT-4 变体、CritiqueLLM，三套数字不能兑。技术报告必须写裁判型号。

v1.1 改过事实性参考。和 v1.0 比分，先确认版本。参考改对了导致的「提升」，不是模型变好了。

六百八十三条按类切开很小。单类第一名的宣传，统计上很脆弱。优先报总体和预先登记的主维度。

这不是安全评测。高 AlignBench 分的模型仍然可能乱拒或乱答有害请求。别把助手质量和对齐安全当成同一个词。
`,
    links: [
      { rel: "paper", label: "AlignBench", href: "https://arxiv.org/abs/2311.18743" },
      { rel: "repo", label: "THUDM/AlignBench", href: "https://github.com/THUDM/AlignBench" },
    ],
  },
  {
    slug: "cmmmu",
    name: "CMMMU",
    shortName: "CMMMU",
    accession: "OB-2024-Z14",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["中文大学多模态"],
    org: "多机构",
    authors: "Zhang et al.",
    summary: `中文版 MMMU：约一万二千道大学程度的多模态题，协议对齐英语 MMMU，内容中国化。六大学科、三十科目、三十九种图像。不要和 K-12 的 CMMU 撞名搞混。`,
    origin: `
MMMU 把大学教材里的图、表、谱、结构式变成英语多模态的难考卷之后，中文缺同等学力的一套。Zhang 等人 2024 年的 CMMMU 声明「严格跟随 MMMU 的标注和分析方式」，题从中文大学考试、习题和教材里人工收集，大约一万二千道。

它要测的不是 OCR 能不能读路牌，而是专家级中文试卷图：化学结构、乐谱、机械图、医学影像风格的教学图。GPT-4V 在论文里只有四成左右，作者以此来说明中文多模态专家能力还早。

撞名是真实事故。几乎同时出现的 CMMU（arXiv:2401.14011）是小学到高中的中文多模态题，三千六百道，题型还含多选和填空。一个字母之差，一个大学一个 K-12。混引会让你的相关工作段直接报废。

和 C-Eval 的关系是模态：C-Eval 是纯文本考试，CMMMU 是要看图的大学考试。和 M3Exam 的关系是年级与国家：M3Exam 是九国 K-12，CMMMU 是中国大学。
`,
    architecture: `
约一万二千道，覆盖艺术设计、商科、科学、医学健康、人文社科、工程技术六大学科，三十个科目，三十九种图像类型。题型以选择为主，也有判断和开放。指标主报准确率，协议对齐 MMMU 的专家级多模态理解。

图像是一等公民，不是附件。纯文本模型不能作为 CMMMU 的合法选手，除非你明确在做「不看图能做对多少」的泄漏诊断。MMStar、MMMU-Pro 那套「题能不能离开图」的审查，这里同样适用。

大学题意味着领域术语和中文教材记号。VLM 的中文 OCR 一崩，后面的推理无从谈起。报分最好能区分感知错误和推理错误，虽然自动评测很少真的做到。

和英语 MMMU 对照可以看双语模型是不是只在英语专家题上像样。论文把这组对照当作卖点之一。不要把两套总分直接减，科目和图像类型只是「像」，不是逐题平行。
`,
    content: `
图的种类故意拉得很杂：图表、示意图、地图、表格、乐谱、化学结构，还有工程制图一类。题干是中文，图上的文字也常常是中文，这对只在英语文档上训过的 VLM 不友好。

来源是大学考试、测验和教材，人工收集，不是合成。难度定位专家级，不是日常 VQA。TextVQA 那种读 T 恤的能力，在这里远远不够。

六大学科里，医学和工程对图像依赖更重，商科可能更吃表。只报一个总准确率，会把「不会读乐谱」和「不会读财报」混成同一种失败。

没有视频，没有多页长文档。它是单题大学卷，不是 DocVQA，也不是视频理解。
`,
    format: "多模态 MCQ",
    metrics: ["Accuracy"],
    size: "~12k",
    lineage: { parents: ["mmmu"], children: [], related: ["c-eval", "m3exam"] },
    caveats: `
与 CMMU（K-12，约 3603 题）撞名。引用必须写全称和 arXiv：CMMMU 是 2401.11944，大学；CMMU 是 2401.14011，中小学。发错引用等于发错数据集。

专家级中文试卷图，污染路径和 C-Eval 类似：教材和真题会进预训练。高分先问见过没。

必须看图。纯文本基线如果已经不低，说明题没出干净。报 VLM 分时把「不看图」对照写上。

协议对齐 MMMU 不代表数字可减。不同语言、不同收集，差值不是「中文比英语难多少」的无偏估计。
`,
    links: [
      { rel: "paper", label: "CMMMU", href: "https://arxiv.org/abs/2401.11944" },
      { rel: "repo", label: "CMMMU-Benchmark", href: "https://github.com/CMMMU-Benchmark/CMMMU" },
    ],
  },
  {
    slug: "include",
    name: "INCLUDE",
    shortName: "INCLUDE",
    accession: "OB-2024-Z15",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["地方知识", "44 语言"],
    org: "EPFL / Cohere For AI",
    authors: "Romanou et al.",
    summary: `从各国地方考试收了约十九万七千道选择题，四十四种语言，不是把 MMLU 翻译过去。它测的是模型在当地语言环境里到底知不知道当地的事。日常评测请用 INCLUDE-base-44 这类子集，全量太大。`,
    origin: `
翻译无法测地区知识。这是 INCLUDE 论文把话说死的那句。EPFL 和 Cohere For AI 的 Romanou 等人不去译英语考卷，而是搜集各国本地的教育、职业、资格考试，母语者出的题，共十九万七千二百四十三道，覆盖四十四种书面语和十五种文字。

它和 Global-MMLU 是 2024 年底多语评测的一对反题。Global-MMLU 把 MMLU 译校到四十二语，并标上文化敏感/无关；INCLUDE 根本不从 MMLU 出发，题是当地考场里长出来的。一个问「译文还能不能做」，一个问「当地人在考什么」。

动机很政治，也很实际：只看英语 MMLU 会系统性高估模型在其他语言里知道什么。许可证考试、本国历史、本国法律，翻译题覆盖不到。INCLUDE 把这些放进同一张多语卡。

全量十九万七对日常评测太贵。作者提供 INCLUDE-base-44 这类面向实用的子集，Hugging Face 上能直接拉。论文数字和你本地跑的子集数字，必须写清是哪一层。
`,
    architecture: `
MCQ，四十四语言。题来自约一千九百二十六场考试，脚本十五种。指标是准确率，通常按语言报，再考虑资源档位（高/中/低资源）。一张宏平均会把高资源语言的高分喂给低资源语言的惨状。

实用评测走 INCLUDE-base-44 等官方子集，而不是每次把十九万七扫一遍。子集如何抽样决定你看到的故事，引用要指向具体 Hugging Face 配置名。

和 C-Eval、CMMLU 的中文部分可以对照：那些是中国考卷的深度；INCLUDE 是四十四语的广度，中文只是其中一语。不要用 INCLUDE 中文切片替代 C-Eval，也不要用 C-Eval 替代「模型懂不懂爱沙尼亚」。

没有统一的五样本模板能伺候四十四种试卷格式。prompt 本地化本身就是评测的一部分。用英语系统提示去跑泰语地方题，是在测模型会不会英语，不是在测 INCLUDE。
`,
    content: `
题是本地课程与文化：本国历史、地理、法律、职业资格、人文社科。STEM 会有，但作者特别强调非翻译的人文和社会科学，以及许可证考试，因为那才带地区知识。

四十四语跨高中低资源，含非拉丁文字。中文在这里又是高资源角色。INCLUDE 的中文分好看，说明不了阿姆哈拉语或泰卢固语。

和 M3Exam 同属「找当地试卷」路线，但规模和语言覆盖大一个数量级，且不把多模态当一等公民。M3Exam 的图、三级教育是另一套切片。

题量大意味着质量不齐是常态。考试机构不同、年份不同、校对深度不同。把十九万七当成每一题都像 MMLU 那样被反复审过，会高估标签洁净度。
`,
    format: "多语 MCQ",
    metrics: ["Accuracy"],
    size: "197,243",
    lineage: { parents: ["mmlu"], children: [], related: ["global-mmlu", "m3exam"] },
    caveats: `
很大，日常评测请用子集。全量扫一遍的成本会逼你减 shot、减语言，最后报出来的不是论文里的 INCLUDE。

它不是翻译 MMLU，也不是 Global-MMLU 的竞品那么简单——两者问题不同。INCLUDE 测地方知识，Global-MMLU 测同一套英语知识换语言后还在不在。两套都报才说得清。

中文切片替代不了 C-Eval/CMMLU。深度和科目设计都不同。INCLUDE 的价值在跨语言的地区知识，不在又一张中国高考。

许可证和本地化 prompt 会影响合法使用和分数。商业评测前读数据卡。用英语模板跑当地题，是方法错误。
`,
    links: [
      { rel: "paper", label: "INCLUDE", href: "https://arxiv.org/abs/2411.19799" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/CohereForAI/include-base-44" },
    ],
  },
  {
    slug: "global-mmlu",
    name: "Global-MMLU",
    shortName: "Global-MMLU",
    accession: "OB-2024-Z16",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "chinese",
    domains: ["翻译 MMLU", "文化标签"],
    org: "Cohere For AI / HF 等",
    authors: "Singh et al.",
    summary: `把 MMLU 译校到四十二种语言，并标出文化敏感和文化无关子集。它仍是翻译根，不是地方试卷。作者指出相当比例题目需要西方知识；和 INCLUDE 对照着看，故事才完整。`,
    origin: `
英语 MMLU 偏西方知识，这不是攻击，是作者自己要修的病。Singh、Romanou、Fourrier 等一长串多机构作者把 MMLU 做成 Global-MMLU：专业翻译、社区翻译和机器翻译拼在一起，覆盖四十二语（含英语），并给题目打上文化敏感或文化无关的标签。

它和 INCLUDE 必须放在同一段相关工作里讲。INCLUDE 去各国考场收题；Global-MMLU 把同一万四千道英语题换语言。前者问当地知识，后者问「换了语言，这套西方课还能不能上」。Cohere For AI 两边都署名，不是偶然。

翻译质量是这条线的老丑闻。早年有人用 ChatGPT 批量译 MMLU，质量随语言崩。Global-MMLU 尽量并入 OpenAI 的专业人工 MMMLU 等更好的译文，并公开标注流程。它仍改变不了一个事实：根是英语 MMLU。

文化标签让你可以单独报「文化敏感题」上的排名。论文发现，全量 MMLU 的模型座次，在文化敏感子集上会动。只报一个多语平均，会把这个移动藏起来。
`,
    architecture: `
完整集是 MMLU 原题乘语言，外加 Lite 子集方便日常跑。指标仍是准确率。必须按语言、按文化敏感/无关、按是否专业译文分开报，否则十九万量级的数字没有解释力。

评测协议继承 MMLU 的老问题：五样本还是零样本、是否 CoT、选项顺序、harness 是 lm-eval 还是别人。同名 MMLU 在不同 harness 上已经能差出好几个点；乘上四十二语，分歧只会更大。

中文是四十二语之一。Global-MMLU 中文分测的是「英语题的中文译文」，不是 C-Eval。一个模型可以中文 Global-MMLU 很高、C-Eval 一般，因为两套知识不是同一桶。

Lite 和全量不可互换。跟 HELM Lite 把 MMLU 收成五科一样，子集故事和全科故事不是同一个。引用写配置名。
`,
    content: `
题与 MMLU 同源：五十七科，从小学数学到美国法律、医学、会计。文化敏感标签标出那些其实在问西方制度、名人、地域常识的题；文化无关标签标出更像普适 STEM 的题。

作者的关键观察：相当比例题目需要西方知识。译成中文之后，你仍在答美国语境里的「正确」。这不是翻译失败，是基准基因。想测中国法律，去 CMMLU，不要来这里。

译文来源混合。部分语言有专业人工，部分是社区或机器翻译再校验。语言之间的「难度」混杂着翻译质量和资源量，不能直接当成语言学结论。

没有图像，没有开放生成。它是多语 MCQ。和 INCLUDE 的地方人文题、M3Exam 的官方试卷图，覆盖的世界不是同一张地图。
`,
    format: "多语 MCQ",
    metrics: ["Accuracy"],
    lineage: { parents: ["mmlu"], children: [], related: ["include", "cmmlu"] },
    caveats: `
翻译根。再好的译校，也测不到只存在于目标文化里、从未进入英语 MMLU 的知识。作者自己把这点写进论文，引用时不要假装没看见。

相当比例题目需要西方知识。文化敏感子集上的排名变化，是主结果之一，不是附录彩蛋。只报全量平均，会重复英语 MMLU 的偏见。

和 INCLUDE 对照：一个翻译，一个地方考试。只跑其中一套，会得到相反的乐观或悲观。中文能力若只看 Global-MMLU，会系统性忽略中国考卷。

MMLU 的污染、错标、饱和，乘语言之后还在。高分可能是见过英语原题，不一定是会这门语言。
`,
    links: [
      { rel: "paper", label: "Global-MMLU", href: "https://arxiv.org/abs/2412.03304" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/CohereForAI/Global-MMLU" },
    ],
  },
];
