import { searchQuery, pagination } from '@src/lib/query';
import { Users } from '../model/users.model';
import { type TUserRepository as TUR } from '../user.types';

export class usersRepository {
  async findAll(args: TUR['getAll']): Promise<Users[]> {
    const { page, limit, search, columns } = args;
    let query = Users.createQueryBuilder('process');
    query = searchQuery<Users>({ columns: ['name'], value: search }, query);
    query = pagination({ limit, page }, query);
    query.select(columns);
    return query.getRawMany();
  }

  // async findById(id: string): Promise<Users | null> {
  //   // Implement database query logic
  //   throw new Error('Not implemented');
  // }

  // async create(data: Users): Promise<Users> {
  //   // Implement database query logic
  //   throw new Error('Not implemented');
  // }

  // async update(id: string, data: Partial<Users>): Promise<Users> {
  //   // Implement database query logic
  //   throw new Error('Not implemented');
  // }

  // async delete(id: string): Promise<void> {
  //   // Implement database query logic
  //   throw new Error('Not implemented');
  // }
}
