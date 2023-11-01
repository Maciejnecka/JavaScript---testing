'use strict';
import './css/style.css';
import GitHubSDK from './GitHubSDK.js';
import { secretToken } from './secretToken.js';

import {
  fetchGitHubData,
  displayProfileData,
  fetchGitHubRepos,
  displayReposData,
} from './profile.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    updateCopyrightYear();
    const userData = await fetchGitHubData('Maciejnecka', secretToken);
    displayProfileData(userData);
    const reposData = await fetchGitHubRepos('Maciejnecka', secretToken);
    displayReposData(reposData);
    const gh = new GitHubSDK('Maciejnecka', secretToken);
    gh.sendInvitation('task-js-basics', 'bogolubow');
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}

function updateCopyrightYear() {
  const currentYearElement = document.getElementById('currentYear');
  const currentYear = new Date().getFullYear();
  currentYearElement.textContent = currentYear;
}
