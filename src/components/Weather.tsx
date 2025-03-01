
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSun, Sun, Wind, Umbrella, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// OpenWeatherAPI key - this is a demo key and should be replaced with a real one
const API_KEY = "85a5a0e4aef25a9e4de84ff10d85b01c";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

interface AlertData {
  event: string;
  description: string;
  start: number;
  end: number;
}

interface City {
  name: string;
  lat: number;
  lon: number;
}

export function Weather() {
  const [city, setCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // List of cities to choose from
  const cities: City[] = [
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Delhi", lat: 28.7041, lon: 77.1025 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Berlin", lat: 52.5200, lon: 13.4050 },
  ];

  const fetchWeather = async () => {
    if (!city) return;
    
    setLoading(true);
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      
      // Fetch alerts
      const alertsResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`
      );
      
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.alerts || []);
      }
      
      toast({
        title: "Weather Updated",
        description: `Latest weather for ${city.name} has been loaded.`,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, [city]);

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "clouds":
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case "thunderstorm":
        return <CloudRain className="w-8 h-8 text-purple-500" />;
      case "snow":
        return <CloudSun className="w-8 h-8 text-blue-300" />;
      default:
        return <CloudSun className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Select
          onValueChange={(value) => {
            const selectedCity = cities.find(c => c.name === value);
            if (selectedCity) setCity(selectedCity);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={fetchWeather} 
          disabled={loading || !city}
          className="w-full md:w-auto"
        >
          {loading ? "Loading..." : "Refresh Weather"}
        </Button>
      </div>

      {weatherData ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white/90 hover:bg-white/95 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-semibold">{weatherData.name}</h3>
                  <p className="text-gray-500">{weatherData.weather[0].description}</p>
                </div>
                {getWeatherIcon(weatherData.weather[0].main)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Umbrella className="w-4 h-4 text-blue-500" />
                    <span>Humidity: {weatherData.main.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span>Wind: {weatherData.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 hover:bg-white/95 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-semibold">Weather Alerts</h3>
              </div>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div key={index} className="bg-orange-50 p-3 rounded-md border border-orange-200">
                      <div className="font-medium text-orange-800">{alert.event}</div>
                      <div className="text-sm text-orange-700 mt-1">{alert.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No active weather alerts for this area
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-white/90">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
            <Cloud className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">Weather Information</h3>
            <p className="text-gray-500 mt-2">
              Select a location from the dropdown to view current weather and alerts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
