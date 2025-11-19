import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

router.get('/team-productivity', analyticsController.teamProductivity);
router.get('/project-completion', analyticsController.projectCompletion);
router.get('/average-time-by-priority', analyticsController.averageTimeByPriority);
router.get('/overdue-tasks', analyticsController.overdueTasks);
router.get('/user-workload', analyticsController.workloadDistribution);
router.get('/bottlenecks', analyticsController.bottlenecks);
router.get('/estimation-accuracy', analyticsController.estimationAccuracy);
router.get('/project/:projectId/estimation-insights', analyticsController.estimationInsightsByProject);

export default router;

