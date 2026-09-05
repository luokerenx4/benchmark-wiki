"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { familyById } from "@/data/families";
import { kindLabel, statusLabel } from "@/lib/labels";
import type { Benchmark } from "@/lib/types";

export type SearchHit = Pick<
  Benchmark,
  | "slug"
  | "name"
  | "shortName"
  | "accession"
  | "year"
  | "family"
  | "status"
  | "kind"
  | "summary"
>;

export function SearchDialog({
  items,
  open,
  onOpenChange,
}: {
  items: SearchHit[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
      if (
        event.key === "/" &&
        !open &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        onOpenChange(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="检索标本"
      description="按名称、编号或摘要查找 benchmark"
      className="sm:max-w-xl"
    >
      <Command>
        <CommandInput placeholder="MMLU、SWE-bench、OB-2021…" />
        <CommandList>
          <CommandEmpty>没有对应标本。换个关键词，或去总目浏览。</CommandEmpty>
          <CommandGroup heading="标本">
            {items.map((item) => (
              <CommandItem
                key={item.slug}
                value={`${item.name} ${item.shortName} ${item.slug} ${item.accession} ${item.summary}`}
                onSelect={() => {
                  onOpenChange(false);
                  router.push(`/b/${item.slug}`);
                }}
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {item.accession}
                </span>
                <span className="font-medium">{item.shortName}</span>
                <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground sm:inline">
                  {item.year} · {familyById[item.family].name} ·{" "}
                  {statusLabel[item.status]} · {kindLabel[item.kind]}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
