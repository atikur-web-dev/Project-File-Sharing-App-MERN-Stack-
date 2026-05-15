import { Router } from 'express';
import { upload } from '../Middlewares/multer.middleware.ts';
import {
  fileUpload,
  getFileInfo,
  downloadFile,
  viewFile,
  getMyFiles,
} from '../Controller/file.controller.ts';
import {
  authenticate,
  optionalAuthenticate,
  requiredEmailVerification,
} from '../Middlewares/auth.middleware.ts';
const router = Router();

router.post('/files', authenticate, upload.array('sharedFile', 5), fileUpload);
router.get('/files/:uuid', getFileInfo, optionalAuthenticate);
router.get('/files/download/:uuid', downloadFile, optionalAuthenticate);
router.get('/files/view/:uuid', viewFile, optionalAuthenticate);
router.get('/files/my', authenticate, getMyFiles);

export default router;
