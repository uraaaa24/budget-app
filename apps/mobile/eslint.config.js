// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-callback': [
        'error',
        { allowNamedFunctions: false, allowUnboundThis: true },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration',
          message:
            'Use arrow function expressions (const fn = () => {}) instead of function declarations.',
        },
        {
          selector: "VariableDeclarator[init.type='FunctionExpression']",
          message:
            'Use arrow functions instead of function expressions (const fn = function() {}).',
        },
        {
          selector: "AssignmentExpression[right.type='FunctionExpression']",
          message:
            'Use arrow functions instead of function expressions in assignments.',
        },
      ],
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
