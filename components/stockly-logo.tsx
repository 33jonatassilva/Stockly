import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface StocklyLogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  size?: "sm" | "md" | "lg"
  inverted?: boolean
}

export function StocklyLogo({
  className,
  size = "md",
  inverted = false,
}: StocklyLogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", iconInner: "w-3 h-3", text: "text-lg" },
    md: { icon: "w-8 h-8", iconInner: "w-4 h-4", text: "text-xl" },
    lg: { icon: "w-10 h-10", iconInner: "w-5 h-5", text: "text-2xl" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg",
          s.icon,
          inverted ? "bg-white/20" : "bg-primary"
        )}
      >
        <ShoppingCart
          className={cn(s.iconInner, inverted ? "text-white" : "text-primary-foreground")}
        />
      </span>
      <span className={cn("font-bold", s.text, inverted ? "text-white" : "text-foreground")}>
        Stock<span className={inverted ? "text-white/70" : "text-primary"}>ly</span>
      </span>
    </div>
  )
}
