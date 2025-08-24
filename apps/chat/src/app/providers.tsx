'use client';

import React from 'react';
import createCache from '@emotion/cache';
import { EuiProvider, euiStylisPrefixer } from '@elastic/eui';
import { EuiThemeAmsterdam } from '@elastic/eui'
import { ChatLayout } from '@/components/ChatLayout';

const cache = createCache({
  key: 'codesandbox',
  stylisPlugins: [euiStylisPrefixer],
  // container: document.querySelector('meta[name="emotion-styles"]')!,
});
// cache.compat = true;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const sideNavItems = [
    {
      name: 'Home',
      id: 'home',
      items: [
        {
          name: 'Chat',
          id: 'chat',
          href: '/',
        },
        {
          name: 'Graph',
          id: 'graph',
          href: '/graph',
        },
      ],
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
