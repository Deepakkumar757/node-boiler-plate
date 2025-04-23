// import { logger } from '../../../lib/logger';
import { Process } from '../model/process.model';
import { TprocessRepository, Tprocess } from '../process.types';
import { EntityManager } from 'typeorm';
import { searchQuery } from '../../../lib/query/search';
import { pagination } from '../../../lib/query/pagination';

export class processRepository {
  async findAll(params: TprocessRepository['getAll']): Promise<Tprocess[]> {
    const { page, limit, search, columns } = params;
    let query = Process.createQueryBuilder('process');
    query = searchQuery<Process>({ columns: ['name'], value: search }, query);
    query = pagination({ limit, page }, query);
    query.select(columns);
    return query.getRawMany();
  }

  async findById(id: string): Promise<Tprocess | null> {
    return Process.findOne({ where: { id } });
  }

  async create(data: Tprocess, transaction: EntityManager): Promise<Tprocess> {
    return transaction.getRepository(Process).create(data).save();
  }

  async update(id: string, data: Partial<Tprocess>, transaction: EntityManager): Promise<Tprocess | null> {
    return transaction
      .getRepository(Process)
      .update(id, data)
      .then(() => this.findById(id));
  }

  async delete(id: string, transaction: EntityManager): Promise<void> {
    await transaction.getRepository(Process).delete(id);
  }
}
