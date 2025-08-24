import { ChatOpenAI } from "@langchain/openai";
import { Tool } from "@langchain/core/tools";

export const getModel = (tools: Tool[] = []) => {
  return new ChatOpenAI({ 
    model: "gpt-5-mini"
  }).bindTools(tools);
}