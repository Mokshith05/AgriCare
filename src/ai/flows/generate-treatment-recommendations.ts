'use server';

/**
 * @fileOverview Generates treatment recommendations for crop diseases and pests in the user's local language.
 *
 * - generateTreatmentRecommendations - A function that handles the generation of treatment recommendations.
 * - GenerateTreatmentRecommendationsInput - The input type for the generateTreatmentRecommendations function.
 * - GenerateTreatmentRecommendationsOutput - The return type for the generateTreatmentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentRecommendationsInputSchema = z.object({
  diseaseOrPest: z
    .string()
    .describe('The name of the detected disease or pest.'),
  language: z
    .string()
    .describe('The language in which to generate the treatment recommendations.'),
});
export type GenerateTreatmentRecommendationsInput = z.infer<
  typeof GenerateTreatmentRecommendationsInputSchema
>;

const GenerateTreatmentRecommendationsOutputSchema = z.object({
  treatmentRecommendations: z
    .string()
    .describe('The generated treatment recommendations.'),
});
export type GenerateTreatmentRecommendationsOutput = z.infer<
  typeof GenerateTreatmentRecommendationsOutputSchema
>;

export async function generateTreatmentRecommendations(
  input: GenerateTreatmentRecommendationsInput
): Promise<GenerateTreatmentRecommendationsOutput> {
  return generateTreatmentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTreatmentRecommendationsPrompt',
  input: {schema: GenerateTreatmentRecommendationsInputSchema},
  output: {schema: GenerateTreatmentRecommendationsOutputSchema},
  prompt: `You are an agricultural expert specializing in providing organic treatment recommendations for crop diseases and pests based on Indian government resources like ICAR and Kisan Suvidha.

  Generate treatment recommendations for the following disease/pest in the specified language:

  Disease/Pest: {{{diseaseOrPest}}}
  Language: {{{language}}}

  Provide detailed, step-by-step instructions that farmers can easily follow. Focus on organic and readily available solutions.
`,
});

const generateTreatmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateTreatmentRecommendationsFlow',
    inputSchema: GenerateTreatmentRecommendationsInputSchema,
    outputSchema: GenerateTreatmentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
