import { ShoppingCart } from "lucide-react"

const links = {
  Produto: ["Funcionalidades", "Preços", "Novidades", "Roadmap"],
  Empresa: ["Sobre nós", "Blog", "Carreiras", "Imprensa"],
  Suporte: ["Central de ajuda", "Contato", "Status", "Comunidade"],
  Legal: ["Privacidade", "Termos de uso", "Cookies"],
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <ShoppingCart className="w-4 h-4 text-primary-foreground" />
              </span>
              <span className="text-xl font-bold text-foreground">
                Stock<span className="text-primary">ly</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organize suas compras, controle seu estoque e economize de verdade todo mês.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">{group}</p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Stockly. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com cuidado para quem quer economizar.
          </p>
        </div>
      </div>
    </footer>
  )
}
