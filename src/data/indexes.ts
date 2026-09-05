import type { IndexSource } from "@/lib/types";

export const indexes: IndexSource[] = [
  {
    slug: "lm-eval-harness",
    name: "EleutherAI lm-evaluation-harness",
    kind: "harness",
    blurb:
      "开源圈跑 MMLU、GSM8K、BBH 的默认厨房。你在论文附录里看到的“我们用 lm-eval”，多半就是它。YAML 任务、公开 prompt、Hugging Face 和 vLLM 后端，把“换个脚本差五分”这件事压到还能吵架的程度。",
    href: "https://github.com/EleutherAI/lm-evaluation-harness",
    goodFor: "复现学术分数、对齐 prompt、本地开源模型",
  },
  {
    slug: "helm",
    name: "Stanford HELM",
    kind: "suite",
    blurb:
      "斯坦福 CRFM 的那句老话：别只报一个准确率。HELM 把校准、鲁棒、公平、毒性、效率摊在同一张卡上，还把原始请求公开。2026 年起官方进入维护模式，旧榜还在，别指望它再给你加新科目。",
    href: "https://crfm.stanford.edu/helm/",
    goodFor: "多指标对照、场景化评测、看原始 prompt",
  },
  {
    slug: "opencompass",
    name: "OpenCompass",
    kind: "harness",
    blurb:
      "上海 AI Lab 的一站式评测栈，中文题覆盖比 Eleuther 深，也是国内发模型时最常被点名的对照表。CompassRank 里混着公开题和私有题，能复现的和不能复现的要分开看。多模态后来拆到 VLMEvalKit。",
    href: "https://github.com/open-compass/opencompass",
    goodFor: "中文任务、国内常用对照、VLM 入口",
  },
  {
    slug: "lighteval",
    name: "Hugging Face LightEval",
    kind: "harness",
    blurb:
      "HF 自己养的轻量评测库，跟 Transformers、模型卡、Spaces 发布流绑得紧。学术论文未必用它当主结果，但开源权重上线前后的自测，经常从这里走。",
    href: "https://github.com/huggingface/lighteval",
    goodFor: "Hugging Face 生态里的可复现评测",
  },
  {
    slug: "inspect-ai",
    name: "UK AISI Inspect",
    kind: "harness",
    blurb:
      "英国 AISI 开源的现代评测框架。任务用 Python 写成 Dataset + Solver + Scorer，适合智能体、工具和安全，而不是再套一层 few-shot 选择题。Docker 沙箱和 Inspect View 是它跟 lm-eval 最大的脾气差别。",
    href: "https://inspect.aisi.org.uk/",
    goodFor: "agent、脚手架、安全场景",
  },
  {
    slug: "openai-simple-evals",
    name: "OpenAI simple-evals",
    kind: "harness",
    blurb:
      "对照 GPT 系技术报告的精简脚本：MMLU、MATH、GPQA、HumanEval，强调零样本加思维链。仓库写明不再积极维护。要用它，是为了对齐报告协议，不是把它当社区平台。",
    href: "https://github.com/openai/simple-evals",
    goodFor: "对齐 OpenAI 技术报告里的喂法",
  },
  {
    slug: "evalplus",
    name: "EvalPlus",
    kind: "harness",
    blurb:
      "专门揭穿“过了官方单测但代码是错的”。HumanEval+ 把测试加到约八十倍，排名会翻。还在写 HumanEval 单独报 pass@1 的人，建议先来这里坐一下。",
    href: "https://github.com/evalplus/evalplus",
    goodFor: "代码评测的测试覆盖、打假阳性",
  },
  {
    slug: "open-llm-leaderboard",
    name: "Open LLM Leaderboard",
    kind: "leaderboard",
    blurb:
      "开源权重最有名的公开榜，已经退役。v1 被刷榜和污染缠死，v2 换成 IFEval、BBH、MATH、GPQA、MMLU-Pro 等。两套平均分不能兑。当历史档案看可以，当 2026 年的真理不行。",
    href: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard",
    goodFor: "理解开源榜怎么火、怎么改、怎么收",
  },
  {
    slug: "lmarena",
    name: "LMArena (Chatbot Arena)",
    kind: "leaderboard",
    blurb:
      "两个人类匿名模型对打，人点哪个更好看。测的是“更想用”，不是“更会考试”。风格、啰嗦、拍马屁都会进 Elo。和 MMLU 放一张图里，是发布会最爱的障眼法，也是它真正有价值的地方：静态考卷测不到的对话手感。",
    href: "https://lmarena.ai",
    goodFor: "对话体验、盲测偏好、风格",
  },
  {
    slug: "papers-with-code",
    name: "Papers with Code",
    kind: "index",
    blurb:
      "论文、代码、SOTA 表的老索引。找官方仓库很快，LLM 数字常常停在上一代。把它当图书馆目录，别当裁判。",
    href: "https://paperswithcode.com/sota",
    goodFor: "溯源论文和官方实现",
  },
  {
    slug: "hf-datasets",
    name: "Hugging Face Datasets",
    kind: "index",
    blurb:
      "现代 benchmark 的默认快递站。社区拷贝会改 split 名、会少字段、会把测试标签提前泄漏。下载前对一下论文里的样本数和许可证，别只搜名字点第一下。",
    href: "https://huggingface.co/datasets",
    goodFor: "下载、核对 split、读 dataset card",
  },
  {
    slug: "artificial-analysis",
    name: "Artificial Analysis",
    kind: "index",
    blurb:
      "把质量、速度、价格拍在一张采购表上。Intelligence Index 的成分会改版。适合选型，不适合写进学术复现。",
    href: "https://artificialanalysis.ai",
    goodFor: "API 模型的质量–成本–延迟对照",
  },
  {
    slug: "epoch-ai",
    name: "Epoch AI",
    kind: "index",
    blurb:
      "做数据、算力和评测趋势的研究机构。FrontierMath 这把最难的数学尺子也出自这里，题大多锁着，数字以 Epoch 自己跑的为准，厂商博客上的“我们内部测了”要打折。",
    href: "https://epoch.ai",
    goodFor: "趋势、数据谱系、高难度数学",
  },
  {
    slug: "vlmevalkit",
    name: "VLMEvalKit",
    kind: "harness",
    blurb:
      "OpenCompass 家族的视觉语言模型工具箱。MMBench、MMMU 这些开源 VLM 论文里的复现，经常从这里出门。和 lmms-eval 是两条平行跑道，同名任务 prompt 不一定一样。",
    href: "https://github.com/open-compass/VLMEvalKit",
    goodFor: "开源 VLM 复现",
  },
  {
    slug: "lmms-eval",
    name: "lmms-eval",
    kind: "harness",
    blurb:
      "多模态版 lm-eval。图、视频、文档一把梭，还公开过训练/测试图像重叠这类扫兴事实。引用时写下 commit 和任务名，YAML 一变分数就变。",
    href: "https://github.com/EvolvingLMMs-Lab/lmms-eval",
    goodFor: "LMM 任务接入、查泄漏",
  },
  {
    slug: "gorilla-bfcl",
    name: "Berkeley Function Calling Leaderboard",
    kind: "leaderboard",
    blurb:
      "工具调用的公开对照。从一次 JSON 对不对，演进到多轮、live API、以及什么时候不该调用。报 BFCL 必须写版本：v1 和 v3 不是同一场考试。",
    href: "https://gorilla.cs.berkeley.edu/leaderboard.html",
    goodFor: "function calling 协议、多轮工具",
  },
  {
    slug: "harbor-hub",
    name: "Harbor Hub",
    kind: "index",
    blurb:
      "Terminal-Bench 原班人马的数据集和跑分中心。2026 年的终端评测几乎都从这里拉版本号：TB 4.0、SWE-rebench 月度切片、各种 Harbor 兼容集。抄数据集标签，比抄论文表格更重要。",
    href: "https://hub.harborframework.com/",
    goodFor: "终端基准版本、并行评测、轨迹",
  },
  {
    slug: "tbench",
    name: "Terminal-Bench",
    kind: "leaderboard",
    blurb:
      "命令行 agent 的活榜。1.0 到 4.0 不是同一张卷，Harbor 是 2.0 起的官方跑道。模型卡只写 Terminal-Bench 不写版本，这一栏可以当装饰。",
    href: "https://www.tbench.ai",
    goodFor: "终端劳动、版本化活榜",
  },
  {
    slug: "swe-bench-live",
    name: "SWE-bench-Live",
    kind: "leaderboard",
    blurb:
      "微软的滚动仓库级修 bug 榜。Lite/Verified 冻住，test 按月加新 issue，后来还有多语言和 Windows。静态 SWE-bench 高、Live 低，是 2025 年以后最常见的打脸组合。",
    href: "https://swe-bench-live.github.io/",
    goodFor: "新 issue、跨语言 SWE、抗污染",
  },
  {
    slug: "frontierswe",
    name: "FrontierSWE",
    kind: "leaderboard",
    blurb:
      "Proximal 的超长程工程活榜。三十四道有名字的项目，一题二十小时，分数旁边是美元和墙钟。点格子能看轨迹。v1 的 dominance 和 v2 的 mean@5 不能兑，默认跑道是 proximus。",
    href: "https://www.frontierswe.com/",
    goodFor: "超长程工程、费用–质量、逐题轨迹",
  },
];
