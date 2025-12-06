'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, MessageSquare, Send, X, Mic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/language-context';
import { getAiChatResponse, getAudioResponse } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  audioUrl?: string;
  isPlaying?: boolean;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { language, getTranslation } = useLanguage();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const playAudio = (audioUrl: string, messageId: string) => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      const currentlyPlayingId = messages.find(m => m.isPlaying)?.id;
      if (currentlyPlayingId) {
        setMessages(prev => prev.map(m => m.id === currentlyPlayingId ? { ...m, isPlaying: false } : m));
      }
      if (currentlyPlayingId === messageId) {
         return;
      }
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPlaying: true } : m));
    audio.onended = () => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPlaying: false } : m));
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatResponse = await getAiChatResponse({ message: input, language });

      if (chatResponse.success && chatResponse.data) {
        const aiText = chatResponse.data.response;
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = { id: aiMessageId, text: aiText, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);

        const audioResponse = await getAudioResponse({ text: aiText, language });
        if (audioResponse.success && audioResponse.data) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, audioUrl: audioResponse.data.audioDataUri } : msg
            )
          );
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: chatResponse.error || 'Sorry, something went wrong.',
          sender: 'ai'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'An error occurred. Please try again.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <Bot className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span>{getTranslation('chatbot.title')}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-2',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.text}</p>
                    {message.sender === 'ai' && message.audioUrl && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="mt-2 h-6 w-6 text-muted-foreground"
                            onClick={() => playAudio(message.audioUrl!, message.id)}
                            disabled={!message.audioUrl}
                        >
                            {message.isPlaying ? <X className="h-4 w-4"/> : <Volume2 className="h-4 w-4" />}
                        </Button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                   <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={getTranslation('chatbot.placeholder')}
              autoComplete="off"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
