import { projectRepository } from '../repositories/projectRepository';
import { IProject } from '../models/Project';
import { TaskModel, TaskStatus } from '../models/Task';

export class ProjectService {
  createProject(payload: Partial<IProject>) {
    return projectRepository.create(payload);
  }

  listProjects() {
    return projectRepository.findAll();
  }

  getProject(id: string) {
    return projectRepository.findById(id);
  }

  updateProject(id: string, payload: Partial<IProject>) {
    return projectRepository.updateById(id, payload);
  }

  deleteProject(id: string) {
    return projectRepository.deleteById(id);
  }

  async getCompletionPercentage(projectId: string) {
    const [stats] = await TaskModel.aggregate<{
      total: number;
      completed: number;
    }>([
      { $match: { project: projectId } },
      {
        $group: {
          _id: '$project',
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0]
            }
          }
        }
      }
    ]);

    if (!stats || stats.total === 0) {
      return 0;
    }

    return Math.round((stats.completed / stats.total) * 100);
  }
}

export const projectService = new ProjectService();

