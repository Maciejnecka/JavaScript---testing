export default class GitHubSDK {
  constructor(owner, secretToken) {
    if (!owner || !secretToken) {
      throw new Error('Owner and SecretToken are required');
    }
    this.owner = owner;
    this.secretToken = secretToken;
    this.url = 'https://api.github.com';
  }
  _createOptions(method = 'GET', body = null) {
    return {
      method,
      credentials: 'same-origin',
      redirect: 'follow',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${this.secretToken}`,
      },
      body: body ? JSON.stringify(body) : null,
    };
  }

  async _fetchData(options, path) {
    try {
      const response = await fetch(`${this.url}${path}`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      if (response.status === 204) return response;
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getOwner() {
    return this._fetchData(this._createOptions(), `/users/${this.owner}`);
  }

  getRepos() {
    return this._fetchData(this._createOptions(), `/users/${this.owner}/repos`);
  }

  getSecretToken() {
    return this.secretToken;
  }

  sendInvitation(repo, collaborator) {
    const options = this._createOptions('PUT', { permission: 'pull' });
    return this._fetchData(
      options,
      `/repos/${this.owner}/${repo}/collaborators/${collaborator}`
    ).then((response) => {
      if (response.status === 204) {
        console.log('Invitation sent successfully');
      }
      return response;
    });
  }

  async removeInvitation(repo, invitationId) {
    const options = this._createOptions('DELETE');
    return this._fetchData(
      options,
      `/repos/${this.owner}/${repo}/invitations/${invitationId}`
    );
  }
}
