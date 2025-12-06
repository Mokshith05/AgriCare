'use server';

/**
 * @fileOverview Searches for agricultural information using an AI model.
 *
 * - searchEncyclopedia - A function that searches for a given query.
 * - SearchEncyclopediaInput - The input type for the searchEncyclopedia function.
 * - SearchEncyclopediaOutput - The return type for the searchEncyclopedia function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SearchEncyclopediaInputSchema = z.object({
  query: z.string().describe('The search query for an agricultural topic (e.g., a pest, disease, or concept).'),
});
export type SearchEncyclopediaInput = z.infer<typeof SearchEncyclopediaInputSchema>;

const SearchEncyclopediaOutputSchema = z.object({
    isFound: z.boolean().describe('Whether relevant information was found for the query.'),
    title: z.string().describe('The title of the topic found.'),
    category: z.enum(['Disease', 'Pest', 'General Information']).describe('The category of the topic.'),
    description: z.string().describe('A detailed description of the topic.'),
    symptoms: z.array(z.string()).optional().describe('A list of symptoms, if applicable.'),
    prevention: z.array(z.string()).optional().describe('A list of prevention methods.'),
    treatment: z.array(z.string()).optional().describe('A list of organic treatment methods.'),
});
export type SearchEncyclopediaOutput = z.infer<typeof SearchEncyclopediaOutputSchema>;

export async function searchEncyclopedia(input: SearchEncyclopediaInput): Promise<SearchEncyclopediaOutput> {
  return searchEncyclopediaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchEncyclopediaPrompt',
  input: { schema: SearchEncyclopediaInputSchema },
  output: { schema: SearchEncyclopediaOutputSchema },
  prompt: `You are an agricultural expert. A user is searching an encyclopedia for information.
  The user's query is: "{{{query}}}"

  Based on the query, provide a detailed encyclopedia entry.
  - If the query is about a disease or pest, identify it and fill out the symptoms, prevention, and organic treatment sections.
  - If the query is a general agricultural topic, provide a detailed description and set the category to "General Information".
  - If you cannot find relevant information for the query, set isFound to false and provide a helpful message in the description.
  - Focus on organic and sustainable farming practices, referencing Indian government resources like ICAR and Kisan Suvidha where appropriate.
  - Ensure all lists (symptoms, prevention, treatment) are populated if the topic is a disease or pest.
  - If no specific items for symptoms, prevention or treatment are relevant, you may return empty arrays for those.
  `,
});

const searchEncyclopediaFlow = ai.defineFlow(
  {
    name: 'searchEncyclopediaFlow',
    inputSchema: SearchEncyclopediaInputSchema,
    outputSchema: SearchEncyclopediaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
