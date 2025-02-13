
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ManualInput } from "@/components/ManualInput";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResult {
  pestName?: string;
  confidence?: number;
  severity?: "low" | "medium" | "high";
  recommendations?: {
    pesticides: Array<{ name: string; description: string }>;
    fertilizers: Array<{ name: string; description: string }>;
  };
  yieldPrediction?: {
    estimated: number;
    unit: string;
  };
  weather?: {
    forecast: Array<{
      date: string;
      condition: string;
      temperature: number;
    }>;
  };
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    try {
      // Backend integration will be added here
      toast({
        title: "Image received",
        description: "Analysis will be integrated soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Backend integration will be added here
      toast({
        title: "Data received",
        description: "Analysis will be integrated soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            Crop Sentry Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload an image of your crop or enter conditions manually for pest prediction,
            fertilizer recommendations, and yield estimates.
          </p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="image" className="text-lg">
              Image Analysis
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-lg">
              Manual Input
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-6">
            <ImageUpload onImageUpload={handleImageUpload} isLoading={loading} />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <ManualInput onSubmit={handleManualSubmit} isLoading={loading} />
          </TabsContent>
        </Tabs>

        {/* Results will be displayed here once backend is integrated */}
      </div>
    </div>
  );
};

export default Index;
