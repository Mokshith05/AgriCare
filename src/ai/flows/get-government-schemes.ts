'use server';

/**
 * @fileOverview Fetches relevant government schemes for farmers.
 *
 * - getGovernmentSchemes - A function that fetches scheme data.
 * - GetGovernmentSchemesInput - The input type for the function.
 * - GetGovernmentSchemesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetGovernmentSchemesInputSchema = z.object({
  crop: z.string().describe('The farmer\'s primary crop.'),
  location: z.string().describe('The farmer\'s location (e.g., state or district in India).'),
  language: z.string().describe('The language for the response (e.g., "en", "hi").'),
});

export type GetGovernmentSchemesInput = z.infer<typeof GetGovernmentSchemesInputSchema>;

const SchemeSchema = z.object({
  name: z.string().describe('The official name of the government scheme.'),
  description: z.string().describe('A brief summary of the scheme.'),
  benefits: z.array(z.string()).describe('A list of key benefits provided by the scheme.'),
  eligibility: z.string().describe('A summary of the eligibility criteria for farmers.'),
  applicationUrl: z.string().url().optional().describe('The direct URL to the scheme\'s application or information page.'),
});

const GetGovernmentSchemesOutputSchema = z.object({
  schemes: z.array(SchemeSchema).describe('A list of relevant government schemes found.'),
});

export type GetGovernmentSchemesOutput = z.infer<typeof GetGovernmentSchemesOutputSchema>;

export async function getGovernmentSchemes(
  input: GetGovernmentSchemesInput
): Promise<GetGovernmentSchemesOutput> {
  return getGovernmentSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getGovernmentSchemesPrompt',
  input: { schema: GetGovernmentSchemesInputSchema },
  output: { schema: GetGovernmentSchemesOutputSchema },
  prompt: `You are an AI assistant designed to help Indian farmers.
  Your task is to find relevant government schemes based on the farmer's crop and location.
  
  **Instructions:**
  1.  Search official Indian government portals like **agriculture.gov.in**, **farmer.gov.in**, and **gem.gov.in** for agricultural schemes.
  2.  Prioritize schemes that are **new, recently updated, or currently active** and relevant to the specified crop and location.
  3.  Extract the scheme name, a brief description, key benefits, eligibility criteria, and a direct URL if available.
  4.  Do not use mock or placeholder data. If no relevant schemes are found, return an empty list.
  5.  The entire response, including all text, must be in the specified language: {{{language}}}

  **Farmer's Details:**
  - Crop: {{{crop}}}
  - Location: {{{location}}}

  Please provide the information strictly in the required JSON format.
  `,
});

const getGovernmentSchemesFlow = ai.defineFlow(
  {
    name: 'getGovernmentSchemesFlow',
    inputSchema: GetGovernmentSchemesInputSchema,
    outputSchema: GetGovernmentSchemesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
