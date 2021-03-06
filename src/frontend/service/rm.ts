import octokit from './octokit';

/** 删除文件 */
const rm = async (args: {
  path: string;
  message: string;
  sha: string;
  owner: string;
  repo: string;
}) => {
  const res = await octokit.client.repos.deleteFile(args);
  return res;
};

export default rm;
