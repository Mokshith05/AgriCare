'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wand2, Loader2, ListTree, TestTube2, ChevronsUpDown } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { recommendCrops } from '@/app/actions';
import type { RecommendCropsOutput } from '@/ai/flows/recommend-crops';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SOIL_TYPES = ["Clay", "Sandy", "Silty", "Peaty", "Chalky", "Loamy"];

const formSchema = z.object({
  location: z.string().min(3, 'Location is required.'),
  soilType: z.string().min(1, 'Please select a soil type.'),
  pastCropRotation: z.string(),
  additionalInformation: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

function RecommendationResults({ results }: { results: RecommendCropsOutput }) {
    const { getTranslation } = useLanguage();
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>{getTranslation('recommendations.resultsTitle')}</CardTitle>
                <CardDescription>{getTranslation('recommendations.resultsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-muted-foreground">{results.summary}</p>
                <Accordion type="single" collapsible className="w-full">
                    {results.recommended_crops.map((rec, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                                 <div className="flex items-center gap-3">
                                     <ListTree className="h-6 w-6 text-primary" />
                                     {rec.crop}
                                 </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pt-2">
                                    <p><strong className='text-foreground'>{getTranslation('recommendations.whySuitable')}:</strong> {rec.why_suitable}</p>
                                    <p><strong className='text-foreground'>{getTranslation('recommendations.plantingSeason')}:</strong> {rec.planting_season}</p>
                                    <div>
                                        <strong className='text-foreground'>{getTranslation('recommendations.organicFertilizers')}:</strong>
                                        <ul className="list-disc pl-5 mt-1">
                                            {rec.organic_fertilizers.map((fert, i) => <li key={i}>{fert}</li>)}
                                        </ul>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">{rec.expected_yield_note}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}

export default function RecommendationsPage() {
  const { getTranslation, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RecommendCropsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      soilType: '',
      pastCropRotation: '',
      additionalInformation: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResults(null);
    
    const response = await recommendCrops({ ...values, language_preference: language });

    if (response.success && response.data) {
        setResults(response.data);
    } else {
        toast({
            variant: "destructive",
            title: getTranslation('recommendations.errorTitle'),
            description: response.error || getTranslation('recommendations.errorDescription')
        });
    }

    setIsLoading(false);
  }

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('keyMapping.recommendations')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
             <Card>
                <CardHeader>
                  <CardTitle>{getTranslation('recommendations.title')}</CardTitle>
                  <CardDescription>{getTranslation('recommendations.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                   <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{getTranslation('recommendations.location')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={getTranslation('recommendations.locationPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormDescription>{getTranslation('recommendations.locationDescription')}</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                             <FormField
                                control={form.control}
                                name="soilType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{getTranslation('recommendations.soilType')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={getTranslation('recommendations.soilTypePlaceholder')} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {SOIL_TYPES.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                     <FormDescription>{getTranslation('recommendations.soilTypeDescription')}</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        <FormField
                            control={form.control}
                            name="pastCropRotation"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{getTranslation('recommendations.pastCropRotation')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={getTranslation('recommendations.pastCropRotationPlaceholder')} {...field} />
                                </FormControl>
                                 <FormDescription>{getTranslation('recommendations.pastCropRotationDescription')}</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="additionalInformation"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{getTranslation('recommendations.additionalInformation')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={getTranslation('recommendations.additionalInformationPlaceholder')}
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                 <FormDescription>{getTranslation('recommendations.additionalInformationDescription')}</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            {getTranslation('recommendations.getRecommendation')}
                        </Button>
                     </form>
                   </Form>
                </CardContent>
             </Card>

             {isLoading && (
                 <div className="flex justify-center mt-8">
                     <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 </div>
             )}

             {results && <RecommendationResults results={results} />}
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
