'use client';
import React, { useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiText,
  EuiButton,
  EuiSideNav,
  htmlIdGenerator,
  EuiSideNavItemType,
} from '@elastic/eui';

const SideNavHeader = () => {
  return (
    <EuiFlexGroup gutterSize="l" alignItems="center" justifyContent="center">
      <EuiFlexItem grow={false}>
        <EuiIcon type="logoElastic" size="xl" />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiText> <h4>Kibana GreenCheck</h4> </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};


interface SideNavProps {
  sideNavItems: EuiSideNavItemType<{}>[];
}

export const SideNav: React.FC<SideNavProps> = ({ sideNavItems }) => {
  const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
  const toggleOpenOnMobile = () => {
    setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  return (
    <EuiSideNav
      heading={<SideNavHeader />}
      toggleOpenOnMobile={() => toggleOpenOnMobile()}
      isOpenOnMobile={isSideNavOpenOnMobile}
      items={sideNavItems}
    />
  );
};
