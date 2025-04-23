
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StrengthWeakness {
  title: string;
  description: string;
}

interface AnalysisSummaryProps {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
}

export function AnalysisSummary({ strengths, weaknesses }: AnalysisSummaryProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Resumo da Análise</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="strengths">
          <TabsList className="mb-4">
            <TabsTrigger value="strengths">Pontos Fortes</TabsTrigger>
            <TabsTrigger value="weaknesses">Pontos a Melhorar</TabsTrigger>
          </TabsList>
          <TabsContent value="strengths">
            <div className="grid gap-4 md:grid-cols-2">
              {strengths.map((item, index) => (
                <Card key={index} className="bg-green-50 border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-green-700">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-800">
                    {item.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weaknesses">
            <div className="grid gap-4 md:grid-cols-2">
              {weaknesses.map((item, index) => (
                <Card key={index} className="bg-red-50 border-red-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-red-700">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-red-800">
                    {item.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
