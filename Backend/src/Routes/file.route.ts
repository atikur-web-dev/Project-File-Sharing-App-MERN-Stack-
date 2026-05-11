import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.ts";
import {
  fileUpload,
  getFileInfo,
  downloadFile,
  viewFile,
} from "../Controller/file.controller.ts";
const router = Router();

router.post("/files", upload.array("sharedFile", 5), fileUpload);
router.get("/files/:uuid", getFileInfo);
router.get("/files/download/:uuid", downloadFile);
router.get("/files/view/:uuid", viewFile);

export default router;
