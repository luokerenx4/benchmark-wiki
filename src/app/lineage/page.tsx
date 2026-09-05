import type { Metadata } from "next";
import Link from "next/link";

import { families } from "@/data/families";
import { getByFamily } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "谱系",
};

export default function LineagePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
        Lineage
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        谱系
      </h1>
      <p className="prose-specimen mt-4 max-w-3xl text-muted-foreground">
        评测很少凭空出现。GLUE 被刷穿才有 SuperGLUE；MMLU
        能背了才有 GPQA 和 HLE；HumanEval 的十行函数撑不住，才走到
        SWE-bench 的仓库补丁。下面按抽屉把标本按年摊开。点进去看它跟谁吵架、派生了谁。时间从左到右，不是能力从低到高——很多 2018
        年的尺子，今天只剩纪念价值。
      </p>

      <div className="mt-10 space-y-8">
        {families.map((family) => {
          const items = getByFamily(family.id);
          if (items.length === 0) return null;
          return (
            <section key={family.id}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold">
                  {family.name}
                </h2>
                <Link
                  href={`/family/${family.id}`}
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
                >
                  {family.drawer}
                </Link>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{family.thesis}</p>
              <ol className="mt-4 flex flex-wrap gap-2">
                {items
                  .slice()
                  .sort((a, b) => a.year - b.year)
                  .map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/b/${item.slug}`}
                        className="inline-flex items-center gap-2 rounded-md bg-card px-2.5 py-1.5 text-sm ring-1 ring-foreground/10 hover:bg-accent"
                      >
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.year}
                        </span>
                        {item.shortName}
                      </Link>
                    </li>
                  ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
