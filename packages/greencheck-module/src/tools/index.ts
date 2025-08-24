import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const weatherSearchSchema = z.object({
  city: z.string()
});

export const weatherSearch = tool((input: z.infer<typeof weatherSearchSchema>) => {
  console.log("----");
  console.log(`Searching for: ${input.city}`);
  console.log("----");
  return "Sunny!";
}, {
  name: 'weather_search',
  description: 'Search for the weather',
  schema: weatherSearchSchema
});