"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, SearchIcon } from "lucide-react";

import { SearchDialog, type SearchHit } from "@/components/search-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { nav } from "@/lib/labels";
import { cn } from "@/lib/utils";

export function SiteHeader({ items }: { items: SearchHit[] }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-sm bg-accession text-accession-foreground ring-1 ring-foreground/15">
            <Crosshair />
          </span>
          <span className="leading-none">
            <span className="block font-heading text-sm font-semibold tracking-tight">
              OpenBenchmark
            </span>
            <span className="block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Atlas
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-accent",
                pathname === item.href
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden min-w-48 justify-between text-muted-foreground md:inline-flex"
            onClick={() => setSearchOpen(true)}
          >
            <span className="inline-flex items-center gap-2">
              <SearchIcon className="size-3.5" />
              检索标本
            </span>
            <Kbd>/</Kbd>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
            <span className="sr-only">检索</span>
          </Button>

          <Sheet open={navOpen} onOpenChange={setNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon />
                <span className="sr-only">打开导航</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>资料柜</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    className={cn(
                      "rounded-md px-2 py-2 text-sm",
                      pathname === item.href
                        ? "bg-accent"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchDialog
        items={items}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </header>
  );
}

function Crosshair() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
      <path
        d="M8 2v12M2 8h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="8"
        cy="8"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
