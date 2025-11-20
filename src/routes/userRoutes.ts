import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.get('/session', userController.userSession);
router.get('/:id', userController.getUser);

export default router;
