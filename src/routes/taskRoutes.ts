import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router = Router();

router.post('/', taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/assign', taskController.assignTask);
router.patch('/:id/status', taskController.updateStatus);
router.post('/:id/time-entries', taskController.logTime);

export default router;

