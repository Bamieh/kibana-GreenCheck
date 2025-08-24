'use client';

interface NewThreadResponse {
  threadId: string;
  messages: any[];
  isComplete: boolean;
  status: 'started';
}

export const createNewThread = async (): Promise<NewThreadResponse> => {
  const response = await fetch('/api/thread', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create thread: ${response.statusText}`);
  }

  return await response.json();
};

interface ExecuteResponse {
  messages: any[];
  threadId: string;
  isComplete: boolean;
  status: 'started' | 'continued';
}

export const sendMessageToWorkflow = async (message: string, threadId: string): Promise<ExecuteResponse> => {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      threadId,
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return await response.json();
};