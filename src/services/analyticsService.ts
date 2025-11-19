import { PipelineStage } from 'mongoose';
import { TaskModel, TaskStatus } from '../models/Task';
import { ProjectModel } from '../models/Project';
import { UserModel } from '../models/User';

export class AnalyticsService {
  getTeamProductivityMetrics() {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$assignee',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', TaskStatus.IN_PROGRESS] }, 1, 0] }
          },
          averageCycleTime: {
            $avg: {
              $cond: [
                { $ifNull: ['$completedAt', false] },
                { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 3600000] },
                null
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'assignee'
        }
      },
      { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          assignee: {
            _id: '$assignee._id',
            name: '$assignee.name',
            email: '$assignee.email'
          }
        }
      }
    ];

    return TaskModel.aggregate(pipeline);
  }

  getProjectCompletionRates() {
    return TaskModel.aggregate([
      {
        $group: {
          _id: '$project',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: ProjectModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'project'
        }
      },
      { $unwind: '$project' },
      {
        $project: {
          project: {
            _id: '$project._id',
            name: '$project.name'
          },
          completionRate: {
            $cond: [{ $eq: ['$total', 0] }, 0, { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }]
          }
        }
      }
    ]);
  }

  getAverageTimePerTaskByPriority() {
    return TaskModel.aggregate([
      {
        $match: {
          completedAt: { $ne: null }
        }
      },
      {
        $project: {
          priority: 1,
          cycleTimeHours: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 3600000] }
        }
      },
      {
        $group: {
          _id: '$priority',
          avgCycleTimeHours: { $avg: '$cycleTimeHours' },
          totalTasks: { $sum: 1 }
        }
      }
    ]);
  }

  getOverdueTasksReport() {
    return TaskModel.find({
      status: { $ne: TaskStatus.COMPLETED },
      dueDate: { $lt: new Date() }
    })
      .populate('assignee', 'name email')
      .populate('project', 'name')
      .exec();
  }

  getUserWorkloadDistribution() {
    return TaskModel.aggregate([
      {
        $group: {
          _id: '$assignee',
          tasks: {
            $push: {
              status: '$status',
              priority: '$priority'
            }
          },
          totalTasks: { $sum: 1 }
        }
      },
      {
        $addFields: {
          todo: {
            $size: {
              $filter: {
                input: '$tasks',
                cond: { $eq: ['$$this.status', TaskStatus.TODO] }
              }
            }
          },
          inProgress: {
            $size: {
              $filter: {
                input: '$tasks',
                cond: { $eq: ['$$this.status', TaskStatus.IN_PROGRESS] }
              }
            }
          },
          completed: {
            $size: {
              $filter: {
                input: '$tasks',
                cond: { $eq: ['$$this.status', TaskStatus.COMPLETED] }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'assignee'
        }
      },
      { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } }
    ]);
  }

  getBottlenecks(thresholdHours = 72) {
    const thresholdDate = new Date(Date.now() - thresholdHours * 3600000);

    return TaskModel.find({
      status: { $ne: TaskStatus.COMPLETED },
      updatedAt: { $lt: thresholdDate }
    })
      .select('title status assignee updatedAt')
      .populate('assignee', 'name email')
      .exec();
  }

  getEstimationAccuracy() {
    return TaskModel.aggregate([
      {
        $match: {
          estimatedHours: { $gt: 0 },
          actualHours: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$priority',
          averageEstimated: { $avg: '$estimatedHours' },
          averageActual: { $avg: '$actualHours' },
          accuracyPercent: {
            $avg: {
              $cond: [
                { $eq: ['$estimatedHours', 0] },
                null,
                {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $subtract: ['$estimatedHours', { $abs: { $subtract: ['$estimatedHours', '$actualHours'] } }]
                        },
                        '$estimatedHours'
                      ]
                    },
                    100
                  ]
                }
              ]
            }
          },
          samples: { $sum: 1 }
        }
      }
    ]);
  }
}

export const analyticsService = new AnalyticsService();

