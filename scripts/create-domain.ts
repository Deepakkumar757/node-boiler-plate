#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';

/* eslint-disable no-console */

const createDomainStructure = (domainName: string) => {
  const capitalizedName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
  const basePath = path.join(process.cwd(), 'src', 'domain', domainName);
  const modelName = capitalizedName;

  // Create domain directory
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Create directories that need subdirectories
  const directoriesWithSubdirs = ['model', 'validation', 'controller', 'service', 'repository', '__tests__'];
  directoriesWithSubdirs.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Define all files to create
  const files = [
    {
      name: `${modelName}.router.ts`,
      path: basePath,
      template: `import express from 'express';
import { ${modelName}Controller } from './controller/${modelName}.controller';
import { validate, ${domainName}CreateDataSchema, ${domainName}UpdateDataSchema } from './validation/${modelName}.validation';

const router = express.Router();
const controller = new ${modelName}Controller();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate(${domainName}CreateDataSchema), controller.create);
router.put('/:id', validate(${domainName}UpdateDataSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;`
    },
    {
      name: `${modelName}.controller.ts`,
      path: path.join(basePath, 'controller'),
      template: `import { Request, Response } from 'express';
import { ${modelName}Service } from '../service/${modelName}.service';
import { asyncHandler } from '../../lib/error-handling/error';

export class ${modelName}Controller {
  private service: ${modelName}Service;

  constructor() {
    this.service = new ${modelName}Service();
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
}`
    },
    {
      name: `${modelName}.types.ts`,
      path: basePath,
      template: `import { ${modelName} } from './model/${modelName}.model';
import { Any, EntityType, Object } from '../../global';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  ${domainName}CreateDataSchema,
  ${domainName}DetailsFetchSchema,
  ${domainName}ListFetchSchema,
  ${domainName}RemoveSchema,
  ${domainName}UpdateDataSchema
} from './validation/${domainName}.validation';

export type I${modelName} = EntityType<${modelName}>;

export type getAll${modelName}Query = z.infer<(typeof ${domainName}ListFetchSchema)['query']>;
export type get${modelName}DetailsQuery = z.infer<(typeof ${domainName}DetailsFetchSchema)['params']>;
export type create${modelName}Body = z.infer<(typeof ${domainName}CreateDataSchema)['body']>;
export type update${modelName}Body = z.infer<(typeof ${domainName}UpdateDataSchema)['body']>;
export type remove${modelName}Body = z.infer<(typeof ${domainName}RemoveSchema)['params']>;

export type I${modelName}Controller = {
  getAll: (
    req: Request<Object, Object, unknown, getAll${modelName}Query, Record<string, Any>>,
    res: Response
  ) => Promise<void>;
  getById: (req: Request<Object, Object, get${modelName}DetailsQuery>, res: Response, next: NextFunction) => Promise<void>;
  create: (req: Request<Object, Object, create${modelName}Body>, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request<Object, Object, update${modelName}Body>, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: Request<Object, Object, remove${modelName}Body>, res: Response, next: NextFunction) => Promise<void>;
};`
    },
    {
      name: `${modelName}.service.ts`,
      path: path.join(basePath, 'service'),
      template: `import { ${modelName}Repository } from '../repository/${modelName}.repository';
import { I${modelName} } from './model/${modelName}.model';
import { AppError } from '../../lib/error-handling/AppError';

export class ${modelName}Service {
  private repository: ${modelName}Repository;

  constructor() {
    this.repository = new ${modelName}Repository();
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, '${modelName} not found');
    }
    return item;
  }

  async create(data: I${modelName}) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new AppError(400, 'Failed to create ${modelName}', { error: (error as Error).message });
    }
  }

  async update(id: string, data: Partial<I${modelName}>) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, '${modelName} not found');
    }
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new AppError(400, 'Failed to update ${modelName}', { error: (error as Error).message });
    }
  }

  async delete(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, '${modelName} not found');
    }
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      throw new AppError(400, 'Failed to delete ${modelName}', { error: (error as Error).message });
    }
  }
}`
    },
    {
      name: `${modelName}.repository.ts`,
      path: path.join(basePath, 'repository'),
      template: `import { Repository } from 'typeorm';
import { AppDataSource } from '../../../lib/typeorm';
import { ${modelName} } from '../model/${modelName}.model';

export class ${modelName}Repository {
  private repository: Repository<${modelName}>;

  constructor() {
    this.repository = AppDataSource.getRepository(${modelName});
  }

  async findAll(): Promise<${modelName}[]> {
    return this.repository.find({
      where: { isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
  }

  async findById(id: string): Promise<${modelName} | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
  }

  async create(data: Partial<${modelName}>): Promise<${modelName}> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<${modelName}>): Promise<${modelName}> {
    await this.repository.update(id, data);
    return this.findById(id) as Promise<${modelName}>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isDeleted: true });
  }
}`
    },
    {
      name: `${modelName}.swagger.ts`,
      path: basePath,
      template: `/**
 * @swagger
 * components:
 *   schemas:
 *     ${modelName}:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the ${modelName}
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the ${modelName} was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the ${modelName} was last updated
 *       example:
 *         id: "123"
 *         createdAt: "2025-04-11T06:04:03Z"
 *         updatedAt: "2025-04-11T06:04:03Z"
 * 
 * /api/v1/${domainName}:
 *   get:
 *     summary: Returns a list of ${modelName}s
 *     tags: [${modelName}]
 *     responses:
 *       200:
 *         description: The list of ${modelName}s
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/${modelName}'
 *   post:
 *     summary: Create a new ${modelName}
 *     tags: [${modelName}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${modelName}'
 *     responses:
 *       201:
 *         description: The created ${modelName}
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${modelName}'
 * 
 * /api/v1/${domainName}/{id}:
 *   get:
 *     summary: Get a ${modelName} by id
 *     tags: [${modelName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ${modelName} id
 *     responses:
 *       200:
 *         description: The ${modelName} details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${modelName}'
 *   put:
 *     summary: Update a ${modelName}
 *     tags: [${modelName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ${modelName} id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${modelName}'
 *     responses:
 *       200:
 *         description: The updated ${modelName}
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${modelName}'
 *   delete:
 *     summary: Delete a ${modelName}
 *     tags: [${modelName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ${modelName} id
 *     responses:
 *       204:
 *         description: ${modelName} deleted successfully
 */`
    },
    {
      name: `${modelName}.model.ts`,
      path: path.join(basePath, 'model'),
      template: `import { Entity, Column, PrimaryGeneratedColumn, Index, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../users/model/users.model';

@Index('${domainName}_pkey', ['id'], { unique: true })
@Index('idx_${domainName}_id', ['id'], {})
@Index('idx_${domainName}_isdeleted', ['isDeleted'], {})
@Entity('${domainName}')
export class ${modelName} extends BaseEntity {
  // Add your model properties here
}`
    },
    {
      name: `${modelName}.validation.ts`,
      path: path.join(basePath, 'validation'),
      template: `import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../lib/error-handling/AppError';

const ${domainName}CreateDataSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(255),
    createdBy: z.string().uuid()
  })
});

const ${domainName}UpdateDataSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(255).optional(),
    updatedBy: z.string().uuid()
  })
});

const ${domainName}DetailsFetchSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

const ${domainName}ListFetchSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});

const ${domainName}RemoveSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export {
  ${domainName}CreateDataSchema,
  ${domainName}UpdateDataSchema,
  ${domainName}DetailsFetchSchema,
  ${domainName}ListFetchSchema,
  ${domainName}RemoveSchema
};

export const validate = (schema: z.AnyZodObject) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(error);
    } else {
      next(new AppError(400, 'Validation Error', { error: (error as Error).message }));
    }
  }
};`
    },
    {
      name: `${modelName}.test.ts`,
      path: path.join(basePath, '__tests__'),
      template: `import { AppDataSource } from '../../../lib/typeorm';
import { ${modelName} } from '../model/${modelName}.model';
import { ${modelName}Repository } from '../repository/${modelName}.repository';
import { ${modelName}Service } from '../service/${modelName}.service';

describe('${modelName} Tests', () => {
  // Add your test cases here
});
`
    }
  ];

  // Create all files
  files.forEach(({ name, path: filePath, template }) => {
    const fullPath = path.join(filePath, name);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, template);
    }
  });

  console.log(`Domain "${domainName}" has been created successfully!`);
};

// Get command line arguments
const [, , domainName] = process.argv;

if (!domainName) {
  console.error('Please provide the domain name');
  console.log('Usage: npm run create-domain <domainName>');
  process.exit(1);
}

createDomainStructure(domainName);
