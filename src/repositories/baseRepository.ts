import { FilterQuery, Model, UpdateQuery, PipelineStage } from 'mongoose';

export class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  create(payload: Partial<T>): Promise<T> {
    return this.model.create(payload);
  }

  findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  updateById(id: string, payload: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  aggregate<R = T>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate<R>(pipeline).exec();
  }
}

