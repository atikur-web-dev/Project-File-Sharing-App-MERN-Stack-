// src/types/index.ts

export interface User {
  _id: string;                    
  displayName: string;            
  email: string;                  
  emailVerification: Date | null; 
  createdAt?: string;             
  updatedAt?: string;            
}

// File type => File Data will come following this format from DB
export interface FileType {
  fileName: string;       
  originalName: string;  
  size: number;           
  sizeInMB: string;       
  mimetype: string;       
  uuid: string;           
  fileShareUrl: string;   
  downloadUrl: string;    
  viewUrl?: string;       
  uploadedAt: string;     
  uploadedBy?: string;    
  downloadCount?: number; 
}

// File Upload Response Type => after uploading a file, Backend will send following this type
export interface FileUploadResponse {
  fileName: string;       // সার্ভারে সংরক্ষিত ফাইলের নাম
  originalName: string;   // ইউজারের দেওয়া আসল নাম
  size: number;           // ফাইলের সাইজ (বাইটে)
  sizeInMB: string;       // MB ফরম্যাটে সাইজ
  mimetype: string;       // ফাইলের টাইপ
  uuid: string;           // ইউনিক পাবলিক আইডি
  fileShareUrl: string;   // শেয়ার করার URL
  downloadUrl: string;    // ডাউনলোড URL
  uploadedBy?: string;    // কে আপলোড করেছে
}

// ============================================================
// পেজিনেশন মেটাডাটা টাইপ (পেজিনেশনের তথ্য)
// ============================================================
export interface PaginationMeta {
  currentPage: number;  // বর্তমান পেজ নম্বর (1, 2, 3...)
  totalPages: number;   // মোট কত পেজ আছে
  totalFiles: number;   // মোট কত ফাইল আছে
  limit: number;        // প্রতি পেজে কতগুলো ফাইল দেখাচ্ছে
  hasNextPage: boolean; // পরবর্তী পেজ আছে কিনা
  hasPrevPage: boolean; // আগের পেজ আছে কিনা
}

// ============================================================
// পেজিনেটেড ফাইল রেসপন্স টাইপ (ফাইল লিস্ট + পেজিনেশন তথ্য)
// ============================================================
export interface PaginatedFilesResponse {
  files: FileType[];           // ফাইলের অ্যারে
  pagination: PaginationMeta;  // পেজিনেশন মেটাডাটা
}

// ============================================================
// API রেসপন্স টাইপ (ব্যাকএন্ডের সব রেসপন্স এই ফরম্যাটে আসে)
// ============================================================
export interface ApiResponse<T = unknown> {
  statusCode: number;  // HTTP স্ট্যাটাস কোড (200, 201, 400, 401...)
  success: boolean;    // রিকোয়েস্ট সফল হয়েছে কিনা
  message: string;     // সার্ভারের মেসেজ
  data?: T;            // আসল ডাটা (optional, T হলো Generic Type - যেকোনো টাইপ হতে পারে)
}

// ============================================================
// API এরর রেসপন্স টাইপ (এরর হলে ব্যাকএন্ড যা পাঠায়)
// ============================================================
export interface ApiErrorResponse {
  success: false;                      // এরর হলে success সবসময় false
  message: string;                     // এরর মেসেজ
  errors?: Record<string, string[]>;   // ফিল্ড ভিত্তিক এরর (যেমন: { email: ["ইমেইল ভুল"] })
  stack?: string;                      // স্ট্যাক ট্রেস (শুধু ডেভেলপমেন্টে)
}

// ============================================================
// রেজিস্টার ফর্ম ডাটা টাইপ (রেজিস্টার ফর্মের ইনপুট)
// ============================================================
export interface RegisterFormData {
  displayName: string;  // ইউজারের প্রদর্শিত নাম
  email: string;        // ইমেইল অ্যাড্রেস
  password: string;     // পাসওয়ার্ড
}

// ============================================================
// লগইন ফর্ম ডাটা টাইপ (লগইন ফর্মের ইনপুট)
// ============================================================
export interface LoginFormData {
  email: string;     // ইমেইল অ্যাড্রেস
  password: string;  // পাসওয়ার্ড
}

// ============================================================
// প্রোফাইল আপডেট ডাটা টাইপ (প্রোফাইল আপডেটের ইনপুট)
// ============================================================
export interface UpdateProfileData {
  displayName: string;  // নতুন প্রদর্শিত নাম
}

// ============================================================
// পাসওয়ার্ড পরিবর্তন ডাটা টাইপ
// ============================================================
export interface ChangePasswordData {
  currentPassword: string;  // বর্তমান পাসওয়ার্ড
  newPassword: string;      // নতুন পাসওয়ার্ড
}

// ============================================================
// ডাউনলোড স্ট্যাটিসটিক্স টাইপ (অ্যানালিটিক্সের জন্য)
// ============================================================
export interface DownloadStats {
  totalDownloads: number;  // মোট ডাউনলোড সংখ্যা
  filesByDownloads: {      // ফাইল অনুযায়ী ডাউনলোডের তালিকা
    fileName: string;      // ফাইলের নাম
    downloadCount: number; // কতবার ডাউনলোড হয়েছে
    uuid: string;          // ফাইলের ইউনিক আইডি
  }[];
}

// ============================================================
// ফাইল কুয়েরি অপশন টাইপ (ফাইল সার্চ/ফিল্টারের জন্য)
// ============================================================
export interface FileQueryOptions {
  page?: number;                                   // কোন পেজ (optional, ডিফল্ট 1)
  limit?: number;                                  // প্রতি পেজে কতগুলো (optional, ডিফল্ট 10)
  search?: string;                                 // সার্চ টার্ম (optional)
  sortBy?: "createdAt" | "size" | "fileName";      // কী দিয়ে সর্ট (optional)
  sortOrder?: "asc" | "desc";                     // asc = ছোট থেকে বড়, desc = বড় থেকে ছোট (optional)
}