import { processRepository } from '../repository/process.repository';
import { AppError } from '../../../lib/error-handling/AppError';
import { getAllProcessQuery, Iprocess } from '../process.types';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { adminId } from '../../../config';

export class processService {
  private repository: processRepository;

  constructor() {
    this.repository = new processRepository();
  }

  async getAll(query: getAllProcessQuery) {
    const { limit, page, search } = query;
    return this.repository.findAll({ limit, page, search });
  }

  async getById(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, 'process not found');
    }
    return item;
  }

  async create(data: Iprocess, transaction: EntityManager) {
    try {
      const id = uuid();
      data = { ...data, createdBy: adminId, updatedBy: adminId };
      return await this.repository.create({ ...data, id }, transaction);
    } catch (error) {
      throw new AppError(400, 'Failed to create process', { error: (error as Error).message });
    }
  }

  async update(id: string, data: Partial<Iprocess>, transaction: EntityManager) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, 'process not found');
    }
    try {
      return await this.repository.update(id, data, transaction);
    } catch (error) {
      throw new AppError(400, 'Failed to update process', { error: (error as Error).message });
    }
  }

  async delete(id: string, transaction: EntityManager) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, 'process not found');
    }
    try {
      await this.repository.delete(id, transaction);
      return true;
    } catch (error) {
      throw new AppError(400, 'Failed to delete process', { error: (error as Error).message });
    }
  }
}
