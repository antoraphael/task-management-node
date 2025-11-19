import { NextFunction, Request, Response } from 'express';
import { projectService } from '../services/projectService';
import { IProject } from '../models/Project';

class ProjectController {
  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as Partial<IProject>;
      const project = await projectService.createProject(payload);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  listProjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await projectService.listProjects();
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.getProject(req.params.id);
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as Partial<IProject>;
      const project = await projectService.updateProject(req.params.id, payload);
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await projectService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const percentage = await projectService.getCompletionPercentage(req.params.id);
      res.json({ projectId: req.params.id, completionPercentage: percentage });
    } catch (error) {
      next(error);
    }
  };
}

export const projectController = new ProjectController();

