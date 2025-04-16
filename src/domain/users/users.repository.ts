import { Iusers } from './model/users.model';

export class usersRepository {
  async findAll(): Promise<Iusers[]> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<Iusers | null> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async create(data: Iusers): Promise<Iusers> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async update(id: string, data: Partial<Iusers>): Promise<Iusers> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // Implement database query logic
    throw new Error('Not implemented');
  }
}