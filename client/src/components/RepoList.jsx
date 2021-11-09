import React from 'react';
import types from '../../../types';

/**
 * @param {Object} props
 * @param {types.Repo} props.repo
 * @param {number} props.index
 */
const RepoItem = ({index, repo}) => (
  <tr href={repo.url}>
    <td>#{index}</td>
    <td><a href={repo.url}>{repo.name}</a></td>
    <td>⭐ {repo.stars}</td>
  </tr>
);

/**
 * @param {Object} props
 * @param {types.Repo[]} props.repos
 * @param {number} props.count
 */
const RepoList = ({repos, count}) => (
  <div id='repos'>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>{`Repositories (1-${repos.length} of ${count})`}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {repos.map((repo, i) => <RepoItem repo={repo} index={i + 1} key={i}/>)}
      </tbody>
    </table>
  </div>
);

export default RepoList;
