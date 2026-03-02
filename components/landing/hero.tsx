import { ArrowRight, Star, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const reviews = [
  {
    name: "Ana Lima",
    text: "Nunca mais comprei algo que já tinha em casa. Economizei muito!",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    text: "Minha lista de compras finalmente faz sentido. Incrível!",
    rating: 4,
  },
]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-background pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle background circles */}
      <div
        aria-hidden
        className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "var(--brand-green)" }}
      />
      <div
        aria-hidden
        className="absolute right-16 top-24 w-[440px] h-[440px] rounded-full opacity-[0.08]"
        style={{ background: "var(--brand-green)" }}
      />
      <div
        aria-hidden
        className="absolute right-32 top-44 w-[300px] h-[300px] rounded-full border-4 opacity-20"
        style={{ borderColor: "var(--brand-green)" }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Grátis para começar</span>
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight text-balance">
            Suas compras,{" "}
            <span className="text-primary">organizadas</span>{" "}
            de verdade.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            Controle o que você tem em casa, monte listas inteligentes e pare de desperdiçar dinheiro comprando o que já possui.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-8"
            >
              Começar grátis
            </Button>
            <a
              href="#como-funciona"
              className="flex items-center gap-2 text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Saiba mais <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { value: "50k+", label: "Usuários ativos" },
              { value: "200k+", label: "Listas criadas" },
              { value: "30%", label: "Economia média" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image + floating cards */}
        <div className="relative flex items-center justify-center h-[420px] md:h-[500px]">
          {/* Circle bg behind image */}
          <div
            className="absolute inset-0 m-auto w-72 h-72 md:w-96 md:h-96 rounded-full"
            style={{ background: "var(--brand-green-light)" }}
          />
          <div
            className="absolute inset-0 m-auto w-56 h-56 md:w-72 md:h-72 rounded-full border-[6px]"
            style={{ borderColor: "var(--brand-green)" }}
          />

          {/* Hero image */}
          <div className="relative z-10 w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
            <Image
              src="/images/hero-shopping.jpg"
              alt="Compras organizadas com Stockly"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Review card 1 — top right */}
          <div className="absolute top-4 right-0 md:-right-4 z-20 bg-white rounded-2xl shadow-lg p-4 w-52 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                AL
              </div>
              <div>
                <p className="text-xs font-bold text-foreground leading-none">{reviews[0].name}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: reviews[0].rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{reviews[0].text}</p>
          </div>

          {/* Review card 2 — bottom left */}
          <div className="absolute bottom-8 left-0 md:-left-4 z-20 bg-white rounded-2xl shadow-lg p-4 w-52 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                CM
              </div>
              <div>
                <p className="text-xs font-bold text-foreground leading-none">{reviews[1].name}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: reviews[1].rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <Star className="w-3 h-3 text-muted" />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{reviews[1].text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
