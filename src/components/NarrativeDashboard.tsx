
import { useQuery } from "@tanstack/react-query";
import { getNarratives, getNarrativeTrends } from "@/services/narrativeService";
import { NarrativeCard } from "./NarrativeCard";
import { NarrativeTimeline } from "./NarrativeTimeline";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function NarrativeDashboard() {
  const { 
    data: narratives, 
    isLoading: narrativesLoading,
    error: narrativesError
  } = useQuery({
    queryKey: ['narratives'],
    queryFn: getNarratives
  });
  
  const { 
    data: trends, 
    isLoading: trendsLoading,
    error: trendsError
  } = useQuery({
    queryKey: ['narrativeTrends'],
    queryFn: getNarrativeTrends
  });
  
  const isLoading = narrativesLoading || trendsLoading;
  const hasError = narrativesError || trendsError;

  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4">
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {narratives?.map((narrative) => (
              <NarrativeCard key={narrative.id} narrative={narrative} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NarrativeTimeline trends={trends || []} />
            
            <div className="grid grid-cols-1 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl">Narrative Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Analytics coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
