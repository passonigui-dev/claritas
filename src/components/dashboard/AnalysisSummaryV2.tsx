
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface AnalysisPoint {
  title: string;
  description: string;
}

interface AnalysisSummaryV2Props {
  strengths: AnalysisPoint[];
  weaknesses: AnalysisPoint[];
}

export function AnalysisSummaryV2({ strengths, weaknesses }: AnalysisSummaryV2Props) {
  const [viewMode, setViewMode] = useState<"strengths" | "weaknesses">("strengths");
  
  const points = viewMode === "strengths" ? strengths : weaknesses;

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analysis Summary</CardTitle>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {
          if (value) setViewMode(value as "strengths" | "weaknesses");
        }}>
          <ToggleGroupItem value="strengths" aria-label="Toggle strengths">
            Strengths
          </ToggleGroupItem>
          <ToggleGroupItem value="weaknesses" aria-label="Toggle weaknesses">
            Points to Improve
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <Card 
              key={index} 
              className={cn(
                "border",
                viewMode === "strengths" 
                  ? "bg-green-50 border-green-100" 
                  : "bg-red-50 border-red-100"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className={cn(
                  "text-base font-semibold",
                  viewMode === "strengths" ? "text-green-700" : "text-red-700"
                )}>
                  {point.title}
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                "text-sm",
                viewMode === "strengths" ? "text-green-800" : "text-red-800"
              )}>
                {point.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
