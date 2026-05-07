import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// all className merge
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Relative time calculator
export function formatRelativetime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Function for date format
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "datetime" | "time" = "short",
): string {
  const d = new Date(date);

  const formats = {
    short: { month: "short", day: "numeric", year: "numeric" } as const,
    long: { month: "long", day: "numeric", year: "numeric" } as const,
    datetime: {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    } as const,
    time: { hour: "2-digit", minute: "2-digit" } as const,
  };

  return d.toLocaleDateString("en-US", formats[format]);
}

// Make the string small and add ... at the end
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  if (length <= 3) return "...";

  return str.slice(0, length - 3) + "...";
}

// Generate color based on Name
export function stringToColor(str: string): string {
  let hash = 0;

  for (const char of str) {
    hash = char.charCodeAt(0) + hash * 31;
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 70%, 50%)`;
}

// Function to get initial name form First letter of name for Default avatar
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);

  if (!parts[0]) return "";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0].at(0)! + parts.at(-1)!.at(0)!).toUpperCase();
};

// copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard API failed:", err);
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");

    document.body.removeChild(textarea);

    return success;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}

// Debounce (Search optimization)
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  (debounced as typeof debounced & { cancel: () => void }).cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced as typeof debounced & { cancel: () => void };
}

// File type Check
export const isImage = (mime: string): boolean => mime.startsWith("image/");

export const isPDF = (mime: string): boolean => mime === "application/pdf";

// File icon type
export function getFileIconType(mime: string): string {
  const map: [RegExp, string][] = [
    [/^image\//, "image"],
    [/pdf/, "pdf"],
    [/word|document/, "document"],
    [/excel|spreadsheet/, "spreadsheet"],
    [/powerpoint|presentation/, "presentation"],
    [/^text\//, "text"],
    [/^video\//, "video"],
    [/^audio\//, "audio"],
    [/zip|compressed/, "archive"],
  ];

  const match = map.find(([regex]) => regex.test(mime));
  return match ? match[1] : "file";
}

// Sleep (delay helper)
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Random ID generator
export const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
};
