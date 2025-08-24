import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiAvatar,
  EuiSpacer,
} from '@elastic/eui';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {

  return (
    <EuiPanel paddingSize="m" hasShadow={false}>
      <EuiFlexGroup direction="column" gutterSize="m">
        {messages.map((message) => (
          <EuiFlexItem key={message.id} grow={false}>
            <EuiFlexGroup gutterSize="m" alignItems="flexStart">
              <EuiFlexItem grow={false}>
                <EuiAvatar
                  size="m"
                  name={message.role === 'user' ? 'User' : 'GreenCheck'}
                  iconType={message.role === 'user' ? 'user' : 'chat'}
                  
                />
              </EuiFlexItem>
              
              <EuiFlexItem>
                <EuiPanel paddingSize="s" hasShadow={false} color="subdued">
                  <EuiText size="s">
                    {message.content}
                  </EuiText>
                  <EuiSpacer size="xs" />
                  <EuiText size="xs" color="subdued">
                    {message.timestamp.toLocaleTimeString()}
                  </EuiText>
                </EuiPanel>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </EuiPanel>
  );
};
