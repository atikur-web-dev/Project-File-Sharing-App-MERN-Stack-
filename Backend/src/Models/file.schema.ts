import mongoose, { Schema, model } from "mongoose";
import type { IFile } from "../Types/schema.d.ts";

const fileSchema = new Schema<IFile>(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    path: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
    },
    mimetype: {
      type: String,
      trim: true,
    },
    uuid: {
      type: String,
      required: [true, "UUID is required"],
      unique: true, 
      trim: true,
    },
    whoUploaded: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ uuid: 1 });
fileSchema.index({ whoUploaded: 1 });


export const File = mongoose.models.File || model<IFile>("File", fileSchema);