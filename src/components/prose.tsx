import { cn } from "@/lib/utils";

export function Prose({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text
    .trim()
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s*\n\s*/g, "").trim())
    .filter(Boolean);

  return (
    <div className={cn("prose-specimen max-w-prose space-y-4", className)}>
      {parts.map((part, index) => (
        <p key={index}>{part}</p>
      ))}
    </div>
  );
}
