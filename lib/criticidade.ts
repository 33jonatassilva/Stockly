import type { Criticidade } from "./types"

export const criticidadeConfig: Record<
  Criticidade,
  { label: string; bgClass: string; textClass: string; dotClass: string; borderClass: string }
> = {
  normal: {
    label: "Normal",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-200",
  },
  atencao: {
    label: "Atenção",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    dotClass: "bg-amber-500",
    borderClass: "border-amber-200",
  },
  urgente: {
    label: "Urgente",
    bgClass: "bg-orange-50",
    textClass: "text-orange-700",
    dotClass: "bg-orange-500",
    borderClass: "border-orange-200",
  },
  critico: {
    label: "Crítico",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    dotClass: "bg-red-500",
    borderClass: "border-red-200",
  },
}

export function CriticidadeBadge({ value }: { value: Criticidade }) {
  const c = criticidadeConfig[value]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bgClass} ${c.textClass} ${c.borderClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-none ${c.dotClass}`} />
      {c.label}
    </span>
  )
}
