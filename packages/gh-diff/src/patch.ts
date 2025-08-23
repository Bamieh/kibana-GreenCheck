import parseGitPatch from 'parse-git-patch'
import * as fs from 'fs/promises'
import { SimpleGit } from 'simple-git';
import * as path from 'path';

const patchBaseDir = path.join(process.cwd(), 'patches');

const ensurePatchBaseDir = async () => {
  await fs.mkdir(patchBaseDir, { recursive: true });
}

export const savePatchToFile = async (patch: string, branchName: string) => {
  await ensurePatchBaseDir();
  const patchFilePath = path.join(patchBaseDir, `${branchName}.patch`);
  await fs.writeFile(patchFilePath, patch, 'utf8');
}

export const getPatchFromRepo = async (git: SimpleGit) => {
  const { current: currentBranch, } = await git.status();
  const patch = await git.diff(['main']);
  return { patch, currentBranch, };
}

export const parsePatchFromFile = async (branchName: string) => {
  const patchFilePath = path.join(patchBaseDir, `${branchName}.patch`);
  const patch = await fs.readFile(patchFilePath, 'utf8');

  const parsedPatch = parseGitPatch(patch);
  return parsedPatch;
}