import { BaseState } from '../graph';
import { savedObjectsMigrationsGraph } from './saved_objects_migrations';
import { apiChangesGraph } from './api_changes';

export interface SubgraphResult {
  subgraphName: string;
  shouldExecute: boolean;
  confidence: number;
  reason: string;
}

export interface SubgraphChecker {
  name: string;
  check: (state: BaseState) => Promise<SubgraphResult>;
  execute: (state: BaseState) => Promise<any>;
}

// SO Migration Subgraph Checker
export const soMigrationChecker: SubgraphChecker = {
  name: 'so_migration',
  check: async (state: BaseState): Promise<SubgraphResult> => {
    if (state.hasChanges && state.changeType === 'so_migration') {
      return {
        subgraphName: 'so_migration',
        shouldExecute: true,
        confidence: 0.9,
        reason: 'Detected SO migration changes in code'
      };
    }
    
    return {
      subgraphName: 'so_migration',
      shouldExecute: false,
      confidence: 0.1,
      reason: 'No SO migration changes detected'
    };
  },
  execute: async (state: BaseState) => {
    try {
      const subgraphState = {
        baseState: state,
        soState: {
          hasChanges: state.hasChanges,
          changeType: state.changeType,
          hasSOChanges: false,
          soAttributes: [],
          developerIntent: '',
          additionalContext: '',
          relevantDocs: [],
          jsonDiff: { added: [], removed: [], modified: [] },
          verifiedChanges: false,
          developerComments: '',
          generatedFunction: '',
          comparison: '',
          needsUpdate: false,
          suggestions: [],
          feedback: ''
        }
      };

      const subgraphResult = await savedObjectsMigrationsGraph.invoke(subgraphState);
      return subgraphResult.soState;
    } catch (error) {
      console.error('Error executing SO migration subgraph:', error);
      throw error;
    }
  }
};

// API Changes Subgraph Checker
export const apiChangesChecker: SubgraphChecker = {
  name: 'api_changes',
  check: async (state: BaseState): Promise<SubgraphResult> => {
    if (state.hasChanges && state.changeType === 'api_changes') {
      return {
        subgraphName: 'api_changes',
        shouldExecute: true,
        confidence: 0.8,
        reason: 'Detected API changes in code'
      };
    }
    
    return {
      subgraphName: 'api_changes',
      shouldExecute: false,
      confidence: 0.1,
      reason: 'No API changes detected'
    };
  },
  execute: async (state: BaseState) => {
    try {
      const subgraphState = {
        baseState: state,
        apiState: {
          hasChanges: state.hasChanges,
          changeType: state.changeType,
          apiEndpoints: [],
          breakingChanges: false,
          versionChanges: [],
          documentationUpdates: [],
          migrationGuide: ''
        }
      };

      const subgraphResult = await apiChangesGraph.invoke(subgraphState);
      return subgraphResult.apiState;
    } catch (error) {
      console.error('Error executing API changes subgraph:', error);
      throw error;
    }
  }
};

// Main subgraph checker that evaluates all available subgraphs
export const subgraphChecker = {
  checkers: [soMigrationChecker, apiChangesChecker],
  
  async findMatchingSubgraph(state: BaseState): Promise<SubgraphResult | null> {
    const results = await Promise.all(
      this.checkers.map(checker => checker.check(state))
    );
    
    // Find the checker with the highest confidence that should execute
    const bestMatch = results
      .filter(result => result.shouldExecute)
      .sort((a, b) => b.confidence - a.confidence)[0];
    
    return bestMatch || null;
  },
  
  async executeSubgraph(state: BaseState): Promise<any> {
    const match = await this.findMatchingSubgraph(state);
    
    if (!match) {
      return {
        noSubgraphMatch: true,
        reason: 'No matching subgraph found for the detected changes'
      };
    }
    
    const checker = this.checkers.find(c => c.name === match.subgraphName);
    if (!checker) {
      throw new Error(`Checker not found for subgraph: ${match.subgraphName}`);
    }
    
    return await checker.execute(state);
  }
};
