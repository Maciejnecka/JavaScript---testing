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
});
