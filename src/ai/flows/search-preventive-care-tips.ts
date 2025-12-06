'use server';

/**
 * @fileOverview Searches for preventive care tips for a given crop.
 *
 * - searchPreventiveCareTips - A function that searches for tips.
 * - SearchPreventiveCareTipsInput - The input type for the function.
 * - SearchPreventiveCareTipsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SearchPreventiveCareTipsInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to get care tips for.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi").'),
});
export type SearchPreventiveCareTipsInput = z.infer<typeof SearchPreventiveCareTipsInputSchema>;

const TipSchema = z.object({
  title: z.string().describe('The title of the care tip.'),
  description: z.string().describe('A detailed description of the care tip.'),
});

const SearchPreventiveCareTipsOutputSchema = z.object({
  crop: z.string().describe('The name of the crop the tips are for.'),
  tips: z.array(TipSchema).describe('A list of preventive care tips for the specified crop.'),
});
export type SearchPreventiveCareTipsOutput = z.infer<typeof SearchPreventiveCareTipsOutputSchema>;

export async function searchPreventiveCareTips(
  input: SearchPreventiveCareTipsInput
): Promise<SearchPreventiveCareTipsOutput> {
  return searchPreventiveCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchPreventiveCareTipsPrompt',
  input: { schema: SearchPreventiveCareTipsInputSchema },
  output: { schema: SearchPreventiveCareTipsOutputSchema },
  prompt: `You are an agricultural expert providing preventive care tips for crops.
A user is asking for tips for the crop: "{{{cropName}}}"
The response must be in the following language: "{{{language}}}"

Generate a list of 3-5 concise, actionable preventive care tips for this crop.
Focus on organic and sustainable practices.
For each tip, provide a clear title and a description.
Return the name of the crop and the list of tips.
`,
});

const searchPreventiveCareTipsFlow = ai.defineFlow(
  {
    name: 'searchPreventiveCareTipsFlow',
    inputSchema: SearchPreventiveCareTipsInputSchema,
    outputSchema: SearchPreventiveCareTipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
