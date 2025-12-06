import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sun, Droplets, Thermometer, TriangleAlert } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Weather</CardTitle>
        <CardDescription>Conditions for your crops</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Sun className="h-7 w-7 text-yellow-500" />
            <span className="font-bold">28°C</span>
            <span className="text-xs text-muted-foreground">Sunny</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Droplets className="h-7 w-7 text-blue-500" />
            <span className="font-bold">75%</span>
            <span className="text-xs text-muted-foreground">Humidity</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="h-7 w-7 text-red-500" />
            <span className="font-bold">High</span>
            <span className="text-xs text-muted-foreground">UV Index</span>
          </div>
        </div>
        <Alert variant="destructive" className="bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
           <TriangleAlert className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
          <AlertTitle className="font-semibold">High Alert!</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            High humidity and temperature increase the risk of Powdery Mildew. Consider preventive spraying.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
