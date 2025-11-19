import { Router } from 'express';
import taskRoutes from './taskRoutes';
import projectRoutes from './projectRoutes';
import userRoutes from './userRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

