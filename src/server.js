import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://hospital-socket-client.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

// Store connected clients and their data
const connectedClients = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  connectedClients.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    type: "unknown", // 'patient' or 'staff'
  });

  // Patient identifies themselves
  socket.on("patient_connected", (patientData) => {
    connectedClients.set(socket.id, {
      ...connectedClients.get(socket.id),
      type: "patient",
      patientData: patientData,
    });
    console.log("Patient registered:", socket.id);

    // Notify all staff about new patient
    socket.broadcast.emit("patient_connected", {
      patientId: socket.id,
      ...patientData,
    });
  });

  // Staff identifies themselves
  socket.on("staff_connected", () => {
    connectedClients.set(socket.id, {
      ...connectedClients.get(socket.id),
      type: "staff",
    });
    console.log("Staff registered:", socket.id);
  });

  // Handle real-time form updates
  socket.on("form_update", (data) => {
    const client = connectedClients.get(socket.id);

    if (client && client.type === "patient") {
      console.log("Form update from patient:", data);

      // Broadcast to all staff members
      socket.broadcast.emit("form_updated", {
        patientId: socket.id,
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle patient form submission
  socket.on("form_submitted", (formData) => {
    console.log("Form submitted by patient:", socket.id);

    // Broadcast submission to all staff
    socket.broadcast.emit("form_submitted", {
      patientId: socket.id,
      formData: formData,
      submittedAt: new Date().toISOString(),
    });
  });

  // Handle typing indicators
  socket.on("typing_start", (field) => {
    const client = connectedClients.get(socket.id);
    if (client && client.type === "patient") {
      socket.broadcast.emit("patient_typing", {
        patientId: socket.id,
        field: field,
        isTyping: true,
      });
    }
  });

  socket.on("typing_stop", (field) => {
    const client = connectedClients.get(socket.id);
    if (client && client.type === "patient") {
      socket.broadcast.emit("patient_typing", {
        patientId: socket.id,
        field: field,
        isTyping: false,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const client = connectedClients.get(socket.id);
    console.log("Client disconnected:", socket.id, client?.type);

    // Notify staff if a patient disconnects
    if (client && client.type === "patient") {
      socket.broadcast.emit("patient_disconnected", {
        patientId: socket.id,
      });
    }

    connectedClients.delete(socket.id);
    console.log("Remaining clients:", connectedClients.size);
  });

  // Health check endpoint
  socket.on("ping", (callback) => {
    if (typeof callback === "function") {
      callback({ status: "pong", timestamp: new Date().toISOString() });
    }
  });
});

// HTTP health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    connectedClients: connectedClients.size,
    timestamp: new Date().toISOString(),
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
