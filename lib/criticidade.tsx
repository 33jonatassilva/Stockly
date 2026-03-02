import type { Criticidade } from "@/lib/types"

export interface CriticidadeInfo {
  label: string
  bgClass: string
  textClass: string
  borderClass: string
  dotClass: string
  badgeClass: string
}

export const criticidadeConfig: Record<Criticidade, CriticidadeInfo> = {
  critico: {
    label: "Crítico",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    borderClass: "border-red-200",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-700",
  },
  urgente: {
    label: "Urgente",
    bgClass: "bg-orange-50",
    textClass: "text-orange-700",
    borderClass: "border-orange-200",
    dotClass: "bg-orange-500",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  atencao: {
    label: "Atenção",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  normal: {
    label: "Normal",
    bgClass: "bg-green-50",
    textClass: "text-green-700",
    borderClass: "border-green-200",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-green-100 text-green-700",
  },
}

export function CriticidadeBadge({ value }: { value: Criticidade }) {
  const cfg = criticidadeConfig[value]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-none ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  )
}
