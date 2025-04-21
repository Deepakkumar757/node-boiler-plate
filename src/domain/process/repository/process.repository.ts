// import { logger } from '../../../lib/logger';
import { Process } from '../model/process.model';
import { getAllProcessQuery, Iprocess } from '../process.types';
import { EntityManager } from 'typeorm';
import { searchQuery } from '../../../lib/query/search';
import { pagination } from '../../../lib/query/pagination';

export class processRepository {
  async findAll(params: getAllProcessQuery): Promise<Iprocess[]> {
    const { page, limit, search } = params;
    let query = Process.createQueryBuilder('process');
    query = searchQuery<Process>({ columns: ['name'], value: search }, query);
    query = pagination({ limit, page }, query);
    return query.getMany();
  }

  async findById(id: string): Promise<Iprocess | null> {
    return Process.findOne({ where: { id } });
  }

  async create(data: Iprocess, transaction: EntityManager): Promise<Iprocess> {
    return transaction.getRepository(Process).create(data).save();
  }

  async update(id: string, data: Partial<Iprocess>, transaction: EntityManager): Promise<Iprocess | null> {
    return transaction
      .getRepository(Process)
      .update(id, data)
      .then(() => this.findById(id));
  }

  async delete(id: string, transaction: EntityManager): Promise<void> {
    await transaction.getRepository(Process).delete(id);
  }
}
