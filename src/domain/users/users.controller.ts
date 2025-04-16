import { Request, Response } from 'express';
import { usersService } from './users.service';
import { asyncHandler } from '../../lib/error-handling/error';

export class usersController {
  private service: usersService;

  constructor() {
    this.service = new usersService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const items = await this.service.getAll();
    return res.json(items);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.getById(req.params.id);
    return res.json(item);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.create(req.body);
    return res.status(201).json(item);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.update(req.params.id, req.body);
    return res.json(item);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    return res.status(204).send();
  });
}