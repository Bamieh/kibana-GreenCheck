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
  await savePatchToFile(patch, currentBranch);
  const parsedPatch = await parsePatchFromFile(currentBranch);

  console.log(JSON.stringify(parsedPatch, null, 2));

  return parsedPatch;
}