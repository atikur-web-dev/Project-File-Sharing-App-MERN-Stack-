import { api } from "./axios";
import type { FileType } from "../types";

export interface FileWithDownloadCount extends FileType {
  downloadCount?: number;
}

export interface DownloadStats {
  totalDownloads: number;
  filesByDownloads: {
    fileName: string;
    downloadCount: number;
    uuid: string;
  }[];
}

// Extracted configuration for maintainability
const MAX_FILES_TO_FETCH = 100;
const TOP_DISPLAY_LIMIT = 10;

export const getDownloadStatsApi = async (): Promise<DownloadStats> => {
  const response = await api.get<{ data: { files: FileWithDownloadCount[] } }>(
    `/files/my?limit=${MAX_FILES_TO_FETCH}`
  );

  // Optional chaining fallback guard against empty backend payloads
  const files = response?.data?.data?.files || [];

  // Clean, modern functional programming approach
  const totalDownloads = files.reduce((sum, file) => sum + (file.downloadCount ?? 0), 0);

  const filesByDownloads = files
    .map((file) => ({
      fileName: file.originalName || "Untitled File", // Fallback for missing names
      downloadCount: file.downloadCount ?? 0,         // Nullish coalescing protection
      uuid: file.uuid,
    }))
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, TOP_DISPLAY_LIMIT);

  return {
    totalDownloads,
    filesByDownloads,
  };
};
