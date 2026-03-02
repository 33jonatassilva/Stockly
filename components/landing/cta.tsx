import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-primary">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-balance leading-tight mb-4">
          Comece a economizar ainda hoje
        </h2>
        <p className="text-white/80 leading-relaxed mb-8 text-lg">
          Junte-se a mais de 50 mil pessoas que já organizam suas compras com inteligência. Grátis para começar, sem cartão de crédito.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full px-8 shadow-lg"
          >
            Criar conta grátis
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border border-white/30 hover:bg-white/10 rounded-full px-8 font-semibold"
          >
            Ver planos
          </Button>
        </div>
      </div>
    </section>
  )
}
