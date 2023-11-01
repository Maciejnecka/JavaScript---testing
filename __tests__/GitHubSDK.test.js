'use strict';
import GitHubSDK from '../src/GitHubSDK';
import { secretToken } from '../src/secretToken';

global.fetch = jest.fn(() => {
  Promise.resolve({
    ok: false,
    status: 404,
  });
});

describe('GitHubSDK', () => {
  const gitHubSDK = new GitHubSDK('testOwner', 'testSecretToken');

  it('Should create a GitHubSDK instance with owner and secretToken', () => {
    expect(gitHubSDK.owner).toBe('testOwner');
    expect(gitHubSDK.secretToken).toBe('testSecretToken');
  });

  it('Should throw an error when owner or secretToken is missing', () => {
    expect(() => new GitHubSDK()).toThrow('Owner and SecretToken are required');
  });

  it('Should return the secretToken', () => {
    const secretToken = gitHubSDK.getSecretToken();
    expect(secretToken).toBe('testSecretToken');
  });

  it('should throw exception when Owner is incorrect', () => {
    function createWrongUserData() {
      new GitHubSDK('', secretToken);
    }
    expect(createWrongUserData).toThrow('Owner and SecretToken are required');
  });

  describe('Request Options', () => {
    it('Should create valid options for GET request', () => {
      const options = gitHubSDK._createOptions('GET');
      expect(options.method).toBe('GET');
      expect(options.headers).toHaveProperty(
        'Accept',
        'application/vnd.github.v3+json'
      );
      expect(options.headers).toHaveProperty(
        'Authorization',
        'token testSecretToken'
      );
      expect(options.body).toBeNull();
    });

    it('Should create valid options for POST request', () => {
      const data = { key: 'value' };
      const options = gitHubSDK._createOptions('POST', data);
      expect(options.method).toBe('POST');
      expect(options.headers).toHaveProperty(
        'Accept',
        'application/vnd.github.v3+json'
      );
      expect(options.headers).toHaveProperty(
        'Authorization',
        'token testSecretToken'
      );
      expect(options.body).toBe(JSON.stringify(data));
    });
  });

  describe('Request Errors', () => {
    it('Should throw an error on failed request', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
        })
      );
      try {
        await gitHubSDK.getOwner();
      } catch (error) {
        expect(error.message).toBe('Request failed with status: 403');
      }
    });

    it('Should throw an error on network request failure', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.reject(new Error('Network error'))
      );
      try {
        await gitHubSDK.getOwner();
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    it('Should handle unauthorized access with a 401 status code', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
        })
      );
      try {
        await gitHubSDK.getOwner();
      } catch (error) {
        expect(error.message).toBe('Request failed with status: 401');
      }
    });
  });

  describe('Collaborator Invitations', () => {
    it('Should send a collaborator invitation succesfully', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 204,
        })
      );
      const response = await gitHubSDK.sendInvitation(
        'testRepo',
        'testCollaborator'
      );
      expect(response.status).toBe(204);
    });

    it('Should remove a collaborator invitation successfully', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 204,
        })
      );
      const response = await gitHubSDK.removeInvitation(
        'testRepo',
        'testInvitationId'
      );
      expect(response.status).toBe(204);
    });

    it('Should handle a successful PUT request to send a collaborator invitation', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 204,
        })
      );
      const originalConsoleLog = console.log;
      console.log = jest.fn();
      const response = await gitHubSDK.sendInvitation(
        'testRepo',
        'testCollaborator'
      );
      expect(response.status).toBe(204);
      expect(console.log).toHaveBeenCalledWith('Invitation sent successfully');
      console.log = originalConsoleLog;
    });

    it('Should handle a successful DELETE request to remove a collaborator invitation', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 204,
        })
      );

      const response = await gitHubSDK.removeInvitation(
        'testRepo',
        'testInvitationId'
      );
      expect(response.status).toBe(204);
    });
  });

  describe('Different Scenarios', () => {
    it('Should handle empty or null owner and secretToken', () => {
      expect(() => new GitHubSDK('', '')).toThrow(
        'Owner and SecretToken are required'
      );
      expect(() => new GitHubSDK(null, null)).toThrow(
        'Owner and SecretToken are required'
      );
    });

    it('Should handle different authorization tokens', () => {
      const anotherGitHubSDK = new GitHubSDK('testOwner', 'anotherToken');
      expect(anotherGitHubSDK.getSecretToken()).toBe('anotherToken');
    });

    it('Should handle different GitHub API endpoints', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ example: 'response' }),
        })
      );
      const customResponse = await gitHubSDK._fetchData(
        gitHubSDK._createOptions(),
        '/custom/endpoint'
      );
      expect(customResponse.example).toBe('response');
    });
  });

  describe('Data Requests', () => {
    it('Should handle a succesful GET request for repositories', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ name: 'Repo1' }, { name: 'Repo2' }]),
        })
      );
      const repos = await gitHubSDK.getRepos();
      expect(repos).toHaveLength(2);
      expect(repos[0].name).toBe('Repo1');
      expect(repos[1].name).toBe('Repo2');
    });

    it('Should handle a successful GET request for user data', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ name: 'TestUser' }),
        })
      );
      const userData = await gitHubSDK.getOwner();
      expect(userData.name).toBe('TestUser');
    });
  });
});
