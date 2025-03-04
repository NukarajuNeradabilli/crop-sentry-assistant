
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Cloud, CloudRain, CloudSun, Sun, Wind, Umbrella, AlertTriangle, 
  ThermometerSun, Calendar, TrendingUp, TrendingDown, MapPin, CloudLightning, CloudSnow
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// OpenWeatherAPI key - this is a demo key and should be replaced with a real one
const API_KEY = "8a60536ccd769d757c70f5f61346d325";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
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
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface ForecastDay {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  humidity: number;
  wind_speed: number;
  pop: number; // Probability of precipitation
}

interface ForecastData {
  daily: ForecastDay[];
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
  const [forecastData, setForecastData] = useState<ForecastDay[] | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current");

  // List of cities in Andhra Pradesh, India
  const cities: City[] = [
    { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
    { name: "Vijayawada", lat: 16.5062, lon: 80.6480 },
    { name: "Guntur", lat: 16.3067, lon: 80.4365 },
    { name: "Tirupati", lat: 13.6288, lon: 79.4192 },
    { name: "Nellore", lat: 14.4426, lon: 79.9865 },
    { name: "Kurnool", lat: 15.8281, lon: 78.0373 },
    { name: "Rajahmundry", lat: 17.0005, lon: 81.8040 },
    { name: "Kakinada", lat: 16.9891, lon: 82.2475 },
    { name: "Eluru", lat: 16.7107, lon: 81.1031 },
    { name: "Anantapur", lat: 14.6819, lon: 77.6006 },
    { name: "Kadapa", lat: 14.4673, lon: 78.8242 },
    { name: "Ongole", lat: 15.5057, lon: 80.0499 },
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
      
      // Fetch forecast and alerts using One Call API
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData.daily);
        setAlerts(forecastData.alerts || []);
      } else {
        console.warn("Forecast API might require subscription. Falling back to 5-day forecast API.");
        
        // Fallback to 5-day/3-hour forecast API which is free
        const fallbackResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          // Process 5-day forecast data to appear like daily data
          const dailyData = processFallbackForecast(fallbackData.list);
          setForecastData(dailyData);
        }
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

  // Process 5-day/3-hour forecast into daily format
  const processFallbackForecast = (forecastList: any[]): ForecastDay[] => {
    const dailyMap = new Map<string, any>();
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          dt: item.dt,
          temp: {
            day: item.main.temp,
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          weather: item.weather,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          pop: item.pop || 0
        });
      } else {
        const existing = dailyMap.get(date);
        // Update min/max
        if (item.main.temp_max > existing.temp.max) {
          existing.temp.max = item.main.temp_max;
        }
        if (item.main.temp_min < existing.temp.min) {
          existing.temp.min = item.main.temp_min;
        }
        // Use noon temperature as day temperature if possible
        const hour = new Date(item.dt * 1000).getHours();
        if (hour >= 11 && hour <= 13) {
          existing.temp.day = item.main.temp;
          existing.weather = item.weather;
        }
      }
    });
    
    return Array.from(dailyMap.values());
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
        return <CloudLightning className="w-8 h-8 text-purple-500" />;
      case "snow":
        return <CloudSnow className="w-8 h-8 text-blue-300" />;
      default:
        return <CloudSun className="w-8 h-8 text-gray-400" />;
    }
  };

  // Get weather recommendation based on conditions
  const getWeatherRecommendation = (weatherType: string, temp: number, pop: number = 0) => {
    const recommendations = [];
    
    // Temperature based recommendations
    if (temp > 35) {
      recommendations.push("Stay hydrated and avoid direct sun exposure during peak hours.");
    } else if (temp > 30) {
      recommendations.push("Consider wearing light clothing and carrying water.");
    } else if (temp < 15) {
      recommendations.push("Wear warm clothing.");
    }
    
    // Weather condition based recommendations
    switch (weatherType.toLowerCase()) {
      case "rain":
      case "drizzle":
      case "thunderstorm":
        recommendations.push("Carry an umbrella and avoid open areas during thunderstorms.");
        break;
      case "snow":
        recommendations.push("Wear warm, waterproof clothing and drive carefully.");
        break;
      case "clear":
        if (temp > 25) {
          recommendations.push("Use sunscreen and stay in shade when possible.");
        }
        break;
    }
    
    // Precipitation probability based recommendations
    if (pop > 0.5) {
      recommendations.push("High chance of precipitation, be prepared for rain.");
    }
    
    return recommendations.length > 0 ? recommendations : ["No specific recommendations for today's weather."];
  };
  
  // Format date from Unix timestamp
  const formatDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="current" className="flex items-center gap-1">
              <ThermometerSun className="w-4 h-4" />
              Current
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              7-Day Forecast
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card className="bg-white/90 hover:bg-white/95 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <h3 className="text-2xl font-semibold">{weatherData.name}</h3>
                    </div>
                    <p className="text-gray-500 capitalize">{weatherData.weather[0].description}</p>
                  </div>
                  {getWeatherIcon(weatherData.weather[0].main)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
                    <div className="text-sm text-gray-500">
                      Feels like {Math.round(weatherData.main.feels_like)}°C
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      <span>High: {Math.round(weatherData.main.temp_max)}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                      <span>Low: {Math.round(weatherData.main.temp_min)}°C</span>
                    </div>
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
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-gray-500" />
                      <span>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {getWeatherRecommendation(weatherData.weather[0].main, weatherData.main.temp).map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 text-lg">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {forecastData ? forecastData.slice(0, 7).map((day, index) => (
                <Card key={index} className="bg-white/90 hover:bg-white/95 transition-colors">
                  <CardContent className="p-4">
                    <div className="text-center mb-2">
                      <p className="font-semibold">{formatDate(day.dt)}</p>
                    </div>
                    <div className="flex justify-center mb-3">
                      {getWeatherIcon(day.weather[0].main)}
                    </div>
                    <div className="text-center mb-3">
                      <p className="capitalize text-sm text-gray-600">{day.weather[0].description}</p>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                        <span>{Math.round(day.temp.max)}°C</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingDown className="w-3 h-3 text-blue-500 mr-1" />
                        <span>{Math.round(day.temp.min)}°C</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center">
                        <Umbrella className="w-3 h-3 text-blue-500 mr-1" />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="w-3 h-3 text-blue-500 mr-1" />
                        <span>{day.wind_speed} m/s</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <CloudRain className="w-3 h-3 text-blue-500 mr-1" />
                        <span>Rain: {Math.round(day.pop * 100)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Loading forecast data...
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="bg-white/90 hover:bg-white/95 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-semibold">Weather Alerts</h3>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                      <div key={index} className="bg-orange-50 p-3 rounded-md border border-orange-200">
                        <div className="font-medium text-orange-800">{alert.event}</div>
                        <div className="text-sm text-gray-700 mt-1 mb-2">
                          Valid: {formatDate(alert.start)} - {formatDate(alert.end)}
                        </div>
                        <div className="text-sm text-orange-700 mt-1">{alert.description}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No active weather alerts for this area
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Weather Safety Tips</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500 text-lg">•</span> Stay informed about changing weather conditions
                    </li>
                    <li className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500 text-lg">•</span> During thunderstorms, stay indoors and away from windows
                    </li>
                    <li className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500 text-lg">•</span> In case of heavy rain, avoid driving through flooded roads
                    </li>
                    <li className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500 text-lg">•</span> Keep emergency supplies ready during severe weather
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-white/90">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
            <Cloud className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">Weather Information</h3>
            <p className="text-gray-500 mt-2">
              Select a location from the dropdown to view current weather, forecast, and alerts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Add missing Moon icon since it's used in the component
const Moon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
