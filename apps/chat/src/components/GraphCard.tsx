import React from 'react';
import { EuiCard, EuiIcon } from '@elastic/eui';

interface GraphDefinition {
  graphId: string;
  graphName: string;
  graphType: 'workflow' | 'subgraph';
}

interface GraphCardProps {
  item: GraphDefinition;
  onClick: (graphId: string) => void;
}

export const GraphCard: React.FC<GraphCardProps> = ({ item, onClick }) => {
  const { graphType, graphName, graphId } = item;
  const isWorkflow = graphType === 'workflow';
  return (
    <EuiCard
      icon={<EuiIcon size="xxl" type={isWorkflow ? 'usersRolesApp' : 'machineLearningApp'} />}
      title={`${graphName} Graph`}
      description={`Generate and analyze the ${graphName} workflow graph`}
      onClick={() => onClick(graphId)}
      betaBadgeProps={{
        label: isWorkflow ? 'Workflow' : 'Subgraph',
        color: isWorkflow ? 'accent' : 'hollow',
        tooltipContent:
          isWorkflow ?
            'Workflows are the main entry point for the GreenCheck AI module.' :
            'Subgraphs are modules for each specific code change category.',
      }}
    />
  );
};
