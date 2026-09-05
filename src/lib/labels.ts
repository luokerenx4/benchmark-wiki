import type { FamilyId, Kind, LinkRel, Status } from "@/lib/types";

export const statusLabel: Record<Status, string> = {
  active: "在用",
  foundational: "奠基",
  superseded: "被取代",
  contested: "有争议",
  live: "滚动",
};

export const kindLabel: Record<Kind, string> = {
  benchmark: "考卷",
  suite: "套件",
  harness: "框架",
  leaderboard: "榜单",
  index: "索引",
  org: "机构",
};

export const linkRelLabel: Record<LinkRel, string> = {
  paper: "论文",
  repo: "仓库",
  dataset: "数据集",
  homepage: "主页",
  leaderboard: "榜单",
  harness: "评测框架",
  index: "索引",
};

export const familyTone: Record<FamilyId, string> = {
  knowledge: "知识",
  coding: "代码",
  math: "数学",
  agents: "智能体",
  multimodal: "多模态",
  chinese: "中文",
  longcontext: "长文",
  safety: "安全",
  harnesses: "框架",
  orgs: "机构",
};

export const nav = [
  { href: "/", label: "标本柜" },
  { href: "/catalog", label: "总目" },
  { href: "/lineage", label: "谱系" },
  { href: "/indexes", label: "索引" },
  { href: "/about", label: "读法" },
] as const;
