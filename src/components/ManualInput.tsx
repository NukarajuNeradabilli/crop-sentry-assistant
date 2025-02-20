
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

interface ManualInputProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface YieldPredictionData {
  cropType: string;
  soil: string;
  area: number;
  annualRainfall: number;
  fertilizer: number;
  pesticide: number;
  temperature: number;
  humidity: number;
}

export const ManualInput = ({ onSubmit, isLoading }: ManualInputProps) => {
  const [formData, setFormData] = useState<YieldPredictionData>({
    cropType: "",
    soil: "",
    area: 0,
    annualRainfall: 0,
    fertilizer: 0,
    pesticide: 0,
    temperature: 0,
    humidity: 0,
  });

  const handleChange = (field: keyof YieldPredictionData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cropType">Crop Type</Label>
            <Select
              onValueChange={(value) => handleChange("cropType", value)}
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
            <Label htmlFor="soil">Soil Type</Label>
            <Select onValueChange={(value) => handleChange("soil", value)} required>
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
            <Label htmlFor="annualRainfall">Annual Rainfall (mm)</Label>
            <Input
              id="annualRainfall"
              type="number"
              placeholder="Enter annual rainfall"
              value={formData.annualRainfall}
              onChange={(e) => handleChange("annualRainfall", parseFloat(e.target.value))}
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
