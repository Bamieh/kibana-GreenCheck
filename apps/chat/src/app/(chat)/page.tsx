'use client';

import React, { useState, useEffect } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
} from '@elastic/eui';
import { Chatbar } from '@/components/chat/Chatbar';
import { ChatArea } from '@/components/chat/ChatArea';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m GreenCheck, your sustainability assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      content: 'I\'d like to analyze the carbon footprint of our supply chain.',
      role: 'user',
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: '3',
      content: 'I can help you analyze your supply chain carbon footprint. To get started, I\'ll need some information about your current suppliers, transportation methods, and energy usage. Would you like me to guide you through the data collection process?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);


  useEffect(() => {
    console.log('scrolling to bottom');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. I\'m processing your request and will provide a detailed analysis shortly.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <EuiPageTemplate.Section grow={true} style={{ height: '100%' }} >
        <EuiFlexGroup direction="column" gutterSize="m">
          <EuiFlexItem>
            <ChatArea messages={messages} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
      <EuiPageTemplate.BottomBar paddingSize="m">
        <Chatbar inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} handleKeyPress={handleKeyPress} />
      </EuiPageTemplate.BottomBar>
    </>
  );
};
