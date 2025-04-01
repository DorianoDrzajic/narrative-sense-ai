
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NarrativeTrend } from "@/services/narrativeService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from "@/lib/utils";

interface NarrativeTimelineProps {
  trends: NarrativeTrend[];
}

export function NarrativeTimeline({ trends }: NarrativeTimelineProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return '#8B5CF6';
      case 'recession':
        return '#F59E0B';
      case 'inflation':
        return '#EC4899';
      case 'growth':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Prepare data for the combined chart
  const combinedData = trends.length > 0 ? trends[0].dataPoints.map(point => {
    const item: any = { date: formatDate(point.date) };
    trends.forEach(trend => {
      const matchingPoint = trend.dataPoints.find(p => p.date === point.date);
      if (matchingPoint) {
        item[trend.name] = matchingPoint.strength;
      }
    });
    return item;
  }) : [];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Narrative Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
            <TabsTrigger value="all">All Narratives</TabsTrigger>
            <TabsTrigger value="individual">Individual Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                {trends.map((trend) => (
                  <Line 
                    key={trend.narrativeId}
                    type="monotone" 
                    dataKey={trend.name} 
                    stroke={getCategoryColor(trend.category)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="individual" className="space-y-8">
            {trends.map((trend) => (
              <div key={trend.narrativeId} className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <span 
                    className={cn("w-3 h-3 rounded-full", {
                      "bg-narrative-ai": trend.category === 'ai',
                      "bg-narrative-recession": trend.category === 'recession',
                      "bg-narrative-inflation": trend.category === 'inflation',
                      "bg-narrative-growth": trend.category === 'growth',
                      "bg-narrative-neutral": trend.category === 'other',
                    })}
                  ></span>
                  {trend.name}
                </h3>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={trend.dataPoints.map(p => ({ date: formatDate(p.date), strength: p.strength }))} 
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="strength" 
                        stroke={getCategoryColor(trend.category)}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
