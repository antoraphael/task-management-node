import { Router } from 'express';
import { projectController } from '../controllers/projectController';

const router = Router();

router.post('/', projectController.createProject);
router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/:id/completion', projectController.getCompletion);

export default router;

