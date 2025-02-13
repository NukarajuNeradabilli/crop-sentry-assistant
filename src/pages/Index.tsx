
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ManualInput } from "@/components/ManualInput";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, ChartBar, Sprout } from "lucide-react";

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
    <div className="min-h-screen bg-[#FFFFF0]">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">
            Agricultural Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload an image of the pest affecting your crops or enter crop conditions manually.
            We'll help identify pests and provide sustainable solutions, including fertilizer
            recommendations.
          </p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white/50">
            <TabsTrigger value="image">Image Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
            <TabsTrigger value="fertilizer">Fertilizer Recommendation</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-6">
            <ImageUpload onImageUpload={handleImageUpload} isLoading={loading} />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <ManualInput onSubmit={handleManualSubmit} isLoading={loading} />
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="bg-white/80 hover:bg-white/90 transition-colors">
            <CardContent className="p-6 flex items-center space-x-4">
              <Cloud className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-medium">Weather Forecast</h3>
                <p className="text-sm text-gray-500">Check local weather conditions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 hover:bg-white/90 transition-colors">
            <CardContent className="p-6 flex items-center space-x-4">
              <ChartBar className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-medium">Yield Estimate</h3>
                <p className="text-sm text-gray-500">View predicted crop yield</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 hover:bg-white/90 transition-colors">
            <CardContent className="p-6 flex items-center space-x-4">
              <Sprout className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium">Pest Database</h3>
                <p className="text-sm text-gray-500">Report unknown pests</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
