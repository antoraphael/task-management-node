import { Schema, model, Document, Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface TimeEntry {
  hours: number;
  note?: string;
  loggedBy?: Types.ObjectId;
  loggedAt: Date;
}

export interface ITask extends Document<Types.ObjectId> {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: Types.ObjectId;
  project?: Types.ObjectId;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  timeEntries: TimeEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const TimeEntrySchema = new Schema<TimeEntry>(
  {
    hours: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true },
    loggedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    loggedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
    },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    estimatedHours: { type: Number, min: 0 },
    actualHours: { type: Number, min: 0 },
    dueDate: { type: Date },
    completedAt: { type: Date },
    timeEntries: { type: [TimeEntrySchema], default: [] }
  },
  { timestamps: true }
);

TaskSchema.index({ status: 1, dueDate: 1 });
TaskSchema.index({ project: 1 });
TaskSchema.index({ assignee: 1, status: 1 });

export const TaskModel = model<ITask>('Task', TaskSchema);

