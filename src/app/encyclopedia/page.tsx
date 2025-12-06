'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ENCYCLOPEDIA_ARTICLES } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';

export default function EncyclopediaPage() {
  const { getTranslation } = useLanguage();

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
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
        </main>
      </div>
    </SidebarInset>
  );
}
