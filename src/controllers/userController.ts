import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/userService';
import { IUser } from '../models/User';

class UserController {
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as Partial<IUser>;
      const user = await userService.createUser(payload);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  userSession = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        message: 'Session established',
        user: { name: req?.user?.name, email: req?.user?.email, role: req?.user?.role }
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
