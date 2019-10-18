const axios = require('axios');
const { request, getRawConfig, getDeployKey } = require('../src');

jest.mock('axios');

jest.mock('process', () => ({
  env: {
    STATICKIT_DEPLOY_KEY: 'yyy'
  }
}));

jest.mock('fs');

describe('request', () => {
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

    return request({
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

    return request({
      key: 'xxx',
      userAgent: 'my-client',
      config: {},
      endpoint: 'https://myendpoint.com'
    });
  });

  it('should throw if key is not present', () => {
    try {
      request({
        userAgent: 'my-client',
        config: {}
      });
    } catch (e) {
      expect(e.message).toBe('key is required');
    }
  });

  it('should throw if userAgent is not present', () => {
    try {
      request({
        key: 'xxx',
        config: {}
      });
    } catch (e) {
      expect(e.message).toBe('userAgent is required');
    }
  });

  it('should throw if config is not present', () => {
    try {
      request({
        key: 'xxx',
        userAgent: 'my-client'
      });
    } catch (e) {
      expect(e.message).toBe('config is required');
    }
  });
});

describe('getRawConfig', () => {
  it('should return the `config` arg if present', () => {
    expect(getRawConfig({ config: '{}' })).toBe('{}');
  });

  it('should return null if there is no config file', () => {
    expect(getRawConfig({})).toBe(null);
  });

  it('should return the contents of the config file', () => {
    require('fs').__setMockFiles({
      'statickit.json': '{}'
    });

    expect(getRawConfig({})).toBe('{}');
  });

  it('should return the contents of the config file path given', () => {
    require('fs').__setMockFiles({
      'statickit-custom.json': '{}'
    });

    expect(getRawConfig({ file: 'statickit-custom.json' })).toBe('{}');
  });
});

describe('getDeployKey', () => {
  it('should return the `key` arg if present', () => {
    expect(getDeployKey({ key: 'xxx' })).toBe('xxx');
  });

  it('should return the key from env', () => {
    expect(getDeployKey({})).toBe('yyy');
  });
});
