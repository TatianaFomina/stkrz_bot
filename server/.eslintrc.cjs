module.exports = {
  'extends': [
    'codex/ts',
  ],
  'rules': {
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
