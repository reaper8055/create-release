import * as core from '@actions/core';
import * as github from '@actions/github';

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined;
}

async function run() {
  try {
    const token = core.getInput('repo-token');
    const tagName = core.getInput('tag-name');
    const releaseName = core.getInput('release-name');
    const releaseBody = core.getInput('release-body');

    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;

    const response = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      name: releaseName,
      body: releaseBody,
    });

    core.setOutput('release-url', response.data.html_url);
  } catch (error) {
    if (isError(error)) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unknown error occurred");
    }
  }
}

run();

