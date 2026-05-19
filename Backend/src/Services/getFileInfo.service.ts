// Backend/src/Services/getFileInfo.service.ts
import { File } from '../Models/file.schema.ts';
import { NotFoundError } from '../Utils/errors/httpErrors.ts';
import type { IFile } from '../Types/schema.d.ts';
import type mongoose from 'mongoose';

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

// Function to see Pagination
export interface PaginatedFileResponse {
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

//Pagination Option type
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc'; // here asc means old one is beginning and desc means new one in in beginning
  search?: string;
  userID?: string;
}

// get Patination
export async function getPaginatedFilesServices(
  options: PaginationOptions,
): Promise<PaginatedFileResponse> {
  // Default values
  const page =
    options.page && options.page > 0 ? options.page : 1;

  const limit =
    options.limit &&
    options.limit > 0 &&
    options.limit <= 100
      ? options.limit
      : 10;

  const skip = (page - 1) * limit;

  const allowedSortFields = [
    'createdAt',
    'fileName',
    'originalName',
    'size',
    'mimetype',
  ];

  const sortField = allowedSortFields.includes(
    options.sortBy || '',
  )
    ? (options.sortBy as string)
    : 'createdAt';

  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

  const sortOptions: Record<string, 1 | -1> = {
    [sortField]: sortOrder,
  };

  // Create query
  const query: mongoose.FilterQuery<IFile> = {};

  // Filter by user
  if (options.userID) {
    query.whoUploaded = options.userID;
  }

  // Search by file name or original name
  if (options.search && options.search.trim() !== '') {
    const searchRegex = new RegExp(
      options.search.trim(),
      'i',
    );

    query.$or = [
      { fileName: searchRegex },
      { originalName: searchRegex },
    ];
  }

  // Fetch total count and paginated files
  const [totalFiles, files] = await Promise.all([
    File.countDocuments(query),
    File.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  // Pagination metadata
  const totalPages = Math.max(
    1,
    Math.ceil(totalFiles / limit),
  );

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Format files
  const formattedFiles: FileInfoResponse[] =
    files.map((file) => ({
      fileName: file.fileName,
      originalName:
        file.originalName || file.fileName,
      size: file.size,
      sizeInMB:
        (file.size / (1024 * 1024)).toFixed(2) +
        ' MB',
      mimetype:
        file.mimetype ||
        'application/octet-stream',
      uuid: file.uuid,
      uploadedAt: file.createdAt,
      downloadUrl:
        `/api/v1/files/download/${file.uuid}`,
      viewUrl:
        `/api/v1/files/view/${file.uuid}`,
    }));

  return {
    files: formattedFiles,
    pagination: {
      currentPage: page,
      totalPages,
      totalFiles,
      limit,
      hasNextPage,
      hasPrevPage,
    },
  };
}