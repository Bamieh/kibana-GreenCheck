import { describe, test, expect, vi } from 'vitest';
import { getBranchDiff } from './';

const kibanaRepoBaseDir = '/Users/bamieh/Bamieh/elastic/kibana';

describe('getBranchDiff', { timeout: 30000 }, () => {
  test('Gets branch diff', async () => {
    
    const diff = await getBranchDiff({
      repoBaseDir: kibanaRepoBaseDir,
    });

    expect(diff).toBeDefined();
  })
});