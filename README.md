# Cognitive Gym

A doom-scroll detox web application that trains attention span, decision-making, and focus while delivering micro-learning. 

Built with the design philosophy of **"Void Minimalism"** – creating a digital sanctuary away from the high-entropy nature of modern applications.

## Philosophy
Cognitive Gym operates as a "warm-up" for deep work, not merely a punishment for scrolling. It weaponizes mechanics of habit formation (variable rewards, friction reduction, immediate feedback) to build attention span and reduce decision fatigue. It relies heavily on intentional asymmetry, tonal depth, and negative space to create a calm, premium atmosphere.

## Core Features

- **The Void Dashboard:** A minimalist hub tracking your successful detox metrics ("feet saved" from doom-scrolling) and your daily streak.
- **The Calibration Ritual (PVT):** A non-skippable psychomotor vigilance task (PVT) to retrain sustained visual focus and counter the 1.2-second attention switching caused by short-form content. Requires reacting within a strict 2000ms window to a subtle visual pulse.
- **Mode Selection:**
  - **Free Mode:** An open-ended focus session counting up, allowing you to anchor your attention as long as needed.
  - **Task Mode:** A structured commitment acting as a countdown timer for a specific duration (5-30m) coupled with a randomized cognitive diversion task. Plays a dual-frequency soft chime upon completion.
- **Visual Crutch Overlay:** Generates monochromatic noise resolving slowly over 10 seconds to fade into pure black, tricking the visual cortex into relaxing accommodation smoothly.
- **Forced Encounter Learning:** Surfaces non-repeating, high-retention knowledge and philosophical quotes during focus sessions. Designed to avoid repeating quotes within rolling 24-hour windows.
- **Dichotomy Shaker:** A post-session forced binary choice (WATER/STONE) leading to a concrete micro-task. Counteracts decision fatigue and trains action bias.
- **Privacy First Engine:** Zero server transmission. All progress, streaks, and quote rotational data are stored exclusively and securely within your local browser storage. No analytic tracking.

## Technology Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (configured for the exact Void Minimalism tokens)
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **State Management:** React Context (persisted to LocalStorage)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/ThatWasShiva/Focus-Builder.git
   cd Focus-Builder
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Data Safety Architecture
All user data (`streakCount`, `totalFeetSaved`, `lastCalibrationDate`, `usedQuotes`) is entirely maintained in the browser via `localStorage`. Clearing browser data will reset progress. There is intentionally no backend infrastructure to ensure complete conceptual digital privacy.

## License
MIT License
