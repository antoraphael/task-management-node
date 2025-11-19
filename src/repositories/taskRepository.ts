import { FilterQuery, UpdateQuery } from 'mongoose';
import { BaseRepository } from './baseRepository';
import { ITask, TaskModel } from '../models/Task';

class TaskRepository extends BaseRepository<ITask> {
  constructor() {
    super(TaskModel);
  }

  findWithRelations(filter: FilterQuery<ITask> = {}) {
    return TaskModel.find(filter).populate('assignee').populate('project').exec();
  }

  updateStatus(id: string, status: UpdateQuery<ITask>) {
    return TaskModel.findByIdAndUpdate(id, status, { new: true }).exec();
  }

  pushTimeEntry(id: string, timeEntry: ITask['timeEntries'][number]) {
    return TaskModel.findByIdAndUpdate(
      id,
      {
        $push: { timeEntries: timeEntry },
        $inc: { actualHours: timeEntry.hours }
      },
      { new: true }
    ).exec();
  }
}

export const taskRepository = new TaskRepository();

