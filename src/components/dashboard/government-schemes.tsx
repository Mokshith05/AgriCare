'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getGovSchemes } from '@/app/actions';
import type { GetGovernmentSchemesOutput } from '@/ai/flows/get-government-schemes';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Building, CheckCircle, HandCoins, ExternalLink } from 'lucide-react';

export default function GovernmentSchemes() {
  const { getTranslation, language } = useLanguage();
  const [crop, setCrop] = useState('Rice');
  const [location, setLocation] = useState('Punjab');
  const [isLoading, setIsLoading] = useState(false);
  const [schemes, setSchemes] = useState<GetGovernmentSchemesOutput['schemes'] | null>(null);
  const { toast } = useToast();

  const handleFetchSchemes = async () => {
    if (!crop || !location) {
      toast({
        variant: 'destructive',
        title: getTranslation('govSchemes.validationTitle'),
        description: getTranslation('govSchemes.validationDescription'),
      });
      return;
    }
    setIsLoading(true);
    setSchemes(null);
    const response = await getGovSchemes({ crop, location, language });
    if (response.success && response.data) {
      setSchemes(response.data.schemes);
    } else {
      toast({
        variant: 'destructive',
        title: getTranslation('govSchemes.errorTitle'),
        description: response.error || getTranslation('govSchemes.errorDescription'),
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-card/70 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building className="h-6 w-6 text-primary" />
          {getTranslation('govSchemes.title')}
        </CardTitle>
        <CardDescription>{getTranslation('govSchemes.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder={getTranslation('govSchemes.cropPlaceholder')}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          />
          <Input
            placeholder={getTranslation('govSchemes.locationPlaceholder')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button onClick={handleFetchSchemes} disabled={isLoading} className="sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {getTranslation('govSchemes.searchButton')}
          </Button>
        </div>

        <div className="mt-6">
          {isLoading && (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {schemes && (
            schemes.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {schemes.map((scheme, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                        <div className="text-left">
                            <h3 className="font-semibold text-base">{scheme.name}</h3>
                            <p className="text-sm text-muted-foreground">{scheme.description}</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-foreground"><HandCoins/>{getTranslation('govSchemes.benefits')}</h4>
                        <ul className="mt-1 list-disc space-y-1 pl-6 text-muted-foreground">
                          {scheme.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-foreground"><CheckCircle/>{getTranslation('govSchemes.eligibility')}</h4>
                        <p className="mt-1 text-muted-foreground">{scheme.eligibility}</p>
                      </div>
                      {scheme.applicationUrl && (
                        <Button asChild variant="link" className="p-0 h-auto">
                           <Link href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent">
                                {getTranslation('govSchemes.applyLink')}
                                <ExternalLink className="h-4 w-4"/>
                           </Link>
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>{getTranslation('govSchemes.noSchemesFound')}</p>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
