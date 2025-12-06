# IntelliEV

**IntelliEV** is a real-time emergency response system for Electric Vehicles that automatically detects accidents, calculates severity, and dispatches the nearest emergency responder without human intervention.

## Live Demo

🚀 **Live App:** [https://intelli-ev-ts-realtime.vercel.app](https://intelli-ev-ts-realtime.vercel.app)

> **Note:** This demo requires two different browser sessions to simulate the workflow:
> 1. **User Role:** To trigger SOS alerts.
> 2. **Emergency Role:** To receive and view dispatched alerts.

<!-- TODO: Add demo credentials here for easy testing -->

## Core Features

*   **Real-time SOS Triggering:** Manual or automated accident detection simulation.
*   **Intelligent Severity Engine:** Server-side calculation of accident severity (0-100 score) based on vehicle telemetry.
*   **Automated Dispatch:** Instantly assigns the nearest available responder using geospatial distance calculation.
*   **Live Tracking:** Real-time map visualization of SOS events and responder locations.
*   **Role-Based Access:** Distinct dashboards for EV Drivers and Emergency Responders.
*   **Auto-Recovery:** Automatic state reset for responders upon incident resolution.

## System Architecture

IntelliEV uses a serverless event-driven architecture. The React frontend communicates directly with Firestore for real-time data syncing, while Firebase Cloud Functions handle business logic, severity computation, and responder assignment in the background.


```text
                      ┌──────────────────────┐
                      │      Vercel Frontend │
                      │    (React + TS)      │
                      └──────────┬───────────┘
                                 │
                        HTTPS / REST / Webhook
                                 │
         ┌───────────────────────┴───────────────────────┐
         │                                               │
┌──────────────────────┐                    ┌─────────────────────────┐
│ Firebase Firestore   │  <-- realtime -->  │ Firebase Realtime DB    │
│ Firebase Auth        │                    └─────────────────────────┘
└──────────┬───────────┘
           │  triggers
           │
 ┌─────────▼──────────┐
 │ Node Microservice  │  (Firebase Cloud(GCP) Serverless Function)
 │ "Incident Orchestrator"  
 │ - Assign responder  
 │ - Process SOS  
 │ - Log analytics   
 └─────────────────────┘
```

<!-- TODO: Add architecture diagram here -->
<!-- 
[EV Client] -> [Firestore] -> [Cloud Functions] -> [Firestore] -> [Emergency Dashboard]
-->

## Cloud Backend Intelligence

The backend logic is isolated in TypeScript Cloud Functions to ensure security and reliability.

### A. Severity Engine
*   **Trigger:** `onCreate` on `sos_alerts/{id}`
*   **Logic:** Analyzes vehicle telemetry (`g_force`, `airbags_deployed`, `delta_v`, `rollover_detected`).
*   **Output:** Computes a `severity` object with a numeric score (0-100) and classification (`low`, `moderate`, `high`, `critical`).

### B. Nearest Responder Dispatch
*   **Trigger:** `onUpdate` on `sos_alerts/{id}` (specifically when severity becomes `high` or `critical`).
*   **Logic:** Queries available responders, calculates Haversine distance to the accident, and selects the nearest unit.
*   **Output:** Updates the SOS document with `assignedResponder` details and marks the responder as `busy`.

### C. Auto-Reset Workflow
*   **Trigger:** `onUpdate` on `sos_alerts/{id}` (when status changes to `resolved`).
*   **Logic:** Identifies the assigned responder and releases them from the current task.
*   **Output:** Sets responder status back to `available` and timestamps the resolution.

## Data Models

Key TypeScript interfaces used across the application:

```typescript
export interface Severity {
  score: number;
  level: "low" | "moderate" | "high" | "critical";
  computedAt?: any; // Firestore Timestamp
}

export interface AssignedResponder {
  uid: string;
  name: string;
  distanceKm: number;
}

export interface SosAlert {
  id: string;
  lat: number;
  lng: number;
  timestamp?: any;
  triggerMethod?: string;
  vehicleData?: Record<string, any>;
  severity?: Severity;
  assignedResponder?: AssignedResponder | null;
  status?: string;
}
```

## Frontend Architecture

*   **Framework:** React 19 + TypeScript + Vite
*   **State Management:** Real-time Firestore listeners (`onSnapshot`)
*   **Maps:** React Leaflet with custom pulse animations for severity visualization
*   **Styling:** Tailwind CSS for responsive, modern UI

<!-- TODO: Add SOS list screenshot -->
<!-- TODO: Add responder dashboard screenshot -->
<!-- TODO: Add map view GIF -->

## Firestore Structure

*   `sos_alerts`: Stores all accident events, telemetry, and assignment status.
*   `users`: Stores user profiles, roles (`user` vs `emergency`), and real-time location/status.

## Realtime Data Flow

1.  **Event:** EV detects crash -> Writes to `sos_alerts`.
2.  **Compute:** Cloud Function calculates severity -> Updates `sos_alerts`.
3.  **Dispatch:** Cloud Function finds nearest responder -> Updates `sos_alerts` & `users`.
4.  **Notify:** Emergency Dashboard listener receives update -> Highlights map marker & triggers alert.
5.  **Resolve:** Responder marks complete -> Cloud Function resets state.

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/modi-meet/IntelliEV-TS-Realtime.git
    cd IntelliEV-TS-Realtime
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    cd functions && npm install
    ```

3.  **Start Backend Emulators:**
    ```bash
    cd functions
    npm run serve
    ```

4.  **Start Frontend:**
    ```bash
    # In a new terminal
    npm run dev
    ```

## Deployments

*   **Frontend:** Deployed on Vercel (Auto-builds from `main` branch).
*   **Backend:** Firebase Cloud Functions.

<!-- TODO: Add deployment commands: firebase deploy --only functions -->

## Roadmap

*   [ ] Integration with TensorFlow.js for camera-based accident verification.
*   [ ] Mobile app version for responders (React Native).
*   [ ] Voice-activated SOS triggering.
*   [ ] Historical data analytics dashboard.

## License

MIT
