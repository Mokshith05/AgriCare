import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import ImageUploader from '@/components/dashboard/image-uploader';
import WeatherWidget from '@/components/dashboard/weather-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function DashboardPage() {
  return (
    <SidebarInset>
      <div className="flex h-full flex-col bg-background">
        <Header title="Dashboard" />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ImageUploader />
            </div>
            <div className="flex flex-col gap-6">
              <WeatherWidget />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    Quick Guide
                  </CardTitle>
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    1. Upload a clear photo of the affected crop.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2. Let our AI analyze for diseases or pests.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    3. Receive instant organic treatment advice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
