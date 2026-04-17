# Contributing to Cognitive Gym

First off, thank you for considering contributing to Cognitive Gym! It's people like you that make applications like this a reality.

## The Philosophy
Before contributing any design or UI changes, please ensure you have read the "Void Minimalism" philosophy mentioned in the `README.md`. 
Contributions that add "noisy" UI patterns (e.g., bright borders, high-saturation colors without a reason, intrusive pop-ups) generally go against the core aesthetic of the application and will not be merged. 
- Try to use the existing utility classes.
- Use spacing tokens to create 'mental space.'
- Stick to minimal monochromatic transitions and gradients.

## Development Setup

1. Fork the repo and create your branch from `main`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.
4. Make your changes in a new branch.

## Code Style
- This project uses React + TypeScript + Vite.
- Ensure your changes are strictly typed. We avoid `any` wherever possible.
- Use explicit return types for components and custom hooks where it adds clarity.
- We utilize `framer-motion` for animations. Keep animations slow and fluid (ease-in-out transitions, 300ms+ durations).

## State Management
- We intentionally use zero backends. Do not add database integrations.
- All state that needs to survive a refresh must be cleanly persisted into `localStorage` via the `AppContext.tsx`.

## Submitting Pull Requests
- Please ensure `npm run build` evaluates with 0 warnings or errors before pushing.
- Clearly describe your changes in the PR description and exactly how they benefit the underlying goal of cognitive retraining and habit formation.

Thank you!
