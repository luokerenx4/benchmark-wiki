import type { Metadata } from "next";
import { ExternalLinkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { indexes } from "@/data/indexes";
import { kindLabel } from "@/lib/labels";

export const metadata: Metadata = {
  title: "索引",
};

export default function IndexesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
        Indexes
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        外部索引
      </h1>
      <p className="prose-specimen mt-4 max-w-3xl text-muted-foreground">
        题目在数据集里，分数出在框架里，对照表在榜单上。不要把 Arena Elo、Open
        LLM Leaderboard 平均分和 HELM 当成同一种计量。下面这些是资料柜优先链出去的入口。
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {indexes.map((item) => (
          <Card key={item.slug}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{item.name}</CardTitle>
                <Badge variant="outline">{kindLabel[item.kind]}</Badge>
              </div>
              <CardDescription className="text-pretty leading-relaxed">
                {item.blurb}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  适合
                </span>
                <span className="mt-1 block">{item.goodFor}</span>
              </p>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                打开
                <ExternalLinkIcon className="size-3.5" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
