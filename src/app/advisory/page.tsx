
'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CloudSun, GitBranch, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getFarmingRecommendations } from '@/app/actions';
import type { GetFarmingRecommendationsOutput, GetFarmingRecommendationsInput } from '@/ai/flows/get-farming-recommendations';
import { useToast } from '@/hooks/use-toast';

const LOCATIONS = [
    { name: 'Punjab, India', past_crop: 'Wheat' },
    { name: 'Andhra Pradesh, India', past_crop: 'Rice' },
    { name: 'Maharashtra, India', past_crop: 'Sugarcane' },
    { name: 'Central Valley, California', past_crop: 'Almonds' },
    { name: 'Midwest, USA', past_crop: 'Corn' },
];

const mockWeatherData: Omit<GetFarmingRecommendationsInput, 'language_preference' | 'user_location' | 'past_crop'> = {
    temperature: 28,
    humidity: 75,
    rainfall: 5,
    uv_index: 'High',
    weather_condition: 'Partly Cloudy',
    past_week_weather: 'Mixed sun and clouds with intermittent showers. Temperatures ranged from 25°C to 32°C.',
};


function AdvisoryResults({ results }: { results: GetFarmingRecommendationsOutput }) {
  const { getTranslation } = useLanguage();
  return (
    <div className="mt-8 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CloudSun className="text-primary"/>{getTranslation('advisory.currentWeather')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{results.current_weather_summary}</p>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>{getTranslation('advisory.riskAlerts')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                    {results.risk_alerts.map((alert, i) => (
                        <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-destructive" />
                        <span>{alert}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GitBranch className="text-accent"/>{getTranslation('advisory.nextSeasonCrops')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                    {results.next_season_crop_recommendations.map((crop, i) => (
                        <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>{crop}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary"/>{getTranslation('advisory.farmingRecommendations')}</CardTitle>
            </CardHeader>
            <CardContent>
                 <ul className="space-y-3">
                    {results.farming_recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{rec}</span>
                        </li>
                    ))}
                 </ul>
            </CardContent>
        </Card>

        <Card className='bg-background/50'>
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="text-muted-foreground"/>{getTranslation('advisory.explanation')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{results.explanation}</p>
            </CardContent>
        </Card>
    </div>
  );
}


export default function AdvisoryPage() {
    const { getTranslation, language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [results, setResults] = useState<GetFarmingRecommendationsOutput | null>(null);
    const { toast } = useToast();

    async function handleGetAdvisory() {
        if (!selectedLocation) return;
        setIsLoading(true);
        setResults(null);

        const locationData = LOCATIONS.find(l => l.name === selectedLocation);
        if (!locationData) return;

        const input: GetFarmingRecommendationsInput = {
            ...mockWeatherData,
            user_location: locationData.name,
            past_crop: locationData.past_crop,
            language_preference: language,
        };

        const response = await getFarmingRecommendations(input);

        if (response.success && response.data) {
            setResults(response.data);
        } else {
            toast({
                variant: 'destructive',
                title: getTranslation('advisory.errorTitle'),
                description: response.error || getTranslation('advisory.errorDescription'),
            });
        }

        setIsLoading(false);
    }

    return (
        <SidebarInset>
            <div className="flex h-full flex-col">
                <Header title={getTranslation('keyMapping.advisory')} />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight">{getTranslation('advisory.pageTitle')}</h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                {getTranslation('advisory.pageDescription')}
                            </p>
                        </div>
                        
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>{getTranslation('advisory.selectLocation')}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row gap-4">
                                <Select onValueChange={setSelectedLocation} value={selectedLocation}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={getTranslation('advisory.selectLocation')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATIONS.map(loc => (
                                            <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleGetAdvisory} disabled={isLoading || !selectedLocation} className="sm:w-auto">
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CloudSun className="mr-2 h-4 w-4" />
                                    )}
                                    {getTranslation('advisory.getLocation')}
                                </Button>
                            </CardContent>
                        </Card>

                        {isLoading && (
                            <div className="flex justify-center mt-8">
                                <div className='text-center space-y-2'>
                                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                                <p className='text-muted-foreground'>{getTranslation('advisory.loading')}</p>
                                </div>
                            </div>
                        )}

                        {results && <AdvisoryResults results={results} />}

                    </div>
                </main>
            </div>
        </SidebarInset>
    );
}
