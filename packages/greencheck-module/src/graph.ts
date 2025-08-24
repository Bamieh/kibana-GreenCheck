import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
  MemorySaver,
  Command,
  interrupt,
  task
} from "@langchain/langgraph";


import { AIMessage, ToolMessage } from '@langchain/core/messages';
import { ToolCall } from '@langchain/core/messages/tool';
import { weatherSearch } from './tools';
import { getModel } from './model';
import { grabCodeDiff } from './nodes/code_diff';


const model = getModel([
  weatherSearch
]);

const callLLM = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
};

const humanReviewNode = async (state: typeof MessagesAnnotation.State): Promise<Command> => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    const toolCall = lastMessage.tool_calls![lastMessage.tool_calls!.length - 1]!;

    const humanReview = interrupt<
      {
        question: string;
        toolCall: ToolCall;
      },
      {
        action: string;
        data: any;
      }>({
        question: "Is this correct?",
        toolCall: toolCall
      });

    const reviewAction = humanReview.action;
    const reviewData = humanReview.data;

    if (reviewAction === "continue") {
        return new Command({ goto: "run_tool" });
    }
    else if (reviewAction === "update") {
        const updatedMessage = {
            role: "ai",
            content: lastMessage.content,
            tool_calls: [{
                id: toolCall.id,
                name: toolCall.name,
                args: reviewData
            }],
            id: lastMessage.id
        };
        return new Command({ goto: "run_tool", update: { messages: [updatedMessage] } });
    }
    else if (reviewAction === "feedback") {
        const toolMessage = new ToolMessage({
          name: toolCall.name,
          content: reviewData,
          tool_call_id: toolCall.id!
        })
        return new Command({ goto: "call_llm", update: { messages: [toolMessage] }});
    }
    throw new Error("Invalid review action");
};

const runTool = async (state: typeof MessagesAnnotation.State) => {
    const newMessages: ToolMessage[] = [];
    const tools = { weather_search: weatherSearch };
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    const toolCalls = lastMessage.tool_calls!;

    for (const toolCall of toolCalls) {
        const tool = tools[toolCall.name as keyof typeof tools];
        const result = await tool.invoke(toolCall.args);
        newMessages.push(new ToolMessage({
            name: toolCall.name,
            content: result,
            tool_call_id: toolCall.id!
        }));
    }
    return { messages: newMessages };
};

const routeAfterLLM = (state: typeof MessagesAnnotation.State): typeof END | "human_review_node" => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (!lastMessage.tool_calls?.length) {
        return END;
    }
    return "human_review_node";
};

const grabCodeDiffNode = async (state: typeof MessagesAnnotation.State) => {
  const { codeDiff } = await grabCodeDiff(state);
  return { codeDiff };  
};
const categorizeCodeNode = async (state: typeof MessagesAnnotation.State) => {
  const { codeDiff } = await grabCodeDiff(state);
  return { codeDiff };  
};

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("grab_code_diff", grabCodeDiffNode, { ends: ["categorize_code"] })
    .addNode("categorize_code", categorizeCodeNode, { ends: ["call_llm"] })
    .addNode("call_llm", callLLM)
    .addNode("run_tool", runTool)
    .addNode("human_review_node", humanReviewNode, {
      ends: ["run_tool", "call_llm"]
    })
    .addEdge(START, "grab_code_diff")
    .addConditionalEdges(
        "call_llm",
        routeAfterLLM,
        ["human_review_node", END]
    )
    .addEdge("run_tool", "call_llm");

const memory = new MemorySaver();

export const graph = workflow.compile({ checkpointer: memory });