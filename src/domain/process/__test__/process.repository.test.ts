import { processRepository } from '../repository/process.repository';
import { Process } from '../model/process.model';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

describe('processRepository', () => {
  let repository: processRepository;
  let transaction: EntityManager;

  beforeEach(() => {
    repository = new processRepository();
    transaction = {
      getRepository: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnThis(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }),
    } as any;
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all processes with pagination and search', async () => {
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue([{ id: '1', name: 'Test' }]),
      } as unknown as SelectQueryBuilder<Process>;
      jest.spyOn(Process, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);
      // Mock searchQuery and pagination to return the same builder
      jest.mock('../../../lib/query/search', () => ({
        searchQuery: jest.fn((_, qb) => qb),
      }));
      jest.mock('../../../lib/query/pagination', () => ({
        pagination: jest.fn((_, qb) => qb),
      }));
      const result = await repository.findAll({ limit: 10, page: 1, search: 'Test' });
      expect(result).toEqual([{ id: '1', name: 'Test' }]);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return process by id', async () => {
      jest.spyOn(Process, 'findOne').mockResolvedValue({ id: '1', name: 'Test' } as Process);
      const result = await repository.findById('1');
      expect(result).toEqual({ id: '1', name: 'Test' });
    });
  });

  describe('create', () => {
    it('should create and save process', async () => {
      const mockSave = jest.fn().mockResolvedValue({ id: '1', name: 'Created' });
      transaction.getRepository = jest.fn().mockReturnValue({
        create: jest.fn().mockReturnThis(),
        save: mockSave,
      });
      const result = await repository.create({ name: 'Created' } as any, transaction);
      expect(result).toEqual({ id: '1', name: 'Created' });
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update process and return updated entity', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(undefined);
      const mockFindById = jest.spyOn(repository, 'findById').mockResolvedValue({ id: '1', name: 'Updated' } as any);
      transaction.getRepository = jest.fn().mockReturnValue({
        update: mockUpdate,
      });
      const result = await repository.update('1', { name: 'Updated' }, transaction);
      expect(mockUpdate).toHaveBeenCalledWith('1', { name: 'Updated' });
      expect(mockFindById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', name: 'Updated' });
    });
  });

  describe('delete', () => {
    it('should delete process by id', async () => {
      const mockDelete = jest.fn().mockResolvedValue(undefined);
      transaction.getRepository = jest.fn().mockReturnValue({
        delete: mockDelete,
      });
      await repository.delete('1', transaction);
      expect(mockDelete).toHaveBeenCalledWith('1');
    });
  });
});
