const axios = require('axios');
const fs = require('fs');
const env = require('process').env;

/**
 * Fetches the raw configuration provided via args or from the config file.
 *
 * @param {object} args
 * @returns {string}
 */
const getRawConfig = args => {
  if (args.config) return args.config;
  const file = args.file || 'statickit.json';

  try {
    return fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    } else {
      throw err;
    }
  }
};

/**
 * Fetches the deploy key from the given args or from environment variables.
 *
 * @param {object} args
 * @returns {string}
 */
const getDeployKey = args => {
  if (args.key) return args.key;
  return env.STATICKIT_DEPLOY_KEY;
};

/**
 * Executes a deployment.
 *
 * @param {object} args
 * @returns {Promise}
 */
const request = args => {
  const { userAgent, key, config } = args;

  if (!userAgent) throw new Error('userAgent is required');
  if (!key) throw new Error('key is required');
  if (!config) throw new Error('config is required');

  const endpoint = args.endpoint || 'https://api.statickit.com';

  return axios({
    method: 'post',
    url: `${endpoint}/cli/v1/deployments`,
    data: config,
    headers: {
      'StaticKit-Deploy-Key': key,
      'User-Agent': userAgent
    },
    validateStatus: status => status < 500
  });
};

module.exports = { getDeployKey, getRawConfig, request };
