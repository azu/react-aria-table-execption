# React Aria Table DOM Exception Reproduction

This repository reproduces a DOM exception error that occurs when using React Aria's Table component with dynamic collections and `useSuspenseQuery`.

![](video.webm)

## Issue Description

When rapidly refetching data in a Table component using `useSuspenseQuery` with dynamic collections (`<TableBody items={data}>`), the following error can occur:

```
Error: Attempted to access node before it was defined.
Check if setProps wasn't called before attempting to access the node.
```

This error originates from React Aria's internal Document.ts file and appears to be related to how dynamic collections handle rapid data updates.

## Setup

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

## Running Tests

```bash
# Install Playwright browsers (first time only)
pnpm exec playwright install chromium

# Run tests once
pnpm test

# Run tests with production build
pnpm test:build

# Run simple refetch test
pnpm test:build -- tests/simple-refetch.spec.ts

# Run test 100 times to catch flaky errors
pnpm test:build -- tests/simple-refetch.spec.ts --repeat-each=100

# Open Playwright UI for debugging
pnpm test:ui

# Debug tests step by step
pnpm test:debug
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

- Uses `useTransition` to wrap data refetch operations
- Visual feedback: Table opacity reduces to 0.5 during pending state
- Dynamic collections: `<TableBody items={data}>` pattern
- Each row has a unique UUID as its key

## Related Issues

- The error occurs in React Aria's collections Document.ts
- Related to dynamic collections with rapidly changing data
- The issue is more likely to occur on slower CPUs or under heavy load
- May be triggered when using `useSuspenseQuery` with frequent refetches

## Technical Details

- React: 19.1.1
- React DOM: 19.1.1
- React Aria: 3.43.1
- React Aria Components: 1.12.1
- TanStack Query: 5.62.15
- TypeScript: 5.7.3
- Vite: 6.0.7

The error happens during React's rendering phase when the Table component with dynamic collections tries to access DOM nodes that have been removed or not yet defined due to rapid data updates.
