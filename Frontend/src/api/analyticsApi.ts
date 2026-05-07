// Frontend/src/api/analyticsApi.ts
// src/api/analyticsApi.ts
// এই ফাইলের কাজ: অ্যানালিটিক্স সম্পর্কিত API কলের ফাংশন
// ইউজারের ফাইল থেকে ডাউনলোড স্ট্যাটিসটিক্স ক্যালকুলেট করে

import {api} from "./axios";
import type { FileType } from "../types";

// ============================================================
// ফাইল ডাউনলোড তথ্য সহ টাইপ
// ============================================================
interface FileWithDownloadCount extends FileType {
  downloadCount?: number;
}

// ============================================================
// ডাউনলোড স্ট্যাটিসটিক্স টাইপ
// ============================================================
export interface DownloadStats {
  totalDownloads: number;  // মোট ডাউনলোড
  filesByDownloads: {      // ফাইল অনুযায়ী ডাউনলোড
    fileName: string;      // ফাইলের নাম
    downloadCount: number; // কতবার ডাউনলোড হয়েছে
    uuid: string;          // ফাইলের ইউনিক আইডি
  }[];
}

// ============================================================
// GET /api/v1/files/my?limit=100 (সব ফাইল থেকে অ্যানালিটিক্স)
// ============================================================
export const getDownloadStatsApi = async (): Promise<DownloadStats> => {
  // সব ফাইল একবারে এনে ডাউনলোড কাউন্ট ক্যালকুলেট
  const response = await api.get<{ data: { files: FileWithDownloadCount[] } }>(
    "/files/my?limit=100"
  );

  const files = response.data.data.files;

  // মোট ডাউনলোড ক্যালকুলেট
  const totalDownloads = files.reduce((sum, file) => {
    return sum + (file.downloadCount || 0);
  }, 0);

  // ডাউনলোড অনুযায়ী সাজানো টপ ১০ ফাইল
  const filesByDownloads = files
    .map((file) => ({
      fileName: file.originalName,
      downloadCount: file.downloadCount || 0,
      uuid: file.uuid,
    }))
    .sort((a, b) => b.downloadCount - a.downloadCount) // বেশি ডাউনলোড আগে
    .slice(0, 10); // প্রথম ১০টা

  return {
    totalDownloads,
    filesByDownloads,
  };
};