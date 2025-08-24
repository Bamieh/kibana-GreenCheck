import { MessagesAnnotation, task } from "@langchain/langgraph";
import { getBranchDiff } from "@greenCheck/gh-diff";

export const grabCodeDiff = task(
  {
    name: "grab_code_diff",
    // cachePolicy: { keyFunc: grabKibanaRepoGitSha },
    retry: { maxAttempts: 1, }
  },
  codeDiffTask
);

const kibanaRepoBaseDir = '/Users/bamieh/Bamieh/elastic/kibana';

async function codeDiffTask(state: typeof MessagesAnnotation.State) {
  console.log('state::', state);

  const codeDiff = await getBranchDiff({
    repoBaseDir: kibanaRepoBaseDir,
  });

  console.log('codeDiff::', codeDiff);

  return { codeDiff };
}
