// src/middlewares/multer.middleware.ts
// ফাইল আপলোড হ্যান্ডেল করার জন্য Multer কনফিগারেশন

import multer from "multer";
import path from "path";
import fs from "fs";

// ============================================
// আপলোড ডিরেক্টরি সেটআপ
// ============================================
// process.cwd() = প্রজেক্টের রুট ডিরেক্টরি
// আমরা src/tmp/my-uploads ফোল্ডারে ফাইল সংরক্ষণ করবো
const uploadDirectory = path.resolve(process.cwd(), "src", "tmp", "my-uploads");

// ফোল্ডার না থাকলে তৈরি করে নিচ্ছি
// recursive: true = প্যারেন্ট ফোল্ডারও তৈরি হবে যদি না থাকে
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log(`✅ Upload directory created: ${uploadDirectory}`);
}

// ============================================
// Multer Storage কনফিগারেশন
// ============================================
// diskStorage = ফাইল ডিস্কে সংরক্ষণ করবে
const storage = multer.diskStorage({
  
  // destination: ফাইল কোথায় সংরক্ষণ হবে
  destination: function (_req, _file, cb) {
    // cb = callback function (error, destination)
    cb(null, uploadDirectory);
  },
  
  // filename: ফাইলের নাম কী হবে
  filename: function (_req, file, cb) {
    // ইউনিক ফাইলনেম জেনারেট করছি
    // ফরম্যাট: fieldname-TIMESTAMP-RANDOM.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    
    // আসল ফাইলের এক্সটেনশন বের করছি
    const fileExtension = path.extname(file.originalname);
    
    // নতুন ফাইলনেম তৈরি
    // উদাহরণ: sharedFile-1702656000000-123456789.jpg
    const newFileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    
    cb(null, newFileName);
  },
});

// ============================================
// ফাইল ফিল্টার (অপশনাল)
// ============================================
// শুধু নির্দিষ্ট টাইপের ফাইল অনুমোদন করতে
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // অনুমোদিত MIME টাইপ
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    // ফাইল অনুমোদিত
    cb(null, true);
  } else {
    // ফাইল অনুমোদিত না
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// ============================================
// Multer ইনস্ট্যান্স তৈরি
// ============================================
export const upload = multer({
  storage: storage,               // স্টোরেজ কনফিগ
  limits: {
    fileSize: 5 * 1024 * 1024,    // 5MB লিমিট
  },
  fileFilter: fileFilter,         // ফাইল ফিল্টার
});