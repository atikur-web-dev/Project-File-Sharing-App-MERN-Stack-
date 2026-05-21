// Backend/src/Utils/cleanupOrphanFiles.ts
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { File } from '../Models/file.schema.ts';

async function cleanupOrphanFiles() {
  console.log('Starting orphan file cleanUp.....');
  const uploadDir = path.resolve(process.cwd(), 'src', 'tmp', 'my-uploads');
  try {
    // all files in Disk
    const diskFiles = await fs.readdir(uploadDir);
    // all files in BD
    const dbFiles = await File.find({}, { fileName: 1 }).lean();
    const dbFileNames = new Set(dbFiles.map((f) => f.fileName));
    // Delete those files that are in disk but not in the DB
    let deleteCount = 0;
    for (const fileName of diskFiles) {
      if (!dbFileNames.has(fileName)) {
        try {
          await fs.unlink(path.join(uploadDir, fileName));
          console.log(`Deleted orphan : ${fileName}`);
        } catch (err) {
          console.log(`Failed to delete: ${fileName}`, err);
        }
      }
    }
    console.log(`Cleanup completed. Deleted ${deleteCount} orphan file(s).`);
  } catch (err) {
    console.log('Cleanup failed', err);
  }
}

export function startCleanupCron() {
  cron.schedule('0 3 * * *', async () => {
    await cleanupOrphanFiles();
  });
  console.log('Cleanup cron jon scheduled (Daily at 3:00 AM');
}
