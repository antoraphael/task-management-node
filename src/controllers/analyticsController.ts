import { NextFunction, Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { taskService } from '../services/taskService';

class AnalyticsController {
  teamProductivity = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await analyticsService.getTeamProductivityMetrics();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  };

  projectCompletion = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const completion = await analyticsService.getProjectCompletionRates();
      res.json(completion);
    } catch (error) {
      next(error);
    }
  };

  averageTimeByPriority = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await analyticsService.getAverageTimePerTaskByPriority();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  };

  overdueTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await analyticsService.getOverdueTasksReport();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  workloadDistribution = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const distribution = await analyticsService.getUserWorkloadDistribution();
      res.json(distribution);
    } catch (error) {
      next(error);
    }
  };

  bottlenecks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hours = req.query.thresholdHours ? Number(req.query.thresholdHours) : 72;
      const data = await analyticsService.getBottlenecks(hours);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  estimationAccuracy = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const insights = await analyticsService.getEstimationAccuracy();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  };

  estimationInsightsByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const insights = await taskService.getEstimationInsights(req.params.projectId);
      res.json(insights);
    } catch (error) {
      next(error);
    }
  };
}

export const analyticsController = new AnalyticsController();

