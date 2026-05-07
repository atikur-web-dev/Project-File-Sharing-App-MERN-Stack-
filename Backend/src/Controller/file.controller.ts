// src/controllers/file.controller.ts
// ফাইল আপলোড কন্ট্রোলার

import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../Utils/errors/httpErrors.ts";
import { CreatedResponse } from "../Utils/success/httpSuccess.ts";
import { config } from "../Config/config.ts";
import {
  singleFileUploadService,
  multipleFileUploadService,
  type FileUploadResponse,
} from "../Services/fileUpload.service.ts";

// ============================================
// File Upload Controller
// ============================================
/**
 * ফাইল আপলোড কন্ট্রোলার
 * 
 * ⭐⭐⭐ ফ্রন্টএন্ড সংযোগ পয়েন্ট ⭐⭐⭐
 * 
 * ফ্রন্টএন্ড থেকে API কল:
 * ```javascript
 * const formData = new FormData();
 * formData.append('sharedFile', fileInput.files[0]); // সিঙ্গেল
 * // অথবা একাধিক ফাইল:
 * for (let file of fileInput.files) {
 *   formData.append('sharedFile', file);
 * }
 * 
 * const response = await fetch('http://localhost:8000/api/v1/files', {
 *   method: 'POST',
 *   credentials: 'include', // অথেনটিকেশন থাকলে
 *   body: formData // Content-Type অটোমেটিক multipart/form-data হবে
 * });
 * 
 * const data = await response.json();
 * // data.data.fileShareUrl - এই URL দিয়ে ফাইল শেয়ার/ডাউনলোড করা যাবে
 * ```
 * 
 * ফ্রন্টএন্ড টিমের জন্য নোট:
 * - Endpoint: POST /api/v1/files
 * - Content-Type: multipart/form-data (ব্রাউজার অটো সেট করবে)
 * - Field Name: "sharedFile" (একই নামে একাধিক ফাইল পাঠানো যাবে)
 * - Max Files: 5 (একবারে)
 * - Max Size: 5MB per file
 * - Response: fileShareUrl পাবেন (যেমন: /files/550e8400-e29b-41d4-a716-446655440000)
 */
export const fileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ============================================
    // Multer থেকে ফাইল পাওয়া
    // ============================================
    // upload.array() মিডলওয়্যার req.files এ ফাইলের অ্যারে রাখে
    const files = req.files as Express.Multer.File[];

    // ফাইল চেক
    if (!files || files.length === 0) {
      throw new ValidationError({}, "Please select at least one file to upload.");
    }

    // ============================================
    // ফাইল প্রসেসিং (সিঙ্গেল বা মাল্টিপল)
    // ============================================
    let uploadResult: FileUploadResponse | FileUploadResponse[];

    if (files.length === 1) {
      // সিঙ্গেল ফাইল
      uploadResult = await singleFileUploadService(files[0]);
    } else {
      // মাল্টিপল ফাইল
      uploadResult = await multipleFileUploadService(files);
    }

    // ============================================
    // রেসপন্স ফরম্যাটিং
    // ============================================
    // ফ্রন্টএন্ডের জন্য সম্পূর্ণ URL তৈরি
    const formatResponse = (file: FileUploadResponse) => ({
      fileName: file.fileName,
      originalName: file.originalName,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + " MB", // হিউম্যান রিডেবল
      mimetype: file.mimetype,
      uuid: file.uuid,
      // ⭐ ফ্রন্টএন্ড: এই URL দিয়ে ফাইল অ্যাক্সেস করবে
      fileShareUrl: `${config.APP_URL}/api/v1${file.fileShareUrl}`,
      downloadUrl: `${config.APP_URL}/api/v1/files/download/${file.uuid}`,
    });

    const responseData = Array.isArray(uploadResult)
      ? uploadResult.map(formatResponse)
      : formatResponse(uploadResult);

    // ============================================
    // সফল রেসপন্স
    // ============================================
    const message = Array.isArray(uploadResult)
      ? `${uploadResult.length} files uploaded successfully`
      : "File uploaded successfully";

    res
      .status(201)
      .json(new CreatedResponse({ files: responseData }, message));

  } catch (error) {
    next(error);
  }
};