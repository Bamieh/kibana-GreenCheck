export interface GraphDefinition {
  graphId: string;
  graphName: string;
  graphDescription: string;
  graphType: 'workflow' | 'subgraph';
}

export const graphDefinitions: GraphDefinition[] = [
  {
    graphId: 'code-checker',
    graphName: 'Code Checker',
    graphDescription: 'Kibana GreenCheck AI Code Checker',
    graphType: 'workflow',
  },
  {
    graphId: 'so-migrations',
    graphName: 'Saved Objects Migrations',
    graphDescription: 'This graph is used to check for changes in saved objects and generate a migration function.',
    graphType: 'subgraph',
  }
]