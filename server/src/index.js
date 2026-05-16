import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { onRequest } from "firebase-functions/v2/https";
import portfolioRoutes from "./routes/portfolios.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("tiny"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "portzen-api" });
});

app.use("/api/portfolios", portfolioRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, _req, res, _next) => {
  void _next;
  res.status(error.status || 500).json({ message: error.message || "Internal server error" });
});

export const api = onRequest({ region: "asia-south1" }, app);

if (!process.env.FUNCTIONS_EMULATOR && !process.env.K_SERVICE) {
  app.listen(port, () => {
    console.log(`PortZen API listening on ${port}`);
  });
}
