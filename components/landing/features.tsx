import Image from "next/image"
import { ShoppingCart, Package, TrendingDown, Bell, BarChart3 } from "lucide-react"

const regularFeatures = [
  {
    icon: Package,
    title: "Estoque doméstico",
    description:
      "Registre tudo que você tem em casa e saiba exatamente o que está acabando antes de ir ao mercado.",
  },
  {
    icon: TrendingDown,
    title: "Economia real",
    description:
      "Evite desperdícios e compras desnecessárias. Usuários economizam em média 30% nas compras mensais.",
  },
  {
    icon: Bell,
    title: "Alertas de reposição",
    description:
      "Receba notificações quando algum produto estiver acabando. Nunca fique sem o essencial.",
  },
  {
    icon: ShoppingCart,
    title: "Histórico de compras",
    description:
      "Acesse o histórico completo das suas compras e entenda seus padrões de consumo.",
  },
  {
    icon: BarChart3,
    title: "Relatórios mensais",
    description:
      "Visualize quanto gastou, onde economizou e como melhorar seu planejamento financeiro.",
  },
]

export function Features() {
  return (
    <section id="funcionalidades" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance leading-tight mb-4">
            Tudo que você precisa para comprar com inteligência
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            O Stockly reúne as ferramentas certas para você parar de desperdiçar e começar a economizar de verdade.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Featured card — Listas inteligentes */}
          <div className="group sm:col-span-2 lg:col-span-1 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src="/images/shopping-list-notebook.jpg"
                alt="Caderno com lista de compras escrita à mão"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Destaque
              </span>
              <h3 className="text-base font-bold text-foreground mb-2">Listas inteligentes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monte sua lista de compras com base no que está faltando em casa. Nunca mais compre por impulso.
              </p>
            </div>
          </div>

          {/* Regular feature cards */}
          {regularFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
