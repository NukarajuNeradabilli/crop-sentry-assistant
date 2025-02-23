
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
import { useToast } from "@/hooks/use-toast";

interface FertilizerRecommendation {
  name: string;
  description: string;
  dosage: string;
}

export const FertilizerRecommendation = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pest_identified: "",
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    soil_nutrient_level: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recommend-fertilizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      toast({
        title: "Analysis Complete",
        description: "Fertilizer recommendations generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Fertilizer Recommendation</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pest_identified">Pest Identified</Label>
            <Input
              id="pest_identified"
              value={formData.pest_identified}
              onChange={(e) => handleChange("pest_identified", e.target.value)}
              placeholder="Enter identified pest"
              required
            />
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
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              value={formData.temperature}
              onChange={(e) => handleChange("temperature", e.target.value)}
              placeholder="Enter temperature"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity">Humidity (%)</Label>
            <Input
              id="humidity"
              type="number"
              value={formData.humidity}
              onChange={(e) => handleChange("humidity", e.target.value)}
              placeholder="Enter humidity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moisture">Moisture (%)</Label>
            <Input
              id="moisture"
              type="number"
              value={formData.moisture}
              onChange={(e) => handleChange("moisture", e.target.value)}
              placeholder="Enter moisture level"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil_nutrient_level">Soil Nutrient Level</Label>
            <Select onValueChange={(value) => handleChange("soil_nutrient_level", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select nutrient level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nitrogen">Nitrogen (N) Level</Label>
            <Input
              id="nitrogen"
              type="number"
              value={formData.nitrogen}
              onChange={(e) => handleChange("nitrogen", e.target.value)}
              placeholder="Enter nitrogen level"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phosphorus">Phosphorus (P) Level</Label>
            <Input
              id="phosphorus"
              type="number"
              value={formData.phosphorus}
              onChange={(e) => handleChange("phosphorus", e.target.value)}
              placeholder="Enter phosphorus level"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="potassium">Potassium (K) Level</Label>
            <Input
              id="potassium"
              type="number"
              value={formData.potassium}
              onChange={(e) => handleChange("potassium", e.target.value)}
              placeholder="Enter potassium level"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Get Recommendations"}
        </Button>
      </form>

      {recommendations.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">Recommended Fertilizers</h4>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold">{rec.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <p className="text-sm text-gray-600 mt-1">Dosage: {rec.dosage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
