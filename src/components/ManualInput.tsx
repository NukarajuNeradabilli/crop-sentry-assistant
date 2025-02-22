
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { ChartBar, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManualInputProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface YieldPrediction {
  prediction: number;
  unit: string;
}

export const ManualInput = ({ onSubmit, isLoading }: ManualInputProps) => {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<YieldPrediction | null>(null);
  const [formData, setFormData] = useState({
    crop_type: "",
    soil_type: "",
    area: 0,
    rainfall: 0,
    fertilizer: 0,
    pesticide: 0,
    temperature: 0,
    humidity: 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/predict-yield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to predict yield');
      }

      const data = await response.json();
      setPrediction(data);
      toast({
        title: "Prediction Complete",
        description: `Predicted yield: ${data.prediction.toFixed(2)} ${data.unit}`,
      });
      onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to predict yield. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crop_type">Crop Type</Label>
            <Select
              onValueChange={(value) => handleChange("crop_type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="sugarcane">Sugarcane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil_type">Soil Type</Label>
            <Select onValueChange={(value) => handleChange("soil_type", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (hectares)</Label>
            <Input
              id="area"
              type="number"
              placeholder="Enter area"
              value={formData.area}
              onChange={(e) => handleChange("area", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
            <Input
              id="rainfall"
              type="number"
              placeholder="Enter rainfall"
              value={formData.rainfall}
              onChange={(e) => handleChange("rainfall", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fertilizer">Fertilizer (kg/hectare)</Label>
            <Input
              id="fertilizer"
              type="number"
              placeholder="Enter fertilizer amount"
              value={formData.fertilizer}
              onChange={(e) => handleChange("fertilizer", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesticide">Pesticide (kg/hectare)</Label>
            <Input
              id="pesticide"
              type="number"
              placeholder="Enter pesticide amount"
              value={formData.pesticide}
              onChange={(e) => handleChange("pesticide", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              placeholder="Enter temperature"
              value={formData.temperature}
              onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
              required
              min="-50"
              max="60"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity">Humidity (%)</Label>
            <Input
              id="humidity"
              type="number"
              placeholder="Enter humidity"
              value={formData.humidity}
              onChange={(e) => handleChange("humidity", parseFloat(e.target.value))}
              required
              min="0"
              max="100"
              step="1"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Predict Yield"}
        </Button>
      </form>

      {prediction && (
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Prediction Results</h3>
            <p className="text-lg">
              Expected Yield: <span className="font-bold">{prediction.prediction.toFixed(2)}</span> {prediction.unit}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center space-x-4">
            <Cloud className="w-8 h-8 text-sky-500" />
            <div>
              <h3 className="font-semibold text-lg">Weather Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Impact of weather conditions on crop yield
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center space-x-4">
            <ChartBar className="w-8 h-8 text-emerald-500" />
            <div>
              <h3 className="font-semibold text-lg">Yield Prediction</h3>
              <p className="text-sm text-muted-foreground">
                Estimated crop yield based on inputs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
