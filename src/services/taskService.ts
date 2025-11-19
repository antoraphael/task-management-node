import { FilterQuery } from 'mongoose';
import { taskRepository } from '../repositories/taskRepository';
import { ITask, TaskStatus, TaskModel } from '../models/Task';
import { ApiError } from '../middleware/errorHandler';
import { socketServer } from '../socket/socketServer';

const STATUS_SEQUENCE = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];

export class TaskService {
  async createTask(payload: Partial<ITask>) {
    const task = await taskRepository.create(payload);
    socketServer.emit('task:created', task);
    return task;
  }

  listTasks(filter: FilterQuery<ITask> = {}) {
    return taskRepository.findWithRelations(filter);
  }

  getTask(id: string) {
    return taskRepository.findById(id);
  }

  async updateTask(id: string, payload: Partial<ITask>) {
    const task = await taskRepository.updateById(id, payload);
    if (task) {
      socketServer.emit('task:updated', task);
    }
    return task;
  }

  async deleteTask(id: string) {
    const deleted = await taskRepository.deleteById(id);
    if (deleted) {
      socketServer.emit('task:deleted', { taskId: id });
    }
    return deleted;
  }

  async assignTask(taskId: string, assigneeId: string) {
    const task = await taskRepository.updateById(taskId, { assignee: assigneeId });
    if (!task) {
      const error: ApiError = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    socketServer.emit('task:assigned', { taskId, assigneeId });
    return task;
  }

  async updateStatus(taskId: string, status: TaskStatus) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error: ApiError = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    this.assertValidTransition(task.status, status);

    task.status = status;
    if (status === TaskStatus.COMPLETED) {
      task.completedAt = new Date();
    }

    await task.save();
    socketServer.emit('task:statusChanged', { taskId, status });
    return task;
  }

  async logTime(taskId: string, hours: number, note?: string, loggedBy?: string) {
    if (hours <= 0) {
      const error: ApiError = new Error('Logged hours must be greater than zero');
      error.statusCode = 400;
      throw error;
    }

    const timeEntry = {
      hours,
      note,
      loggedBy,
      loggedAt: new Date()
    };

    const task = await taskRepository.pushTimeEntry(taskId, timeEntry);
    if (!task) {
      const error: ApiError = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    socketServer.emit('task:timeLogged', { taskId, ...timeEntry });
    return task;
  }

  async getEstimationInsights(projectId?: string) {
    const match: FilterQuery<ITask> = projectId ? { project: projectId } : {};

    return TaskModel.aggregate([
      { $match: { ...match, estimatedHours: { $gt: 0 }, actualHours: { $gt: 0 } } },
      {
        $project: {
          title: 1,
          delta: { $subtract: ['$actualHours', '$estimatedHours'] },
          estimatedHours: 1,
          actualHours: 1,
          priority: 1
        }
      },
      {
        $group: {
          _id: '$priority',
          averageDelta: { $avg: '$delta' },
          averageEstimated: { $avg: '$estimatedHours' },
          averageActual: { $avg: '$actualHours' },
          samples: { $sum: 1 }
        }
      }
    ]);
  }

  private assertValidTransition(current: TaskStatus, next: TaskStatus) {
    const currentIndex = STATUS_SEQUENCE.indexOf(current);
    const nextIndex = STATUS_SEQUENCE.indexOf(next);

    if (nextIndex === -1 || nextIndex < currentIndex) {
      const error: ApiError = new Error('Invalid status transition');
      error.statusCode = 400;
      throw error;
    }
  }
}

export const taskService = new TaskService();

