'use server';

/**
 * @fileOverview Analyzes a photo of a crop and suggests treatment options.
 *
 * - analyzePhotoAndSuggestTreatments - A function that handles the image analysis and treatment suggestion process.
 * - AnalyzePhotoAndSuggestTreatmentsInput - The input type for the analyzePhotoAndSuggestTreatments function.
 * - AnalyzePhotoAndSuggestTreatmentsOutput - The return type for the analyzePhotoAndSuggestTreatments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePhotoAndSuggestTreatmentsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the affected crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the response (e.g., "en", "hi").'),
});
export type AnalyzePhotoAndSuggestTreatmentsInput = z.infer<typeof AnalyzePhotoAndSuggestTreatmentsInputSchema>;

const AnalyzePhotoAndSuggestTreatmentsOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the image.'),
  treatmentSuggestions: z.string().describe('Specific treatment suggestions tailored to the identified issues.'),
});
export type AnalyzePhotoAndSuggestTreatmentsOutput = z.infer<typeof AnalyzePhotoAndSuggestTreatmentsOutputSchema>;

export async function analyzePhotoAndSuggestTreatments(
  input: AnalyzePhotoAndSuggestTreatmentsInput
): Promise<AnalyzePhotoAndSuggestTreatmentsOutput> {
  return analyzePhotoAndSuggestTreatmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePhotoAndSuggestTreatmentsPrompt',
  input: {schema: AnalyzePhotoAndSuggestTreatmentsInputSchema},
  output: {schema: AnalyzePhotoAndSuggestTreatmentsOutputSchema},
  prompt: `You are an AI assistant specializing in agricultural advice for farmers.
  A farmer will upload a photo of their crop, and you will analyze the photo to identify potential diseases, pests, or other issues.
  Based on your analysis, you will suggest specific treatment options, drawing from your knowledge of organic and sustainable farming practices, as well as information from Indian government resources like ICAR and Kisan Suvidha.

  The entire response must be in the following language: {{{language}}}

  Analyze the following photo:
  {{media url=photoDataUri}}

  Provide an analysis of the image and suggest treatments, and set the treatmentSuggestions field appropriately.
  The treatment suggestions must include specific steps and products that can be used.
`,
});

const analyzePhotoAndSuggestTreatmentsFlow = ai.defineFlow(
  {
    name: 'analyzePhotoAndSuggestTreatmentsFlow',
    inputSchema: AnalyzePhotoAndSuggestTreatmentsInputSchema,
    outputSchema: AnalyzePhotoAndSuggestTreatmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
