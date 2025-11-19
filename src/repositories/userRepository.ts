import { BaseRepository } from './baseRepository';
import { IUser, UserModel } from '../models/User';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }
}

export const userRepository = new UserRepository();

