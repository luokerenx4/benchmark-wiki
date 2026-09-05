import type { Family, FamilyId } from "@/lib/types";

export const families: Family[] = [
  {
    id: "knowledge",
    name: "知识与推理",
    nameEn: "Knowledge",
    drawer: "Drawer A",
    thesis: "闭卷考试如何变成模型的世界知识量表。",
    blurb:
      "这条抽屉最容易被误读成“模型聪明不聪明”。它真正量的是：合上书以后，模型还能不能把世界上已经写下来的事实、常识和考卷题做对。\n\n故事很短。2018 年以前大家考句对分类，BERT 几个月把 GLUE 刷穿。于是考卷升级成小学科学、大学五十七科、博士出的 Google-proof 题，再到号称人类最后一场考试。2025 年 SuperGPQA 把研究生卷摊到 285 个学科；2026 年 ARC-AGI-3 干脆不发考卷，改成没说明书的交互环境。每一次加难，过两年又被做满——除非尺子自己先换单位。\n\n读这只抽屉，要盯两件事。第一，选择题会猜，生成题会胡编，两套分数不能兑。第二，公开题几乎一定进过语料。LiveBench、HLE、GPQA Diamond 都是在跟记忆赛跑，不是在发明一种新的智力。",
  },
  {
    id: "coding",
    name: "代码与工程",
    nameEn: "Coding",
    drawer: "Drawer B",
    thesis: "从函数补全走到仓库级修 bug。",
    blurb:
      "编码评测的单位一直在变大，这比“分数涨了”更重要。HumanEval 是补全一个十行函数；MBPP 是听一句人话写个小函数；SWE-bench 是对着真实 GitHub issue 打补丁；Terminal-Bench 则把整台电脑的命令行当成考场。\n\n2025 年以后这只抽屉明显活了。SWE-bench Verified 被做到接近卫生检查，大家改报滚动的 Live / rebench、企业仓 Pro、科学仓 Science。Proximal 的 FrontierSWE 把尺子做成网站：三十四道有名字的项目，一题二十小时，美元和墙钟印在主表上。竞赛侧 LiveCodeBench 也加了一档奥赛卷 Pro。静态 12 个 Python 仓已经不够当故事。\n\n看这只抽屉，先问评测单元是函数、竞赛、仓库还是终端，再问脚手架和版本号。SWE-bench 的数字里，agent 框架、重试次数和美元预算往往比模型本身更响。",
  },
  {
    id: "math",
    name: "数学与科学",
    nameEn: "Math",
    drawer: "Drawer C",
    thesis: "年级应用题耗尽之后，竞赛与形式化接棒。",
    blurb:
      "数学评测有一条很清楚的逃跑路线。GSM8K 是小学应用题，一度难倒大模型，现在前沿模型闭着眼也能做。MATH 是高中竞赛，带完整解答；不够了就上 AIME，再不够就上 Epoch 锁在保险柜里的 FrontierMath。\n\n另一条线不看填空，看证明。miniF2F、PutnamBench、FormalMATH 要的是 Lean 内核点头，不是 boxed 数字碰巧对了。过程监督则问：你是做对了，还是第一步就错、最后蒙对的？\n\n科学这边更杂。SciBench 是大学作业，LAB-Bench 是实验室技能的代理题。别把“会做化学选择题”说成“会做实验”。",
  },
  {
    id: "agents",
    name: "智能体与工具",
    nameEn: "Agents",
    drawer: "Drawer D",
    thesis: "评测对象从一次补全变成一条轨迹。",
    blurb:
      "智能体评测的麻烦在于：你很难把环境带回家。WebArena 要自托管一整站；OSWorld 要虚拟机；GAIA 的测试标签不公开；τ-bench 还得雇一个用户模拟器陪聊。分数里混着模型、工具、浏览器和运气。\n\n2025–2026 大家真正在报的，已经不是一次 JSON 对不对。BrowseComp 考活网上的冷门深搜；OSWorld 2.0 把工作流拉到小时级；MCP-Universe 和 MCP-Atlas 把考场换成真 MCP 服务器；GDPval 干脆按美国 GDP 行业收职业交付物。工具协议从函数调用变成了生产接口。\n\n读这只抽屉，把“一次调用对了”和“一条轨迹做完了”分开。再把沙箱网页和真互联网分开。WebVoyager 在活网站上跑，明天页面改版，昨天的 SOTA 就作废。",
  },
  {
    id: "multimodal",
    name: "多模态",
    nameEn: "Multimodal",
    drawer: "Drawer E",
    thesis: "图、表、文档、视频各自有一套计量。",
    blurb:
      "多模态评测最大的丑闻不是模型差，是题可以不看图。MMStar、MMMU-Pro 都在抓这件事：把纯文本就能做的题踢出去，甚至把整页卷子截成图，逼模型真的去“看”。\n\n另一头是老任务。DocVQA、ChartQA、TextVQA 从 OCR 年代活到现在，很多已经进了 VLM 的训练配方。lmms-eval 公开过 ChartQA 和 LLaVA 数据的图像重叠，读分时要当污染，不当神迹。\n\n视频是第三套尺子。MVBench 故意让单帧失败，EgoSchema 要看三分钟第一人称，Video-MME 还得声明有没有字幕。同一份“视频理解”，三个数字说的不是一件事。",
  },
  {
    id: "chinese",
    name: "中文与多语",
    nameEn: "Chinese",
    drawer: "Drawer F",
    thesis: "英文考卷不能代表其他语言的能力。",
    blurb:
      "中文评测有自己的史前史。CLUE 是中文 GLUE，BERT 时代就打穿了。大模型来了以后，C-Eval 和 CMMLU 把大学/高考/法考搬进来，变成国内发模型几乎必报的两栏。它们和 MMLU 长得像，题却更中国：公务员、中医、中国法律。\n\n聊天和对齐是另一路。AlignBench、SuperCLUE 用裁判模型打中文助手，不走选择题。翻译过来的 MT-Bench 不算数，中文场景的“好用”和英文 Arena 不是同一个用户群。\n\n多语更扎人。INCLUDE 用地方试卷，Global-MMLU 是翻译加文化标签。只看英文 MMLU 的人，会系统性高估模型在别的语言里到底知道什么。",
  },
  {
    id: "longcontext",
    name: "长上下文",
    nameEn: "Long context",
    drawer: "Drawer G",
    thesis: "窗口变长之后，真正被测的是检索与综合。",
    blurb:
      "一百万 token 的广告，经常只通过了“草堆里找一根针”。Needle-in-a-Haystack 是 Greg Kamradt 的探针，不是考试。它能告诉你模型会不会在某个深度把那句话背回来，不能告诉你它读懂了合同。\n\nRULER 把探针升级成多针、追踪、聚合。LongBench 换成真人写的长文档。∞Bench 平均二十万 token。LongBench v2 难到人类限时也只有一半。\n\n窗口数字和有效上下文不是一回事。模型可以在 128k 处还记得针，却在 32k 处就已经不会数频繁词。报长度，不如报任务。",
  },
  {
    id: "safety",
    name: "安全与对齐",
    nameEn: "Safety",
    drawer: "Drawer H",
    thesis: "拒绝、越狱、偏见与危险能力需要分开计量。",
    blurb:
      "“安全分”是个假朋友。续写会不会骂人、会不会拒答、拒答会不会过火、越狱能不能套出真有用的坏东西、会不会在信息不足时倒向刻板印象、会不会完成一套有害工作流——这些是不同的机制。\n\n圈里为攻击成功率吵过很多次。有的评测只要模型没拒绝就算成功，于是一堆空洞胡话把 ASR 刷上去。StrongREJECT 专门打这种虚高。JailbreakBench 则要求把攻击工件交出来，好让别人复现。\n\nXSTest 提醒另一面：把“杀时间”拒掉的模型，不是更安全，是更好面子。安全评测要同时看漏拒和乱拒。",
  },
  {
    id: "harnesses",
    name: "套件 · 框架 · 索引",
    nameEn: "Harnesses",
    drawer: "Drawer I",
    thesis: "题目在数据集里，分数出在框架里。",
    blurb:
      "同样叫 MMLU，lm-eval、HELM、simple-evals、OpenCompass 可以差出好几个点。差在 prompt、选项顺序、要不要 CoT、答案怎么抽。所以这只抽屉不放考卷，放跑分的人。\n\n公开榜是另一层政治。Open LLM Leaderboard 火过、被刷过、改过协议、然后退役。Chatbot Arena 测的是人更想用谁，不是谁更会考试。Papers with Code 适合找仓库，不适合当分数真相。\n\n把 harness 和 benchmark 混在一张表里，是评测文章最常见的偷懒。资料柜把它们分开，就是为了让你先问：这分是谁跑的、哪一版、哪种喂法。",
  },
  {
    id: "orgs",
    name: "出题机构",
    nameEn: "Labs",
    drawer: "Drawer J",
    thesis: "尺子是谁造的，比分数更先问。",
    blurb:
      "考卷不会自己从 arXiv 里长出来。有人出题、有人养环境、有人把分数锁在自家跑道上。这只抽屉收的是出题的组织，不是又一张 MMLU。\n\n读法很短。先看他们卖的是考卷、活榜，还是训练数据的副产品。再看自家 harness：OpenAI 有 simple-evals，Harbor 有 Harbor，Proximal 有 proximus。同一模型换跑道，名次可以翻。\n\n机构不是中立气象站。谁出题、谁评分、谁被测，经常是同一栋楼里的三个工位。出品清单在出品栏，自家跑道单独挂牌。",
  },
];

export const familyById: Record<FamilyId, Family> = Object.fromEntries(
  families.map((family) => [family.id, family]),
) as Record<FamilyId, Family>;
