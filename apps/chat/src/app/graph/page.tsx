'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { EuiFlexGroup, EuiFlexItem, EuiPageTemplate, EuiTitle, EuiSpacer } from '@elastic/eui';
import { GraphCard } from '@/components/GraphCard';
import { graphDefinitions } from '@greenCheck/greencheck-module';

export default function GraphPage() {
  const router = useRouter();

  const handleCardClick = (graphId: string) => {
    router.push(`/graph/${graphId.toLowerCase()}`);
  };

  const workflows = graphDefinitions.filter(item => item.graphType === 'workflow');
  const subgraphs = graphDefinitions.filter(item => item.graphType === 'subgraph');

  return (
    <EuiPageTemplate.Section grow={true} style={{ height: '100%' }} >
      
      {/* Workflows Section */}
      <EuiTitle size="m">
        <h4>Workflows</h4>
      </EuiTitle>
      <EuiSpacer size="xl" />
      <EuiFlexGroup direction="row" gutterSize="xl" wrap>
        {workflows.map((item, index) => (
          <EuiFlexItem key={index} grow={false}>
            <GraphCard item={item} onClick={handleCardClick} />
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>

      <EuiSpacer size="xl" />

      {/* Subgraphs Section */}
      <EuiTitle size="m">
        <h4>Subgraphs</h4>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiFlexGroup direction="row" gutterSize="m" wrap>
        {subgraphs.map((item, index) => (
          <EuiFlexItem key={index} grow={false}>
            <GraphCard item={item} onClick={handleCardClick} />
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </EuiPageTemplate.Section>
  )
}