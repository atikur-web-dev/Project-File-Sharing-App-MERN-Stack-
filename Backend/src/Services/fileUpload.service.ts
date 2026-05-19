// Backend/src/Services/fileUpload.service.ts
import { v4 as uuidv4 } from 'uuid';
import { File } from '../Models/file.schema.ts';
import type { IFile } from '../Types/schema.d.ts';

interface UploadedFileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  size: number;
  mimetype: string;
  uuid: string;
  fileShareUrl: string;
  uploadedBy?: string;
}

export async function singleFileUploadService(
  file: UploadedFileData,
  user?: string
): Promise<FileUploadResponse> {
  const fileUuid = uuidv4();
  //save matadate in DB of file
  const savedFile = await File.create({
    fileName: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uuid: fileUuid,
    whoUploaded: user || null,
  });
  // Set user name by populate
  if(user){
    await savedFile.populate("whoUploaded", "displayName email")
  }

  return {
    fileName: savedFile.fileName,
    originalName: savedFile.originalName || file.originalname,
    size: savedFile.size,
    mimetype: savedFile.mimetype || file.mimetype,
    uuid: savedFile.uuid,
    fileShareUrl: `/files/${savedFile.uuid}`,
    uploadedBy: savedFile.whoUploaded?.toString(),
  };
}

export async function multipleFileUploadService(
  files: UploadedFileData[],
  user?: string
): Promise<FileUploadResponse[]> {
  const uploadPromises = files.map(async (file) => {
    const fileUuid = uuidv4();

    const savedFile = await File.create({
      fileName: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uuid: fileUuid,
      whoUploaded: user || null,
    });

    return {
      fileName: savedFile.fileName,
      originalName: savedFile.originalName || file.originalname,
      size: savedFile.size,
      mimetype: savedFile.mimetype || file.mimetype,
      uuid: savedFile.uuid,
      fileShareUrl: `/files/${savedFile.uuid}`,
      uploadedBy: savedFile.whoUploaded?.toString(),
    };
  });

  return await Promise.all(uploadPromises);
}
