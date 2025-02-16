module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
    node: true,
    "cypress/globals": true,
  },
  plugins: [
    "react",
    "prettier",
    "@typescript-eslint",
    "cypress",
    "chai-friendly",
    "no-only-tests",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:chai-friendly/recommended",
    "plugin:cypress/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVErsion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["node_modules"],
  rules: {
    "no-only-tests/no-only-tests": "error",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "react/no-unknown-property": ["error", { ignore: ["global", "jsx"] }],
  },
};
