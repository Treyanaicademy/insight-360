/* eslint-env node */

module.exports = {
  env: {
    browser: true, // Browser global variables
    es6: true, // Enables ES6 features
  },
  parser: "@typescript-eslint/parser", // Use the TypeScript ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Latest ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Enable JSX support if using React
    },
  },
  plugins: [
    "@typescript-eslint", // TypeScript linting rules
    "simple-import-sort", // Enforces consistent import sorting
    "import", // Rules related to import/export syntax
  ],
  extends: [
    "eslint:recommended", // Recommended ESLint rules
    "plugin:@typescript-eslint/recommended", // Recommended TypeScript rules
    "plugin:react/recommended", // Recommended React rules
    "prettier", // Integrates Prettier with ESLint
  ],
  rules: {
    // Sort imports by groups
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^react"], // React imports
          ["^@refine"], // Refine imports
          ["^@?\\w"], // Other packages
          ["^"], // External imports
          ["^\\."], // Relative imports
          ["^\\u0000"], // Side effect imports
        ],
      },
    ],
    "simple-import-sort/exports": "error", // Sort export statements
    "import/first": "error", // Ensure all imports appear before other statements
    "import/newline-after-import": "error", // Ensure a newline after imports
    "import/no-duplicates": "error", // Disallow duplicate imports
    "react/react-in-jsx-scope": "off", // Off for React 17+ (React import is not needed)
    "@typescript-eslint/explicit-module-boundary-types": "off", // Optional: Turn off explicit return type requirements
    "@typescript-eslint/no-explicit-any": "warn", // Warn on usage of `any` type (optional)
    "no-console": "warn", // Warn on console statements (optional)
  },
  settings: {
    react: {
      version: "detect", // Automatically detect React version
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Apply specific rules to TypeScript files
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["warn"], // Warn about missing return types
      },
    },
  ],
};
