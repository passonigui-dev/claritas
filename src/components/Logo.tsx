
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center rotate-6">
          <span className="text-white text-xl font-bold">C</span>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary"></div>
      </div>
      <span 
        className={cn(
          "text-2xl font-bold tracking-tight", 
          variant === "white" ? "text-white" : "text-foreground"
        )}
      >
        Claritas
      </span>
    </div>
  );
}
