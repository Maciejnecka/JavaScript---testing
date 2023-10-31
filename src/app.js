'use strict';
import GitHubSDK from './GitHubSDK.js';
import { secretToken } from './secretToken.js';

import './css/style.css';
import { displayProfileData, fetchGitHubData } from './profile.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const userData = await fetchGitHubData('Maciejnecka', secretToken);
    displayProfileData(userData);
    const gh = new GitHubSDK('Maciejnecka', secretToken);

    const gh2 = new GitHubSDK('Maciejnecka', secretToken);
    gh2.sendInvitation('task-js-basics', 'bogolubow');
    console.log(gh2);
  } catch (error) {
    console.error(error);
  }
}
