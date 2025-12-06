'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ENCYCLOPEDIA_ARTICLES } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, CheckCircle, Info } from 'lucide-react';
import { performEncyclopediaSearch } from '@/app/actions';
import type { SearchEncyclopediaOutput } from '@/ai/flows/search-encyclopedia';
import { useToast } from '@/hooks/use-toast';

function SearchResult({ result }: { result: SearchEncyclopediaOutput }) {
  const { getTranslation } = useLanguage();

  if (!result.isFound) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-destructive" />
            {getTranslation('encyclopedia.notFound')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{result.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="mb-2 text-3xl font-bold tracking-tight text-primary">{result.title}</CardTitle>
          <Badge variant={result.category === 'Disease' ? 'destructive' : result.category === 'Pest' ? 'secondary' : 'default'}>
            {result.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg text-muted-foreground">{result.description}</p>
        {result.symptoms && result.symptoms.length > 0 && (
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{getTranslation('encyclopedia.symptoms')}</h2>
            <ul className="space-y-2">
              {result.symptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {result.prevention && result.prevention.length > 0 && (
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{getTranslation('encyclopedia.prevention')}</h2>
            <ul className="space-y-2">
              {result.prevention.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {result.treatment && result.treatment.length > 0 && (
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{getTranslation('encyclopedia.organicTreatment')}</h2>
            <ul className="space-y-2">
              {result.treatment.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}


export default function EncyclopediaPage() {
  const { getTranslation, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchEncyclopediaOutput | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchResult(null);

    const response = await performEncyclopediaSearch({ query: searchQuery, language });

    if (response.success && response.data) {
      setSearchResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: getTranslation('encyclopedia.searchErrorTitle'),
        description: response.error || getTranslation('encyclopedia.searchErrorDescription'),
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
        <Header title={getTranslation('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="search"
                placeholder={getTranslation('encyclopedia.searchPlaceholder')}
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
               {searchResult && (
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
            <SearchResult result={searchResult} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ENCYCLOPEDIA_ARTICLES.map((article) => {
                const placeholder = PlaceHolderImages.find(p => p.id === article.imageId);
                return (
                  <Link href={`/encyclopedia/${article.slug}`} key={article.id}>
                    <Card className="h-full transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <CardHeader>
                        {placeholder && (
                          <div className="relative mb-4 h-40 w-full">
                            <Image
                              src={placeholder.imageUrl}
                              alt={article.title}
                              fill
                              className="rounded-t-lg object-cover"
                              data-ai-hint={placeholder.imageHint}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <CardTitle>{article.title}</CardTitle>
                          <Badge variant={article.category === 'Disease' ? 'destructive' : 'secondary'}>
                            {article.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{article.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </SidebarInset>
  );
}
