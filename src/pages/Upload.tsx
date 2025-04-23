
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SheetUploader } from "@/components/uploadForm/SheetUploader";

export default function Upload() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        <div className="container py-12 md:py-24 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Importar seus dados
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed">
              Compartilhe o link da sua planilha do Google Sheets para começarmos a análise.
              Você pode usar nosso template para garantir uma análise precisa.
            </p>
          </div>
          
          <div className="w-full max-w-md">
            <SheetUploader />
          </div>
          
          <div className="mt-12 p-6 border rounded-lg bg-gray-50 w-full max-w-2xl">
            <h3 className="font-semibold mb-3">Como funciona:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Baixe nosso template do Google Sheets</li>
              <li>Preencha com os dados das suas campanhas (Google Ads e Meta Ads)</li>
              <li>Compartilhe o link da planilha acima</li>
              <li>Nossa IA analisará seus dados e criará um dashboard personalizado</li>
              <li>Receba insights e um plano de ação detalhado para melhorar resultados</li>
            </ol>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
