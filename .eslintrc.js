module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'sourceType': 'module',
    },
    'rules': {
        'quotes': ['error', 'single'],
        // we want to force semicolons
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        // we want to avoid extraneous spaces
        'no-multi-spaces': ['error']
    },
    'parser': '@typescript-eslint/parser',
};