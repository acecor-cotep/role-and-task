module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
    'eslint-plugin-node',
  ],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  parserOptions: {
    "ecmaVersion": 2020
  },

  rules: {
    // https://eslint.org/docs/rules/comma-dangle
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "always-multiline",
    }],

    // https://eslint.org/docs/rules/block-scoped-var#top
    "block-scoped-var": 2,

    // https://eslint.org/docs/rules/object-curly-spacing#top
    "curly": 2,

    // https://eslint.org/docs/rules/dot-notation#top
    "dot-notation": ["error", { "allowKeywords": true }],

    // https://eslint.org/docs/rules/no-return-await#top
    "no-return-await": 2,

    // https://eslint.org/docs/rules/no-shadow
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": [] }],

    // https://eslint.org/docs/rules/array-bracket-newline
    "array-bracket-newline": ["error", {
      "multiline": true,
      "minItems": 1,
    }],

    // https://eslint.org/docs/rules/array-bracket-spacing
    "array-bracket-spacing": 2,

    // https://eslint.org/docs/rules/block-spacing
    "block-spacing": 2,

    // https://eslint.org/docs/rules/computed-property-spacing
    "computed-property-spacing": ["error", "never"],

    // https://eslint.org/docs/rules/function-paren-newline
    "function-paren-newline": ["error", "consistent"],

    // https://eslint.org/docs/rules/key-spacing
    "key-spacing": ["error", {
      "beforeColon": false,
      "afterColon": true,
      "mode": "strict",
    }],

    // https://eslint.org/docs/rules/keyword-spacing
    "keyword-spacing": ["error", {
      "before": true,
      "after": true,
    }],

    // https://eslint.org/docs/rules/lines-around-comment
    "lines-around-comment": ["error", {
      "beforeBlockComment": true,
      "allowBlockStart": true,
      "allowObjectStart": true,
      "allowArrayStart": true,
    }],

    // https://eslint.org/docs/rules/lines-between-class-members
    "lines-between-class-members": 2,

    // https://eslint.org/docs/rules/max-params
    "max-params": ["error", {
      "max": 3,
    }],

    // https://eslint.org/docs/rules/newline-per-chained-call
    "newline-per-chained-call": ["error", {
      "ignoreChainWithDepth": 2,
    }],

    // https://eslint.org/docs/rules/no-continue
    "no-continue": ["error"],

    // https://eslint.org/docs/rules/no-inline-comments
    "no-inline-comments": ["error"],

    // https://eslint.org/docs/rules/no-multi-assign
    "no-multi-assign": ["error"],

    // https://eslint.org/docs/rules/no-multiple-empty-lines
    "no-multiple-empty-lines": ["error"],

    // https://eslint.org/docs/rules/no-plusplus
    "no-plusplus": ["error"],

    // https://eslint.org/docs/rules/no-underscore-dangle
    "no-underscore-dangle": ["error", {
      "allow": ["_id", "_i", "_doc"],
    }],

    // https://eslint.org/docs/rules/no-whitespace-before-property
    "no-whitespace-before-property": ["error"],

    // https://eslint.org/docs/rules/object-curly-newline
    "object-curly-newline": 2,

    // https://eslint.org/docs/rules/prefer-object-spread
    "prefer-object-spread": ["error"],

    // https://eslint.org/docs/rules/arrow-spacing
    "arrow-spacing": ["error", {
      "before": true,
      "after": true,
    }],

    // https://eslint.org/docs/rules/no-confusing-arrow
    "no-confusing-arrow": ["error", {
      "allowParens": true,
    }],

    // https://eslint.org/docs/rules/no-useless-constructor
    "no-useless-constructor": ["error"],

    // https://eslint.org/docs/rules/no-var
    "no-var": ["error"],

    // https://eslint.org/docs/rules/object-shorthand
    "object-shorthand": 2,

    // https://eslint.org/docs/rules/prefer-template
    "prefer-template": ["error"],
  },

  env: {
    es6: true,
    browser: true,
    node: true,
  },

  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },

  globals: {
    "global": false,
    "Promise": false,
  },
};

