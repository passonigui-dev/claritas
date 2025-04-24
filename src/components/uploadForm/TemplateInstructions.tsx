
import { Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TemplateInstructions() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Instruções do Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">✅ Colunas Obrigatórias:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Dia</li>
            <li>Objetivo</li>
            <li>Plataforma</li>
            <li>Nome da campanha</li>
            <li>Nome do conjunto de anúncios</li>
            <li>Nome do anúncio</li>
            <li>Orçamento da campanha</li>
            <li>Tipo de orçamento da campanha</li>
            <li>Orçamento do conjunto de anúncios</li>
            <li>Tipo de orçamento do conjunto de anúncios</li>
            <li>Valor usado (BRL)</li>
            <li>Impressões</li>
            <li>Alcance</li>
            <li>Tipo de resultado</li>
            <li>Resultados</li>
            <li>Status de veiculação</li>
            <li>Nível de veiculação</li>
            <li>Cliques no link</li>
            <li>Início dos relatórios</li>
            <li>Término dos relatórios</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">📊 Formato dos Dados:</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Campos de Data</strong> (Dia, Início/Término dos relatórios):
                <br />
                Formato YYYY-MM-DD (exemplo: 2024-04-24)
              </span>
            </li>
            <li>
              <strong>Campos de Texto</strong> (Objetivo, Plataforma, etc):
              <br />
              Texto simples, mantendo consistência com nomenclatura da plataforma
            </li>
            <li>
              <strong>Campos Numéricos</strong> (Orçamentos, Valor usado, etc):
              <br />
              Números com ponto (.) como separador decimal
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">⚠️ Atenção:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Os nomes das colunas devem ser exatamente como listados (incluindo acentos e espaços)</li>
            <li>Todos os valores monetários devem estar em Reais (BRL)</li>
            <li>Use ponto (.) como separador decimal</li>
            <li>Deixe células vazias para dados ausentes (não use 0 como placeholder)</li>
            <li>Remova linhas ou colunas vazias antes do upload</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
