# Execute API Testing Guide

## Overview
The GreenCheck API provides endpoints for managing conversation threads and executing graph workflows. All execution states are persisted in JSON files within the `.states` directory.

## Storage
- **Location**: `.states/` directory in the chat app root
- **Format**: JSON files named `{threadId}.json`
- **Persistence**: Survives server restarts
- **Structure**: Each file contains the complete execution state

## Endpoints

### POST /api/thread
Creates a new conversation thread with an initial welcome message.

```bash
curl -X POST http://localhost:3000/api/thread \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "threadId": "thread_1703123456789_abc123def",
  "messages": [
    {
      "type": "ai",
      "content": "Hello! I'm GreenCheck, your sustainability assistant..."
    }
  ],
  "isComplete": false,
  "status": "started"
}
```

**File Created:** `.states/thread_1703123456789_abc123def.json`

### POST /api/execute
Continues an existing workflow execution with a new message.

```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to check my Kibana code changes for sustainability",
    "threadId": "thread_1703123456789_abc123def"
  }'
```

**Response:**
```json
{
  "threadId": "thread_1703123456789_abc123def",
  "messages": [...],
  "isComplete": false,
  "status": "continued"
}
```

**File Updated:** `.states/thread_1703123456789_abc123def.json`

### GET /api/execute?threadId={threadId}
Retrieves the current state of an execution thread.

```bash
curl "http://localhost:3000/api/execute?threadId=thread_1703123456789_abc123def"
```

**Response:**
```json
{
  "threadId": "thread_1703123456789_abc123def",
  "messages": [...],
  "isComplete": false,
  "lastUpdated": "2023-12-21T10:30:45.123Z"
}
```

### DELETE /api/execute?threadId={threadId}
Removes an execution thread and its associated state file.

```bash
curl -X DELETE "http://localhost:3000/api/execute?threadId=thread_1703123456789_abc123def"
```

**Response:**
```json
{
  "success": true,
  "message": "Thread deleted successfully"
}
```

**File Deleted:** `.states/thread_1703123456789_abc123def.json`

## Workflow

### 1. Create New Thread
```bash
POST /api/thread
# Returns: threadId + initial message
```

### 2. Send Messages
```bash
POST /api/execute
Body: { message: "user message", threadId: "thread_123" }
# Returns: updated messages + thread state
```

### 3. Continue Conversation
```bash
POST /api/execute
Body: { message: "next message", threadId: "thread_123" }
# Returns: updated messages + thread state
```

## Message Flow

1. **Thread Creation**: `POST /api/thread` → New thread created → Initial message returned
2. **Message Exchange**: `POST /api/execute` → Graph execution → Updated messages returned
3. **State Persistence**: All messages and execution state are stored in JSON files within `.states/` directory

## Graph Execution States

The workflow can be in various states:
- `started`: New thread created
- `continued`: Execution continued with new message
- `isComplete`: Whether the workflow has finished

## File Structure Example

**`.states/thread_1234567890_abc123.json`:**
```json
{
  "threadId": "thread_1234567890_abc123",
  "messages": [
    {
      "type": "ai",
      "content": "Hello! I'm GreenCheck, your sustainability assistant..."
    },
    {
      "type": "human",
      "content": "I want to check my Kibana code changes"
    },
    {
      "type": "ai",
      "content": "I'll help you analyze your Kibana code changes..."
    }
  ],
  "isComplete": false,
  "lastUpdated": "2023-12-21T10:30:45.123Z"
}
```

## Error Handling

- **400**: Missing message or invalid request
- **404**: Thread not found (for GET/DELETE requests)
- **500**: Internal server error or graph execution failure

## Frontend Integration

The frontend now follows this pattern:
1. **Page Load**: Automatically calls `/api/thread` to create initial thread
2. **User Input**: Sends messages to `/api/execute` with thread ID
3. **New Conversation**: Calls `/api/thread` again to start fresh
4. **Loading States**: Shows initialization and processing states

## Notes

- **Persistent Storage**: All execution states are saved to JSON files in `.states/` directory
- **Server Restarts**: Execution states survive server restarts
- **File Management**: Each thread gets its own JSON file named with the thread ID
- **Automatic Cleanup**: Use DELETE endpoint to remove old threads and free up storage
- **Thread Lifecycle**: Create → Execute → Continue → Delete
- **The graph execution handles interruptions and human input automatically
- **Messages are processed through the LangGraph workflow defined in the greencheck-module
