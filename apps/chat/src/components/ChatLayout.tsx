'use client';
import React from 'react';
import {
  EuiText,
  EuiButton,
  EuiImage,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSideNavItemType,
} from '@elastic/eui';
import { SideNav } from './SideNav';

const panelled: EuiPageTemplateProps['panelled'] = true;
const restrictWidth: EuiPageTemplateProps['restrictWidth'] = false;
const bottomBorder: EuiPageTemplateProps['bottomBorder'] = true;

interface ChatLayoutProps {
  children: React.ReactNode;
  sideNavItems: EuiSideNavItemType<{}>[];
}

export const ChatLayout = ({ children, sideNavItems }: ChatLayoutProps) => {
  return (
    <EuiPageTemplate
      panelled={panelled}
      restrictWidth={restrictWidth}
      bottomBorder={bottomBorder}
      offset={0}
      grow={true}
    >
      <EuiPageTemplate.Sidebar sticky={true} style={{ height: '100vh' }}>
        <SideNav sideNavItems={sideNavItems} />
      </EuiPageTemplate.Sidebar>
      <EuiPageTemplate.Header
        iconType="logoElastic"
        pageTitle="AI Assistant"
        rightSideItems={[<EuiButton>Right side item</EuiButton>]}
      />
      {children}
    </EuiPageTemplate>
  );
};