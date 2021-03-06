import octokit from './octokit';

/** 创建或更新文件 */
const createOrUpdate = async ({
  path,
  content,
  message,
  sha,
  owner,
  repo,
}: {
  path: string;
  content: string;
  message: string;
  sha?: string;
  owner: string;
  repo: string;
}) => {
  const res = await octokit.client.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    content,
    message,
    sha,
  });
  return res;
};

export default createOrUpdate;
