'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sun, Droplets, Thermometer, TriangleAlert } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function WeatherWidget() {
  const { getTranslation } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation('dashboard.localWeather')}</CardTitle>
        <CardDescription>{getTranslation('dashboard.weatherDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Sun className="h-7 w-7 text-yellow-500" />
            <span className="font-bold">28°C</span>
            <span className="text-xs text-muted-foreground">{getTranslation('dashboard.sunny')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Droplets className="h-7 w-7 text-blue-500" />
            <span className="font-bold">75%</span>
            <span className="text-xs text-muted-foreground">{getTranslation('dashboard.humidity')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="h-7 w-7 text-red-500" />
            <span className="font-bold">{getTranslation('dashboard.high')}</span>
            <span className="text-xs text-muted-foreground">{getTranslation('dashboard.uvIndex')}</span>
          </div>
        </div>
        <Alert variant="destructive" className="bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
           <TriangleAlert className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
          <AlertTitle className="font-semibold">{getTranslation('dashboard.highAlert')}</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            {getTranslation('dashboard.alertDescription')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
