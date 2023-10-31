'use strict';
import GitHubSDK from './GitHubSDK.js';
import { secretToken } from './secretToken.js';

import './css/style.css';

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('./src/index.js');
  const gh = new GitHubSDK('Maciejnecka', secretToken);
  console.log(gh);

  const gh2 = new GitHubSDK('Maciejnecka', secretToken);
  gh2.sendInvitation('task-js-basics', 'bogolubow');
  console.log(gh2);
}
