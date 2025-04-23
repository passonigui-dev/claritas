
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
  const teamMembers = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      bio: "Especialista em análise de dados de marketing com mais de 10 anos de experiência."
    },
    {
      name: "Carlos Mendes",
      role: "CTO",
      bio: "Desenvolvedor sênior especializado em inteligência artificial e análise de dados."
    },
    {
      name: "Mariana Costa",
      role: "Especialista em Marketing Digital",
      bio: "Vasta experiência em otimização de campanhas de Google e Meta Ads."
    }
  ];

  return (
    <>
      <Navbar />
      
      <main>
        <section className="py-16 md:py-24 px-4">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Sobre o Claritas</h1>
              <p className="text-xl text-muted-foreground">
                Transformando dados brutos de campanhas em insights valiosos para impulsionar seus resultados.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div>
                <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-lg text-gray-600 mb-6">
                  O Claritas nasceu da necessidade de simplificar a análise de campanhas publicitárias digitais. 
                  Notamos que muitas empresas investem em marketing digital, mas não têm as ferramentas adequadas 
                  para extrair insights reais dos resultados de suas campanhas.
                </p>
                <p className="text-lg text-gray-600">
                  Nossa missão é democratizar a inteligência de marketing digital, tornando análises 
                  avançadas acessíveis a empresas de todos os tamanhos, sem a necessidade de uma 
                  equipe especializada de cientistas de dados.
                </p>
              </div>
              <div className="gradient-bg p-6 rounded-2xl shadow-xl h-72 flex items-center justify-center">
                <div className="card-gradient rounded-xl p-8 w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Dados com clareza</h3>
                    <p className="text-gray-700">
                      Transformamos informação em ação para impulsionar seus resultados
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Como funciona</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="min-w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Importação de dados</h3>
                    <p className="text-gray-600">
                      Fornecemos um template padronizado do Google Sheets para você preencher com seus dados
                      de campanhas do Google Ads e Meta Ads. Você compartilha o link conosco e nós fazemos o resto.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="min-w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Análise inteligente</h3>
                    <p className="text-gray-600">
                      Nossa inteligência artificial analisa seus dados, identifica padrões, problemas e 
                      oportunidades. Ela compara seus resultados com benchmarks do setor e identifica áreas 
                      de melhoria específicas.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="min-w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Dashboard personalizado</h3>
                    <p className="text-gray-600">
                      Apresentamos os insights em um dashboard interativo e visualmente intuitivo, 
                      proporcionando uma visão clara do desempenho das suas campanhas e destacando 
                      os pontos fortes e fracos.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="min-w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Plano de ação</h3>
                    <p className="text-gray-600">
                      Fornecemos um plano de ação detalhado com recomendações específicas para melhorar o 
                      desempenho das suas campanhas. Estas ações podem ser facilmente exportadas para 
                      ferramentas de gerenciamento de tarefas como o ClickUp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-24">
              <h2 className="text-3xl font-bold mb-8 text-center">Nossa Equipe</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Desbloqueie o potencial das suas campanhas publicitárias com análises inteligentes e ações claras.
              </p>
              <Link to="/upload">
                <Button size="lg">Iniciar análise gratuita</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
