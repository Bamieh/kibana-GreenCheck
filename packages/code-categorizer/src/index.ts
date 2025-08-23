import { getCategoryDetails } from './category_details';
import { init } from './init';
import { compileModelPrompt } from './model';

export const categorizeCodePrompt = async (modelName  : string, params: any) => {
  const prompt = await compileModelPrompt(modelName);
  const messages = await prompt.invoke(params);

  return messages;
}

export const categorizeCode = async (code: string) => {
  const { model } = init();

  const categoriesDetails = await getCategoryDetails();
  const categoriesDetailsString = JSON.stringify(categoriesDetails);
  const messages = await categorizeCodePrompt('categorize_completion', { code, categoriesDetails: categoriesDetailsString });
  console.log('messages::', messages);

  // const response = await model.invoke(messages);

  return;
}