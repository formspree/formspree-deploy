const axios = require('axios');
const { deploy } = require('../src');

jest.mock('axios');

describe('deploy', () => {
  it('should execute a request with args', () => {
    const config = { site: { name: 'My Site' } };

    axios.mockImplementation(params => {
      expect(params.method).toBe('post');
      expect(params.url).toBe('https://api.statickit.com/cli/v1/deployments');
      expect(params.data).toBe(config);
      expect(params.headers['StaticKit-Deploy-Key']).toBe('xxx');
      expect(params.headers['User-Agent']).toBe('my-client');

      return Promise.resolve({});
    });

    return deploy({
      key: 'xxx',
      userAgent: 'my-client',
      config: config
    });
  });

  it('should use a custom endpoint', () => {
    axios.mockImplementation(params => {
      expect(params.url).toBe('https://myendpoint.com/cli/v1/deployments');
      return Promise.resolve({});
    });

    return deploy({
      key: 'xxx',
      userAgent: 'my-client',
      config: {},
      endpoint: 'https://myendpoint.com'
    });
  });

  it('should throw if key is not present', () => {
    try {
      deploy({
        userAgent: 'my-client',
        config: {}
      });
    } catch (e) {
      expect(e.message).toBe('key is required');
    }
  });

  it('should throw if userAgent is not present', () => {
    try {
      deploy({
        key: 'xxx',
        config: {}
      });
    } catch (e) {
      expect(e.message).toBe('userAgent is required');
    }
  });

  it('should throw if config is not present', () => {
    try {
      deploy({
        key: 'xxx',
        userAgent: 'my-client'
      });
    } catch (e) {
      expect(e.message).toBe('config is required');
    }
  });
});
