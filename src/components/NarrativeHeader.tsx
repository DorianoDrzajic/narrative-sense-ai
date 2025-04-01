
import { MoveUpRight, BrainCircuit, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { analyzeTextWithAI } from "@/services/narrativeService";

export function NarrativeHeader() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeText = async () => {
    if (!analysisText) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter a Perplexity API key",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeTextWithAI({ text: analysisText, apiKey });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Market Narrative AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Detect evolving market narratives and forecast regime shifts
        </p>
      </div>
      
      <div className="flex gap-3">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-2">
              <MoveUpRight className="h-4 w-4" />
              New Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Analyze New Content</DialogTitle>
              <DialogDescription>
                Enter text from financial news, earnings calls, or market reports to detect narratives.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="text" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Analyze Text</TabsTrigger>
                <TabsTrigger value="upload" disabled>Upload File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    Perplexity API Key
                  </label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for AI-powered narrative detection
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Content to Analyze
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Paste financial news, earnings call transcript, or other market content here..."
                    rows={8}
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleAnalyzeText} 
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Detect Narratives"}
                </Button>
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="text-center py-8 text-muted-foreground">
                  File upload feature coming soon
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          View Reports
        </Button>
      </div>
    </div>
  );
}
