
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsByType } from "@/types";
import { formatCurrency, formatMetric } from "@/utils/metricCalculations";

interface ResultsSectionProps {
  resultsByType: ResultsByType;
  cpaByType: Record<string, number>;
}

export function ResultsSection({ resultsByType, cpaByType }: ResultsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(resultsByType).map(([type, data]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{type}</p>
                <p className="text-sm text-muted-foreground">
                  {formatMetric(data.count)} results
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                CPA: {formatCurrency(cpaByType[type])}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
