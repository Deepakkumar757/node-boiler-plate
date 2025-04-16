import { processService } from '../service/process.service';
import { asyncHandler } from '../../../lib/error-handling/error';
import { IprocessController } from '../process.types';
import { Postgres } from '../../../datasource';

export class processController {
  private processService: processService;

  constructor() {
    this.processService = new processService();
  }

  getAll = asyncHandler<IprocessController['getAll']>(async (req, res) => {
    const items = await this.processService.getAll(req.query);
    res.json(items);
    return;
  });

  getById = asyncHandler<IprocessController['getById']>(async (req, res) => {
    const item = await this.processService.getById(req.params.id);
    res.json(item);
    return;
  });

  create = asyncHandler<IprocessController['create']>(async (req, res) => {
    await Postgres.dataSource.transaction(async (transaction) => {
      const item = await this.processService.create(req.body, transaction);
      res.json(item);
      return;
    });
  });

  update = asyncHandler<IprocessController['update']>(async (req, res) => {
    await Postgres.dataSource.transaction(async (transaction) => {
      const item = await this.processService.update(req.params.id, req.body, transaction);
      res.json(item);
      return;
    });
  });

  delete = asyncHandler<IprocessController['delete']>(async (req, res) => {
    await Postgres.dataSource.transaction(async (transaction) => {
      await this.processService.delete(req.params.id, transaction);
      res.json({ message: 'Process deleted successfully' });
      return;
    });
  });
}
