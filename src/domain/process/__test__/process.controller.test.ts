import { Request, Response, NextFunction } from 'express';
import { processController } from '../controller/process.controller';
import { Any } from '../../../global';
import { AppError } from '../../../lib/error-handling/AppError';

jest.mock('../../../datasource', () => ({
  Postgres: {
    dataSource: {
      transaction: jest.fn().mockImplementation(async (cb: Any) => {
        // Simulate the real transaction: call cb with a mock transaction object, return its result
        return cb({});
      })
    }
  }
}));
// 👇 Mock before importing the controller

const mockGetAll = jest.fn();
const mockGetById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock('../service/process.service', () => {
  return {
    processService: jest.fn().mockImplementation(() => ({
      getAll: mockGetAll,
      getById: mockGetById,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete
    }))
  };
});

let req: Request;
let res: Response;
let next: NextFunction;
let controller: processController;

beforeEach(() => {
  req = {} as Request;
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;
  next = jest.fn();
  jest.clearAllMocks();
  controller = new processController();
});

describe('Process Controller', () => {
  describe('getAll', () => {
    beforeEach(() => {
      mockGetAll.mockClear();
    });
    it('Should return all processes without Any Query', async () => {
      const mockProcesses = [{ id: '1', name: 'Process 1' }];
      mockGetAll.mockResolvedValue(mockProcesses);
      await controller.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockProcesses);
    });

    it('Should return all processes with Query', async () => {
      const mockProcesses = [{ id: '1', name: 'Process 2' }];
      mockGetAll.mockResolvedValue(mockProcesses);
      req.query = { limit: '10', page: '1', search: 'Process 2' };
      await controller.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockProcesses);
    });

    it('Should throw error', async () => {
      const error = new AppError(500, 'Failed to get processes');
      mockGetAll.mockRejectedValue(error);
      req.query = { limit: '10', page: '1', search: 'Process 2' };
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalled();
      const errArg = (next as jest.Mock).mock.calls[0][0];
      expect(errArg).toBeInstanceOf(AppError);
      expect(errArg.message).toBe('Failed to get processes');
    });
  });
  describe('getById', () => {
    beforeEach(() => {
      mockGetById.mockClear();
    });
    it('Should return process by id', async () => {
      const mockProcess = { id: '1', name: 'Process 1' };
      mockGetById.mockResolvedValue(mockProcess);
      req.params = { id: '1' };
      await controller.getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockProcess);
    });

    it('Should throw error', async () => {
      const error = new Error('Failed to get process by id');
      mockGetById.mockRejectedValue(error);
      req.params = { id: '1' };
      await controller.getById(req, res, next);
      expect(next).toHaveBeenCalled();
      const errArg = (next as jest.Mock).mock.calls[0][0];
      expect(errArg).toBeInstanceOf(Error);
      expect(errArg.message).toBe('Failed to get process by id');
    });
  });
  describe('create', () => {
    beforeEach(() => {
      mockCreate.mockClear();
    });
    it('Should create process', async () => {
      const mockProcess = { id: '1', name: 'Process 1', type: 'batch', description: 'Process 1' };
      mockCreate.mockImplementation(() => {
        return Promise.resolve(mockProcess);
      });
      req.body = { name: 'Process 1', type: 'batch', description: 'Process 1' };
      await controller.create(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockProcess);
    });

    it('Should throw error', async () => {
      const error = new Error('Failed to create process');
      mockCreate.mockRejectedValue(error);
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalled();
      const errArg = (next as jest.Mock).mock.calls[0][0];
      expect(errArg).toBeInstanceOf(Error);
      expect(errArg.message).toBe('Failed to create process');
    });
  });
  describe('update', () => {
    beforeEach(() => {
      mockUpdate.mockClear();
    });
    it('Should update process', async () => {
      const mockUpdated = { id: '1', name: 'Updated Process', type: 'batch', description: 'Updated Desc' };
      mockUpdate.mockResolvedValue(mockUpdated);
      req.params = { id: '1' };
      req.body = { name: 'Updated Process', type: 'batch', description: 'Updated Desc' };
      await controller.update(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockUpdated);
    });
    it('Should throw error', async () => {
      const error = new Error('Failed to update process');
      mockUpdate.mockRejectedValue(error);
      req.params = { id: '1' };
      req.body = { name: 'Updated Process', type: 'batch', description: 'Updated Desc' };
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalled();
      const errArg = (next as jest.Mock).mock.calls[0][0];
      expect(errArg).toBeInstanceOf(Error);
      expect(errArg.message).toBe('Failed to update process');
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockDelete.mockClear();
    });
    it('Should delete process', async () => {
      mockDelete.mockResolvedValue(undefined);
      req.params = { id: '1' };
      await controller.delete(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: 'Process deleted successfully' });
    });
    it('Should throw error', async () => {
      const error = new Error('Failed to delete process');
      mockDelete.mockRejectedValue(error);
      req.params = { id: '1' };
      await controller.delete(req, res, next);
      expect(next).toHaveBeenCalled();
      const errArg = (next as jest.Mock).mock.calls[0][0];
      expect(errArg).toBeInstanceOf(Error);
      expect(errArg.message).toBe('Failed to delete process');
    });
  });
});
