module.exports = {
  root: true,
  extends: [
    'standard-with-typescript',
    'plugin:vue/vue3-recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './tsconfig.eslint.json',
    ],
    ecmaVersion: 2022,
    extraFileExtensions: ['.vue'],
  },
  rules: {
    /** Prefer semicolons */
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      },
    ],

    /** Require trailing comma for better git diffs */
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],

    /** Do not allow spaces before function parenthesis */
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
    }],

    /** Allow and enforce `... as Foo` type assertion */
    '@typescript-eslint/consistent-type-assertions': ['error', {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'allow',
    }],

    /**
     * Do not enforce nullish coalescing,
     * so you can use `valueA || valueB`
     */
    '@typescript-eslint/prefer-nullish-coalescing': 'off',

    /** Temporarily allow empty interfaces, while in active development */
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * Use TS rule to highlight unused variables.
     * Default one does not recognize enums
     */
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',

    /**
     * Specify an order of top-level tags in vue single-file components
     * https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/component-tags-order.md
     * https://vuejs.org/v2/style-guide/#Single-file-component-top-level-element-order-recommended
     */
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style'],
    }],

    /** Allow single-word component names */
    'vue/multi-word-component-names': 'off',

    /** Require just one line break after opening and before closing block tags */
    'vue/block-tag-newline': ['error', {
      singleline: 'always',
      multiline: 'always',
      maxEmptyLines: 0,
      blocks: {
        template: {
          singleline: 'always',
          multiline: 'always',
          maxEmptyLines: 1,
        },
      },
    }],
    '@typescript-eslint/restrict-plus-operands': 'off',
  },
};
