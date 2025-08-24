import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiAvatar,
  EuiSpacer,
  EuiFormControlLayout,
  EuiTextArea,
  EuiButton,
  EuiIcon,
  EuiButtonIcon,
  EuiButtonEmpty,
} from '@elastic/eui';

interface ChatbarProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  disabled: boolean;
}

const SubmitButton = ({
  extended,
  handleSendMessage,
  isDisabled }: { handleSendMessage: () => void, extended: boolean, isDisabled: boolean }) => {
  if (extended) {
    return (
      <EuiButtonEmpty onClick={handleSendMessage} isDisabled={isDisabled} color="text">
        <EuiAvatar
          size="m"
          name={'Send'}
          iconType={'arrowRight'}
          isDisabled={isDisabled}
          onClick={handleSendMessage}
        />
      </EuiButtonEmpty>
    );
  }
  return (
    <EuiButton
      iconType="arrowRight"
      size="s"
      color="primary"
      onClick={handleSendMessage}
      disabled={isDisabled}
    >
      Send
    </EuiButton>
  );
};

export const Chatbar = ({ 
  inputValue, 
  setInputValue, 
  handleSendMessage, 
  handleKeyPress, 
  isLoading, 
  disabled 
}: ChatbarProps) => {
  return (
    <EuiFlexGroup alignItems="flexEnd" justifyContent="spaceBetween">
      <EuiFlexItem grow={true}>
        <EuiTextArea
          placeholder={isLoading ? "Processing..." : "Type your message here..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleKeyPress}
          rows={5}
          resize="none"
          fullWidth
          disabled={disabled}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}> 
        <SubmitButton 
          handleSendMessage={handleSendMessage} 
          isDisabled={!inputValue.trim() || disabled} 
          extended={true} 
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
