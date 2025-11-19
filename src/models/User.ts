import { Schema, model, Document, Types } from 'mongoose';

export enum UserRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

interface LoginOtp {
  codeHash: string;
  expiresAt: Date;
  attemptsRemaining: number;
  lastSentAt: Date;
}

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
  role: UserRole;
  loginOtp?: LoginOtp;
}

const LoginOtpSchema = new Schema<LoginOtp>(
  {
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attemptsRemaining: { type: Number, required: true },
    lastSentAt: { type: Date, required: true }
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER
    },
    loginOtp: { type: LoginOtpSchema }
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);

