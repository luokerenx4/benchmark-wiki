import Link from "next/link";

import { KindBadge, StatusBadge } from "@/components/status-badge";
import { familyById } from "@/data/families";
import { cn } from "@/lib/utils";
import type { Benchmark } from "@/lib/types";

export function SpecimenPlate({
  item,
  className,
}: {
  item: Benchmark;
  className?: string;
}) {
  const family = familyById[item.family];

  return (
    <Link
      href={`/b/${item.slug}`}
      className={cn(
        "group block rounded-lg bg-card p-3 ring-1 ring-foreground/10 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] tracking-[0.14em] text-accession-foreground uppercase">
          {item.accession}
        </p>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="mt-3 font-heading text-base leading-tight font-semibold tracking-tight">
        {item.shortName}
      </h3>
      <p className="mt-1 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
        {item.summary}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <KindBadge kind={item.kind} />
        <span className="font-mono text-[10px] text-muted-foreground">
          {item.year} · {family.name}
        </span>
      </div>
    </Link>
  );
}
