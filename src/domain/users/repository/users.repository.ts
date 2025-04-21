import { Users } from '../model/users.model';

export class usersRepository {
  async findAll(): Promise<Users[]> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<Users | null> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async create(data: Users): Promise<Users> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async update(id: string, data: Partial<Users>): Promise<Users> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // Implement database query logic
    throw new Error('Not implemented');
  }
}
