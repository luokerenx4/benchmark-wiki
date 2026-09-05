import Link from "next/link";

import { SpecimenPlate } from "@/components/specimen-plate";
import { Button } from "@/components/ui/button";
import { families } from "@/data/families";
import { benchmarks, getByFamily, yearRange } from "@/lib/catalog";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.22em] text-primary uppercase">
          OpenBenchmark Atlas · Specimen Cabinet
        </p>
        <h1 className="mt-4 font-heading text-4xl leading-[1.1] font-semibold tracking-tight md:text-6xl">
          评测是一门计量学。
        </h1>
        <p className="prose-specimen mt-6 text-muted-foreground">
          评测圈最常见的事故，不是模型差，是尺子没讲清楚。同一栏
          MMLU，换套脚本能差出五分；同一套 SWE-bench，换个 agent
          循环能从个位数跳到三十。这份资料柜把每一份 benchmark
          当成标本：它跟谁吵架才出生、题怎么喂怎么判、考场上到底长什么样、官方仓库和索引在哪。分数留给排行榜。这里先把尺子本身看清楚。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/catalog">打开总目</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">怎么读一份标本</Link>
          </Button>
        </div>
      </section>

      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg ring-1 ring-foreground/10 sm:grid-cols-4">
        <Stat label="标本" value={String(benchmarks.length)} />
        <Stat label="分科抽屉" value={String(families.length)} />
        <Stat
          label="年代"
          value={`${yearRange.min}–${yearRange.max}`}
        />
        <Stat
          label="滚动评测"
          value={String(benchmarks.filter((item) => item.status === "live").length)}
        />
      </dl>

      <div className="mt-16 space-y-10">
        {families.map((family) => {
          const items = getByFamily(family.id);
          if (items.length === 0) return null;
          return (
            <section key={family.id} className="rounded-xl bg-card/70 p-4 ring-1 ring-foreground/10 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    {family.drawer} · {family.nameEn}
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    {family.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {family.blurb.split(/\n\s*\n/)[0]}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/family/${family.id}`}>整只抽屉</Link>
                </Button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(0, 6).map((item) => (
                  <SpecimenPlate key={item.slug} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-4 py-4">
      <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-heading text-2xl font-semibold tabular-nums">
        {value}
      </dd>
    </div>
  );
}
