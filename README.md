# Dispensary System

A React + Vite web app with data stored in the browser's localStorage.

## How to run

1. Make sure you have Node.js (version 18 or later) installed.
2. Open a terminal in this folder and run:

```
npm install
npm run dev
```

3. Open the link shown in the terminal (usually `http://localhost:5173`) in your browser.

## Login (demo accounts)

| Username | Password | Role |
|---|---|---|
| reception | 1234 | Receptionist |
| doctor | 1234 | Doctor |
| pharmacist | 1234 | Pharmacist |
| manager | 1234 | Manager |

Log in as **manager** and go to **Manage users** to register new staff accounts for any role (reception, doctor, pharmacist, manager).

## Project structure

```
src/
  data/
    storage.js   -> Data layer (localStorage). Change this file if you move to a real backend.
    seed.js      -> Demo data set up the first time the app runs.
  components/
    AuthContext.jsx    -> Tracks the logged-in user
    ProtectedRoute.jsx -> Blocks a page without login/correct role
    Layout.jsx          -> Sidebar and overall page layout
  pages/
    Login.jsx, Dashboard.jsx, Patients.jsx, Queue.jsx,
    Pharmacy.jsx, Billing.jsx, Reports.jsx, Users.jsx
```

## Demo walkthrough

1. Log in as **reception** -> Patients -> Register patient (they're added to today's queue automatically).
2. Log out, log in as **doctor** -> Treatment queue -> "Start treatment" -> enter diagnosis and prescription -> "Complete treatment".
3. Log out, log in as **pharmacist** -> Medicines & stock -> see the pending prescription -> "Dispense".
4. Log out, log in as **manager** -> Billing (mark as paid), Reports (daily stats, download CSV), and Manage users (register new staff).

## About data persistence

All data lives in your browser's localStorage. If you clear your browser's site data/cache, the data will be lost. This is a starting point for learning/demo purposes — not intended for production use with multiple concurrent users.

## Kama unaona kosa "does not provide an export named ..."
1. Zima `npm run dev` (Ctrl+C).
2. Hakikisha `src/data/storage.js` ni ile ya ZIP hii (ina `export const Patients`, `Visits`, `Users`, n.k.).
3. Futa cache: `rm -rf node_modules/.vite` kisha `npm run dev`.
4. Kwenye browser bonyeza Ctrl+Shift+R.

## Backend (Spring Boot)
Folda `src/api/` na `.env` viko tayari kwa hatua ya 7. Kwa sasa kurasa bado zinatumia `storage.js` (localStorage).
