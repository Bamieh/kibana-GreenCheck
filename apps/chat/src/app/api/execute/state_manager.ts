import { promises as fs } from 'fs';
import path from 'path';

export interface ExecutionState {
  threadId: string;
  messages: any[];
  isComplete: boolean;
  lastUpdated: Date;
}

// Path to the states directory
const STATES_DIR = path.join(process.cwd(), '.states');

// Ensure the states directory exists
export const ensureStatesDir = async (): Promise<void> => {
  try {
    await fs.access(STATES_DIR);
  } catch {
    await fs.mkdir(STATES_DIR, { recursive: true });
  }
};

// Generate a unique thread ID
export const generateThreadId = (): string => {
  return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Save execution state to file
export const saveExecutionState = async (threadId: string, state: ExecutionState): Promise<void> => {
  await ensureStatesDir();
  const filePath = path.join(STATES_DIR, `${threadId}.json`);
  await fs.writeFile(filePath, JSON.stringify(state, null, 2));
};

// Load execution state from file
export const loadExecutionState = async (threadId: string): Promise<ExecutionState | null> => {
  try {
    await ensureStatesDir();
    const filePath = path.join(STATES_DIR, `${threadId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const state = JSON.parse(data);
    
    // Convert lastUpdated back to Date object
    if (state.lastUpdated) {
      state.lastUpdated = new Date(state.lastUpdated);
    }
    
    return state;
  } catch {
    return null;
  }
};

// Delete execution state file
export const deleteExecutionState = async (threadId: string): Promise<void> => {
  try {
    const filePath = path.join(STATES_DIR, `${threadId}.json`);
    await fs.unlink(filePath);
  } catch {
    // File doesn't exist, ignore
  }
};

// List all execution states
export const listExecutionStates = async (): Promise<string[]> => {
  try {
    await ensureStatesDir();
    const files = await fs.readdir(STATES_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch {
    return [];
  }
};

// Get execution state info (without full messages for performance)
export const getExecutionStateInfo = async (threadId: string): Promise<Omit<ExecutionState, 'messages'> | null> => {
  try {
    await ensureStatesDir();
    const filePath = path.join(STATES_DIR, `${threadId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const state = JSON.parse(data);
    
    // Convert lastUpdated back to Date object
    if (state.lastUpdated) {
      state.lastUpdated = new Date(state.lastUpdated);
    }
    
    // Return state without messages for performance
    const { messages, ...stateInfo } = state;
    return stateInfo;
  } catch {
    return null;
  }
};
