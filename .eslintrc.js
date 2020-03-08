module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['prettier', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',

    '@typescript-eslint/explicit-function-return-type': ['error'],

    '@typescript-eslint/interface-name-prefix': ['error', 'always'],

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: true, classes: true },
    ],

    /*
    Prettier formats all multi-line arrays to be in-line. Currently, the only workaround is to use `// prettier-ignore`
    which "will exclude the next node in the abstract syntax tree from formatting." Please use this when appropriate :)
    */
    'array-element-newline': ['error', 'always'],

    // note you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    'array-element-newline': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.ts', '**/mocks/**/*.ts'],
      rules: {
        // Test specs shouldn't need to define explicit return types within
        // the tests as it adds unnecessary overhead
        '@typescript-eslint/explicit-function-return-type': 'off',

        // Don't allow `.only` or `.disabled` in tests to ever hit the codebase.
        // They're great for debugging, but thats it.
        'jest/no-focused-tests': 'error',
        'jest/no-disabled-tests': 'warn',
      },
    },
  ],
};
