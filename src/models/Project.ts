import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document<Types.ObjectId> {
  name: string;
  description?: string;
  teamMembers: Types.ObjectId[];
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export const ProjectModel = model<IProject>('Project', ProjectSchema);

