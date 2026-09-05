import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";

import { Prose } from "@/components/prose";
import { KindBadge, StatusBadge } from "@/components/status-badge";
import { SpecimenPlate } from "@/components/specimen-plate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { familyById } from "@/data/families";
import { benchmarks, getBenchmark, resolveLineage } from "@/lib/catalog";
import { linkRelLabel } from "@/lib/labels";

export function generateStaticParams() {
  return benchmarks.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/b/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getBenchmark(slug);
  if (!item) return { title: "未找到标本" };
  return { title: `${item.shortName} · ${item.accession}` };
}

export default async function SpecimenPage({
  params,
}: PageProps<"/b/[slug]">) {
  const { slug } = await params;
  const item = getBenchmark(slug);
  if (!item) notFound();

  const family = familyById[item.family];
  const lineage = resolveLineage(item);
  const related = [...lineage.parents, ...lineage.children, ...lineage.related];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">标本柜</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/family/${family.id}`}>{family.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.shortName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accession-foreground uppercase">
            {item.accession}
          </p>
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">
            {item.name}
          </h1>
          <p className="mt-3 max-w-prose text-lg leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            <KindBadge kind={item.kind} />
            <span className="font-mono text-xs text-muted-foreground">
              {item.year} · {item.org}
            </span>
          </div>

          {item.kind === "org" && item.houseHarness ? (
            <HouseHarness slug={item.houseHarness} />
          ) : null}

          <Tabs defaultValue="origin" className="mt-8">
            <TabsList variant="line">
              <TabsTrigger value="origin">来历</TabsTrigger>
              <TabsTrigger value="architecture">
                {item.kind === "org" ? "跑道" : "结构"}
              </TabsTrigger>
              <TabsTrigger value="content">
                {item.kind === "org" ? "出品" : "题面"}
              </TabsTrigger>
              <TabsTrigger value="caveats">坑</TabsTrigger>
              <TabsTrigger value="lineage">谱系</TabsTrigger>
            </TabsList>
            <TabsContent value="origin" className="mt-5">
              <Prose text={item.origin} />
              <MetaRow label="作者" value={item.authors} />
            </TabsContent>
            <TabsContent value="architecture" className="mt-5 space-y-4">
              <Prose text={item.architecture} />
              <MetaRow label="形式" value={item.format} />
              <MetaRow label="指标" value={item.metrics.join(" · ")} />
              {item.size ? <MetaRow label="规模" value={item.size} /> : null}
            </TabsContent>
            <TabsContent value="content" className="mt-5">
              <Prose text={item.content} />
              <MetaRow label="领域" value={item.domains.join(" · ")} />
            </TabsContent>
            <TabsContent value="caveats" className="mt-5">
              <Alert className="bg-card">
                <AlertTitle>使用时注意</AlertTitle>
                <AlertDescription>
                  <Prose text={item.caveats} className="text-sm font-sans" />
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="lineage" className="mt-5 space-y-6">
              <LineageGroup title="上游" items={lineage.parents} />
              <LineageGroup
                title={item.kind === "org" ? "出品" : "下游"}
                items={lineage.children}
              />
              <LineageGroup
                title={item.kind === "org" ? "跑道与旁系" : "旁系"}
                items={lineage.related}
              />
              {related.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  这份标本还没有挂上谱系边。总目里可以按分科对照。
                </p>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="h-fit rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            索引
          </p>
          <ul className="mt-3 space-y-2">
            {item.links.map((link) => (
              <li key={`${link.rel}-${link.label}-${link.href}`}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-2 rounded-md px-1 py-1 text-sm hover:bg-accent"
                >
                  <span>
                    <span className="block font-mono text-[10px] text-muted-foreground">
                      {linkRelLabel[link.rel]}
                    </span>
                    {link.label}
                  </span>
                  <ExternalLinkIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            {item.kind === "org"
              ? "链接指向机构主页、活榜和自家评测框架。出品清单在出品栏，跑道挂在谱系里。"
              : "链接指向论文、仓库、数据卡或榜单。镜像和社区拷贝请自行核对 split。"}
          </p>
        </aside>
      </div>
    </div>
  );
}

function HouseHarness({ slug }: { slug: string }) {
  const harness = getBenchmark(slug);
  if (!harness) return null;
  return (
    <div className="mt-6">
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        自家跑道
      </p>
      <div className="mt-2 max-w-md">
        <SpecimenPlate item={harness} />
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="mt-4 text-sm">
      <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="mt-1 block">{value}</span>
    </p>
  );
}

function LineageGroup({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof resolveLineage>["parents"];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <SpecimenPlate key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
