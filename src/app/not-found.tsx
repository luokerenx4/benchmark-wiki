import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl items-center px-4 py-24">
      <Empty className="w-full border border-dashed bg-card/70">
        <EmptyHeader>
          <EmptyTitle>这份标本不在柜子里</EmptyTitle>
          <EmptyDescription>
            编号可能写错，或者还没入藏。从总目或分科抽屉重新找。
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/catalog">回到总目</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
