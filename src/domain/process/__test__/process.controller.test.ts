import processController from '../controller/process.controller';
import { AppError } from '../../../lib/error-handling/AppError';
import { Request, Response, NextFunction } from 'express';
import { Iprocess } from '../process.types';

// Mock the entire processService module
jest.mock('../service/process.service', () => ({
  processService: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([{ id: '1', name: 'process 1' }] as Iprocess[]),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }))
}));

// Get the mocked service instance
const mockProcessService = new (jest.requireMock('../service/process.service').processService)();

let req: Request;
let res: Response;
let next: NextFunction;

beforeEach(() => {
  req = {} as Request;
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;
  next = jest.fn();

  // Clear all mocks before each test
  jest.clearAllMocks();
});

describe('processController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAll', () => {
    it('should return all processes', async () => {
      const processes = [{ id: '1', name: 'process 1' } as Iprocess, { id: '2', name: 'process 2' } as Iprocess];

      mockProcessService.getAll.mockResolvedValue(processes);

      await processController.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(processes);
    });

    it('should throw error if getAll throws error', async () => {
      const error = new AppError(500, 'Error');

      mockProcessService.getAll.mockRejectedValue(error);

      await processController.getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should return process by id', async () => {
      const process = { id: '1', name: 'process 1' } as Iprocess;

      mockProcessService.getById.mockResolvedValue(process);

      req.params = { id: '1' };

      await processController.getById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(process);
    });

    it('should throw error if getById throws error', async () => {
      const error = new AppError(500, 'Error');

      mockProcessService.getById.mockRejectedValue(error);

      req.params = { id: '1' };

      await processController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should throw error if id is not provided', async () => {
      const error = new AppError(400, 'id is required');

      req.params = {};

      await processController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('should create process', async () => {
      const process = { name: 'process 1' } as Iprocess;

      mockProcessService.create.mockResolvedValue({ id: '1', ...process });

      req.body = process;

      await processController.create(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ id: '1', ...process });
    });

    it('should throw error if create throws error', async () => {
      const error = new AppError(500, 'Error');

      mockProcessService.create.mockRejectedValue(error);

      req.body = { name: 'process 1' } as Iprocess;

      await processController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should throw error if name is not provided', async () => {
      const error = new AppError(400, 'name is required');

      req.body = {};

      await processController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update process', async () => {
      const process = { id: '1', name: 'process 1' } as Iprocess;

      mockProcessService.update.mockResolvedValue({ id: '1', ...process });

      req.params = { id: '1' };
      req.body = process;

      await processController.update(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ id: '1', ...process });
    });

    it('should throw error if update throws error', async () => {
      const error = new AppError(500, 'Error');

      mockProcessService.update.mockRejectedValue(error);

      req.params = { id: '1' };
      req.body = { name: 'process 1' } as Iprocess;

      await processController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should throw error if id is not provided', async () => {
      const error = new AppError(400, 'id is required');

      req.params = {};
      req.body = { name: 'process 1' } as Iprocess;

      await processController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should throw error if name is not provided', async () => {
      const error = new AppError(400, 'name is required');

      req.params = { id: '1' };
      req.body = {};

      await processController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete process', async () => {
      const process = { id: '1', name: 'process 1' } as Iprocess;

      mockProcessService.delete.mockResolvedValue({ id: '1', ...process });

      req.params = { id: '1' };

      await processController.delete(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ id: '1', ...process });
    });

    it('should throw error if delete throws error', async () => {
      const error = new AppError(500, 'Error');

      mockProcessService.delete.mockRejectedValue(error);

      req.params = { id: '1' };

      await processController.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should throw error if id is not provided', async () => {
      const error = new AppError(400, 'id is required');

      req.params = {};

      await processController.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
