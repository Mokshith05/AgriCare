'use server';
/**
 * @fileOverview A chatbot flow that responds to user queries in their selected language.
 *
 * - chatWithAi - A function that handles the chat interaction.
 * - ChatWithAiInput - The input type for the chatWithAi function.
 * - ChatWithAiOutput - The return type for the chatWithAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAiInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Telugu").'),
});
export type ChatWithAiInput = z.infer<typeof ChatWithAiInputSchema>;

const ChatWithAiOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});
export type ChatWithAiOutput = z.infer<typeof ChatWithAiOutputSchema>;

export async function chatWithAi(input: ChatWithAiInput): Promise<ChatWithAiOutput> {
  return chatWithAiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithAiPrompt',
  input: {schema: ChatWithAiInputSchema},
  output: {schema: ChatWithAiOutputSchema},
  prompt: `You are a friendly and helpful AI assistant for the AgriProtect AI application.
Your role is to answer questions and provide information related to agriculture, crop diseases, pests, and sustainable farming practices.
Always respond in the user-specified language.

User's language: {{{language}}}
User's message: {{{message}}}

Provide a helpful and concise response.
`,
});

const chatWithAiFlow = ai.defineFlow(
  {
    name: 'chatWithAiFlow',
    inputSchema: ChatWithAiInputSchema,
    outputSchema: ChatWithAiOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
