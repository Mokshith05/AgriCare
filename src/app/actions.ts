'use server';

import {
  analyzePhotoAndSuggestTreatments,
  type AnalyzePhotoAndSuggestTreatmentsInput,
  type AnalyzePhotoAndSuggestTreatmentsOutput,
} from '@/ai/flows/analyze-photo-and-suggest-treatments';
import {
  chatWithAi,
  type ChatWithAiInput,
  type ChatWithAiOutput,
} from '@/ai/flows/chat-with-ai';
import {
  textToSpeech,
  type TextToSpeechInput,
  type TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';
import {
  getWeatherData,
  type GetWeatherDataInput,
  type GetWeatherDataOutput,
} from '@/ai/flows/get-weather-data';
import {
  searchEncyclopedia,
  type SearchEncyclopediaInput,
  type SearchEncyclopediaOutput,
} from '@/ai/flows/search-encyclopedia';
import {
  recommendCrops as recommendCropsFlow,
  type RecommendCropsInput,
  type RecommendCropsOutput,
} from '@/ai/flows/recommend-crops';
import {
  searchPreventiveCareTips,
  type SearchPreventiveCareTipsInput,
  type SearchPreventiveCareTipsOutput,
} from '@/ai/flows/search-preventive-care-tips';

export async function analyzeCropImage(
  input: AnalyzePhotoAndSuggestTreatmentsInput
): Promise<{
  success: boolean;
  data?: AnalyzePhotoAndSuggestTreatmentsOutput;
  error?: string;
}> {
  try {
    if (!input.photoDataUri) {
      throw new Error('No image data provided.');
    }
    const analysisResult = await analyzePhotoAndSuggestTreatments(input);
    return {
      success: true,
      data: analysisResult,
    };
  } catch (error) {
    console.error('Error analyzing crop image:', error);
    return {
      success: false,
      error:
        'An unexpected error occurred while analyzing the image. Please try again.',
    };
  }
}

export async function getAiChatResponse(
  input: ChatWithAiInput
): Promise<{
  success: boolean;
  data?: ChatWithAiOutput;
  error?: string;
}> {
  try {
    const result = await chatWithAi(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting AI chat response:', error);
    return {
      success: false,
      error: 'Failed to get a response from the AI. Please try again.',
    };
  }
}

export async function getAudioResponse(
  input: TextToSpeechInput
): Promise<{
  success: boolean;
  data?: TextToSpeechOutput;
  error?: string;
}> {
  try {
    const result = await textToSpeech(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating audio:', error);
    return {
      success: false,
      error: 'Failed to generate audio. Please try again.',
    };
  }
}

export async function getRealtimeWeather(
  input: GetWeatherDataInput
): Promise<{
  success: boolean;
  data?: GetWeatherDataOutput;
  error?: string;
}> {
  try {
    const result = await getWeatherData(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting weather data:', error);
    return {
      success: false,
      error: 'Failed to get weather data. Please try again.',
    };
  }
}

export async function performEncyclopediaSearch(
  input: SearchEncyclopediaInput
): Promise<{
  success: boolean;
  data?: SearchEncyclopediaOutput;
  error?: string;
}> {
  try {
    const result = await searchEncyclopedia(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error searching encyclopedia:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during the search. Please try again.',
    };
  }
}

export async function recommendCrops(
  input: RecommendCropsInput
): Promise<{
  success: boolean;
  data?: RecommendCropsOutput;
  error?: string;
}> {
  try {
    const result = await recommendCropsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting crop recommendations:', error);
    return {
      success: false,
      error: 'Failed to get crop recommendations. Please try again.',
    };
  }
}

export async function getPreventiveCareTips(
  input: SearchPreventiveCareTipsInput
): Promise<{
  success: boolean;
  data?: SearchPreventiveCareTipsOutput;
  error?: string;
}> {
  try {
    const result = await searchPreventiveCareTips(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting preventive care tips:', error);
    return {
      success: false,
      error: 'Failed to get preventive care tips. Please try again.',
    };
  }
}
