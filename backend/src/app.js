import express from "express";
import cors from "cors";
import appointmentsRouter from "./routes/appointments.js";

const app = express();

// CORS: browsers block requests from :5173 to :3001 unless the server allows that origin
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

// Parses incoming JSON request bodies into req.body
app.use(express.json());

// Healthcheck endpoint for quick verification and Docker health probes (Stage 12)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Domain REST routes (matches tw.json resource "appointments")
app.use("/appointments", appointmentsRouter);

// Unknown route catch-all (404)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error handler (Express 5 forwards async errors here automatically;
// 4 parameters are required so Express recognizes it as an error middleware)
app.use((err, req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message
  });
});

export default app;
