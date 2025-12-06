'use server';

/**
 * @fileOverview Calculates expected revenue and profit for a crop.
 *
 * - calculateProfitFlow - A function that handles the profit calculation process.
 * - CalculateProfitInput - The input type for the calculateProfitFlow function.
 * - CalculateProfitOutput - The return type for the calculateProfitFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateProfitInputSchema = z.object({
  crop_name: z.string().describe('The name of the crop.'),
  acreage: z.number().describe('The total acreage of the farm.'),
  yield_per_acre: z.number().describe('The expected yield per acre in kilograms.'),
  market_price: z.number().describe('The current market price per kilogram.'),
  total_costs: z.number().describe('The total estimated costs for cultivation.'),
  language_preference: z.string().describe('The language for the response (e.g., "en", "hi").'),
});
export type CalculateProfitInput = z.infer<typeof CalculateProfitInputSchema>;

const CalculateProfitOutputSchema = z.object({
  total_yield: z.string().describe('Total calculated yield in kilograms.'),
  total_revenue: z.string().describe('Total calculated revenue in the local currency.'),
  profit: z.string().describe('Total calculated profit in the local currency.'),
  profit_margin_percent: z.string().describe('Calculated profit margin as a percentage.'),
  summary: z.string().describe('A summary of the profit calculation and insights.'),
});
export type CalculateProfitOutput = z.infer<typeof CalculateProfitOutputSchema>;

export async function calculateProfit(input: CalculateProfitInput): Promise<CalculateProfitOutput> {
  return calculateProfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateProfitPrompt',
  input: { schema: CalculateProfitInputSchema },
  output: { schema: CalculateProfitOutputSchema },
  prompt: `You are a financial analyst for agriculture. Based on the following farm inputs, calculate the potential profit.

  Farm Inputs:
  - Crop Name: {{{crop_name}}}
  - Total Acreage: {{{acreage}}}
  - Yield per Acre (kg/acre): {{{yield_per_acre}}}
  - Market Price (per kg): {{{market_price}}}
  - Total Costs: {{{total_costs}}}

  The entire response, including numbers and currency symbols where appropriate, must be in the following language and locale format: {{{language_preference}}}

  First, perform these calculations:
  1.  Total Yield = acreage * yield_per_acre
  2.  Total Revenue = Total Yield * market_price
  3.  Profit = Total Revenue - total_costs
  4.  Profit Margin (%) = (Profit / Total Revenue) * 100 (if Total Revenue is not zero)

  Format the numeric results (total_yield, total_revenue, profit, profit_margin_percent) as localized strings with appropriate separators. The profit margin should have two decimal places and a '%' sign.

  Then, provide a concise summary analyzing the profitability. Comment on the profit margin and potential factors that could influence the results.
  `,
});

const calculateProfitFlow = ai.defineFlow(
  {
    name: 'calculateProfitFlow',
    inputSchema: CalculateProfitInputSchema,
    outputSchema: CalculateProfitOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
