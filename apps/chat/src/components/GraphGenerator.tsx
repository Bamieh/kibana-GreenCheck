'use client';

import React, { useState } from 'react';
import {
  EuiButton,
  EuiPanel,
  EuiText,
  EuiSpacer,
  EuiLoadingSpinner,
  EuiCallOut,
} from '@elastic/eui';

export const GraphGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateGraph = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate graph');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EuiPanel paddingSize="m">
      <EuiText>
        <h3>Graph Generator</h3>
        <p>Click the button below to generate the GreenCheck AI module.</p>
      </EuiText>
      
      <EuiSpacer size="m" />
      
      <EuiButton
        onClick={generateGraph}
        isLoading={isLoading}
        disabled={isLoading}
        iconType="refresh"
      >
        {isLoading ? 'Generating...' : 'Generate Graph'}
      </EuiButton>

      <EuiSpacer size="m" />

      {isLoading && (
        <EuiPanel paddingSize="s" color="subdued">
          <EuiLoadingSpinner size="m" />
          <EuiSpacer size="xs" />
          <EuiText size="s">Generating graph...</EuiText>
        </EuiPanel>
      )}

      {error && (
        <EuiCallOut
          title="Error"
          color="danger"
          iconType="alert"
        >
          <p>{error}</p>
        </EuiCallOut>
      )}

      {result && (
        <EuiPanel paddingSize="s" color="subdued">
          <EuiText size="s">
            <strong>Graph generated successfully!</strong>
          </EuiText>
          <EuiSpacer size="xs" />
          {result.image ? (
            <>
              <EuiSpacer size="s" />
              <img 
                src={`data:${result.mimeType};base64,${result.image}`}
                alt="Generated Graph"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <EuiSpacer size="xs" />
              <EuiText size="xs" color="subdued">
                Image size: {result.size} bytes
              </EuiText>
            </>
          ) : (
            <EuiText size="xs" color="subdued">
              {JSON.stringify(result, null, 2)}
            </EuiText>
          )}
        </EuiPanel>
      )}
    </EuiPanel>
  );
};
