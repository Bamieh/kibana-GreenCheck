# Execute API Testing Guide

## Overview
The execute API endpoint handles graph execution for the GreenCheck workflow. It supports both starting new executions and continuing existing ones. All execution states are persisted in JSON files within the `.states` directory.

## Storage
- **Location**: `.states/` directory in the chat app root
- **Format**: JSON files named `{threadId}.json`
- **Persistence**: Survives server restarts
- **Structure**: Each file contains the complete execution state

## Endpoints

### POST /api/execute
Starts a new workflow execution or continues an existing one.

#### Starting a New Execution
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to check my Kibana code changes for sustainability"
  }'
```

**Response:**
```json
{
  "threadId": "thread_1703123456789_abc123def",
  "messages": [...],
  "isComplete": false,
  "status": "started"
}
```

**File Created:** `.states/thread_1703123456789_abc123def.json`

#### Continuing an Existing Execution
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Yes, I have saved objects migrations",
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

## Message Flow

1. **Initial Message**: User sends first message → New thread created → Graph execution starts → State saved to file
2. **Follow-up Messages**: User sends additional messages → Thread continues → Graph execution continues → State updated in file
3. **State Persistence**: All messages and execution state are stored in JSON files within `.states/` directory

## Graph Execution States

The workflow can be in various states:
- `started`: New execution initiated
- `continued`: Execution continued with new message
- `isComplete`: Whether the workflow has finished

## File Structure Example

**`.states/thread_1234567890_abc123.json`:**
```json
{
  "threadId": "thread_1234567890_abc123",
  "messages": [
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

## Notes

- **Persistent Storage**: All execution states are saved to JSON files in `.states/` directory
- **Server Restarts**: Execution states survive server restarts
- **File Management**: Each thread gets its own JSON file named with the thread ID
- **Automatic Cleanup**: Use DELETE endpoint to remove old threads and free up storage
- **The graph execution handles interruptions and human input automatically
- **Messages are processed through the LangGraph workflow defined in the greencheck-module
