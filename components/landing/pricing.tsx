"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Gratuito",
    price: { monthly: 0, yearly: 0 },
    description: "Perfeito para começar a organizar suas compras.",
    features: [
      "Até 1 lista de compras",
      "Até 50 produtos no estoque",
      "Alertas básicos",
      "Acesso via app mobile",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: 19.9, yearly: 14.9 },
    description: "Para quem quer economizar de verdade todo mês.",
    features: [
      "Listas ilimitadas",
      "Estoque ilimitado",
      "Alertas inteligentes de reposição",
      "Relatórios mensais",
      "Histórico completo",
      "Suporte prioritário",
    ],
    cta: "Assinar o Pro",
    highlighted: true,
  },
  {
    name: "Família",
    price: { monthly: 34.9, yearly: 27.9 },
    description: "Compartilhe com até 5 membros da família.",
    features: [
      "Tudo do Pro",
      "Até 5 usuários",
      "Listas compartilhadas",
      "Permissões por membro",
      "Dashboard familiar",
    ],
    cta: "Assinar Família",
    highlighted: false,
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="precos" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance leading-tight mb-4">
            Simples, transparente e justo
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Comece grátis e evolua conforme suas necessidades.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-sm font-medium", !yearly ? "text-foreground" : "text-muted-foreground")}>
            Mensal
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors duration-200",
              yearly ? "bg-primary" : "bg-muted"
            )}
            aria-label="Alternar período"
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                yearly ? "translate-x-6" : "translate-x-0"
              )}
            />
          </button>
          <span className={cn("text-sm font-medium flex items-center gap-2", yearly ? "text-foreground" : "text-muted-foreground")}>
            Anual
            <span className="bg-secondary text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              -25%
            </span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-2xl p-8 border transition-all duration-200",
                plan.highlighted
                  ? "border-primary bg-primary shadow-xl shadow-primary/20 scale-[1.02]"
                  : "border-border bg-card hover:shadow-md"
              )}
            >
              <div className="mb-6">
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest mb-1",
                    plan.highlighted ? "text-white/80" : "text-primary"
                  )}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  {plan.price.monthly === 0 ? (
                    <span className={cn("text-4xl font-extrabold", plan.highlighted ? "text-white" : "text-foreground")}>
                      Grátis
                    </span>
                  ) : (
                    <>
                      <span className={cn("text-sm font-medium mt-2", plan.highlighted ? "text-white/70" : "text-muted-foreground")}>
                        R$
                      </span>
                      <span className={cn("text-4xl font-extrabold", plan.highlighted ? "text-white" : "text-foreground")}>
                        {yearly ? plan.price.yearly.toFixed(2).replace(".", ",") : plan.price.monthly.toFixed(2).replace(".", ",")}
                      </span>
                      <span className={cn("text-sm mb-1", plan.highlighted ? "text-white/70" : "text-muted-foreground")}>
                        /mês
                      </span>
                    </>
                  )}
                </div>
                <p className={cn("text-sm leading-relaxed", plan.highlighted ? "text-white/80" : "text-muted-foreground")}>
                  {plan.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <Check
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        plan.highlighted ? "text-white" : "text-primary"
                      )}
                    />
                    <span className={cn("text-sm", plan.highlighted ? "text-white/90" : "text-foreground")}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={cn(
                  "w-full rounded-full font-semibold",
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
