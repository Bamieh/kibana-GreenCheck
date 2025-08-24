'use client';
import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPageTemplate } from '@elastic/eui';

import { GraphGenerator } from '@/components/GraphGenerator';

export default function GraphPage() {
  return (
    <EuiPageTemplate.Section grow={true} style={{ height: '100%' }} >
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem>
          <GraphGenerator />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageTemplate.Section>
  )
}