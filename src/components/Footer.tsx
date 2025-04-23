
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Análise inteligente para suas campanhas publicitárias
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Termos
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Ajuda
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Claritas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
