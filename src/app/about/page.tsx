import type { Metadata } from "next";

import { Prose } from "@/components/prose";

export const metadata: Metadata = {
  title: "读法",
};

const sections = [
  {
    title: "来历",
    body: "一份基准几乎总是在跟上一份基准吵架。GLUE 被刷穿才有 SuperGLUE，HumanEval 测试太薄才有 HumanEval+，MMLU 能背才有 GPQA 和 HLE。来历栏不是年表，是这张考卷诞生时，圈里卡在哪、想打谁的脸。\n\n读的时候问一句：它是在加难度，还是在换单位？加难度是同一件事更难；换单位是函数变成仓库、一次补全变成一条轨迹。两件事被混着吹成“智能跃迁”的次数，比你想的多。\n\n还有一种来历是政治。公开榜会改规则、会退役、会把某项任务默默拿掉。Open LLM Leaderboard 的 DROP 事件就是：计分写错了，排行榜先丢人，论文后解释。",
  },
  {
    title: "结构",
    body: "同一张考卷，零样本、五样本、思维链、用对数概率选题、让模型自由生成再抽答案，分数不能兑。结构栏要写清：题怎么喂、答案怎么判、测试集在谁手里。\n\n换框架等于换考试。lm-eval 默认 prompt 不一定等于原论文。HELM 的 MMLU 和 OpenCompass 的 MMLU 差几个点，是常事，不是谁作弊。看到“我们在 MMLU 上 86.3”，先问哪一版、几 shot、选项有没有打乱。\n\n智能体更狠。Docker 镜像、重试次数、工具权限、美元预算，都会写进同一个百分数。结构栏如果只写“成功率”，等于没写。",
  },
  {
    title: "题面",
    body: "题面决定你能不能拿这个数去外推。MMLU 是闭卷四选一，猜也有 25 分。SWE-bench 是 GitHub issue 加补丁，环境没起来等于零分。Needle-in-a-Haystack 是把一句话塞进长文本再找回来，它不是阅读理解。\n\n好的题面描写应该让你在脑子里看见一道题。看见了，才知道模型是在考试、在修 bug，还是在玩找茬。看不见，分数就是营销。\n\n题面还会过期。竞赛题会泄漏，网页会改版，安全攻击会被模型“认出来”。滚动评测承认这件事；静态集往往假装没有。",
  },
  {
    title: "索引",
    body: "优先论文、官方 GitHub、数据卡、项目主页。Hugging Face 上的社区拷贝经常改 split 名字。Papers with Code 适合找实现，不适合当分数法庭。\n\nArena 测偏好，harness 测复现，私有题测抗记忆。三套数字放一张幻灯片里，是发布会最爱的魔术。\n\n链接会失效，镜像会漂。资料柜给的是入口，不是保证。下载前对一下论文里的样本数和许可证。",
  },
  {
    title: "状态",
    body: "奠基不等于今天还能发论文。SQuAD、GLUE、HellaSwag 都是祖宗，也是已经打穿的尺子。在用，是还有人拿它拉开差距。滚动，是题会换，SOTA 会过期，这是设计。有争议，是构造、计分或污染已经被写进文献。被取代，是连作者都劝你换后继。\n\n一张表上全是 90 分，通常不是模型变神了，是尺子短了。这时该做的不是再报一位小数，是换抽屉。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
        How to read
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        怎么读一份标本
      </h1>
      <Prose
        className="mt-4 text-muted-foreground"
        text={`资料柜不是排行榜。它假设你已经见过太多无法复现的表格：同一栏 MMLU，换个脚本就能差出五分；同一套 SWE-bench，换个 agent 循环就能从个位数跳到三十。所以每份标本固定四栏：来历、结构、题面、索引。编号 OB-年份-分科序号只是柜门上的铭牌，方便对账，不是权威认证。

出题机构单独占一只抽屉。机构页的「跑道」写自家 harness，「出品」写他们放出的考卷和榜。Proximal 的 proximus、OpenAI 的 simple-evals、Harbor 的 Harbor，都是分数的亲爹，不是脚注。

写这些文字的原则很土：宁可啰嗦，也别只丢一个术语。评测圈的黑话（pass@k、ASR、loglikelihood、contamination）会在正文里用大白话再讲一遍。八卦只限于已经公开的事：谁把榜刷穿了、哪项任务因为计分 bug 被拿掉、哪份数据被发现能不看图做。编造题干原文和伪造链接，比写短更糟。`}
      />

      <ol className="mt-10 space-y-10">
        {sections.map((section, index) => (
          <li key={section.title}>
            <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-heading text-xl font-semibold">
              {section.title}
            </h2>
            <Prose text={section.body} className="mt-3" />
          </li>
        ))}
      </ol>
    </div>
  );
}
