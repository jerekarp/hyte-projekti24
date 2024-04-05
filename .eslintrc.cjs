module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': 'google',
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'linebreak-style': 0,
    'indent': ['warn', 2],
    'new-cap': ['error', {capIsNewExceptions: 'Router'}],
  },
};
