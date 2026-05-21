import fs from 'fs/promises';
import path from 'path';
import { File } from '../Models/file.schema.ts';
import { NotFoundError, ForbiddenError } from '../Utils/errors/httpErrors.ts';

export async function deleteFileService(uuid: string, userId?: string) {
  const file = await File.findOne({ uuid });
  if (!file) {
    throw new NotFoundError({}, 'File not found');
  }
  if (userId && file.whoUploaded?.toString() !== userId) {
    throw new ForbiddenError(
      {},
      "You don't have permission to delete this file",
    );
  }
  // Delete file form disk
  const uploadDir = path.resolve(process.cwd(), 'src', 'tmp', 'my-uploads');
  const filePath = path.join(uploadDir, file.fileName);
  try {
    await fs.unlink(filePath);
    console.log(`File delete from Disk: ${file.fileName}`);
  } catch (err) {
    console.log(`Could not delete file from disk : ${file.fileName}`, err);
  }
  // Delete from database
  await File.deleteOne({ uuid });
  return { deleted: true, uuid, fileName: file.originalName || file.fileName };
}
