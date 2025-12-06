'use server';

/**
 * @fileOverview Provides farming recommendations based on weather and farm data.
 *
 * - getFarmingRecommendations - A function that handles the recommendation generation.
 * - GetFarmingRecommendationsInput - The input type for the function.
 * - GetFarmingRecommendationsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetFarmingRecommendationsInputSchema = z.object({
  user_location: z.string().describe("The user's location (GPS coordinates or address)."),
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  rainfall: z.number().describe('The rainfall in the last 24 hours in mm.'),
  uv_index: z.string().describe('The current UV index.'),
  weather_condition: z.string().describe('The current weather condition (e.g., "Sunny", "Cloudy").'),
  past_week_weather: z.string().describe('A summary of the weather over the past 7 days.'),
  past_crop: z.string().describe('The crop that was grown in the previous season.'),
  language_preference: z.string().describe('The language for the response (e.g., "en", "hi").'),
});

export type GetFarmingRecommendationsInput = z.infer<typeof GetFarmingRecommendationsInputSchema>;

const GetFarmingRecommendationsOutputSchema = z.object({
  current_weather_summary: z.string().describe("A simple explanation of the current weather for farmers."),
  farming_recommendations: z.array(z.string()).describe("Actionable farming recommendations like irrigation advice, fertilizer timing, spraying precautions, etc."),
  risk_alerts: z.array(z.string()).describe("Short-term risk predictions like heat stress, fungal infections, etc."),
  next_season_crop_recommendations: z.array(z.string()).describe("Recommendations for crops suitable for the next season."),
  explanation: z.string().describe("An explanation of why these recommendations are being made based on the data."),
});

export type GetFarmingRecommendationsOutput = z.infer<typeof GetFarmingRecommendationsOutputSchema>;

export async function getFarmingRecommendations(
  input: GetFarmingRecommendationsInput
): Promise<GetFarmingRecommendationsOutput> {
  return getFarmingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFarmingRecommendationsPrompt',
  input: { schema: GetFarmingRecommendationsInputSchema },
  output: { schema: GetFarmingRecommendationsOutputSchema },
  prompt: `You are an expert agronomist providing data-driven advice to farmers. Analyze the provided real farm and weather data to generate a set of recommendations.
  
  **Data Provided:**
  - Location: {{{user_location}}}
  - Current Temperature: {{{temperature}}}°C
  - Humidity: {{{humidity}}}%
  - Rainfall (24h): {{{rainfall}}} mm
  - UV Index: {{{uv_index}}}
  - Weather Condition: {{{weather_condition}}}
  - Past 7 Days: {{{past_week_weather}}}
  - Previous Crop: {{{past_crop}}}

  **Your Tasks (in '{{{language_preference}}}' language):**
  1.  **current_weather_summary**: Explain the current weather in simple, easy-to-understand terms.
  2.  **farming_recommendations**: Provide a list of specific, actionable recommendations. Include advice on irrigation, fertilizer timing, spraying precautions, pest/disease risks based on the weather, and when to avoid fieldwork.
  3.  **risk_alerts**: Create a list of potential short-term risks (e.g., "High humidity increases fungal risk," "High temperature may cause heat stress in young plants").
  4.  **next_season_crop_recommendations**: Based on all available data (weather patterns, temperature, previous crop), suggest a list of suitable crops for the next planting season.
  5.  **explanation**: Briefly explain the reasoning behind your key recommendations, connecting them to the provided data.

  Ensure the output is in simple language suitable for farmers and strictly follows the requested JSON format. The entire response must be in the '{{{language_preference}}}' language.
  `,
});

const getFarmingRecommendationsFlow = ai.defineFlow(
  {
    name: 'getFarmingRecommendationsFlow',
    inputSchema: GetFarmingRecommendationsInputSchema,
    outputSchema: GetFarmingRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
