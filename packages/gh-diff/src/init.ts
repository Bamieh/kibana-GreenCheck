import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';

export const initSimpleGit = ({ repoBaseDir }: { repoBaseDir: string }) => {
  const options: Partial<SimpleGitOptions> = {
    baseDir: repoBaseDir,
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
 };

 const git: SimpleGit = simpleGit(options);
 return git;
}
