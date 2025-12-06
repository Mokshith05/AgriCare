'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calculator, Loader2, BarChart, LineChart, Percent } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { calculateProfit } from '@/app/actions';
import type { CalculateProfitOutput } from '@/ai/flows/calculate-profit';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  crop_name: z.string().min(2, 'Crop name is required.'),
  acreage: z.coerce.number().positive('Acreage must be a positive number.'),
  yield_per_acre: z.coerce.number().nonnegative('Yield must be a non-negative number.'),
  market_price: z.coerce.number().nonnegative('Market price must be a non-negative number.'),
  total_costs: z.coerce.number().nonnegative('Total costs must be a non-negative number.'),
});

type FormValues = z.infer<typeof formSchema>;

function ProfitResults({ results }: { results: CalculateProfitOutput }) {
  const { getTranslation } = useLanguage();
  return (
    <Card className="h-full bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{getTranslation('profitCalculator.resultsTitle')}</CardTitle>
        <CardDescription>{getTranslation('profitCalculator.resultsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-background/50 p-3">
            <p className="text-sm text-muted-foreground">{getTranslation('profitCalculator.totalRevenue')}</p>
            <p className="text-2xl font-bold text-primary">{results.total_revenue}</p>
          </div>
          <div className="rounded-lg bg-background/50 p-3">
            <p className="text-sm text-muted-foreground">{getTranslation('profitCalculator.profit')}</p>
            <p className="text-2xl font-bold text-green-500">{results.profit}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
                <BarChart className="h-6 w-6 text-accent"/>
                <div>
                    <p className="text-xs text-muted-foreground">{getTranslation('profitCalculator.totalYield')}</p>
                    <p className="font-semibold">{results.total_yield}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
                <Percent className="h-6 w-6 text-accent"/>
                <div>
                    <p className="text-xs text-muted-foreground">{getTranslation('profitCalculator.profitMargin')}</p>
                    <p className="font-semibold">{results.profit_margin_percent}</p>
                </div>
            </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-foreground">{getTranslation('profitCalculator.summaryTitle')}</h4>
          <p className="text-sm text-muted-foreground">{results.summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfitCalculatorPage() {
  const { getTranslation, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CalculateProfitOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop_name: '',
      acreage: 1,
      yield_per_acre: 0,
      market_price: 0,
      total_costs: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResults(null);
    
    const response = await calculateProfit({ ...values, language_preference: language });

    if (response.success && response.data) {
      setResults(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: getTranslation('profitCalculator.errorTitle'),
        description: response.error || getTranslation('profitCalculator.errorDescription'),
      });
    }

    setIsLoading(false);
  }

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('keyMapping.profitCalculator')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold tracking-tight">{getTranslation('profitCalculator.pageTitle')}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {getTranslation('profitCalculator.pageDescription')}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{getTranslation('profitCalculator.inputsTitle')}</CardTitle>
                  <CardDescription>{getTranslation('profitCalculator.inputsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                       <FormField
                          control={form.control}
                          name="crop_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{getTranslation('profitCalculator.cropName')}</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Rice" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="acreage"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{getTranslation('profitCalculator.acreage')}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="yield_per_acre"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{getTranslation('profitCalculator.yield')}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="market_price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{getTranslation('profitCalculator.marketPrice')}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="total_costs"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{getTranslation('profitCalculator.totalCosts')}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                       </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Calculator className="mr-2 h-4 w-4" />
                        )}
                        {getTranslation('profitCalculator.calculateButton')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              <div className="flex items-center justify-center">
                 {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : results ? (
                    <ProfitResults results={results} />
                ) : (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center bg-card/50">
                        <Calculator className="h-12 w-12 mb-4 text-primary"/>
                        <h3 className="text-lg font-semibold text-foreground">{getTranslation('profitCalculator.waitingTitle')}</h3>
                        <p>{getTranslation('profitCalculator.waitingDescription')}</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
