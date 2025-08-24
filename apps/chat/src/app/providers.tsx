'use client';

import React from 'react';
import createCache from '@emotion/cache';
import { EuiProvider, euiStylisPrefixer } from '@elastic/eui';
import { EuiThemeAmsterdam } from '@elastic/eui'
import { ChatLayout } from '@/components/ChatLayout';
import { graphDefinitions } from '@greenCheck/greencheck-module';

const cache = createCache({
  key: 'codesandbox',
  stylisPlugins: [euiStylisPrefixer],
  // container: document.querySelector('meta[name="emotion-styles"]')!,
});
// cache.compat = true;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const sideNavItems = [
    {
      name: 'Execute',
      id: 'execute',
      items: [
        {
          name: 'Chat',
          id: 'chat',
          href: '/',
        },
      ],
    },
    {
      name: 'Graphs',
      id: 'graphs',
      href: '/graph',
      items: graphDefinitions.map((graph) => ({
        name: graph.graphName,
        id: graph.graphId,
        href: `/graph/${graph.graphId}`,
      }))
    },
  ];

  return (
    <EuiProvider
      cache={cache}
      theme={EuiThemeAmsterdam}
    >
      <ChatLayout sideNavItems={sideNavItems}>
        {children}
      </ChatLayout>
    </EuiProvider>
  );
};
