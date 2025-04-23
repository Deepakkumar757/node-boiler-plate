import { processService } from '../service/process.service';
import { AppError } from '../../../lib/error-handling/AppError';
import { Any } from '../../../global';

const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock('../repository/process.repository', () => {
  return {
    processRepository: jest.fn().mockImplementation(() => ({
      findAll: mockFindAll,
      findById: mockFindById,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete
    }))
  };
});

describe('processService', () => {
  let service: processService;
  let transaction: Any;

  beforeEach(() => {
    service = new processService();
    transaction = {};
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all processes', async () => {
      const mockProcesses = [{ id: '1', name: 'Process 1' }];
      mockFindAll.mockResolvedValue(mockProcesses);
      const result = await service.getAll({ limit: 10, page: 1, search: '' });
      expect(result).toEqual(mockProcesses);
    });
  });

  describe('getById', () => {
    it('should return process by id', async () => {
      const mockProcess = { id: '1', name: 'Process 1' };
      mockFindById.mockResolvedValue(mockProcess);
      const result = await service.getById('1');
      expect(result).toEqual(mockProcess);
    });
    it('should throw AppError if not found', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(service.getById('1')).rejects.toThrow(AppError);
      await expect(service.getById('1')).rejects.toThrow('process not found');
    });
  });

  describe('create', () => {
    it('should create process', async () => {
      const data = { name: 'Process 1' };
      const created = { id: '1', name: 'Process 1' };
      mockCreate.mockResolvedValue(created);
      const result = await service.create(data as Any, transaction);
      expect(result).toEqual(created);
    });
    it('should throw AppError if create fails', async () => {
      mockCreate.mockRejectedValue(new Error('fail'));
      await expect(service.create({ name: 'fail' } as Any, transaction)).rejects.toThrow(AppError);
      await expect(service.create({ name: 'fail' } as Any, transaction)).rejects.toThrow('Failed to create process');
    });
  });

  describe('update', () => {
    it('should update process', async () => {
      const updated = { id: '1', name: 'Updated' };
      mockFindById.mockResolvedValue(updated);
      mockUpdate.mockResolvedValue(updated);
      const result = await service.update('1', { name: 'Updated' }, transaction);
      expect(result).toEqual(updated);
    });
    it('should throw AppError if not found', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(service.update('1', { name: 'Updated' }, transaction)).rejects.toThrow(AppError);
      await expect(service.update('1', { name: 'Updated' }, transaction)).rejects.toThrow('process not found');
    });
    it('should throw AppError if update fails', async () => {
      mockFindById.mockResolvedValue({ id: '1', name: 'Old' });
      mockUpdate.mockRejectedValue(new Error('fail'));
      await expect(service.update('1', { name: 'fail' }, transaction)).rejects.toThrow(AppError);
      await expect(service.update('1', { name: 'fail' }, transaction)).rejects.toThrow('Failed to update process');
    });
  });

  describe('delete', () => {
    it('should delete process', async () => {
      mockFindById.mockResolvedValue({ id: '1', name: 'ToDelete' });
      mockDelete.mockResolvedValue(undefined);
      const result = await service.delete('1', transaction);
      expect(result).toBe(true);
    });
    it('should throw AppError if not found', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(service.delete('1', transaction)).rejects.toThrow(AppError);
      await expect(service.delete('1', transaction)).rejects.toThrow('process not found');
    });
    it('should throw AppError if delete fails', async () => {
      mockFindById.mockResolvedValue({ id: '1', name: 'ToDelete' });
      mockDelete.mockRejectedValue(new Error('fail'));
      await expect(service.delete('1', transaction)).rejects.toThrow(AppError);
      await expect(service.delete('1', transaction)).rejects.toThrow('Failed to delete process');
    });
  });
});
