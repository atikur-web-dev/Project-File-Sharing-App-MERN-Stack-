// src/hooks/useCopyToClipboard.ts
// এই হুকের কাজ: টেক্সট ক্লিপবোর্ডে কপি করা

import { useState } from "react";
import { copyToClipboard } from "../lib/utils";

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    const success = await copyToClipboard(text);
    setIsCopied(success);
    if (success) {
      setTimeout(() => setIsCopied(false), 2000);
    }
    return success;
  };

  return { isCopied, copy };
}