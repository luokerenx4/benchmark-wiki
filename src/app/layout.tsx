import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { benchmarks } from "@/lib/catalog";

import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: {
    default: "OpenBenchmark 资料柜",
    template: "%s · OpenBenchmark 资料柜",
  },
  description:
    "系统性整理 AI 评测基准：来历、结构、题面、仓库与索引。一份标本一张铭牌。",
};

const searchHits = benchmarks.map((item) => ({
  slug: item.slug,
  name: item.name,
  shortName: item.shortName,
  accession: item.accession,
  year: item.year,
  family: item.family,
  status: item.status,
  kind: item.kind,
  summary: item.summary,
}));

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <SiteHeader items={searchHits} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
