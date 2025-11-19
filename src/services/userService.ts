import { userRepository } from '../repositories/userRepository';
import { IUser } from '../models/User';

export class UserService {
  createUser(payload: Partial<IUser>) {
    return userRepository.create(payload);
  }

  listUsers() {
    return userRepository.findAll();
  }

  getUser(id: string) {
    return userRepository.findById(id);
  }

  getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }
}

export const userService = new UserService();

