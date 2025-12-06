'use client';

import { useState, useEffect } from 'react';
import type { LogEntry } from '@/lib/types';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function LogbookPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { getTranslation, language } = useLanguage();

  useEffect(() => {
    setIsClient(true);
    try {
      const savedLogs = localStorage.getItem('agriprotect-logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error('Failed to load logs from localStorage', error);
    }
  }, []);

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) return;

    const newLog: Omit<LogEntry, 'id'> = {
      date: new Date().toISOString(),
      activity,
      notes,
    };

    setLogs((prevLogs) => {
      const updatedLogs = [{ ...newLog, id: Date.now().toString() }, ...prevLogs];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('agriprotect-logs', JSON.stringify(updatedLogs));
        }
      } catch (error) {
        console.error('Failed to save logs to localStorage', error);
      }
      return updatedLogs;
    });

    setActivity('');
    setNotes('');
  };

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={getTranslation('logbook.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{getTranslation('logbook.addLog')}</CardTitle>
                  <CardDescription>{getTranslation('logbook.addLogDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addLog} className="space-y-4">
                    <div>
                      <label htmlFor="activity" className="mb-2 block text-sm font-medium">{getTranslation('logbook.activity')}</label>
                      <Input
                        id="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder={getTranslation('logbook.activityPlaceholder')}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="notes" className="mb-2 block text-sm font-medium">{getTranslation('logbook.notes')}</label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={getTranslation('logbook.notesPlaceholder')}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {getTranslation('logbook.addLogButton')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <h2 className="mb-4 text-2xl font-bold">{getTranslation('logbook.recentActivities')}</h2>
              <div className="space-y-4">
                {isClient && logs.length === 0 ? (
                  <p className="text-muted-foreground">{getTranslation('logbook.noActivities')}</p>
                ) : (
                  logs.map((log) => (
                    <Card key={log.id} className="bg-card/50">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{log.activity}</CardTitle>
                             {isClient && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{new Date(log.date).toLocaleDateString(language)}</span>
                                </div>
                             )}
                        </div>
                      </CardHeader>
                      {log.notes && (
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">{log.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
