import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-foreground">OpenBenchmark 资料柜</p>
          <p className="mt-1 max-w-xl">
            脚手架站点。分数会过期，协议会分叉，污染会累积。这里记录的是标本本身：它从哪来、怎么考、题面是什么、该链到哪。
          </p>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <Link href="/about" className="hover:text-foreground">
            怎么读一份标本
          </Link>
          <Link href="/indexes" className="hover:text-foreground">
            外部索引
          </Link>
          <Link href="/catalog" className="hover:text-foreground">
            总目
          </Link>
        </div>
      </div>
    </footer>
  );
}
