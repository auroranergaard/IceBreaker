# IceBreaker

## What is this?

IceBreaker is a web application designed to facilitate interactive and engaging games. It leverages Firebase for backend services and React with TypeScript for the frontend. The application allows users to navigate through various games, view game details, and interact with the platform.

## Tech stack

- **Frontend:**
  - React
  - TypeScript
  - Vite
  - Mantine (UI components)
  - React Router (for routing)

- **Backend:**
  - Firebase
    - Firestore (database)
    - Firebase Auth (authentication)
    - Firebase Realtime Database

## Getting started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/icebreaker.git
    cd icebreaker
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up Firebase:**

    - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - Copy your Firebase configuration and replace the existing configuration in [`src/Firebase/firebase.tsx`](src/Firebase/firebase.tsx).

4. **Run the application:**

    ```sh
    npm run dev
    ```

### Additional Documentation

- For routing details, refer to [`Routing.md`](/public/Documentation/Routing.md).
- For emulator setup, refer to [`Emulator.md`](/public/Documentation/Emulator.md)