import { api } from "./axios";
import type {
  FileType,
  FileUploadResponse,
  PaginatedFilesResponse,
  FileQueryOptions,
} from "../types";

// Get user files (paginated)
export const getUserFilesApi = async (
  options: FileQueryOptions = {},
): Promise<PaginatedFilesResponse> => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortOrder,
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const res = await api.get<{ data: PaginatedFilesResponse }>(
    `/files/my?${params.toString()}`,
  );

  return res.data.data;
};

// Upload files
export const uploadFilesApi = async (
  files: File[],
): Promise<FileUploadResponse[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("sharedFile", file);
  });

  const res = await api.post<{ data: FileUploadResponse[] }>(
    "/files",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data.data;
};

// Delete file
export const deleteFileApi = async (uuid: string): Promise<void> => {
  await api.delete(`/files/${uuid}`);
};


// Get public file info
export const getPublicFileInfoApi = async (
  uuid: string,
): Promise<FileType> => {
  const res = await api.get<{ data: FileType }>(`/files/${uuid}`);
  return res.data.data;
};


// File URLs (no API call)
export const getFileDownloadUrl = (uuid: string): string =>
  `${(import.meta as any).env.VITE_API_BASE_URL}/files/download/${uuid}`;

export const getFileViewUrl = (uuid: string): string =>
  `${(import.meta as any).env.VITE_API_BASE_URL}/files/view/${uuid}`;