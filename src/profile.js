'use strict';
import GitHubSDK from './GitHubSDK';

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
  const profileElement = document.getElementById('profile');
  console.log();
  profileElement.innerHTML = `
    <img src="${data.avatar_url}" alt="User Avatar">
    <p>${data.name}</p>
  `;
}
