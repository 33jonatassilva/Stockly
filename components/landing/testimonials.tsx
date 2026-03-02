import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Mariana Costa",
    role: "Mãe e administradora de casa",
    initials: "MC",
    rating: 5,
    text: "Antes eu sempre comprava coisas repetidas e jogava fora produtos vencidos. Com o Stockly, isso acabou. Economizei mais de R$200 no primeiro mês.",
  },
  {
    name: "Roberto Souza",
    role: "Estudante universitário",
    initials: "RS",
    rating: 5,
    text: "Moro sozinho e tinha dificuldade para me organizar. Agora minha geladeira nunca está vazia e eu nunca compro além do necessário. Recomendo muito!",
  },
  {
    name: "Fernanda Alves",
    role: "Chef e blogueira culinária",
    initials: "FA",
    rating: 5,
    text: "Uso o Stockly para gerenciar os ingredientes das minhas receitas. É incrível saber exatamente o que tenho disponível antes de planejar o cardápio da semana.",
  },
  {
    name: "Paulo Henrique",
    role: "Pai de três filhos",
    initials: "PH",
    rating: 4,
    text: "Com uma família grande as compras eram um caos. O Stockly transformou nossa rotina. Agora todos compartilham a mesma lista e não tem mais duplicação.",
  },
  {
    name: "Juliana Martins",
    role: "Personal Finance Coach",
    initials: "JM",
    rating: 5,
    text: "Recomendo o Stockly para todos os meus clientes que querem reduzir gastos com alimentação. Os resultados são impressionantes logo nas primeiras semanas.",
  },
  {
    name: "Diego Ferreira",
    role: "Empreendedor",
    initials: "DF",
    rating: 5,
    text: "Viajo muito e precisava de algo para me ajudar a organizar a casa. O Stockly é simples, intuitivo e resolve exatamente o que eu precisava.",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance leading-tight mb-4">
            Quem já usa, não abre mão
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Mais de 50 mil pessoas já transformaram suas compras com o Stockly.
          </p>
        </div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                  />
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-5">{`"${t.text}"`}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
