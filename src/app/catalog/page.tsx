import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog-explorer";
import { benchmarks } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "总目",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
        Catalogue
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        总目
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        先按分科、状态、类型滤，再按年份、编号、名称或分科排序。默认是柜子年表：旧的在前。想看现在在测什么，点方向按钮翻成「新 → 旧」。同一颗排序键再点一次也会掉头。检索框只做现场过滤，不会进详情。想按八卦线索找（污染、越狱、仓库补丁），用右上角 Cmd+K 或按 /。
      </p>
      <div className="mt-8">
        <CatalogExplorer items={benchmarks} />
      </div>
    </div>
  );
}
