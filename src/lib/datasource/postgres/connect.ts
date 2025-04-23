import { DataSource } from 'typeorm';
import { dbConfig, initConfig } from '../../../config';
import path from 'path';
import { logger } from '../../logger';

class Postgres {
  dataSource: DataSource;
  ext: string;
  constructor() {
    this.ext = __filename.endsWith('.ts') ? 'ts' : 'js';
    this.dataSource = new DataSource({
      type: 'postgres',
      host: dbConfig.DB_HOST,
      port: dbConfig.DB_PORT,
      username: dbConfig.DB_USER,
      password: dbConfig.DB_PASSWORD,
      database: dbConfig.DB_NAME,
      schema: dbConfig.DB_SCHEMA,
      entities: [path.join(__dirname, `../../../domain/*/model/*.model.${this.ext}`)],
      migrations: [path.join(__dirname, `../../../../migrations/*.${this.ext}`)],
      // logging: true,
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
