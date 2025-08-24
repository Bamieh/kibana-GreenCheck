import { NextRequest, NextResponse } from 'next/server';
import { graph } from '@greenCheck/greencheck-module';
import { HumanMessage } from '@langchain/core/messages';
import {
  generateThreadId,
  saveExecutionState,
  loadExecutionState,
  deleteExecutionState,
} from './state_manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, threadId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let currentThreadId = threadId;
    let executionState = threadId ? await loadExecutionState(threadId) : null;

    // If no threadId or thread doesn't exist, create a new execution
    if (!executionState) {
      currentThreadId = generateThreadId();
      
      // Initialize the graph with the first message
      const humanMessage = new HumanMessage(message);
      const initialState = {
        messages: [humanMessage],
      };

      try {
        // Start the graph execution
        const result = await graph.invoke(initialState);
        
        // Store the execution state
        executionState = {
          threadId: currentThreadId,
          messages: result.messages || [],
          isComplete: false,
          lastUpdated: new Date(),
        };
        
        await saveExecutionState(currentThreadId, executionState);
        
        return NextResponse.json({
          threadId: currentThreadId,
          messages: executionState.messages,
          isComplete: executionState.isComplete,
          status: 'started',
        });
        
      } catch (error) {
        console.error('Error starting graph execution:', error);
        return NextResponse.json(
          { error: 'Failed to start graph execution' },
          { status: 500 }
        );
      }
    } else {
      // Continue existing execution with new message
      const humanMessage = new HumanMessage(message);
      
      // Add the new message to existing state
      const currentState = {
        messages: [...executionState.messages, humanMessage],
      };

      try {
        // Continue the graph execution
        const result = await graph.invoke(currentState);
        
        // Update execution state
        executionState.messages = result.messages || [];
        executionState.isComplete = !result.messages || result.messages.length === 0;
        executionState.lastUpdated = new Date();
        
        await saveExecutionState(currentThreadId, executionState);
        
        return NextResponse.json({
          threadId: currentThreadId,
          messages: executionState.messages,
          isComplete: executionState.isComplete,
          status: 'continued',
        });
        
      } catch (error) {
        console.error('Error continuing graph execution:', error);
        return NextResponse.json(
          { error: 'Failed to continue graph execution' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error in execute route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve execution state
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');
  
  if (!threadId) {
    return NextResponse.json(
      { error: 'Thread ID is required' },
      { status: 400 }
    );
  }
  
  const executionState = await loadExecutionState(threadId);
  
  if (!executionState) {
    return NextResponse.json(
      { error: 'Thread not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    threadId: executionState.threadId,
    messages: executionState.messages,
    isComplete: executionState.isComplete,
    lastUpdated: executionState.lastUpdated,
  });
}

// DELETE endpoint to remove execution state
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');
  
  if (!threadId) {
    return NextResponse.json(
      { error: 'Thread ID is required' },
      { status: 400 }
    );
  }
  
  try {
    await deleteExecutionState(threadId);
    return NextResponse.json({ success: true, message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
}
