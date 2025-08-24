import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiAvatar,
  EuiLoadingSpinner,
} from '@elastic/eui';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Processing your request..." 
}) => {
  return (
    <EuiFlexGroup gutterSize="m" alignItems="flexStart">
      <EuiFlexItem grow={false}>
        <EuiAvatar
          size="m"
          name="GreenCheck"
          iconType="chat"
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiPanel paddingSize="s" hasShadow={false} color="subdued">
          <EuiFlexGroup gutterSize="s" alignItems="center">
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size="s" />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="s" color="subdued">
                {message}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
