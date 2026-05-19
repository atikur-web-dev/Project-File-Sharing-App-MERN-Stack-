
// Backend/src/Services/getFileInfo.service.ts
import { File } from '../Models/file.schema.ts';
import { NotFoundError } from '../Utils/errors/httpErrors.ts';
import type { IFile } from '../Types/schema.d.ts';
export interface FileInfoResponse {
  fileName: string;
  originalName: string;
  size: number;
  sizeInMB: string;
  mimetype: string;
  uuid: string;
  uploadedAt: Date;
  downloadUrl: string;
  viewUrl: string;
}

export async function getFileInfoService(
  uuid: string,
): Promise<FileInfoResponse> {
  const file = await File.findOne({ uuid }).lean();
  if (!file) {
    throw new NotFoundError(
      {},
      'File not found. The link may be invalid or expired.',
    );
  }

  const fileInfo: FileInfoResponse = {
    fileName: file.fileName,
    originalName: file.originalName || file.fileName,
    size: file.size,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    mimetype: file.mimetype || 'application/octet-stream',
    uuid: file.uuid,
    uploadedAt: file.createdAt,
    downloadUrl: `/api/v1/files/download/${file.uuid}`,
    viewUrl: `/api/v1/files/view/${file.uuid}`,
  };

  return fileInfo;
}

export async function getMultipleFilesInfoService(
  uuids: string[],
): Promise<FileInfoResponse[]> {
  const files = await File.find({ uuid: { $in: uuids } }).lean();
  return files.map((file) => ({
    fileName: file.fileName,
    originalName: file.originalName || file.fileName,
    size: file.size,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    mimetype: file.mimetype || 'application/octet-stream',
    uuid: file.uuid,
    uploadedAt: file.createdAt,
    downloadUrl: `/api/v1/files/download/${file.uuid}`,
    viewUrl: `/api/v1/files/view/${file.uuid}`,
  }));
}
