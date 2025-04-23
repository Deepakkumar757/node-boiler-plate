import { usersRepository } from '../repository/users.repository';
import { getAllUserQuery, Tusers } from '../user.types';
import { columnsWithAliases } from '@src/lib/query';

export class usersService {
  private repository: usersRepository;

  constructor() {
    this.repository = new usersRepository();
  }

  async getAll(query: getAllUserQuery) {
    const { limit, page, search, asOption } = query;
    const columns = asOption
      ? columnsWithAliases<Tusers>(['id', 'name'], { id: 'value', name: 'label' }, 'process')
      : columnsWithAliases<Tusers>(['id', 'name', 'createdAt', 'email', 'userName'], {}, 'process');
    return this.repository.findAll({
      limit,
      page,
      search,
      columns
    });
  }

  // async getById(id: string) {
  //   const item = await this.repository.findById(id);
  //   if (!item) {
  //     throw new AppError(404, 'users not found');
  //   }
  //   return item;
  // }

  // async create(data: Users) {
  //   try {
  //     return await this.repository.create(data);
  //   } catch (error) {
  //     throw new AppError(400, 'Failed to create users', { error: (error as Error).message });
  //   }
  // }

  // async update(id: string, data: Partial<Users>) {
  //   const item = await this.repository.findById(id);
  //   if (!item) {
  //     throw new AppError(404, 'users not found');
  //   }
  //   try {
  //     return await this.repository.update(id, data);
  //   } catch (error) {
  //     throw new AppError(400, 'Failed to update users', { error: (error as Error).message });
  //   }
  // }

  // async delete(id: string) {
  //   const item = await this.repository.findById(id);
  //   if (!item) {
  //     throw new AppError(404, 'users not found');
  //   }
  //   try {
  //     await this.repository.delete(id);
  //     return true;
  //   } catch (error) {
  //     throw new AppError(400, 'Failed to delete users', { error: (error as Error).message });
  //   }
  // }
}
