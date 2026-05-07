// src/hooks/useFileUpload.ts
// এই হুকের কাজ: ফাইল আপলোডের জটিল লজিক আলাদা করে রাখা
// FileUpload কম্পোনেন্ট থেকে স্টেট ম্যানেজমেন্ট আলাদা করতে

import { useState, useCallback } from "react";
import type { FileRejection } from "react-dropzone";
import { FILE_CONFIG } from "../lib/constants";
import { uploadMultipleFilesApi } from "../api/fileApi";
import type { FileUploadResponse } from "../types";

// ============================================================
// ফাইল প্রিভিউ সহ টাইপ
// ============================================================
interface FileWithPreview extends File {
  preview?: string; // ইমেজ ফাইলের প্রিভিউ URL
}

// ============================================================
// useFileUpload হুক
// ============================================================
export function useFileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]); // সিলেক্ট করা ফাইল
  const [isUploading, setIsUploading] = useState(false);     // আপলোড হচ্ছে কিনা
  const [uploadProgress, setUploadProgress] = useState(0);   // প্রোগ্রেস (0-100)
  const [error, setError] = useState<string | null>(null);   // এরর মেসেজ

  // ============================================================
  // ফাইল ড্রপ/সিলেক্ট হ্যান্ডলার
  // ============================================================
  const handleFilesSelected = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      // ভ্যালিডেশন: ফাইল সাইজ চেক
      if (rejectedFiles.length > 0) {
        const sizeRejected = rejectedFiles.filter(
          (r) => r.file.size > FILE_CONFIG.MAX_FILE_SIZE
        );
        if (sizeRejected.length > 0) {
          setError(`File size exceeds ${FILE_CONFIG.MAX_FILE_SIZE_MB}MB limit`);
        } else {
          setError("Invalid file type or too many files");
        }
        return;
      }

      // ভ্যালিডেশন: সর্বোচ্চ ফাইল সংখ্যা
      if (acceptedFiles.length + files.length > FILE_CONFIG.MAX_FILES_PER_UPLOAD) {
        setError(`Maximum ${FILE_CONFIG.MAX_FILES_PER_UPLOAD} files allowed`);
        return;
      }

      // প্রিভিউ URL যোগ করা (ইমেজ ফাইলের জন্য)
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length]
  );

  // ============================================================
  // একটি ফাইল রিমুভ
  // ============================================================
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!); // মেমোরি ফ্রি
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
    setError(null);
  }, []);

  // ============================================================
  // সব ফাইল ক্লিয়ার
  // ============================================================
  const clearAll = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
  }, [files]);

  // ============================================================
  // ফাইল আপলোড হ্যান্ডলার
  // ============================================================
  const uploadFiles = useCallback(async (): Promise<FileUploadResponse[]> => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return [];
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // ফেইক প্রোগ্রেস (ইউজারকে দেখানোর জন্য)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const uploadedFiles = await uploadMultipleFilesApi(files);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // প্রিভিউ URL ক্লিনআপ
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