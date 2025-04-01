
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Narrative } from "@/services/narrativeService";
import { Activity, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NarrativeCardProps {
  narrative: Narrative;
}

export function NarrativeCard({ narrative }: NarrativeCardProps) {
  const getSentimentIcon = () => {
    switch (narrative.sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-narrative-positive" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-narrative-negative" />;
      default:
        return <Activity className="h-4 w-4 text-narrative-neutral" />;
    }
  };
  
  const getSentimentColor = () => {
    switch (narrative.sentiment) {
      case 'positive':
        return 'bg-narrative-positive/10 text-narrative-positive border-narrative-positive/20';
      case 'negative':
        return 'bg-narrative-negative/10 text-narrative-negative border-narrative-negative/20';
      default:
        return 'bg-narrative-neutral/10 text-narrative-neutral border-narrative-neutral/20';
    }
  };
  
  const getCategoryColor = () => {
    switch (narrative.category) {
      case 'ai':
        return 'bg-narrative-ai/10 text-narrative-ai border-narrative-ai/20';
      case 'recession':
        return 'bg-narrative-recession/10 text-narrative-recession border-narrative-recession/20';
      case 'inflation':
        return 'bg-narrative-inflation/10 text-narrative-inflation border-narrative-inflation/20';
      case 'growth':
        return 'bg-narrative-growth/10 text-narrative-growth border-narrative-growth/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getProgressColor = () => {
    if (narrative.strength >= 80) return 'bg-narrative-positive';
    if (narrative.strength >= 60) return 'bg-narrative-growth';
    if (narrative.strength >= 40) return 'bg-narrative-recession';
    return 'bg-narrative-neutral';
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {narrative.name}
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className={cn("text-xs py-0", getSentimentColor())}>
              <span className="flex items-center gap-1">
                {getSentimentIcon()}
                {narrative.sentiment}
              </span>
            </Badge>
            <Badge variant="outline" className={cn("text-xs py-0", getCategoryColor())}>
              {narrative.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {narrative.description}
        </p>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Narrative Strength</span>
              <span className="font-semibold">{narrative.strength}%</span>
            </div>
            <Progress value={narrative.strength} className="h-2" indicatorClassName={getProgressColor()} />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs">
              <span className="text-muted-foreground">First Detected:</span>
              <p className="font-medium">{new Date(narrative.date).toLocaleDateString()}</p>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Sources:</span>
              <p className="font-medium">{narrative.sources.length}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {narrative.relatedStocks.map((stock) => (
              <Badge key={stock} variant="secondary" className="text-xs">
                ${stock}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
