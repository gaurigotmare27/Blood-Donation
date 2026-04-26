# 🩸 LIFEBLOOD — Modern Blood Donation Management System

LifeBlood is a high-fidelity, full-stack web application designed to bridge the gap between donors and those in urgent need of blood. Built with a focus on speed, reliability, and a premium user experience, LifeBlood leverages modern web technologies to provide real-time updates and interactive mapping.

![LifeBlood Preview](https://img.shields.io/badge/UI-Crystal_Glassmorphism-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## ✨ Key Features

-   **📊 Real-time Analytics**: Interactive dashboards featuring Chart.js to visualize donation trends and blood group distributions.
-   **🚨 Emergency Broadcast**: A dedicated "Network" view for urgent blood requests with multi-level urgency indicators.
-   **📍 Interactive Live Map**: Integration with OpenStreetMap and Leaflet to locate nearby hospitals and blood donation centers in real-time.
-   **👤 Donor Portals**: Seamless registration and profile management for life-savers, including eligibility status tracking.
-   **💎 Premium Aesthetic**: A modern "Crystal Glassmorphism" UI with smooth transitions, linear gradients, and a mobile-responsive layout.

---

## 🛠️ Technology Stack

### Frontend
-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Mapping**: [Leaflet.js](https://leafletjs.com/)
-   **Charts**: [Chart.js](https://www.chartjs.org/)
-   **Styling**: Vanilla CSS (Custom Glassmorphism Design System)

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: SQLite3 (Local Persistent Storage)
-   **API**: RESTful architecture

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v16+ recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/gaurigotmare27/Blood-Donation.git
    cd Blood-Donation
    ```

2.  **Setup Backend**
    ```bash
    npm install
    npm run dev
    ```
    *The server will start on `http://localhost:3005`*

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *The frontend will start on `http://localhost:5173`*

---

## 📂 Project Structure

```text
├── config/             # Database configuration
├── controllers/        # Request handling logic
├── frontend/           # React frontend application
│   ├── src/            # Components and App logic
│   └── public/         # Static assets and CSS
├── models/             # Database schemas (SQLite)
├── routes/             # API endpoint definitions
├── server.js           # Main Express server entry point
└── blood_donation.db   # SQLite database file
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/donors` | Fetch all registered donors |
| `GET` | `/api/blood-requests/active` | Get live emergency requests |
| `POST` | `/api/donors` | Register a new donor |
| `POST` | `/api/blood-requests` | Broadcast a new emergency |

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*“Every drop counts. Every donor is a hero.”*
