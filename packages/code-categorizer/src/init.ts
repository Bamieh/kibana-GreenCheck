import { parseEnvFile } from './dotenv';
import { OpenAI } from '@langchain/openai';

export const init = () => {
  const env = parseEnvFile(process.argv);
  if (!env) {
    throw new Error('env is not set');
  }

  const model = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: 'gpt-5-nano'
  });

  return {
    model,
  };
}