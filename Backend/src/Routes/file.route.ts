// src/routes/file.route.ts
// ফাইল সংক্রান্ত সব রুট

import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.ts";
import { fileUpload } from "../Controller/file.controller.ts";

const router = Router();

// ============================================
// POST /api/v1/files (ফাইল আপলোড)
// ============================================
// ⭐⭐⭐ ফ্রন্টএন্ড API কল পয়েন্ট ⭐⭐⭐
// 
// Full URL: http://localhost:8000/api/v1/files
// Method: POST
// Content-Type: multipart/form-data
// Field Name: "sharedFile" (multiple allowed)
// Max Files: 5
// Max Size: 5MB each
// 
// Success Response (201):
// {
//   "success": true,
//   "message": "File uploaded successfully",
//   "data": {
//     "files": {
//       "fileName": "...",
//       "originalName": "...",
//       "size": 12345,
//       "sizeInMB": "0.01 MB",
//       "fileShareUrl": "http://localhost:8000/api/v1/files/uuid",
//       "downloadUrl": "http://localhost:8000/api/v1/files/download/uuid"
//     }
//   }
// }
// 
// ⭐ ফ্রন্টএন্ড: fileShareUrl বা downloadUrl সংরক্ষণ করুন
// ============================================
router.post(
  "/files",
  upload.array("sharedFile", 5), // field name: sharedFile, max 5 files
  fileUpload
);

export default router;