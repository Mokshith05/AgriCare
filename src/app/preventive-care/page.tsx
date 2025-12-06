'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PREVENTIVE_CARE_TIPS } from '@/lib/data';
import { Sprout, Loader2, Search } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPreventiveCareTips } from '@/app/actions';
import type { SearchPreventiveCareTipsOutput } from '@/ai/flows/search-preventive-care-tips';

function SearchResults({ result }: { result: SearchPreventiveCareTipsOutput }) {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
      <AccordionItem value="item-0">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline">
          <div className="flex items-center gap-3">
            <Sprout className="h-6 w-6 text-primary" />
            {result.crop}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {result.tips.map((tip, index) => (
              <div key={index} className="rounded-md border bg-card/50 p-4">
                <h4 className="font-semibold text-foreground">{tip.title}</h4>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function PreventiveCarePage() {
  const { getTranslation, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchPreventiveCareTipsOutput | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchResult(null);

    const response = await getPreventiveCareTips({ cropName: searchQuery, language });

    if (response.success && response.data) {
      setSearchResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: getTranslation('preventiveCare.searchErrorTitle'),
        description: response.error || getTranslation('preventiveCare.searchErrorDescription'),
      });
    }

    setIsLoading(false);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
  };

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('preventiveCare.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">{getTranslation('preventiveCare.pageTitle')}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {getTranslation('preventiveCare.pageDescription')}
                </p>
              </div>
              <form onSubmit={handleSearch} className="mt-6 flex gap-2">
                <Input
                  type="search"
                  placeholder={getTranslation('preventiveCare.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span className="ml-2 hidden sm:inline">{getTranslation('encyclopedia.searchButton')}</span>
                </Button>
                {(searchResult || searchQuery) && (
                  <Button variant="outline" onClick={clearSearch}>
                    {getTranslation('encyclopedia.clearSearch')}
                  </Button>
                )}
              </form>
            </div>

            {isLoading && (
              <div className="flex justify-center mt-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}

            {searchResult ? (
              <SearchResults result={searchResult} />
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {PREVENTIVE_CARE_TIPS.map((cropCare) => (
                  <AccordionItem key={cropCare.id} value={`item-${cropCare.id}`}>
                    <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Sprout className="h-6 w-6 text-primary" />
                        {cropCare.crop}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {cropCare.tips.map((tip, index) => (
                          <div key={index} className="rounded-md border bg-card/50 p-4">
                            <h4 className="font-semibold text-foreground">{tip.title}</h4>
                            <p className="text-muted-foreground">{tip.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
