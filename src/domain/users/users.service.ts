import { usersRepository } from './users.repository';
import { Iusers } from './model/users.model';
import { AppError } from '../../lib/error-handling/AppError';

export class usersService {
  private repository: usersRepository;

  constructor() {
    this.repository = new usersRepository();
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, 'users not found');
    }
    return item;
  }

  async create(data: Iusers) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new AppError(400, 'Failed to create users', { error: (error as Error).message });
    }
  }

  async update(id: string, data: Partial<Iusers>) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, 'users not found');
    }
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new AppError(400, 'Failed to update users', { error: (error as Error).message });
    }
  }

  async delete(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, 'users not found');
    }
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      throw new AppError(400, 'Failed to delete users', { error: (error as Error).message });
    }
  }
}