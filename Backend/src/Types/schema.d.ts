import type { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  displayName: string;
  email: string;
  password: string;
  emailVerification: Date | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile extends Document {
  _id: Types.ObjectId;
  fileName: string;
  originalName?: string;
  path: string;
  size: number;
  mimetype: string;
  uuid: string;
  whoUploaded: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  displayName: string;
  email: string;
  emailVerification?: Date | null;
}
