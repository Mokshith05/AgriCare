'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Droplets, Thermometer, TriangleAlert, Loader2, Cloud, Zap, CloudRain } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getRealtimeWeather } from '@/app/actions';
import type { GetWeatherDataOutput } from '@/ai/flows/get-weather-data';

const CITIES = ['Bangalore', 'Chennai', 'Kolkata', 'Mumbai', 'New Delhi'].sort();

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
    case 'hazy':
      return <Sun className="h-7 w-7 text-yellow-500" />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud className="h-7 w-7 text-gray-400" />;
    case 'rainy':
    case 'showers':
      return <CloudRain className="h-7 w-7 text-blue-500" />;
    case 'thunderstorm':
      return <Zap className="h-7 w-7 text-yellow-400" />;
    default:
      return <Sun className="h-7 w-7 text-yellow-500" />;
  }
};


export default function WeatherWidget() {
  const { getTranslation } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weather, setWeather] = useState<GetWeatherDataOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const response = await getRealtimeWeather({ city: selectedCity });
      if (response.success && response.data) {
        setWeather(response.data);
      } else {
        // Handle error, maybe show a toast
        console.error(response.error);
        setWeather(null);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [selectedCity]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation('dashboard.localWeather')}</CardTitle>
        <CardDescription>
          <Select onValueChange={setSelectedCity} defaultValue={selectedCity}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder={getTranslation('dashboard.selectCity')} />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : weather ? (
          <>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <WeatherIcon condition={weather.condition} />
                <span className="font-bold">{weather.temperature}°C</span>
                <span className="text-xs text-muted-foreground">{weather.condition}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Droplets className="h-7 w-7 text-blue-500" />
                <span className="font-bold">{weather.humidity}%</span>
                <span className="text-xs text-muted-foreground">{getTranslation('dashboard.humidity')}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Thermometer className="h-7 w-7 text-red-500" />
                <span className="font-bold">{weather.uvIndex}</span>
                <span className="text-xs text-muted-foreground">{getTranslation('dashboard.uvIndex')}</span>
              </div>
            </div>
            {weather.alert && weather.alert.title && (
              <Alert variant="destructive" className="bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
                <TriangleAlert className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
                <AlertTitle className="font-semibold">{weather.alert.title}</AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  {weather.alert.description}
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
           <p className="text-center text-muted-foreground">{getTranslation('dashboard.weatherError')}</p>
        )}
      </CardContent>
    </Card>
  );
}
