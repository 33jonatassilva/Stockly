import Image from "next/image"
import { ClipboardList, ScanLine, ShoppingBag } from "lucide-react"

const steps = [
  {
    icon: ScanLine,
    step: "01",
    title: "Registre o que você tem",
    description:
      "Cadastre os produtos que já estão na sua despensa e geladeira. O Stockly guarda tudo organizado por categoria.",
    image: "/images/feature-pantry.jpg",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Monte sua lista de compras",
    description:
      "Com base no estoque, o Stockly sugere automaticamente o que está faltando. Você revisa e confirma o que precisa.",
    image: "/images/feature-list.jpg",
  },
  {
    icon: ShoppingBag,
    step: "03",
    title: "Compre só o necessário",
    description:
      "Vá ao mercado com a lista certinha e economize tempo e dinheiro. Sem surpresas e sem desperdícios.",
    image: "/images/feature-savings.jpg",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28" style={{ background: "var(--brand-green-light)" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Como funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance leading-tight mb-4">
            Simples como deve ser
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Em três passos você já tem controle total das suas compras e nunca mais desperdiça dinheiro.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  {/* Step badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">{step.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
