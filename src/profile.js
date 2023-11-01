'use strict';
import GitHubSDK from './GitHubSDK';

const MAX_REPOS_TO_SHOW = 9;

export async function fetchGitHubData(username, accessToken) {
  try {
    const gh = new GitHubSDK(username, accessToken);
    const userData = await gh.getOwner();
    return userData;
  } catch (error) {
    throw new Error('Error fetching GitHub profile data');
  }
}

export function displayProfileData(data) {
  const user = {
    avatar: data.avatar_url,
    name: data.name,
  };
  const profileElement = document.querySelector('header');
  profileElement.innerHTML = `
  <div class="header__profile-pic-container">
    <img class="header__profile-pic" src="${user.avatar}" alt="User Avatar">
    <p class="header__title">${user.name}</p>
    <p class="header__bio">Wannabe Front-End Developer</p>
    </div>

  `;
}

export async function fetchGitHubRepos(username, accessToken) {
  try {
    const gh = new GitHubSDK(username, accessToken);
    const reposData = await gh.getRepos();
    return reposData;
  } catch (error) {
    throw new Error(
      `Error fetching GitHub repositories data: ${error.message}`
    );
  }
}

export function displayReposData(repos) {
  const reposElement = document.querySelector('.repositories__list');
  let reposHTML = '';

  for (let i = 0; i < MAX_REPOS_TO_SHOW; i++) {
    const repo = repos[i];
    reposHTML += `
      <li class="repositories__item">
      <a href="${repo.html_url}" class="repositories__link" target="_blank"
      > 👉 ${repo.name}</a
      >
      <p class="repositories__language">Main language:</p>
      <p class="repositories__language--display"> ${repo.language}</p>
      </li>
      `;
  }
  reposElement.innerHTML = reposHTML;
}
