module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: "./tsconfig.json"
  },
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parserOptions: {
    "project": "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": 0,
    "semi": 2
  }
};