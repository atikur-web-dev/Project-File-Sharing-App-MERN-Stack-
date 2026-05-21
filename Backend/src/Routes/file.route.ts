// Backend/src/Routes/file.route.ts
import { Router } from 'express';
import { upload } from '../Middlewares/multer.middleware.ts';
import {
  fileUpload,
  getFileInfo,
  downloadFile,
  viewFile,
  getMyFiles,
  getAllFiles,
} from '../Controller/file.controller.ts';
import {
  authenticate,
  optionalAuthenticate,
  requiredEmailVerification,
} from '../Middlewares/auth.middleware.ts';
const router = Router();

// Specific routes first (no parameters)
router.get('/files/my', authenticate, getMyFiles);
router.get('/files', optionalAuthenticate, getAllFiles);
router.post('/files', authenticate, upload.array('sharedFile', 5), fileUpload);

// Routes with parameters (specific action routes)
router.get('/files/download/:uuid', downloadFile, optionalAuthenticate);
router.get('/files/view/:uuid', viewFile, optionalAuthenticate);

// Dynamic parameter route 
router.get('/files/:uuid', getFileInfo, optionalAuthenticate);

export default router;