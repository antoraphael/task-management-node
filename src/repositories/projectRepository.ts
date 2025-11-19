import { BaseRepository } from './baseRepository';
import { IProject, ProjectModel } from '../models/Project';

class ProjectRepository extends BaseRepository<IProject> {
  constructor() {
    super(ProjectModel);
  }
}

export const projectRepository = new ProjectRepository();

