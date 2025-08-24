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

import { subgraphChecker } from './modules/subgraph_checker';

import { prModuleGraph } from './modules/pr_module';
import { AIMessage, ToolMessage } from "@langchain/core/messages";

export interface BaseState {
  messages: any[];
  hasChanges?: boolean;
  changeType?: string;
  subgraphResults?: any;
  shouldPointToDocumentation?: boolean;
}

// Node functions - empty implementations for now
const checkCodeChangesNode = async (state: BaseState) => {
  // TODO: Implement code change detection
  console.log('Checking code changes...');
  
  // For demonstration purposes, we'll randomly select a change type
  // In a real implementation, this would analyze the actual code changes
  const changeTypes = ['so_migration', 'api_changes', 'other_changes'];
  const randomChangeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
  
  return { 
    hasChanges: true, 
    changeType: randomChangeType 
  };
};

const pointToDocumentationNode = async (state: BaseState) => {
  // TODO: Implement documentation pointing
  console.log('Pointing to relevant documentation...');
  return { documentationUrl: 'https://docs.example.com/so-migrations' };
};

// Node that checks and executes the appropriate subgraph
const executeSubgraphNode = async (state: BaseState) => {
  console.log('Checking for matching subgraph...');
  
  try {
    const results = await subgraphChecker.executeSubgraph(state);
    
    if (results.noSubgraphMatch) {
      console.log('No matching subgraph found, pointing to documentation');
      return { 
        subgraphResults: results,
        shouldPointToDocumentation: true 
      };
    }
    
    return {
      subgraphResults: results,
      shouldPointToDocumentation: false
    };
  } catch (error) {
    console.error('Error executing subgraph:', error);
    return {
      subgraphResults: { error: 'Failed to execute subgraph' },
      shouldPointToDocumentation: true
    };
  }
};

// Conditional routing functions
const routeAfterCodeChanges = (state: BaseState): "check Kibana modules" | "point_to_documentation" => {
  if (state.hasChanges) {
    return "check Kibana modules";
  }
  return "point_to_documentation";
};

const routeAfterSubgraph = (state: BaseState): "point_to_documentation" | "__end__" => {
  if (state.shouldPointToDocumentation) {
    return "point_to_documentation";
  }
  return END;
};

const grabBranchDetailsNode = async (state: BaseState) => {
  console.log('Grabbing branch details...');
  return {
    branchDetails: {
      name: 'main',
      url: 'https://github.com/org/repo/tree/main'
    }
  };
};

const codeCategorizeNode = async (state: BaseState) => {
  console.log('Categorizing code changes...');
  return {
    codeCategory: 'feature'
  };
};

const grabRelevantModulesNode = async (state: BaseState) => {
  console.log('Grabbing relevant modules...');
  return {
    relevantModules: ['saved_objects_migrations', 'pr_module']
  };
};

function shouldContinue(state: typeof MessagesAnnotation.State): "action" | "askHuman" | typeof END {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  // If there is no function call, then we finish
  if (lastMessage && !lastMessage.tool_calls?.length) {
    return END;
  }
  // If tool call is askHuman, we return that node
  // You could also add logic here to let some system know that there's something that requires Human input
  // For example, send a slack message, etc
  if (lastMessage.tool_calls?.[0]?.name === "askHuman") {
    console.log("--- ASKING HUMAN ---")
    return "askHuman";
  }
  // Otherwise if it isn't, we continue with the action node
  return "action";
}

// We define a fake node to ask the human
function askHumanNode(state: typeof MessagesAnnotation.State): Partial<typeof MessagesAnnotation.State> {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  const toolCallId = lastMessage.tool_calls?.[0]?.id;
  const location: string = interrupt("Please provide your location:");
  const newToolMessage = new ToolMessage({
    tool_call_id: toolCallId!,
    content: location,
  })
  return { messages: [newToolMessage] };
}

const verifyModulesWithHumanNode = async (state: BaseState) => {
  console.log('Verifying modules with human...');
  return {
    modules: ['saved_objects_migrations', 'pr_module']
  };
};

// Build the workflow graph
const workflow = new StateGraph(MessagesAnnotation)
  // Add main nodes
  .addNode("grab_branch_details", grabBranchDetailsNode)
  .addNode("askHuman", askHumanNode)
  .addNode("get_code_changes", checkCodeChangesNode)
  .addNode("code_categorize", codeCategorizeNode)
  .addNode("point_to_documentation", pointToDocumentationNode)
  .addNode("grabRelevantModules", grabRelevantModulesNode)
  .addNode("executeModules", executeSubgraphNode)
  .addNode("prModuleGraph", prModuleGraph)
  .addNode("verifyModulesWithHuman", verifyModulesWithHumanNode)
  
  // Add edges
  .addEdge(START, "grab_branch_details")
  .addEdge("grab_branch_details", "askHuman")
  .addEdge("askHuman", "grab_branch_details")
  .addEdge("askHuman", "get_code_changes")
  .addEdge("askHuman", "code_categorize")
  .addEdge("code_categorize", "grabRelevantModules")
  .addEdge("get_code_changes", "grabRelevantModules")
  
  .addConditionalEdges(
    "grabRelevantModules",
    routeAfterCodeChanges,
    ["verifyModulesWithHuman", "point_to_documentation"]
  )
  .addConditionalEdges(
    "verifyModulesWithHuman",
    routeAfterCodeChanges,
    ["grabRelevantModules"]
  )
  .addEdge("verifyModulesWithHuman", "executeModules")
  .addEdge("executeModules", "prModuleGraph")
  .addEdge("point_to_documentation", "prModuleGraph")
  .addEdge("prModuleGraph", END);


const memory = new MemorySaver();

export const graph = workflow.compile({
  checkpointer: memory,
  name: "Kibana Green Check",
  interruptAfter: ["grab_branch_details", "grabRelevantModules" ],
  description: "This graph is used to check the code changes in the Kibana repository and verify the modules that are relevant to the code changes."
});