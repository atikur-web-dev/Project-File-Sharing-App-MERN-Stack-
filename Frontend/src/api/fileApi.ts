// Frontend/src/api/fileApi.ts
// src/api/fileApi.ts
// এই ফাইলের কাজ: ফাইল সম্পর্কিত সব API কলের ফাংশন
// তোমার আসল backend/routes/file.route.ts এর সাথে সরাসরি কানেক্ট করে

import {api} from "./axios";
import type {
  FileType,
  FileUploadResponse,
  PaginatedFilesResponse,
  FileQueryOptions,
} from "../types";

// ============================================================
// GET /api/v1/files/my (নিজের ফাইল লিস্ট - পেজিনেশন সহ)
// ============================================================
export const getUserFilesApi = async (
  options: FileQueryOptions = {}
): Promise<PaginatedFilesResponse> => {
  // ডিফল্ট ভ্যালু সেট করা
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  // URL প্যারামিটার বানানো
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  params.append("sortBy", sortBy);
  params.append("sortOrder", sortOrder);
  if (search.trim()) {
    params.append("search", search.trim());
  }

  // API কল: GET /files/my?page=1&limit=10&sortBy=createdAt&sortOrder=desc
  const response = await api.get<{ data: PaginatedFilesResponse }>(
    `/files/my?${params.toString()}`
  );
  return response.data.data;
};

// ============================================================
// POST /api/v1/files (ফাইল আপলোড)
// ============================================================
export const uploadMultipleFilesApi = async (
  files: File[]
): Promise<FileUploadResponse[]> => {
  // FormData তৈরি (multipart/form-data)
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("sharedFile", file); // তোমার ব্যাকএন্ডের field name: "sharedFile"
  });

  // API কল: POST /files
  const response = await api.post<{ data: FileUploadResponse[] }>(
    "/files",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }, // ফাইল আপলোডের জন্য
    }
  );

  return response.data.data;
};

// ============================================================
// DELETE /api/v1/files/:uuid (ফাইল ডিলিট)
// ============================================================
export const deleteFileApi = async (uuid: string): Promise<void> => {
  await api.delete(`/files/${uuid}`);
};

// ============================================================
// GET /api/v1/files/:uuid (পাবলিক ফাইলের তথ্য)
// ============================================================
export const getPublicFileInfoApi = async (uuid: string): Promise<FileType> => {
  const response = await api.get<{ data: FileType }>(`/files/${uuid}`);
  return response.data.data;
};

// ============================================================
// ফাইল ডাউনলোড URL জেনারেটর
// ============================================================
export const getFileDownloadUrl = (uuid: string): string => {
  // সরাসরি ব্যাকএন্ডের ডাউনলোড URL
  return `${import.meta.env.VITE_API_BASE_URL}/files/download/${uuid}`;
};

// ============================================================
// ফাইল প্রিভিউ URL জেনারেটর
// ============================================================
export const getFileViewUrl = (uuid: string): string => {
  // সরাসরি ব্যাকএন্ডের ভিউ URL
  return `${import.meta.env.VITE_API_BASE_URL}/files/view/${uuid}`;
};