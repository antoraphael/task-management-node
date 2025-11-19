import { NextFunction, Request, Response } from 'express';
import { taskService } from '../services/taskService';
import { TaskStatus, ITask } from '../models/Task';

class TaskController {
  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as Partial<ITask>;
      const task = await taskService.createTask(payload);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  listTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query.project ? { project: req.query.project } : {};
      const tasks = await taskService.listTasks(filter);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.getTask(req.params.id);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as Partial<ITask>;
      const task = await taskService.updateTask(req.params.id, payload);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  assignTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { assigneeId } = req.body as { assigneeId: string };
      const task = await taskService.assignTask(req.params.id, assigneeId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body as { status: TaskStatus };
      const task = await taskService.updateStatus(req.params.id, status);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  logTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hours, note, loggedBy } = req.body as { hours: number; note?: string; loggedBy?: string };
      const task = await taskService.logTime(req.params.id, hours, note, loggedBy);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();

