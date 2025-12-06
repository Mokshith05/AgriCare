'use client';

import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PREVENTIVE_CARE_TIPS } from '@/lib/data';
import { Sprout } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function PreventiveCarePage() {
  const { getTranslation } = useLanguage();
  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('preventiveCare.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight">{getTranslation('preventiveCare.pageTitle')}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {getTranslation('preventiveCare.pageDescription')}
              </p>
            </div>
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
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
