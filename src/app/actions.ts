'use server';

import {
  analyzePhotoAndSuggestTreatments,
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

export async function analyzeCropImage(
  photoDataUri: string
): Promise<{
  success: boolean;
  data?: AnalyzePhotoAndSuggestTreatmentsOutput;
  error?: string;
}> {
  try {
    if (!photoDataUri) {
      throw new Error('No image data provided.');
    }
    const analysisResult = await analyzePhotoAndSuggestTreatments({
      photoDataUri,
    });
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
