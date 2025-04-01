
import { NarrativeHeader } from "@/components/NarrativeHeader";
import { NarrativeDashboard } from "@/components/NarrativeDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <NarrativeHeader />
        <NarrativeDashboard />
      </div>
    </div>
  );
};

export default Index;
