'use client';

import Image from 'next/image';
import type { AnalyzePhotoAndSuggestTreatmentsOutput } from '@/ai/flows/analyze-photo-and-suggest-treatments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, RefreshCw, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

interface AnalysisResultProps {
  result: AnalyzePhotoAndSuggestTreatmentsOutput;
  imagePreview: string;
  onReset: () => void;
}

export default function AnalysisResult({ result, imagePreview, onReset }: AnalysisResultProps) {
  const { getTranslation } = useLanguage();
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Stethoscope className="h-6 w-6 text-primary" />
            {getTranslation('dashboard.analysisReport')}
          </CardTitle>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {getTranslation('dashboard.newAnalysis')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <Image
              src={imagePreview}
              alt="Analyzed crop"
              width={400}
              height={300}
              className="mb-4 rounded-lg border object-contain shadow-sm"
               data-ai-hint="analyzed crop"
            />
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 flex items-center text-lg font-semibold text-primary">
                  <Bot className="mr-2 h-5 w-5" />
                  {getTranslation('dashboard.aiAnalysis')}
                </h3>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">{result.analysis}</p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-primary">
                  {getTranslation('dashboard.treatmentSuggestions')}
                </h3>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">{result.treatmentSuggestions}</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
