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

// Pagination Options (API input)
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  userId?: string;
}

// Pagination Response (API output)
export interface PaginatedFilesResponse {
  files: FileInfoResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalFiles: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function getFileInfoService(
  uuid: string,
): Promise<FileInfoResponse> {
  const file = await File.findOne({ uuid }).lean();

  // file not found handling
  if (!file) {
    throw new NotFoundError(
      {},
      'File not found. The link may be invalid or expired.',
    );
  }

  // normalize response
  return {
    fileName: file.fileName,
    originalName: file.originalName || file.fileName,
    size: file.size,

    // convert bytes → MB (human readable)
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',

    mimetype: file.mimetype || 'application/octet-stream',
    uuid: file.uuid,
    uploadedAt: file.createdAt,

    // frontend download endpoint
    downloadUrl: `/api/v1/files/download/${file.uuid}`,

    // frontend preview endpoint
    viewUrl: `/api/v1/files/view/${file.uuid}`,
  };
}

export async function getMultipleFilesInfoService(
  uuids: string[],
): Promise<FileInfoResponse[]> {
  const files = await File.find({
    uuid: { $in: uuids },
  }).lean();

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

export async function getPaginatedFilesService(
  options: PaginationOptions,
): Promise<PaginatedFilesResponse> {
  // default page
  const page = options.page && options.page > 0 ? options.page : 1;

  // limit safety (max 100)
  const limit =
    options.limit && options.limit > 0 && options.limit <= 100
      ? options.limit
      : 10;

  const skip = (page - 1) * limit;

  // sorting setup
  const sortField = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

  const sortOptions: Record<string, 1 | -1> = {
    [sortField]: sortOrder,
  };

  const query: Record<string, unknown> & {
    $or?: Array<Record<string, RegExp>>;
  } = {};

  // filter by user
  if (options.userId) {
    query.whoUploaded = options.userId;
  }

  // search filter (fileName / originalName)
  if (options.search && options.search.trim() !== '') {
    const searchRegex = new RegExp(options.search.trim(), 'i');

    query.$or = [{ fileName: searchRegex }, { originalName: searchRegex }];
  }

  // DB queries (count + data)
  const [totalFiles, files] = await Promise.all([
    File.countDocuments(query),
    File.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalFiles / limit));

  const formattedFiles: FileInfoResponse[] = files.map((file) => ({
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

  return {
    files: formattedFiles,
    pagination: {
      currentPage: page,
      totalPages,
      totalFiles,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

