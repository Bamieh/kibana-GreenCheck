'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { GraphGenerator } from '@/components/GraphGenerator';
import { EuiFlexGroup, EuiFlexItem, EuiPageTemplate } from '@elastic/eui';

export default function GraphIdPage() {
  const params = useParams();
  const graphId = params.graphId as string;

  return (
    <EuiPageTemplate.Section grow={true} style={{ height: '100%' }} >
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem>
          <GraphGenerator graphId={graphId} />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageTemplate.Section>
  )
}
