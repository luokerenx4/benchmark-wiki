import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogExplorer } from "@/components/catalog-explorer";
import { Prose } from "@/components/prose";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { families, familyById } from "@/data/families";
import { getByFamily } from "@/lib/catalog";
import type { FamilyId } from "@/lib/types";

export function generateStaticParams() {
  return families.map((family) => ({ slug: family.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/family/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const family = familyById[slug as FamilyId];
  if (!family) return { title: "未找到分科" };
  return { title: family.name };
}

export default async function FamilyPage({
  params,
}: PageProps<"/family/[slug]">) {
  const { slug } = await params;
  const family = familyById[slug as FamilyId];
  if (!family) notFound();
  const items = getByFamily(family.id);

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
            <BreadcrumbPage>{family.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
        {family.drawer} · {family.nameEn}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        {family.name}
      </h1>
      <Prose
        text={family.blurb}
        className="mt-4 max-w-3xl text-muted-foreground"
      />
      <div className="mt-8">
        <CatalogExplorer items={items} familyLocked={family.id} />
      </div>
    </div>
  );
}
