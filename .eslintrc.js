module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    "no-empty-pattern": 0,
    "no-useless-escape": 0,
    "prefer-promise-reject-errors": 0,
    "no-throw-literal": 0,
    "array-bracket-spacing": [ 2, "always" ],
    "no-trailing-spaces": 0,
    "camelcase": [ 0, "" ],
    "no-console": 1,
    "yoda": [ 0, "never" ],
    "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
