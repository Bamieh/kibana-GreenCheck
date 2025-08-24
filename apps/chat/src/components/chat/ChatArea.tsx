import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiButton,
  EuiCommentList,
  EuiComment,
  EuiAvatar,
} from '@elastic/eui';
import { formatDistanceToNow, format } from 'date-fns';
import { LoadingIndicator } from './LoadingIndicator';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
  console.log(messages);
  const comments = messages.map((message) => ({
    id: message.id,
    username: message.role === 'user' ? 'You' : 'GreenCheck',
    event: message.role === 'user' ? 'commented' : 'replied',
    timestamp: formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }),
    children: (
      <EuiText size="s">
        {message.content}
      </EuiText>
    ),
    timelineAvatar: (
      <EuiAvatar
        size="m"
        name={message.role === 'user' ? 'You' : 'GreenCheck'}
        iconType={message.role === 'user' ? 'user' : 'compute'}
      />
    ),
  }));

  return (
    <EuiPanel paddingSize="m" hasShadow={false}>
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem>
          <EuiCommentList comments={comments} />
          
          {/* Loading indicator */}
          {isLoading && (
            <EuiFlexItem grow={false}>
              <LoadingIndicator message="Processing your request..." />
            </EuiFlexItem>
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};
