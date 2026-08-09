# Playwright OrangeHRM Automation Framework

End-to-end automation framework for the OrangeHRM demo application using Playwright, TypeScript, page objects, fixtures, and API validation.

## Setup Instructions

1. Install Node.js `18` or newer.

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Create an environment file under `environment-variables/`.

   Example: `environment-variables/.env.prod`

   ```bash
   ENVIRONMENT='prod'
   TEST_USER_1='Admin'
   TEST_USER_1_PASSWORD='admin123'
   ```

   Environment files are ignored by git. Do not commit credentials, tokens, storage state, or session cookies.

## Framework Structure

```text
.
├── config/
│   ├── env.ts                 # Environment variable accessors
│   ├── environments.ts        # Base URL per environment
│   └── routes.ts              # App route constants
├── environment-variables/     # Local .env files, ignored by git
├── lib/
│   ├── api/                   # API helper classes and response types
│   ├── fixtures/              # Custom Playwright fixtures
│   ├── global/                # Global setup for env/auth directories
│   ├── ui/
│   │   ├── base/              # Base page/component classes
│   │   └── pages/             # Page objects and page components
│   └── utils/                 # Wait helpers, logger, constants
├── test-data/                 # Test data and TypeScript data types
├── tests/
│   ├── auth.setup.ts          # Login setup and storageState generation
│   └── e2e/                   # End-to-end specs
├── playwright.config.ts       # Playwright projects, reporters, browser config
├── package.json               # Scripts and dependencies
└── tsconfig.json              # TypeScript config and path aliases
```

## How To Run Tests

Run Chromium tests with the default environment:

```bash
npm test
```

Run against the prod environment file:

```bash
npm run test:prod
```

Run a specific test file:

```bash
npx playwright test tests/e2e/Test_Login.ts --project=chromium
```

Run in debug mode:

```bash
npm run test:debug
```

Run TypeScript validation:

```bash
npm run tsc
```

Reports and generated artifacts:

- HTML report: `public/`
- JUnit report: `results.xml`
- Allure results: `allure-results/`
- Traces, screenshots, and videos: `test-results/`

These generated outputs are ignored by git.

## Authentication And API Validation

The framework logs into OrangeHRM through the UI and saves Playwright storage state in `playwright/.auth/user1.json`.

API helpers use `context.request`, so API requests share the authenticated browser session cookies. The OrangeHRM employee API helper does not use hardcoded Bearer tokens.

Current employee API endpoint:

```text
/web/index.php/api/v2/pim/employees/{empNumber}?model=detailed
```

The live OrangeHRM demo can be inconsistent because it is a shared public environment. Deleted employee lookups may return `404` or `422`, and logged-out API requests may return `302` or `401`.

## Dependencies Used

Main dependencies:

- `@playwright/test` - browser automation, assertions, API requests, fixtures
- `typescript` - TypeScript support
- `dotenv` and `@dotenvx/dotenvx` - environment variable loading
- `winston` - logging
- `allure-playwright` - Allure test result integration

Development tooling:

- `eslint`
- `prettier`
- `npm-run-all`
- `husky`
- `tsx`
- `@types/node`

## Useful Notes

- Test files follow the `Test_*.ts` naming pattern.
- The setup project runs `tests/auth.setup.ts` before browser projects.
- Browser projects use `playwright/.auth/user1.json` as storage state.
- `test-results/`, `public/`, `allure-results/`, and auth state should not be committed.
