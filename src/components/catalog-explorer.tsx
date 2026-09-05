"use client";

import { useMemo, useState } from "react";

import { SpecimenPlate } from "@/components/specimen-plate";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { families } from "@/data/families";
import { kindLabel, statusLabel } from "@/lib/labels";
import type { Benchmark, FamilyId, Kind, Status } from "@/lib/types";

const statuses: Array<Status | "all"> = [
  "all",
  "active",
  "foundational",
  "live",
  "contested",
  "superseded",
];
const kinds: Array<Kind | "all"> = [
  "all",
  "benchmark",
  "suite",
  "harness",
  "leaderboard",
  "index",
  "org",
];

type SortKey = "year" | "accession" | "name" | "family";
type SortDir = "asc" | "desc";

const familyRank: Record<FamilyId, number> = Object.fromEntries(
  families.map((family, index) => [family.id, index]),
) as Record<FamilyId, number>;

const sortKeys: Array<{ key: SortKey; label: string }> = [
  { key: "year", label: "年份" },
  { key: "accession", label: "编号" },
  { key: "name", label: "名称" },
  { key: "family", label: "分科" },
];

function directionLabel(key: SortKey, dir: SortDir): string {
  const labels: Record<SortKey, Record<SortDir, string>> = {
    year: { asc: "旧 → 新", desc: "新 → 旧" },
    accession: { asc: "柜号升", desc: "柜号降" },
    name: { asc: "A → Z", desc: "Z → A" },
    family: { asc: "抽屉顺序", desc: "抽屉倒序" },
  };
  return labels[key][dir];
}

function compareSpecimens(
  left: Benchmark,
  right: Benchmark,
  key: SortKey,
  dir: SortDir,
): number {
  let cmp = 0;
  if (key === "year") {
    cmp = left.year - right.year || left.accession.localeCompare(right.accession);
  } else if (key === "accession") {
    cmp = left.accession.localeCompare(right.accession);
  } else if (key === "name") {
    cmp =
      left.shortName.localeCompare(right.shortName, "en", { sensitivity: "base" }) ||
      left.name.localeCompare(right.name, "en", { sensitivity: "base" });
  } else {
    cmp =
      familyRank[left.family] - familyRank[right.family] ||
      left.year - right.year ||
      left.accession.localeCompare(right.accession);
  }
  return dir === "asc" ? cmp : -cmp;
}

export function CatalogExplorer({
  items,
  familyLocked,
}: {
  items: Benchmark[];
  familyLocked?: FamilyId;
}) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FamilyId | "all">(familyLocked ?? "all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [kind, setKind] = useState<Kind | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const visibleKeys = familyLocked
    ? sortKeys.filter((item) => item.key !== "family")
    : sortKeys;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const next = items.filter((item) => {
      if (family !== "all" && item.family !== family) return false;
      if (status !== "all" && item.status !== status) return false;
      if (kind !== "all" && item.kind !== kind) return false;
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
    return next.slice().sort((left, right) => compareSpecimens(left, right, sortKey, sortDir));
  }, [items, query, family, status, kind, sortKey, sortDir]);

  function chooseSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "year" || key === "accession" ? "desc" : "asc");
  }

  return (
    <div className="space-y-6">
      <div className={familyLocked ? "grid gap-3 md:grid-cols-3" : "grid gap-3 md:grid-cols-4"}>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="过滤名称、编号、机构…"
          className="bg-card"
        />
        {familyLocked ? null : (
          <Select
            value={family}
            onValueChange={(value) => setFamily(value as FamilyId | "all")}
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="分科" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分科</SelectItem>
              {families.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.drawer} · {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as Status | "all")}
        >
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((item) => (
              <SelectItem key={item} value={item}>
                {item === "all" ? "全部状态" : statusLabel[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={kind}
          onValueChange={(value) => setKind(value as Kind | "all")}
        >
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="类型" />
          </SelectTrigger>
          <SelectContent>
            {kinds.map((item) => (
              <SelectItem key={item} value={item}>
                {item === "all" ? "全部类型" : kindLabel[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          排序
        </p>
        <ButtonGroup className="flex-wrap">
          {visibleKeys.map((item) => (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={sortKey === item.key ? "default" : "outline"}
              aria-pressed={sortKey === item.key}
              onClick={() => chooseSort(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="font-mono"
          onClick={() => setSortDir((current) => (current === "asc" ? "desc" : "asc"))}
        >
          {directionLabel(sortKey, sortDir)}
        </Button>
      </div>

      <p className="font-mono text-xs text-muted-foreground">
        {filtered.length} / {items.length} 份标本
        <span className="text-foreground/45">
          {" "}
          · {visibleKeys.find((item) => item.key === sortKey)?.label} ·{" "}
          {directionLabel(sortKey, sortDir)}
        </span>
      </p>

      {filtered.length === 0 ? (
        <Empty className="border border-dashed bg-card/60">
          <EmptyHeader>
            <EmptyTitle>这只抽屉是空的</EmptyTitle>
            <EmptyDescription>
              放宽过滤条件，或清掉关键词。排完序再滤、滤完再排都可以。
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <SpecimenPlate key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
