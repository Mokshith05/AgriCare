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
import {
  calculateProfit as calculateProfitFlow,
  type CalculateProfitInput,
  type CalculateProfitOutput,
} from '@/ai/flows/calculate-profit';
import {
    getFarmingRecommendations as getFarmingRecommendationsFlow,
    type GetFarmingRecommendationsInput,
    type GetFarmingRecommendationsOutput,
} from '@/ai/flows/get-farming-recommendations';
import {
    getGovernmentSchemes as getGovernmentSchemesFlow,
    type GetGovernmentSchemesInput,
    type GetGovernmentSchemesOutput,
} from '@/ai/flows/get-government-schemes';


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


export async function calculateProfit(
  input: CalculateProfitInput
): Promise<{
  success: boolean;
  data?: CalculateProfitOutput;
  error?: string;
}> {
  try {
    const result = await calculateProfitFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error calculating profit:', error);
    return {
      success: false,
      error: 'Failed to calculate profit. Please try again.',
    };
  }
}

export async function getFarmingRecommendations(
  input: GetFarmingRecommendationsInput
): Promise<{
  success: boolean;
  data?: GetFarmingRecommendationsOutput;
  error?: string;
}> {
  try {
    const result = await getFarmingRecommendationsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting farming recommendations:', error);
    return {
      success: false,
      error: 'Failed to get farming recommendations. Please try again.',
    };
  }
}

export async function getGovSchemes(
  input: GetGovernmentSchemesInput
): Promise<{
  success: boolean;
  data?: GetGovernmentSchemesOutput;
  error?: string;
}> {
  try {
    const result = await getGovernmentSchemesFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting government schemes:', error);
    return {
      success: false,
      error: 'Failed to get government schemes. Please try again.',
    };
  }
}
