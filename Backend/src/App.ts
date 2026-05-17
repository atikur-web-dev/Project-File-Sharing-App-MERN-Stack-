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

// Security Middlewares (নতুন ইম্পোর্ট)
import { 
  generalLimiter, 
  authLimiter, 
  uploadLimiter 
} from "./Middlewares/rateLimit.middleware.ts";
import { 
  securityHeaders, 
  removeSensitiveHeaders 
} from "./Middlewares/security.middleware.ts";

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));


app.use(securityHeaders);
app.use(removeSensitiveHeaders);

// API limit
app.use("/api/v1", generalLimiter);

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4200",
    process.env.APP_URL || "http://localhost:8000",
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ 
    message: "all okay", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});



app.use("/api/v1/auth", authLimiter);
app.use("/api/v1/auth", authRouter);

// File Upload Routes 
app.use("/api/v1/files", (req, res, next) => {
  if (req.method === "POST") {
    uploadLimiter(req, res, next);
  } else {
    next();
  }
});
app.use("/api/v1", fileRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);

export default app;