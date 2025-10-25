# Hospital Socket Server Backend

## 🚀 Overview

This repository contains the **real-time backend server** for the Hospital Patient Input and Staff View system. It is built using **Express.js** and **Socket.io** to facilitate instant, bidirectional communication required for real-time synchronization between the patient and staff interfaces.

This server's primary function is to receive data and status updates from the Patient Form and broadcast them immediately to the Staff View clients.

---

## 🛠️ Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-Time:** Socket.io
- **Development:** Nodemon

---

## ✨ Features

- **Real-Time Data Relay:** Receives patient input data via WebSockets and broadcasts it instantly to staff clients.
- **Status Management:** Handles and relays patient status updates (Active, Submitted).
- **CORS Configuration:** Setup to allow connections from the Next.js frontend application.

---

## 💻 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- A package manager (npm, yarn, or pnpm)

### Installation and Running

1.  **Clone the repository:**

    Bash

    ```
    git clone https://github.com/zawzawmyint/hospital-socket-server.git

    cd hospital-socket-server

    ```

2.  **Install dependencies:**

    Bash

    ```
    npm install

    ```

3.  **Start the development server:**

    Bash

    ```
    npm run dev

    ```

The server will start on the port specified in your environment variables (default: `http://localhost:3001`).

---

## 🌐 Deployed Application

The live application can be accessed here:

https://hospital-socket-server.onrender.com/health

## 🏥 Hospital Frontend Repository

The client application that connects to this server can be found here:

https://github.com/zawzawmyint/hospital-socket-client.git
