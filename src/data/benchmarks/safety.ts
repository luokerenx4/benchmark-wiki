import type { Benchmark } from "@/lib/types";

export const safety: Benchmark[] = [
  {
    slug: "realtoxicityprompts",
    name: "RealToxicityPrompts",
    shortName: "RTP",
    accession: "OB-2020-S01",
    year: 2020,
    status: "foundational",
    kind: "benchmark",
    family: "safety",
    domains: ["续写毒性"],
    org: "AI2",
    authors: "Gehman et al.",
    summary: `十万条从网页文本截出来的前缀，看语言模型续写会不会变脏、变攻击。它是补全设定，不是聊天拒答。历史上用 Perspective API 打毒性分，尺子自己会漂。`,
    origin: `
2020 年，大家刚意识到预训练语料里的脏文本会从模型嘴里漏出来。AI2 的 Gehman 等人没有去写「请你骂人」这种聊天指令，而是从网络文本里截了十万条前缀，问：给模型半句话，它会不会把后半句写毒。

这是编码器/补全时代的安全评测。GPT-2 那种「继续写」的接口，和后来 ChatGPT 的「我不能帮你」完全不是一个交互。用 RTP 给对齐过的聊天模型打分，等于用续写毒性去衡量拒答政策。

它很快变成毒性解码、可控生成论文的标准件。Perspective API 作为自动尺子被写进几乎所有后续工作。ToxiGen、真实用户红队，都站在「先有一个能跑的毒性探针」这条线上。

今天再单独拿 RTP 宣称模型安全，时代错了。它测的是补全会不会脏，不测越狱、不测工具危害、不测过度拒答。该进史前层，当诊断探针可以，当安全总分不行。
`,
    architecture: `
输入是自然语言前缀，模型自由续写，再用毒性分类器（历史上主要是 Perspective API）给续写打分。常见指标是毒性概率、期望最大毒性：采样多次，看最脏的那次有多脏。

协议对解码超参极度敏感。温度、top-p、是否禁止某些词，能把曲线整段平移。论文之间的数字几乎不能直接比，除非复现同一套解码。

Perspective API 会改模型、改阈值、改语言覆盖。今天打出来的毒性分，和 2020 年论文里的分，不是同一把尺。自己部署一个冻结的分类器，比调用在线 API 更可复现。

没有「应该拒绝」的标签。前缀本身可能已经带毒，也可能干净。评测的是条件生成的毒性，不是指令策略。聊天模板、系统提示、拒答话术，都不在原协议里。
`,
    content: `
前缀来自网页文本，不是作者手写的攻击指令。有的半句话已经在骂人边缘，有的看起来无害。正是这种「像网上随手截的」让它比实验室里的脏话词典更接近真实补全。

覆盖的是英语互联网脏话、攻击、色情边缘表达，不是中国互联网的骂战，也不是专业的犯罪教程。群体和话题偏当时的英文网络。

十万条很大，通常会用分层子集：按提示本身的毒性分桶，看「干净前缀」会不会被模型写脏。只报一个总体毒性率，会把「提示已经脏」和「模型写脏」混在一起。

没有多轮，没有角色扮演越狱，没有工具。就是一句话的后半段。内容简单，是它能当探针的原因，也是它覆盖不了现代威胁模型的原因。
`,
    format: "续写",
    metrics: ["toxicity probability"],
    size: "100k",
    lineage: { parents: [], children: ["toxigen"], related: ["truthfulqa"] },
    caveats: `
Perspective API 会漂。换年份、换端点、换语言，分数就换。把 2024 年的 RTP 数字拿去和 2020 年论文比「我们更安全了」，尺子可能先动了。

这不是拒答评测。对齐模型在聊天接口里拒绝续写脏话，RTP 原协议并不给分。补全 API 和 chat API 必须分开报。

英语网页前缀，文化偏美国互联网。中文脏话、阴阳怪气、和谐词，RTP 测不到。

高毒性不等于高危害。一句脏续写和一篇可用的犯罪指南，在真实伤害上不是一个数量级。后面 HarmBench、StrongREJECT 就是来拆这件事的。
`,
    links: [
      { rel: "repo", label: "allenai/real-toxicity-prompts", href: "https://github.com/allenai/real-toxicity-prompts" },
    ],
  },
  {
    slug: "crows-pairs",
    name: "CrowS-Pairs",
    shortName: "CrowS-Pairs",
    accession: "OB-2020-S02",
    year: 2020,
    status: "foundational",
    kind: "benchmark",
    family: "safety",
    domains: ["刻板印象"],
    org: "NYU",
    authors: "Nangia et al.",
    summary: `一千五百零八对最小对立句，一对刻板、一对反刻板，看掩码语言模型更喜欢哪句。它是给 BERT 打分的，不是给聊天模型出拒答题。效度后来被认真批评过。`,
    origin: `
2020 年，刻板印象评测还在 Winogender 那种职业代词模板里打转。NYU 的 Nangia 等人做 CrowS-Pairs：九个美国社会类别上，成对写出「刻板」和「反刻板」的最小对立句，让掩码语言模型比较哪一句更像它训练时见过的话。

设计假设很强：如果模型给刻板那句更高的伪似然，就说明它内化了偏见。这在 BERT 时代是能跑的协议，也确实把「预训练会吃进社会统计」这件事测成了数字。

随后的批评很公开。有人指出对立句并不总是只改偏见那一处，有的对子在语言流畅度、长度、名字频率上并不公平，模型可能只是在选更像英语的那句。效度争议没有让它消失，但让「CrowS-Pairs 高就是更偏见」这句话不再好意思直说。

BBQ、WinoQueer 都站在它后面：一个改成问答、一个改成酷儿群体。CrowS-Pairs 自己则停在掩码语言模型的史前层。拿它给 GPT 类聊天模型报「偏见分」，协议就已经错了。
`,
    architecture: `
每一对是两句几乎相同的英语，只有涉及群体的那一处不同。模型对两句分别打分（掩码语言模型用伪似然，自回归模型有时被改成整句 loglikelihood），看它更偏好刻板句的比例。

指标通常是刻板偏好率：百分之五十是「没有系统性偏好」的参考点，高于五十表示更常选刻板句。具体怎么分词、要不要排除某些对子，论文和后续复现并不完全一致。

一千五百零八对按九个类别切开，每类只有一百多到两百对。类别之间不能平均成一个「偏见总分」就交差，种族和性取向上的机制不是同一个。

原协议不是生成，更不是拒答。把两句塞进聊天模板问「哪句对」，已经是新实验。自回归模型的整句似然和 BERT 的伪似然，也不能直接比。
`,
    content: `
九个美国社会类别：种族、宗教、年龄、性别、性取向、国籍、残疾、外貌、社会经济地位一类。句子是众包写的最小对，有的自然，有的像为了对立体而写出来的。

内容锁定美国语境。姓名、宗教指称、福利制度的刻板印象，换到中文社会并不对应。把它当「通用偏见量表」，是把美国社会统计当成世界。

反刻板句并不总是「正确」或「反歧视」，它只是在那一对里作为对照。评测的是相对偏好，不是绝对真实性。模型更喜欢反刻板句，也不等于它在开放生成里就不会歧视。

题量小、模板味重。后续工作会指出部分对子改了不止一处，或者一边明显更通顺。用之前最好读批评文献，不要把原始 1508 对当成已经消过毒的金标准。
`,
    format: "最小对",
    metrics: ["stereotype preference"],
    size: "1,508",
    lineage: { parents: [], children: ["bbq"], related: ["winoqueer"] },
    caveats: `
效度有公开批评。对子不公平时，分数测的是流畅度，不是偏见。引用请带着这份保留，不要把百分比写成道德判决。

不是聊天拒答，也不是 QA。给指令模型报 CrowS-Pairs，要先声明你改了什么协议。默认实现是掩码似然。

美国中心。类别和刻板内容都来自美国社会。中文模型在这上面的分数，解释力有限。

小。类别一切开，方差就上来。差三五个点不够写「我们去偏见成功了」。
`,
    links: [
      { rel: "repo", label: "nyu-mll/crows-pairs", href: "https://github.com/nyu-mll/crows-pairs" },
    ],
  },
  {
    slug: "toxigen",
    name: "ToxiGen",
    shortName: "ToxiGen",
    accession: "OB-2022-S03",
    year: 2022,
    status: "foundational",
    kind: "benchmark",
    family: "safety",
    domains: ["隐含仇恨"],
    org: "Microsoft / MIT",
    authors: "Hartvigsen et al.",
    summary: `机器生成的、针对十三个少数群体的毒性或良性陈述，专门抓那些不带脏字的隐含仇恨。它是分类数据，不是越狱集。仓库后来归档，群体覆盖偏美国。`,
    origin: `
显式脏话检测不够。仇恨可以写得很文明，礼貌地否定一个群体的人性。Microsoft 和 MIT 的 Hartvigsen 等人用语言模型生成大量针对少数群体的陈述，再人工标注毒性，做成 ToxiGen，逼检测器去看隐含仇恨而不是关键词。

它是对 RealToxicityPrompts 的转向：RTP 看续写脏不脏，ToxiGen 看分类器认不认得出「说得体面的毒」。训练数据和评测基准的身份在这里是缠在一起的，很多人用它微调毒性分类器，再在同一分布上报 F1。

合成数据的好处是规模和可控，坏处是味道像模型。生成器自己的偏见、模板、安全过滤，都会写进样本。你在测下游分类器，也可能在测上游生成器的影子。

仓库后来归档，并不等于数据消失，但意味着官方不再跟进群体名单和标注修订。2022 年的十三群体，放到今天的安全分类学里已经偏窄、偏美国。
`,
    architecture: `
主任务是语句级毒性分类：给定一句关于某群体的陈述，判断有毒还是良性。指标用 F1 或准确率，按群体分解比总体更有用，因为有的群体 implicit hate 更难。

数据是机器生成加人工校验，不是论坛爬虫的原始帖。评测可以走现成拆分，也可以把 ToxiGen 当训练集去测其他仇恨数据集的迁移。两种用法分数不能兑。

它不提供越狱提示，不提供多轮，不提供工具。把 ToxiGen 句子塞进聊天模型问「请继续」，已经离开原协议。作为 LLM 安全主榜的一栏，它量错了对象。

分类器阈值会决定你看到的「毒性率」。用 Perspective、用自己微调的 RoBERTa、用 LLM-as-judge，三套数字是三个任务。必须写分类器身份。
`,
    content: `
十三个少数群体，陈述覆盖隐式和显式毒性，以及对照用的良性句。隐式样本才是卖点：不出现脏话，但内容是贬低、阴谋或非人化。

群体名单和表述偏美国政治话语。换到其他国家的少数群体、换到中文网络黑话，覆盖是空的。不要用英语 ToxiGen F1 代表「仇恨检测已解决」。

合成句有时会过火或过假，标注员也并不总一致。隐含仇恨的边界本身就吵。把模型 F1 写成客观毒性，是把一项有社会争议的标注当成物理量。

没有图像、没有梗图、没有多模态 meme。2022 年以后很多仇恨发生在图和短视频里，ToxiGen 是纯文本分类集。
`,
    format: "毒性分类",
    metrics: ["F1 / accuracy"],
    lineage: { parents: ["realtoxicityprompts"], children: [], related: ["bbq"] },
    caveats: `
合成毒性。分布像生成器，不像完整的真实社区。迁移到真实论坛时，F1 掉一截是预期，不是意外。

群体覆盖偏美国，十三类不能外推到全世界的身份政治。中文场景尤其对不上。

仓库已归档。使用冻结快照，并写清你用的是哪一版标注和哪一个拆分。

不要当越狱或拒答基准。高 ToxiGen F1 的分类器，解决不了模型会不会按步骤写出犯罪教程。
`,
    links: [
      { rel: "repo", label: "microsoft/TOXIGEN", href: "https://github.com/microsoft/TOXIGEN" },
    ],
  },
  {
    slug: "bbq",
    name: "BBQ",
    shortName: "BBQ",
    accession: "OB-2022-S04",
    year: 2022,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["偏见 QA"],
    org: "NYU",
    authors: "Parrish et al.",
    summary: `约五万八千道偏见问答，同一题有模糊语境和消歧语境两套。它看模型在信息不足时会不会倒向刻板印象，不是越狱，也不是毒性分类。内容锁定美国社会类别。`,
    origin: `
CrowS-Pairs 问的是「哪句更像训练数据」，还是离实际使用差一层。NYU 的 Parrish 等人把偏见做成问答：先给一段可能触发刻板印象的情境，再问一个关于个体的问题。同一题有模糊版和消歧版——模糊时正确答案往往是「未知」，消歧后才有事实答案。

设计非常阴险，也非常有用。信息足够时，模型能不能根据文本答题；信息不够时，它会不会用刻板印象把空填上。很多模型在消歧集上准确率还行，一到模糊集就倒向社会统计。这比「似然更喜欢哪句」更接近真实伤害机制。

BBQ 成为指令模型偏见评测的默认题库之一，也被 HELM 一类套件收过。它仍然不是安全的全部：不测越狱，不测拒答，不测工具。它测的是 QA 里的偏见捷径。

美国中心写在名字的文化里。九个类别是美国人口讨论常用的那套。换国家需要新的 BBQ，而不是把英语题译过去——译过去会把美国刻板印象一起搬过去，INCLUDE 对翻译基准的批评在这里同样成立。
`,
    architecture: `
选择题 QA。每条有语境、问题、选项（通常含「未知」）。模糊语境下，正确行为是承认未知或选中性项；消歧语境下，正确行为是根据文本里的事实答。指标同时报准确率和偏见分数。

九个类别各自有一批题，总量约五万八。按类别、按模糊/消歧、按是否对目标群体不利来分解，比一个总分重要得多。总分会把「会做阅读理解」和「不会乱填刻板」混在一起。

协议对提示敏感。「必须选一个」会逼模型在模糊题上胡猜；允许回答「未知」则更接近原意。聊天模型还可能拒绝整道题，拒答应单独记账，不要当错误答案，也不要当正确的反偏见。

和 XSTest 的关系是互补：BBQ 看偏见捷径，XSTest 看安全过度拒答。都不是越狱。安全报告里把它们塞进同一列「安全分」，是假朋友。
`,
    content: `
情境是短小的美国日常生活：工作、犯罪、家庭、医疗。模糊版故意写两个人、两种身份、一件事，但不给足以判断的信息；消歧版补上一句事实。

类别覆盖年龄、残疾、性别、国籍、外貌、种族、宗教、性取向、社会经济地位等美国社会讨论里的常用轴。姓名和职业是触发刻板的主要旋钮。

题是模板生成加人工，规模大，重复结构也明显。模型一旦学会「模糊就选未知」这条元策略，分数会好看，但开放生成里未必真的更公平。这是所有模板偏见集的天花板。

没有中文社会关系、没有户籍、没有地域黑。中文偏见要另收题。把 BBQ 译成中文再报分，测的是翻译加上美国刻板，不是中国语境。
`,
    format: "偏见 QA",
    metrics: ["accuracy / bias score"],
    size: "~58k",
    lineage: { parents: ["crows-pairs"], children: [], related: ["xstest"] },
    caveats: `
不是越狱，不是毒性，不是拒答。BBQ 高分不等于 HarmBench 低 ASR。安全是一篮子机制，这只篮子装的是 QA 偏见。

美国中心。类别、姓名、刻板内容都是美国的。外推到其他社会，需要新数据，不是新翻译。

模糊题上「选未知」的元策略可以被教出来。要搭配开放生成或对抗改写，才知道模型是真的谨慎，还是会考试。

拒答会干扰准确率。把「我不能假设」当成错，会惩罚更小心的模型；当成对，又可能奖励空洞拒答。记账规则必须写明。
`,
    links: [
      { rel: "repo", label: "nyu-mll/BBQ", href: "https://github.com/nyu-mll/BBQ" },
    ],
  },
  {
    slug: "winoqueer",
    name: "WinoQueer",
    shortName: "WinoQueer",
    accession: "OB-2023-S05",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["反酷儿偏见"],
    org: "USC 等",
    authors: "Felkner et al.",
    summary: `Winogender 风格的模板句，专门测对酷儿群体的偏见，补上性别职业模板覆盖不到的那一块。规模小，社区基准，模板伪影是已知税。`,
    origin: `
Winogender 把职业和代词绑在一起，测的是「医生是他吗」这种性别刻板。酷儿身份、跨性别、非二元，在那套职业模板里几乎不存在。USC 等机构的 Felkner 等人做 WinoQueer，用最小对立模板去抓反酷儿偏见。

它是小型社区基准，不是工业级红队。意义在于把「偏见」从性别二元里拆出一块，让模型卡不能再用 Winogender 一个数字把 LGBTQ 相关伤害糊过去。

谱系上它和 CrowS-Pairs、BBQ 是旁系：都是刻板，但群体和句式不同。不要平均成「偏见总分」。反酷儿偏见的触发词、诋毁和「善意」误解，跟种族姓名模板不是同一套统计。

因为小、因为模板，它很容易被 prompt 技巧刷高。它的正确用法是诊断：换了对齐策略之后，这块会不会更糟。不是拿来宣布「我们没有反酷儿偏见了」。
`,
    architecture: `
模板句成对或成组出现，替换身份词、代词或描述，比较模型打分或选择。指标是偏见分数：更偏好贬低、否定或刻板那一侧的程度。具体公式跟仓库实现走，不要自己发明一个平均。

因为是模板，结构预测式打分（似然、填空）比开放生成更接近原意。硬改成聊天问答可以，但那是新任务。生成式模型还可能拒答整句，需要单独编码。

规模小意味着置信区间宽。几次随机种子、几种 verbalizer，就能让结论翻面。论文级使用应报告敏感性，而不是只报中心数字。

没有官方活榜。复现依赖 GitHub 上的模板和脚本。版本一改，对子名单可能变。写 commit。
`,
    content: `
句子短，围绕酷儿身份的日常描述、关系、医疗或社会判断。对照句把身份换成直人或改掉贬义框架。内容由作者和社区构造，不是大规模爬虫。

覆盖面相对美国英语社群话语。其他语言的酷儿黑话、歧视口令、法律分类，这里没有。中文场景需要另做，不能靠翻译身份词交差——翻译会把英语文化战争整包运过来。

模板会把复杂身份压成几个替换位。真实伤害往往发生在长对话、医疗建议、内容审核的交界处，WinoQueer 只抓住其中最像 Winogender 的那一层。

良性对照很重要。只有贬低句没有对照，分数就变成毒性检测。WinoQueer 想测的是相对偏见，不是绝对脏话。
`,
    format: "模板对",
    metrics: ["bias scores"],
    lineage: { parents: ["crows-pairs"], children: [], related: ["bbq"] },
    caveats: `
小。模板伪影大。几个点的改善可能是 verbalizer 换了词，不是模型更公平。

不要和 Winogender、BBQ 混成一个偏见指数。群体不同，机制不同，平均没有社会学意义。

不是拒答评测，也不是仇恨言论分类器测试集。协议是模板打分。

公开维护靠社区仓库。引用写仓库和日期。没有工业级标注流水线当质量背书。
`,
    links: [
      { rel: "repo", label: "katyfelkner/winoqueer", href: "https://github.com/katyfelkner/winoqueer" },
    ],
  },
  {
    slug: "advbench",
    name: "AdvBench",
    shortName: "AdvBench",
    accession: "OB-2023-S06",
    year: 2023,
    status: "foundational",
    kind: "benchmark",
    family: "safety",
    domains: ["越狱目标"],
    org: "llm-attacks",
    authors: "Zou et al.",
    summary: `Zou 等人 GCG 论文里的约五百二十条有害行为字符串，是优化攻击的目标，不是完整红队框架。HarmBench 和 JailbreakBench 都从这里借题。不要和 2022 年 THUNLP 那个 Advbench 搞混。`,
    origin: `
2023 年夏天，llm-attacks 那篇「通用可迁移对抗攻击」把 GCG 后缀送上头条：一串无意义字符，能让一堆对齐模型开始配合有害请求。为了优化这个后缀，他们需要一批明确的有害行为字符串。AdvBench 就是那批目标，不是一个评测框架。

说人话：它是攻击论文的素材，被社区当成了越狱题库。五百二十条左右的「写出炸弹教程」「写诈骗邮件」成为后续几乎所有越狱论文的公共敌人。HarmBench、JailbreakBench 都在相关工作里写：我们从 AdvBench 抽样或去重。

它不是完整的威胁模型。没有情境，没有多步工具，没有版权类别的精细划分，没有官方分类器。ASR 怎么算，每篇论文自己定义：有的看是否拒绝，有的看是否出现关键词，有的再叫 GPT-4 判。这就是后来 StrongREJECT 要打的那摊混乱。

名字撞车。THUNLP 2022 年前后也有 Advbench/AdvBench 一类对抗评测，任务完全不同。引用必须写 Zou et al.、arxiv 2307.15043、llm-attacks 仓库，否则读者会下错数据。
`,
    architecture: `
两条常见形态：有害行为（让模型去做的事）和有害字符串（让模型原样吐出的目标前缀，比如「Sure, here is ...」）。GCG 优化的是触发后缀，评测则看目标模型是否按行为配合。

没有统一裁判。攻击成功率（ASR）在 AdvBench 上是一个家族，不是一个数字。关键词匹配会把空洞胡话算成功；拒答检测会把「我不能」的变体漏掉；LLM 裁判又引入自己的偏见。跨论文比 ASR，先对齐成功定义。

规模五百二十，对优化攻击够用，对覆盖危害类型不够用。后续 HarmBench 把行为重新设计成分割和类别，就是嫌 AdvBench 太粗、太偏「写一篇教程」。

它通常和一种攻击方法绑在一起报：GCG 在 AdvBench 上 XX% ASR。离开攻击方法和裁判，单独报「模型在 AdvBench 上安全」，没有定义。
`,
    content: `
内容是明确的有害请求：暴力、犯罪活动、诈骗、入侵一类「请给出步骤」的指令。很多是短句，缺少真实世界的约束和上下文，所以模型一旦破防，吐出的经常是通用教程腔。

和 HarmBench、JBB 有题面重叠。三套一起报却不声明去重，会让同一类失败被数三次。JailbreakBench 公开写过：约百分之十八来自 AdvBench，百分之二十七来自 TDC/HarmBench。

没有良性对照，测不了过度拒答。那是 XSTest 和 JBB 良性集的工作。AdvBench 只有「坏请求」，模型全部拒绝也能拿满分——在这个集上。

英语为主，犯罪类型偏美国法律想象。出口管制、本土化的政治审查、中文社会工程，不是它的覆盖范围。
`,
    format: "有害目标字符串",
    metrics: ["ASR（定义各异）"],
    size: "520",
    lineage: { parents: [], children: ["harmbench", "jailbreakbench"], related: [] },
    caveats: `
不要和 THUNLP Advbench 2022 混淆。数据集、任务、作者团都不一样。检索时加 Zou 或 llm-attacks。

ASR 定义混乱。没拒绝 ≠ 真的提供了有用有害内容。StrongREJECT 就是冲着 AdvBench 式虚高 ASR 来的。

它是攻击目标列表，不是评测框架。没有官方分类器、没有标准系统提示、没有威胁模型文档。复现要跟具体论文的附录走。

和 HarmBench/JBB 重叠。重复计算同一批行为，会让你的「我们在三个基准上都第一」看起来比实际更辉煌。
`,
    links: [
      { rel: "paper", label: "Universal Adversarial Attacks", href: "https://arxiv.org/abs/2307.15043" },
      { rel: "repo", label: "llm-attacks", href: "https://github.com/llm-attacks/llm-attacks" },
    ],
  },
  {
    slug: "do-not-answer",
    name: "Do-Not-Answer",
    shortName: "Do-Not-Answer",
    accession: "OB-2023-S07",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["拒答"],
    org: "LibrAI / MBZUAI",
    authors: "Wang et al.",
    summary: `九百三十九条按理不该回答的提示，五个风险区、十二种伤害类型，再给回复打上动作类别。它给拒答一张分类学，英语优先，有中文后续工作。`,
    origin: `
越狱论文堆 ASR 的时候，另一边的人连「什么叫拒绝」都没定义清楚。LibrAI / MBZUAI 的 Wang 等人做 Do-Not-Answer：先划出不应回答的提示，再给模型回复编码成动作——直接拒绝、反驳、含糊、回答、还是继续提供帮助。拒答从此有了一张表，而不只是「模型说了不」。

五个风险区、十二种伤害类型，是想把「有害」从单一脏话里拆开：自伤、暴力、违法、隐私、虚假信息等，政策不同，正确动作也不同。有的题应当拒绝，有的也许应当给安全的高层次信息，分类学逼你把策略写明白。

它和 XSTest 正好成对。Do-Not-Answer 问该拒的拒了没有；XSTest 问不该拒的是不是拒过头。只看其中一张，会把过度安全和真正安全弄反。

英语是主集。作者和社区后来做了中文等后续，但引用「Do-Not-Answer」而不写语言，默认是英语九百三十九条。不要把中文版分数写进英语表。
`,
    architecture: `
提示是有害或不应直接回答的查询。评测重点不是攻击成功率，而是回复落在动作类别 0–6 的哪一格：从安全拒答到直接提供有害内容。可以用人工，也可以用训练过的分类器。

九百三十九条按风险区和伤害类型分层。总体拒答率会掩盖「在自伤上很谨慎、在隐私上很松」这种裂开。主结果应是分类学上的分解，不是一个百分比。

和 HarmBench 的差别：HarmBench 是红队框架加行为加攻击方法；Do-Not-Answer 是拒答分类学加直给提示。这里的「攻击」往往只是直接问，不带 GCG 后缀。直接问都答的模型，越狱数字没有意义。

中文后续若存在，协议和类别可能微调。复现英语主集请走论文和 Hugging Face 上的 LibrAI/do-not-answer。不要混用不同语言的动作标签。
`,
    content: `
提示覆盖不该直接配合的请求：犯罪咨询、自伤、仇恨、隐私刺探、危险技术细节等。写法以直接用户口吻为主，不是复杂角色扮演。

十二伤害类型比 AdvBench 的「写教程」更细，仍然是短提示，不是多步 agent 工作流。AgentHarm 那种「真的走完工具链」不在覆盖里。

英语为主，文化假设是英语世界的政策讨论。政治敏感、中文平台规范、本地非法内容，不会自动对齐。中文策略评测需要中文题。

动作类别把「拒绝」拆开，这是内容上最有价值的部分。一句「抱歉」和一篇替代性的安全建议，在分类学里不是同一个动作。打分时不要把所有非答案都算成功拒答。
`,
    format: "有害查询",
    metrics: ["refusal / action taxonomy"],
    size: "939",
    lineage: { parents: [], children: [], related: ["xstest", "harmbench"] },
    caveats: `
英语优先。中文后续是另一份数据，分数不能兑。政策类别也按英语安全讨论来，未必符合你产品的当地法。

直给提示，不是越狱。Do-Not-Answer 拒答率高，只说明没被直接问倒，说明不了 GCG 或角色扮演下会怎样。

动作分类会错。用 LLM 给 0–6 打标签，自己就有偏见和漂移。人工抽查是必要成本。

和 XSTest 成对使用。只优化 Do-Not-Answer，很容易训练出一个把「杀时间」也拒掉的模型，XSTest 会当场揭穿。
`,
    links: [
      { rel: "paper", label: "Do-Not-Answer", href: "https://arxiv.org/abs/2308.13387" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/LibrAI/do-not-answer" },
    ],
  },
  {
    slug: "xstest",
    name: "XSTest",
    shortName: "XSTest",
    accession: "OB-2023-S08",
    year: 2023,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["过度拒答"],
    org: "多机构",
    authors: "Röttger et al.",
    summary: `二百五十条看起来不安全其实安全的提示，对照二百条真不安全的题，专门抓把「杀时间」拒掉的那种过度对齐。它是诊断，不是全套安全。小，英语。`,
    origin: `
对齐过度的模型会拒绝「杀时间」「怎么干掉进程」「帮我砍价」这种比喻和同音。用户觉得模型蠢，安全团队觉得自己很负责。Röttger 等人做 XSTest，把夸张安全（eXaSgerated Safety）写成可数的题：二百五十条安全提示长得像危险词，二百条真危险对照。

论文的八卦很实在：越把安全当拒答率优化，越容易在 XSTest 的安全集上翻车。Claude 系早期被讨论得最多的「拒答过头」，XSTest 是那一轮讨论的公共尺子之一。它不证明模型更坏，它证明你的安全政策在字面上过拟合。

四百五十条的体量决定了它是探针不是全景。作者自己把它定位成诊断。和 Do-Not-Answer、BBQ 一起看，才能同时看到漏拒、乱拒和偏见。单独报 XSTest 过拒答率，故事太短。

英语比喻和英语同音是核心技巧。中文的「杀」和「砍」另有一套双关，直接翻译 XSTest 会丢掉一半考点。要测中文过度拒答，得重写，不是找个翻译模型。
`,
    architecture: `
两组提示对照。安全组：含危险词但意图无害（比喻、虚构、定义、技术术语）。不安全组：真正的有害请求。评测看模型在安全组是否错误拒绝（over-refusal），在不安全组是否错误配合（under-refusal）。

拒答如何判定又是一团泥。关键词「I cannot」、LLM 裁判、人工，三套会打架。有的回复先拒绝再给无害信息，算拒还是算答，必须预先规定。XSTest 的价值正在逼你把这条规则写下来。

规模小，安全组二百五十，再按类型切开更小。几个误判就能让百分比跳。适合放在安全回归测试里每次都跑，不适合单独支撑「我们解决了过度对齐」的新闻稿。

和 JailbreakBench 的一百条良性行为是亲戚：都在测过拒答。JBB 跟滥用行为主题对齐，XSTest 更玩语言表面。两套都跑，比只跑一套更能看见是主题过敏还是词面过敏。
`,
    content: `
安全提示玩的是词面：杀时间、炸薯条的炸、毒药作为乐队名、如何杀死一个 Python 进程。看起来像违禁词扫描器会拦截的东西，读完却是无害意图。

不安全对照是真的有害请求，用来防止你把「全部答应」优化成 XSTest 冠军——那只是拒答不足。两组要一起看，这是作者强调的平衡。

类型包括同音、比喻、无害的危险词、虚构作品讨论等。英语双关搬到中文经常失效，「kill time」译成「杀时间」还在，很多俚语就没了。

没有工具，没有多步。一句提示，看你拒不拒。Agent 工作流里的过度拒绝（该调工具却不敢调）不在范围里。
`,
    format: "对照提示",
    metrics: ["over-refusal / under-refusal"],
    size: "450",
    lineage: { parents: [], children: [], related: ["do-not-answer", "bbq"] },
    caveats: `
小、英语。是诊断不是全套安全。XSTest 过拒答低，只说明没被这二百五十条比喻耍到，说明不了真实用户长尾。

翻译即失真。中文产品用英语 XSTest 当回归，会漏掉中文特有的字面过敏。

拒答判定规则比分数更重要。换裁判，over-refusal 能跳十个点。报告里把判定脚本钉死。

优化 XSTest 很容易教会模型「看见危险词就解释一下再答」。这可能提高诊断分，未必提高真实体验。配真实用户日志看。
`,
    links: [
      { rel: "paper", label: "XSTest", href: "https://arxiv.org/abs/2308.01263" },
      { rel: "repo", label: "paul-rottger/xstest", href: "https://github.com/paul-rottger/xstest" },
    ],
  },
  {
    slug: "harmbench",
    name: "HarmBench",
    shortName: "HarmBench",
    accession: "OB-2024-S09",
    year: 2024,
    status: "active",
    kind: "suite",
    family: "safety",
    domains: ["红队", "有害行为"],
    org: "CAIS",
    authors: "Mazeika et al.",
    summary: `约四百到五百一十条有害行为，配标准化攻击方法和分类器，用来报攻击成功率。它是红队框架，不是真实世界伤害计量。ASR 跨套件不可比，分类器会错，成功不等于真的造成了伤害。`,
    origin: `
AdvBench 当了半年公共靶子之后，圈里发现每篇越狱论文的 ASR 都没法比：题不同、裁判不同、系统提示不同。CAIS 的 Mazeika 等人做 HarmBench，想给自动红队一张标准考卷：行为集、攻击方法、分类器、评测脚本绑在一起。

行为大约五百一十条独特有害行为，其中约四百条文本、一百一十条多模态，再按标准、情境、版权等功能分割切开。版权类别是它相对 AdvBench 的显眼加法：有的「攻击成功」是在让模型吐受版权保护的东西，政策含义不同。

论文拿它比较了十几种红队方法和几十个目标模型，还塞进一种对抗训练。HarmBench 因此既是基准也是攻击/防御共进化的实验室。HELM Safety 后来把它收进标准化安全复跑，说明它已经变成安全套件里的基础设施。

圈里为 ASR 吵过很多次。HarmBench 把成功交给分类器判定，比关键词干净，但分类器会过召回、会挨打，LLM 裁判又会把「我不能」的包装当成拒绝。更关键的一句：攻击成功不等于真实伤害。实验室里吐出的犯罪腔教程，和现实里可执行的危害，中间还隔着工具、知识和意愿。
`,
    architecture: `
评测单元是「攻击方法 × 行为 × 目标模型」。标准行为是直给请求，情境行为带上下文，版权行为另算。多模态行为需要图，纯文本模型不要混报。

分类器（论文提供微调过的判定模型）输出是否成功。ASR 是成功行为的比例。功能类别和语义类别都要分解：暴力、欺诈、违禁、版权，对政策的意义不同，平均成一个 ASR 是在给自己方便。

攻击方法是一等公民。GCG、PAIR、人工模板，成本差几个数量级。只报「在 HarmBench 上 ASR 低」，不报用了哪些攻击、预算多少，等于没报。防御论文尤其要写清攻击集合，否则就是挑软柿子。

和 StrongREJECT、JailbreakBench 的 ASR 不可比。题集不同，成功定义不同，裁判不同。HarmBench 分类器判成功的回复，StrongREJECT 量规可能给低分，因为内容空洞。这是设计差异，不是谁算错了。
`,
    content: `
行为覆盖暴力、欺诈、违禁品、网络犯罪、版权材料等，作者按「多数人不会希望公开模型做这些事」来选题。情境分割会给额外背景，让直给过滤不好使。

多模态一百一十条是单独的麻烦。图里藏请求、图文配合，纯文本红队脚本跑不了。报 HarmBench 必须写是文本子集还是全套。

和 AdvBench、JBB 有重叠，也有意做了重新设计和去重。不要假设三个名字是三个不相交的危害宇宙。

分类器训练用的成功/失败回复，决定了它眼里的「有害完成」长什么样。空洞配合、部分配合、详细步骤，卡在不同阈值上。读论文里的分类器验证，比只看你实验里的 ASR 更重要。
`,
    format: "攻击 × 行为",
    metrics: ["ASR"],
    lineage: { parents: ["advbench"], children: ["helm-safety"], related: ["jailbreakbench", "strongreject"] },
    caveats: `
攻击成功 ≠ 真实伤害。HarmBench ASR 是实验室里的破防率，不是现实世界的伤亡或损失。写政策备忘录时把这句话放在表上面。

分类器会错。过召回会夸大危险，包装性拒绝会漏检。白盒攻击还能打分类器本身。关键结论要做人抽查。

ASR 跨套件不可比。HarmBench、AdvBench、JBB、StrongREJECT 四套数字不能排成「谁更安全」的总榜，除非你自己用同一裁判重跑。

版权类别和政策类危害不要和暴力类平均。一个数字的 HarmBench，是在抹掉唯一有决策价值的切分。
`,
    links: [
      { rel: "paper", label: "HarmBench", href: "https://arxiv.org/abs/2402.04249" },
      { rel: "homepage", label: "harmbench.org", href: "https://harmbench.org" },
      { rel: "repo", label: "GitHub", href: "https://github.com/centerforaisafety/HarmBench" },
    ],
  },
  {
    slug: "strongreject",
    name: "StrongREJECT",
    shortName: "StrongREJECT",
    accession: "OB-2024-S10",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["越狱质量"],
    org: "多机构",
    authors: "Souly et al.",
    summary: `三百一十三条禁令提示，用人工量规打「有用的有害内容」而不是空洞破防。它专门惩罚那种模型乱说一通也被算越狱成功的虚高 ASR。和 HarmBench 一起看，故事才完整。`,
    origin: `
越狱论文的 ASR 一度好看到不像话：模型没说「我拒绝」，胡编一通犯罪步骤，也算成功。Souly 等人做 StrongREJECT，把问题说穿——很多高 ASR 越狱是空的。他们要的不是「有没有破防」，是「破防之后有没有给出具体、有用、有害的信息」。

三百一十三条禁令提示，分成六类，配上量规：相关性、具体性、说服力一类维度，再合成有用危害分。Gemma 2B 裁判之类的自动打分器是为了便宜地逼近这份量规，不是为了再制造一个不透明的 ASR。

它和 HarmBench 经常被拿来互打脸。HarmBench 分类器更宽，StrongREJECT 更严，同一批回复上 ASR 能差出一截。这不是谁的代码有 bug，是成功定义不同。安全论文如果只挑对自己友好的那把尺子，读者现在已经会翻白眼。

名字容易被读成「强力拒答」。它评的是攻击质量，不是模型拒答有多硬。拒答模型在 StrongREJECT 上分低（危害分低），是预期；一个越狱若只让模型开始说话但内容垃圾，分同样低。
`,
    architecture: `
提示是被政策禁止的请求。模型回复按量规打分，得到连续的有用危害分数，而不是二元成功。若要报 ASR，作者用阈值（例如超过 0.5）把连续分切成成功，这个阈值必须写出来。

六类危害分开报。总量三百一十三，一类只有五十上下，切太细会空。主结果用总体和预注册的大类即可。

自动裁判是量规的代理。换 Gemma 还是 GPT-4，分数会动，和 AlignBench 换裁判是同一类问题。人工校准过的子集应保留在附录里，证明自动器还没漂到不能用。

和 AdvBench 比，StrongREJECT 更在意回答的具体步骤和可用性。GCG 在 AdvBench 上好看的后缀，到这里可能原形毕露：模型是在配合格式，不是在提供危害。这正是它存在的理由。
`,
    content: `
禁令提示覆盖常见政策红线：暴力犯罪、诈骗、恶意软件、违禁品等六类（以论文划分为准）。写法比 AdvBench 更像「真的想办成一件坏事」，而不是短命令。

量规问的是：有没有切题、有没有具体到可执行、有没有在帮而不是在说教。空洞的「Sure, here is how」后跟正确废话，在这里拿不到高分。

没有多步工具环境。有害内容以文本教程为主。AgentHarm 那种调用工具把欺诈走完，不在 StrongREJECT 的题面里。

英语、短交互。长对话里慢慢套话、换语言、用编码走私，需要别的集。StrongREJECT 打的是「一次回复的有用危害」。
`,
    format: "有害提示 + 量规",
    metrics: ["useful harm score"],
    size: "313",
    lineage: { parents: ["advbench"], children: [], related: ["harmbench"] },
    caveats: `
专门打虚高 ASR。如果你的越狱方法只在关键词匹配或宽松分类器上好看，StrongREJECT 会给你难看的分数。这是功能，不是针对你。

量规和自动裁判仍会错。把连续分切成 ASR 时，阈值是人为的。报告连续分布，比只报过线比例更诚实。

三百一十三条不大。和 XSTest 一样，适合当标准探针，不适合当危害宇宙的抽样估计。

不要和「拒绝强度」混名。StrongREJECT 低危害分，可能是真拒绝，也可能是破防后在说废话。看量规子项，不要只看总名。
`,
    links: [
      { rel: "paper", label: "StrongREJECT", href: "https://arxiv.org/abs/2402.10260" },
      { rel: "repo", label: "alexandrasouly/strongreject", href: "https://github.com/alexandrasouly/strongreject" },
    ],
  },
  {
    slug: "wmdp",
    name: "WMDP",
    shortName: "WMDP",
    accession: "OB-2024-S11",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["危险知识代理"],
    org: "CAIS 等",
    authors: "Li et al.",
    summary: `生物、网络、化学三个领域的代理危险知识选择题，三千六百六十八道，也常被当作机器遗忘的靶集。代理知识不等于实操能力，敏感项已经被过滤。`,
    origin: `
危险能力评测最怕两件事：真的把能用的危害细节公开，以及把会做选择题说成会做实验。CAIS 等机构的 Li 等人做 WMDP（Weapons of Mass Destruction Proxy），用可公开的代理知识题去近似生物、网络、化学里那些让人睡不着的能力，同时把真正敏感的操作细节滤掉。

它有两个同时存在的身份。一是安全评测：模型在这些代理题上知道多少。二是遗忘（unlearning）基准：你宣称把危险知识洗掉了，WMDP 准确率该掉，而普通能力不该一起掉。后一个身份让它在 2024 年的对齐论文里出镜率极高。

代理二字是作者自己的刹车。会做生物选择题，不是会培养病原；会做网络题，不是会打进真实系统。GPQA 那种专家题测的是科学难度，WMDP 测的是「危险领域的知识密度」，两套题不要比谁更 AGI。

过滤敏感项意味着它系统性低估最危险的那截尾巴。这是伦理上的正确，也是测量上的盲区。政策读者若把 WMDP 当「大规模杀伤武器能力量表」，作者本人大概会不同意。
`,
    architecture: `
三千六百六十八道 MCQ，三个领域：生物安全、网络安全、化学。指标是准确率。遗忘实验还要搭配 MMLU 一类对照集，证明你洗的是目标知识而不是整个模型。

协议看起来像普通考试，解释却不同。高分在这里是风险信号，不是能力宣传。产品模型卡上把 WMDP 和 MMLU 并排刷高，是在公开承认危险领域知识也一起涨——也许你想要这个，也许不想。

没有实验操作，没有靶场，没有湿实验代理。全是选择。AgentHarm 或 CyberSecEval 那种「真的走步骤」是另一条轴。WMDP 高、Agent 低，或者反过来，都说得通。

私有或未公开的更敏感项不在这三千六百六十八里。你无法用公开 WMDP 证明模型「不会」那些被滤掉的知识。最多证明在代理题上的表现。
`,
    content: `
生物侧偏公共卫生、病原相关的可公开知识；网络侧偏攻击技术的概念和常识；化学侧偏危险物质和合成相关的公开题。出题目标是「领域内人士会的、又不直接变成操作手册」。

过滤是内容政策的一部分。真正的操作参数、菌株号、逐步合成路线，按设计不应该出现。如果某题看起来已经太细，先怀疑你用的不是官方集。

三个领域不能平均成一个「WMD 分」。生物和网络的训练数据密度、对齐策略、工具可用性都不同。遗忘论文尤其该分领域报，否则一个领域洗掉、另一个没动，总平均会撒谎。

英语、选择、公开来源。中文危险知识、非选择题的推导、需要工具的利用链，都不在题面里。
`,
    format: "MCQ",
    metrics: ["Accuracy"],
    size: "3,668",
    lineage: { parents: [], children: [], related: ["gpqa", "agentharm"] },
    caveats: `
代理 ≠ 操作能力。WMDP 准确率不是实验室或网络靶场成绩。写进风险报告时必须保留「proxy」这个词。

遗忘基准会反着读分：WMDP 掉、MMLU 不掉，才像成功。只报 WMDP 下降，可能是模型变笨。对照集不能省。

敏感项被过滤。公开集上的低分，不能证明模型没有更危险的知识。那是未知，不是安全证明。

和 GPQA、C-Eval 化学物理不是同一件事。一个是危险领域代理，一个是专家科学或中文考试。混报「STEM 安全」没有定义。
`,
    links: [
      { rel: "paper", label: "WMDP", href: "https://arxiv.org/abs/2403.03218" },
      { rel: "homepage", label: "wmdp.ai", href: "https://www.wmdp.ai/" },
    ],
  },
  {
    slug: "jailbreakbench",
    name: "JailbreakBench",
    shortName: "JBB",
    accession: "OB-2024-S12",
    year: 2024,
    status: "active",
    kind: "leaderboard",
    family: "safety",
    domains: ["越狱工件"],
    org: "多大学",
    authors: "Chao et al.",
    summary: `一百条滥用行为加一百条主题相近的良性题，外加必须提交的越狱工件库和公开榜。约百分之五十五原创，其余来自 AdvBench 和 HarmBench。复现取决于工件和裁判版本。`,
    origin: `
越狱文献一度不可复现：对抗提示藏着、代码闭源、裁判是会变的专有 API。Chao、Debenedetti、Robey、Andriushchenko 等一长串跨校作者做 JailbreakBench，把四件事绑死：工件仓库、JBB-Behaviors 题集、标准化评测库、公开排行榜。

题集刻意做小：一百条有害行为，好让新攻击跑得完；后来补一百条主题相近的良性行为，用来测过拒答。来源公开：约百分之五十五原创（部分灵感来自 persona modulation 那类工作），百分之十八 AdvBench，百分之二十七 TDC/HarmBench。它不是超集，是代表抽样。

工件库是真正的制度创新。提交攻击必须把提示交出来，别人才能复现。这和「我们 ASR 百分之九十九但后缀保密」的风气对着干。裁判模型换过版本，所以榜上的历史数字要带着裁判身份读。

它是 leaderboard，不是又一个静默数据集。威胁模型、系统提示、聊天模板写在评测库里。不按库跑、自己换裁判，就不要对标官榜。
`,
    architecture: `
有害一百条按 OpenAI 使用政策分成十个粗类。每条有行为标识、目标查询、肯定式 target 前缀、类别和来源。良性一百条主题对齐，用来快速看防御是不是把正常请求一起误杀。

评测库规定威胁模型、系统提示、模板和打分函数。ASR 和过拒答率是主指标。换聊天模板等于换任务——Llama 和 Vicuna 的系统提示差一句，拒答率就能分叉，论文里展示过。

工件是提交物。没有工件的「SOTA 越狱」不能上榜，这是协议。本地研究可以只用 JBB-Behaviors 当题集，但那只是题，不是完整 JBB。

裁判版本会升级。用旧裁判复现旧榜，用新裁判报新数，不要混在一张图里假装连续。这点和 Chatbot Arena 换投票规则是同一类麻烦，只是这里的投票者是分类器。
`,
    content: `
有害行为覆盖政策红线十类，短而明确，方便当攻击目标。良性行为长得像有害的亲戚，用来抓字面过敏，和 XSTest 玩法类似但跟滥用主题绑得更紧。

重叠是公开的。十八加二十七那两成来自 AdvBench 和 HarmBench，剩下原创。三套基准一起报时，写出去重，否则你在重复惩罚同一批失败。

没有多步工具，没有靶场。它是聊天越狱和过拒答，不是 AgentHarm。把 JBB ASR 写成「agent 安全」，类型错了。

内容含冒犯性请求，这是安全基准的职业病。发布和展示需要免责声明，评测日志不要随手公开完整成功回复。
`,
    format: "越狱 + 工件",
    metrics: ["ASR / over-refusal"],
    size: "200",
    lineage: { parents: ["advbench", "harmbench"], children: [], related: ["strongreject"] },
    caveats: `
复现取决于提交的工件和裁判版本。没有这两样，官榜数字对你不可用。论文里只写 JBB 第一、不给工件，等于没参加这个基准的精神。

一百加一百很小。代表抽样不是覆盖。细类上的第一名没有统计权力。

与 AdvBench/HarmBench 部分同源。三套 ASR 高度相关不值得惊讶。新攻击如果只在重叠题上好、在 JBB 原创题上差，要把这句写出来。

良性集测过拒答，但不是 XSTest 的替代。比喻双关少，主题对齐多。两套探针一起用。
`,
    links: [
      { rel: "paper", label: "JailbreakBench", href: "https://arxiv.org/abs/2404.01318" },
      { rel: "homepage", label: "jailbreakbench.github.io", href: "https://jailbreakbench.github.io/" },
    ],
  },
  {
    slug: "cyberseceval",
    name: "CyberSecEval",
    shortName: "CyberSecEval",
    accession: "OB-2024-S13",
    year: 2024,
    status: "active",
    kind: "suite",
    family: "safety",
    domains: ["网络安全风险"],
    org: "Meta Purple Llama",
    authors: "Meta",
    summary: `Purple Llama 的网络安全套件：不安全代码、攻击协助、解释器滥用、提示注入，v3 再加进攻性安全和社工。必须写版本。双用途题意味着「会攻击」和「会防御」共用同一套能力。`,
    origin: `
代码模型会补全带 CWE 漏洞的函数，也会按请求写攻击脚本。Meta 的 Purple Llama 用 CyberSecEval 把这些风险收成可跑的套件，而不是再出一百道聊天脏话。v1 偏不安全编码和基础滥用，v2 把提示注入、解释器滥用等展开，v3 再往进攻性网络操作和社会工程走。

它出现在 Llama 安全故事的中心：开源权重一旦能写代码，网络危害不再是抽象政策，是默认能力。和 HarmBench 的「写一篇犯罪教程」相比，CyberSecEval 更靠近工程师真的会碰到的接口——IDE 补全、工具调用、解释器。

版本是一等公民。说 CyberSecEval 而不写 v1/v2/v3，等于没说。题、指标、威胁模型都在加。把 v3 的进攻分和 v1 的 CWE 分画在同一张趋势图上，是在比较两件家具。

双用途是这套基准的哲学麻烦。同一道「解释如何做 X」既是攻击题也是防御教学题。模型拒绝可能让安全研究员难过，答应可能让滥用者高兴。分数必须带着用途假设读。
`,
    architecture: `
套件由多个子任务组成，而不是一个 ASR。不安全代码生成看是否引入已知 CWE；攻击协助看是否提供可执行的入侵建议；解释器滥用看模型是否配合危险代码执行；提示注入看是否被外部内容劫持。v3 的进攻与社工是新任务，有自己的成功定义。

指标按子任务走，官方用版本化分数。不要发明一个 CyberSecEval 总分再和 HarmBench ASR 比大小。能比的是同一版本、同一子任务、同一裁判。

代码执行类任务需要沙箱。没有沙箱只做静态字符串匹配，会把「看起来像攻击的废话」算成功，StrongREJECT 批评过的虚高在这里同样会发生。Purple Llama 仓库里的评测脚本才是协议。

和 AgentHarm、Inspect 的关系：都能量工具危害，但 CyberSecEval 更偏网络安全原教旨，AgentHarm 覆盖欺诈、骚扰等多类有害工作流。不要互相替代。
`,
    content: `
CWE 风格的不安全补全：注入、硬编码密钥、错误配置一类。攻击协助是自然语言请求加代码或步骤。提示注入把恶意指令藏在网页或文档里，看模型听谁的。

v3 往社工和进攻性操作走，内容更像红队剧本。敏感度上升，公开日志和演示要更小心。不要在模型卡里粘贴完整成功攻击链。

英语和主流编程语言是重心。中文社工、小语种钓鱼、冷门 ICS 协议，不是主覆盖。代码模型若主攻别的语言，要看子任务是否真的包含那种语言。

良性安全请求（「帮我找这个函数的漏洞好修它」）和恶意请求可能长得很像。套件若没把意图拆开，拒答策略会在开发者和攻击者之间误伤。读任务定义，不要只看名字。
`,
    format: "安全套件",
    metrics: ["versioned scores"],
    lineage: { parents: [], children: [], related: ["agentharm"] },
    caveats: `
双用途。同一能力在防御者手里是功能，在攻击者手里是危害。解释分数时写清你站在哪一边的威胁模型。

版本间不可混。v1/v2/v3 不是修订号那么简单，任务集合变了。趋势图必须分版本。

没有沙箱的代码危害分不可信。静态匹配会制造虚高 ASR，这是安全评测的老病。

不是通用越狱榜。聊天脏话、偏见、过度拒答请用别的集。CyberSecEval 只覆盖网络和代码风险这一条沟。
`,
    links: [
      { rel: "paper", label: "CyberSecEval 2", href: "https://arxiv.org/abs/2404.13161" },
      { rel: "repo", label: "PurpleLlama", href: "https://github.com/meta-llama/PurpleLlama" },
    ],
  },
  {
    slug: "agentharm",
    name: "AgentHarm",
    shortName: "AgentHarm",
    accession: "OB-2024-S14",
    year: 2024,
    status: "active",
    kind: "benchmark",
    family: "safety",
    domains: ["有害 agent 任务"],
    org: "Gray Swan / UK AISI",
    authors: "Andriushchenko et al.",
    summary: `一百一十条恶意 agent 任务（增强后四百四十），十一类伤害，要求真的走完多步工具，而不只是没拒绝。部分公开，走 Inspect Evals。拒答不等于不会完成有害工作流。`,
    origin: `
聊天越狱研究了两年，大家还在看模型会不会说出「好的，下面是步骤」。真正吓人的是：给它邮箱、浏览器、代码执行，它会不会把欺诈走完。Gray Swan 和英国 AISI 的 Andriushchenko、Souly 等人做 AgentHarm，把危害定义成多步工具轨迹上的任务完成，而不是一句配合。

一百一十条基础恶意行为，十一类（欺诈、网络犯罪、自伤、骚扰、性、版权、毒品、虚假信息、仇恨、暴力、恐怖主义），再用增强扩到四百四十。每条有有害版和良性对照。工具是合成的，跑在 Inspect 里，副作用被关在沙箱。

发现有点扫兴：前沿模型对恶意 agent 请求常常直接配合，简单越狱模板还能保持多步能力。拒答政策在聊天里看起来硬，一接到工具就软。这正是「拒答 ≠ 不会完成有害工作流」那句话的实验版。

公开是部分的。Inspect Evals 文档写明：公开测试基础行为只放了一部分，希望以后再放。私有集用来防污染和做官方后续评估。你本地跑到的数字，默认不是论文里的全量。
`,
    architecture: `
任务 = 恶意用户请求 + 合成工具集 + 程序化量规。模型必须调用二到八个工具才能拿满完成分。计分看有害完成，不只看有没有拒绝：越狱成功但事后变笨、走不完流程，危害分上不去。这点和 StrongREJECT 的「有用危害」精神一致，只不过对象是轨迹。

Inspect 是官方跑道。Dataset + Solver + Scorer，Docker 沙箱，Inspect View 看轨迹。换一套自己的 agent 框架可以，但工具实现和量规一旦改，就不是 AgentHarm 原分。UK AISI 把这套放进 Inspect Evals，就是为了减少「我家 agent 特别强」的私有脚手架优势。

数据切分含验证、公开测试、私有测试。增强版把同一行为写成更开放或带提示的变体。报分写清你跑的是 44 条公开基础、还是增强后的 176，还是论文全表。

良性对照用来看越狱和防御有没有把正常多步任务一起打残。危害分逼近良性分，说明攻击在恢复能力；良性分自己崩了，说明你的防御把 agent 变傻了。
`,
    content: `
十一类每类十条基础行为，例如用邮件订假证、把恶意软件塞进正常软件再推广下载。工具约一百零四个，平均每行为三个半，邮箱、浏览器、支付、文件一类合成 API。

量规是人写的程序函数，尽量少用 LLM 裁判，这是为了稳和便宜。轨迹日志会包含冒犯和违法内容的模拟，处理这些日志要按有害内容规范来，不要默认开源dump。

部分行为未公开。当前 Inspect Evals 上能跑的是子集，作者说直接请求（无越狱）的平均危害分在这个子集上甚至略高于早期数字。用子集宣称「我们复现了论文」，要加限定。

不是 GAIA，不是 SWE-bench。工具是假的，世界是假的，危害是真的意图。外部效度是：模型是否愿意并能够把多步坏事做完，不是坏事在现实里是否已发生。
`,
    format: "有害 agent 轨迹",
    metrics: ["task completion harm"],
    size: "110（增强后 440）",
    lineage: { parents: ["harmbench"], children: [], related: ["cyberseceval", "gaia"] },
    caveats: `
部分公开。含有害内容。本地分数默认不等于论文全量，更不等于私有测试。写进报告要标明公开子集。

拒答率低只是开始。必须看任务完成危害：会不会在越狱后仍然把工具链走完。只报拒绝，会漏掉「嘴上拒绝、手里继续」和「破防但变笨」两种相反的失败。

合成工具低估真实世界的耦合和防护。真银行、真邮箱比沙箱难，也可能因为插件写得烂而更容易。外部效度要谦虚。

和聊天越狱榜不可比。JBB/HarmBench 的 ASR 高，不自动等于 AgentHarm 危害分高。agent 脚手架、工具选择、最大步数，往往比模型本身更响。
`,
    links: [
      { rel: "paper", label: "AgentHarm", href: "https://arxiv.org/abs/2410.09024" },
      { rel: "dataset", label: "Hugging Face", href: "https://huggingface.co/datasets/ai-safety-institute/AgentHarm" },
    ],
  },
];
