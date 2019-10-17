const axios = require('axios');

const readConfigFromFile = file => {
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

const parseConfig = rawConfig => {
  return JSON.parse(rawConfig);
};

const getRawConfig = args => {
  if (args.config) return args.config;
  return readConfigFromFile(args.file);
};

const getDeployKey = args => {
  if (args.key) return args.key;
  return process.env.STATICKIT_DEPLOY_KEY;
};

const deploy = args => {
  const { userAgent, key, config } = args;
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

module.exports = { getDeployKey, getRawConfig, parseConfig, deploy };
