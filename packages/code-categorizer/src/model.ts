import { ChatPromptTemplate } from "@langchain/core/prompts";

import * as fs from 'fs/promises';
import * as path from 'path';

const getModelPath = (modelName: string) => {
  return path.join(process.cwd(), 'model', `${modelName}.json`);
}

export const compileModelPrompt = async (modelName: string) => {
  const modelPath = getModelPath(modelName);
  const promptTemplate = await fs.readFile(modelPath, 'utf8');
  const { system, user } = JSON.parse(promptTemplate);
  if (!system  || typeof system !== 'string') {
    throw new Error('system is not set');
  }

  if (!user || typeof user !== 'string') {
    throw new Error('user is not set');
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", system],
    ["user", user],
  ]);

  return prompt;
}