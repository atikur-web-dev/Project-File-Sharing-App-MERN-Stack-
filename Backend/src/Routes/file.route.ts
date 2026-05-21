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
  deleteFile,
} from '../Controller/file.controller.ts';
import {
  authenticate,
  optionalAuthenticate,
  requiredEmailVerification,
} from '../Middlewares/auth.middleware.ts';
const router = Router();

// 1. Specific static routes 
router.get('/files/my', authenticate, getMyFiles);
router.get('/files', optionalAuthenticate, getAllFiles);

// 2. Upload
router.post('/files', authenticate, upload.array('sharedFile', 5), fileUpload);

// 3. Action routes 
router.get('/files/download/:uuid', optionalAuthenticate, downloadFile);
router.get('/files/view/:uuid', optionalAuthenticate, viewFile);

// 4. Delete route
router.delete('/files/:uuid', authenticate, deleteFile);

// 5. Dynamic route LAST (VERY IMPORTANT)
router.get('/files/:uuid', optionalAuthenticate, getFileInfo);



export default router;