# IntelliEV 🚑⚡
**Next-Gen Emergency Response & EV Management System**

IntelliEV is a dual-interface platform designed to bridge the gap between Electric Vehicle (EV) users and Emergency Response teams. It leverages real-time data, AI-driven analysis, and smart mapping to ensure safety on the roads and rapid response during critical incidents.

---

## 🌟 Overview

Imagine a system where your car detects an accident and instantly notifies the nearest ambulance, while simultaneously creating a "Green Corridor" for emergency vehicles. That's IntelliEV.

We provide two distinct experiences:
1.  **For EV Users:** A smart dashboard for navigation, hazard reporting, and community alerts.
2.  **For Emergency Responders:** A command center to track fleet status, receive SOS alerts, and dispatch units efficiently using AI suggestions.

---

## 🚀 Key Features

### 🚗 EV User Dashboard
*   **Live Map Navigation:** Locate charging stations, view traffic signals, and see nearby EVs.
*   **Smart Hazard Reporting:** Report accidents or road hazards. Our AI analyzes the severity automatically.
*   **One-Touch SOS:** Trigger an emergency alert manually or let the system detect high-impact events.
*   **Community Feed:** Real-time updates on road conditions from other users.

### 🚨 Emergency Responder Dashboard
*   **Real-Time Incident Tracking:** See SOS alerts pop up instantly on the map with severity levels.
*   **AI Dispatch Logic:** The system suggests the *best* ambulance based on proximity and incident severity.
*   **Fleet Management:** Track ambulance locations and status (Available, En-route, Busy).
*   **Green Corridor Simulation:** Visualize routes for emergency vehicles.
*   **Simulation Tools:** Built-in tools to simulate SOS calls and ambulance movements for testing.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js (Vite)
*   **Styling:** Tailwind CSS
*   **Maps:** Leaflet & React-Leaflet
*   **Backend / Database:** Firebase (Authentication, Firestore, Realtime Database)
*   **Routing:** Leaflet Routing Machine

---

## 💻 Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/IntelliEV-react.git
    cd intelliEV-react
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    *   Ensure you have `src/services/firebase.js` configured with your Firebase credentials.
    *   Enable **Authentication** (Email/Password).
    *   Enable **Firestore Database** and **Realtime Database**.

4.  **Run the Application**
    ```bash
    npm run dev
    ```

5.  **Accessing the Dashboards**
    *   **EV User:** Sign up normally via the Login page.
    *   **Emergency Responder:** Requires an account with `userType: 'emergency'` in the Firestore `users` collection.

---

## 📸 Project Structure

*   `src/pages/`: Main views (`Dashboard.jsx`, `EmergencyDashboard.jsx`, `Login.jsx`).
*   `src/components/`: Reusable UI components (`Card`, `Button`) and Map logic (`MapComponent`, `EmergencyMapComponent`).
*   `src/services/`: Firebase configuration and API handling.
*   `src/contexts/`: Global state management (AuthContext).

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
 │ Node Microservice  │  (Vercel Serverless Function)
 │ "Incident Orchestrator"  
 │ - Assign responder  
 │ - Process SOS  
 │ - Log analytics   
 └─────────────────────┘
```

---

*Built with ❤️ for safer roads and smarter cities.*

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
