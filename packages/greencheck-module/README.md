# GreenCheck Module - Subgraph Architecture

This module implements a flexible subgraph-based architecture for analyzing different types of code changes and providing appropriate guidance.

## Architecture Overview

The system consists of:

1. **Main Graph** (`graph.ts`) - Orchestrates the overall workflow
2. **Subgraph Checker** (`subgraph_checker.ts`) - Evaluates which subgraph to execute
3. **Individual Subgraphs** - Handle specific types of changes

## Current Subgraphs

### 1. SO Migration Subgraph (`saved_objects_migrations.ts`)
Handles Saved Object migration changes:
- Detects SO attribute changes
- Clarifies developer intent
- Fetches relevant documentation
- Creates JSON diffs
- Verifies changes with developer
- Generates migration functions
- Provides suggestions and feedback

### 2. API Changes Subgraph (`api_changes.ts`)
Handles API-related changes:
- Detects API endpoint changes
- Analyzes breaking changes
- Generates documentation updates

## How to Add New Subgraphs

### Step 1: Create the Subgraph File
Create a new file in `src/modules/` following this pattern:

```typescript
import { StateGraph, Annotation } from "@langchain/langgraph";

export interface YourChangeState {
  // Define your state interface
  hasChanges?: boolean;
  changeType?: string;
  // ... other properties
}

// Define your node functions
const yourFirstNode = async (state: YourChangeState) => {
  // Implementation
  return { /* your results */ };
};

// Build the subgraph
const yourSubgraph = new StateGraph(Annotation.Root({
  baseState: Annotation<any>,
  yourState: Annotation<YourChangeState>,
}))
  .addNode("your_first_node", yourFirstNode)
  // ... add more nodes and edges
  .addEdge("__start__", "your_first_node")
  .addEdge("your_last_node", "__end__");

export const yourGraph = yourSubgraph.compile();
```

### Step 2: Create a Checker
Add a new checker to `subgraph_checker.ts`:

```typescript
export const yourChangeChecker: SubgraphChecker = {
  name: 'your_change_type',
  check: async (state: BaseState): Promise<SubgraphResult> => {
    if (state.hasChanges && state.changeType === 'your_change_type') {
      return {
        subgraphName: 'your_change_type',
        shouldExecute: true,
        confidence: 0.8,
        reason: 'Detected your change type in code'
      };
    }
    
    return {
      subgraphName: 'your_change_type',
      shouldExecute: false,
      confidence: 0.1,
      reason: 'No your change type detected'
    };
  },
  execute: async (state: BaseState) => {
    // Implementation to execute your subgraph
  }
};
```

### Step 3: Register the Checker
Add your checker to the `checkers` array in `subgraph_checker.ts`:

```typescript
export const subgraphChecker = {
  checkers: [soMigrationChecker, apiChangesChecker, yourChangeChecker],
  // ... rest of implementation
};
```

## Workflow

1. **Code Change Detection**: The main graph detects code changes
2. **Subgraph Selection**: The subgraph checker evaluates all available subgraphs
3. **Execution**: The best matching subgraph is executed
4. **Fallback**: If no subgraph matches, the system points to documentation

## State Management

Each subgraph maintains its own state while sharing common state with the main graph through the `baseState` annotation. This allows for:

- Isolated subgraph logic
- Shared context between main graph and subgraphs
- Easy state passing and result extraction

## Extensibility

The system is designed to be easily extensible:
- Add new change types by creating new subgraphs
- Modify existing subgraphs without affecting others
- Configure confidence levels and routing logic
- Add new nodes and workflows within subgraphs

## Usage Example

```typescript
import { graph } from './graph';

const initialState = {
  messages: [],
  hasChanges: true,
  changeType: 'so_migration'
};

const result = await graph.invoke(initialState);
console.log(result.subgraphResults);
```
