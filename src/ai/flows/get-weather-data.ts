'use server';
/**
 * @fileOverview Fetches real-time weather data for a given city using a tool.
 *
 * - getWeatherData - A function that fetches weather data.
 * - GetWeatherDataInput - The input type for the getWeatherData function.
 * - GetWeatherDataOutput - The return type for the getWeatherData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWeatherDataInputSchema = z.object({
  city: z.string().describe('The city for which to get the weather data.'),
});
export type GetWeatherDataInput = z.infer<typeof GetWeatherDataInputSchema>;

const WeatherDataSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('The current weather condition (e.g., Sunny, Cloudy).'),
  humidity: z.number().describe('The current humidity percentage.'),
  uvIndex: z.string().describe('The UV index level (e.g., Low, High).'),
  alert: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export type GetWeatherDataOutput = z.infer<typeof WeatherDataSchema>;

// A simple map to simulate weather data for different cities.
// In a real application, this would call a weather API.
const mockWeatherData: Record<string, GetWeatherDataOutput> = {
  'New Delhi': { temperature: 32, condition: 'Hazy', humidity: 65, uvIndex: 'Very High', alert: { title: 'Air Quality Alert', description: 'Air quality is unhealthy. Limit outdoor activities.'} },
  'Mumbai': { temperature: 29, condition: 'Cloudy', humidity: 85, uvIndex: 'High', alert: { title: 'High Humidity', description: 'High humidity may affect certain crops. Monitor for fungal growth.' } },
  'Bangalore': { temperature: 25, condition: 'Rainy', humidity: 88, uvIndex: 'Low' },
  'Kolkata': { temperature: 31, condition: 'Partly Cloudy', humidity: 80, uvIndex: 'High' },
  'Chennai': { temperature: 34, condition: 'Sunny', humidity: 70, uvIndex: 'Extreme' },
};

const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Returns the current weather for a given city.',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: WeatherDataSchema,
  },
  async (input) => {
    console.log(`Getting weather for ${input.city}`);
    // Return mock data or call a real weather API here.
    return mockWeatherData[input.city] || { temperature: 28, condition: 'Sunny', humidity: 75, uvIndex: 'High' };
  }
);


const prompt = ai.definePrompt({
  name: 'weatherPrompt',
  input: { schema: GetWeatherDataInputSchema },
  output: { schema: WeatherDataSchema },
  tools: [getWeather],
  prompt: `Get the current weather for {{{city}}} using the getWeather tool and return the results.`,
});

export async function getWeatherData(
  input: GetWeatherDataInput
): Promise<GetWeatherDataOutput> {
  const { output } = await prompt(input);
  if (!output) {
    throw new Error('Unable to get weather data.');
  }
  return output;
}
