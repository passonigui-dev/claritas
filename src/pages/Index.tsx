
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChartPie, FileSpreadsheet, LineChart, Settings } from "lucide-react";

export default function Index() {
  const features = [
    {
      title: "Análise de dados inteligente",
      description: "Nossa inteligência artificial analisa suas campanhas do Google Ads e Meta Ads para identificar padrões, oportunidades e problemas.",
      icon: LineChart,
    },
    {
      title: "Importação simplificada",
      description: "Importe seus dados diretamente do Google Sheets seguindo nosso template. Sem complicações, sem downloads.",
      icon: FileSpreadsheet,
    },
    {
      title: "Dashboards personalizados",
      description: "Visualize os indicadores mais importantes das suas campanhas em dashboards interativos e personalizáveis.",
      icon: ChartPie,
    },
    {
      title: "Plano de ação claro",
      description: "Receba recomendações específicas e acionáveis para melhorar o desempenho das suas campanhas de publicidade.",
      icon: Settings,
    },
  ];

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-bg py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                    Transformando dados em insights acionáveis
                  </h1>
                  <p className="text-gray-200 md:text-xl">
                    Clarifique seus resultados de marketing digital com análise avançada de campanhas impulsionada por IA.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 min-[400px]:flex-row">
                  <Link to="/upload">
                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                      Iniciar análise
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link to="/sobre">Saiba mais</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="card-gradient rounded-2xl p-4 md:p-8 animate-float shadow-xl">
                    <img 
                      src="https://via.placeholder.com/500x300/ffffff/000000?text=Dashboard+Preview" 
                      alt="Dashboard Preview" 
                      className="rounded-lg shadow-sm w-full"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Como funciona
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
                  Claritas analisa seus dados de campanhas e entrega insights claros e ações para melhorar resultados.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center space-y-3 border rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="p-3 rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-center">{feature.title}</h3>
                  <p className="text-sm text-gray-500 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Em apenas 3 passos simples
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
                  Da importação dos dados até o plano de ação, otimize suas campanhas em minutos.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xl font-bold">1</span>
                  </div>
                  <div className="hidden md:block absolute top-1/2 left-full h-0.5 w-full bg-primary/30"></div>
                </div>
                <h3 className="text-xl font-bold">Importação</h3>
                <p className="text-gray-500">
                  Importe seus dados de campanhas do Google Sheets com nosso template padronizado.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xl font-bold">2</span>
                  </div>
                  <div className="hidden md:block absolute top-1/2 left-full h-0.5 w-full bg-primary/30"></div>
                </div>
                <h3 className="text-xl font-bold">Análise</h3>
                <p className="text-gray-500">
                  Nossa IA analisa seus dados e identifica insights relevantes para suas campanhas.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Ação</h3>
                <p className="text-gray-500">
                  Receba um plano detalhado com ações para melhorar o desempenho das suas campanhas.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="rounded-2xl gradient-bg p-6 md:p-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-white">
                    Pronto para otimizar suas campanhas?
                  </h2>
                  <p className="text-gray-200 md:text-xl/relaxed mx-auto max-w-[700px]">
                    Desbloqueie o potencial máximo do seu investimento em publicidade digital.
                  </p>
                </div>
                <Link to="/upload">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Começar agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
