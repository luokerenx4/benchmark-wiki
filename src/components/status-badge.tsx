import { Badge } from "@/components/ui/badge";
import { kindLabel, statusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { Kind, Status } from "@/lib/types";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[10px] tracking-wide",
        status === "live" && "border-live/50 text-[color:var(--live)]",
        status === "contested" && "border-destructive/40 text-destructive",
        status === "superseded" && "opacity-70",
        status === "foundational" && "border-primary/30 text-primary",
      )}
    >
      {statusLabel[status]}
    </Badge>
  );
}

export function KindBadge({ kind }: { kind: Kind }) {
  return (
    <Badge variant="secondary" className="font-mono text-[10px] tracking-wide">
      {kindLabel[kind]}
    </Badge>
  );
}
