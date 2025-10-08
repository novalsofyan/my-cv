# Welcome to MyCV!

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
pnpm lint
pnpm format
pnpm check
```

## Note!

The current codebase (specifically app.tsx and CV-preview.tsx) was prioritized for a fast release. While the business logic is understood at a surface level, these files currently contain substantial AI-generated code, which introduces technical debt and areas that are less readable. A subsequent, deeper dive into the logic is required, and a comprehensive refactoring effort is highly probable in the future.

---

### ☕ Created with love by Lucid Dreamworks Dev
