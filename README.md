# React Aria Table DOM Exception Reproduction

This repository reproduces a DOM exception error that occurs when using React Aria's Table component with Modal and `useSuspenseQuery`.

## Issue Description

When closing a Modal and immediately triggering a refetch on a Table component using `useSuspenseQuery`, the following error occurs:

```
Error: Attempted to access node before it was defined.
Check if setProps wasn't called before attempting to access the node.
```

This error originates from React Aria's internal Document.ts file and appears to be a race condition when updating the Table's DOM while the Modal is closing.

## Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Running Tests

```bash
# Install Playwright browsers (first time only)
npm exec playwright install chromium

# Run tests once
npm test

# Run tests with production build
npm run test:build

# Run tests 100 times to catch flaky errors
npm run test:repeat

# Run tests 100 times with production build
npm run test:build:repeat

# Open Playwright UI for debugging
npm run test:ui

# Debug tests step by step
npm run test:debug
```

## How to Reproduce

1. Open the application in your browser (default: http://localhost:5173)
2. Click the "Open Modal" button
3. In the modal, click "Close & Refetch (Immediate)"
4. The error should occur intermittently (race condition)

## Workaround

The modal provides two close buttons:

- **"Close & Refetch (Immediate)"**: Closes the modal and immediately refetches data (triggers the bug)
- **"Close & Refetch (Delayed)"**: Closes the modal and refetches after a 100ms delay (workaround)

## Related Issues

- The error occurs in React Aria's collections Document.ts
- Seems to be specific to the combination of Modal + Table + useSuspenseQuery refetch
- The issue is more likely to occur on slower CPUs or under heavy load

## Technical Details

- React: 19.1.1
- React DOM: 19.1.1
- React Aria: 3.43.1
- React Aria Components: 1.12.1
- TanStack Query: 5.62.15
- TypeScript: 5.7.3
- Vite: 6.0.7

The error happens during React's rendering phase when the Table component tries to access DOM nodes that have been removed or not yet defined due to the simultaneous Modal closing and data refetch.
