import { DataSource } from 'typeorm';
import { dbConfig, initConfig } from '../../config';
import path from 'path';
import { logger } from '../../lib/logger';

class Postgres {
  dataSource: DataSource;
  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: dbConfig.DB_HOST,
      port: dbConfig.DB_PORT,
      username: dbConfig.DB_USER,
      password: dbConfig.DB_PASSWORD,
      database: dbConfig.DB_NAME,
      schema: dbConfig.DB_SCHEMA,
      entities: [path.join(__dirname, '../../domain/*/model/*.model.ts')],
      migrations: [path.join(__dirname, '../../../migrations/*.ts')],
      logger: 'advanced-console',
      migrationsRun: initConfig.INITIALIZATION_MIGRATION
    });
  }

  async connect() {
    try {
      await this.dataSource.initialize();
      logger.info('Database connection established');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    await this.dataSource.destroy();
    logger.info('Database connection closed');
  }
}

export default new Postgres();
