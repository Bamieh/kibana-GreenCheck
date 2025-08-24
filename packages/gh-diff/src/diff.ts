import {
  getPatchFromRepo,
  parsePatchFromFile,
  savePatchToFile,
} from './patch';
import { initSimpleGit } from './init';

export interface BranchDiffConfigs {
  repoBaseDir: string;
}

export async function getBranchDiff(configs: BranchDiffConfigs) { 
  if (!configs.repoBaseDir) {
    throw new Error('repoBaseDir is required');
  }

  const { repoBaseDir } = configs;
  const git = initSimpleGit({ repoBaseDir });

  
  const { patch, currentBranch } = await getPatchFromRepo(git);
  if (!currentBranch) {
    throw new Error('currentBranch is required');
  }

  await savePatchToFile(patch, currentBranch);
  const parsedPatch = await parsePatchFromFile(currentBranch);
  if (!parsedPatch) {
    throw new Error('parsedPatch is required');
  }

  console.log(JSON.stringify(parsedPatch, null, 2));

  return parsedPatch;
}