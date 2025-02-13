
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

export const ManualInput = ({ onSubmit, isLoading }: ManualInputProps) => {
  const [formData, setFormData] = useState({
    soil: "",
    water: "",
    weather: "",
    cropType: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  const handleChange = (field: string, value: string) => {
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
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              placeholder="Enter temperature"
              value={formData.temperature}
              onChange={(e) => handleChange("temperature", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity">Humidity (%)</Label>
            <Input
              id="humidity"
              type="number"
              placeholder="Enter humidity"
              value={formData.humidity}
              onChange={(e) => handleChange("humidity", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rainfall">Rainfall (mm)</Label>
            <Input
              id="rainfall"
              type="number"
              placeholder="Enter rainfall"
              value={formData.rainfall}
              onChange={(e) => handleChange("rainfall", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water">Irrigation Type</Label>
            <Select onValueChange={(value) => handleChange("water", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select irrigation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                <SelectItem value="flood">Flood Irrigation</SelectItem>
                <SelectItem value="rainfed">Rainfed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Conditions"}
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center space-x-4">
            <Cloud className="w-8 h-8 text-sky-500" />
            <div>
              <h3 className="font-semibold text-lg">Weather Forecast</h3>
              <p className="text-sm text-muted-foreground">
                5-day weather prediction for your location
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
                Estimated crop yield based on conditions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
