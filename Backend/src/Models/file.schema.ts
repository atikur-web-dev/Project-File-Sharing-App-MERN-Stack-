import mongoose, { Schema, model } from 'mongoose';
import type { IFile } from '../Types/schema.d.ts';

const fileSchema = new Schema<IFile>(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimetype: {
      type: String,
      trim: true,
    },
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
      unique: true,
      trim: true,
    },
    whoUploaded: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

fileSchema.index({ uuid: 1 });
fileSchema.index({ whoUploaded: 1 });
fileSchema.statics.findByUser = function (userID: string) {
  return this.find({ whoUploaded: userID }).sort({ createdAt: -1 });
};

// find user by UUID and check user (ownership verification)
fileSchema.statics.findByUuidAndUser = function (uuid: string, user?: string) {
  const query: any = { uuid };
  if (user) {
    query.whoUploaded = user;
  }
  return this.findOne(query);
};

export const File = mongoose.models.File || model<IFile>('File', fileSchema);
