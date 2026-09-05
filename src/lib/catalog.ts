import { agents } from "@/data/benchmarks/agents";
import { chinese } from "@/data/benchmarks/chinese";
import { coding } from "@/data/benchmarks/coding";
import { harnesses } from "@/data/benchmarks/harnesses";
import { knowledge } from "@/data/benchmarks/knowledge";
import { longcontext } from "@/data/benchmarks/longcontext";
import { math } from "@/data/benchmarks/math";
import { multimodal } from "@/data/benchmarks/multimodal";
import { orgs } from "@/data/benchmarks/orgs";
import { safety } from "@/data/benchmarks/safety";
import { families } from "@/data/families";
import type { Benchmark, FamilyId, Kind, Status } from "@/lib/types";

export const benchmarks: Benchmark[] = [
  ...knowledge,
  ...coding,
  ...math,
  ...agents,
  ...multimodal,
  ...chinese,
  ...longcontext,
  ...safety,
  ...harnesses,
  ...orgs,
].sort((a, b) => a.year - b.year || a.accession.localeCompare(b.accession));

const bySlug = new Map(benchmarks.map((item) => [item.slug, item]));

export function getBenchmark(slug: string): Benchmark | undefined {
  return bySlug.get(slug);
}

export function getByFamily(family: FamilyId): Benchmark[] {
  return benchmarks.filter((item) => item.family === family);
}

export function familyCounts(): Record<FamilyId, number> {
  return Object.fromEntries(
    families.map((family) => [family.id, getByFamily(family.id).length]),
  ) as Record<FamilyId, number>;
}

export function searchCatalog(
  query: string,
  filters?: {
    family?: FamilyId | "all";
    status?: Status | "all";
    kind?: Kind | "all";
  },
): Benchmark[] {
  const q = query.trim().toLowerCase();
  return benchmarks.filter((item) => {
    if (filters?.family && filters.family !== "all" && item.family !== filters.family) {
      return false;
    }
    if (filters?.status && filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (filters?.kind && filters.kind !== "all" && item.kind !== filters.kind) {
      return false;
    }
    if (!q) return true;
    const hay = [
      item.name,
      item.shortName,
      item.slug,
      item.accession,
      item.org,
      item.authors,
      item.summary,
      item.domains.join(" "),
      item.format,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function resolveLineage(item: Benchmark): {
  parents: Benchmark[];
  children: Benchmark[];
  related: Benchmark[];
} {
  const pick = (slugs: string[]) =>
    slugs
      .map((slug) => bySlug.get(slug))
      .filter((entry): entry is Benchmark => Boolean(entry));
  return {
    parents: pick(item.lineage.parents),
    children: pick(item.lineage.children),
    related: pick(item.lineage.related),
  };
}

export const yearRange = {
  min: benchmarks[0]?.year ?? 2015,
  max: benchmarks[benchmarks.length - 1]?.year ?? 2026,
};
