'use client';

import React, { useState, useEffect } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
} from '@elastic/eui';
import { Chatbar } from '@/components/chat/Chatbar';
import { ChatArea } from '@/components/chat/ChatArea';
import { Message, convertLangChainMessages } from '@/components/chat/messages';
import { createNewThread, sendMessageToWorkflow } from './actions';

export default function ChatPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize with a new thread when component mounts
    initializeNewThread();
  }, []);

  useEffect(() => {
    console.log('scrolling to bottom');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const initializeNewThread = async () => {
    setIsInitializing(true);

    try {
      const { messages, threadId } = await createNewThread();

      // Set the thread ID
      setCurrentThreadId(threadId);
      
      // Convert and set the initial message
      setMessages(messages);
      
    } catch (error) {
      console.error('Error initializing thread:', error);
    }

    setIsInitializing(false);
  };


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentThreadId) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };
    
    // Add user message immediately for immediate UI feedback
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call the execute API with the current thread ID
      const response = await sendMessageToWorkflow(inputValue, currentThreadId);
      
      // Convert LangChain messages to our Message format
      const newMessages = convertLangChainMessages(response.messages);
      
      // Replace all messages with the complete conversation from the API
      // This ensures we have the exact state from the backend
      setMessages(newMessages);
      
    } catch (error) {
      console.error('Error executing graph:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = async () => {
    setIsInitializing(true);
    setMessages([]);
    setCurrentThreadId(null);
    
    // Initialize a new thread
    await initializeNewThread();
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <EuiPageTemplate.Section grow={true} style={{ height: '100%' }}>
        <EuiFlexGroup direction="column" gutterSize="m" justifyContent="center" alignItems="center">
          <EuiFlexItem grow={false}>
            <div style={{ textAlign: 'center' }}>
              <h2>Initializing GreenCheck...</h2>
              <p>Setting up your sustainability assistant</p>
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
    );
  }

  return (
    <>
      <EuiPageTemplate.Section grow={true} style={{ height: '100%' }} >
        <EuiFlexGroup direction="column" gutterSize="m">
          <EuiFlexItem>
            <ChatArea 
              messages={messages} 
              isLoading={isLoading}
              onNewConversation={startNewConversation}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
      <EuiPageTemplate.BottomBar paddingSize="m">
        <Chatbar 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          handleSendMessage={handleSendMessage} 
          handleKeyPress={handleKeyPress}
          isLoading={isLoading}
          disabled={isLoading || !currentThreadId}
        />
      </EuiPageTemplate.BottomBar>
    </>
  );
};
