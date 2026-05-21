// Frontend/src/api/analyticsApi.ts
import { api } from "./axios";
import type { FileType } from "../types";

// ============================
// Types
// ============================
export interface DownloadStats {
  totalDownloads: number;
  topFiles: {
    fileName: string;
    downloadCount: number;
    uuid: string;
  }[];
}

export interface AnalyticsOverview {
  totalFiles: number;
  totalDownloads: number;
  recentUploads: FileType[];
}

// ============================
// Download Statistics
// ============================
export const getDownloadStatsApi = async (): Promise<DownloadStats> => {
  const res = await api.get<{ data: DownloadStats }>("/analytics/downloads");
  return res.data.data;
};

// ============================
// Analytics Overview (Dashboard)
// ============================
export const getAnalyticsOverviewApi = async (): Promise<AnalyticsOverview> => {
  const res = await api.get<{ data: AnalyticsOverview }>("/analytics/overview");
  return res.data.data;
};

// ============================
// Top Files
// ============================
export const getTopFilesApi = async (
  limit: number = 10,
): Promise<FileType[]> => {
  const res = await api.get<{ data: FileType[] }>(
    `/analytics/top-files?limit=${limit}`,
  );

  return res.data.data;
};

// ============================
// User Activity Analytics
// ============================
export const getUserActivityApi = async (): Promise<{
  uploads: number;
  downloads: number;
}> => {
  const res = await api.get<{
    data: { uploads: number; downloads: number };
  }>("/analytics/activity");

  return res.data.data;
};