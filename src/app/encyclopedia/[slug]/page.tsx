'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ENCYCLOPEDIA_ARTICLES } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function EncyclopediaArticlePage({ params }: { params: { slug: string } }) {
  const article = ENCYCLOPEDIA_ARTICLES.find((a) => a.slug === params.slug);
  const { getTranslation } = useLanguage();

  if (!article) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find(p => p.id === article.imageId);

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <article>
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">{article.title}</h1>
              <Badge variant={article.category === 'Disease' ? 'destructive' : 'secondary'}>
                {article.category}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="mb-6 text-lg text-muted-foreground">{article.description}</p>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <section>
                        <h2 className="mb-3 text-2xl font-semibold">{getTranslation('encyclopedia.symptoms')}</h2>
                        <ul className="space-y-2">
                          {article.symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                              <span>{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h2 className="mb-3 text-2xl font-semibold">{getTranslation('encyclopedia.prevention')}</h2>
                         <ul className="space-y-2">
                          {article.prevention.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                               <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h2 className="mb-3 text-2xl font-semibold">{getTranslation('encyclopedia.organicTreatment')}</h2>
                         <ul className="space-y-2">
                          {article.treatment.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                               <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                {placeholder && (
                  <div className="relative h-64 w-full lg:h-80">
                    <Image
                      src={placeholder.imageUrl}
                      alt={article.title}
                      fill
                      className="rounded-lg object-cover shadow-md"
                      data-ai-hint={placeholder.imageHint}
                    />
                  </div>
                )}
              </div>
            </div>
          </article>
        </main>
      </div>
    </SidebarInset>
  );
}
