import { NextRequest, NextResponse } from 'next/server';
import { generateThreadId, saveExecutionState } from '../execute/state_manager';

export interface NewThreadResponse {
  threadId: string;
  messages: any[];
  isComplete: boolean;
  status: 'started';
}

export async function POST(request: NextRequest) {
  try {
    // Generate a new thread ID
    const threadId = generateThreadId();
    
    // Create initial welcome message
    const initialMessage = {
      type: 'ai',
      content: 'Hello! I\'m GreenCheck, your sustainability assistant. I can help you analyze your Kibana code changes for sustainability and compliance. How can I help you today?',
      timestamp: new Date(),
    };
    
    // Create initial execution state
    const initialState = {
      threadId,
      messages: [initialMessage],
      isComplete: false,
      lastUpdated: new Date(),
      status: 'started',
    };
    
    // Save the initial state
    await saveExecutionState(threadId, initialState);
    
    // Return the new thread information
    const response: NewThreadResponse = {
      threadId,
      messages: [initialMessage],
      isComplete: false,
      status: 'started',
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error creating new thread:', error);
    return NextResponse.json(
      { error: 'Failed to create new thread' },
      { status: 500 }
    );
  }
}
