'use server';

/**
 * @fileOverview Recommends crops based on farm details.
 *
 * - recommendCropsFlow - A function that handles the crop recommendation process.
 * - RecommendCropsInput - The input type for the recommendCropsFlow function.
 * - RecommendCropsOutput - The return type for the recommendCropsFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendCropsInputSchema = z.object({
  location: z.string().describe('The geographical location of the farm (e.g., City, State, Region).'),
  soilType: z.string().describe('The predominant soil type in the field (e.g., Loamy, Clay, Sandy).'),
  pastCropRotation: z.string().optional().describe('A list of crops grown in the last 1-3 seasons.'),
  additionalInformation: z.string().optional().describe('Any other details like climate, water access, irrigation, specific market demands, etc.'),
  language_preference: z.string().describe('The language for the response (e.g., "en", "hi").'),
});
export type RecommendCropsInput = z.infer<typeof RecommendCropsInputSchema>;

const RecommendedCropSchema = z.object({
  crop: z.string().describe("The name of the recommended crop."),
  why_suitable: z.string().describe("A brief explanation of why this crop is suitable for the given conditions."),
  organic_fertilizers: z.array(z.string()).describe("A list of recommended organic fertilizers for this crop."),
  planting_season: z.string().describe("The best season to plant this crop in the specified location."),
  expected_yield_note: z.string().describe("A note about the expected yield, considering the provided data."),
});

const RecommendCropsOutputSchema = z.object({
  recommended_crops: z.array(RecommendedCropSchema).describe("A list of recommended crops with detailed information."),
  summary: z.string().describe("A summary of the recommendations and general advice."),
});
export type RecommendCropsOutput = z.infer<typeof RecommendCropsOutputSchema>;


export async function recommendCrops(input: RecommendCropsInput): Promise<RecommendCropsOutput> {
  return recommendCropsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'recommendCropsPrompt',
  input: { schema: RecommendCropsInputSchema },
  output: { schema: RecommendCropsOutputSchema },
  prompt: `You are an expert agronomist. Analyze the following farm details to provide data-driven crop recommendations.
  Consider soil type, climate based on location, and past crop rotation to suggest the most suitable crops.
  Provide only accurate recommendations. Do not use mock or random data.

  Farm Details:
  - Location: {{{location}}}
  - Soil Type: {{{soilType}}}
  - Past Crop Rotation: {{{pastCropRotation}}}
  - Additional Information: {{{additionalInformation}}}

  The entire response, including crop names, descriptions, and all other text, must be in the following language: {{{language_preference}}}

  Based on this, recommend a few crops. For each crop, explain why it's suitable, suggest organic fertilizers, specify the best planting season, and provide a note on expected yield.
  Also include a summary of your analysis and general advice.
  `,
});


const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: RecommendCropsInputSchema,
    outputSchema: RecommendCropsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
