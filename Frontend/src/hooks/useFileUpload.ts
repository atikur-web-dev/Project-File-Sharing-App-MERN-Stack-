// src/hooks/useFileUpload.ts
// Purpose of this hook: Keep all file upload logic separate
// Helps separate state management from the FileUpload component

import { useState, useCallback } from "react";
import type { FileRejection } from "react-dropzone";
import { FILE_CONFIG } from "../lib/constants";
import { uploadMultipleFilesApi } from "../api/fileApi";
import type { FileUploadResponse } from "../types";

// File type with preview support
interface FileWithPreview extends File {
  preview?: string; // Preview URL for image files
}

// useFileUpload hook
export function useFileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]); // Selected files
  const [isUploading, setIsUploading] = useState(false); // Upload status
  const [uploadProgress, setUploadProgress] = useState(0); // Progress (0-100)
  const [error, setError] = useState<string | null>(null); // Error message

  // File drop/select handler
  const handleFilesSelected = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      // Validation: Check file size
      if (rejectedFiles.length > 0) {
        const sizeRejected = rejectedFiles.filter(
          (r) => r.file.size > FILE_CONFIG.MAX_FILE_SIZE,
        );
        if (sizeRejected.length > 0) {
          setError(`File size exceeds ${FILE_CONFIG.MAX_FILE_SIZE_MB}MB limit`);
        } else {
          setError("Invalid file type or too many files");
        }
        return;
      }

      // Validation: Maximum file count
      if (
        acceptedFiles.length + files.length >
        FILE_CONFIG.MAX_FILES_PER_UPLOAD
      ) {
        setError(`Maximum ${FILE_CONFIG.MAX_FILES_PER_UPLOAD} files allowed`);
        return;
      }

      // Add preview URLs (for image files)
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        }),
      );

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length],
  );

  // ============================================================
  // Remove a single file
  // ============================================================
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!); // Free memory
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
    setError(null);
  }, []);

  // ============================================================
  // Clear all files
  // ============================================================
  const clearAll = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
  }, [files]);

  // ============================================================
  // File upload handler
  // ============================================================
  const uploadFiles = useCallback(async (): Promise<FileUploadResponse[]> => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return [];
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Fake progress (for better user experience)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const uploadedFiles = await uploadMultipleFilesApi(files);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Cleanup preview URLs
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });

      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

      return uploadedFiles;
    } catch (err) {
      clearInterval(progressInterval);
      const error = err instanceof Error ? err : new Error("Upload failed");
      setError(error.message);
      setIsUploading(false);
      setUploadProgress(0);
      return [];
    }
  }, [files]);

  return {
    files,
    isUploading,
    uploadProgress,
    error,
    handleFilesSelected,
    removeFile,
    clearAll,
    uploadFiles,
    setError,
  };
}
