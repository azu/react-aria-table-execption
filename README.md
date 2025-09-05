# React Aria Table DOM Exception Reproduction

This repository reproduces a DOM exception error that occurs when using React Aria's Table component with dynamic collections.

- Issue: https://github.com/adobe/react-spectrum/issues/8822
- Demo: https://react-aria-table-execption.vercel.app/


## Issue Description

Used versions:

```
    "react-aria": "3.43.1",
    "react-aria-components": "1.12.1",
```

When rapidly updating data in a Table component with dynamic collections (`<TableBody items={data}>`) using `useTransition`, the following error can occur:

```
Error: Attempted to access node before it was defined.
Check if setProps wasn't called before attempting to access the node.
```

This error originates from React Aria's internal Document.ts file and appears to be related to how dynamic collections handle rapid data updates.

No Issue Versions:

```
    "react-aria": "3.42.0",
    "react-aria-components": "1.11.0",
```

## Setup

```bash
# Install dependencies
npm ci

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

# Run simple refetch test
npm run test:build -- tests/simple-refetch.spec.ts

# Run test 100 times to catch flaky errors
npm run test:build -- tests/simple-refetch.spec.ts --repeat-each=100

# Open Playwright UI for debugging
npm run test:ui

# Debug tests step by step
npm run test:debug
```

## How to Reproduce

1. Open the application in your browser (default: http://localhost:5173)
2. Click the "Refetch Data" button repeatedly
3. The error may occur intermittently when rapidly refetching data

The app generates 50-100 random user records with each refetch, using:
- Random names from predefined lists
- UUID for unique IDs
- Random roles and statuses

## Current Implementation

- Uses `useTransition` to wrap data update operations (this appears to be key to reproducing the issue)
- Visual feedback: Table opacity reduces to 0.5 during pending state  
- Dynamic collections: `<TableBody items={data}>` pattern
- Each row has a unique UUID (`crypto.randomUUID()`) as its key
- Simple state update with `useState` (no external data fetching libraries needed)

## Related Issues

- The error occurs in React Aria's collections Document.ts
- Related to dynamic collections with rapidly changing data wrapped in `useTransition`
- The issue is more likely to occur on slower CPUs or under heavy load
- The combination of `useTransition` + dynamic collections appears to be the trigger

## Technical Details

- React: 19.1.1
- React DOM: 19.1.1
- React Aria: 3.43.1
- React Aria Components: 1.12.1
- TypeScript: 5.7.3
- Vite: 6.0.7

The error happens during React's rendering phase when the Table component with dynamic collections tries to access DOM nodes that have been removed or not yet defined due to rapid data updates wrapped in `useTransition`.
