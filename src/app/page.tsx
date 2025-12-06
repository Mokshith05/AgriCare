
'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import ImageUploader from '@/components/dashboard/image-uploader';
import WeatherWidget from '@/components/dashboard/weather-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import Image from 'next/image';

export default function DashboardPage() {
  const { getTranslation } = useLanguage();

  return (
    <SidebarInset>
      <div className="relative flex h-full min-h-screen flex-col">
         <Image
          src="https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=2487&auto=format&fit=crop"
          alt="Lush green field"
          fill
          className="absolute inset-0 z-0 object-cover"
          priority
          data-ai-hint="green field"
        />
        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm"></div>
        
        <div className="relative z-20 flex h-full flex-col">
            <Header title="Dashboard" />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ImageUploader />
                </div>
                <div className="flex flex-col gap-6">
                  <WeatherWidget />
                  <Card className="bg-card/70 backdrop-blur-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-base font-medium">
                        {getTranslation('dashboard.quickGuide')}
                      </CardTitle>
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>{getTranslation('dashboard.guideStep1')}</li>
                        <li>{getTranslation('dashboard.guideStep2')}</li>
                        <li>{getTranslation('dashboard.guideStep3')}</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
        </div>
      </div>
    </SidebarInset>
  );
}
