module.exports = {
  ignorePatterns: ["/node_modules", "/dist"],
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    semi: 2,
    "prettier/prettier": 2,
  },
};
