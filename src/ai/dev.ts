'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/determine-infestation-severity.ts';
import '@/ai/flows/generate-treatment-recommendations.ts';
import '@/ai/flows/analyze-photo-and-suggest-treatments.ts';
import '@/ai/flows/chat-with-ai';
import '@/ai/flows/text-to-speech';
import '@/ai/flows/get-weather-data';
import '@/ai/flows/search-encyclopedia';
import '@/ai/flows/recommend-crops';
import '@/ai/flows/search-preventive-care-tips';
