export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const convertLangChainMessages = (langChainMessages: any[]): Message[] => {
  return langChainMessages.map((msg, index) => {
    // Handle different LangChain message formats
    let content = '';
    let role: 'user' | 'assistant' = 'assistant';
    
    if (msg.kwargs && msg.kwargs.content) {
      // LangChain message format
      content = msg.kwargs.content;
      role = msg.type === 'constructor' && msg.id?.includes('HumanMessage') ? 'user' : 'assistant';
    } else if (msg.content) {
      // Simple message format
      content = msg.content;
      role = msg.type === 'human' ? 'user' : 'assistant';
    } else if (msg.text) {
      // Alternative text format
      content = msg.text;
      role = 'assistant';
    } else {
      // Fallback
      content = 'No content available';
      role = 'assistant';
    }
    
    return {
      id: `msg_${Date.now()}_${index}`,
      content,
      role,
      timestamp: new Date(),
    };
  });
};