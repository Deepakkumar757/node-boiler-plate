import { processService } from '../service/process.service';
import { asyncHandler } from '../../../lib/error-handling/error';
import { type TprocessController as TPC } from '../process.types';
import { Postgres } from '../../../lib/datasource';

export class processController {
  private processService: processService;

  constructor() {
    this.processService = new processService();
  }

  getAll = asyncHandler<TPC['getAll']>(async (req, res) => {
    const items = await this.processService.getAll(req.query);
    return res.json(items);
  });

  getById = asyncHandler<TPC['getById']>(async (req, res) => {
    const item = await this.processService.getById(req.params.id);
    return res.json(item);
  });

  create = asyncHandler<TPC['create']>(async (req, res) => {
    return await Postgres.dataSource.transaction(async (transaction) => {
      return res.json(await this.processService.create(req.body, transaction));
    });
  });

  update = asyncHandler<TPC['update']>(async (req, res) => {
    return await Postgres.dataSource.transaction(async (transaction) => {
      return res.json(await this.processService.update(req.params.id, req.body, transaction));
    });
  });

  delete = asyncHandler<TPC['delete']>(async (req, res) => {
    await Postgres.dataSource.transaction(async (transaction) => {
      await this.processService.delete(req.params.id, transaction);
    });
    return res.json({ message: 'Process deleted successfully' });
  });
}

// For testing, do not export a singleton instance.
export default processController;
