// src/app.ts
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRouter from "./Routes/auth.route.ts";
import fileRouter from "./Routes/file.route.ts"; 

// Error Handler
import { errorHandler } from "./Middlewares/errorHandler.ts";

const app = express();

// ============================================
// Middlewares
// ============================================
app.use(helmet()); // সিকিউরিটি হেডার যোগ করে
app.use(cors({
  origin: "http://localhost:3000", // ফ্রন্টএন্ড URL (React/Vite)
  credentials: true, // কুকি পাঠানোর অনুমতি
}));
app.use(express.json()); // JSON বডি পার্স
app.use(express.urlencoded({ extended: true })); // Form Data পার্স
app.use(cookieParser()); // কুকি পার্স
app.use(express.static("public")); // Static ফাইল সার্ভ

// ============================================
// Health Check Route
// ============================================
app.get("/health", (_req: Request, res: Response) => {
  res.json({ message: "all okay", timestamp: new Date().toISOString() });
});

// ============================================
// API Routes
// ============================================
// সব API রুট /api/v1/ দিয়ে শুরু হবে
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", fileRouter);

// ============================================
// 404 Handler - কোনো রুট না মিললে
// ============================================
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================
// Global Error Handler (সবচেয়ে নিচে)
// ============================================
app.use(errorHandler);

export default app;