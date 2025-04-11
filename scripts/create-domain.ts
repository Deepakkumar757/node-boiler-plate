#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';

/* eslint-disable no-console */

const createDomainStructure = (domainName: string) => {
  const basePath = path.join(process.cwd(), 'src', 'domain', domainName);
  const modelName = domainName;

  // Create domain directory
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Create directories that need subdirectories
  const directoriesWithSubdirs = ['model', 'validation'];
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
import { ${modelName}Controller } from './${modelName}.controller';
import { validate } from './validation/${modelName}.validation';

const router = express.Router();
const controller = new ${modelName}Controller();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate, controller.create);
router.put('/:id', validate, controller.update);
router.delete('/:id', controller.delete);

export default router;`
    },
    {
      name: `${modelName}.controller.ts`,
      path: basePath,
      template: `import { Request, Response } from 'express';
import { ${modelName}Service } from './${modelName}.service';
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
      name: `${modelName}.service.ts`,
      path: basePath,
      template: `import { ${modelName}Repository } from './${modelName}.repository';
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
      path: basePath,
      template: `import { I${modelName} } from './model/${modelName}.model';

export class ${modelName}Repository {
  async findAll(): Promise<I${modelName}[]> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<I${modelName} | null> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async create(data: I${modelName}): Promise<I${modelName}> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async update(id: string, data: Partial<I${modelName}>): Promise<I${modelName}> {
    // Implement database query logic
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // Implement database query logic
    throw new Error('Not implemented');
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
      template: `export interface I${modelName} {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Add your model properties here
}

export class ${modelName} implements I${modelName} {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: I${modelName}) {
    Object.assign(this, data);
  }
}`
    },
    {
      name: `${modelName}.validation.ts`,
      path: path.join(basePath, 'validation'),
      template: `import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../lib/error-handling/AppError';

const ${modelName}Schema = z.object({
  // Add your validation schema here
});

export const validate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ${modelName}Schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(error);
    } else {
      next(new AppError(400, 'Validation Error', { error: (error as Error).message }));
    }
  }
};`
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
