'use server';
/**
 * @fileOverview Determines the severity level of a pest infestation or disease infection.
 *
 * - determineInfestationSeverity - A function that determines the severity level of pest infestation or disease infection.
 * - DetermineInfestationSeverityInput - The input type for the determineInfestationSeverity function.
 * - DetermineInfestationSeverityOutput - The return type for the determineInfestationSeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineInfestationSeverityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the affected crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  diseaseOrPest: z.string().describe('The name of the disease or pest detected.'),
  description: z.string().describe('A description of the infestation or infection.'),
});
export type DetermineInfestationSeverityInput = z.infer<
  typeof DetermineInfestationSeverityInputSchema
>;

const DetermineInfestationSeverityOutputSchema = z.object({
  severityLevel: z
    .string()
    .describe(
      'The severity level of the infestation or infection (e.g., low, medium, high).'
    ),
  treatmentRecommendations: z
    .string()
    .describe('Treatment recommendations based on the severity level.'),
});
export type DetermineInfestationSeverityOutput = z.infer<
  typeof DetermineInfestationSeverityOutputSchema
>;

export async function determineInfestationSeverity(
  input: DetermineInfestationSeverityInput
): Promise<DetermineInfestationSeverityOutput> {
  return determineInfestationSeverityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineInfestationSeverityPrompt',
  input: {schema: DetermineInfestationSeverityInputSchema},
  output: {schema: DetermineInfestationSeverityOutputSchema},
  prompt: `You are an AI assistant specializing in agricultural advice.

You are provided with a photo, the name of a disease or pest, and a description of the infection or infestation.

Based on this information, determine the severity level of the infestation or infection and provide treatment recommendations. Base the recommendations on organic treatment methods.

Photo: {{media url=photoDataUri}}
Disease/Pest: {{{diseaseOrPest}}}
Description: {{{description}}}

Consider government resources like ICAR and Kisan Suvidha for treatment recommendations.

Output the severity level (low, medium, or high) and treatment recommendations.

Ensure the treatment descriptions are suitable for multilingual support.
`,
});

const determineInfestationSeverityFlow = ai.defineFlow(
  {
    name: 'determineInfestationSeverityFlow',
    inputSchema: DetermineInfestationSeverityInputSchema,
    outputSchema: DetermineInfestationSeverityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
